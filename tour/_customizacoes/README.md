# Customizações do tour

Ajustes feitos por cima do export do 3DVista. **Um novo export sobrescreve tudo
isto** — se re-exportar do 3DVista, reaplique os três itens abaixo.

## 1. Setas no chão (arquivos em `media/`)

Os pontos de caminhada vinham com um anel branco pulsante, de baixo contraste em
piso claro. Foram trocados por uma seta deitada no chão, na paleta do site
(corpo creme #fbfaf6 sobre halo oliva #38402f).

- `make_arrow.py` — gera as folhas de sprite. A geometria tem que bater com a
  original (4 col x 6 lin, 24 quadros), senão o player mostra o quadro errado.
- `original-ring-*.png` — os anéis originais, para reverter.

Regerar:

    python3 make_arrow.py arrow_930.png 155   # → substitui as 132 folhas 1200x930
    python3 make_arrow.py arrow_600.png 100   # → substitui as 4 folhas 1200x600

Os alvos são os `media/panorama_*_HS_*.png` com essas dimensões. Não mexa nos
outros `_HS_` — são os pontos de informação, não de caminhada.

## 2. Abertura sem "planeta" (em `script.js`)

O tour abria em visão de cima: `pitch: -90` com `stereographicFactor: 1`
(efeito tiny planet), 1s parado, depois 3s desenrolando até o nível do olhar.

Em `panorama_7914C5A7_..._camera` (o panorama ENTRADA INICIO, primeiro da
playlist), o `displayOriginPosition` + `displayMovements` foram trocados por uma
entrada no nível do olhar: começa levemente aberta e deslocada
(hfov 124, yaw 142.4) e assenta em 2,6s na posição de descanso do tour
(yaw 147.37, pitch 1.87, hfov 110), com easing `cubic_out`.

Atenção: o schema do player declara `targetHfov` (H maiúsculo).

## 3. Transição de caminhada mais lenta (em `script.js`)

O player já fazia a transição boa — a de "translation", que empurra a câmera
para frente de verdade. Ela liga sozinha quando `transitionMode` é `"blending"`
e o panorama de origem tem o destino em `adjacentPanoramas` (com `yaw` e
`backwardYaw`). Isso já vinha certo no export.

O problema era só a duração: o padrão do player é 1000ms, rápido demais, e o
warp aparecia como um vulto duplo. No ViewerArea `MainViewer` foi setado:

    "translationTransitionDuration": 1250

Não mexer no `MapViewer` (é o visualizador de planta).

## 4. Menu de baixo: fonte, larguras e nomes (em `script.js`)

Os 8 botões usavam `"fontSize": "1vmax"`. Em celular no retrato o `vmax` cai
para ~390, então o texto renderizava a **3.9px** — ilegível. Agora é fixo:

    "fontSize": 13

As larguras eram % (do espaço restante depois dos gaps de 20px), o que em tela
estreita dava ~22px por botão. Agora são px, medidos com Montserrat bold 13px
e uma folga de ~6px.

**A faixa toda ocupa ~911px e é uma linha só — abaixo disso ela corta o texto.**
Ela até rola no dedo (o container é `overflow: "scroll"`), mas ninguém adivinha
isso e o corte fica feio. Então quem decide se ela aparece é o
`js/tour-menu.js`, fora do tour: ele mede o iframe e esconde a faixa abaixo de
930px. Ver a seção 5.

Se mudar um nome, remeça a largura **e** o `MIN_WIDTH` do tour-menu.js, senão
o texto corta.

Nomes trocados (só o `label` dos botões):

| antes         | agora             |
|---------------|-------------------|
| ESPAÇO ABERTO | ESPAÇO CÉU        |
| CASA          | CASA DE OPERAÇÕES |
| PARQUINHO     | QUINTAL MANDICA   |

Os `label` dos **panoramas** ficaram como estavam de propósito: não aparecem na
tela (o tour não tem nenhum componente de texto) e servem de deep link via
`?media-name=`, então renomeá-los quebraria links.

## Encoding: o `script.js` é ASCII puro

O export escapa todo acento como `\uXXXX` de propósito, e o servidor serve o
arquivo como `text/javascript` **sem charset**. Se gravar acento em UTF-8 cru,
o navegador pode decodificar errado ("INÍCIO" vira "INÃCIO"). Ao editar, gere
os escapes — em Python, `json.dumps(txt, ensure_ascii=True)`.

## 5. Faixa de nomes: some quando não cabe (fora do tour)

Arquivos: `js/tour-menu.js`, `tour.html`, `index.html`.

A faixa precisa de ~911px numa linha. Medindo de verdade:

| janela | iframe no tour.html | embed na home |
|--------|---------------------|---------------|
| 1440   | 1440 (cabe)         | 978 (cabe)    |
| 1024   | 1024 (cabe)         | 920 (corta)   |
| 900    | 900 (corta)         | 810 (corta)   |
| 390    | 390 (corta)         | 348 (corta)   |

Ou seja, não é só "celular": tablet e notebook pequeno também cortavam. Por
isso a regra é medir o iframe, não um breakpoint chutado.

- `js/tour-menu.js` — acha a barra pelo texto "BANHEIROS", marca com
  `data-tour-hide` e esconde por CSS `!important` (o player reescreve o `style`
  inline a cada layout, então inline não segura). Roda no `tourLoaded`, no
  resize e no orientationchange.
- `tour.html` — abaixo de 930px mostra o botão **"Escolha o espaço"**, que abre
  uma folha com os 8 ambientes por extenso. Navega por
  `rootPlayer.setMainMediaByIndex(i)`.
- `index.html` — lá o tour é prévia, com CTA de tela cheia logo abaixo, então
  só esconde a faixa; sem seletor.

Os índices dos 8 ambientes estão em `SPACES`, no `tour.html`. Se mexer no menu
dentro do 3DVista, reconferir:

    INÍCIO 0 · ESPAÇO CÉU 47 · CASA DE OPERAÇÕES 26 · SUÍTE 35
    ÁREA DE SERVIÇO 38 · QUINTAL MANDICA 21 · GRAMADO 1 · BANHEIROS 12
