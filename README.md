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

## Janelas e dados
- A ficha (e a ficha aberta pelo mestre) fecham **clicando fora da janela** ou apertando **Esc**.
- Os dados 3D carregam o three.js de até 3 CDNs. Se o navegador não tiver WebGL (aceleração de hardware desligada), os dados aparecem **desenhados em 2D**, com o mesmo resultado e o mesmo painel de resultado para todos.
- Entrar na mesa publica o cartão direto da tela da Mesa; se o navegador bloquear o armazenamento do site, a tela avisa.

## O que mudou
- Mesa e ficha agora são **uma extensão só**, no mesmo domínio. Por isso a ficha é lida direto do navegador e sumiram: `netlify.toml`, proxy `/ficha/*`, `sync.js`, função `ficha-sync`, banco Postgres e Drizzle.
- O que a Mesa mostra é publicado nos metadados do jogador no Owlbear (some quando o jogador sai da sala).

## Arquivos
`manifest.json` · `entrada.html` (tela inicial: mesa e NPCs) · `ficha.html` (ficha) · `background.html` (dados + publicação da mesa + edições do mestre) · `overlay.html` + `engine.js` (dados 3D) · `gm.html` (ficha do jogador aberta pelo mestre) · `mesa-lib.js` · `obr.js` · `icon.svg`
