/* Fechadura: o desenho (SVG) com animação, usado na aba Fechadura do menu. Não conversa com o Owlbear: só recebe o que desenhar,
   por isso nunca "trava conectando". Tudo é CSS/transform (nada de redesenhar), então fica leve.
     const s = mountLock(elemento, {sfx});
     s.update({n, vals, ok, tint, at, fb, pick, open, how, broken, cracks, sound});
     s.destroy();
   Os pinos são os dados: cada pino mostra o número que o jogador escolheu. Pino certo sobe (mola comprime), o gancho da gazua anda até o
   próximo pino; ao abrir, a trava desliza e as engrenagens giram; ao quebrar, trinca, gazua parte e os pinos saltam. */
const NS="http://www.w3.org/2000/svg";
export const PITCH=n=>n<=5?38:n<=7?34:30;
const H=374,LIFT=30,TRAVEL=84,PICKY=189,SPRING0=66,STEM0=106,GEARY=244,GR=22;
export function geom(n){
  const P=PITCH(n),Hw=Math.max(196,n*P+52),x0=206,x1=x0+Hw,cx=x0+Hw/2,W=x1+130+TRAVEL+16;
  return{P,Hw,x0,x1,cx,W,H,px:i=>x0+(Hw-n*P)/2+P*(i+.5)};
}
const f1=v=>Math.round(v*10)/10;
function gearPath(cx,cy,r,teeth){
  const pts=[];
  for(let i=0;i<teeth;i++){
    const a=i*2*Math.PI/teeth,w=Math.PI/teeth,R=r,rr=r-5;
    [[a-w*.5,rr],[a-w*.28,R],[a+w*.28,R],[a+w*.5,rr]].forEach(([t,k])=>pts.push(f1(cx+Math.cos(t)*k)+","+f1(cy+Math.sin(t)*k)));
  }
  return"M"+pts.join("L")+"Z";
}
function housing(x0,x1,cx,k){
  const a=x0+k,b=x1-k,t=k*.6;
  return`M${a},${96+t} Q${a},${62+t} ${a+24},${50+t} L${cx-26},${22+t} Q${cx-10},${12+t} ${cx},${6+t} Q${cx+10},${12+t} ${cx+26},${22+t} L${b-24},${50+t} Q${b},${62+t} ${b},${96+t} L${b},208 L${b-12},262 Q${b-26},${304-k} ${cx},${326-k} Q${a+26},${304-k} ${a+12},262 L${a},208Z`;
}
export function buildSVG(n,id){
  const g=geom(n),{P,x0,x1,cx,W,px}=g,u=s=>s+id;
  let s=`<defs>
    <linearGradient id="${u("m")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbfcfa"/><stop offset="1" stop-color="#bcc4c1"/></linearGradient>
    <linearGradient id="${u("mh")}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#d3d9d6"/><stop offset=".5" stop-color="#fbfcfa"/><stop offset="1" stop-color="#c3cac7"/></linearGradient>
    <linearGradient id="${u("d")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7b8583"/><stop offset="1" stop-color="#4d5755"/></linearGradient>
    <linearGradient id="${u("c")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b9c1be"/><stop offset="1" stop-color="#97a19e"/></linearGradient>
    <radialGradient id="${u("g")}" cx=".4" cy=".35"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#aeb8b5"/></radialGradient></defs>
  <g class="all">
  <ellipse cx="${cx}" cy="330" rx="${g.Hw/2}" ry="7" fill="#0006"/>
  <path class="hs" d="${housing(x0,x1,cx,0)}" fill="url(#${u("m")})" stroke="#3a4344" stroke-width="2" stroke-linejoin="round"/>
  <path d="${housing(x0,x1,cx,8)}" fill="none" stroke="#8f9a97" stroke-width="1.2"/>
  <path d="M${cx-34},44 Q${cx},22 ${cx+34},44 M${cx-22},36 Q${cx},20 ${cx+22},36 M${cx},26 l5,8 l-5,8 l-5,-8z" fill="none" stroke="#9aa4a1" stroke-width="1.3" stroke-linejoin="round"/>
  <rect x="${x0+16}" y="54" width="${x1-x0-32}" height="116" rx="10" fill="url(#${u("c")})" stroke="#4a5456" stroke-width="1.6"/>`;
  for(let i=0;i<n;i++)s+=`<rect x="${f1(px(i)-14)}" y="60" width="28" height="104" rx="8" fill="#6d7775" opacity=".55" stroke="#4a5456" stroke-width="1"/>`;
  /* trava (bolt): barra, mandíbulas, cremalheira e placa da ponta; desliza para a direita ao abrir */
  const jaw=`M${x0-104},172 L${x0-104},160 L${x0-94},149 L${x0-72},146 L${x0-60},151 L${x0-52},161 L${x0-40},164 L${x0+6},164 L${x0+6},172Z`;
  let teeth="";for(let x=x0+14;x<x1-14;x+=8)teeth+=`l4,8 l4,-8 `;
  s+=`<g class="bolt">
    <rect x="${x0-8}" y="170" width="${x1-x0+122}" height="38" fill="url(#${u("mh")})" stroke="#3a4344" stroke-width="1.6"/>
    <rect x="${x0+8}" y="178" width="${x1-x0-16}" height="22" rx="3" fill="url(#${u("d")})" stroke="#2f3739"/>
    <path d="M${x1+10},180 h90 M${x1+10},198 h90" stroke="#98a39f" stroke-width="1.2"/>
    <path d="M${x1+44},189 q10,-12 20,0 q-10,12 -20,0z M${x1+64},189 q10,-12 20,0 q-10,12 -20,0z" fill="none" stroke="#7d8886" stroke-width="1.4"/>
    <path d="${jaw}" fill="url(#${u("m")})" stroke="#3a4344" stroke-width="1.6" stroke-linejoin="round"/>
    <path d="${jaw}" transform="translate(0 378) scale(1 -1)" fill="url(#${u("m")})" stroke="#3a4344" stroke-width="1.6" stroke-linejoin="round"/>
    <circle cx="${x0-78}" cy="156" r="2.4" fill="#4a5456"/><circle cx="${x0-78}" cy="222" r="2.4" fill="#4a5456"/>
    <path d="M${x0-100},166 h50 M${x0-100},212 h50" stroke="#98a39f" stroke-width="1"/>
    <path d="M${x0+12},208 ${teeth}" fill="url(#${u("d")})" stroke="#3a4344" stroke-width="1" stroke-linejoin="round"/>
    <rect x="${x1+112}" y="148" width="26" height="82" rx="4" fill="url(#${u("m")})" stroke="#3a4344" stroke-width="1.8"/>
    <rect x="${x1+118}" y="156" width="14" height="66" rx="3" fill="none" stroke="#8f9a97"/>
    <circle cx="${x1+125}" cy="162" r="3" fill="#6d7775"/><circle cx="${x1+125}" cy="216" r="3" fill="#6d7775"/>
  </g>`;
  /* pinos = dados: mola em cima, haste, cabeça com o número e a ponta que encosta na gazua */
  for(let i=0;i<n;i++){
    let sp=`M0,${SPRING0}`;for(let k=0;k<7;k++)sp+=` L${k%2?-8:8},${SPRING0+3+k*5.4}`;sp+=` L0,${STEM0}`;
    s+=`<g transform="translate(${f1(px(i))} 0)"><g class="pin" data-i="${i}">
      <g class="sp" style="transform-origin:0 ${SPRING0}px"><path d="${sp}" fill="none" stroke="#3f4a48" stroke-width="2" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></g>
      <g class="pl">
        <rect x="-5" y="${STEM0}" width="10" height="30" fill="url(#${u("mh")})" stroke="#3a4344"/>
        <rect x="-4" y="160" width="8" height="24" rx="2" fill="url(#${u("d")})" stroke="#2f3739" stroke-width=".8"/>
        <rect class="cap" x="-13" y="134" width="26" height="26" rx="6" fill="#f3f5f1" stroke="#3a4344" stroke-width="1.6"/>
        <text x="0" y="148" class="num" text-anchor="middle" dominant-baseline="central">?</text>
      </g></g></g>`;
  }
  /* engrenagens, gazua, rachaduras */
  const gl=cx-30,gr=cx+30;
  s+=`<path d="M${x0+14},218 L${x1-14},218" stroke="none"/>
  <g class="gear" style="transform-origin:${gl}px ${GEARY}px"><path d="${gearPath(gl,GEARY,GR,12)}" fill="url(#${u("m")})" stroke="#3a4344" stroke-width="1.5" stroke-linejoin="round"/><circle cx="${gl}" cy="${GEARY}" r="13" fill="none" stroke="#8f9a97"/><circle cx="${gl}" cy="${GEARY}" r="5" fill="url(#${u("g")})" stroke="#3a4344"/><path d="M${gl},${GEARY-13} V${GEARY+13} M${gl-13},${GEARY} H${gl+13}" stroke="#8f9a97" stroke-width="1.2"/></g>
  <g class="gear" style="transform-origin:${gr}px ${GEARY}px"><path d="${gearPath(gr,GEARY,GR,12)}" fill="url(#${u("m")})" stroke="#3a4344" stroke-width="1.5" stroke-linejoin="round"/><circle cx="${gr}" cy="${GEARY}" r="13" fill="none" stroke="#8f9a97"/><circle cx="${gr}" cy="${GEARY}" r="5" fill="url(#${u("g")})" stroke="#3a4344"/><path d="M${gr},${GEARY-13} V${GEARY+13} M${gr-13},${GEARY} H${gr+13}" stroke="#8f9a97" stroke-width="1.2"/></g>
  <path d="M${cx-8},292 l8,-12 l8,12 l-8,12z" fill="none" stroke="#8f9a97" stroke-width="1.4" stroke-linejoin="round"/>
  <g class="cracks" fill="none" stroke="#2f3739" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">
    <path d="M${cx-18},40 L${cx-6},78 L${cx-26},112 L${cx-10},150 L${cx-32},190 L${cx-14},228 L${cx-24},270 L${cx-8},310"/>
    <path d="M${cx+26},56 L${cx+12},92 L${cx+34},128 L${cx+16},166 L${cx+40},204"/>
    <path d="M${x0+4},120 L${cx-40},140 L${cx-26},112 M${x1-4},150 L${cx+40},170 L${cx+34},128"/>
    <path d="M${cx-6},78 L${cx+12},92 M${cx-10},150 L${cx+16},166" stroke-width="1.6"/>
  </g></g>
  <g class="pick"><g class="pk">
    <g class="frag"><path d="M-16,0 L0,0 Q9,0 9,-10 L9,-22" fill="none" stroke="#4a5456" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M-16,0 L0,0 Q9,0 9,-10 L9,-22" fill="none" stroke="#eef1ee" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></g>
    <path d="M-100,0 L-16,0" stroke="#4a5456" stroke-width="4.4"/><path d="M-100,0 L-16,0" stroke="#eef1ee" stroke-width="2.2"/>
    <rect x="-176" y="-8" width="68" height="16" rx="5" fill="url(#${u("mh")})" stroke="#3a4344" stroke-width="1.6"/>
    <path d="M-168,-8 q4,8 8,0 t8,0 t8,0 t8,0 t8,0 t8,0" fill="none" stroke="#8f9a97" stroke-width="1.2" transform="translate(0 4)"/>
    <rect x="-108" y="-6" width="8" height="12" fill="#a3adaa" stroke="#3a4344" stroke-width="1.2"/>
    <circle cx="-187" cy="0" r="8.5" fill="none" stroke="#4a5456" stroke-width="4"/><circle cx="-187" cy="0" r="8.5" fill="none" stroke="#e9ede9" stroke-width="2"/>
  </g></g>`;
  return{svg:s,W,g};
}

const CSS=`
.fk{position:relative;width:100%;user-select:none;-webkit-user-select:none}
.fk svg{display:block;width:100%;height:auto;overflow:visible}
.fk .pl,.fk .sp{transition:transform .5s cubic-bezier(.3,.8,.3,1)}
.fk .pin{transition:transform .9s cubic-bezier(.2,.8,.3,1)}
.fk .bolt{transition:transform .95s cubic-bezier(.5,0,.2,1)}
.fk .gear{transition:transform .95s cubic-bezier(.5,0,.2,1)}
.fk .pick{transition:transform .36s ease-in-out}
.fk .pk{transition:transform .5s ease}
.fk .frag{transition:transform 1.1s cubic-bezier(.4,0,.8,.6),opacity 1.1s}
.fk .cracks{opacity:0;transition:opacity .5s}
.fk.cracks .cracks{opacity:1}
.fk.noanim *{transition:none!important}
.fk .num{font:800 14px Cinzel,serif;fill:#20282a;pointer-events:none}
.fk .pin.ok .cap{fill:#c3f3d2;stroke:#2f9b5f}
.fk .pin.ok .num{fill:#12582f}
.fk .pin.hi .cap{fill:#ffd9b0;stroke:#b8641a}
.fk .pin.lo .cap{fill:#bfd9ff;stroke:#2e6fc2}
.fk .pin.bump .pl{animation:fkbump .34s ease-out}
@keyframes fkbump{30%{transform:translateY(-7px)}60%{transform:translateY(2px)}}
.fk.shake .all{animation:fkshake .6s linear}
@keyframes fkshake{10%{transform:translate(-4px,1px)}25%{transform:translate(4px,-2px)}40%{transform:translate(-3px,2px)}55%{transform:translate(3px,0)}70%{transform:translate(-2px,-1px)}85%{transform:translate(1px,1px)}}
.fk.open .hs{stroke:#3f9a62}
.fk.broken .hs{stroke:#9a3b39}
.fk .fmsg{position:absolute;left:0;right:0;bottom:1%;text-align:center;font:800 1.35rem Cinzel,serif;letter-spacing:.12em;pointer-events:none;opacity:0;transition:opacity .5s;text-shadow:0 2px 12px #000}
.fk .fmsg.on{opacity:1}.fk .fmsg.good{color:#9be3b4}.fk .fmsg.bad{color:#ff8f8c}
`;
let cssDone=false,uid=0;
function css(){if(cssDone)return;cssDone=true;const s=document.createElement("style");s.id="fk-css";s.textContent=CSS;document.head.appendChild(s)}

export function mountLock(host,opts){
  css();
  const o=opts||{},sfx=o.sfx||{},id="k"+(++uid);
  host.classList.add("fk","noanim");host.replaceChildren();
  let N=0,G=null,svg=null,pins=[],nums=[],gears=[],pickEl=null,pkEl=null,fragEl=null,boltEl=null,seq=null,timers=[],dead=false;
  const msg=document.createElement("div");msg.className="fmsg";host.append(msg);
  let lastView=null,lastAt=-1,first=true;const shown={ok:[],pickK:-9,open:null,broken:null,tint:[],vals:[]};
  const later=(ms,fn)=>{const t=setTimeout(()=>{if(!dead)fn()},ms);timers.push(t);return t};
  const css1=(el,v)=>{if(el.__t!==v){el.__t=v;el.style.transform=v}};

  function build(n){
    N=n;const b=buildSVG(n,id);G=b.g;
    if(svg)svg.remove();
    svg=document.createElementNS(NS,"svg");svg.setAttribute("viewBox","0 0 "+b.W+" "+H);svg.setAttribute("aria-label","Fechadura");svg.innerHTML=b.svg;
    host.insertBefore(svg,msg);
    pins=[...svg.querySelectorAll(".pin")];nums=[...svg.querySelectorAll(".num")];gears=[...svg.querySelectorAll(".gear")];
    pickEl=svg.querySelector(".pick");pkEl=svg.querySelector(".pk");fragEl=svg.querySelector(".frag");boltEl=svg.querySelector(".bolt");
    shown.ok=Array(n).fill(0);shown.tint=Array(n).fill(0);shown.vals=Array(n).fill(-1);shown.pickK=-9;shown.open=null;shown.broken=null;
    host.__bd=pins.map(()=>[(Math.random()*2-1)*10,(Math.random()*2-1)*12,(Math.random()*2-1)*16]);
  }
  const tipX=k=>k==="out"?G.x0+10:k==="open"?G.x0-34:G.px(k);
  function paintPin(i){
    const p=pins[i],on=!!shown.ok[i];
    p.classList.toggle("ok",on);
    css1(p.querySelector(".pl"),on?"translateY("+-LIFT+"px)":"translateY(0px)");
    css1(p.querySelector(".sp"),"scaleY("+(on?(STEM0-LIFT-SPRING0)/(STEM0-SPRING0):1)+")");
  }
  function paintTint(i){const t=shown.tint[i];pins[i].classList.toggle("hi",t>0);pins[i].classList.toggle("lo",t<0)}
  function paintVals(v){
    for(let i=0;i<N;i++){
      const x=v.vals&&v.vals[i]>0?v.vals[i]:0;
      if(shown.vals[i]!==x){shown.vals[i]=x;nums[i].textContent=x?String(x):"?";nums[i].style.fontSize=x>=10?"11px":""}
    }
  }
  function movePick(k,hide){
    if(shown.pickK===k)return;shown.pickK=k;
    css1(pickEl,"translate("+f1(tipX(k))+"px,"+PICKY+"px)");
  }
  const firstOpen=ok=>{const j=ok.findIndex(x=>!x);return j<0?N-1:j};
  function applyStatic(v,anim){
    for(let i=0;i<N;i++){shown.ok[i]=v.ok&&v.ok[i]?1:0;shown.tint[i]=v.tint&&v.tint[i]||0;paintPin(i);paintTint(i)}
    paintVals(v);
    const broken=!!v.broken,open=!!v.open;
    if(broken!==shown.broken){
      if(shown.broken===false&&broken&&anim){host.classList.add("shake");later(650,()=>host.classList.remove("shake"));if(v.sound&&sfx.broke)sfx.broke()}
      shown.broken=broken;
      host.classList.toggle("broken",broken);
      pins.forEach((p,i)=>{const d=host.__bd[i];css1(p,broken?"translate("+f1(d[0])+"px,"+f1(d[1])+"px) rotate("+f1(d[2])+"deg)":"translate(0px,0px) rotate(0deg)")});
      css1(fragEl,broken?"translate(14px,86px) rotate(68deg)":"translate(0px,0px) rotate(0deg)");fragEl.style.opacity=broken?".15":"1";
    }
    host.classList.toggle("cracks",!!v.cracks);
    if(open!==shown.open){
      if(shown.open===false&&open&&anim&&v.sound&&sfx.open)later(80,()=>sfx.open());
      shown.open=open;host.classList.toggle("open",open);
      css1(boltEl,"translateX("+(open?TRAVEL:0)+"px)");
      gears.forEach(g=>css1(g,"rotate("+(open?f1(TRAVEL/GR*180/Math.PI):0)+"deg)"));
    }
    movePick(open||broken?"open":v.pick==="in"?firstOpen(shown.ok):"out");
    const fin=open||broken,txt=broken?"QUEBRADA":open?(v.how==="key"?"ABERTA COM CHAVE":v.how==="force"?"ARROMBADA":"ABERTA"):"";
    msg.className="fmsg"+(fin?" on "+(open?"good":"bad"):"");msg.textContent=txt;
  }
  function endSeq(){timers.forEach(clearTimeout);timers=[];seq=null}
  function runSeq(v){
    endSeq();seq=true;
    const before=shown.ok.slice(),idx=[];for(let i=0;i<N;i++)if(!before[i])idx.push(i);
    const STEP=310;
    idx.forEach((i,j)=>{
      later(j*STEP,()=>{shown.pickK=-9;movePick(i)});
      later(j*STEP+190,()=>{
        const f=v.fb[i];
        if(f===0){shown.ok[i]=1;paintPin(i);if(v.sound&&sfx.click)sfx.click()}
        else{
          const p=pins[i];p.classList.remove("bump");void p.getBoundingClientRect();p.classList.add("bump");later(380,()=>p.classList.remove("bump"));
          if(v.hint){shown.tint[i]=f;paintTint(i)}
          if(v.sound){if(f>0&&sfx.alto)sfx.alto();else if(f<0&&sfx.baixo)sfx.baixo()}
        }
      });
    });
    later(idx.length*STEP+260,()=>{seq=null;applyStatic(lastView,true)});
  }
  /* ouvir de novo: toca só os sons da última tentativa (pinos novos), sem mexer no estado */
  function echo(v){
    if(dead||seq||!lastView||!Array.isArray(v.fb))return;
    endSeq();seq=true;const idx=[];for(let i=0;i<N;i++)if(v.nw&&v.nw[i])idx.push(i);
    idx.forEach((i,j)=>{
      later(j*310,()=>{shown.pickK=-9;movePick(i)});
      later(j*310+190,()=>{const f=v.fb[i];
        if(f===0){if(sfx.click)sfx.click()}
        else{const p=pins[i];p.classList.remove("bump");void p.getBoundingClientRect();p.classList.add("bump");later(380,()=>p.classList.remove("bump"));
          if(f>0&&sfx.alto)sfx.alto();else if(f<0&&sfx.baixo)sfx.baixo()}});
    });
    later(idx.length*310+260,()=>{seq=null;shown.pickK=-9;applyStatic(lastView,true)});
  }
  build(3);
  return{
    echo,
    update(v){
      if(dead)return;
      const n=Math.max(3,Math.min(10,+v.n||4));
      if(n!==N){endSeq();build(n);first=true}
      lastView=v;
      const fresh=v.at&&v.at!==lastAt&&Date.now()-v.at<6000&&Array.isArray(v.fb)&&v.fb.length===N;
      if(first){applyStatic(v,false);lastAt=v.at||0;first=false;requestAnimationFrame(()=>requestAnimationFrame(()=>host.classList.remove("noanim")));return}
      if(fresh){lastAt=v.at;runSeq(v);paintVals(v);return}
      lastAt=v.at||lastAt;
      if(seq){paintVals(v);return}
      applyStatic(v,true);
    },
    busy:()=>!!seq,
    destroy(){dead=true;endSeq();host.replaceChildren();host.classList.remove("fk","noanim","open","broken","cracks","shake")}
  };
}
