# Ficha Ordem Paranormal — extensão para Owlbear Rodeo

## v2.16.4 — Pontos de armadura e sons de ferro na fechadura
- **Pontos de armadura na ficha (playtest):** nova linha abaixo de PV/PD, com o ícone de escudo e **4 bolinhas**. Bolinha cheia = você tem aquele ponto de armadura; clique para tirar/pôr (clicar na última cheia esvazia). Máximo de 4. Não muda nenhuma conta: **só lembra**. Quando o PV diminui e ainda há armadura, as bolinhas pulsam e aparece o aviso "Você ainda tem N de armadura: gaste 1 (ação livre) para reduzir esse dano em 10." Vale também quando o PV cai por fora da ficha (ex.: "Aplicar −X PV" da fechadura). Fica salvo na ficha e no export/import.
- **Sons da fechadura refeitos, de cadeado/mecanismo** (arquivos `som-*.mp3`): nada de tom de sino/xilofone. Cada som é feito de cliques secos de metal, **mola de ferro** (o "sproing" que cai de agudo para grave), atrito da chave e batidas de ferro com corpo (*thock*). Alto = tic seco de pino fino com micro-mola; baixo = toc de ferro maior; pino certo = tic + assentar do cadeado; abrir = chave raspando, giro com catraca e a haste do cadeado saltando na mola; arrombar = pé de cabra rangendo, estalo da madeira, pancada, tranca estourando e peças caindo; quebrou = estalo e barra de aço solta. Alto, baixo e clic têm 3 variações sorteadas. Se um arquivo não carregar, volta o som sintetizado.
- `tic-alto.mp3` e `toc-baixo.mp3` ficaram sem uso (podem ser apagados). Versão dos arquivos: `?v=2.16.4`.

## v2.16.3 — Tela da bolsa de fechaduras e sons reais de gazua
- **Bolsa em tela própria (mestre):** na aba Fechadura, o botão **🎒 Abrir bolsa** leva a uma tela que mostra **só as fechaduras salvas**, cada uma com o **nome que o mestre deu** em destaque, o tipo (Porta/Baú) e um resumo (dados, PA, DT, tentativas, itens). Em cada cartão: **Preparar**, **Mostrar** e **✕ Remover** (pede confirmação). **← Voltar** volta para a fechadura. Com mais de 5 salvas aparece um campo para procurar pelo nome. Dê o nome no campo **Nome** antes de **Salvar esta na bolsa**; salvar de novo com o mesmo nome atualiza a que já existe.
- **Sons de alto e baixo agora vêm do áudio real da gazua** (`tic-alto.mp3`: clique mais agudo; `toc-baixo.mp3`: clique mais grave e abafado). Se o arquivo não carregar, volta o som sintetizado de antes. Os outros sons (certo, abriu, quebrou) continuam sintetizados.
- Arquivos novos: `tic-alto.mp3`, `toc-baixo.mp3`. Versão dos arquivos: `?v=2.16.3`.

## v2.16.2 — Fechadura sem F5, sons de metal e "Ouvir de novo"
- **Sem precisar de F5:** a cada mudança o mestre avisa todos (jogadores, tela do Owlbear e segundo plano), que releem a sala na hora. Com fechadura ativa o menu também confere a cada 3 s, a tela a cada 4 s e o segundo plano a cada 5 s.
- **Sons novos, de metal:** alto = **tic** agudo e seco; baixo = **toc** grave e abafado; certo = **clic-clac** do tambor encaixando; abriu = chave girando (catraca) e a trava deslizando; quebrou = metal estalando. Tudo sintetizado, sem arquivo de áudio.
- **Ouvir de novo (modo "sem guia"):** depois de uma tentativa o jogador repete os sons dela. Limite por rodada pelo dado de Crime: d4 = 2, d6 = 3, d8 = 4, d10 = 5, d12 = 6. A "Nova rodada" do mestre devolve as ouvidas.

## v2.16.1 — Fechadura na tela e bolsa de fechaduras
- **Fechadura na tela do Owlbear** (camada dos dados, como o Equilibrar): ao ativar, ela aparece para **todos** os jogadores e o mestre, com quem está nela, rodada e situação. Arraste pelo título (roda do mouse muda o tamanho; também no modo Organizar). Cada um pode desligar em **"Mostrar a fechadura na tela do Owlbear"** na aba. Corrige a fechadura que não aparecia para os jogadores.
- **Bolsa de fechaduras (mestre):** monte a fechadura antes da sessão e aperte **Salvar esta na bolsa**. Cada item tem **Preparar** (carrega no formulário sem mostrar) e **Mostrar** (coloca na tela agora) e ✕ para remover. Guarda tipo, nome, dados, passo, PA, DT, tentativas, itens e senha. Fica salva neste navegador.
- Versão dos arquivos: `?v=2.16.1` (força o navegador a baixar tudo de novo).

## v2.16.0 — Nova aba: Fechadura
- **Aba Fechadura no menu** (mesmo molde do Equilibrar: sem janela própria, por isso não laga). A fechadura é desenhada em branco, como na referência: pinos com mola, gazua, trava deslizante e engrenagens. **Cada pino é um dado.**
- **Mestre cria a fechadura:** Porta ou Baú (no baú dá para listar itens), PA e DT do arrombamento, tentativas máximas, de **3 a 10 dados**, passo de **d4 a d20**, e o botão **Girar dados** rola a senha (só o mestre vê). Ao ativar, a aba ganha uma bolinha para os jogadores.
- **Só 1 jogador por vez.** Quem quiser tentar precisa esperar o outro **Sair da fechadura** (ou o mestre **Expulsar**). Quem entra depois herda os pinos já abertos.
- **Destrancar (técnica):** o jogador escolhe os números dos dados e aperta **Tentar abrir**. Pino certo **abre, sobe e o dado fica verde**; a gazua anda de pino em pino. Errados mostram **alto/baixo** (ou só **som**: *trunk* agudo = alto, *trink* = baixo, *click* = certo, quando o mestre liga "Dicas só por som"). Tentativas por rodada pelo dado de **Crime** (d4=1, d6=2, d8=3, d10=4, d12=5). Acabou? Espera o mestre apertar **Nova rodada**.
- **Arrombar (força bruta):** gasta 1 PV, teste de Atletismo (ou outra perícia) contra a DT; se passar soma o dado alto ao total até a **PA**.
- **Mestre:** Nova rodada, **Abrir com chave**, **Quebrar fechadura** (animação de trincas; ninguém mais destranca, só arromba), **Destruir 1 item** (sorteia um item do baú depois de arrombado), **Trancar de novo** (nova senha, zera tudo) e Encerrar.
- Arquivos novos: `fechadura-lib.js`, `fechadura-cena.js`, `fechadura-som.js` (sons sintetizados na hora, sem arquivo de áudio). Versão dos arquivos: `?v=2.16.0`.

## v2.15.1 — Alcançar refeito (sem janela que laga)
- **Mesma ideia do Equilibrar:** o Alcançar (escalada) não abre mais janela própria (`alcancar.html`, que carregava o SDK, fontes e a sala do zero para cada jogador). Agora a **parede com as fotinhas subindo fica na aba Equilíbrio > Alcançar do menu**, e também na **camada da tela do Owlbear** (a mesma dos dados, que já está aberta).
- **Quem vê na tela:** mestre e quem está na parede, automaticamente. Qualquer outro jogador liga **"Mostrar a parede na tela do Owlbear"** na aba (e desliga quando quiser). A aba mostra a parede para todos de qualquer jeito.
- **Menu:** o mestre cria/ativa a escalada e vê as alturas reais, com o botão **Derrubar** ao lado de cada nome. O jogador entra, escolhe **Seguro/Arriscado**, rola Atletismo, Acrobacia ou outra perícia e vê o resultado ali mesmo (com o botão *Aplicar −X PV* quando falha).
- **Resultado dos dados** é aplicado pelo segundo plano (não depende da aba continuar aberta). Se os dados não responderem em 10 s, o menu rola no automático.
- Arrastar o painel na tela: pelo título (roda do mouse muda o tamanho); também no modo Organizar.
- A parede só redesenha o que mudou (era isso que pesava).
- Arquivos novos: `alcancar-cena.js`. Removidos: `alcancar.html` e `ghost.html` (o contorno de arrastar só servia para a janela). `alcancar-lib.js` ganhou `afterClimb`, `climbersOf` e `clWants`.
- Versão dos arquivos passou para `?v=2.15.1` (para o navegador não reaproveitar os arquivos velhos).

## v2.15.0 — Equilibrar refeito (sem janela que travava)
- **Causa do travamento:** a balança abria uma janela própria (`balanca.html`) que carregava o SDK, fontes e a sala do zero para cada pessoa; quando não conectava, ficava "Conectando…" e nem os botões funcionavam.
- **Agora não existe essa janela.** Os controles ficam na **aba Equilíbrio > Equilibrar** do menu (com a cena da balança animada ali mesmo), e a cena também aparece na **camada da tela do Owlbear** (a mesma dos dados, já aberta), com título, jogador, balança, frase de situação, d4 restantes e **diário** das últimas jogadas.
- **Quem vê na tela:** mestre e quem está na balança, automaticamente. Qualquer outro jogador liga **"Mostrar a balança na tela do Owlbear"** na aba (e desliga quando quiser). A aba mostra a cena para todos de qualquer jeito.
- **Resultado dos dados** é aplicado pelo segundo plano (não depende da aba continuar aberta). Se os dados não responderem em 10 s, o menu rola no automático.
- Arrastar o painel na tela: pelo título (roda do mouse muda o tamanho); também no modo Organizar.
- Menu: eventos internos de sincronização não redesenham mais a aba toda.
- Arquivos novos: `balanca-cena.js`. Removido: `balanca.html`. (O Alcançar foi refeito do mesmo jeito na v2.15.1.)

Ficha de personagem com dados 3D que caem na mesa de todos, mais a **Mesa** (foto, PV e PD de quem entrou; só o mestre abre as fichas).
Tudo estático: **sem Netlify, sem banco, sem servidor**. Funciona direto no GitHub Pages.

## v2.14.4 — estabilidade das janelas (Escalada e Balança)
- **Canal local direto** (`canal.js`): os avisos entre a janela, o menu e o segundo plano agora vão por BroadcastChannel + localStorage + Owlbear (o que chegar primeiro vale). Se o Owlbear perder ou atrasar a mensagem, a janela continua obedecendo.
- **Arrastar sem travar**: a janela não é mexida enquanto o mouse anda (era isso que prendia o mouse se o Owlbear recriasse a janela). Aparece um contorno tracejado (`ghost.html`) e a janela vai para lá ao soltar.
- **Aba em segundo plano**: com a aba do Owlbear escondida o navegador atrasa os relógios; a garantia que reabre janelas "sem sinal" agora fica quieta enquanto a aba está escondida e dá tempo de graça ao voltar. Os avisos locais também ignoram outras abas do mesmo navegador.
- Testado com um Owlbear simulado (mestre + 2 jogadores, F5, janela recriada a cada movimento, mensagens locais perdidas, duas abas no mesmo navegador): 24/24 nos cenários.

## v2.14.4 — sem F5 (ressincronização automática)
- **Reconexão não derruba mais ninguém**: o Owlbear apaga os metadados de quem reconecta (internet que oscila, notebook que dorme). Antes o publicador achava que já tinha enviado e o jogador ficava invisível até o F5. Agora o segundo plano confere a sala e republica sozinho (ficha, NPCs do mestre, subida e balança).
- **Voltar para a aba / ganhar foco / internet voltar** relê a sala, a lista de jogadores e o estado do mestre na hora (menu, janela da Escalada e da Balança).
- **Sala relida a cada 6 s**: se um evento do Owlbear se perder, o estado se corrige sozinho.
- **Botão "Sincronizado" no menu** (no lugar do F5): fica vermelho ("Sem sinal · tocar") se a conferência atrasar; tocar força tudo de novo e reabre as janelas.
- **Metadados cheios não travam o jogo**: se o Owlbear recusar por tamanho, a extensão tira a ficha completa/foto (só o mestre usa) e grava o jogo; a foto agora encolhe até caber.
- Balança agora tenta de novo se a gravação falhar (antes falhava calada); a cópia da subida/balança é guardada na hora para poder restaurar.

## v2.14.4 — janela que abre mas não responde (Escalada e Balança)
- **Zonas de arrastar não cobrem mais a janela**: os cartões dos jogadores têm um popover transparente por cima (para poder arrastar). Quando o layout mudava (alguém entrava, foto mudava) essa zona reabria POR CIMA da janela do jogo e roubava os cliques. Agora zona que encostaria numa janela da Escalada/Balança espera, e volta quando a janela sai de cima.
- **Janela que não conecta se reabre sozinha**: se em 9 s a janela não falar com o Owlbear (CDN do SDK fora, handshake perdido), ela mostra "Conectando…" e pede reabertura; o segundo plano também reabre janela sem sinal após 12 s (era 30 s). Nenhuma espera do começo trava mais para sempre.
- O contorno de arrastar (fantasma) é fechado sempre que a janela abre/mexe.
- Testado: janela por cima de zona + layout mudando; CDN do SDK fora por 22 s (janela ficou interativa assim que voltou); mais todos os cenários anteriores.

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
- **d14, d16 e d18 no 3D:** o **d14** é o poliedro antigo da foto (6 quadrados + 8 hexágonos); o **d16** é um barril octogonal com tampa de pirâmide de 4 lados em cada ponta (8 + 8 faces); o **d18** é um cubo chanfrado (6 quadrados + 12 retângulos nas arestas). As medidas foram acertadas na simulação para todas as faces terem a mesma chance, e as faces são opostas e paralelas (o dado para reto). Em todos, a face lida é a "par" da que ficou no chão e as duas somam n+1 (15, 17, 19). Os números ficam com o alto virado para a ponta do dado.
- **Névoa Jujutsu:** com Jujutsu ligado, a névoa da ficha e do menu fica translúcida e azulada (energia amaldiçoada).

## O que mudou
- Mesa e ficha agora são **uma extensão só**, no mesmo domínio. Por isso a ficha é lida direto do navegador e sumiram: `netlify.toml`, proxy `/ficha/*`, `sync.js`, função `ficha-sync`, banco Postgres e Drizzle.
- O que a Mesa mostra é publicado nos metadados do jogador no Owlbear (some quando o jogador sai da sala).

## Arquivos
`manifest.json` · `entrada.html` (tela inicial: mesa e NPCs) · `ficha.html` (ficha) · `background.html` (dados + publicação da mesa + edições do mestre) · `overlay.html` + `engine.js` (dados 3D) · `mesa.webp` + `mesa2x.webp` (mesa de dados) · `gm.html` (ficha do jogador aberta pelo mestre) · `efeitos.js` · `nevoa.png` · `moldura-menu.jpg` · `quick.html` (ícone e caixa de rolagem rápida) · `alcancar-cena.js` + `alcancar-lib.js` (Equilíbrio > Alcançar) · `balanca-cena.js` + `equilibrio-lib.js` (Equilíbrio > Equilibrar) · `mesa-lib.js` · `estado.js` · `obr.js` · `icon.svg`

## v2.10.0: Esconder
- Nova aba **Esconder** no menu (jogador e mestre). Ela controla o painel **Esconda-se** que aparece na tela do Owlbear (título, subtítulo editável como "Caçando", e um quadro por jogador com foto e dados de esconderijo). Arraste o título para mover; a roda do mouse sobre o título (ou − / + na aba) muda o tamanho.
- **Jogador**: ícones *Esconder-se*, *Distrair* e *Chamar atenção* (descarta um dado à escolha). Ao se esconder escolhe como, a perícia (padrão Furtividade; **Personalizar** abre a lista) e rola perícia + atributo: cada resultado vira um dado de esconderijo. Também dá para adicionar um dado (d4 a d20) ou tocar num dado para removê-lo. Os jogadores veem os números uns dos outros.
- **Mestre**: vê os dados como **?**. O número só aparece quando ele rola dados da criatura (escolhe d4 a d20 e a quantidade) ou digita números em *Números > Revelar*. Dados revelados são descartados sozinhos (dá para desligar). Quem fica sem dados aparece como **Descoberto**. A lista de eventos 1 a 10 fica em *Eventos*; os dados de cada evento foram lidos de um texto bagunçado do livro, confira.
- **Atualização:** *Vigor* e *Sobrevivência* entram na lista de perícias para se esconder. **Distrair**: texto da regra, ideias (pedra, ligar para o celular de alguém…), perícia principal Enganação (com "Outra perícia"), DT 7 que sobe +3 a cada uso na cena (o mestre zera com *Nova cena*); se vencer, o jogador escolhe um dado do teste e dá +1 para si ou para um aliado. **Chamar atenção**: sacrifica 2 dados, um vai para um aliado ou para um NPC (narrativo) e o outro é descartado. **Ação chamativa** aparece como texto de regra.
- **Correção:** o botão *+ dado* girava duas vezes (duas camadas abertas respondiam à mesma rolagem). Cada rolagem agora tem um código e só a primeira camada executa.

## v2.11.0: Equilíbrio (balança) e Alcançar
- Nova aba com **ícone de balança** no menu, ao lado de Mesa, NPCs e Esconder. Dentro: **Equilibrar** (em breve, botão desligado) e **Alcançar**.
- **Mestre** (Equilíbrio > Alcançar): nome da parede (opcional), **DT**, **Altura** (quanto o jogador precisa subir, ex.: 10, 25, 30) e o interruptor **Revelar a altura**. Oculta, os jogadores veem `0/??`; revelada, veem `0/20`. **Ativar escalada** abre sozinha a janela da escalada na tela de todos (e mantém a camada dos dados aberta). **Encerrar** fecha tudo. A lista **Na parede** tem o botão **Derrubar** por jogador: ele cai (animação) e sai da parede, podendo entrar de novo.
- **Janela da escalada** (`alcancar.html`, canto da tela do Owlbear): no topo `NOME 4/??` de cada jogador que entrou; abaixo a **parede** com a foto de cada um (uma faixa por jogador) que **sobe conforme o progresso** até o TOPO; embaixo os testes. Botões do cabeçalho: mudar de canto, **− / +** (tamanho; a roda do mouse também), ✕ (fecha; reabre pelo botão *Abrir janela* na aba). Tamanho e canto ficam salvos por navegador (`cl-scale`, `cl-pos`).
- **Jogador**: *Entrar na escalada* (na janela ou na aba). Escolhe o modo e toca num teste (**Atletismo**, **Acrobacia** ou **Outra perícia…**), que rola os dados reais da ficha (perícia + atributo) caindo na mesa de todos.
  - **Seguro**: vale o **dado baixo** do teste (RB); DT normal.
  - **Arriscado**: vale o **dado alto** (RA); DT **+3**.
  - Teste = soma dos 2 dados ≥ DT. **Sucesso**: sobe o valor do dado escolhido. **Falha**: não sobe e leva esse valor de dano (botão *Aplicar −X PV* desconta da ficha).
  - Chegou à altura total: TOPO. Se a altura está oculta, a foto sobe sem nunca chegar ao topo até o jogador realmente chegar.
- Estado: mestre em `ordem.cl/g`, jogadores em `ordem.cl/p` (metadados do Owlbear); a queda é uma mensagem `ordem.cl/drop` que o segundo plano do jogador só aceita se vier do mestre.

## v2.12.0: Equilíbrio > Equilibrar (a balança)
- **Mestre** (Equilíbrio > Equilibrar): nome (opcional, ex.: Tronco) e **Rodadas** (quantos testes de equilíbrio o jogador precisa vencer para atravessar). **Ativar balança** abre a janela só para o mestre; a aba **Equilíbrio** ganha uma bolinha verde para os jogadores avisando que há balança. **Encerrar balança** fecha tudo. A lista **Na balança** mostra quem subiu e o botão **Expulsar**.
- **Jogador**: **Subir na balança** (aba ou janela). **Só um jogador por vez** (vale quem subiu primeiro; se dois clicarem juntos, o segundo é tirado sozinho). Os outros veem *Balança ocupada*. Para outro subir, quem está nela usa **Sair da balança** ou o mestre usa **Expulsar**.
- **Quem vê a janela**: só o mestre e o jogador que está na balança. Ela se arrasta pelo cabeçalho, **− / +** (ou a roda do mouse) muda o tamanho, ✕ fecha (reabre em *Abrir janela* na aba). Posição e tamanho ficam salvos por navegador (`bal-xy`, `bal-scale`).
- **A balança** (animada, com mola): cada d10 fica num prato; o lado mais pesado desce e o outro sobe, balançando até assentar. Equilibrada = balanço manso; caindo = tremida; ao cair a viga tomba e aparece **CAIU**; ao atravessar, **ATRAVESSOU**.
- **Regras**: *Rolar 2d10* (os dados caem na mesa de todos, sem somar). Iguais ou com 1 de diferença: equilibrou (próxima rodada). Senão, está **caindo**: role um **dado de equilíbrio** (d4) e some a um dos d10 à sua escolha (botões *Somar +N no X* ou toque no dado). Dados de equilíbrio = metade da Acrobacia da ficha (d4 → 2, d6 → 3, d8 → 4…), gastos até o fim da travessia. Caindo e sem dados (ou *Deixar cair*): cai. *Tentar de novo* / *Atravessar de novo* recomeça com os dados cheios.
- **Embaixo**: **Perícias** (Acrobacia, Atletismo e *Outra perícia…*) rolam perícia + atributo da ficha na mesa de todos, e o resultado fica na janela (o mestre também vê); ao lado, os **dados de equilíbrio** (d4 apagado = gasto; clicar num d4 aceso rola esse dado quando está caindo).
- Estado: mestre em `ordem.bal/g`, jogador em `ordem.bal/p` (metadados do Owlbear). Expulsão é a mensagem `ordem.bal/kick`, que o segundo plano do jogador só aceita se vier do mestre.

## v2.13.0: mega otimização
**Dados antigos caindo tarde (corrigido)**
- Toda rolagem agora leva o horário de quem rolou. Se ela chega presa (aba em segundo plano, internet caindo) com mais de 15 s de atraso, **não anima mais**; o relógio de cada jogador é medido separado, então um PC com hora errada não atrapalha.
- Rolagens repetidas (a mesma chegando duas vezes) são ignoradas; a camada dos dados que parou de responder é **fechada antes** de abrir outra (antes ficavam duas e os dados caíam em dobro).
- Fila cheia: as rolagens mais antigas só mostram o resultado, sem animar; com rolagem esperando, a física anda mais rápido (o resultado é o mesmo). Voltar para a aba mostra o que ficou para trás só como resultado.

**Online mais rápido**
- O que cada jogador publica foi dividido em 3 partes: **nome/PV/PD** (centenas de bytes, sai em ~150 ms), **foto** (só quando muda) e **ficha completa comprimida** (só depois de parar de mexer). Antes tudo (até 12 kB) ia junto a cada letra digitada.
- A ficha e o segundo plano não publicam mais em dobro; a ficha só avisa e o segundo plano publica o que mudou.
- Os jogadores da sala e os metadados vêm uma vez e depois dos **eventos** do Owlbear (menos consultas a cada 3-4 s). Sondagens de garantia caíram para 15 s.
- Novo ajuste **Dados prontos** (Menu > Tela e dados): mantém a camada dos dados aberta, então a rolagem dos outros aparece na hora.

**Menos travadas**
- O cálculo dos dados roda em fatias de ~6 ms: a ficha não congela mais ao rolar vários dados (o resultado é idêntico).
- A ficha grava com 80 ms de calma (digitar numa caixa de texto não regrava tudo a cada letra), atualiza só as barras que mudaram e carrega o three.js sem travar a abertura.
- Névoa mais leve (sem *blend mode*, pausa com a janela escondida, uma camada só em PCs fracos). `nevoa.png` incluída.

**Abas e janelas**
- Menu: cabeçalho fixo, abas com ícone, ajustes agrupados em "Tela e dados", visual mais legível.
- Janelas da **escalada** e da **balança**: alça de arrastar, botão **minimizar** (ou duplo clique no título), fechar em vermelho; mover não engarrafa mais.
- Painéis da ficha (Habilidades/Equipamento, Settings, Relações, Rolagem personalizada): **arraste pelo título**, duplo clique no título volta ao centro, soltar o mouse fora não fecha.

## v2.13.1: jogador entrando (extensão travando / dado invisível)
- **Causa:** se o SDK do Owlbear falhasse ao carregar **uma vez** (internet instável justo quando o jogador entra), a página ficava morta até o F5 (a aba mostrava "Abra dentro do Owlbear" e o segundo plano parava de vez, então os dados nunca apareciam).
- **Agora:** o SDK tenta 3 endereços, com limite de tempo, em várias rodadas (e o navegador não reaproveita a falha anterior). O segundo plano insiste até conectar; a aba mostra "Conectando ao Owlbear…" e tenta sozinha.
- A camada dos dados tem 12 s (antes 6) para carregar e tenta até 3 vezes, também quando está só "pronta" sem rolagem. Antes, em conexão lenta, ela era fechada enquanto ainda carregava, em ciclo.
- Rolagem que chega com 15 a 60 s de atraso aparece só como resultado (antes sumia); acima de 60 s é descartada. Se a hora do computador de alguém for ajustada, o relógio é recalibrado em 20 s em vez de silenciar as rolagens dele.

## v2.14.0: estabilidade e sincronização (Esconder, Escalada, Balança)
- **Novo `estado.js`**: o estado do mestre (Esconder, Escalada e Balança: ligado/desligado, DT, altura, rodadas…) agora fica nos **metadados da sala**, não nos do jogador-mestre. Antes, F5 ou queda de internet do mestre apagava tudo e os jogadores ficavam sem painel/janela até todos darem F5. Se a sala não aceitar a gravação, cai no jeito antigo automaticamente.
- **Ligar/desligar minijogo não reinicia mais a camada dos dados** (antes fechava e reabria; se a reabertura falhasse, o painel Esconder não aparecia). O painel Esconder agora liga e desliga pelo estado da sala.
- **✕ das janelas de Escalada e Balança** fecha a própria janela direto (antes dependia do segundo plano responder; se não respondesse, não fechava ou reabria sozinha).
- Vigia das janelas menos nervoso: só reabre depois de 30 s sem sinal (antes 15 s; em conexão lenta a janela reiniciava em loop e parecia travada).
- **Cartões dos jogadores na tela (avatar, nome, PV/PD) ~35% menores**, e o tamanho inicial se adapta à tela (monitor menor = um pouco menor). Quem já ajustou com − / + mantém o próprio tamanho.
- Versão dos arquivos: `?v=2.14.0` (força o navegador a baixar tudo de novo). Lembre de enviar também o novo `estado.js`.

## v2.14.4: Alcançar mais firme
- **Não some mais da parede**: o Owlbear apaga os metadados do jogador quando ele recarrega ou reconecta. Agora cada navegador guarda a sua subida (e a posição na balança) e, se ela sumir durante a MESMA escalada/balança, republica sozinha.
- **Salvar a subida** é imediato na tela, em fila (duas gravações seguidas não se atropelam) e tenta de novo até 3 vezes se o Owlbear falhar.
- **Dados 3D que não respondem**: se o resultado não voltar em 9 s, a escalada rola no automático em vez de travar.
- Botão **↻** no cabeçalho da janela da escalada: relê a sala e os jogadores sem precisar de F5.
