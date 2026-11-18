#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build-exercicios.py — extrai os exercícios dos PDFs de apoio para um dataset único.

USO
    python3 scripts/build-exercicios.py PASTA_DOS_PDFS [-o PASTA_SAIDA]

PRÉ-REQUISITOS (nada disso está no repositório)
    PDFs esperados na pasta de entrada:
      100_Exercicios_Logica.pdf
      GABARITO_100_EXERCICIOS_LOGICA_PROGRAMACAO_A4.pdf
      30 Exercícios Extras de Condicionais.pdf
      30 Exercícios Extras de Estruturas de Repetição.pdf

    Ferramentas de sistema:
      poppler-utils   (pdftotext, pdftoppm)
      tesseract-ocr   + tesseract-ocr-por

COMO FUNCIONA
    O gabarito tem camada de texto e é lido com pdftotext — é a fonte de verdade
    para número, título, módulo e solução em Portugol.

    Os outros PDFs são imagem: são rasterizados a 150 dpi e passados pelo tesseract.
    O OCR corrompe números com frequência ("EXERCÍCIO | AQ" em vez de 40), então os
    enunciados são casados com o gabarito PELO TÍTULO, usando a ordem crescente das
    páginas como restrição. O número lido pelo OCR serve apenas de validação.

SAÍDA
    dataset.json         um registro por exercício
    BANCO_EXERCICIOS.md  versão legível, para consulta durante a conversão

LIMITAÇÕES CONHECIDAS
    Exercícios 11, 12 e 13 não existem no material de origem.
    Fórmulas matemáticas saem com ruído de OCR — confira antes de usar.
"""
import argparse, difflib, json, re, shutil, subprocess, sys, tempfile, unicodedata
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

PDFS = {
    'enunciados': '100_Exercicios_Logica.pdf',
    'gabarito':   'GABARITO_100_EXERCICIOS_LOGICA_PROGRAMACAO_A4.pdf',
    'cond':       '30 Exercícios Extras de Condicionais.pdf',
    'rep':        '30 Exercícios Extras de Estruturas de Repetição.pdf',
}

SECOES = ['REGRA', 'REGRAS', 'REQUISITO', 'REQUISITOS', 'ENUNCIADO',
          'EXEMPLO DE EXECUÇÃO', 'TESTE SEU PROGRAMA',
          'VERIFICAÇÃO FINAL', 'VERIFIQUE', 'ATENÇÃO', 'DICA']

# singular, com separadores tolerantes ao OCR; \b impede casar "EXERCÍCIOS" do rodapé
RE_EX = re.compile(r'exerc[íi]cio\b[\s|.:\-—_\[\]()]*(\d{1,3})\b', re.I)

# O tesseract troca 0<->O em contexto matemático. Só os padrões inequívocos.
OCR_FIX = [
    (re.compile(r'\bO(?=!)'), '0'),                     # "O! = 1"      -> "0! = 1"
    (re.compile(r'(?<=\bde )O(?= at[eé]\b)'), '0'),     # "de O até 12" -> "de 0 até 12"
    (re.compile(r'(?<=[\s(])O(?=\s*[.,)]|\s*$)'), '0'), # "O," / "O)" isolado
]


# ---------------------------------------------------------------- utilidades

def exigir(*ferramentas):
    faltando = [f for f in ferramentas if not shutil.which(f)]
    if faltando:
        sys.exit(f"erro: nao encontrei {', '.join(faltando)}. "
                 "Instale poppler-utils e tesseract-ocr (com o idioma 'por').")


def normalizar(s):
    s = unicodedata.normalize('NFKD', s.lower())
    s = ''.join(c for c in s if not unicodedata.combining(c))
    return re.sub(r'\s+', ' ', re.sub(r'[^a-z0-9 ]', ' ', s)).strip()


def corrigir_ocr(t):
    for rx, rep in OCR_FIX:
        t = rx.sub(rep, t)
    return t


def primeiro(d, *chaves):
    for k in chaves:
        if d.get(k):
            return d[k]
    return ''


def limpar(linhas):
    """remove cabecalho, rodape e linhas de puro ruido de OCR"""
    fora = [
        r'P[áa]gina\s*[|]?\s*\d+(\s+de\s+\d+)?$',
        r'^\d{0,4}\s*EXERC[ÍI]CIOS DE L[ÓO]GICA',
        r'^B[ÔO]NUS\s+0?\d',
        r'^Gabarito\s*[-–]',
        r'^M[óo]dulo Extra',
        r'^M[ÓO]DULO\s+\d',
    ]
    out = []
    for l in linhas:
        s = l.strip()
        if any(re.search(p, s, re.I) for p in fora):
            continue
        if re.fullmatch(r'[^A-Za-zÀ-ÿ0-9]{0,6}', s):
            continue
        out.append(l.rstrip())
    while out and not out[0].strip():
        out.pop(0)
    while out and not out[-1].strip():
        out.pop()
    return out


def dividir_secoes(linhas):
    """quebra o corpo da pagina nos titulos de secao; o preambulo vai para 'enunciado'"""
    res, atual, buf = {}, 'enunciado', []
    for l in linhas:
        k = re.sub(r'^[^A-Za-zÀ-ÿ]+', '', l.strip()).upper().rstrip(':')
        if k in SECOES:
            if buf:
                res[atual] = '\n'.join(buf).strip()
            atual, buf = k, []
        else:
            buf.append(l)
    if buf:
        res[atual] = '\n'.join(buf).strip()
    return {k: v for k, v in res.items() if v}


# ---------------------------------------------------------------- extracao

def texto_de(pdf, destino):
    subprocess.run(['pdftotext', '-layout', str(pdf), str(destino)], check=True)
    return destino.read_text(encoding='utf-8', errors='replace')


def ocr_de(pdf, workdir, jobs=8):
    """rasteriza o PDF e passa o tesseract pagina a pagina"""
    workdir.mkdir(parents=True, exist_ok=True)
    subprocess.run(['pdftoppm', '-r', '150', '-png', str(pdf), str(workdir / 'p')], check=True)
    pngs = sorted(workdir.glob('p-*.png'))
    if not pngs:
        sys.exit(f'erro: pdftoppm nao gerou paginas de {pdf.name}')
    with ThreadPoolExecutor(max_workers=jobs) as pool:
        list(pool.map(lambda p: subprocess.run(
            ['tesseract', str(p), str(p.with_suffix('')), '-l', 'por'],
            check=True, capture_output=True), pngs))
    return sorted(workdir.glob('p-*.txt'))


# ---------------------------------------------------------------- parsers

def parse_gabarito(txt):
    """gabarito: texto nativo. Fonte de verdade para numero, titulo, modulo e solucao."""
    gab = {}
    for pg in txt.split('\f'):
        m = re.search(r'MÓDULO\s+(\d+)\s{2,}(.+?)\s{2,}EXERC[ÍI]CIO\s+(\d+)', pg)
        if not m:
            continue
        n, resto = int(m.group(3)), pg[m.end():]
        corpo = limpar(resto.split('\n'))
        if not corpo:
            continue
        codigo = ''
        cm = re.search(r'SOLUÇÃO EM PSEUDOC[ÓO]DIGO(.*?)'
                       r'(?:PONTO DE ATENÇÃO|Gabarito\s*-|$)', resto, re.S)
        if cm:
            ls = [l for l in cm.group(1).split('\n') if l.strip()]
            rec = min((len(l) - len(l.lstrip()) for l in ls), default=0)
            codigo = '\n'.join(l[rec:] if len(l) > rec else l.strip() for l in ls).strip()
        am = re.search(r'PONTO DE ATENÇÃO\s*\n(.*?)(?:\n\s*\n|Gabarito\s*-|$)', resto, re.S)
        gab[n] = {
            'modulo': int(m.group(1)),
            'modulo_nome': m.group(2).strip(),
            'titulo': corpo[0].strip(),
            'pseudocodigo': codigo,
            'ponto_atencao': re.sub(r'\s+', ' ', am.group(1)).strip() if am else '',
        }
    return gab


def parse_enunciados(arquivos_ocr, titulos):
    """
    Casa cada pagina com um exercicio pelo titulo, em duas passadas:

      1. ancoras — match forte (>=0.95) e coerente com a ordem crescente das paginas;
      2. lacunas — paginas de exercicio cujo titulo o OCR corrompeu entram apenas
         quando o intervalo entre as ancoras vizinhas tem um unico slot livre.

    Titulos curtos ("Fatorial") colidem por similaridade e as divisorias de modulo
    casam fraco com qualquer coisa; a restricao de ordem e o que desambigua.
    """
    pags = []
    for f in arquivos_ocr:
        raw = Path(f).read_text(encoding='utf-8', errors='replace')
        cands = []
        for i, l in enumerate(raw.split('\n')[:8]):
            s = re.sub(r'^.*?exerc[íi]cio[^A-Za-zÀ-ÿ]*', '', l.strip(), flags=re.I).strip()
            s = re.sub(r'^[^A-Za-zÀ-ÿ]+', '', s).strip()
            if len(s) >= 10 and not re.match(r'^(P[ÁA]GINA|ELEMENTOS|M[ÓO]DULO)', s, re.I):
                cands.append((i, s))
        melhor = (0.0, None, None)
        for i, s in cands[:4]:
            k = normalizar(s)
            for n, t in titulos.items():
                r = difflib.SequenceMatcher(None, k, t).ratio()
                if r > melhor[0]:
                    melhor = (r, n, i)
        pags.append({'pg': int(re.search(r'p-(\d+)', str(f)).group(1)),
                     'arquivo': Path(f).name, 'score': melhor[0],
                     'n': melhor[1], 'li': melhor[2], 'raw': raw})

    alvo, origem, ultimo = {}, {}, 0
    for p in sorted(pags, key=lambda x: x['pg']):                       # passada 1
        if p['score'] >= 0.95 and p['n'] and p['n'] > ultimo and p['n'] not in alvo:
            alvo[p['n']] = p
            origem[p['n']] = 'titulo'
            ultimo = p['n']

    ancoras = sorted(alvo)
    for p in sorted(pags, key=lambda x: x['pg']):                       # passada 2
        if p in alvo.values() or not RE_EX.search(p['raw']):
            continue
        if re.search(r'ANTES DO EXERC[ÍI]CIO', p['raw'], re.I):         # pagina de aquecimento
            continue
        if re.search(r'^\s*Exerc[íi]cios\s+\d+\s*a\s*\d+', p['raw'], re.M):  # divisoria
            continue
        antes = [n for n in ancoras if alvo[n]['pg'] < p['pg']]
        depois = [n for n in ancoras if alvo[n]['pg'] > p['pg']]
        lo = max(antes) + 1 if antes else 1
        hi = min(depois) - 1 if depois else max(titulos)
        livres = [n for n in range(lo, hi + 1) if n not in alvo]
        if len(livres) != 1:                                            # ambiguo: fora
            continue
        alvo[livres[0]] = p
        origem[livres[0]] = f"ordem (score {p['score']:.2f})"

    enun, auditoria = {}, []
    for n, p in alvo.items():
        linhas = p['raw'].split('\n')
        if origem[n] == 'titulo':
            corpo = linhas[(p['li'] or 0) + 1:]
        else:
            # titulo corrompido: ancora no marcador e descarta a linha do titulo
            mi = next((i for i, l in enumerate(linhas) if RE_EX.search(l)), 0)
            corpo = limpar(linhas[mi + 1:])
            corpo = corpo[1:] if corpo else corpo
        corpo = limpar(corpo)
        enun[n] = dividir_secoes(corpo) if corpo else {}
        auditoria.append((n, p['arquivo'], origem[n], round(p['score'], 2)))
    return enun, sorted(auditoria)


def parse_bonus(txt, titulo_fix=None):
    """bonus: numeracao propria de 1 a 30, uma pagina por exercicio"""
    res = {}
    for blk in re.split(r'(?=exerc[íi]cio\b[\s|.:\-—_\[\]()]*\d{1,2}\b)', txt, flags=re.I):
        m = RE_EX.match(blk)
        if not m:
            continue
        n = int(m.group(1))
        if not 1 <= n <= 30 or n in res:
            continue
        corpo = limpar(blk[m.end():].split('\n'))
        if not corpo:
            continue
        titulo, resto = corpo[0].strip(), corpo[1:]
        if normalizar(titulo) == 'enunciado' and resto:
            titulo, resto = resto[0].strip(), resto[1:]
        s = dividir_secoes(resto)
        res[n] = {
            'n': n,
            'titulo': (titulo_fix or {}).get(n, titulo),
            'enunciado': primeiro(s, 'ENUNCIADO', 'enunciado'),
            'regra': corrigir_ocr(primeiro(s, 'REQUISITO', 'REQUISITOS', 'REGRA', 'REGRAS')),
            'exemplo': s.get('EXEMPLO DE EXECUÇÃO', ''),
            'testes': s.get('TESTE SEU PROGRAMA', ''),
            'verificacao': primeiro(s, 'VERIFICAÇÃO FINAL', 'VERIFIQUE'),
        }
    return res


# ---------------------------------------------------------------- saida

def gerar_markdown(dados):
    L, C, R = dados['logica'], dados['bonus_condicionais'], dados['bonus_repeticao']

    def bloco(rotulo, txt, cerca=False):
        if not txt:
            return []
        o = [f'**{rotulo}**', '']
        o += ['```', txt.strip(), '```', ''] if cerca else [txt.strip(), '']
        return o

    o = []
    w = o.append
    w('# Banco de Exercícios de Lógica — Material de Apoio')
    w('')
    w('> Uso **pessoal**. Consolidação dos PDFs de estudo em um arquivo único, para servir')
    w('> de fonte na conversão para o formato `Exercise` do DevPrática.')
    w('')
    w('Gerado por `scripts/build-exercicios.py`. Não editar à mão — rode o script de novo.')
    w('')
    w('| Fonte | Qtd | Enunciado | Tabela de testes | Gabarito |')
    w('| :--- | :---: | :---: | :---: | :---: |')
    w(f"| 100 Exercícios de Lógica | {len(L)} | {sum(1 for r in L if r['enunciado'])}/{len(L)} "
      f"| {sum(1 for r in L if r['testes'])}/{len(L)} | {sum(1 for r in L if r['pseudocodigo'])}/{len(L)} |")
    w(f"| Bônus — Condicionais | {len(C)} | {sum(1 for r in C if r['enunciado'])}/{len(C)} "
      f"| {sum(1 for r in C if r['testes'])}/{len(C)} | — |")
    w(f"| Bônus — Repetição | {len(R)} | {sum(1 for r in R if r['enunciado'])}/{len(R)} "
      f"| {sum(1 for r in R if r['testes'])}/{len(R)} | — |")
    w('')
    w('## ⚠️ Antes de usar')
    w('')
    w('- **Exercícios 11, 12 e 13 não existem no material de origem.** O próprio gabarito')
    w('  informa que os enunciados não estavam disponíveis e as páginas foram mantidas como')
    w('  lacunas para preservar a numeração. Precisam ser escritos do zero.')
    w('- **Fórmulas podem ter ruído de OCR.** O PDF dos enunciados é imagem, e o tesseract')
    w('  confunde `0`/`O` e sinais matemáticos. Exemplo real: `N\'=N x (N = 1)` deveria ser')
    w('  `N! = N × (N-1)`. As trocas óbvias foram corrigidas; **confira toda fórmula** antes')
    w('  de transformar em `testCases`. Nas tabelas de teste, `4e9` costuma ser `4 e 9`.')
    w('- **Os bônus têm numeração própria** (1–30 cada), independente dos 100.')
    w('  Sugestão de ID: `logica-NNN`, `cond-NN`, `rep-NN`.')
    w('- O pseudocódigo é **Portugol (VisuAlg)** — referência de lógica, não para copiar.')
    w('')
    w('---')
    w('')

    mods = {}
    for r in L:
        mods.setdefault((r['modulo'], r['modulo_nome']), []).append(r)

    w('## Sumário')
    w('')
    for (num, nome), rows in sorted(mods.items()):
        ns = [r['n'] for r in rows]
        w(f"- **Módulo {num:02d} — {nome.title()}** · exercícios {min(ns)}–{max(ns)} ({len(rows)})")
    w('- **Bônus — Condicionais** · 1–30')
    w('- **Bônus — Estruturas de Repetição** · 1–30')
    w('')
    w('---')
    w('')
    w('# 100 Exercícios de Lógica')
    w('')
    for (num, nome), rows in sorted(mods.items()):
        w(f'## Módulo {num:02d} — {nome.title()}')
        w('')
        for r in sorted(rows, key=lambda x: x['n']):
            w(f"### {r['n']:03d}. {r['titulo']}")
            w('')
            if not r['enunciado']:
                w('> ⚠️ **Sem enunciado no material de origem** — escrever do zero '
                  'a partir do tópico do módulo.')
                w('')
            o.extend(bloco('Enunciado', r['enunciado']))
            o.extend(bloco('Regra / Requisito', r['regra']))
            o.extend(bloco('Exemplo de execução', r['exemplo'], cerca=True))
            o.extend(bloco('Teste seu programa', r['testes'], cerca=True))
            o.extend(bloco('Verificação final', r['verificacao']))
            o.extend(bloco('Solução de referência (Portugol)', r['pseudocodigo'], cerca=True))
            o.extend(bloco('Ponto de atenção', r['ponto_atencao']))
            w('---')
            w('')
    for titulo, rows, pref in [('Bônus — 30 Exercícios de Condicionais', C, 'cond'),
                               ('Bônus — 30 Exercícios de Estruturas de Repetição', R, 'rep')]:
        w(f'# {titulo}')
        w('')
        for r in rows:
            w(f"### {pref}-{r['n']:02d}. {r['titulo']}")
            w('')
            o.extend(bloco('Enunciado', r['enunciado']))
            o.extend(bloco('Requisito', r['regra']))
            o.extend(bloco('Exemplo de execução', r['exemplo'], cerca=True))
            o.extend(bloco('Teste seu programa', r['testes'], cerca=True))
            o.extend(bloco('Verificação final', r['verificacao']))
            w('---')
            w('')
    return '\n'.join(o) + '\n'


# ---------------------------------------------------------------- main

def main():
    ap = argparse.ArgumentParser(description='Extrai os exercícios dos PDFs de apoio.')
    ap.add_argument('entrada', type=Path, help='pasta com os PDFs')
    ap.add_argument('-o', '--saida', type=Path, default=Path('.'), help='pasta de saída')
    ap.add_argument('--trabalho', type=Path, default=None,
                    help='pasta de trabalho (padrão: temporária, apagada no fim)')
    args = ap.parse_args()

    exigir('pdftotext', 'pdftoppm', 'tesseract')

    faltando = [nome for nome in PDFS.values() if not (args.entrada / nome).exists()]
    if faltando:
        sys.exit('erro: PDFs nao encontrados em '
                 f'{args.entrada}:\n  ' + '\n  '.join(faltando))

    args.saida.mkdir(parents=True, exist_ok=True)
    tmp = args.trabalho
    limpar_tmp = tmp is None
    if limpar_tmp:
        tmp = Path(tempfile.mkdtemp(prefix='devpratica-'))
    tmp.mkdir(parents=True, exist_ok=True)

    try:
        print('lendo o gabarito (texto nativo)...')
        gab = parse_gabarito(texto_de(args.entrada / PDFS['gabarito'], tmp / 'gabarito.txt'))
        print(f'  {len(gab)} exercicios')
        titulos = {n: normalizar(v['titulo']) for n, v in gab.items()}

        print('OCR dos enunciados (113 paginas, ~40s)...')
        enun, auditoria = parse_enunciados(
            ocr_de(args.entrada / PDFS['enunciados'], tmp / 'ocr100'), titulos)
        print(f'  {len(enun)} paginas casadas')

        print('OCR dos bonus (60 paginas)...')
        txt_cond = '\n'.join(p.read_text(encoding='utf-8', errors='replace')
                             for p in ocr_de(args.entrada / PDFS['cond'], tmp / 'ocr_cond'))
        txt_rep = '\n'.join(p.read_text(encoding='utf-8', errors='replace')
                            for p in ocr_de(args.entrada / PDFS['rep'], tmp / 'ocr_rep'))
        cond = parse_bonus(txt_cond)
        # o OCR nao le o titulo desta pagina; corrigido manualmente
        rep = parse_bonus(txt_rep, titulo_fix={4: 'Mostrar Ímpares'})

        logica = []
        for n in range(1, max(gab) + 1):
            e, g = enun.get(n, {}), gab.get(n, {})
            logica.append({
                'n': n,
                'modulo': g.get('modulo'),
                'modulo_nome': g.get('modulo_nome', ''),
                'titulo': g.get('titulo', ''),
                'enunciado': e.get('enunciado', ''),
                'regra': corrigir_ocr(primeiro(e, 'REGRA', 'REGRAS', 'REQUISITO', 'REQUISITOS')),
                'exemplo': e.get('EXEMPLO DE EXECUÇÃO', ''),
                'testes': e.get('TESTE SEU PROGRAMA', ''),
                'verificacao': corrigir_ocr(primeiro(e, 'VERIFICAÇÃO FINAL', 'VERIFIQUE')),
                'pseudocodigo': g.get('pseudocodigo', ''),
                'ponto_atencao': g.get('ponto_atencao', ''),
            })

        dados = {'logica': logica,
                 'bonus_condicionais': [cond[k] for k in sorted(cond)],
                 'bonus_repeticao': [rep[k] for k in sorted(rep)]}

        (args.saida / 'dataset.json').write_text(
            json.dumps(dados, ensure_ascii=False, indent=1), encoding='utf-8')
        (args.saida / 'BANCO_EXERCICIOS.md').write_text(
            gerar_markdown(dados), encoding='utf-8')

        sem = [r['n'] for r in logica if not r['enunciado']]
        print(f"\nlogica: enunciado {len(logica)-len(sem)}/{len(logica)} | "
              f"gabarito {sum(1 for r in logica if r['pseudocodigo'])}/{len(logica)} | "
              f"testes {sum(1 for r in logica if r['testes'])}/{len(logica)}")
        print(f"  sem enunciado: {sem}  (11-13 nao existem na origem)")
        print(f"condicionais: {len(cond)}/30 | repeticao: {len(rep)}/30")
        pos = [a for a in auditoria if a[2].startswith('ordem')]
        if pos:
            print(f"\n{len(pos)} pagina(s) casada(s) por ordem (OCR corrompeu o titulo):")
            for n, arq, via, sc in pos:
                print(f"  ex {n:3d}  {arq}  {via}")
        print(f"\nescrito em {args.saida}/")
    finally:
        if limpar_tmp:
            shutil.rmtree(tmp, ignore_errors=True)


if __name__ == '__main__':
    main()
