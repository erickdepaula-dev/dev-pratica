# Banco de Exercícios de Lógica — Material de Apoio

> Uso **pessoal**. Consolidação dos PDFs de estudo em um arquivo único, para servir
> de fonte na conversão para o formato `Exercise` do DevPrática.

Gerado por `scripts/build-exercicios.py`. Não editar à mão — rode o script de novo.

## 📌 Como usar isto na tarefa 4.3 / 4.4

Use este arquivo para saber **qual é a regra** de cada exercício e **quais valores testar** —
é para isso que ele serve, já que o título sozinho não diz que "Entrada no Evento" libera
18+ e exige autorização dos 16 aos 17.

**A prosa continua sendo escrita do zero**, como foi feito nos exercícios 1 a 80: `summary`,
`realWorldContext`, `description`, `hints` e `explanation` são nossos. O que se aproveita daqui
é a especificação (regra, fronteiras, casos de teste), não o texto.

| Fonte | Qtd | Enunciado | Tabela de testes | Gabarito |
| :--- | :---: | :---: | :---: | :---: |
| 100 Exercícios de Lógica | 100 | 97/100 | 78/100 | 100/100 |
| Bônus — Condicionais | 30 | 30/30 | 23/30 | — |
| Bônus — Repetição | 30 | 30/30 | 28/30 | — |

## ⚠️ Antes de usar

- **Exercícios 11, 12 e 13 não existem no material de origem.** O próprio gabarito
  informa que os enunciados não estavam disponíveis e as páginas foram mantidas como
  lacunas para preservar a numeração. Precisam ser escritos do zero.
- **Fórmulas podem ter ruído de OCR.** O PDF dos enunciados é imagem, e o tesseract
  confunde `0`/`O` e sinais matemáticos. Exemplo real: `N'=N x (N = 1)` deveria ser
  `N! = N × (N-1)`. As trocas óbvias foram corrigidas; **confira toda fórmula** antes
  de transformar em `testCases`. Nas tabelas de teste, `4e9` costuma ser `4 e 9`.
- **Os bônus têm numeração própria** (1–30 cada), independente dos 100.
  Sugestão de ID: `logica-NNN`, `cond-NN`, `rep-NN`.
- O pseudocódigo é **Portugol (VisuAlg)** — referência de lógica, não para copiar.

---

## Sumário

- **Módulo 01 — Primeiros Algoritmos** · exercícios 1–15 (15)
- **Módulo 02 — Estruturas Condicionais** · exercícios 16–35 (20)
- **Módulo 03 — Estruturas De Repetição** · exercícios 36–60 (25)
- **Módulo 04 — Vetores E Matrizes** · exercícios 61–80 (20)
- **Módulo 05 — Funções E Desafios Combinados** · exercícios 81–100 (20)
- **Bônus — Condicionais** · 1–30
- **Bônus — Estruturas de Repetição** · 1–30

---

# 100 Exercícios de Lógica

## Módulo 01 — Primeiros Algoritmos

### 001. Soma de dois números

**Enunciado**

Escreva um programa que leia dois números inteiros e mostre a soma entre eles.

**Exemplo de execução**

```
Primeiro valor:
Segundo valor:
Soma:
```

**Teste seu programa**

```
Valores informados Resultado esperado
4e9 13
-3e8 5
0e 12 12
```

**Verificação final**

Teste também uma soma que envolva zero e números com sinais diferentes; o sinal
do resultado deve acompanhar o valor de maior módulo.

**Solução de referência (Portugol)**

```
algoritmo "soma_dois_numeros"
var a, b, soma: inteiro
inicio
  leia(a, b)
  soma <- a + b
  escreva("Soma: ", soma)
fimalgoritmo
```

**Ponto de atenção**

A soma funciona também com zero e números negativos.

---

### 002. Média de duas notas

**Enunciado**

Leia duas notas reais, calcule a média aritmética e mostre o resultado com uma casa decimal.

**Regra / Requisito**

Média = (nota 1 + nota 2) + 2.

**Teste seu programa**

```
Nota 1 Nota 2 Média esperada
5,9 7,5 6,5
10,0 9,0 93
0,0 4,0 2,0
```

**Verificação final**

Confira um caso cuja média tenha mais de uma casa decimal e aplique a formatação de
uma casa somente na saída.

**Solução de referência (Portugol)**

```
algoritmo "media_duas_notas"
var n1, n2, media: real
inicio
  leia(n1, n2)
  media <- (n1 + n2) / 2
  escreva_formatado(media, 1)
fimalgoritmo
```

**Ponto de atenção**

Divida por 2 depois de somar as duas notas.

---

### 003. Antecessor e sucessor

**Enunciado**

Leia um número inteiro e mostre o seu antecessor e o seu sucessor.

**Exemplo de execução**

```
Digite um número:
Antecessor:
Número :
Sucessor:
```

**Teste seu programa**

```
Entrada Antecessor Sucessor
1 0 2
0 1 1
-7 -8 -6
```

**Verificação final**

Para qualquer entrada, a diferença entre o sucessor e o antecessor deve ser
exatamente 2, inclusive com números negativos.

**Solução de referência (Portugol)**

```
algoritmo "antecessor_sucessor"
var n: inteiro
inicio
  leia(n)
  escreva("Antecessor: ", n - 1)
  escreva("Número: ", n)
  escreva("Sucessor: ", n + 1)
fimalgoritmo
```

**Ponto de atenção**

A diferença entre sucessor e antecessor é sempre 2.

---

### 004. Dobro, triplo e metade

**Enunciado**

Leia um número real e mostre o dobro, o triplo e a metade desse valor.

**Exemplo de execução**

```
Digite um valor:
Dobro:
Triplo:
Metade:
```

**Teste seu programa**

```
Entrada Dobro Triplo Metade
8 16 24 4
25 5 Lo 1,25
-4 -8 =12 =2
```

**Verificação final**

Use um valor decimal e confirme que dobro, triplo e metade foram calculados
sempre a partir da entrada original.

**Solução de referência (Portugol)**

```
algoritmo "dobro_triplo_metade"
var n: real
inicio
  leia(n)
  escreva("Dobro: ", n * 2)
  escreva("Triplo: ", n * 3)
  escreva("Metade: ", n / 2)
fimalgoritmo
```

**Ponto de atenção**

Use uma variável real para preservar resultados decimais.

---

### 005. Conversão de medidas

**Enunciado**

Leia uma medida em metros e mostre o valor equivalente em centímetros e milímetros.

**Regra / Requisito**

| 1 metro = 100 centímetros = 1.000 milímetros.

**Exemplo de execução**

```
Metros:
Centímetros:
Milímetros:
```

**Teste seu programa**

```
Metros Centímetros Milímetros
1 100 1000
0,75 75 750
12,3 1230 12300
```

**Verificação final**

Confirme o caso-base: 1 metro deve corresponder a 100 centímetros e 1.000 milímetros.

**Solução de referência (Portugol)**

```
algoritmo "conversao_medidas"
var metros: real
inicio
  leia(metros)
  escreva("Centímetros: ", metros * 100)
  escreva("Milímetros: ", metros * 1000)
fimalgoritmo
```

**Ponto de atenção**

Um metro equivale a 100 cm e 1.000 mm.

---

### 006. Área e perímetro do retângulo

**Enunciado**

Leia a largura e a altura de um retângulo. Mostre a área e o perímetro.

**Regra / Requisito**

Área = largura x altura.
Perímetro = 2 x (largura + altura).

**Exemplo de execução**

```
Largura:
Altura:
Área:
Perímetro:
```

**Teste seu programa**

```
Largura Altura Área Perímetro
4 4 16 16
2,9 8 20 21
10 1 10 22
```

**Verificação final**

Teste um quadrado e verifique que, mesmo com lados iguais, área e perímetro
continuam sendo cálculos diferentes.

**Solução de referência (Portugol)**

```
algoritmo "retangulo"
var largura, altura, area, perimetro: real
inicio
  leia(largura, altura)
  area <- largura * altura
  perimetro <- 2 * (largura + altura)
  escreva("Área: ", area)
  escreva("Perímetro: ", perimetro)
fimalgoritmo
```

**Ponto de atenção**

Área e perímetro medem grandezas diferentes.

---

### 007. Celsius para Fahrenheit

**Enunciado**

Leia uma temperatura em graus Celsius e mostre o valor equivalente em Fahrenheit.

**Regra / Requisito**

| Fahrenheit = Celsius x 9 + 5 + 32.

**Exemplo de execução**

```
Temperatura em “ºC:
Temperatura em ºF:
```

**Teste seu programa**

```
Celsius Fahrenheit esperado
0 32
100 212
-40 -40
```

**Verificação final**

Use -40 ºC como conferência especial: nessa temperatura, os valores
em Celsius e Fahrenheit devem coincidir.

**Solução de referência (Portugol)**

```
algoritmo "celsius_fahrenheit"
var c, f: real
inicio
  leia(c)
  f <- c * 9 / 5 + 32
  escreva("Fahrenheit: ", f)
fimalgoritmo
```

**Ponto de atenção**

Em -40 graus, as duas escalas apresentam o mesmo valor.

---

### 008. Desconto no produto

**Enunciado**

Leia o preço de um produto. Calcule um desconto de 10% e mostre o valor do desconto e o preço final.

**Regra / Requisito**

Desconto = preço x 10%.

**Exemplo de execução**

```
Preço:
Desconto:
Preço final:
```

**Teste seu programa**

```
Preço Desconto Preço final
R$ 50,00 R$ 5,00 R$ 45,00
R$ 99,90 R$ 9,99 R$ 89,91
R$ 1.000,00 R$ 100,00 R$ 900,00
```

**Verificação final**

Some o desconto ao preço final; o resultado deve reconstruir exatamente o preço original.

**Solução de referência (Portugol)**

```
algoritmo "desconto_produto"
var preco, desconto, final: real
inicio
  leia(preco)
  desconto <- preco * 0.10
  final <- preco - desconto
  escreva("Desconto: R$ ", desconto)
  escreva("Preço final: R$ ", final)
fimalgoritmo
```

**Ponto de atenção**

Preço final mais desconto recompõe o preço original.

---

### 009. Reajuste salarial

**Enunciado**

Leia o salário atual de um funcionário. Calcule um aumento de 15% e mostre o valor do aumento
e o novo salário.

**Regra / Requisito**

Aumento = salário atual x 15%.

**Exemplo de execução**

```
Salário atual:
Aumento:
Novo salário:
```

**Teste seu programa**

```
Salário atual Aumento Novo salário
R$ 1.200,00 R$ 180,00 R$ 1.380,00
R$ 3.500,00 R$ 525,00 R$ 4.025,00
R$ 800,00 R$ 120,00 R$ 920,00
```

**Verificação final**

Subtraia o salário antigo do novo salário e confirme que a diferença é igual ao aumento calculado.

**Solução de referência (Portugol)**

```
algoritmo "reajuste_salarial"
var salario, aumento, novo: real
inicio
  leia(salario)
  aumento <- salario * 0.15
  novo <- salario + aumento
  escreva("Aumento: R$ ", aumento)
  escreva("Novo salário: R$ ", novo)
fimalgoritmo
```

**Ponto de atenção**

Novo salário menos salário antigo deve ser igual ao aumento.

---

### 010. Salário com comissão

**Enunciado**

Leia o salário fixo de um vendedor e o total vendido no mês. Calcule uma comissão de 4%
sobre as vendas e mostre a comissão e o salário total.

**Regra / Requisito**

Comissão = total vendido x 4%.

**Exemplo de execução**

```
Salário fixo: R$
Total vendido: R$
Comissão: R$
Salário total: R$
```

**Teste seu programa**

```
Salário fixo Vendas Salário total esperado
R$ 1.500,00 R$ 5.000,00 R$ 1.700,00
R$ 2.000,00 R$ 0,00 R$ 2.000,00
R$ 2.500,00 R$ 20.000,00 R$ 3.300,00
```

**Verificação final**

Confirme que os 4% são aplicados somente sobre as vendas, nunca sobre o salário fixo.
de 113

**Solução de referência (Portugol)**

```
algoritmo "salario_comissao"
var salario, vendas, comissao, total: real
inicio
  leia(salario, vendas)
  comissao <- vendas * 0.04
  total <- salario + comissao
  escreva("Comissão: R$ ", comissao)
  escreva("Salário total: R$ ", total)
fimalgoritmo
```

**Ponto de atenção**

A comissão incide somente sobre as vendas.

---

### 011. Enunciado não fornecido

> ⚠️ **Sem enunciado no material de origem** — escrever do zero a partir do tópico do módulo.

**Solução de referência (Portugol)**

```
SEM SOLUÇÃO GERADA
Inclua o enunciado original do exercício 11
para completar esta página do gabarito.
```

**Ponto de atenção**

A lacuna foi mantida para preservar a numeração do material.

---

### 012. Enunciado não fornecido

> ⚠️ **Sem enunciado no material de origem** — escrever do zero a partir do tópico do módulo.

**Solução de referência (Portugol)**

```
SEM SOLUÇÃO GERADA
Inclua o enunciado original do exercício 12
para completar esta página do gabarito.
```

**Ponto de atenção**

A lacuna foi mantida para preservar a numeração do material.

---

### 013. Enunciado não fornecido

> ⚠️ **Sem enunciado no material de origem** — escrever do zero a partir do tópico do módulo.

**Solução de referência (Portugol)**

```
SEM SOLUÇÃO GERADA
Inclua o enunciado original do exercício 13
para completar esta página do gabarito.
```

**Ponto de atenção**

A lacuna foi mantida para preservar a numeração do material.

---

### 014. Troca de valores

**Enunciado**

Leia dois valores inteiros, armazene-os em A e B e troque seus conteúdos.
Ao final, mostre os valores depois da troca.

**Regra / Requisito**

Faça a troca utilizando uma variável auxiliar.

**Exemplo de execução**

```
A:
B:
Depois da troca:
A:
B:
```

**Teste seu programa**

```
A inicial B inicial A final B final
1 2 2 1
-5 10 10 -5
7 7 7 7
```

**Verificação final**

Faça a troca duas vezes consecutivas e confirme que A e B retornam aos valores originais.

**Solução de referência (Portugol)**

```
algoritmo "troca_valores"
var a, b, aux: inteiro
inicio
  leia(a, b)
  aux <- a
  a <- b
  b <- aux
  escreva("A: ", a, " B: ", b)
fimalgoritmo
```

**Ponto de atenção**

Duas trocas consecutivas restauram os valores originais.

---

### 015. Custo final da compra

**Enunciado**

Leia o preço unitário de um produto, a quantidade comprada e o valor do frete. Mostre o
subtotal dos produtos e o valor total da compra.

**Regra / Requisito**

Subtotal = preço unitário x quantidade.
Total = subtotal + frete.

**Exemplo de execução**

```
Preço unitário:
Quantidade:
Frete:
Subtotal:
Total:
```

**Teste seu programa**

```
Preço unitário Quantidade Frete Total esperado
R$ 10,00 3 R$ 5,00 R$ 35,00
R$ 49,90 2 R$ 0,00 R$ 99,80
R$ 7,50 10 R$ 12,00 R$ 87,00
```

**Verificação final**

Subtraia o subtotal do valor total e confirme que a diferença corresponde exatamente ao frete.

**Solução de referência (Portugol)**

```
algoritmo "custo_compra"
var preco, frete, subtotal, total: real
var quantidade: inteiro
inicio
  leia(preco, quantidade, frete)
  subtotal <- preco * quantidade
  total <- subtotal + frete
  escreva("Subtotal: R$ ", subtotal)
  escreva("Total: R$ ", total)
fimalgoritmo
```

**Ponto de atenção**

Total menos subtotal deve resultar no frete.

---

## Módulo 02 — Estruturas Condicionais

### 016. Positivo, negativo ou zero

**Enunciado**

Leia um número real e informe se ele é positivo, negativo ou igual a zero.

**Exemplo de execução**

```
Digite um número:
Resultado:
```

**Teste seu programa**

```
Entrada Resultado esperado
12 POSITIVO
-0,5 NEGATIVO
0 ZERO
```

**Verificação final**

Garanta que toda entrada produza uma única classificação e que o zero não seja
tratado como positivo nem negativo.

**Solução de referência (Portugol)**

```
algoritmo "sinal_numero"
var n: real
inicio
  leia(n)
  se n > 0 entao
    escreva("POSITIVO")
  senao se n < 0 entao
    escreva("NEGATIVO")
  senao
    escreva("ZERO")
  fimse
fimalgoritmo
```

**Ponto de atenção**

O zero não é positivo nem negativo.

---

### 017. Par ou ímpar

**Enunciado**

Leia um número inteiro e informe se ele é par ou ímpar.

**Regra / Requisito**

Um número é par quando o resto da divisão por 2 é igual a zero.

**Exemplo de execução**

```
Digite um número:
Resultado:
```

**Teste seu programa**

```
Entrada Resultado esperado
13 ÍMPAR
0 PAR
-8 PAR
```

**Verificação final**

Inclua números negativos nos testes; a paridade depende do resto da divisão,
não do sinal do número.

**Solução de referência (Portugol)**

```
algoritmo "par_impar"
var n: inteiro
inicio
  leia(n)
  se n mod 2 = 0 entao
    escreva("PAR")
  senao
    escreva("ÍMPAR")
  fimse
fimalgoritmo
```

**Ponto de atenção**

Zero e números negativos pares também satisfazem resto zero.

---

### 018. Maior de dois números

**Enunciado**

Leia dois números reais e mostre qual deles é o maior. Se os valores forem iguais,
informe que não existe maior.

**Exemplo de execução**

```
Primeiro valor:
Segundo valor:
Maior valor:
```

**Teste seu programa**

```
Valor 1 Valor 2 Resultado esperado
4 9 9
E) -8 -2
5 5 VALORES IGUAIS
```

**Verificação final**

Teste dois valores iguais e confirme que o programa informa a igualdade em vez de
escolher arbitrariamente um maior.

**Solução de referência (Portugol)**

```
algoritmo "maior_de_dois"
var a, b: real
inicio
  leia(a, b)
  se a > b entao
    escreva(a)
  senao se b > a entao
    escreva(b)
  senao
    escreva("VALORES IGUAIS")
  fimse
fimalgoritmo
```

**Ponto de atenção**

Nenhum valor é maior quando ambos são iguais.

---

### 019. Maior e menor de três números

**Enunciado**

Leia três números reais e mostre o maior e o menor valor informado.

**Regra / Requisito**

O programa deve funcionar também quando houver valores repetidos.

**Teste seu programa**

```
Valores Maior Menor
3, 9,5 9 3
-4,-1,-7 a al
6,6, 2 6 2
```

**Verificação final**

Use valores repetidos e confirme que o maior e o menor ainda pertencem ao conjunto informado.

**Solução de referência (Portugol)**

```
algoritmo "maior_menor_tres"
var a, b, c, maior, menor: real
inicio
  leia(a, b, c)
  maior <- a
  menor <- a
  se b > maior entao maior <- b fimse
  se c > maior entao maior <- c fimse
  se b < menor entao menor <- b fimse
  se c < menor entao menor <- c fimse
  escreva("Maior: ", maior)
  escreva("Menor: ", menor)
fimalgoritmo
```

**Ponto de atenção**

A inicialização com a entrada evita erros com conjuntos negativos.

---

### 020. Três valores em ordem crescente

**Enunciado**

Leia três números inteiros e mostre os valores em ordem crescente.

**Regra / Requisito**

Aceite valores repetidos.

**Exemplo de execução**

```
Valores:
Ordem crescente:
```

**Teste seu programa**

```
Entrada Saída esperada
3, 1,2 112,63
td 4 4,7
-1, 5,0 =5, =1, 0
```

**Verificação final**

Compare a lista antes e depois da ordenação: nenhum valor pode desaparecer ou ser duplicado.

**Solução de referência (Portugol)**

```
algoritmo "ordem_crescente"
var a, b, c, aux: inteiro
inicio
  leia(a, b, c)
  se a > b entao aux <- a; a <- b; b <- aux fimse
  se a > c entao aux <- a; a <- c; c <- aux fimse
  se b > c entao aux <- b; b <- c; c <- aux fimse
  escreva(a, ", ", b, ", ", c)
fimalgoritmo
```

**Ponto de atenção**

As trocas preservam valores repetidos.

---

### 021. Aprovado ou reprovado

**Enunciado**

Leia duas notas, calcule a média e informe se o aluno foi aprovado ou reprovado.

**Regra / Requisito**

Para este exercício, média maior ou igual a 7,0 significa APROVADO.
Abaixo de 7,0 significa REPROVADO.

**Exemplo de execução**

```
Nota 1:
Nota 2:
Média:
Situação:
```

**Teste seu programa**

```
Nota 1 Nota 2 Média Situação
5,0 8,0 6,5 REPROVADO
7,0 7,0 7,0 APROVADO
10,0 9,0 9,5 APROVADO
```

**Verificação final**

Teste uma média exatamente no limite de aprovação para confirmar de qual lado da regra
o valor pertence.

**Solução de referência (Portugol)**

```
algoritmo "aprovacao"
var n1, n2, media: real
inicio
  leia(n1, n2)
  media <- (n1 + n2) / 2
  se media >= 7 entao
    escreva("APROVADO")
  senao
    escreva("REPROVADO")
  fimse
fimalgoritmo
```

**Ponto de atenção**

Média exatamente 7 pertence à aprovação.

---

### 022. Situação do aluno por faixa

**Enunciado**

Leia duas notas, calcule a média e informe a situação do aluno conforme a tabela.
REGRAS DO EXERCÍCIO
Média Situação
Menor que 5,0 REPROVADO
Maior ou igual a 5,0 e menor que 7,0 RECUPERAÇÃO
Maior ou igual a 7,0 APROVADO

**Exemplo de execução**

```
Nota 1:
Nota 2:
Média:
Situação:
```

**Teste seu programa**

```
Notas Resultado esperado
4,0e5,0 Média 4,5 — REPROVADO
5,0e 5,0 Média 5,0 — RECUPERAÇÃO
7,0e7,0 Média 7,0 — APROVADO
```

**Verificação final**

Valide valores exatamente sobre cada limite das faixas; nenhum deles pode ficar
sem classificação ou cair em duas situações.

**Solução de referência (Portugol)**

```
algoritmo "situacao_aluno"
var n1, n2, media: real
inicio
  leia(n1, n2)
  media <- (n1 + n2) / 2
  se media < 5 entao
    escreva("REPROVADO")
  senao se media < 7 entao
    escreva("RECUPERAÇÃO")
  senao
    escreva("APROVADO")
  fimse
fimalgoritmo
```

**Ponto de atenção**

A ordem das condições cobre os limites 5 e 7 sem sobreposição.

---

### 023. Categoria de votação

**Enunciado**

Leia a idade de uma pessoa e informe a categoria de votação conforme as regras didáticas da tabela.
REGRAS DO EXERCÍCIO
Idade Categoria
Menor de 16 anos NÃO PODE VOTAR
16 ou 17 anos VOTO OPCIONAL
De 18 a 69 anos VOTO OBRIGATÓRIO
70 anos ou mais VOTO OPCIONAL

**Teste seu programa**

```
Idade Resultado esperado
15 NÃO PODE VOTAR
16 VOTO OPCIONAL
18 VOTO OBRIGATÓRIO
70 VOTO OPCIONAL
```

**Verificação final**

Teste as idades que marcam a mudança de categoria e confirme que cada limite foi
tratado de forma inclusiva ou exclusiva conforme a tabela.

**Solução de referência (Portugol)**

```
algoritmo "categoria_votacao"
var idade: inteiro
inicio
  leia(idade)
  se idade < 16 entao
    escreva("NÃO PODE VOTAR")
  senao se idade < 18 entao
    escreva("VOTO OPCIONAL")
  senao se idade < 70 entao
    escreva("VOTO OBRIGATÓRIO")
  senao
    escreva("VOTO OPCIONAL")
  fimse
fimalgoritmo
```

**Ponto de atenção**

Teste os limites 16, 18 e 70.

---

### 024. Ano bissexto

**Enunciado**

Leia um ano inteiro e informe se ele é bissexto.

**Regra / Requisito**

Um ano é bissexto quando é divisível por 400, ou quando é divisível por 4 e não é divisível por 100.

**Exemplo de execução**

```
Ano:
Resultado:
```

**Teste seu programa**

```
Ano Resultado esperado
2024 BISSEXTO
1900 NÃO BISSEXTO
2000 BISSEXTO
2023 NÃO BISSEXTO
```

**Verificação final**

Use 1900 e 2000 como casos críticos: 1900 não é bissexto, enquanto 2000 é bissexto.

**Solução de referência (Portugol)**

```
algoritmo "ano_bissexto"
var ano: inteiro
var bissexto: logico
inicio
  leia(ano)
  bissexto <- (ano mod 400 = 0) ou
              ((ano mod 4 = 0) e (ano mod 100 <> 0))
  se bissexto entao
    escreva("BISSEXTO")
  senao
    escreva("NÃO BISSEXTO")
  fimse
fimalgoritmo
```

**Ponto de atenção**

1900 não é bissexto; 2000 é bissexto.

---

### 025. Preço conforme a forma de pagamento

**Enunciado**

Leia o preço de um produto e a opção de pagamento. Calcule e mostre o valor final conforme a tabela.
REGRAS DO EXERCÍCIO
Opção Forma de pagamento Alteração
1 Dinheiro ou Pix 10% de desconto
2 Débito 5% de desconto
3 Crédito à vista Sem alteração
4 Crédito parcelado 8% de acréscimo

**Exemplo de execução**

```
Preço:
Opção:
Valor final:
```

**Teste seu programa**

```
Preço Opção Valor final
R$ 100,00 2 R$ 95,00
R$ 100,00 3 R$ 100,00
R$ 100,00 4 R$ 108,00
```

**Verificação final**

Execute uma compra para cada opção de pagamento e confira individualmente o percentual
ou acréscimo aplicado.

**Solução de referência (Portugol)**

```
algoritmo "forma_pagamento"
var preco, final: real
var opcao: inteiro
inicio
  leia(preco, opcao)
  escolha opcao
    caso 1: final <- preco * 0.90
    caso 2: final <- preco * 0.95
    caso 3: final <- preco
    caso 4: final <- preco * 1.08
    outrocaso: escreva("OPÇÃO INVÁLIDA"); pare
  fimescolha
  escreva("Valor final: R$ ", final)
fimalgoritmo
```

**Ponto de atenção**

Cada opção aplica uma única alteração ao preço original.

---

### 026. Reajuste por faixa salarial

**Enunciado**

Leia o salário atual e calcule o novo salário conforme a tabela de reajuste.

**Regra / Requisito**

Mostre o percentual aplicado, o valor do aumento e o novo salário.
REGRAS DO EXERCÍCIO
Salário atual Reajuste
Até R$ 1.500,00 15%
De R$ 1.500,01 até R$ 3.000,00 10%
, Acima de R$ 3.000,00 5%

**Teste seu programa**

```
Salário atual Percentual Novo salário
R$ 1.500,00 15% R$ 1.725,00
R$ 3.000,00 10% R$ 3.300,00
R$ 4.000,00 5% R$ 4.200,00
```

**Verificação final**

Teste salários exatamente iguais aos limites das faixas para impedir sobreposição
ou ausência de reajuste.

**Solução de referência (Portugol)**

```
algoritmo "reajuste_faixa"
var salario, taxa, aumento, novo: real
inicio
  leia(salario)
  se salario <= 1500 entao
    taxa <- 0.15
  senao se salario <= 3000 entao
    taxa <- 0.10
  senao
    taxa <- 0.05
  fimse
  aumento <- salario * taxa
  novo <- salario + aumento
  escreva("Percentual: ", taxa * 100, "%")
  escreva("Aumento: R$ ", aumento)
  escreva("Novo salário: R$ ", novo)
fimalgoritmo
```

**Ponto de atenção**

Use comparações inclusivas nos limites das faixas.

---

### 027. Classificação de IMC

**Enunciado**

Leia o peso em quilogramas e a altura em metros. Calcule o IMC e
classifique o resultado usando apenas as regras didáticas da tabela.

**Regra / Requisito**

IMC = peso + (altura x altura). |
REGRAS DO EXERCÍCIO
IMC Classificação do exercício
Menor que 18,5 ABAIXO DA FAIXA
Maior ou igual a 18,5 e menor que 25,0 FAIXA NORMAL
Maior ou igual a 25,0 e menor que 30,0 ACIMA DA FAIXA
Maior ou igual a 30,0 FAIXA ELEVADA

**Exemplo de execução**

```
Peso: 72 kg
Altura: 1,80 m
IMC:
Classificação:
```

**Teste seu programa**

```
Peso Altura Classificação esperada
50 kg 1,70m ABAIXO DA FAIXA
80 kg 1,80m FAIXA NORMAL
90 kg 1,70m FAIXA ELEVADA
```

**Verificação final**

Calcule primeiro o valor numérico do IMC e só depois classifique; peso ou altura
isolados não determinam a faixa.

**Solução de referência (Portugol)**

```
algoritmo "classificacao_imc"
var peso, altura, imc: real
inicio
  leia(peso, altura)
  imc <- peso / (altura * altura)
  se imc < 18.5 entao
    escreva("ABAIXO DA FAIXA")
  senao se imc < 25 entao
    escreva("FAIXA NORMAL")
  senao se imc < 30 entao
    escreva("ACIMA DA FAIXA")
  senao
    escreva("FAIXA ELEVADA")
  fimse
fimalgoritmo
```

**Ponto de atenção**

A classificação depende do IMC, não do peso ou altura isolados.

---

### 028. É possível formar um triângulo?

**Enunciado**

Leia três medidas positivas e informe se elas podem formar um triângulo.

**Regra / Requisito**

Três lados formam um triângulo quando cada lado é menor que a soma dos outros dois.

**Exemplo de execução**

```
Lados: 3, 4 e 5
Resultado:
```

**Teste seu programa**

```
Lados Resultado esperado
20,3 FORMAM
1,23 NÃO FORMAM
5,5, 10 NÃO FORMAM
```

**Verificação final**

Verifique as três desigualdades do triângulo; aprovar apenas uma ou duas
comparações não é suficiente.

**Solução de referência (Portugol)**

```
algoritmo "forma_triangulo"
var a, b, c: real
inicio
  leia(a, b, c)
  se (a < b + c) e (b < a + c) e (c < a + b) entao
    escreva("FORMAM UM TRIÂNGULO")
  senao
    escreva("NÃO FORMAM")
  fimse
fimalgoritmo
```

**Ponto de atenção**

A igualdade não basta: cada lado deve ser estritamente menor que a soma dos outros.

---

### 029. Tipo de triângulo

**Enunciado**

Leia três medidas. Primeiro verifique se elas formam um triângulo.
Se formarem, classifique-o como equilátero, isósceles ou escaleno.
REGRAS DO EXERCÍCIO
Relação entre os lados Tipo
Três lados iguais EQUILÁTERO
Dois lados iguais ISÓSCELES
Três lados diferentes ESCALENO

**Teste seu programa**

```
Lados Resultado esperado
5,5,5 EQUILÁTERO
5,5,3 ISÓSCELES
3,4,5 ESCALENO
1,2,3 NÃO FORMA TRIÂNGULO
```

**Verificação final**

Tente classificar medidas que não formam um triângulo e confirme que nenhum
tipo é informado nesse caso.

**Solução de referência (Portugol)**

```
algoritmo "tipo_triangulo"
var a, b, c: real
inicio
  leia(a, b, c)
  se nao ((a < b + c) e (b < a + c) e (c < a + b)) entao
    escreva("NÃO FORMA TRIÂNGULO")
  senao se (a = b) e (b = c) entao
    escreva("EQUILÁTERO")
  senao se (a = b) ou (a = c) ou (b = c) entao
    escreva("ISÓSCELES")
  senao
    escreva("ESCALENO")
  fimse
fimalgoritmo
```

**Ponto de atenção**

Somente triângulos válidos recebem uma classificação de tipo.

---

### 030. Aprovação de empréstimo

**Enunciado**

Leia o valor de um imóvel, o salário mensal do comprador e o prazo de pagamento em anos.
Calcule a prestação mensal e informe se o empréstimo foi aprovado.

**Regra / Requisito**

Prestação = valor do imóvel + (anos x 12).
O empréstimo é aprovado quando a prestação não ultrapassa 30% do salário.

**Exemplo de execução**

```
Valor do imóvel:
Salário:
Prazo:
Prestação:
Limite:
Resultado:
```

**Teste seu programa**

```
Imóvel Salário Anos Resultado
R$ 120.000 R$ 2.000 20 APROVADO
R$ 300.000 R$ 3.000 5 NEGADO
R$ 216.000 R$ 2.000 30 APROVADO
```

**Verificação final**

Confirme que o prazo em anos foi convertido para meses antes de calcular a prestação
e comparar o limite salarial.

**Solução de referência (Portugol)**

```
algoritmo "emprestimo"
var imovel, salario, prestacao, limite: real
var anos: inteiro
inicio
  leia(imovel, salario, anos)
  prestacao <- imovel / (anos * 12)
  limite <- salario * 0.30
  escreva("Prestação: R$ ", prestacao)
  escreva("Limite: R$ ", limite)
  se prestacao <= limite entao
    escreva("APROVADO")
  senao
    escreva("NEGADO")
  fimse
fimalgoritmo
```

**Ponto de atenção**

Converta anos em meses antes de calcular a prestação.

---

### 031. Divisível por 3 e por 5

**Enunciado**

Leia um número inteiro e informe em qual situação ele se encontra.
REGRAS DO EXERCÍCIO
Situação Saída
Divisível por 3 e por 5 DIVISÍVEL POR 3 E 5
Apenas por 3 DIVISÍVEL APENAS POR 3
Apenas por 5 DIVISÍVEL APENAS POR 5
Por nenhum dos dois NÃO DIVISÍVEL POR 3 NEM 5

**Teste seu programa**

```
Entrada Resultado esperado
30 DIVISÍVEL POR 3 E 5
9 APENAS POR 3
20 APENAS POR 5
7 POR NENHUM
```

**Verificação final**

Inclua quatro casos: divisível por ambos, somente por 3, somente por 5 e por nenhum deles.

**Solução de referência (Portugol)**

```
algoritmo "divisibilidade_3_5"
var n: inteiro
var d3, d5: logico
inicio
  leia(n)
  d3 <- n mod 3 = 0
  d5 <- n mod 5 = 0
  se d3 e d5 entao
    escreva("DIVISÍVEL POR 3 E 5")
  senao se d3 entao
    escreva("DIVISÍVEL APENAS POR 3")
  senao se d5 entao
    escreva("DIVISÍVEL APENAS POR 5")
  senao
    escreva("NÃO DIVISÍVEL POR 3 NEM 5")
  fimse
fimalgoritmo
```

**Ponto de atenção**

Teste primeiro a condição conjunta.

---

### 032. Número dentro do intervalo

**Enunciado**

Leia um número real e informe se ele está dentro do intervalo fechado de 10 até 20.

**Regra / Requisito**

Os valores 10 e 20 pertencem ao intervalo.

**Teste seu programa**

```
Entrada Resultado esperado |
10 DENTRO
15,5 DENTRO
20 DENTRO
20,1 FORA
```

**Verificação final**

Teste exatamente 10 e 20; como o intervalo é fechado,
os dois limites devem ser considerados internos.

**Solução de referência (Portugol)**

```
algoritmo "intervalo_fechado"
var n: real
inicio
  leia(n)
  se (n >= 10) e (n <= 20) entao
    escreva("DENTRO")
  senao
    escreva("FORA")
  fimse
fimalgoritmo
```

**Ponto de atenção**

Os valores 10 e 20 pertencem ao intervalo.

---

### 033. Dia da semana

**Enunciado**

Leia um número de 1 a 7 e mostre o dia da semana correspondente.
Para qualquer outro valor, mostre OPÇÃO INVÁLIDA.
TABELA DE REFERÊNCIA
Número Dia
1 SEGUNDA-FEIRA
2 TERÇA-FEIRA
3 QUARTA-FEIRA
4 QUINTA-FEIRA
5 SEXTA-FEIRA
6 SÁBADO
| o DOMINGO

**Teste seu programa**

```
Entrada Resultado esperado
1 SEGUNDA-FEIRA
6 SÁBADO
7 DOMINGO
9 OPÇÃO INVÁLIDA
```

**Verificação final**

Use O e 8 para confirmar que valores fora de 1 a 7 produzem
a mensagem de opção inválida.

**Solução de referência (Portugol)**

```
algoritmo "dia_semana"
var n: inteiro
inicio
  leia(n)
  escolha n
    caso 1: escreva("SEGUNDA-FEIRA")
    caso 2: escreva("TERÇA-FEIRA")
    caso 3: escreva("QUARTA-FEIRA")
    caso 4: escreva("QUINTA-FEIRA")
    caso 5: escreva("SEXTA-FEIRA")
    caso 6: escreva("SÁBADO")
    caso 7: escreva("DOMINGO")
    outrocaso: escreva("OPÇÃO INVÁLIDA")
  fimescolha
fimalgoritmo
```

**Ponto de atenção**

Valores fora de 1 a 7 devem produzir opção inválida.

---

### 034. Quantidade de dias do mês

**Enunciado**

Leia o número de um mês e um ano. Mostre quantos dias o mês possui.

**Regra / Requisito**

Meses 1, 3, 5, 7, 8, 10 e 12 possuem 31 dias.
Meses 4, 6, 9 e 11 possuem 30 dias.
Fevereiro possui 28 dias, ou 29 em ano bissexto.

**Teste seu programa**

```
Mês Ano Resultado esperado
2 2024 29 dias
2 2023 28 dias
4 2026 30 dias
12 2026 31 dias
13 2026 MÊS INVÁLIDO
```

**Verificação final**

Confira fevereiro em um ano comum e em um ano bissexto, além de
um mês com 30 e outro com 31 dias.

**Solução de referência (Portugol)**

```
algoritmo "dias_mes"
var mes, ano, dias: inteiro
var bissexto: logico
inicio
  leia(mes, ano)
  se (mes < 1) ou (mes > 12) entao
    escreva("MÊS INVÁLIDO")
  senao
    bissexto <- (ano mod 400 = 0) ou
                  ((ano mod 4 = 0) e (ano mod 100 <> 0))
    se mes = 2 entao
       se bissexto entao dias <- 29 senao dias <- 28 fimse
    senao se (mes = 4) ou (mes = 6) ou
              (mes = 9) ou (mes = 11) entao
       dias <- 30
    senao
       dias <- 31
    fimse
    escreva(dias, " dias")
  fimse
fimalgoritmo
```

**Ponto de atenção**

Fevereiro depende da regra completa de ano bissexto.

---

### 035. Valor do ingresso

**Enunciado**

O ingresso custa R$ 30,00. Leia a idade e informe se a pessoa é estudante.
Calcule o valor final conforme as regras.

**Regra / Requisito**

Paga meia-entrada quem tiver menos de 12 anos, quem for estudante ou quem tiver 60 anos ou mais.
O desconto é de 50% e não é acumulativo.

**Exemplo de execução**

```
Idade: 20
Estudante:
Valor do ingresso:
```

**Teste seu programa**

```
Idade Estudante Valor esperado
10 NÃO R$ 15,00
25 SIM R$ 15,00
65 NÃO R$ 15,00
30 NÃO R$ 30,00
```

**Verificação final**

Teste alguém que satisfaça mais de uma condição de meia-entrada e confirme
que o desconto de 50% não é acumulado.

**Solução de referência (Portugol)**

```
algoritmo "valor_ingresso"
var idade: inteiro
var estudante: caractere
var preco: real
inicio
  leia(idade, estudante)
  preco <- 30
  se (idade < 12) ou (estudante = "SIM") ou (idade >= 60) entao
    preco <- preco / 2
  fimse
  escreva("Valor: R$ ", preco)
fimalgoritmo
```

**Ponto de atenção**

O desconto é único, mesmo quando mais de uma condição é satisfeita.

---

## Módulo 03 — Estruturas De Repetição

### 036. Contagem de 1 até 10

**Enunciado**

Escreva um programa que mostre os números inteiros de 1 até 10, um por linha.
Resolva utilizando uma estrutura de repetição.
EXEMPLO
EXEMPLO
RoOoco-JOS ST BwWUMNH
DDACDAMA
PROGRAMA
A saída deve começar em 1, terminar em 10 e conter exatamente 10 números.
A saída deve conter exatamente dez números, começando em 1 e terminando em 10.

**Solução de referência (Portugol)**

```
algoritmo "contagem_1_10"
var i: inteiro
inicio
  para i de 1 ate 10 faca
    escreval(i)
  fimpara
fimalgoritmo
```

**Ponto de atenção**

A repetição executa exatamente dez vezes.

---

### 037. Contagem regressiva

**Enunciado**

Mostre os números de 10 até O em ordem decrescente. Depois da contagem, mostre a
mensagem FIM.
FOLIIGITO

**Regra / Requisito**

Resolva utilizando uma estrutura de repetição.
NONO RUAON O
PROGRAMA
A saída deve conter 11 números, começando em 10 e terminando em 0.
Conte os valores exibidos: devem aparecer 11 números, de 10 até 0,
seguidos por uma única mensagem FIM.

**Solução de referência (Portugol)**

```
algoritmo "contagem_regressiva"
var i: inteiro
inicio
  para i de 10 ate 0 passo -1 faca
    escreval(i)
  fimpara
  escreva("FIM")
fimalgoritmo
```

**Ponto de atenção**

Há 11 números na contagem, incluindo 10 e 0.

---

### 038. Contagem até um limite

**Enunciado**

Leia um número inteiro positivo N e mostre todos os números de 1 até N.

**Regra / Requisito**

Considere N maior ou igual a 1.

**Teste seu programa**

```
N Saída esperada
1 1
4 1234
7 1234567
```

**Verificação final**

Use N = 1 como caso mínimo e confirme que a saída contém somente o número 1.

**Solução de referência (Portugol)**

```
algoritmo "contagem_limite"
var n, i: inteiro
inicio
  leia(n)
  para i de 1 ate n faca
    escreva(i, " ")
  fimpara
fimalgoritmo
```

**Ponto de atenção**

Para N igual a 1, a saída contém somente 1.

---

### 039. Números pares de 1 até 100

**Enunciado**

Mostre todos os números pares de 1 até 100.
REQUISITO £o3
Use uma estrutura de repetição. Não escreva os números manualmente.

**Exemplo de execução**

```
2:46 810 .4. 96 98) 100
TESTE SEU PROGRAMA >
A saída deve conter 50 números; o primeiro deve ser 2 (o
e o último deve ser 100.
VERIFICAÇÃO FINAL r:
Confirme que a sequência começa em 2, termina em 100
e contém exatamente 50 números pares.
```

**Solução de referência (Portugol)**

```
algoritmo "pares_1_100"
var i: inteiro
inicio
  para i de 2 ate 100 passo 2 faca
    escreva(i, " ")
  fimpara
fimalgoritmo
```

**Ponto de atenção**

A sequência começa em 2, termina em 100 e contém 50 valores.

---

### 040. Números ímpares de 1 até 100

**Enunciado**

Mostre todos os números ímpares de 1 até 100.

**Regra / Requisito**

Use uma estrutura de repetição. Não escreva os números manualmente.

**Exemplo de execução**

```
LB cos a
```

**Teste seu programa**

```
À saída deve conter 50 números; o primeiro deve ser 1 e o último deve ser 99.
```

**Verificação final**

Confirme que a sequência começa em 1, termina em 99 e não inclui nenhum valor par.

**Solução de referência (Portugol)**

```
algoritmo "impares_1_100"
var i: inteiro
inicio
  para i de 1 ate 99 passo 2 faca
    escreva(i, " ")
  fimpara
fimalgoritmo
```

**Ponto de atenção**

O último número ímpar menor ou igual a 100 é 99.

---

### 041. Tabuada de um número

**Enunciado**

Leia um número inteiro e mostre sua tabuada de 1 até 10.
x
x
x
x
x
x
x
x
x
x
| Entrada | Primeira linha | Última linha
| 3 | 3x1=3 3x 10=30
Ê 0 | 0x1=0 0x10=0 |
E —
[ -2 | -2x1=-2 -2 x 10 = -20

**Verificação final**

A tabuada deve produzir dez linhas: a primeira com multiplicador 1
e a última com multiplicador 10.

**Solução de referência (Portugol)**

```
algoritmo "tabuada"
var n, i: inteiro
inicio
  leia(n)
  para i de 1 ate 10 faca
    escreval(n, " x ", i, " = ", n * i)
  fimpara
fimalgoritmo
```

**Ponto de atenção**

A lógica funciona igualmente para zero e números negativos.

---

### 042. Tabuada com início e fim

**Enunciado**

Modifique o programa anterior para que o usuário também informe o multiplicador inicial e o
multiplicador final da tabuada.

**Regra / Requisito**

O programa deve funcionar tanto quando o início for menor quanto quando for maior que o fim.

**Exemplo de execução**

```
Número: 4
Início: 3
Fim: 6
```

**Teste seu programa**

```
Número Início Fim Quantidade de linhas
5 1 3 3
2 4 1 4
7 5 5 1
```

**Verificação final**

Teste início maior que fim e confirme que a contagem é decrescente, inclusiva e possui
a quantidade correta de linhas.

**Solução de referência (Portugol)**

```
algoritmo "tabuada_intervalo"
var n, inicioM, fimM, i, passo: inteiro
inicio
  leia(n, inicioM, fimM)
  se inicioM <= fimM entao passo <- 1 senao passo <- -1 fimse
  i <- inicioM
  enquanto verdadeiro faca
    escreval(n, " x ", i, " = ", n * i)
    se i = fimM entao interrompa fimse
    i <- i + passo
  fimenquanto
fimalgoritmo
```

**Ponto de atenção**

O percurso é inclusivo e funciona também quando início é maior que fim.

---

### 043. Somatório de 1 até N

**Enunciado**

Leia um número inteiro positivo N e calcule a soma de todos os números de 1 até N.

**Exemplo de execução**

```
N: 5
Soma: 15
```

**Teste seu programa**

```
N Soma esperada
1 1
10 55
100 5050
```

**Verificação final**

Compare o resultado com N x (N + 1) + 2 para validar o acumulador do somatório.

**Solução de referência (Portugol)**

```
algoritmo "somatorio_1_n"
var n, i, soma: inteiro
inicio
  leia(n)
  soma <- 0
  para i de 1 ate n faca
    soma <- soma + i
  fimpara
  escreva("Soma: ", soma)
fimalgoritmo
```

**Ponto de atenção**

Confira com N x (N + 1) / 2.

---

### 044. Fatorial

**Enunciado**

Leia um número inteiro não negativo e calcule o seu fatorial.

**Regra / Requisito**

0! = 1. Para N maior que zero: N'=N x (N = 1) x... x 1.

**Exemplo de execução**

```
Número: 5
5! = 120
```

**Teste seu programa**

```
Entrada Resultado esperado
0 1
1 1
6 720
```

**Verificação final**

Inclua o caso 0! e confirme que o resultado é 1, sem executar multiplicações indevidas.

**Solução de referência (Portugol)**

```
algoritmo "fatorial"
var n, i: inteiro
var fat: inteiro_longo
inicio
  leia(n)
  fat <- 1
  para i de 2 ate n faca
    fat <- fat * i
  fimpara
  escreva(n, "! = ", fat)
fimalgoritmo
```

**Ponto de atenção**

A inicialização em 1 trata corretamente 0! e 1!.

---

### 045. Sequência de Fibonacci

**Enunciado**

Leia a quantidade de termos e mostre os primeiros valores da sequência de Fibonacci.

**Regra / Requisito**

Considere FO = O e F1 = 1. Cada termo seguinte é a soma dos dois anteriores.

**Exemplo de execução**

```
Quantidade de termos: 8
(O) Ab AL e) do do als)
```

**Teste seu programa**

```
Termos Saída esperada
2 01
5 01128
7 0112358
```

**Verificação final**

Solicite apenas um ou dois termos e confirme que a sequência não exibe valores
além da quantidade pedida.

**Solução de referência (Portugol)**

```
algoritmo "sequencia_fibonacci"
var termos, i: inteiro
var a, b, proximo: inteiro_longo
inicio
  leia(termos)
  a <- 0
  b <- 1
  para i de 1 ate termos faca
    escreva(a, " ")
    proximo <- a + b
    a <- b
    b <- proximo
  fimpara
fimalgoritmo
```

**Ponto de atenção**

O laço exibe um termo antes de avançar a sequência.

---

### 046. Soma de cinco valores

**Enunciado**

Leia cinco números reais e mostre a soma total ao final.

**Exemplo de execução**

```
Valores: 8, 3, -2, 10, 1
Soma: 20
```

**Teste seu programa**

```
Valores Soma esperada
1,,2,3,4,5 15
=B; 4, =3; 2-1 -15
0,0,0,0,0 0
```

**Verificação final**

Conte as leituras: exatamente cinco valores devem participar da soma,
e o total deve aparecer somente ao final.
náo Pr 4. 4nn

**Solução de referência (Portugol)**

```
algoritmo "soma_cinco"
var i: inteiro
var valor, soma: real
inicio
  soma <- 0
  para i de 1 ate 5 faca
    leia(valor)
    soma <- soma + valor
  fimpara
  escreva("Soma: ", soma)
fimalgoritmo
```

**Ponto de atenção**

O acumulador deve começar em zero.

---

### 047. Média de dez notas

**Enunciado**

Leia dez notas reais e mostre a média aritmética da turma.

**Regra / Requisito**

Considere notas entre O e 10.

**Exemplo de execução**

```
Notas 77 8, 65 9,57 1078, 6;04
Média: 7,0
```

**Teste seu programa**

```
Conjunto de teste Média esperada
Dez notas iguais a 10 10,0
Dez notas iguais a O 0,0
55.5, 65,6, 75:7,/81 8,19, 9 7,0
```

**Verificação final**

Confira se a soma das dez notas foi dividida por 10, mesmo quando
alguns valores se repetirem.

**Solução de referência (Portugol)**

```
algoritmo "media_dez_notas"
var i: inteiro
var nota, soma, media: real
inicio
  soma <- 0
  para i de 1 ate 10 faca
    leia(nota)
    soma <- soma + nota
  fimpara
  media <- soma / 10
  escreva("Média: ", media)
fimalgoritmo
```

**Ponto de atenção**

Valores repetidos continuam contando como dez leituras distintas.

---

### 048. Positivos, negativos e zeros

**Enunciado**

Leia oito números inteiros. Ao final, mostre quantos são positivos, quantos são negativos e quantos
são iguais a zero.

**Exemplo de execução**

```
Valores: 7, -2, 0, 11, -5,0,3,-1
Positivos: 3
Negativos: 3
Zeros: 2
```

**Teste seu programa**

```
Valores Positivos Negativos Zeros
1,2,3,4,5,6,7,8 8 0 0
-1,-2,-3,-4,0,0,0,0 0 4 4
| é
```

**Verificação final**

| A soma dos três contadores — positivos, negativos e zeros — deve ser exatamente 8.

**Solução de referência (Portugol)**

```
algoritmo "contar_sinais"
var i, n, positivos, negativos, zeros: inteiro
inicio
  positivos <- 0; negativos <- 0; zeros <- 0
  para i de 1 ate 8 faca
    leia(n)
    se n > 0 entao
       positivos <- positivos + 1
    senao se n < 0 entao
       negativos <- negativos + 1
    senao
       zeros <- zeros + 1
    fimse
  fimpara
  escreva(positivos, negativos, zeros)
fimalgoritmo
```

**Ponto de atenção**

A soma dos três contadores deve ser 8.

---

### 049. Pares e ímpares

**Enunciado**

Leia seis números inteiros. Ao final, mostre quantos são pares e quantos são ímpares.

**Exemplo de execução**

```
Valores: 8, 9,5, 10, 12; 7
Pares: 3
Ímpares: 3
```

**Teste seu programa**

```
Valores Pares Ímpares
2,4,6, 8, 10, 12 6 0
t, 3 54 4,9,.1 0 6
0,-2,-3,5,8,9 3 3
```

**Verificação final**

A soma dos contadores de pares e ímpares deve ser 6; lembre-se de que zero é par.

**Solução de referência (Portugol)**

```
algoritmo "contar_paridade"
var i, n, pares, impares: inteiro
inicio
  pares <- 0; impares <- 0
  para i de 1 ate 6 faca
    leia(n)
    se n mod 2 = 0 entao
       pares <- pares + 1
    senao
       impares <- impares + 1
    fimse
  fimpara
  escreva("Pares: ", pares, " Ímpares: ", impares)
fimalgoritmo
```

**Ponto de atenção**

Zero é par e pares mais ímpares deve resultar em 6.

---

### 050. Maior valor informado

**Enunciado**

Leia dez números reais e mostre o maior valor informado.

**Regra / Requisito**

Inicialize o maior valor usando a primeira entrada, e não um número fixo arbitrário.

**Exemplo de execução**

```
Valores: 12, 5, 31, 18, 9, 4, 22, 10, 7, 15
Maior valor: 31
```

**Teste seu programa**

```
Valores Maior esperado
-10, -2, -30, -4, -5, -6, -7, -8, -9, 11 -2
5, 5; B-9 D,:5;/5) 8,:5,.5 5
```

**Verificação final**

Faça um teste contendo apenas números negativos para garantir que o maior não foi
inicializado incorretamente com zero.

**Solução de referência (Portugol)**

```
algoritmo "maior_dez"
var i: inteiro
var valor, maior: real
inicio
  leia(maior)
  para i de 2 ate 10 faca
    leia(valor)
    se valor > maior entao maior <- valor fimse
  fimpara
  escreva("Maior: ", maior)
fimalgoritmo
```

**Ponto de atenção**

Não inicialize o maior com zero: o conjunto pode ser todo negativo.

---

### 051. Maior e menor valor

**Enunciado**

Leia dez números reais e mostre o maior e o menor valor informado.

**Regra / Requisito**

Inicialize maior e menor com a primeira entrada.

**Exemplo de execução**

```
Valores? 6, 18, 3; 11, 25, 4, 9, 0, 14, 2
Maior: 25
Menor: -3
```

**Teste seu programa**

```
Valores Maior Menor
1,2,3,4,5,6, 7, 8,9,10 10 1
"TB; 2,09, 3,4; +64 7; -8,+10 -1 -10
```

**Verificação final**

Use dez valores iguais e confirme que o maior e o menor são o mesmo número informado.

**Solução de referência (Portugol)**

```
algoritmo "maior_menor_dez"
var i: inteiro
var valor, maior, menor: real
inicio
  leia(valor)
  maior <- valor; menor <- valor
  para i de 2 ate 10 faca
    leia(valor)
    se valor > maior entao maior <- valor fimse
    se valor < menor entao menor <- valor fimse
  fimpara
  escreva("Maior: ", maior, " Menor: ", menor)
fimalgoritmo
```

**Ponto de atenção**

Se todos forem iguais, maior e menor terão o mesmo valor.

---

### 052. Pesquisa de idades

**Enunciado**

Leia a idade de dez pessoas. Ao final, mostre a média das idades, quantas são menores
de 18 anos e quantas têm 60 anos ou mais.

**Exemplo de execução**

```
Idades:
Média:
Menores de 18:
Com 60 anos ou mais:
```

**Teste seu programa**

```
Conjunto de teste
Resultado principal
Dez idades iguais a 20
Média 20; menores 0; 60+ O
Dez idades iguais a 70
Média 70; menores 0; 60+ 10
```

**Verificação final**

Teste as idades 18 e 60: 18 não é menor de idade, e 60 já pertence
ao grupo de pessoas com 60 anos ou mais.

**Solução de referência (Portugol)**

```
algoritmo "pesquisa_idades"
var i, idade, soma, menores, idosos: inteiro
inicio
  soma <- 0; menores <- 0; idosos <- 0
  para i de 1 ate 10 faca
    leia(idade)
    soma <- soma + idade
    se idade < 18 entao menores <- menores + 1 fimse
    se idade >= 60 entao idosos <- idosos + 1 fimse
  fimpara
  escreva("Média: ", soma / 10.0)
  escreva("Menores: ", menores, " 60+: ", idosos)
fimalgoritmo
```

**Ponto de atenção**

18 não é menor; 60 já pertence ao grupo 60+.

---

### 053. Pesquisa de alturas

**Enunciado**

Leia a altura de oito pessoas. Ao final, mostre a média, a maior altura e a menor altura.

**Exemplo de execução**

```
Alturas:
Média:
Maior:
Menor:
```

**Teste seu programa**

```
Conjunto de teste
Resultado esperado
Oito alturas iguais a 1,70
Média 1,70; maior 1,70; menor 1,70
1,50; 1,60; 1,70; 1,80; 1,90; 2,00; 1,55; 1,65
Maior 2,00; menor 1,50
```

**Verificação final**

Use oito alturas iguais e confirme que média, maior e menor altura apresentam o mesmo valor.

**Solução de referência (Portugol)**

```
algoritmo "pesquisa_alturas"
var i: inteiro
var h, soma, maior, menor: real
inicio
  leia(h)
  soma <- h; maior <- h; menor <- h
  para i de 2 ate 8 faca
    leia(h)
    soma <- soma + h
    se h > maior entao maior <- h fimse
    se h < menor entao menor <- h fimse
  fimpara
  escreva("Média: ", soma / 8)
  escreva("Maior: ", maior, " Menor: ", menor)
fimalgoritmo
```

**Ponto de atenção**

Inicializar maior e menor com a primeira altura elimina valores sentinela arbitrários.

---

### 054. Soma dos múltiplos de 3

**Enunciado**

Leia dois números inteiros A e B. Some todos os múltiplos de 3 existentes entre eles,
incluindo os limites quando aplicável.

**Regra / Requisito**

O programa deve funcionar mesmo quando A for maior que B.

**Exemplo de execução**

```
Soma dos múltiplos de 3:
```

**Teste seu programa**

```
A B Soma esperada
1 10 18
10 1 18
3 3 3
4 5 0
```

**Verificação final**

Inverta A e Be confirme que a soma não muda; inclua também um limite que seja múltiplo de 3.

**Solução de referência (Portugol)**

```
algoritmo "soma_multiplos_3"
var a, b, inicioI, fimI, i, soma: inteiro
inicio
  leia(a, b)
  inicioI <- minimo(a, b)
  fimI <- maximo(a, b)
  soma <- 0
  para i de inicioI ate fimI faca
    se i mod 3 = 0 entao soma <- soma + i fimse
  fimpara
  escreva("Soma: ", soma)
fimalgoritmo
```

**Ponto de atenção**

A ordem das entradas não altera a soma; os limites são inclusivos.

---

### 055. Progressão aritmética

**Enunciado**

Leia o primeiro termo, a razão e a quantidade de termos de uma progressão aritmética.
Mostre a sequência e a soma dos termos.

**Exemplo de execução**

```
Primeiro termo:
Razão:
Quantidade:
Sequência:
Soma:
```

**Teste seu programa**

```
Primeiro termo Razão Quantidade Sequência esperada
10 = 4 10864
5 0 3 555
1 1 5 12345
```

**Verificação final**

O último termo deve ser igual ao primeiro termo + (quantidade — 1) x razão,
e a soma deve corresponder aos termos exibidos.

**Solução de referência (Portugol)**

```
algoritmo "progressao_aritmetica"
var primeiro, razao, quantidade, i, termo, soma: inteiro
inicio
  leia(primeiro, razao, quantidade)
  termo <- primeiro
  soma <- 0
  para i de 1 ate quantidade faca
    escreva(termo, " ")
    soma <- soma + termo
    termo <- termo + razao
  fimpara
  escreva("Soma: ", soma)
fimalgoritmo
```

**Ponto de atenção**

O último termo é primeiro + (quantidade - 1) x razão.

---

### 056. Validação de nota

**Enunciado**

Leia uma nota e continue solicitando novos valores enquanto a entrada estiver fora do
intervalo de O a 10. Ao final, mostre a nota válida e a quantidade de tentativas inválidas.

**Exemplo de execução**

```
Nota:
Valor inválido.
Nota:
Valor inválido.
Nota:
Nota aceita:
Tentativas inválidas:
```

**Teste seu programa**

```
Entradas sucessivas Resultado esperado
z Nota 7; inválidas O
11,10 Nota 10; inválidas 1
-5,-1,0 Nota 0; inválidas 2
```

**Verificação final**

A quantidade de tentativas inválidas não deve incluir a primeira nota válida,
inclusive quando ela for O ou 10.

**Solução de referência (Portugol)**

```
algoritmo "validacao_nota"
var nota: real
var invalidas: inteiro
inicio
  invalidas <- 0
  leia(nota)
  enquanto (nota < 0) ou (nota > 10) faca
    escreva("Valor inválido.")
    invalidas <- invalidas + 1
    leia(nota)
  fimenquanto
  escreva("Nota aceita: ", nota)
  escreva("Tentativas inválidas: ", invalidas)
fimalgoritmo
```

**Ponto de atenção**

A primeira nota válida não entra no contador de inválidas.

---

### 057. Leitura até zero

**Enunciado**

Leia números reais até que o usuário informe zero. Ao final, mostre a quantidade
de valores, a soma e a média.

**Regra / Requisito**

O zero funciona apenas como sentinela e não entra nos cálculos.
Se nenhum valor for informado, mostre NENHUM VALOR VÁLIDO.

**Exemplo de execução**

```
Valores:
Quantidade:
Soma:
Média:
```

**Teste seu programa**

```
Entradas Resultado esperado
2,4,6,0 Quantidade 3; soma 12; média 4
=5,.5, 0 Quantidade 2; soma 0; média O
0 NENHUM VALOR VÁLIDO
```

**Verificação final**

O zero encerra a leitura e não entra na quantidade, soma ou média;
teste também o encerramento sem nenhum valor anterior.

**Solução de referência (Portugol)**

```
algoritmo "leitura_ate_zero"
var valor, soma: real
var quantidade: inteiro
inicio
  soma <- 0; quantidade <- 0
  leia(valor)
  enquanto valor <> 0 faca
    soma <- soma + valor
    quantidade <- quantidade + 1
    leia(valor)
  fimenquanto
  se quantidade = 0 entao
    escreva("NENHUM VALOR VÁLIDO")
  senao
    escreva("Quantidade: ", quantidade)
    escreva("Soma: ", soma)
    escreva("Média: ", soma / quantidade)
  fimse
fimalgoritmo
```

**Ponto de atenção**

O zero apenas encerra a leitura; não entra nos cálculos.

---

### 058. Idades até valor negativo

**Enunciado**

Leia idades até que seja informado um valor negativo. Ao final, mostre quantas idades válidas
foram digitadas, a média e quantas pessoas têm 18 anos ou mais.

**Regra / Requisito**

O valor negativo encerra a leitura e não entra nos cálculos.

**Exemplo de execução**

```
Idades:
Quantidade:
Média:
Maiores de idade:
```

**Teste seu programa**

```
Entradas Resultado esperado
18, 18, -1 Quantidade 2; média 18; maiores 2
10, 12, 14, -1 Quantidade 3; média 12; maiores O
-1 NENHUMA IDADE INFORMADA
```

**Verificação final**

O valor negativo funciona apenas como sentinela; a idade 18 deve entrar na contagem
de pessoas com 18 anos ou mais.

**Solução de referência (Portugol)**

```
algoritmo "idades_ate_negativo"
var idade, quantidade, soma, adultos: inteiro
inicio
  quantidade <- 0; soma <- 0; adultos <- 0
  leia(idade)
  enquanto idade >= 0 faca
    quantidade <- quantidade + 1
    soma <- soma + idade
    se idade >= 18 entao adultos <- adultos + 1 fimse
    leia(idade)
  fimenquanto
  se quantidade = 0 entao
    escreva("NENHUMA IDADE INFORMADA")
  senao
    escreva("Quantidade: ", quantidade)
    escreva("Média: ", soma / quantidade)
    escreva("Maiores de idade: ", adultos)
  fimse
fimalgoritmo
```

**Ponto de atenção**

O sentinela negativo não participa de quantidade, soma ou média.

---

### 059. Senha até acertar

**Enunciado**

Defina a senha correta como 1234. Solicite uma senha até que o usuário acerte.
Ao final, mostre ACESSO LIBERADO e a quantidade total de tentativas.

**Exemplo de execução**

```
Senha:
Senha incorreta.
Senha:
Senha incorreta.
Senha:
Tentativas:
```

**Teste seu programa**

```
Entradas Tentativas esperadas
1234 1
0000, 1234 2
1111, 2222, 3333, 1234 4
```

**Verificação final**

Se a senha correta for digitada na primeira tentativa, o total de tentativas deve ser 1.

**Solução de referência (Portugol)**

```
algoritmo "senha_ate_acertar"
var senha, tentativas: inteiro
inicio
  tentativas <- 0
  repita
    leia(senha)
    tentativas <- tentativas + 1
    se senha <> 1234 entao escreva("Senha incorreta.") fimse
  ate senha = 1234
  escreva("ACESSO LIBERADO")
  escreva("Tentativas: ", tentativas)
fimalgoritmo
```

**Ponto de atenção**

Se a primeira senha for correta, o total de tentativas é 1.

---

### 060. Caixa de compras

**Enunciado**

Leia os preços dos produtos de uma compra até que seja informado zero. Ao final, mostre
a quantidade de produtos, o total da compra e o maior preço informado.

**Regra / Requisito**

O zero encerra a leitura e não representa um produto.

**Exemplo de execução**

```
Preços:
Produtos:
Total:
Maior preço:
```

**Teste seu programa**

```
Entradas Resultado esperado
5; 5,5:0 Produtos 3; total 15; maior 5
100, 20, 50, O Produtos 3; total 170; maior 100
0 NENHUM PRODUTO INFORMADO
```

**Verificação final**

O zero não representa produto e deve ficar fora da quantidade, do total e da busca do
maior preço.

**Solução de referência (Portugol)**

```
algoritmo "caixa_compras"
var preco, total, maior: real
var quantidade: inteiro
inicio
  total <- 0; quantidade <- 0
  leia(preco)
  enquanto preco <> 0 faca
    quantidade <- quantidade + 1
    total <- total + preco
    se quantidade = 1 ou preco > maior entao maior <- preco fimse
    leia(preco)
  fimenquanto
  se quantidade = 0 entao
    escreva("NENHUM PRODUTO INFORMADO")
  senao
    escreva("Produtos: ", quantidade)
    escreva("Total: R$ ", total)
    escreva("Maior preço: R$ ", maior)
  fimse
fimalgoritmo
```

**Ponto de atenção**

O zero encerra a leitura e não representa produto.

---

## Módulo 04 — Vetores E Matrizes

### 061. Vetor com múltiplos de 5

**Enunciado**

Crie um vetor com 10 posições e preencha-o automaticamente com os valores
5, 10, 15, 20, até 50. Depois, mostre o vetor completo.

**Regra / Requisito**

Os valores devem ser gerados por uma estrutura de repetição.
Não atribua cada posição manualmente.
VETOR ESPERADO
| Índice 0 1 2 3 4 5 6 7 8 9
| Valor 5 10 115 |20 | 25 |30 | 35 | 40 | 45 | 50

**Teste seu programa**

```
Confirme que o vetor possui 10 posições, começa em 5, termina em 50 e cresce de 5 em 5.
```

**Verificação final**

Na posição de índice i, o valor deve seguir a relação 5 x (i + 1),
considerando índices iniciados em zero.

**Solução de referência (Portugol)**

```
algoritmo "vetor_multiplos_5"
var v: vetor[0..9] de inteiro
var i: inteiro
inicio
  para i de 0 ate 9 faca
    v[i] <- 5 * (i + 1)
  fimpara
  para i de 0 ate 9 faca escreva(v[i], " ") fimpara
fimalgoritmo
```

**Ponto de atenção**

O valor da posição i segue 5 x (i + 1).

---

### 062. Leitura e exibição de vetor

**Enunciado**

Leia oito números inteiros, armazene-os em um vetor e mostre todos os valores na
mesma ordem em que foram informados.

**Exemplo de execução**

```
Entrada:
```

**Teste seu programa**

```
Entrada Saída esperada
12345678 12345678
55555555 55555555
```

**Verificação final**

Compare entrada e saída posição por posição; a sequência exibida deve ser
idêntica à sequência informada.

**Solução de referência (Portugol)**

```
algoritmo "ler_exibir_vetor"
var v: vetor[0..7] de inteiro
var i: inteiro
inicio
  para i de 0 ate 7 faca leia(v[i]) fimpara
  para i de 0 ate 7 faca escreva(v[i], " ") fimpara
fimalgoritmo
```

**Ponto de atenção**

O mesmo índice usado na leitura é usado na exibição.

---

### 063. Vetor em ordem inversa

**Enunciado**

Leia oito números inteiros, armazene-os em um vetor e mostre os valores em ordem inversa.

**Exemplo de execução**

```
Entrada:
2.5 8149 37
Saída:
70329140 1280572
```

**Teste seu programa**

```
Entrada Saída esperada
12345678 87654321
44332211 11223344
```

**Verificação final**

Aplique a inversão duas vezes e confirme que a ordem original do vetor é recuperada.

**Solução de referência (Portugol)**

```
algoritmo "vetor_inverso"
var v: vetor[0..7] de inteiro
var i: inteiro
inicio
  para i de 0 ate 7 faca leia(v[i]) fimpara
  para i de 7 ate 0 passo -1 faca
    escreva(v[i], " ")
  fimpara
fimalgoritmo
```

**Ponto de atenção**

Aplicar a inversão duas vezes recupera a ordem original.

---

### 064. Soma dos elementos do vetor

**Enunciado**

Leia dez números reais, armazene-os em um vetor e mostre a soma de todos
os elementos.

**Exemplo de execução**

```
Vetor:
42,58 -13705,5 101
Soma:
```

**Teste seu programa**

```
Vetor Soma esperada
1234567891 0 55
0000000000 0
-=1-2-=-3-4-512345 0
```

**Verificação final**

Inclua valores positivos e negativos e confira a soma manualmente
para garantir que nenhum elemento foi ignorado.

**Solução de referência (Portugol)**

```
algoritmo "soma_vetor"
var v: vetor[0..9] de real
var i: inteiro
var soma: real
inicio
  soma <- 0
  para i de 0 ate 9 faca
    leia(v[i])
    soma <- soma + v[i]
  fimpara
  escreva("Soma: ", soma)
fimalgoritmo
```

**Ponto de atenção**

Todos os dez elementos devem participar exatamente uma vez.

---

### 065. Valores acima da média

**Enunciado**

Leia oito notas, armazene-as em um vetor, calcule a média e mostre os valores que ficaram acima da média.

**Regra / Requisito**

Mostre também a quantidade de notas acima da média.

**Exemplo de execução**

```
Notas:
758694710
Média: 7,0
Acima da média: 8 9 10
Quantidade: 3
```

**Teste seu programa**

```
Vetor Resultado esperado
5:5:5.5'5 55.5 Média 5; nenhum valor acima
12345678 Média 4,5; acima: 5 6 7 8
```

**Verificação final**

Valores exatamente iguais à média não devem aparecer entre os valores acima da média.

**Solução de referência (Portugol)**

```
algoritmo "acima_da_media"
var notas: vetor[0..7] de real
var i, quantidade: inteiro
var soma, media: real
inicio
  soma <- 0
  para i de 0 ate 7 faca
    leia(notas[i]); soma <- soma + notas[i]
  fimpara
  media <- soma / 8
  quantidade <- 0
  para i de 0 ate 7 faca
    se notas[i] > media entao
       escreva(notas[i], " ")
       quantidade <- quantidade + 1
    fimse
  fimpara
  escreva("Quantidade: ", quantidade)
fimalgoritmo
```

**Ponto de atenção**

Valores iguais à média não entram na lista.

---

### 066. Pares e suas posições

**Enunciado**

Leia dez números inteiros e mostre todos os valores pares acompanhados de suas posições no vetor.
r
FORMATO DA SAÍDA
Exemplo de formato:
Valor 8 — posição O
Valor 12 — posição 3
Valor O — posição 7
Vetor:
8351297 1£04 45
Pares encontrados:
8 — posição O
12 — posição 3
O — posição 7
4 — posição 8
A

**Teste seu programa**

```
Teste também um vetor sem números pares; nesse caso, mostre NENHUM VALOR PAR.
```

**Verificação final**

Inclua o zero no vetor e confirme que ele aparece como par, acompanhado da posição correta.

**Solução de referência (Portugol)**

```
algoritmo "pares_posicoes"
var v: vetor[0..9] de inteiro
var i, encontrados: inteiro
inicio
  para i de 0 ate 9 faca leia(v[i]) fimpara
  encontrados <- 0
  para i de 0 ate 9 faca
    se v[i] mod 2 = 0 entao
       escreval("Valor ", v[i], " - posição ", i)
       encontrados <- encontrados + 1
    fimse
  fimpara
  se encontrados = 0 entao escreva("NENHUM VALOR PAR") fimse
fimalgoritmo
```

**Ponto de atenção**

Zero é par e deve ser mostrado com a posição correta.

---

### 067. Maior valor e posição

**Enunciado**

Leia oito números inteiros e mostre o maior valor e a primeira posição em que ele aparece.

**Exemplo de execução**

```
Índice 0 1 2 3 4 6 7
Valor 12 5 31 18 31 22 10
Maior valor: 31
Primeira posição: 2
```

**Teste seu programa**

```
Vetor Maior Primeira posição
19392456 9 1
-8-2-5-2-9-3 -4 -7 -2 1
```

**Verificação final**

Quando o maior valor se repetir, informe a posição da primeira ocorrência e mantenha o
padrão de índices adotado.

**Solução de referência (Portugol)**

```
algoritmo "maior_posicao"
var v: vetor[0..7] de inteiro
var i, maior, posicao: inteiro
inicio
  para i de 0 ate 7 faca leia(v[i]) fimpara
  maior <- v[0]; posicao <- 0
  para i de 1 ate 7 faca
    se v[i] > maior entao
       maior <- v[i]; posicao <- i
    fimse
  fimpara
  escreva("Maior: ", maior, " Posição: ", posicao)
fimalgoritmo
```

**Ponto de atenção**

Usar > em vez de >= preserva a primeira ocorrência.

---

### 068. Menor valor e posição

**Enunciado**

Leia oito números inteiros e mostre o menor valor e a primeira posição em que ele aparece.

**Exemplo de execução**

```
| Índice 0 1 2 3 5 6 7
| Valor 7 2 9 -13 -3 8 1
Menor valor:
Primeira posição:
```

**Teste seu programa**

```
Vetor Menor Primeira posição
44444444 4 0
-1-5-=2-5-3-4-6 -6 -6 6
```

**Verificação final**

Quando o menor valor se repetir, informe a posição da primeira ocorrência e não da última.

**Solução de referência (Portugol)**

```
algoritmo "menor_posicao"
var v: vetor[0..7] de inteiro
var i, menor, posicao: inteiro
inicio
  para i de 0 ate 7 faca leia(v[i]) fimpara
  menor <- v[0]; posicao <- 0
  para i de 1 ate 7 faca
    se v[i] < menor entao
       menor <- v[i]; posicao <- i
    fimse
  fimpara
  escreva("Menor: ", menor, " Posição: ", posicao)
fimalgoritmo
```

**Ponto de atenção**

Usar < em vez de <= preserva a primeira ocorrência.

---

### 069. Busca de valor no vetor

**Enunciado**

Leia dez números inteiros e, depois, um valor de busca. Mostre todas as posições em que o valor aparece.

**Regra / Requisito**

Se o valor não existir no vetor, mostre VALOR NÃO ENCONTRADO.

**Exemplo de execução**

```
Valor procurado:
Posilçõest 1,3, 6,
```

**Teste seu programa**

```
Vetor Busca Resultado
12345678910 5 posição 4
22 0:2:272222 2 posições O a 9
135779 1113151719 2 NÃO ENCONTRADO
```

**Verificação final**

Teste um valor ausente e outro repetido; o primeiro não deve produzir posições, e o segundo deve listar todas elas.

**Solução de referência (Portugol)**

```
algoritmo "buscar_valor"
var v: vetor[0..9] de inteiro
var i, busca, encontrados: inteiro
inicio
  para i de 0 ate 9 faca leia(v[i]) fimpara
  leia(busca)
  encontrados <- 0
  para i de 0 ate 9 faca
    se v[i] = busca entao
       escreva(i, " ")
       encontrados <- encontrados + 1
    fimse
  fimpara
  se encontrados = 0 entao escreva("VALOR NÃO ENCONTRADO") fimse
fimalgoritmo
```

**Ponto de atenção**

Uma busca repetida pode produzir várias posições.

---

### 070. Quantidade de ocorrências

**Enunciado**

Leia dez números inteiros e, depois, um valor de busca. Informe quantas vezes esse valor aparece
no vetor.

**Exemplo de execução**

```
Valor procurado:
Ocorrências:
```

**Teste seu programa**

```
Vetor Busca Ocorrências
12345678910 7 1
4444444444 4 10
135 79NBBEVEO 2 0
```

**Verificação final**

Conte manualmente as ocorrências de um valor repetido e confirme que uma busca sem resultado retorna zero.

**Solução de referência (Portugol)**

```
algoritmo "contar_ocorrencias"
var v: vetor[0..9] de inteiro
var i, busca, ocorrencias: inteiro
inicio
  para i de 0 ate 9 faca leia(v[i]) fimpara
  leia(busca)
  ocorrencias <- 0
  para i de 0 ate 9 faca
    se v[i] = busca entao ocorrencias <- ocorrencias + 1 fimse
  fimpara
  escreva("Ocorrências: ", ocorrencias)
fimalgoritmo
```

**Ponto de atenção**

Quando o valor não existe, o contador permanece zero.

---

### 071. Copiar apenas valores positivos

**Enunciado**

Leia dez números reais e armazene-os em um vetor A. Crie um vetor B contendo
apenas os valores positivos de A, mantendo a ordem original.

**Exemplo de execução**

```
Vetor A:
5208147306
Vetor B:
58436
```

**Teste seu programa**

```
Vetor A Vetor B esperado
1238:56 7:18 910 1234567891)
-1-2-3-4-5-6-7-8-9-10 VETOR VAZIO
0000000000 VETOR VAZIO
```

**Verificação final**

O vetor B não pode conter zeros nem negativos e deve preservar a ordem
relativa dos positivos encontrados em A.

**Solução de referência (Portugol)**

```
algoritmo "copiar_positivos"
var a, b: vetor[0..9] de real
var i, tamanhoB: inteiro
inicio
  para i de 0 ate 9 faca leia(a[i]) fimpara
  tamanhoB <- 0
  para i de 0 ate 9 faca
    se a[i] > 0 entao
       b[tamanhoB] <- a[i]
       tamanhoB <- tamanhoB + 1
    fimse
  fimpara
  se tamanhoB = 0 entao escreva("VETOR VAZIO")
  senao para i de 0 ate tamanhoB - 1 faca escreva(b[i], " ") fimpara
  fimse
fimalgoritmo
```

**Ponto de atenção**

Zero e números negativos não são copiados.

---

### 072. Intercalar dois vetores

**Enunciado**

Leia dois vetores À e B, cada um com cinco elementos.
Crie um vetor C intercalando um elemento de A e um elemento de B.

**Exemplo de execução**

```
AJA 234 5
B: 10 20 30 40 50
Cc: 110220330 4 40 5 50
```

**Teste seu programa**

```
A B C esperado
54321 67891) 56473829110
00000 A VR TR 0101010101
```

**Verificação final**

O vetor C deve conter dez elementos e alternar rigorosamente A, B, A, B até o final.

**Solução de referência (Portugol)**

```
algoritmo "intercalar_vetores"
var a, b: vetor[0..4] de inteiro
var c: vetor[0..9] de inteiro
var i: inteiro
inicio
  para i de 0 ate 4 faca leia(a[i]) fimpara
  para i de 0 ate 4 faca leia(b[i]) fimpara
  para i de 0 ate 4 faca
    c[2 * i] <- a[i]
    c[2 * i + 1] <- b[i]
  fimpara
  para i de 0 ate 9 faca escreva(c[i], " ") fimpara
fimalgoritmo
```

**Ponto de atenção**

Os índices pares de C recebem A; os ímpares recebem B.

---

### 073. Comparar dois vetores

**Enunciado**

Leia dois vetores A e B com cinco números inteiros cada. Mostre as posições
em que os valores são iguais.

**Exemplo de execução**

```
A: 47295
B:43285
Posições iguais: 0, 2, 4
```

**Teste seu programa**

```
A B Resultado
12345 12345 61234
12345 54321 posição 2
11111 22222 NENHUMA POSIÇÃO
```

**Verificação final**

Compare somente elementos que ocupam o mesmo índice; valores iguais em
posições diferentes não contam como correspondência.

**Solução de referência (Portugol)**

```
algoritmo "comparar_vetores"
var a, b: vetor[0..4] de inteiro
var i, iguais: inteiro
inicio
  para i de 0 ate 4 faca leia(a[i]) fimpara
  para i de 0 ate 4 faca leia(b[i]) fimpara
  iguais <- 0
  para i de 0 ate 4 faca
    se a[i] = b[i] entao
       escreva(i, " "); iguais <- iguais + 1
    fimse
  fimpara
  se iguais = 0 entao escreva("NENHUMA POSIÇÃO") fimse
fimalgoritmo
```

**Ponto de atenção**

Valores iguais em índices diferentes não contam como correspondência.

---

### 074. Nomes acima da média

**Enunciado**

Leia o nome e a nota de cinco alunos, armazenando os dados em vetores
paralelos. Calcule a média da turma e mostre os nomes dos alunos com
nota acima da média.

**Exemplo de execução**

```
Nome
Nota
Ana
Bruno
Carla
Diego
Eva
qi |oOo!o
Média: 7,0
Acima da média: Ana, Carla
```

**Teste seu programa**

```
na lista de àcima da média.
Confirme que alunos com nota exatamente igual à média não aparecem
```

**Verificação final**

Mantenha nome e nota ligados pelo mesmo índice e exclua da lista quem
tiver nota exatamente igual à média.

**Solução de referência (Portugol)**

```
algoritmo "nomes_acima_media"
var nomes: vetor[0..4] de caractere
var notas: vetor[0..4] de real
var i: inteiro
var soma, media: real
inicio
  soma <- 0
  para i de 0 ate 4 faca
    leia(nomes[i], notas[i]); soma <- soma + notas[i]
  fimpara
  media <- soma / 5
  escreva("Média: ", media)
  para i de 0 ate 4 faca
    se notas[i] > media entao escreva(nomes[i], " ") fimse
  fimpara
fimalgoritmo
```

**Ponto de atenção**

Nota exatamente igual à média não entra na lista.

---

### 075. Ordenação crescente

**Enunciado**

Leia dez números inteiros, armazene-os em um vetor e mostre os valores em ordem crescente.

**Regra / Requisito**

Não utilize uma função pronta de ordenação da linguagem.

**Exemplo de execução**

```
Entrada:
7292518463
Saída:
1223456789
```

**Teste seu programa**

```
Use também este conjunto reduzido para conferir a lógica:
Entrada: 5 1423
Saída esperada: 12 345
```

**Verificação final**

Depois da ordenação, o vetor deve continuar com dez elementos,
preservando negativos, zeros e valores repetidos.

**Solução de referência (Portugol)**

```
algoritmo "ordenacao_bolha"
var v: vetor[0..9] de inteiro
var i, j, aux: inteiro
inicio
  para i de 0 ate 9 faca leia(v[i]) fimpara
  para i de 0 ate 8 faca
    para j de 0 ate 8 - i faca
       se v[j] > v[j + 1] entao
         aux <- v[j]
         v[j] <- v[j + 1]
         v[j + 1] <- aux
       fimse
    fimpara
  fimpara
  para i de 0 ate 9 faca escreva(v[i], " ") fimpara
fimalgoritmo
```

**Ponto de atenção**

A ordenação preserva a quantidade de elementos, repetidos, zeros e negativos.

---

### 076. Leitura de matriz 3 x 3

**Enunciado**

Leia nove números inteiros, armazene-os em uma matriz 3 x 3 e
mostre a matriz organizada em três linhas e três colunas.

**Exemplo de execução**

```
Entrada:
123456789
Matriz:
1 2 3
4 5 6
7 8 9
```

**Teste seu programa**

```
Confirme que cada valor aparece exatamente uma vez e na mesma ordem de leitura.
```

**Verificação final**

Confirme que os nove valores foram armazenados uma única vez e
recuperados nas linhas e colunas corretas.

**Solução de referência (Portugol)**

```
algoritmo "ler_matriz_3x3"
var m: matriz[0..2, 0..2] de inteiro
var l, c: inteiro
inicio
  para l de 0 ate 2 faca
    para c de 0 ate 2 faca leia(m[l, c]) fimpara
  fimpara
  para l de 0 ate 2 faca
    para c de 0 ate 2 faca escreva(m[l, c], " ") fimpara
    escreval("")
  fimpara
fimalgoritmo
```

**Ponto de atenção**

Cada valor é armazenado e recuperado uma única vez.

---

### 077. Soma dos elementos da matriz

**Enunciado**

Leia uma matriz 3 x 3 e mostre a soma de todos os seus elementos.

**Exemplo de execução**

```
Matriz:
1 2 3
4 5 6
7 8 9
Soma: 45
```

**Teste seu programa**

```
Teste também com:
1 -1 2
-2 3 =3
4 -4 0
Soma esperada: O
```

**Verificação final**

Some separadamente as três linhas; a soma desses resultados deve coincidir com
a soma total da matriz.

**Solução de referência (Portugol)**

```
algoritmo "soma_matriz"
var m: matriz[0..2, 0..2] de inteiro
var l, c, soma: inteiro
inicio
  soma <- 0
  para l de 0 ate 2 faca
    para c de 0 ate 2 faca
       leia(m[l, c])
       soma <- soma + m[l, c]
    fimpara
  fimpara
  escreva("Soma: ", soma)
fimalgoritmo
```

**Ponto de atenção**

A soma das três linhas deve coincidir com a soma total.

---

### 078. Diagonal principal

**Enunciado**

Leia uma matriz 3 x 3, mostre os elementos da diagonal principal e calcule a soma deles.
EXEMPLO DE MATRIZ

**Exemplo de execução**

```
Diagonal principal: 4 5 9
Soma: 18
```

**Teste seu programa**

```
Em uma matriz 3 x 3, os elementos da diagonal principal estão nas posições
LOJ[O], [11[1] e [21[2].
```

**Verificação final**

A diagonal principal de uma matriz 3 x 3 possui exatamente três elementos,
nas posições em que linha e coluna têm o mesmo índice.

**Solução de referência (Portugol)**

```
algoritmo "diagonal_principal"
var m: matriz[0..2, 0..2] de inteiro
var l, c, soma: inteiro
inicio
  para l de 0 ate 2 faca
    para c de 0 ate 2 faca leia(m[l, c]) fimpara
  fimpara
  soma <- 0
  para l de 0 ate 2 faca
    escreva(m[l, l], " ")
    soma <- soma + m[l, l]
  fimpara
  escreva("Soma: ", soma)
fimalgoritmo
```

**Ponto de atenção**

A diagonal principal 3 x 3 possui exatamente três elementos.

---

### 079. Soma de cada linha e coluna

**Enunciado**

Leia uma matriz 3 x 3. Mostre a soma de cada linha e a soma de cada coluna.

**Exemplo de execução**

```
Matriz:
1 2 3
4 5 6
7 8 9
Somas das linhas: 6, 15, 24
Somas das colunas: 12, 15, 18
```

**Teste seu programa**

```
A soma das três linhas deve ser igual à soma das três colunas e também à soma total da matriz.
```

**Verificação final**

A soma das três linhas deve ser igual à soma das três colunas e
também à soma de todos os elementos da matriz.

**Solução de referência (Portugol)**

```
algoritmo "somas_linhas_colunas"
var m: matriz[0..2, 0..2] de inteiro
var somaL, somaC: vetor[0..2] de inteiro
var l, c: inteiro
inicio
  para l de 0 ate 2 faca
    somaL[l] <- 0; somaC[l] <- 0
  fimpara
  para l de 0 ate 2 faca
    para c de 0 ate 2 faca
       leia(m[l, c])
       somaL[l] <- somaL[l] + m[l, c]
       somaC[c] <- somaC[c] + m[l, c]
    fimpara
  fimpara
  escreva("Linhas: ", somaL[0], somaL[1], somaL[2])
  escreva("Colunas: ", somaC[0], somaC[1], somaC[2])
fimalgoritmo
```

**Ponto de atenção**

A soma dos totais das linhas deve ser igual à soma dos totais das colunas.

---

### 080. Maior elemento da matriz

**Enunciado**

Leia uma matriz 4 x 4 e mostre o maior elemento, a linha e a coluna da primeira ocorrência.

**Regra / Requisito**

Nos exemplos, linhas e colunas começam no índice 0.

**Exemplo de execução**

```
Matriz:
4 7 2 1
9
6 12 10 11
0 4 12 2
Maior valor: 12
Primeira posição: linha 2, coluna 1
```

**Teste seu programa**

```
Se o maior valor aparecer mais de uma vez, mantenha a primeira posição encontrada
no percurso por linhas.
```

**Verificação final**

Se o maior valor aparecer mais de uma vez, informe as coordenadas da primeira
ocorrência encontrada.

**Solução de referência (Portugol)**

```
algoritmo "maior_matriz"
var m: matriz[0..3, 0..3] de inteiro
var l, c, maior, linMaior, colMaior: inteiro
inicio
  para l de 0 ate 3 faca
    para c de 0 ate 3 faca leia(m[l, c]) fimpara
  fimpara
  maior <- m[0, 0]; linMaior <- 0; colMaior <- 0
  para l de 0 ate 3 faca
    para c de 0 ate 3 faca
       se m[l, c] > maior entao
         maior <- m[l, c]; linMaior <- l; colMaior <- c
       fimse
    fimpara
  fimpara
  escreva("Maior: ", maior)
  escreva("Linha: ", linMaior, " Coluna: ", colMaior)
fimalgoritmo
```

**Ponto de atenção**

Atualizar apenas com > preserva a primeira ocorrência do maior.

---

## Módulo 05 — Funções E Desafios Combinados

### 081. Função para somar

**Enunciado**

Crie uma função chamada soma que receba dois números reais e retorne a soma entre eles.
ndo

**Regra / Requisito**

A função deve retornar o valor; a exibição pode ser feita pelo programa principal.
k TESTE A FUNÇÃO
Chamadas de teste:
soma(8, 5) > 13
soma(-3, 7) > 4
soma(2.5, 1.5) > 4

**Verificação final**

Use o retorno da função dentro de outra expressão para confirmar que ela
devolve o valor em vez de apenas exibi-lo.

**Solução de referência (Portugol)**

```
funcao soma(a, b: real): real
inicio
  retorne a + b
fimfuncao
algoritmo "teste_soma"
inicio
  escreva(soma(8, 5))
fimalgoritmo
```

**Ponto de atenção**

A função retorna o valor; quem chama decide como exibi-lo ou reutilizá-lo.

---

### 082. Função maior

**Enunciado**

Crie uma função chamada maior que receba dois números reais e retorne o maior deles.
TESTE A FUNÇÃO
Chamadas de teste:
(0.0)
maior(8, 3) >
maior(4, 11) > 11
Ú
mM
maior(-2, -7) >
w
maior(5, 5) >

**Verificação final**

Teste dois parâmetros iguais e confirme que a função retorna
corretamente o valor comum.

**Solução de referência (Portugol)**

```
funcao maior(a, b: real): real
inicio
  se a >= b entao
    retorne a
  senao
    retorne b
  fimse
fimfuncao
```

**Ponto de atenção**

A comparação >= trata dois parâmetros iguais corretamente.

---

### 083. Menor de três valores

**Enunciado**

Crie uma função chamada menor3 que receba três números reais e retorne o menor deles.
TESTE A FUNÇÃO
Chamadas de teste:
CHAMADA RESULTADO ESPERADO
menor3(8, 3, 5) -— 3
menor3(-1, -7, -2) —5> 7
menor3(4, 4, 9) — 4

**Verificação final**

a ordem dos parâmetros não altera o resultado.
Inclua o menor valor em posições diferentes e com repetição para garantir que
(2)

**Solução de referência (Portugol)**

```
funcao menor3(a, b, c: real): real
var menor: real
inicio
  menor <- a
  se b < menor entao menor <- b fimse
  se c < menor entao menor <- c fimse
  retorne menor
fimfuncao
```

**Ponto de atenção**

A ordem dos parâmetros não altera o menor retornado.

---

### 084. Função par ou ímpar

**Enunciado**

Crie uma função chamada ehPar que receba um número inteiro e retorne verdadeiro quando
o valor for par e falso quando for ímpar.
TESTE A FUNÇÃO
CHAMADAS DE TESTE
ehPar(8) — verdadeiro
ehPar(13) —> falso
ehPar(0) — verdadeiro
ehPar(-4) — verdadeiro ( -
U)

**Verificação final**

Es
Confirme os casos zero e número negativo par; ambos devem
0) respeitar a definição matemática de paridade.

**Solução de referência (Portugol)**

```
funcao ehPar(n: inteiro): logico
inicio
  retorne n mod 2 = 0
fimfuncao
```

**Ponto de atenção**

Zero e números negativos pares retornam verdadeiro.

---

### 085. Função de média

**Enunciado**

Crie uma função chamada media3 que receba três notas reais e retorne a média aritmética.
£o) REQUISITO
Mostre o resultado final com duas casas decimais.
TESTE A FUNÇÃO
Chamadas de teste:
media3(8, 7, 6) 37
media3(10, 9, 8) 39
media3(5.5, 6.5, 7) > 6.33

**Verificação final**

Passe três notas iguais e confirme que a média retornada é
exatamente o próprio valor das notas.

**Solução de referência (Portugol)**

```
funcao media3(a, b, c: real): real
inicio
  retorne (a + b + c) / 3
fimfuncao
algoritmo "teste_media3"
var resultado: real
inicio
  resultado <- media3(5.5, 6.5, 7)
  escreva_formatado(resultado, 2)
fimalgoritmo
```

**Ponto de atenção**

A formatação com duas casas pertence à exibição, não altera o cálculo interno.

---

### 086. Função de conversão de temperatura

**Enunciado**

Crie uma função chamada celsiusParaFahrenheit que receba uma temperatura em Celsius
e retorne o valor equivalente em Fahrenheit.

**Regra / Requisito**

Fahrenheit = Celsius x 9 + 5 + 32.
TESTE A FUNÇÃO
eds
O Chamadas de teste:
qu * celsiusParaFahrenheit(0) 5 32
* celsiusParaFahrenheit(25) 5 77
* celsiusParaFahrenheit(-40) 5 -40

**Verificação final**

( G ) Use —-40 como argumento; a função deve retornar —40,
o ponto em que as duas escalas coincidem.

**Solução de referência (Portugol)**

```
funcao celsiusParaFahrenheit(c: real): real
inicio
  retorne c * 9 / 5 + 32
fimfuncao
```

**Ponto de atenção**

O argumento -40 deve retornar -40.

---

### 087. Função fatorial

**Enunciado**

Crie uma função chamada fatorial que receba um número inteiro não negativo e retorne o seu fatorial.

**Regra / Requisito**

Considere entradas de 0 até 12.
TESTE A FUNÇÃO
Chamadas de teste:
* fatorial(0) > 1
e fatorial(1) 5 1
* fatorial(5) > 120
* fatorial(6) > 720

**Verificação final**

Valide os casos O e 1 separadamente; ambos possuem fatorial igual a 1.

**Solução de referência (Portugol)**

```
funcao fatorial(n: inteiro): inteiro_longo
var i: inteiro
var fat: inteiro_longo
inicio
  fat <- 1
  para i de 2 ate n faca
    fat <- fat * i
  fimpara
  retorne fat
fimfuncao
```

**Ponto de atenção**

0! e 1! resultam em 1 porque o acumulador inicia em 1.

---

### 088. N-ésimo termo de Fibonacci

**Enunciado**

Crie uma função chamada fibonacci que receba um índice N e retorne o termo correspondente da sequência.

**Regra / Requisito**

Considere FO = 0eF1=1.
b
TESTE A FUNÇÃO
HI
Chamadas de teste:
e fibonacci(0O) > O
e fibonacci(l) > 1
e fibonacci(6) > 8
* fibonacci(10) > 55
Q VERIFICAÇÃO FINAL
Confirme a convenção dos índices: fibonacci(0) deve retornar O
e fibonacci(1) deve retornar 1.

**Solução de referência (Portugol)**

```
funcao fibonacci(n: inteiro): inteiro_longo
var i: inteiro
var a, b, proximo: inteiro_longo
inicio
  se n = 0 entao retorne 0 fimse
  a <- 0; b <- 1
  para i de 2 ate n faca
    proximo <- a + b
    a <- b
    b <- proximo
  fimpara
  retorne b
fimfuncao
```

**Ponto de atenção**

A convenção de índices é essencial: fibonacci(0)=0 e fibonacci(1)=1.

---

### 089. Validação de nota

**Enunciado**

Crie uma função chamada notaValida que receba um número real e retorne verdadeiro
quando o valor estiver entre O e 10, inclusive.
TESTE A FUNÇÃO
CHAMADAS DE TESTE
notaValida(7.5) — verdadeiro
notaValida(0) > verdadeiro
notaValida(10) => verdadeiro
notaValida(-1) > falso
notaValida(10.1) > falso

**Verificação final**

como inválidos.
Teste O e 10 como válidos e valores imediatamente abaixo ou acima desses limites
Pk
em

**Solução de referência (Portugol)**

```
funcao notaValida(nota: real): logico
inicio
  retorne (nota >= 0) e (nota <= 10)
fimfuncao
```

**Ponto de atenção**

Os limites 0 e 10 são válidos.

---

### 090. Procedimento para mostrar a tabuada

**Enunciado**

Crie um procedimento chamado mostrarTabuada que receba um número inteiro
e mostre a tabuada de 1 até 10.

**Regra / Requisito**

O procedimento deve realizar a exibição; não precisa retornar um valor.
A TESTE O PROCEDIMENTO
Chamada:
mostrarTabuada(4)
Saída:
4x1
4x2
4
8
4x 10 = 40

**Verificação final**

O procedimento deve exibir dez linhas da tabuada e não precisa
produzir um valor de retorno.

**Solução de referência (Portugol)**

```
procedimento mostrarTabuada(n: inteiro)
var i: inteiro
inicio
  para i de 1 ate 10 faca
    escreval(n, " x ", i, " = ", n * i)
  fimpara
fimprocedimento
algoritmo "teste_tabuada"
inicio
  mostrarTabuada(4)
fimalgoritmo
```

**Ponto de atenção**

Procedimentos realizam uma ação; neste caso, a exibição é o resultado.

---

### 091. Contar positivos no vetor

**Enunciado**

Crie uma função chamada contarPositivos que receba um vetor de números reais
e retorne quantos elementos são maiores que zero.

**Regra / Requisito**

A função deve retornar quantos elementos no vetor são maiores que zero.
A TESTE A FUNÇÃO
Chamadas de teste:
contarPositivos([5, -2, 0, 8, -1]) 52
contarPositivos([1, 2, 3]) > 3
contarPositivos([-1, -2, 0]) > 0

**Verificação final**

Zero não é positivo; confirme que apenas elementos estritamente
maiores que zero entram na contagem.

**Solução de referência (Portugol)**

```
funcao contarPositivos(v: vetor de real): inteiro
var i, total: inteiro
inicio
  total <- 0
  para i de 0 ate tamanho(v) - 1 faca
    se v[i] > 0 entao total <- total + 1 fimse
  fimpara
  retorne total
fimfuncao
```

**Ponto de atenção**

Zero não é positivo.

---

### 092. Média dos elementos do vetor

**Enunciado**

Crie uma função chamada mediaVetor que receba um vetor de números reais
e retorne a média dos elementos.

**Regra / Requisito**

Considere que o vetor possui pelo menos um elemento.
AN TESTE A FUNÇÃO
Chamadas de teste:
mediaVetor([2, 4, 6, 8]) > 5
mediaVetor([10, 10, 10]) > 10
mediaVetor([-5, 5]) > 0

**Verificação final**

Um vetor com um único elemento deve retornar esse próprio elemento
como média.

**Solução de referência (Portugol)**

```
funcao mediaVetor(v: vetor de real): real
var i: inteiro
var soma: real
inicio
  soma <- 0
  para i de 0 ate tamanho(v) - 1 faca
    soma <- soma + v[i]
  fimpara
  retorne soma / tamanho(v)
fimfuncao
```

**Ponto de atenção**

Um vetor com um elemento retorna esse próprio valor como média.

---

### 093. Maior valor do vetor

**Enunciado**

Crie uma função chamada maiorVetor que receba um vetor não vazio e retorne o maior elemento.

**Regra / Requisito**

Inicialize o maior valor usando o primeiro elemento do vetor.
A TESTE A FUNÇÃO
Chamadas de teste:
maiorVetor([4, 7, 2,9, 5]) 59
maiorVetor([-8, -2, -5]) > -2
maiorVetor([3, 3, 3]) > 3

**Verificação final**

Use um vetor contendo apenas números negativos para
confirmar que o maior foi inicializado com o primeiro elemento.

**Solução de referência (Portugol)**

```
funcao maiorVetor(v: vetor de real): real
var i: inteiro
var maior: real
inicio
  maior <- v[0]
  para i de 1 ate tamanho(v) - 1 faca
    se v[i] > maior entao maior <- v[i] fimse
  fimpara
  retorne maior
fimfuncao
```

**Ponto de atenção**

A inicialização com v[0] funciona corretamente para vetores totalmente negativos.

---

### 094. Posições de um valor

**Enunciado**

Crie uma função chamada buscarPosicoes que receba um vetor e um valor
procurado. A função deve retornar todas as posições em que o valor aparece.
o valor procurado aparece no vetor.
Ea REQUISITO
A função deve retornar todas as posições (índices iniciados em zero) em que
1 TESTE A FUNÇÃO
Chamadas de teste:
buscarPosicoes([4, 7,2, 7,9], 7) > [1,3]
buscarPosicoes([5, 5, 5], 5) > [0, 1, 2]
buscarPosicoes([1, 3, 5], 2) > []
quando houver, use posições iniciadas em zero.

**Verificação final**

Quando não houver ocorrência, o retorno deve ser uma coleção vazia;

**Solução de referência (Portugol)**

```
funcao buscarPosicoes(v: vetor de inteiro, busca: inteiro): vetor
var posicoes: vetor_dinamico de inteiro
var i: inteiro
inicio
  para i de 0 ate tamanho(v) - 1 faca
    se v[i] = busca entao adicionar(posicoes, i) fimse
  fimpara
  retorne posicoes
fimfuncao
```

**Ponto de atenção**

Quando não há ocorrência, o retorno é uma coleção vazia.

---

### 095. Contar ocorrências em função

**Enunciado**

Crie uma função chamada contar0correncias que receba um vetor e um
valor procurado. Retorne a quantidade de vezes que o valor aparece.
A TESTE A FUNÇÃO
Chamadas de teste:
contarOcorrencias([3, 5, 3, 8, 3], 3) 53
contarOcorrencias([1, 2, 3], 4) > 0
contarOcorrencias([7, 7, 7, 7], 7) > 4

**Verificação final**

Diferencie quantidade de posições: a função deve retornar um número,
inclusive zero quando o valor não existir.

**Solução de referência (Portugol)**

```
funcao contarOcorrencias(v: vetor de inteiro, busca: inteiro): inteiro
var i, total: inteiro
inicio
  total <- 0
  para i de 0 ate tamanho(v) - 1 faca
    se v[i] = busca entao total <- total + 1 fimse
  fimpara
  retorne total
fimfuncao
```

**Ponto de atenção**

Ausência do valor produz retorno zero, não uma coleção vazia.

---

### 096. Estatísticas de vendas

**Enunciado**

Leia dez valores de vendas e armazene-os em um vetor. Use funções para calcular
o total vendido, a média, a maior venda e a quantidade de vendas acima da média.

**Regra / Requisito**

Crie pelo menos estas funções:
* totalVendas(vetor)
* mediaVendas(vetor)
e maiorVenda(vetor)
e contarAcimaDaMedia(vetor)

**Exemplo de execução**

```
Conjunto reduzido para teste:
100 250 80 300 270
Total: 1000
Média: 200
Maior venda: 300
Acima da média: 3
```

**Teste seu programa**

```
Depois de validar com o conjunto reduzido, execute o programa com as
dez vendas previstas no enunciado.
```

**Verificação final**

Confira se total + quantidade de vendas coincide com a média e se apenas
valores estritamente acima dela são contados.

**Solução de referência (Portugol)**

```
funcao totalVendas(v): real
  soma <- 0
  para cada x em v faca soma <- soma + x fimpara
  retorne soma
fimfuncao
funcao mediaVendas(v): real
  retorne totalVendas(v) / tamanho(v)
fimfuncao
funcao maiorVenda(v): real
  maior <- v[0]
  para cada x em v faca se x > maior entao maior <- x fimse fimpara
  retorne maior
fimfuncao
funcao contarAcimaDaMedia(v): inteiro
  media <- mediaVendas(v); total <- 0
  para cada x em v faca se x > media entao total <- total + 1 fimse fimpara
  retorne total
fimfuncao
```

**Ponto de atenção**

Valores exatamente iguais à média não entram na contagem acima dela.

---

### 097. Estatísticas da turma

**Enunciado**

Leia o nome e a nota de oito alunos usando vetores paralelos.
Use funções para calcular a média, a maior nota, a menor nota e listar os alunos acima da média.

**Regra / Requisito**

=| Crie funções separadas para:
calcular a média;
encontrar a maior nota;
encontrar a menor nota;
identificar os nomes acima da média.

**Exemplo de execução**

```
Nome Nota
Ana 8
Bruno 6
Carla 9
Diego 7
Eva 5
Média: 7
Maior nota: 9
Menor nota: 5
Acima da média: Ana, Carla
```

**Teste seu programa**

```
Alunos com nota exatamente igual à média não devem aparecer na lista de acima da média.
```

**Verificação final**

Preserve a associação entre nomes e notas;
alunos exatamente na média não entram na lista de acima da média.

**Solução de referência (Portugol)**

```
funcao mediaNotas(notas): real
  soma <- 0
  para cada n em notas faca soma <- soma + n fimpara
  retorne soma / tamanho(notas)
fimfuncao
funcao maiorNota(notas): real
  maior <- notas[0]
  para cada n em notas faca se n > maior entao maior <- n fimse fimpara
  retorne maior
fimfuncao
funcao menorNota(notas): real
  menor <- notas[0]
  para cada n em notas faca se n < menor entao menor <- n fimse fimpara
  retorne menor
fimfuncao
procedimento mostrarAcimaMedia(nomes, notas)
  media <- mediaNotas(notas)
  para i de 0 ate tamanho(notas)-1 faca
    se notas[i] > media entao escreva(nomes[i], " ") fimse
  fimpara
fimprocedimento
```

**Ponto de atenção**

O mesmo índice mantém nome e nota associados.

---

### 098. Temperaturas da semana

**Enunciado**

Leia sete temperaturas, uma para cada dia da semana.
Use funções para calcular a média, a maior, a menor e quantos dias ficaram acima da média.
OB EXEMPLO DE EXECUÇÃO
P-
Temperaturas:
22 25 19 28 24 26 20
Média: 23,43
Maior: 28
Menor: 19
Dias acima da média: 4

**Teste seu programa**

```
Confirme que valores exatamente iguais à média não entram
na contagem de acima da média.
```

**Verificação final**

Devem participar exatamente sete temperaturas, e valores iguais
à média não contam como dias acima dela.
ní-t ana

**Solução de referência (Portugol)**

```
funcao media(v): real
  soma <- 0
  para cada x em v faca soma <- soma + x fimpara
  retorne soma / tamanho(v)
fimfuncao
algoritmo "temperaturas_semana"
var t: vetor[0..6] de real
var i, acima: inteiro
var med, maior, menor: real
inicio
  para i de 0 ate 6 faca leia(t[i]) fimpara
  med <- media(t); maior <- t[0]; menor <- t[0]; acima <- 0
  para i de 0 ate 6 faca
    se t[i] > maior entao maior <- t[i] fimse
    se t[i] < menor entao menor <- t[i] fimse
    se t[i] > med entao acima <- acima + 1 fimse
  fimpara
  escreva("Média: ", med, " Maior: ", maior)
  escreva("Menor: ", menor, " Acima: ", acima)
fimalgoritmo
```

**Ponto de atenção**

Participam exatamente sete temperaturas; igualdade com a média não conta como acima.

---

### 099. Controle de estoque

**Enunciado**

Leia o nome, a quantidade e o preço unitário de oito produtos. Use funções para
calcular o valor total do estoque, contar produtos com quantidade menor que 5
e identificar o produto com maior valor em estoque.
da

**Regra / Requisito**

Valor em estoque de um produto = quantidade x preço unitário.

**Exemplo de execução**

```
Produto Quantidade Preço unitário
Teclado E R$ 120,00
Mouse 10 R$ 50,00
Cabo 2 R$ 20,00
Headset 5 R$ 200,00
Valor total do estoque: R$ 1.900,00
Produtos com estoque menor que 5: 2
Maior valor em estoque: Headset — R$ 1.000,00
```

**Teste seu programa**

```
O produto com maior valor em estoque não é necessariamente
o produto com maior quantidade nem o de maior preço unitário.
```

**Verificação final**

Calcule quantidade x preço para cada produto; o maior valor em estoque
não é necessariamente o maior preço unitário.

**Solução de referência (Portugol)**

```
algoritmo "controle_estoque"
var nomes: vetor[0..7] de caractere
var qtd: vetor[0..7] de inteiro
var preco: vetor[0..7] de real
var i, baixos, posMaior: inteiro
var valor, total, maiorValor: real
inicio
  para i de 0 ate 7 faca leia(nomes[i], qtd[i], preco[i]) fimpara
  total <- 0; baixos <- 0
  maiorValor <- qtd[0] * preco[0]; posMaior <- 0
  para i de 0 ate 7 faca
    valor <- qtd[i] * preco[i]
    total <- total + valor
    se qtd[i] < 5 entao baixos <- baixos + 1 fimse
    se valor > maiorValor entao maiorValor <- valor; posMaior <- i fimse
  fimpara
  escreva("Total: R$ ", total)
  escreva("Estoque baixo: ", baixos)
  escreva("Maior valor: ", nomes[posMaior], " - R$ ", maiorValor)
fimalgoritmo
```

**Ponto de atenção**

Maior valor em estoque não significa maior preço unitário nem maior quantidade isolada.

---

### 100. Desafio final - análise de uma turma

**Enunciado**

Leia o nome, a idade e a nota de dez alunos usando vetores paralelos. Organize a solução
em funções e mostre os resultados solicitados.
ed REQUISITO
= O programa deve informar:
a) média das notas;
b) maior nota e nome do aluno;
c) menor nota e nome do aluno;
d) quantidade de aprovados, considerando nota maior ou igual a 7;
e) nome e idade do aluno mais velho;
f) nomes dos alunos com nota acima da média.

**Exemplo de execução**

```
Es Conjunto reduzido para teste:
Nome Idade Nota
Ana 19 8
Bruno 22 6
Carla 18 9
Diego 25 7
Eva 20 5
Média: 7
Maior nota: Carla — 9
Menor nota: Eva — 5
Aprovados: 3
Mais velho: Diego — 25 anos
Acima da média: Ana, Carla
```

**Teste seu programa**

```
Depois de validar com o conjunto reduzido, execute o programa com os dez alunos
previstos no enunciado.
```

**Verificação final**

Revise cada resultado junto ao aluno correspondente e confirme os limites: aprovação
inclui nota 7, enquanto acima da média exige valor estritamente maior.

**Solução de referência (Portugol)**

```
funcao mediaNotas(notas): real
  soma <- 0
  para cada n em notas faca soma <- soma + n fimpara
  retorne soma / tamanho(notas)
fimfuncao
algoritmo "analise_turma"
var nomes: vetor[0..9] de caractere
var idades: vetor[0..9] de inteiro
var notas: vetor[0..9] de real
var i, posMaior, posMenor, posVelho, aprovados: inteiro
var media: real
inicio
  para i de 0 ate 9 faca leia(nomes[i], idades[i], notas[i]) fimpara
  media <- mediaNotas(notas)
  posMaior <- 0; posMenor <- 0; posVelho <- 0; aprovados <- 0
  para i de 0 ate 9 faca
    se notas[i] > notas[posMaior] entao posMaior <- i fimse
    se notas[i] < notas[posMenor] entao posMenor <- i fimse
    se idades[i] > idades[posVelho] entao posVelho <- i fimse
    se notas[i] >= 7 entao aprovados <- aprovados + 1 fimse
  fimpara
  escreva("Média: ", media)
  escreva("Maior: ", nomes[posMaior], " - ", notas[posMaior])
  escreva("Menor: ", nomes[posMenor], " - ", notas[posMenor])
  escreva("Aprovados: ", aprovados)
  escreva("Mais velho: ", nomes[posVelho], " - ", idades[posVelho])
  escreva("Acima da média: ")
  para i de 0 ate 9 faca
    se notas[i] > media entao escreva(nomes[i], " ") fimse
  fimpara
fimalgoritmo
```

**Ponto de atenção**

Aprovação inclui nota 7; acima da média exige valor estritamente maior.

---

# Bônus — 30 Exercícios de Condicionais

### cond-01. Par ou Ímpar

**Enunciado**

Faça um programa que leia um número inteiro e informe se ele é PAR ou ÍMPAR. |
EI REQUISITO
Utilize uma estrutura condicional simples para decidir a mensagem exibida. |

**Exemplo de execução**

```
[ Entrada:
| 18
| E
Saída esperada: |
| O número é PAR.
```

**Teste seu programa**

```
Entrada Saída esperada
7 O número é ÍMPAR.
[o] O número é PAR.
-12 O número é PAR.
21 O número é ÍMPAR.
```

---

### cond-02. Positivo, Negativo ou Zero

**Enunciado**

Faça um programa que leia um número real e informe se ele é POSITIVO, NEGATIVO ou ZERO.
E REQUISITO
Utilize estruturas condicionais para classificar corretamente o valor digitado.

**Exemplo de execução**

```
Entrada:
-3.5
Saída esperada:
O número é NEGATIVO.
mil TESTE SEU PROGRAMA
J—
Entrada Saída esperada
0 O número é ZERO.
8 O número é POSITIVO.
=] O número é NEGATIVO.
12.57 O número é POSITIVO.
```

---

### cond-03. Maior de Dois Valores

**Enunciado**

Faça um programa que leia dois números inteiros e mostre qual deles é o maior.
Se os dois valores forem iguais, mostre uma mensagem informando isso.
E REQUISITO
Compare os dois valores usando uma estrutura condicional e trate também o caso de igualdade.

**Exemplo de execução**

```
Entrada:
25
14
Saída esperada:
Maior valor: 25
```

**Teste seu programa**

```
Entrada Saída esperada
9e 19 Maior valor: 19
7e7 Os valores são iguais.
-4e -9 Maior valor: -4
100 e 3 Maior valor: 100
```

---

### cond-04. Menor de Três Números

**Enunciado**

| Faça um programa que leia três números e mostre qual deles é o menor valor. |
E REQUISITO
Utilize condições compostas para comparar os três valores.

**Exemplo de execução**

```
Entrada:
12
4
20
Saída esperada:
Menor valor: 4
```

**Teste seu programa**

```
Entrada Saída esperada
5; 5; 18 Menor valor: 5
2» 1%; 0 Menor valor: -2
10; 3; 3 Menor valor: 3
Dj 16 Menor valor: 1
```

---

### cond-05. Situação do Aluno

**Enunciado**

| Leia a média final de um aluno e informe sua situação de acordo com a tabela. |

**Requisito**

Média Situação
Menor que 5,0 Reprovado
De 5,0 até 6,9 Recuperação
7,0 ou mais Aprovado
EI REQUISITO
Utilize estruturas condicionais para classificar corretamente a média informada.

**Exemplo de execução**

```
Entrada:
6-2
Saída esperada:
Situação: Recuperação
```

**Teste seu programa**

```
Entrada Saída esperada
4.8 Situação: Reprovado
7.0 Situação: Aprovado
95) Situação: Aprovado
5.0 Situação: Recuperação
```

---

### cond-06. Faixa Etária

**Enunciado**

Faça um programa que leia a idade de uma pessoa e informe a sua faixa etária.

**Requisito**

0a 12 Criança
13 a 17 Adolescente
18 a 59 Adulto
60 Em mais E Idoso
EI REQUISITO
Considere que a idade informada é um número inteiro não negativo.

**Exemplo de execução**

```
Entrada:
34
Saída esperada:
Faixa etária: Adulto
Ml TESTE SEU PROGRAMA
Entrada Saída esperada
8 Faixa etária: Criança
16 Faixa etária: Adolescente
60 Faixa etária: Idoso
25 Faixa etária: Adulto
```

---

### cond-07. Pode Votar?

**Enunciado**

Faça um programa que leia a idade de uma pessoa e informe sua condição eleitoral.

**Requisito**

Menor de 16 anos Não pode votar
16 e 17 anos Voto facultativo
18 a 69 anos Voto obrigatório
70 anos ou mais Voto facultativo
EI REQUISITO
Classifique a idade usando estruturas condicionais e mostre apenas a condição eleitoral.

**Exemplo de execução**

```
Entrada:
17
Saída esperada:
Condição eleitoral: Voto facultativo
```

**Teste seu programa**

```
Entr Saída esperada
15 Condição eleitoral: Não pode votar
22 Condição eleitoral: Voto obrigatório
7a Condição eleitoral: Voto facultativo
16 Condição eleitoral: Voto facultativo
```

---

### cond-08. Desconto na Compra

**Enunciado**

[a um programa que leia o valor total de uma compra e calcule o desconto de acordo com
a tabela.

**Requisito**

Mostre o percentual aplicado e o valor final da compra.
a EXEMPLO DE EXECUÇÃO
Entrada:
250.00
Saída esperada:
Desconto: 5% | Valor final: R$ 237,50
7—
V—
Ml TESTE SEU PROGRAMA
Entrada Saída esperada
80.00 Desconto: 0% | Valor final: R$ 80,00
150.00 Desconto: 5% | Valor final: R$ 142,50
350.00 Destontos (10% ] Valor final: R$ 315,00
100.00 Desconto: 0% | Valor final: R$ 100,00

---

### cond-09. Classificação do IMC

**Enunciado**

Faça um programa que leia o peso e a altura de uma pessoa, calcule o IMC e informe a
classificação obtida.
IMC Classificação
Menor que 18,5 Baixo peso
De 18,5 até 24,9 Peso normal
De 25,0 até 29,9 sobrepeso
30,0 ou mais Obesidade
EI REQUISITO
Use a fórmula IMC = peso / (altura x altura). Mostre o IMC com uma casa decimal.

**Exemplo de execução**

```
Entrada:
Peso: 72
Altura: 1.75
Saída esperada:
IMC: 23.5 | Classificação: Peso normal
```

**Teste seu programa**

```
Entrada Saída esperada
50 kg e 1.70 m IMC: 17.3 | Baixo peso
68 kg e 1.65 m IMC: 25.0 | Sobrepeso
90 kg e 1.80 m IMC: 27.8 | Sobrepes
110 kg e 1.75 m. INC: 35.9 | Obesidade
```

---

### cond-10. Tipo de Triângulo

**Enunciado**

Faça um programa que leia o comprimento de três lados e informe se eles formam um triângulo.
Se formarem, classifique-o como equilátero, isósceles ou escaleno.
Antes de classificar, verifique se os três lados formam um triângulo.
ES rem
Regra Classificação
Todos os lados iguais Equilátero
Dois lados iguais Isósceles
Todos os lados diferentes Escaleno
E REQUISITO
Considere a condição de existência: cada lado deve ser menor que a soma dos outros dois.

**Exemplo de execução**

```
Entrada:
5
5
8
Saída esperada:
Triângulo ISÓSCELES
```

**Teste seu programa**

```
Entrada (lados) Saída esperada
8, 4, 5 Triângulo ESCALENO
2; di 2 Triângulo EQUILÁTERO
dt 25 5 Não forma triângulo
To di 10 = Triângulo ISÓSCELES |
10
```

---

### cond-11. Ano Bissexto

**Enunciado**

Faça um programa que leia um ano inteiro e informe se ele é BISSEXTO ou NÃO BISSEXTO.
E REQUISITO
Considere a regra: um ano é bissexto se for divisível por 400, ou se for divisível por 4 e não por 100.

**Exemplo de execução**

```
Entrada:
2024
Saída esperada:
O ano é BISSEXTO.
Su
```

**Teste seu programa**

```
Entrada Saída esperada
1900 O ano NÃO é BISSEXTO.
2000 O ano é BISSEXTO.
2023 O ano NÃO é BISSEXTO.
2028 O ano é BISSEXTO.
E
```

---

### cond-12. Múltiplo de 3 e 5

**Enunciado**

Faça um programa que leia um número inteiro e informe se ele é divisível por 3 e por 5,
apenas por 3, apenas por 5 ou por nenhum dos dois.
E REQUISITO
Use condições compostas e mostre apenas uma das quatro classificações possíveis.

**Exemplo de execução**

```
Entrada:
15
Saída esperada:
O número é divisível por 3 e por 5.
```

**Teste seu programa**

```
Entrada Saída esperada
ii]
9 O número é divisível apenas por 3.
10 O número é divisível apenas por 5.
7 O número não é divisível por 3 nem por 5.
30 O número é divisível por 3 e por 5.
12
```

---

### cond-13. Maior de Três Valores

**Enunciado**

Faça um programa que leia três números inteiros e mostre qual deles é o maior valor.
E REQUISITO
Use condições compostas para comparar os três valores.

**Exemplo de execução**

```
Entrada:
12
35
20
Saída esperada:
Maior valor: 35
```

**Teste seu programa**

```
Entrada Saída esperada
5; 9, 2 Maior valor: 9
-3,-1, -8 Maior valor: -1
Th Ta, 4 Maior valor: 7
100, 3, 50 Maior valor: 100
13
```

---

### cond-14. Menor de Dois Valores

**Enunciado**

Faça um programa que leia dois números inteiros e mostre qual deles é o menor.
Se os dois valores forem iguais, mostre uma mensagem informando isso.
E REQUISITO
Compare os dois valores usando uma estrutura condicional e trate também o caso de igualdade.

**Exemplo de execução**

```
Entrada:
8
14
Menor valor: 8
| Saída esperada:
```

**Teste seu programa**

```
Entrada Saída esperada
2e9 Menor valor: 2
7e7 Os valores são iguais.
-4e -9 Menor valor: -9
100 e 3 Menor valor: 3
14
```

---

### cond-15. Faixa de Preço

**Enunciado**

Faça um programa que leia o preço de um produto e informe sua faixa de preço de acordo
com a tabela.

**Requisito**

Até R$ 50,00 Econômico
Acima de R$ 50,00 até R$ 150,00 Intermediário
Acima de R$ 150,00 Premium
EI REQUISITO
Mostre apenas a classificação da faixa de preço correspondente ao valor informado.

**Exemplo de execução**

```
Entrada:
89.90
Saída esperada:
Faixa: Intermediário
```

**Teste seu programa**

```
Entrada Saída esperada
40.00 Faixa: Econômico
50.00 Faixa: Econômico
120.00 Faixa: Intermediário
220.00 Faixa: Premium
15
```

---

### cond-16. Empréstimo Aprovado?

**Enunciado**

Faça um programa que leia o salário de uma pessoa e o valor da prestação desejada.
Informe se o empréstimo pode ser aprovado.
E REQUISITO
Considere aprovado quando a prestação for menor ou igual a 30% do salário.
Mostre apenas APROVADO ou NEGADO.

**Exemplo de execução**

```
Entrada:
Salário: 3000.00
Prestação: 800.00
Saída esperada:
APROVADO
km TESTE SEU PROGRAMA
Entrada Saída esperada
Salário Prestação
2000.00 700.00 NEGADO
5000.00 1200.00 APROVADO
1800.00 540.00 APROVADO
2500.00 900.00 NEGADO
16
```

---

### cond-17. Divisível por 2 e 3

**Enunciado**

Faça um programa que leia um número inteiro e informe se ele é divisível por 2 e por 3,
apenas por 2, apenas por 3 ou por nenhum dos dois.
EI REQUISITO
Use condições compostas e mostre apenas uma classificação final.

**Exemplo de execução**

```
Entrada:
18
Saída esperada:
O número é divisível por 2 e por 3.
```

**Teste seu programa**

```
4 O número é divisível apenas por 2.
9 O número é divisível apenas por 3.
7 O número não é divisível por 2 nem por 3.
24 O número é divisível por 2 e por 3.
17
```

---

### cond-18. Conceito do Aluno

**Enunciado**

Leia a nota final de um aluno e informe seu conceito de acordo com a tabela.

**Requisito**

Menor que 5,0 | D
De 5,0 até 6,9 | [01
De 7,0 até 8,9 | B
CERA EA CRER AE
EI REQUISITO
Utilize estruturas condicionais para classificar corretamente a nota informada.

**Exemplo de execução**

```
Entrada:
8.4
Saída esperada:
Conceito: B
```

**Teste seu programa**

```
Entrada Saída esperada
4.5 Conceito: D
5.0 | Conceito: C
7.8 Conceito: B
933 Conceito: A
18
```

---

### cond-19. Temperatura Ambiente

**Enunciado**

Faça um programa que leia a temperatura de um ambiente e informe se ela está
FRIA, AGRADÁVEL ou QUENTE.
E REQUISITO
Considere FRIA para temperaturas menores que 18ºC, AGRADÁVEL para
temperaturas de 18ºC até 27ºC, e QUENTE para temperaturas acima de 27ºC.

**Exemplo de execução**

```
Entrada:
22
Saída esperada:
Temperatura: AGRADÁVEL
```

**Teste seu programa**

```
Entrada Saída esperada
14 Temperatura: FRIA
18 Temperatura: AGRADÁVEL
27 Temperatura: AGRADÁVEL
31 Temperatura: QUENTE
19
```

---

### cond-20. Tarifa de Energia

**Enunciado**

Faça um programa que leia o consumo mensal de energia em kWh e informe a faixa de tarifa
de acordo com a tabela.

**Requisito**

Até 100 kWh Econômica
Acima de 100 kWh até 200 kWh Normal
Acima de 200 kWh Alta
E REQUISITO
Mostre apenas a faixa de tarifa correspondente ao consumo informado.

**Exemplo de execução**

```
Entrada:
160
Saída esperada:
Tarifa: Normal
```

**Teste seu programa**

```
Entrada Saída esperada
80 Tarifa: Econômica
100 Tarifa: Econômica
150 Tarifa: Normal
240 Tarifa: Alta
20
```

---

### cond-21. Turno do Dia

**Enunciado**

Faça um programa que leia uma hora inteira de O a 23 e informe o período do dia
correspondente.
E] REGRA
0as Madrugada
6a11 Manhã
12 4/17 Tarde
18 a 23 Noite
Considere que a hora informada é válida e mostre apenas o período correspondente.

**Exemplo de execução**

```
Entrada:
14
Saída esperada:
Período: Tarde
```

**Teste seu programa**

```
Entrada Saída esperada
3 Período: Madrugada
8 Período: Manhã
12 Período: Tarde
21 Período: Noite
21
```

---

### cond-22. Categoria do Nadador

**Enunciado**

Leia a idade de um atleta e informe sua categoria de acordo com a tabela.

**Requisito**

5a7 Infantil A
8a 10 Infantil B
11 a 13 Juvenil A
14 a 17 Juvenil B
18 ou mais Adulto
EI REQUISITO
Utilize estruturas condicionais para classificar corretamente a idade informada.

**Exemplo de execução**

```
Entrada:
12
Saída esperada:
Categoria: Juvenil A
```

**Teste seu programa**

```
Entrada Saída esperada
6 Categoria: Infantil A
9 Categoria: Infantil B
15 Categoria: Juvenil B
22 Categoria: Adulto
22
```

---

### cond-23. Imposto Simplificado

**Enunciado**

Faça um programa que leia o salário de uma pessoa e informe a faixa de imposto
de acordo com a tabela.

**Requisito**

Até R$ 2000,00 Isento
Acima de R$ 2000,00 até R$ 3500,00 7%
Acima de R$ 3500,00 15%
EI REQUISITO
Mostre apenas a faixa correspondente ao salário informado.

**Exemplo de execução**

```
Entrada:
2800.00
Saída esperada:
Imposto: 7%
```

**Teste seu programa**

```
Entrada Saída esperada
1800.00 Imposto: Isento
2000.00 Imposto: Isento
3500.00 Imposto: 7%
4200.00 Imposto: 15%
23
```

---

### cond-24. Turno de Estudo

**Enunciado**

Leia uma letra que representa o turno de estudo e informe o turno correspondente.

**Requisito**

Mostre apenas o nome do turno correspondente ao código informado.

**Exemplo de execução**

```
Entrada:
V
Saída esperada:
Turno: Vespertino
km TESTE SEU PROGRAMA
Entrada Saída esperada
M Turno: Matutino
N Turno: Noturno
x Turno: Inválido
V Turno: Vespertino
24
```

---

### cond-25. Pressão Sistólica

**Enunciado**

de acordo com a tabela.
Faça um programa que leia a pressão sistólica de uma pessoa e informe a classificação

**Requisito**

Pressão Classificação
Menor que 90 Baixa
90 até 120 Normal
121 até 139 Elevada
140 ou mais Alta
E REQUISITO
Mostre apenas a classificação correspondente ao valor informado.

**Exemplo de execução**

```
Entrada:
128
Saída esperada:
Pressão: Elevada
```

**Teste seu programa**

```
Entrada Saída esperada
85
Pressão: Baixa
110
Pressão: Normal
135
Pressão: Elevada
145
Pressão: Alta
25
```

---

### cond-26. Frete Grátis?

**Enunciado**

Faça um programa que leia o valor da compra e se o cliente é PRIME. Informe se o pedido
recebe frete grátis.
EI REQUISITO
Considere FRETE GRÁTIS quando o valor da compra for maior ou igual a R$ 150,00 ou
quando o cliente for PRIME. Mostre apenas FRETE GRÁTIS ou FRETE COBRADO.

**Exemplo de execução**

```
Entrada:
Valor da compra: 90.00
Cliente PRIME: S
Saída esperada:
FRETE GRÁTIS
v
```

**Teste seu programa**

```
Entrada
Saída esperada
Valor da compra Cliente PRIME
80.00 N FRETE COBRADO
200.00 N FRETE GRÁTIS
90.00 s FRETE GRÁTIS
149.00 N FRETE COBRADO
26
```

---

### cond-27. Faixa de Intervalo

**Enunciado**

Faça um programa que leia um número inteiro e informe em qual faixa ele se encontra.

**Requisito**

Intervalo Classificação
1a 10 Faixa À
11 a 20 Faixa B
21 a 30 Faixa C
Fora desses valores Fora dos intervalos
EI REQUISITO
Mostre apenas a classificação final correspondente ao número informado.

**Exemplo de execução**

```
Entrada:
18
Saída esperada:
Classificação: Faixa B
```

**Teste seu programa**

```
Entrada Saída esperada
5 Classificação: Faixa A
20 Classificação: Faixa B
24 Classificação: Faixa C
40 Classificação: Fora dos intervalos
27
```

---

### cond-28. Entrada no Evento

**Enunciado**

Leia a idade de uma pessoa e se ela possui autorização. Informe se a entrada no evento
é permitida.
EI REQUISITO
Considere ENTRADA PERMITIDA para pessoas com 18 anos ou mais. De 16 a 17 anos,
a entrada só é permitida com autorização. Abaixo de 16 anos, não é permitida.

**Exemplo de execução**

```
Entrada:
Idade: 17
Autorização: S
Saída esperada:
ENTRADA PERMITIDA
Me TESTE SEU PROGRAMA
Entrada E
ar: Saída esperada
Autorização
19 N ENTRADA PERMITIDA
17 N ENTRADA NÃO PERMITIDA
17 s ENTRADA PERMITIDA
14 S ENTRADA NÃO PERMITIDA
28
```

---

### cond-29. Nível de Estoque

**Enunciado**

Faça um programa que leia a quantidade de itens em estoque e informe o nível correspondente.
ReoRA
Quantidade Nível
0 Sem estoque
1ad10 Baixo
11 a 50 Normal
Acima de 50 Alto

**Requisito**

Mostre apenas o nível correspondente à quantidade informada.

**Exemplo de execução**

```
Entrada:
8
Saída esperada:
Nível: Baixo
Mm TESTE SEU PROGRAMA
Entrada Saída esperada
0 Nível: Sem estoque
5 Nível: Baixo
25 Nível: Normal
80 Nível: Alto
29
```

---

### cond-30. Bônus por Vendas

**Enunciado**

de acordo com a tabela.
Faça um programa que leia o valor das vendas de um funcionário e informe a faixa de bônus

**Requisito**

Vendas Bônus
Menor que R$ 500,00 Sem bônus
De R$ 500,00 até R$ 999,99 5%
R$ 1000,00 ou mais 10%
EI REQUISITO
Mostre apenas a faixa de bônus correspondente ao valor informado.

**Exemplo de execução**

```
Entrada:
1200.00
Saída esperada:
Bônus: 10%
v
```

**Teste seu programa**

```
Entrada Saída esperada
300.00 Bônus: Sem bônus
500.00 Bônus: 5%
850.00 Bônus: 5%
1600.00 Bônus: 10%
30
```

---

# Bônus — 30 Exercícios de Estruturas de Repetição

### rep-01. Contagem Crescente

**Enunciado**

Faça um programa que leia um número inteiro positivo N e mostre os
números de 1 até N, um por linha.

**Requisito**

Utilize uma estrutura de repetição e considere que o valor informado
é maior que zero.

**Exemplo de execução**

```
Entrada:
5
Saída esperada:
win
```

**Teste seu programa**

```
3 123
1 1
6 123456
8 2/3 4 5:16 78
01
```

---

### rep-02. Contagem Regressiva

**Enunciado**

Faça um programa que leia um número inteiro não negativo N e mostre
uma contagem regressiva de N até 0.

**Requisito**

Utilize estrutura de repetição e mostre todos os valores em ordem decrescente.

**Exemplo de execução**

```
Entrada:
4
Saída esperada:
OonNws
```

**Teste seu programa**

```
2 210
0 0
5 543210
7 7 6543210
02
```

---

### rep-03. Mostrar Pares

**Enunciado**

Faça um programa que leia um número inteiro N e mostre todos os
números pares de 1 até N.

**Requisito**

Use uma estrutura de repetição e exiba apenas os valores pares.

**Exemplo de execução**

```
Entrada:
10
Saída esperada:
246810
E) TESTE SEU PROGRAMA
6 246
1 nenhum valor
12 2468 10 12
9 2468
5) nenhum valor
03
```

---

### rep-04. Mostrar Ímpares

**Enunciado**

Faça um programa que leia um número inteiro N e mostre todos os
números ímpares de 1 até N.

**Requisito**

Use uma estrutura de repetição e exiba apenas os valores ímpares.

**Exemplo de execução**

```
Entrada:
9
Saída esperada:
13579
```

**Teste seu programa**

```
5 1:35
2 1
10 23579
1 2
04
```

---

### rep-05. Tabuada de 1 a 10

**Enunciado**

Faça um programa que leia um número inteiro e mostre sua tabuada de 1 até 10.

**Requisito**

Utilize uma estrutura de repetição e mostre cada linha no formato:
número x contador = resultado.

**Exemplo de execução**

```
Entrada:
3
Saída esperada:
3 xd 3
6
9
3 de 2
Six
3 x 10 = 30
```

**Teste seu programa**

```
2 mostrar a tabuada de 2 de 1 a 10
5 mostrar a tabuada de 5 de 1 a 10
p/ mostrar a tabuada de 7 de 1 a 10
9 mostrar a tabuada de 9 de 1 a 10
05
```

---

### rep-06. Somatório de 1 até N

**Enunciado**

EBR ENUNCIADO
Faça um programa que leia um número inteiro positivo N e calcule a
soma de todos os números de 1 até N.
a
(OJE REQUISITO
Use uma estrutura de repetição com acumulador para construir o resultado.

**Exemplo de execução**

```
Entrada:
5
Saída esperada:
Soma = 15
am
```

**Teste seu programa**

```
Entrada | Saída esperada
1 Soma = 1
4 Soma = 10
6 Soma = 21
10 Soma = 55
06
```

---

### rep-07. Média de 5 Valores

**Enunciado**

Faça um programa que leia 5 números reais e calcule a média aritmética entre eles.

**Requisito**

Use uma estrutura de repetição para ler os 5 valores e um acumulador para somar os números.
(a) EXEMPLO DE EXECUÇÃO
Entrada:
10
Saída esperada:
Média = 8.0

**Teste seu programa**

```
1 o dm Média = 1.0
7 9.0 2 Média = 6.0
10 10 20 10 10 Média = 10.0
4 6 8 10 12 Média = 8.0
07
```

---

### rep-08. Contar Positivos

**Enunciado**

Faça um programa que leia 6 números inteiros e informe quantos deles são
positivos.

**Requisito**

Utilize uma estrutura de repetição para ler os 6 valores e um contador para
registrar quantos são maiores que zero.

**Exemplo de execução**

```
Entrada:
5-208-13
Saída esperada:
Positivos = 3
```

**Teste seu programa**

```
123456 Positivos = 6
000000 Positivos = 0
apro =>1 Positivos = 3
4-5 6 -7 8 +9 Positivos = 3
08
```

---

### rep-09. Maior Valor Lido

**Enunciado**

Faça um programa que leia 5 números inteiros e informe qual é o maior valor digitado.
Use uma estrutura de repetição para ler os valores e compare cada número com o maior atual.

**Exemplo de execução**

```
Entrada:
12 7 19 3. 15
Saída esperada:
Maior valor = 19
```

**Teste seu programa**

```
12845 Maior valor = 5
96765 Maior valor = 9
4 18 2 18 1 Maior valor = 18
-3 -5 -1 -9 -4 Maior valor = -1
09
```

---

### rep-10. Fatorial de um Número

**Enunciado**

B 1) ENUNCIADO
Faça um programa que leia um número inteiro não negativo N e calcule o seu fatorial.

**Requisito**

Utilize uma estrutura de repetição com acumulador multiplicativo. Considere que 0! = 1.

**Exemplo de execução**

```
Entrada:
5
Saída esperada:
Fatorial = 120
Eq 4) TESTE SEU PROGRAMA
Entrada | Saída esperada
0 Fatorial = 1
1 Fatorial = 1
4 Fatorial = 24
6 Fatorial = 720
10
```

---

### rep-11. Contar Negativos

**Enunciado**

Faça um programa que leia 6 números inteiros e informe quantos deles são
negativos.

**Requisito**

Utilize uma estrutura de repetição para ler os 6 valores e um contador para
registrar quantos são menores que zero.

**Exemplo de execução**

```
Entrada:
5-208-13
Saída esperada:
Negativos = 2
```

**Teste seu programa**

```
123456 Negativos = 0
000000 Negativos = 0
-1-278-31 Negativos = 3
Ú 4 -56-78-9 Negativos = 3 )
11
```

---

### rep-12. Somar Pares de 1 até N

**Enunciado**

Faça um programa que leia um número inteiro positivo N e calcule a soma
de todos os números pares de 1 até N.

**Requisito**

Use uma estrutura de repetição e um acumulador. Considere apenas os
valores pares dentro do intervalo.

**Exemplo de execução**

```
Entrada:
10
Saída esperada:
Soma dos pares = 30
```

**Teste seu programa**

```
6 Soma dos pares = 12
1 Soma dos pares = O
8 Soma dos pares = 20
( 12 Soma dos pares = 42
12
```

---

### rep-13. Contar Múltiplos de 3

**Enunciado**

Faça um programa que leia 8 números inteiros e informe quantos deles são
múltiplos de 3.

**Requisito**

Utilize uma estrutura de repetição para ler os 8 valores e um contador para
registrar os números divisíveis por 3.

**Exemplo de execução**

```
Entrada:
3567941012 14
Saída esperada:
Múltiplos de 3 = 4
```

**Teste seu programa**

```
Entrada Múltiplos de 3
12,34 5678 Múltiplos de 3 = 2
3 6 9 1215 1821 24 Múltiplos de 3 = 8
14578 104113 Múltiplos de 3 = 0
023468912 Múltiplos de 3 = 5
13
```

---

### rep-14. Média de Idades

**Enunciado**

Faça um programa que leia 5 idades inteiras e calcule a média aritmética
das idades informadas.

**Requisito**

Use uma estrutura de repetição para ler os 5 valores e um acumulador
para somar as idades.

**Exemplo de execução**

```
Entrada:
20 18 25 22 15
Saída esperada:
Média das idades = 20.0
```

**Teste seu programa**

```
Entrada Saída esperada
10 10 10 10 10 Média das idades = 10.0
18 20 22 24 26 Média das idades = 22.0
30 40 50 60 70 Média das idades = 50.0
, 12 14 16 18 20 Média das idades = 16.0 )
14
```

---

### rep-15. Ler até Zero

**Enunciado**

Faça um programa que leia números inteiros até que o valor O seja informado.
Ao final, mostre quantos números foram digitados antes do zero.

**Requisito**

Use uma estrutura de repetição com sentinela. Não conte o valor zero.

**Exemplo de execução**

```
Entrada:
58290
Saída esperada:
Quantidade lida = 4
```

**Teste seu programa**

```
E
1230 Quantidade lida = 3
0 Quantidade lida = 0
E AR RA RS) Quantidade lida = 5
4 10 Quantidade lida = 2
15
```

---

### rep-16. Somar até Sentinela

**Enunciado**

Faça um programa que leia números inteiros até que o valor -1 seja
informado. Ao final, mostre a soma dos valores lidos.

**Requisito**

Use uma estrutura de repetição com sentinela e um acumulador.
Não some o valor -1.

**Exemplo de execução**

```
Entrada:
472-1
Saída esperada:
Soma = 13
```

**Teste seu programa**

```
Entrada Saída esperada
223 = Soma = 6
5 =d Soma = 5
000 =1 Soma = 0
10 20 30 40 -1 Soma = 100
16
```

---

### rep-17. Fibonacci com N Termos

**Enunciado**

Faça um programa que leia um número inteiro positivo N e mostre os
N primeiros termos da sequência de Fibonacci.

**Requisito**

Use uma estrutura de repetição para gerar a sequência. Considere que
a sequência começa com O e 1.

**Exemplo de execução**

```
Entrada:
6
Saída esperada:
0122 35
```

**Teste seu programa**

```
1 0
2 oa
5 01223
l 8 0 1.723: 58:13 )
17
```

---

### rep-18. Maior e Menor Valor

**Enunciado**

Faça um programa que leia 5 números inteiros e informe o maior e o menor
valor digitados.

**Requisito**

Use uma estrutura de repetição para ler os valores e compare cada número
com o maior e o menor atuais.

**Exemplo de execução**

```
Entrada:
12 719315
Saída esperada:
Maior 19
Menor 3
```

**Teste seu programa**

```
12345 Maior = 5 | Menor = 1
98765 Maior = 9 | Menor = 5
4 18 2 18 1 Maior = 18 | Menor = 1
-q3-5 -1-9 -4 Maior = -1 | Menor = -9
18
```

---

### rep-19. Notas Acima da Média

**Enunciado**

Faça um programa que leia 5 notas reais, calcule a média da turma e
informe quantas notas ficaram acima da média calculada.

**Requisito**

Use repetição para ler as notas. Depois calcule a média e conte quantos
valores são maiores que ela.

**Exemplo de execução**

```
Entrada:
786910
Saída esperada:
Média = 8.0
Acima da média = 2
```

**Teste seu programa**

```
1172114 Média = 1.0 | Acima da média = 0
57972 Média = 6.0 | Acima da média = 3
10 10 10 10 10 Média = 10.0 | Acima da média = 0
4 6 8 10 12 Média = 8.0 | Acima da média = 2
19
```

---

### rep-20. Contagem de 2 em 2

**Enunciado**

Faça um programa que leia dois números inteiros: início e fim. Mostre uma
sequência de 2 em 2, partindo do início até alcançar ou ultrapassar o fim.

**Requisito**

Use uma estrutura de repetição. Considere que o valor inicial é menor que
o valor final.

**Exemplo de execução**

```
Entrada:
3 11
Saída esperada:
3 5 79 1%
```

**Teste seu programa**

```
Entrada Saída esperada
17 1357
2 10 246810
5: 6 E (
08 024668
20
```

---

### rep-21. Contar Pares em 10 Valores

**Enunciado**

B ENUNCIADO
Faça um programa que leia 10 números inteiros e informe quantos deles são pares.

**Requisito**

Use uma estrutura de repetição para ler os 10 valores e um contador para
registrar quantos números são divisíveis por 2.

**Exemplo de execução**

```
Entrada:
5298114 6741053
Saída esperada:
Pares = 5
```

**Teste seu programa**

```
E
1234567890 Pares = 5
2468 10 12 14 16 18 20 Pares = 10
1357941 13151719 Pares = 0
Ú 0123456789 Pares = 5
21
```

---

### rep-22. Somar Ímpares de 1 até N

**Enunciado**

Faça um programa que leia um número inteiro positivo N e calcule a soma
de todos os números ímpares de 1 até N.

**Requisito**

Use uma estrutura de repetição e um acumulador. Considere apenas os
valores ímpares dentro do intervalo.

**Exemplo de execução**

```
Entrada:
9
Saída esperada:
Soma dos ímpares = 25
```

**Teste seu programa**

```
5 Soma dos ímpares = 9
1 Soma dos ímpares = 1
7 Soma dos ímpares = 16
11 Soma dos ímpares = 36
22
```

---

### rep-23. Média de Números Positivos

**Enunciado**

Faça um programa que leia 6 números reais positivos e calcule a média
aritmética entre eles.

**Requisito**

Use uma estrutura de repetição para ler os 6 valores e um acumulador
para somar os números antes de calcular a média.

**Exemplo de execução**

```
Entrada:
4 6 8 10 12 14
Saída esperada:
Média = 9.0
```

**Teste seu programa**

```
Lidia Média = 1.0
246810 12 Média = 7.0
555555 Média = 5.0
3 6 9 12 15 18 Média = 10.5
23
```

---

### rep-24. Sequência Decrescente

**Enunciado**

Faça um programa que leia um número inteiro positivo N e mostre os
números de N até 1, um por linha.

**Requisito**

Use uma estrutura de repetição e considere que o valor informado é
maior que zero.

**Exemplo de execução**

```
U
Entrada:
5
Saída esperada:
Ho wu
```

**Teste seu programa**

```
Entrada | Saída esperada
3 324
1 i
6 654321
8 876 D4 8 21
24
```

---

### rep-25. Produto de 1 até N

**Enunciado**

Faça um programa que leia um número inteiro positivo N e calcule o
produto de todos os números de 1 até N.

**Requisito**

Use uma estrutura de repetição e um acumulador multiplicativo.

**Exemplo de execução**

```
Entrada:
5
Saída esperada:
Produto = 120
```

**Teste seu programa**

```
E
1 Produto = 1
3 Produto = 6
4 Produto = 24
6 Produto = 720
25
```

---

### rep-26. Contar Valores Maiores que 10

**Enunciado**

Faça um programa que leia 7 números inteiros e informe quantos deles são
maiores que 10.

**Requisito**

Use uma estrutura de repetição para ler os 7 valores e um contador para
registrar os que atendem à condição.

**Exemplo de execução**

```
Entrada:
5 12 8 20 11 3 15
Saída esperada:
Maiores que 10 = 4
```

**Teste seu programa**

```
1234567 Maiores que 10 = 0
li 12 13 14 15 16 17 Maiores que 10 = 7
10 10 10 10 10 10 10 Maiores que 10 = 0
( 9 10 21 12 13 867 Maiores que 10 = 3 )
26
```

---

### rep-27. Somar Valores até 100

**Enunciado**

Faça um programa que leia números inteiros positivos e some os valores
digitados até que a soma seja maior ou igual a 100. Ao final, mostre a soma
obtida.

**Requisito**

Use uma estrutura de repetição com acumulador. Pare quando a soma atingir
ou ultrapassar 100.

**Exemplo de execução**

```
Entrada:
20 15 30 25 18
Saída esperada:
Soma final = 108
```

**Teste seu programa**

```
Entrada Saída esperada
50 50 Soma final = 100
10 20 30 40 Soma final = 100
60 25 20 Soma final = 105
33 33 33 10 Soma final = 109
27
```

---

### rep-28. Tabuada até o Limite

**Enunciado**

Faça um programa que leia um número inteiro e um limite final. Mostre a
tabuada do número, começando em 1 e indo até o multiplicador informado.

**Requisito**

Use uma estrutura de repetição e mostre cada linha no formato:
número x contador = resultado.

**Exemplo de execução**

```
a DN
Entrada:
4 5
Saída esperada
4x1 =4
4x2=8
4x3 =12
4x 4 = 16
4x5 =20
```

**Teste seu programa**

```
23 mostrar a tabuada de 2 até x3
54 mostrar a tabuada de 5 até x4
7 2 mostrar a tabuada de 7 até x2
( 9 6 mostrar a tabuada de 9 até x6 )
28
| BÔNUS 03 — 30 EXERCÍCIOS EXTRAS DE ESTRUTURAS DE REPETIÇÃO
```

---

### rep-29. Contar Notas Aprovadas

**Enunciado**

Faça um programa que leia 8 notas reais e informe quantas delas são maiores
ou iguais a 7.0.

**Requisito**

Use uma estrutura de repetição para ler as notas e um contador para
registrar as aprovadas.

**Exemplo de execução**

```
Entrada:
655. 750 8:2 500 9:1 758: 6.9 1040
Saída esperada:
Aprovadas = 5
```

**Teste seu programa**

```
Do êntrada | Saídaesperada |
740. 760 TO TRO! 7:0:7.0) 750 750 Aprovadas = 8
640 6:5 5.0 4:0 3.0 2:0 1:0 0.0 Aprovadas = 0
8.0 9.0 10,0 7.5 6.5 5.5 4,5 3.5 Aprovadas = 4
7.2 6.8 7.1 6.9 8.0 5.0 9.5 7.0 Aprovadas = 5
29
```

---

### rep-30. Contar Números no Intervalo

**Enunciado**

Faça um programa que leia 10 números inteiros e informe quantos deles
estão no intervalo de 10 até 20, inclusive.

**Requisito**

Use uma estrutura de repetição para ler os 10 valores e um contador para
registrar apenas os números dentro do intervalo solicitado.

**Exemplo de execução**

```
Entrada:
5 10 12 25 18 7 20 14 30 11
Saída esperada:
No intervalo = 6
```

**Teste seu programa**

```
10 11 12 13 14 15 16 17 18 19
No intervalo = 10
U
1234567852 No intervalo = 0
10 20 9 21 15 16 8 22 14 13 No intervalo = 6
30 25 20 19 18 17 16 15 14 13 No intervalo = 8
30
```

---

