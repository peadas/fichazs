# Ficha Ordem Paranormal — extensão para Owlbear Rodeo

Ficha de personagem com dados 3D que caem na mesa de todos, mais o painel **Mesa** (foto, PV e PD de quem entrou; só o mestre abre as fichas).
Tudo estático: **sem Netlify, sem banco, sem servidor**. Funciona direto no GitHub Pages.

## Publicar no GitHub Pages
1. Crie um repositório público e envie **todos** os arquivos desta pasta (inclusive o `.nojekyll`), na raiz.
2. Settings > Pages > Source: *Deploy from a branch* > `main` / `(root)` > Save.
3. A URL do manifest será `https://SEU-USUARIO.github.io/NOME-DO-REPO/manifest.json`.

## Instalar no Owlbear
Avatar > Profile > Extensions > Add Extension > cole a URL do manifest. Cada jogador instala uma vez.

## Usar
- Ícone **Ficha** na barra: abre a ficha. Clique numa perícia/atributo para rolar; os dados caem na mesa de todos.
- Painel **Mesa** (canto superior direito, sempre visível): jogadores clicam em **Entrar na mesa** e todos veem foto, PV e PD.
- Mestre: clica num jogador do painel e abre a ficha dele (somente leitura, atualiza ao vivo).
- **Exportar / Importar** (rodapé da ficha): backup da ficha em arquivo. A ficha fica salva no navegador de quem joga.

## O que mudou
- Mesa e ficha agora são **uma extensão só**, no mesmo domínio. Por isso a ficha é lida direto do navegador e sumiram: `netlify.toml`, proxy `/ficha/*`, `sync.js`, função `ficha-sync`, banco Postgres e Drizzle.
- O que a Mesa mostra é publicado nos metadados do jogador no Owlbear (some quando o jogador sai da sala).

## Arquivos
`manifest.json` · `ficha.html` (ficha) · `background.html` (dados + painel + publicação) · `overlay.html` + `engine.js` (dados 3D) · `mesa.html` (painel) · `gm.html` (visão do mestre) · `mesa-lib.js` · `obr.js` · `icon.svg`
