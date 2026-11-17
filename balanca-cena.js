/* A cena da balança (SVG animado com mola), usada no menu (aba Equilíbrio) e na camada da tela do Owlbear.
   Não conversa com o Owlbear: só recebe o que desenhar. Por isso nunca "trava conectando".
     const s = mountScale(elemento, {onPick: lado => ...});
     s.update({a, b, st, rolling, pick, pend});   // a/b = os dois d10; st = idle|fall|done|fell
     s.destroy();
   Estilos ficam sob a classe .bsc e são injetados uma vez. */
const NS="http://www.w3.org/2000/svg";
const sv=(t,a)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);return e};
const balOK=(a,b)=>Math.abs(a-b)<=1;

const CSS=`
.bsc{position:relative;width:100%;aspect-ratio:400/326;user-select:none;-webkit-user-select:none}
.bsc svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.bsc .die polygon,.bsc .die polyline{fill:#1b2325;stroke:#d8ddd9;stroke-width:2;stroke-linejoin:round}
.bsc .die polyline{fill:none;stroke-width:1.2;opacity:.45}
.bsc .die text{font:800 17px Cinzel,serif;fill:#f3f5f1;text-anchor:middle;dominant-baseline:central}
.bsc .die.ok polygon{stroke:#5fd38a;fill:#18301f}
.bsc .die.bad polygon{stroke:#e0524f;fill:#35191a}
.bsc .die.pick{cursor:pointer}
.bsc .die.pick polygon{stroke:#ecc962;animation:bsc-pk .9s infinite}
@keyframes bsc-pk{50%{stroke-width:4}}
.bsc .die .in{transform-box:fill-box;transform-origin:center}
.bsc .die.roll .in{animation:bsc-tumble .5s linear infinite}
.bsc .die.pop .in{animation:bsc-pop .5s cubic-bezier(.3,1.6,.5,1)}
@keyframes bsc-tumble{to{transform:rotate(360deg)}}
@keyframes bsc-pop{from{transform:scale(1.7)}}
.bsc .tag{font:800 13px "Barlow Condensed",sans-serif;letter-spacing:.06em;text-anchor:middle;fill:#ecc962}
.bsc .pend text{font:800 15px Cinzel,serif;fill:#15191a;text-anchor:middle;dominant-baseline:central}
.bsc .pend path{fill:#ecc962;stroke:#fff8;stroke-width:1.2;stroke-linejoin:round}
.bsc.fell .beam path{fill:#c5524f}
.bsc .bmsg{position:absolute;left:0;right:0;top:80%;text-align:center;font:800 1.5rem Cinzel,serif;letter-spacing:.1em;pointer-events:none;opacity:0;transition:opacity .4s;text-shadow:0 2px 12px #000}
.bsc .bmsg.on{opacity:1}
.bsc .bmsg.bad{color:#ff8f8c}.bsc .bmsg.good{color:#9be3b4}
`;
let cssDone=false,uid=0;
function css(){
  if(cssDone)return;cssDone=true;
  const s=document.createElement("style");s.id="bsc-css";s.textContent=CSS;document.head.appendChild(s);
}

const L=142,CX=200,CY=70,H=92;          // meia viga, pivô, comprimento das correntes

export function mountScale(host,opts){
  css();
  const id="b"+(++uid),o=opts||{};
  host.classList.add("bsc");host.replaceChildren();
  const svg=sv("svg",{viewBox:"0 -36 400 326",preserveAspectRatio:"xMidYMid meet","aria-label":"Balança"});
  svg.innerHTML=`<defs>
    <linearGradient id="${id}m" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3f5f1"/><stop offset="1" stop-color="#6f7a78"/></linearGradient>
    <linearGradient id="${id}p" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9ece7"/><stop offset="1" stop-color="#8b9694"/></linearGradient>
    <radialGradient id="${id}g" cx=".5" cy=".4"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#a9b3b1"/></radialGradient></defs>
    <ellipse cx="200" cy="277" rx="100" ry="8" fill="#0007"/>
    <path d="M116 276 Q130 256 200 252 Q270 256 284 276 Z" fill="url(#${id}m)" stroke="#3a4344"/>
    <path d="M192 256 L196 80 L204 80 L208 256 Z" fill="url(#${id}m)" stroke="#3a4344" stroke-width=".8"/>
    <g class="beam"><path d="M-142 0 Q0 -10 142 0 Q0 6 -142 0Z" fill="url(#${id}m)" stroke="#3a4344" stroke-width=".8"/><circle cx="-142" cy="0" r="4.5" fill="url(#${id}g)"/><circle cx="142" cy="0" r="4.5" fill="url(#${id}g)"/></g>
    <g class="pl"></g><g class="pr"></g>
    <circle cx="200" cy="70" r="8.5" fill="url(#${id}g)" stroke="#3a4344"/>
    <g class="pend" style="display:none" transform="translate(200 24)"><path d="M0 -16 L17 12 L-17 12Z"/><text y="4"></text></g>`;
  const msg=document.createElement("div");msg.className="bmsg";
  host.append(svg,msg);
  const q=s=>svg.querySelector(s);
  const beam=q(".beam"),gL=q(".pl"),gR=q(".pr"),pend=q(".pend");

  function mkPan(g){
    g.append(sv("line",{x1:0,y1:0,x2:-52,y2:H,stroke:"#8b9694","stroke-width":1.2}),sv("line",{x1:0,y1:0,x2:52,y2:H,stroke:"#8b9694","stroke-width":1.2}));
    const d=sv("g",{class:"die",transform:"translate(0 "+(H-34)+")"}),i=sv("g",{class:"in"});
    i.append(sv("polygon",{points:"0,-27 24,-4 0,27 -24,-4"}),sv("polyline",{points:"-24,-4 0,5 24,-4"}),sv("polyline",{points:"0,5 0,27"}));
    const tx=sv("text",{x:0,y:-6});d.append(i,tx);
    g.append(d,sv("path",{d:"M-58 "+H+" Q0 "+(H+42)+" 58 "+H+" Z",fill:"url(#"+id+"p)",stroke:"#3a4344","stroke-width":1}),sv("circle",{cx:0,cy:0,r:3.5,fill:"#e9ece7"}));
    const tag=sv("text",{x:0,y:H+24,class:"tag"});g.append(tag);
    return{d,tx,tag};
  }
  const pans={a:mkPan(gL),b:mkPan(gR)};
  let view={a:0,b:0,st:"idle",rolling:false,pick:false,pend:0};
  let ang=0,vel=0,last=performance.now(),raf=0,dead=false;const shown={a:-1,b:-1};

  function target(t){
    if(view.rolling)return Math.sin(t/130)*15+Math.sin(t/47)*4;
    if(!view.a&&!view.b)return Math.sin(t/1100)*.8;
    const d=view.a-view.b,m=Math.abs(d),s=d>0?-1:1;
    if(view.st==="fell")return s*(m?34:30);
    const deg=m<=1?m*1.8:Math.min(30,7+(m-1)*3.2);
    const sway=view.st==="fall"?Math.sin(t/170)*1.6:Math.sin(t/1000)*.9;      // caindo: tremida; equilibrada: balanço manso
    return s*deg+sway;
  }
  function frame(now){
    if(dead)return;
    if(!host.isConnected){raf=requestAnimationFrame(frame);return}
    const dt=Math.min(.05,(now-last)/1000);last=now;
    const tg=target(now),K=75,C=6.2;
    vel+=(-K*(ang-tg)-C*vel)*dt;ang+=vel*dt;
    const r=ang*Math.PI/180,sw=Math.max(-9,Math.min(9,-vel*.05));
    beam.setAttribute("transform","translate("+CX+" "+CY+") rotate("+ang.toFixed(2)+")");
    gL.setAttribute("transform","translate("+(CX-L*Math.cos(r)).toFixed(1)+" "+(CY-L*Math.sin(r)).toFixed(1)+") rotate("+sw.toFixed(2)+")");
    gR.setAttribute("transform","translate("+(CX+L*Math.cos(r)).toFixed(1)+" "+(CY+L*Math.sin(r)).toFixed(1)+") rotate("+sw.toFixed(2)+")");
    raf=requestAnimationFrame(frame);
  }
  raf=requestAnimationFrame(frame);

  function paint(){
    const bal=view.a&&view.b&&balOK(view.a,view.b);
    for(const k of ["a","b"]){
      const p=pans[k],v=view[k],c=p.d.classList;
      c.toggle("roll",!!view.rolling);
      p.tx.textContent=view.rolling?"?":(v?String(v):"");
      c.toggle("ok",!view.rolling&&!!v&&!!bal);
      c.toggle("bad",!view.rolling&&!!v&&!bal&&view.st!=="idle");
      c.toggle("pick",!!view.pick);
      p.d.onclick=view.pick&&o.onPick?()=>o.onPick(k):null;
      if(!view.rolling&&v&&shown[k]!==v){c.remove("pop");void p.d.getBoundingClientRect();c.add("pop");setTimeout(()=>c.remove("pop"),520)}
      shown[k]=view.rolling?-1:v;
      p.tag.textContent=view.pick&&view.pend?"toque: +"+view.pend:"";
    }
    pend.style.display=view.pend?"":"none";pend.querySelector("text").textContent=view.pend?"+"+view.pend:"";
    host.classList.toggle("fell",view.st==="fell");
    const fin=view.st==="done"||view.st==="fell";
    msg.className="bmsg"+(fin?" on "+(view.st==="done"?"good":"bad"):"");msg.textContent=fin?(view.st==="done"?"ATRAVESSOU":"CAIU"):"";
  }
  paint();
  return{
    update(v){view={a:+v.a||0,b:+v.b||0,st:v.st||"idle",rolling:!!v.rolling,pick:!!v.pick,pend:+v.pend||0};paint()},
    destroy(){dead=true;cancelAnimationFrame(raf);host.replaceChildren();host.classList.remove("bsc")}
  };
}

/* os d4 de equilíbrio (acesos = sobram; apagados = gastos), em SVG pequeno */
export function d4Icon(spent){
  const s=document.createElementNS(NS,"svg");s.setAttribute("viewBox","0 0 30 28");
  s.innerHTML='<path d="M15 2 28 25H2Z" fill="#1a2123" stroke="'+(spent?"#8f9a99":"#e9ece7")+'" stroke-width="1.6" stroke-linejoin="round"/><text x="15" y="21" text-anchor="middle" font-family="Cinzel,serif" font-weight="800" font-size="11" fill="'+(spent?"#8f9a99":"#e9ece7")+'">4</text>';
  s.style.cssText="width:30px;height:28px;opacity:"+(spent?".4":"1");
  return s;
}
