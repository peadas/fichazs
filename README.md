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
- **Settings > Jujutsu**: ligado, a perícia Bruxaria vira **Maldição** e os passos de dado ganham d14, d16 e d18 (d4 a d20), inclusive no pavor e em *Rolar dados* (a forma 3D deles está descrita na v2.6). A escolha fica salva na ficha.
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

## v2.5: mesa de dados, resultado no cartão e Foco
- **Mesa de dados:** a cada rolagem aparece uma janelinha no canto da tela do Owlbear (de todos os jogadores) com a mesa hexagonal (`mesa.webp`). Os dados rolam *dentro* dela, bem menores, e batem nas paredes do hexágono. **Arraste a mesa clicando nela**; a **roda do mouse** muda o tamanho. A posição e o tamanho ficam salvos. Ela some sozinha uns segundos depois de os dados pararem. No menu, *Organizar* também mostra a mesa para posicionar (botões *Mesa −/+*).
- **Resultado no cartão:** para jogadores, o resultado (dados, valor, crítico) aparece **ao lado da foto e do nome** e **fica até o jogador rolar de novo**. As rolagens do **mestre** e de **NPCs** continuam aparecendo no topo e **desaparecem sozinhas**. Quem não tem cartão na tela (não entrou na mesa, ou cartões desligados) também vê o aviso temporário no topo.
- **Foco** (botão com ícone de alvo, acima do Pavor): ligado, a mesa mostra o círculo **2x** (`mesa2x.webp`). O dado cujo **centro parar dentro do círculo** vale o **dobro** (ex.: 1d4 + 1d6, o d4 caiu no 2x com 4: vira 8). O dado fica dourado com **×2**, a mesa brilha, e o valor do teste, crítico e a nota *"Foco: … caiu no 2×"* já usam o valor dobrado. Não existe sorteio escondido: é a física que decide, então a chance é pequena (cerca de 3% por dado) e totalmente aleatória. Para mudar o tamanho do círculo, edite `ENG.FOCO.r` em `engine.js`.
- A física agora é um hexágono (paredes calculadas a partir da imagem); todos os computadores continuam chegando ao mesmo resultado pela mesma semente.

## v2.6: resultado no nome, histórico, mesa sempre visível, d14/d16/d18 e névoa Jujutsu
- **Resultado ao lado do nome:** no cartão, os dados saem na mesma linha do nome (ex.: `da da  ▲1 ■1 = 2`), com crítico em amarelo e falha crítica em vermelho; ficam até a próxima rolagem.
- **Histórico em cima da mesa de dados:** sem fundo, só o nome de quem rolou e os resultados. Aparecem no máximo **3 linhas**; a nova entra por baixo e as antigas sobem e somem. Sem a mesa fixa, cada linha some sozinha depois de uns 14 s.
- **Settings > Mesa de dados sempre visível** (também no menu da Mesa): ligado, a mesa fica sempre na tela (e mesmo com *Cartões na tela* desligado). Desligado, ela só aparece quando um dado gira. Fica salvo por navegador (`tray-always`).
- **Dadinho do lado da mesa:** ícone bem sutil à esquerda da mesa (à direita se não houver espaço). Clique, digite `1d4`, `2d6+3`, `1d20+1d8-2`… e Enter: o dado cai para todos, com o nome e o histórico normais. Com *Jujutsu* ligado aceita também d14, d16 e d18. Arquivo: `quick.html`.
- **d14, d16 e d18 de verdade no 3D:** o **d16** é a bipirâmide de 16 triângulos do manual (faces opostas somam 17); o **d14** e o **d18** também são bipirâmides (7 e 9 triângulos em cima e embaixo), e o resultado é a face "par" da que fica no chão (somam 15 e 19). Os números ficam com o alto virado para a ponta do dado, e o resultado lido é o número da face de cima.
- **Névoa Jujutsu:** com Jujutsu ligado, a névoa da ficha e do menu fica translúcida e azulada (energia amaldiçoada).

## O que mudou
- Mesa e ficha agora são **uma extensão só**, no mesmo domínio. Por isso a ficha é lida direto do navegador e sumiram: `netlify.toml`, proxy `/ficha/*`, `sync.js`, função `ficha-sync`, banco Postgres e Drizzle.
- O que a Mesa mostra é publicado nos metadados do jogador no Owlbear (some quando o jogador sai da sala).

## Arquivos
`manifest.json` · `entrada.html` (tela inicial: mesa e NPCs) · `ficha.html` (ficha) · `background.html` (dados + publicação da mesa + edições do mestre) · `overlay.html` + `engine.js` (dados 3D) · `mesa.webp` + `mesa2x.webp` (mesa de dados) · `gm.html` (ficha do jogador aberta pelo mestre) · `efeitos.js` · `nevoa.png` · `moldura-menu.jpg` · `quick.html` (ícone e caixa de rolagem rápida) · `mesa-lib.js` · `obr.js` · `icon.svg`
