import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshCw, Search, ShieldCheck } from 'lucide-react';
import { listarAcessos } from '../services/accessLog';
import { resumirAcessos } from '../utils/accessSummary';
import { FORTALEZA_TIMEZONE } from '../utils/dateUtils';
import type { AccessEntry } from '../types/accessLog';

const FOCUS_RING = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-from';

const formatoDataHora = new Intl.DateTimeFormat('pt-BR', {
  timeZone: FORTALEZA_TIMEZONE,
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

function dataHora(d: Date | null): string {
  return d ? formatoDataHora.format(d) : 'agora há pouco';
}

/**
 * Aba Admin (só o administrador vê): quem entrou no site e quando. Os dados vêm de
 * `acessos/{id}` no Firestore; as regras só deixam o administrador ler.
 */
export const AdminPanel: React.FC = () => {
  const [acessos, setAcessos] = useState<AccessEntry[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [filtro, setFiltro] = useState('');

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      setAcessos(await listarAcessos());
    } catch {
      setErro('Não foi possível ler os acessos. Confira se as regras do Firestore com o seu e-mail estão publicadas.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  const termo = filtro.trim().toLowerCase();
  const filtrados = useMemo(
    () => (termo ? acessos.filter(a => a.email.toLowerCase().includes(termo) || a.nome.toLowerCase().includes(termo)) : acessos),
    [acessos, termo]
  );
  const resumo = useMemo(() => resumirAcessos(filtrados), [filtrados]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4 pb-4 border-b border-subtle">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-success">
            <ShieldCheck className="w-4 h-4" aria-hidden="true" />
            Só você vê esta página
          </div>
          <h1 className="text-2xl font-extrabold text-primary tracking-tight">Controle de acessos</h1>
          <p className="text-sm text-muted">Quem entrou no DevPrática e quando (horário de Fortaleza).</p>
        </div>
        <button
          type="button"
          onClick={() => void carregar()}
          disabled={carregando}
          className={`flex items-center gap-2 px-3 py-2 rounded-control border border-subtle bg-surface text-xs font-semibold text-primary hover:bg-surface-hover disabled:opacity-60 cursor-pointer ${FOCUS_RING}`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${carregando ? 'animate-spin motion-reduce:animate-none' : ''}`} aria-hidden="true" />
          Atualizar
        </button>
      </div>

      {erro && <p className="p-3 rounded-lg border border-danger/40 bg-danger/10 text-sm text-danger">{erro}</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="rounded-card border border-subtle bg-surface p-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted">Pessoas</div>
          <div className="text-2xl font-black text-primary tabular-nums">{resumirAcessos(acessos).length}</div>
        </div>
        <div className="rounded-card border border-subtle bg-surface p-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted">Acessos</div>
          <div className="text-2xl font-black text-primary tabular-nums">{acessos.length}</div>
        </div>
        <div className="rounded-card border border-subtle bg-surface p-4 col-span-2 sm:col-span-1">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted">Último acesso</div>
          <div className="text-sm font-bold text-primary mt-1.5 truncate">{acessos[0] ? acessos[0].email : '—'}</div>
          <div className="text-xs text-muted">{acessos[0] ? dataHora(acessos[0].em) : ''}</div>
        </div>
      </div>

      <label className="relative block max-w-sm">
        <span className="sr-only">Filtrar por e-mail ou nome</span>
        <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
        <input
          type="search"
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
          placeholder="Filtrar por e-mail ou nome"
          className={`w-full h-10 pl-9 pr-3 rounded-control border border-subtle bg-canvas text-sm text-primary placeholder:text-muted/80 outline-none focus:border-accent-from ${FOCUS_RING}`}
        />
      </label>

      <section aria-labelledby="admin-pessoas" className="space-y-2">
        <h2 id="admin-pessoas" className="text-sm font-bold text-primary">Por pessoa</h2>
        <div className="overflow-x-auto rounded-card border border-subtle bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted">
                <th scope="col" className="px-4 py-2.5 font-semibold">E-mail</th>
                <th scope="col" className="px-4 py-2.5 font-semibold">Nome</th>
                <th scope="col" className="px-4 py-2.5 font-semibold text-right">Acessos</th>
                <th scope="col" className="px-4 py-2.5 font-semibold">Último</th>
                <th scope="col" className="px-4 py-2.5 font-semibold">Primeiro</th>
              </tr>
            </thead>
            <tbody>
              {resumo.map(p => (
                <tr key={p.email} className="border-t border-subtle">
                  <td className="px-4 py-2.5 font-medium text-primary whitespace-nowrap">{p.email}</td>
                  <td className="px-4 py-2.5 text-muted whitespace-nowrap">{p.nome || '—'}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-primary">{p.total}</td>
                  <td className="px-4 py-2.5 text-muted whitespace-nowrap tabular-nums">{dataHora(p.ultimo)}</td>
                  <td className="px-4 py-2.5 text-muted whitespace-nowrap tabular-nums">{dataHora(p.primeiro)}</td>
                </tr>
              ))}
              {!carregando && resumo.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-muted">
                    {termo ? 'Ninguém com esse e-mail ou nome.' : 'Nenhum acesso registrado ainda.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="admin-historico" className="space-y-2">
        <h2 id="admin-historico" className="text-sm font-bold text-primary">
          Histórico <span className="font-normal text-muted">(até os 500 mais recentes)</span>
        </h2>
        <div className="overflow-x-auto rounded-card border border-subtle bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted">
                <th scope="col" className="px-4 py-2.5 font-semibold">Data e hora</th>
                <th scope="col" className="px-4 py-2.5 font-semibold">E-mail</th>
                <th scope="col" className="px-4 py-2.5 font-semibold">Como entrou</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map(a => (
                <tr key={a.id} className="border-t border-subtle">
                  <td className="px-4 py-2 text-muted whitespace-nowrap tabular-nums">{dataHora(a.em)}</td>
                  <td className="px-4 py-2 text-primary whitespace-nowrap">{a.email}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {a.tipo === 'login' ? (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-success/10 text-success border border-success/30">Fez login</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-surface-hover text-muted border border-subtle">Voltou conectado</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted">
          "Fez login" = clicou em Entrar. "Voltou conectado" = abriu o site já logado (contado uma vez por aba).
        </p>
      </section>
    </div>
  );
};
