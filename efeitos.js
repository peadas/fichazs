/* Efeitos visuais compartilhados (menu da Mesa e ficha):
   1) pulinho ao passar o mouse: dados, botões, cartões e, letra por letra, os textos;
   2) névoa suave andando pelo fundo (duas camadas, textura nevoa.png sem emenda).
   Só CSS + um ouvinte de mouse; não mexe no resto da página. */
(function(){
  if(window.__efeitos)return;window.__efeitos=1;
  var base=(document.currentScript&&document.currentScript.src||location.href).replace(/[^\/]*$/,"");
  var css=`
@keyframes ef-pulo{0%{translate:0 0;scale:1 1}28%{translate:0 -7px;scale:.95 1.09}52%{translate:0 0;scale:1.09 .9}72%{translate:0 -2px;scale:.99 1.03}100%{translate:0 0;scale:1 1}}
@keyframes ef-pulo-leve{0%{translate:0 0}35%{translate:0 -3px}65%{translate:0 0}82%{translate:0 -1px}100%{translate:0 0}}
@keyframes ef-letra{0%{translate:0 0}30%{translate:0 -.32em}60%{translate:0 .05em}100%{translate:0 0}}
@keyframes ef-dado{0%{translate:0 0;rotate:0deg;scale:1}25%{translate:0 -9px;rotate:-14deg;scale:1.08}55%{translate:0 0;rotate:9deg;scale:.93 1.05}78%{translate:0 -2px;rotate:-3deg;scale:1}100%{translate:0 0;rotate:0deg;scale:1}}
@keyframes ef-nevoa-a{to{transform:translate3d(512px,256px,0)}}
@keyframes ef-nevoa-b{to{transform:translate3d(-640px,640px,0)}}

/* pulinho */
.die:not(.ro):hover,#menu .die:hover,.dado-pulo:hover{animation:ef-dado .55s cubic-bezier(.3,.7,.4,1) 1}
button:not(.die):not(.bx):not(.vs):not(.nm):hover,.card:hover,.chip:hover,.tag:hover,.logo:hover,.ring:hover,.av:hover,.dt:hover,.niv:hover,.ft:hover{animation:ef-pulo .5s cubic-bezier(.3,.7,.4,1) 1}
.bx:hover,.vs:hover{animation:ef-pulo-leve .35s ease-out 1}
[data-ef-split]{white-space:nowrap}
.ef-l{display:inline-block;white-space:pre}
.ef-on .ef-l{animation:ef-letra .5s cubic-bezier(.3,.7,.4,1) calc(var(--i)*26ms) 1}
@media (prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;animation-iteration-count:1!important}.ef-nev i,.ef-nev{animation:none!important}}

/* névoa */
.ef-nev{position:fixed;inset:0;overflow:hidden;pointer-events:none;contain:strict}
.ef-nev i{position:absolute;left:-1280px;top:-1280px;right:0;bottom:0;background:url("${base}nevoa.png") 0 0/var(--sz,512px) var(--sz,512px) repeat;will-change:transform}
.ef-nev.back{z-index:1}.ef-nev.front{z-index:6}
.ef-nev.back i:nth-child(1){opacity:.20;animation:ef-nevoa-a 95s linear infinite}
.ef-nev.back i:nth-child(2){opacity:.13;--sz:640px;animation:ef-nevoa-b 150s linear infinite}
.ef-nev.front i{opacity:.05;--sz:768px;animation:ef-nevoa-a 120s linear infinite}
html.ef-off .ef-nev i,html.ef-off .ef-nev{animation-play-state:paused!important}
/* modo Jujutsu: a névoa vira energia amaldiçoada, azulada e translúcida (a textura vira máscara de uma cor que respira) */
@keyframes ef-ce{0%,100%{filter:brightness(.9) saturate(1)}50%{filter:brightness(1.25) saturate(1.3)}}
html.ef-jj .ef-nev i{background:linear-gradient(115deg,#1d4ed8 0%,#3b82f6 38%,#7c5cff 72%,#22d3ee 100%);background-size:100% 100%;
  -webkit-mask:url("${base}nevoa.png") 0 0/var(--sz,512px) var(--sz,512px) repeat;mask:url("${base}nevoa.png") 0 0/var(--sz,512px) var(--sz,512px) repeat}
html.ef-jj .ef-nev.back i:nth-child(1){opacity:.34}
html.ef-jj .ef-nev.back i:nth-child(2){opacity:.24}
html.ef-jj .ef-nev.front i{opacity:.14}
html.ef-jj .ef-nev.back{animation:ef-ce 7s ease-in-out infinite}
html.ef-jj .ef-nev.front{animation:ef-ce 9s ease-in-out infinite reverse}
/* dica de desempenho: pausa a animação quando a janela está escondida ou o computador é fraco */
html.ef-lite .ef-nev.front{display:none}
html.ef-lite .ef-nev.back i:nth-child(2){display:none}
body>main{position:relative;z-index:2}
`;
  var st=document.createElement("style");st.textContent=css;document.head.appendChild(st);
  function fog(cls,n){var d=document.createElement("div");d.className="ef-nev "+cls;d.setAttribute("aria-hidden","true");
    for(var i=0;i<n;i++)d.appendChild(document.createElement("i"));document.body.appendChild(d)}
  function go(){fog("back",2);fog("front",1)}
  if(document.body)go();else addEventListener("DOMContentLoaded",go);

  /* modo Jujutsu (Settings da ficha): vale para a ficha e para o menu da Mesa. A ficha marca a classe "jujutsu";
     o menu (e qualquer outra janela) lê o mesmo dado salvo da ficha e acompanha quando ele muda. */
  var root=document.documentElement;
  var lastRaw=null,lastJJ=false;
  function jjOn(){
    if(root.classList.contains("jujutsu"))return true;
    try{
      var raw=localStorage.getItem(window.__SHEETKEY||"ficha-ordem")||"";
      if(raw===lastRaw)return lastJJ;                     // nada mudou: não refaz o JSON.parse da ficha inteira
      lastRaw=raw;lastJJ=/"jujutsu"\s*:\s*true/.test(raw);return lastJJ;
    }catch(e){return false}
  }
  function jjSync(){root.classList.toggle("ef-jj",jjOn())}
  jjSync();
  addEventListener("storage",jjSync);
  setInterval(function(){if(!document.hidden)jjSync()},6000);
  try{new MutationObserver(jjSync).observe(root,{attributes:true,attributeFilter:["class"]})}catch(e){}
  /* janela escondida: pausa a névoa (não gasta GPU à toa); computador fraco: usa só uma camada */
  document.addEventListener("visibilitychange",function(){root.classList.toggle("ef-off",document.hidden)});
  try{if((navigator.hardwareConcurrency||8)<=4||(navigator.deviceMemory||8)<=4)root.classList.add("ef-lite")}catch(e){}

  /* letras pulando: divide o texto em letras na primeira vez que o mouse passa */
  var SEL="h1,h2,h3,.nm,.tag,.chip,.sec,.rl,.vl,label,button:not(.die):not(.bx):not(.vs):not(.dt):not(.ft):not(.at)";
  addEventListener("pointerover",function(ev){
    var t=ev.target&&ev.target.closest&&ev.target.closest(SEL);
    if(!t||t.isContentEditable)return;
    if(!t.dataset.efOk){
      t.dataset.efOk="1";
      if(t.childElementCount===0&&t.textContent&&t.textContent.length<=40){
        var tx=t.textContent;t.textContent="";
        for(var i=0;i<tx.length;i++){var s=document.createElement("span");s.className="ef-l";s.style.setProperty("--i",i);s.textContent=tx[i];t.appendChild(s)}
        t.dataset.efSplit="1";t.setAttribute("data-ef-split","1");
      }
    }
    if(t.dataset.efSplit==="1"&&!t.classList.contains("ef-on")){
      t.classList.add("ef-on");
      setTimeout(function(){t.classList.remove("ef-on")},500+t.textContent.length*26);
    }
  },true);
})();
