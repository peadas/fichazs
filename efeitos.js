/* Efeitos visuais compartilhados (menu da Mesa e ficha):
   1) pulinho ao passar o mouse: dados, botões, cartões e, letra por letra, os textos;
   2) névoa suave andando pelo fundo (duas camadas, textura nevoa.png sem emenda).
   Só CSS + um ouvinte de mouse; não mexe no resto da página. */
(function(){
  if(window.__efeitos)return;window.__efeitos=1;
  var base=(document.currentScript&&document.currentScript.src||location.href).replace(/[^\/]*$/,"");
  var css=`
@keyframes ef-pulo{0%{translate:0 0;scale:1 1}35%{translate:0 -2px;scale:.99 1.02}70%{translate:0 0;scale:1.015 .99}100%{translate:0 0;scale:1 1}}
@keyframes ef-pulo-leve{0%{translate:0 0}40%{translate:0 -1px}100%{translate:0 0}}
@keyframes ef-letra{0%{translate:0 0}35%{translate:0 -.1em}70%{translate:0 .01em}100%{translate:0 0}}
@keyframes ef-dado{0%{translate:0 0;rotate:0deg;scale:1}30%{translate:0 -3px;rotate:-4deg;scale:1.04}65%{translate:0 0;rotate:2deg;scale:.98 1.01}100%{translate:0 0;rotate:0deg;scale:1}}
@keyframes ef-nevoa-a{to{transform:translate3d(512px,256px,0)}}
@keyframes ef-nevoa-b{to{transform:translate3d(-640px,640px,0)}}

/* pulinho */
.die:not(.ro):hover,#menu .die:hover,.dado-pulo:hover{animation:ef-dado .55s cubic-bezier(.3,.7,.4,1) 1}
button:not(.die):not(.bx):not(.vs):not(.nm):hover,.card:hover,.chip:hover,.tag:hover,.logo:hover,.ring:hover,.av:hover,.dt:hover,.niv:hover,.ft:hover{animation:ef-pulo .4s cubic-bezier(.3,.7,.4,1) 1}
.bx:hover,.vs:hover{animation:ef-pulo-leve .35s ease-out 1}
[data-ef-split]{white-space:nowrap}
.ef-l{display:inline-block;white-space:pre}
.ef-on .ef-l{animation:ef-letra .4s cubic-bezier(.3,.7,.4,1) calc(var(--i)*26ms) 1}
@media (prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;animation-iteration-count:1!important}.ef-nev i{animation:none!important}}

/* névoa */
.ef-nev{position:fixed;inset:0;overflow:hidden;pointer-events:none}
.ef-nev i{position:absolute;left:-1280px;top:-1280px;right:0;bottom:0;background:url("${base}nevoa.png") 0 0/512px 512px repeat;will-change:transform}
.ef-nev.back{z-index:1}.ef-nev.front{z-index:6;mix-blend-mode:screen}
.ef-nev.back i:nth-child(1){opacity:.20;animation:ef-nevoa-a 95s linear infinite}
.ef-nev.back i:nth-child(2){opacity:.13;background-size:640px 640px;animation:ef-nevoa-b 150s linear infinite}
.ef-nev.front i{opacity:.07;background-size:768px 768px;animation:ef-nevoa-a 120s linear infinite}
body>main{position:relative;z-index:2}
`;
  var st=document.createElement("style");st.textContent=css;document.head.appendChild(st);
  function fog(cls,n){var d=document.createElement("div");d.className="ef-nev "+cls;d.setAttribute("aria-hidden","true");
    for(var i=0;i<n;i++)d.appendChild(document.createElement("i"));document.body.appendChild(d)}
  function go(){fog("back",2);fog("front",1)}
  if(document.body)go();else addEventListener("DOMContentLoaded",go);

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
