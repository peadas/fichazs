# Ficha Ordem Paranormal — extensão para Owlbear Rodeo

Ficha de personagem com dados 3D que caem na mesa de todos, mais a **Mesa** (foto, PV e PD de quem entrou; só o mestre abre as fichas).
Tudo estático: **sem Netlify, sem banco, sem servidor**. Funciona direto no GitHub Pages.

## Publicar no GitHub Pages
1. Crie um repositório público e envie **todos** os arquivos desta pasta (inclusive o `.nojekyll`), na raiz.
2. Settings > Pages > Source: *Deploy from a branch* > `main` / `(root)` > Save.
3. A URL do manifest será `https://SEU-USUARIO.github.io/NOME-DO-REPO/manifest.json`.

> **Importante:** o Owlbear junta o domínio com os caminhos do `manifest.json` sem barra, por isso eles começam com `/`.
> Isso funciona quando o site está na raiz (repositório chamado `SEU-USUARIO.github.io`). Se o repositório tiver outro nome
> (URL com `/NOME-DO-REPO/`), ponha o nome no começo de cada caminho: `"/NOME-DO-REPO/ficha.html"`, `"/NOME-DO-REPO/icon.svg"`, etc.

## Instalar no Owlbear
Avatar > Profile > Extensions > Add Extension > cole a URL do manifest. Cada jogador instala uma vez.

## Usar
- Ícone na barra do Owlbear: abre a tela da **Mesa**. No topo há o botão **FICHA**, para jogador e mestre abrirem a própria ficha numa janela grande (não precisa entrar na mesa para isso).
- **Jogador**: **Entrar na mesa** (o personagem aparece em branco) e preencha a ficha. Foto, nome, PV e PD aparecem para todos.
- **Mestre**: aba **Mesa**: clique num jogador e a ficha dele abre bem grande, **editável** (as mudanças vão para o jogador sozinhas). Aba **NPCs**: cria NPCs com nome, PV e PD, ajusta com − e +, abre a ficha completa e escolhe **Mostrar na mesa**. NPCs ficam salvos no navegador do mestre.
- **Exportar / Importar** (rodapé da ficha): backup da ficha em arquivo.

## Visual e novidades
- **Menu** com moldura prateada sobre fundo escuro (`moldura-menu.jpg`), **névoa** andando no fundo do menu e da ficha (`nevoa.png`) e **pulinho** ao passar o mouse em dados, botões e letras (`efeitos.js`).
- **PV/PD no menu** em barrinhas segmentadas: o jogador clica nos segmentos do próprio cartão para mudar a vida sem abrir a ficha (clicar no último cheio tira um). O mestre faz o mesmo nos NPCs.
- **Olho do NPC** (aba NPCs, ao lado de *Ficha*, e dentro da ficha do NPC): olho fechado = as rolagens do mestre para aquele NPC são **ocultas**; os dados só caem na tela do mestre. Olho aberto = todo mundo vê (padrão).

## Ficha larga e abas (v2.1)
- A ficha ocupa a janela inteira (sem limite de largura "de PDF"); a janela abre maior (até 1800×1000) e sobra espaço para novos campos.
- **Habilidades** e **Equipamento** são cartões na ficha com prévia do texto; clicar abre um painel grande com abas (Esc ou ✕ fecha).
- **Fechar** e **Remover imagem** viraram ícones pequenos (o de remover fica no canto da foto, só aparece com imagem).

## v2.2: ícones, Settings e cartões na tela
- A barra de baixo da ficha agora é só ícones: rolar dados, relações, **Settings** (engrenagem), exportar, importar e limpar (a lixeira fica vermelha e pede um segundo clique).
- **Settings > Jujutsu**: ligado, a perícia Bruxaria vira **Maldição** e os passos de dado ganham d14, d16 e d18 (d4 a d20), inclusive no pavor e em *Rolar dados*. A escolha fica salva na ficha.
- **Cartões na tela do Owlbear**: quem entra na mesa aparece direto na tela de todos com foto, nome, PV e PD, sem fundo (NPCs mostrados pelo mestre também). No menu da Mesa: interruptor **Cartões na tela** e botão **Organizar** (arraste cada cartão para onde quiser, **− / +** muda o tamanho, **Restaurar**, **Concluir** ou Esc). A posição é de cada jogador, salva no navegador dele.
- Os dados 3D e os cartões usam a mesma camada transparente (`overlay.html`), que agora fica aberta enquanto os cartões estiverem ligados.

## v2.3: mover cartões pela foto e resultado no topo
- **Mover cartões:** basta apertar e arrastar a foto (não precisa mais do botão Organizar, que continua no menu como reserva). Cada foto tem uma zona transparente por cima (`grab.html`) que não atrapalha o resto do mapa.
- **Resultado dos dados** aparece no topo ao lado do nome de quem rolou: dados brancos (com a forma de cada dado), **amarelo** = crítico, **vermelho** = falha crítica, **preto** = pavor, **azul** = relação; mais o valor do teste.

## v2.4: habilidade do Perfil
Embaixo dos atributos há um cartão com a habilidade do **Perfil** escolhido no topo da ficha, com o texto do livro. Ele troca sozinho quando o Perfil muda.
- **Executor · Ímpeto** (5 espaços, clicáveis). Toda falha num teste (abaixo da **DT**, padrão 7; zero desliga) enche 1 espaço sozinha e a nota *"Falha (DT 7): Ímpeto +1"* entra no resultado. **1 espaço:** +▲ (+1 passo) no primeiro dado do próximo teste. **3 espaços:** sobe um atributo +1 passo até o fim da cena (botões Físico/Mente/Emoção no cartão ou ⚡ ao lado do atributo; selo ▲ no dado). **3 espaços:** ação extra em cenas de conflito.
- **Analista · Análise** (máx. 4 marcadores). *Analisar* ganha 2. Depois de um teste, o painel do resultado mostra os dados com **− / +**: cada marcador muda um dado em 1 (até o máximo do dado), em quantos dados e vezes quiser. O resultado é refeito, a nota *"Análise: Furtividade 3→5"* entra sozinha e a mesa recebe o resultado atualizado.
- **Vigilante · Prontidão** (1 vez por rodada, 2 PD). Depois de um teste, toque num dado que **não tirou 1**: ele é rerrolado (cai de novo na mesa de todos), 2 PD são descontados e o resultado é refeito. *Nova rodada* devolve a Prontidão.
- **Fim da cena** esvazia o Ímpeto, remove os aumentos de atributo, zera os marcadores de Análise e devolve a Prontidão. Rolagens personalizadas não usam a habilidade.

## Janelas e dados
- A ficha (e a ficha aberta pelo mestre) fecham **clicando fora da janela** ou apertando **Esc**.
- Os dados 3D carregam o three.js de até 3 CDNs. Se o navegador não tiver WebGL (aceleração de hardware desligada), os dados aparecem **desenhados em 2D**, com o mesmo resultado e o mesmo painel de resultado para todos.
- Entrar na mesa publica o cartão direto da tela da Mesa; se o navegador bloquear o armazenamento do site, a tela avisa.

## O que mudou
- Mesa e ficha agora são **uma extensão só**, no mesmo domínio. Por isso a ficha é lida direto do navegador e sumiram: `netlify.toml`, proxy `/ficha/*`, `sync.js`, função `ficha-sync`, banco Postgres e Drizzle.
- O que a Mesa mostra é publicado nos metadados do jogador no Owlbear (some quando o jogador sai da sala).

## Arquivos
`manifest.json` · `entrada.html` (tela inicial: mesa e NPCs) · `ficha.html` (ficha) · `background.html` (dados + publicação da mesa + edições do mestre) · `overlay.html` + `engine.js` (dados 3D) · `gm.html` (ficha do jogador aberta pelo mestre) · `efeitos.js` · `nevoa.png` · `moldura-menu.jpg` · `mesa-lib.js` · `obr.js` · `icon.svg`
