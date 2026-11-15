/* dice-style.js — estilos de dado (material + textura procedural + número), cor da mesa e painel de opções.
   Usado pela ficha (painel em Settings) e pelo overlay (renderização 3D). Carregar depois do engine.js. */
(function(){
"use strict";
const LS="ordem.ficha/dice",LM="ordem.ficha/mesa";
const ST=[["opaco","Opaco (plástico polido)"],["transl","Translúcido (resina)"],["metal","Metálico"],["classico","Clássico dourado (atual)"]];
const TX=[["liso","Liso"],["redemoinho","Redemoinho perolado"],["fumaca","Fumaça"],["granulado","Granulado"],["pedra","Pedra rachada"],["glitter","Glitter / cristais"],["ornamentos","Ornamentos rúnicos"]];
const NS=[["tinta","Tinta"],["metal","Folha metálica"],["brilho","Brilho mágico"]];
const FN=[["classica","Clássica"],["runica","Rúnica"],["simples","Simples"]];
const FONT={classica:'italic 700 %px Georgia,serif',runica:'700 %px Cinzel,Georgia,serif',simples:'700 %px "Barlow Condensed",Arial,sans-serif'};
const DEF={st:"classico",tx:"redemoinho",c1:"#8c1c24",c2:"#120707",cn:"#ecc962",ns:"tinta",fn:"classica"};
const PRE=[
 {n:"Rubi perolado",st:"opaco",tx:"redemoinho",c1:"#b3141f",c2:"#120607",cn:"#e9b23b",ns:"metal",fn:"simples"},
 {n:"Sangue rúnico",st:"opaco",tx:"ornamentos",c1:"#8e1d28",c2:"#0b0b0d",cn:"#e0525c",ns:"tinta",fn:"runica"},
 {n:"Esmeralda rúnica",st:"opaco",tx:"ornamentos",c1:"#1f8f45",c2:"#0b0b0d",cn:"#7dff9c",ns:"tinta",fn:"runica"},
 {n:"Ouro arcano",st:"transl",tx:"fumaca",c1:"#2a2430",c2:"#d9b45a",cn:"#f0c647",ns:"metal",fn:"runica"},
 {n:"Fumaça",st:"transl",tx:"fumaca",c1:"#8a8fa8",c2:"#2b2b38",cn:"#ffffff",ns:"tinta",fn:"runica"},
 {n:"Aurora",st:"transl",tx:"glitter",c1:"#3b2a9c",c2:"#2a7ad8",cn:"#e0a83a",ns:"metal",fn:"classica"},
 {n:"Galáxia",st:"opaco",tx:"redemoinho",c1:"#9a2fa8",c2:"#2f55c9",cn:"#f0a860",ns:"metal",fn:"simples"},
 {n:"Rosa pérola",st:"opaco",tx:"redemoinho",c1:"#c9507a",c2:"#8a2548",cn:"#ffffff",ns:"tinta",fn:"simples"},
 {n:"Cristal rosa",st:"transl",tx:"liso",c1:"#f08ad0",c2:"#ffd2f0",cn:"#ffffff",ns:"tinta",fn:"simples"},
 {n:"Ônix e ouro",st:"metal",tx:"granulado",c1:"#1a1a1e",c2:"#4a4a52",cn:"#d4af37",ns:"metal",fn:"classica"}
];
const MESAS=[["Original",""],["Feltro verde","#1f5a3a"],["Vinho","#5a1626"],["Azul-noite","#16254d"],["Couro preto","#1b1b1e"],["Madeira","#6b4423"],["Roxo","#3d2160"],["Cinza","#555b5e"]];
const HEX=/^#[0-9a-f]{6}$/i;
const lsGet=k=>{try{return localStorage.getItem(k)}catch(e){return null}};
const lsSet=(k,v)=>{try{v?localStorage.setItem(k,v):localStorage.removeItem(k)}catch(e){}};
const rgb=h=>[1,3,5].map(i=>parseInt(h.substr(i,2),16));
const hex=a=>"#"+a.map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,"0")).join("");
const shade=(h,f)=>hex(rgb(h).map(v=>f<0?v*(1+f):v+(255-v)*f));
const mix=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];
function hslOf(h){const[r,g,b]=rgb(h).map(v=>v/255),mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2,d=mx-mn;let H=0,s=0;
  if(d){s=d/(1-Math.abs(2*l-1));H=mx===r?((g-b)/d+6)%6:mx===g?(b-r)/d+2:(r-g)/d+4;H*=60}return[H,s,l]}
function hs(h,s,l){h=((h%360)+360)%360;const a=s*Math.min(l,1-l),f=n=>{const k=(n+h/30)%12;return l-a*Math.max(-1,Math.min(k-3,9-k,1))};return[f(0)*255,f(8)*255,f(4)*255]}
const sm=(a,b,x)=>{x=Math.min(1,Math.max(0,(x-a)/(b-a)));return x*x*(3-2*x)};

/* ---------- ruído de valor tileável ---------- */
function rng(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function mkN(seed){const M=64,r=rng(seed),g=new Float32Array(M*M);for(let i=0;i<M*M;i++)g[i]=r();
  return(x,y,p)=>{const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi,u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf),
    H=(a,b)=>g[(((b%p)+p)%p)*M+(((a%p)+p)%p)];
    return(H(xi,yi)*(1-u)+H(xi+1,yi)*u)*(1-v)+(H(xi,yi+1)*(1-u)+H(xi+1,yi+1)*u)*v}}
const fbm=(n,u,v,f,o,wx=0,wy=0)=>{let s=0,a=.5,t=0;for(let i=0;i<o;i++){s+=a*n(u*f+wx,v*f+wy,f);t+=a;a/=2;f*=2}return s/t};
const hh=(i,j)=>{const s=Math.sin(i*127.1+j*311.7)*43758.5453;return s-Math.floor(s)};

/* ---------- ornamentos (filigrana) ---------- */
function orn(x,S,stroke,lw,disc){
  x.save();x.translate(S/2,S/2);x.strokeStyle=stroke;x.fillStyle=stroke;x.lineCap="round";x.lineJoin="round";
  x.lineWidth=lw;x.beginPath();x.arc(0,0,S*.47,0,7);x.stroke();
  x.lineWidth=lw*.55;x.beginPath();x.arc(0,0,S*.425,0,7);x.stroke();
  for(let i=0;i<12;i++){
    x.save();x.rotate(i*Math.PI/6);x.lineWidth=lw*.8;
    x.beginPath();for(let a=0;a<=2.3*Math.PI;a+=.2){const r=S*.05*(1-a/(2.5*Math.PI)),px=S*.375+r*Math.cos(a+Math.PI),py=r*Math.sin(a+Math.PI);a?x.lineTo(px,py):x.moveTo(px,py)}x.stroke();
    x.beginPath();x.moveTo(S*.3,0);x.quadraticCurveTo(S*.33,-S*.05,S*.375-S*.05,-S*.01);x.stroke();
    x.beginPath();x.arc(S*.31,S*.055,lw*.55,0,7);x.fill();
    x.rotate(Math.PI/12);x.beginPath();x.arc(S*.455,0,lw*.5,0,7);x.fill();
    x.restore();
  }
  if(disc){x.fillStyle=disc;x.beginPath();x.arc(0,0,S*.27,0,7);x.fill();x.strokeStyle=stroke;x.lineWidth=lw*.9;x.stroke()}
  x.restore();
}

/* ---------- textura da face (cor + relevo) ---------- */
const genC={};
function gen(cfg){
  const key=[cfg.tx,cfg.c1,cfg.c2].join();if(genC[key])return genC[key];
  const S=256,c=document.createElement("canvas"),b=document.createElement("canvas");c.width=c.height=b.width=b.height=S;
  const cx=c.getContext("2d"),bx=b.getContext("2d"),im=cx.createImageData(S,S),bm=bx.createImageData(S,S);
  const A=rgb(cfg.c1),B=rgb(cfg.c2),n=mkN(7),n2=mkN(19),tx=cfg.tx,h2=hslOf(cfg.c2)[0];
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){
    const u=x/S,v=y/S;let t=0,h=.5,L=1,col=null;
    if(tx==="liso"||tx==="ornamentos"){const q=fbm(n,u,v,4,3);h=.5+(q-.5)*.12;L=.95+.1*q}
    else if(tx==="redemoinho"){
      const w=fbm(n,u,v,2,3);t=sm(.3,.7,fbm(n2,u,v,2,4,w*5,w*5));
      const vv=fbm(n2,u,v,3,3,w*6,w*6),line=1-Math.abs(vv-.5)*2;L=1+.4*sm(.86,1,line)-.15*sm(.5,.2,vv);h=.45+t*.15;
    }else if(tx==="fumaca"){
      const w=fbm(n,u,v,2,3),r=1-Math.abs(2*fbm(n2,u,v,3,4,w*6,w*6)-1);t=Math.min(1,Math.pow(r,3)*1.3);h=.5+t*.1;L=.9+.2*w;
    }else if(tx==="granulado"){
      const g=n(u*64,v*64,64),mt=fbm(n2,u,v,4,3);t=sm(.55,.75,mt)*.55+(g>.93?.85:0);h=.5+(g-.5)*.5;L=.88+g*.24;
    }else if(tx==="pedra"){
      const mt=fbm(n,u,v,3,4),r=fbm(n2,u,v,3,3,mt*4,mt*4),cr=1-sm(0,.022,Math.abs(r-.5)),g=n(u*64,v*64,64);
      t=sm(.35,.65,mt);L=(.9+g*.2)*(1-.75*cr);h=.5+mt*.2-.4*cr+(g-.5)*.1;
    }else if(tx==="glitter"){
      const w=fbm(n,u,v,2,3);t=sm(.3,.7,fbm(n2,u,v,2,4,w*5,w*5));
      const cu=u*8+w*1.5,cv=v*8+w*1.5,I=Math.floor(cu),J=Math.floor(cv),r=hh(((I%8)+8)%8,((J%8)+8)%8);
      if(r>.5){const f=(cu-I)*(1+r)+(cv-J)*r*2,shn=.5+.5*Math.sin(f*5+r*20),k=(.3+.55*(r-.5)*2*shn);
        col=mix(mix(A,B,t),hs(h2+(r-.5)*140,.85,.58),Math.min(.85,k));h=.5+(r-.5)*.3}
      if(n(u*96,v*96,64)>.965)col=[255,255,255];
    }
    const base=col||mix(A,B,Math.min(1,Math.max(0,t))),i=(y*S+x)*4;
    im.data[i]=Math.min(255,base[0]*L);im.data[i+1]=Math.min(255,base[1]*L);im.data[i+2]=Math.min(255,base[2]*L);im.data[i+3]=255;
    const hv=Math.max(0,Math.min(255,h*255));bm.data[i]=bm.data[i+1]=bm.data[i+2]=hv;bm.data[i+3]=255;
  }
  cx.putImageData(im,0,0);bx.putImageData(bm,0,0);
  if(tx==="ornamentos"){orn(cx,S,cfg.c2,5,cfg.c2);orn(bx,S,"#fff",5,"#000")}
  if(Object.keys(genC).length>8)for(const k in genC)delete genC[k];
  return genC[key]={c,b};
}

/* ---------- número (cor + relevo) ---------- */
function numCanvas(n,cfg){
  const S=256,c=document.createElement("canvas"),b=document.createElement("canvas");c.width=c.height=b.width=b.height=S;
  const x=c.getContext("2d"),y=b.getContext("2d"),sz=n>9?128:170,f=FONT[cfg.fn].replace("%",sz);
  [x,y].forEach(k=>{k.textAlign="center";k.textBaseline="middle";k.font=f});
  y.fillStyle="#000";y.fillRect(0,0,S,S);
  const cy=S/2+8;
  if(cfg.ns==="metal"){
    x.lineWidth=7;x.strokeStyle=shade(cfg.cn,-.6);x.strokeText(n,S/2,cy);
    const g=x.createLinearGradient(0,S*.2,0,S*.8);g.addColorStop(0,shade(cfg.cn,.55));g.addColorStop(.5,cfg.cn);g.addColorStop(1,shade(cfg.cn,-.35));x.fillStyle=g;
  }else if(cfg.ns==="brilho"){
    x.shadowColor=cfg.cn;x.shadowBlur=26;x.fillStyle=shade(cfg.cn,.35);x.fillText(n,S/2,cy);x.shadowBlur=10;
  }else{x.lineWidth=6;x.strokeStyle=shade(cfg.cn,-.55);x.strokeText(n,S/2,cy);x.fillStyle=cfg.cn}
  x.fillText(n,S/2,cy);
  y.shadowColor="#fff";y.shadowBlur=7;y.fillStyle="#fff";y.fillText(n,S/2,cy);
  if(n===6||n===9){x.shadowBlur=0;x.fillStyle=cfg.cn;x.fillRect(S/2-38,S-34,76,10);y.shadowBlur=0;y.fillRect(S/2-38,S-34,76,10)}
  return{c,b};
}

/* ---------- materiais three.js ---------- */
const cache={};
function mats(cfg,env){
  const key=JSON.stringify(cfg)+(env?1:0);if(cache[key])return cache[key];
  if(Object.keys(cache).length>5)for(const k in cache)delete cache[k];
  const T=THREE,{c,b}=gen(cfg),map=new T.CanvasTexture(c),bump=new T.CanvasTexture(b);
  [map,bump].forEach(t=>{t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=4});
  const o=cfg.tx==="ornamentos",BS=DICE.BUMP,common={map,bumpMap:bump,bumpScale:o?BS*1.4:BS,envMap:env||null};
  let face;
  if(cfg.st==="transl")face=new T.MeshPhysicalMaterial({...common,transparent:true,opacity:cfg.tx==="liso"?.5:.66,roughness:.08,metalness:0,clearcoat:1,clearcoatRoughness:.04,side:T.DoubleSide,depthWrite:false,envMapIntensity:1.3});
  else if(cfg.st==="metal")face=new T.MeshPhysicalMaterial({...common,roughness:.32,metalness:.85,clearcoat:.3,clearcoatRoughness:.2,envMapIntensity:1.5});
  else face=new T.MeshPhysicalMaterial({...common,roughness:.42,metalness:.05,clearcoat:.85,clearcoatRoughness:.14,envMapIntensity:.9});
  const out={fixed:o,inset:1,face:null,body:face,inner:null,_n:{}};
  if(o){out.inset=.9;out.face=face;out.body=new T.MeshPhysicalMaterial({color:0x0c0c0f,roughness:.3,metalness:.2,clearcoat:.9,clearcoatRoughness:.1,envMap:env||null})}
  if(cfg.st==="transl"&&cfg.tx!=="liso")out.inner=new T.MeshStandardMaterial({map,roughness:.6,metalness:0,emissive:new T.Color(cfg.c2),emissiveIntensity:.12});
  out.num=n=>{
    if(!out._n[n]){const nc=numCanvas(n,cfg),mt=new T.CanvasTexture(nc.c),bt=new T.CanvasTexture(nc.b),m=cfg.ns==="metal";
      out._n[n]=new T.MeshStandardMaterial({map:mt,bumpMap:bt,bumpScale:BS,transparent:true,alphaTest:.04,roughness:m?.28:.5,metalness:m?.85:.05,
        envMap:env||null,emissive:new T.Color(cfg.ns==="brilho"?cfg.cn:0x000000),emissiveMap:cfg.ns==="brilho"?mt:null,emissiveIntensity:.9,polygonOffset:true,polygonOffsetFactor:-2})}
    return out._n[n];
  };
  return cache[key]=out;
}
/* ambiente para reflexos (caixas de luz): dá brilho realista ao verniz e ao metal */
function makeEnv(R){
  try{
    const c=document.createElement("canvas");c.width=512;c.height=256;const x=c.getContext("2d"),g=x.createLinearGradient(0,0,0,256);
    g.addColorStop(0,"#d4dbe8");g.addColorStop(.5,"#3a3f4a");g.addColorStop(1,"#14161a");x.fillStyle=g;x.fillRect(0,0,512,256);
    x.fillStyle="#fff";x.fillRect(60,50,120,50);x.fillRect(300,30,160,40);x.fillRect(150,8,200,18);x.fillStyle="#ffd9a0";x.fillRect(220,90,60,60);
    const t=new THREE.CanvasTexture(c);t.mapping=THREE.EquirectangularReflectionMapping;
    const pm=new THREE.PMREMGenerator(R),e=pm.fromEquirectangular(t).texture;pm.dispose();t.dispose();return e;
  }catch(e){return null}
}

/* ---------- configuração salva ---------- */
function get(){let o={};try{o=JSON.parse(lsGet(LS)||"{}")||{}}catch(e){}return Object.assign({},DEF,o)}
function set(o){lsSet(LS,JSON.stringify(o))}
function clean(s){
  if(!s||typeof s!=="object"||!ST.some(a=>a[0]===s.st)||s.st==="classico")return null;
  const pick=(L,v,d)=>L.some(a=>a[0]===v)?v:d,col=(v,d)=>HEX.test(v)?v:d;
  return{st:s.st,tx:pick(TX,s.tx,DEF.tx),c1:col(s.c1,DEF.c1),c2:col(s.c2,DEF.c2),cn:col(s.cn,DEF.cn),ns:pick(NS,s.ns,DEF.ns),fn:pick(FN,s.fn,DEF.fn)};
}
const mine=()=>clean(get());

/* ---------- cor da mesa ---------- */
function applyMesa(){
  let el=document.getElementById("mesa-css");const hx=lsGet(LM);
  if(!hx||!HEX.test(hx)){if(el)el.remove();return}
  const[h,s,l]=hslOf(hx);if(!el){el=document.createElement("style");el.id="mesa-css";document.head.appendChild(el)}
  el.textContent=`#tray .tbg{filter:grayscale(1) sepia(1) hue-rotate(${Math.round(h-38)}deg) saturate(${(1+s*3).toFixed(2)}) brightness(${(.3+l*1.5).toFixed(2)}) drop-shadow(0 8px 18px #000c)}`;
}
addEventListener("storage",e=>{if(e.key===LM)applyMesa()});
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",applyMesa);else applyMesa();

/* ---------- pré-visualização 2D ---------- */
function preview(cv,cfg){
  const x=cv.getContext("2d"),W=cv.width,H=cv.height,cxm=W/2,cym=H/2,R=Math.min(W,H)*.46;
  x.clearRect(0,0,W,H);
  const pts=[0,1,2,3,4,5].map(i=>[cxm+R*Math.cos(i*Math.PI/3-Math.PI/2),cym+R*Math.sin(i*Math.PI/3-Math.PI/2)]);
  const hexp=()=>{x.beginPath();pts.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.closePath()};
  x.save();hexp();x.clip();
  if(cfg.st==="classico"){x.fillStyle="#d0a93f";x.fillRect(0,0,W,H);x.fillStyle="#08080a";x.beginPath();pts.forEach((p,i)=>{const q=[cxm+(p[0]-cxm)*.8,cym+(p[1]-cym)*.8];i?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1])});x.fill()}
  else{
    if(cfg.st==="transl"){x.fillStyle="#1a1d22";x.fillRect(0,0,W,H);x.globalAlpha=.8}
    x.drawImage(gen(cfg).c,cxm-R,cym-R,R*2,R*2);x.globalAlpha=1;
    if(cfg.st==="metal"){x.fillStyle="rgba(255,255,255,.12)";x.fillRect(0,0,W,H)}
  }
  const g=x.createRadialGradient(W*.36,H*.28,4,cxm,cym,R*1.25);g.addColorStop(0,"rgba(255,255,255,.5)");g.addColorStop(.3,"rgba(255,255,255,0)");g.addColorStop(1,"rgba(0,0,0,.55)");
  x.fillStyle=g;x.fillRect(0,0,W,H);x.restore();
  x.strokeStyle="rgba(0,0,0,.45)";x.lineWidth=1.5;x.beginPath();[0,2,4].forEach((k,i)=>i?x.lineTo(pts[k][0],pts[k][1]):x.moveTo(pts[k][0],pts[k][1]));x.closePath();x.stroke();
  pts.forEach((p,i)=>{x.beginPath();x.moveTo(p[0],p[1]);x.lineTo(...[[cxm,cym]][0]);x.stroke()});
  hexp();x.lineWidth=2;x.strokeStyle="rgba(0,0,0,.6)";x.stroke();
  const nc=numCanvas(20,cfg.st==="classico"?{...cfg,ns:"tinta",cn:"#ecc962",fn:"classica"}:cfg),sz=R*1.0;
  x.drawImage(nc.c,cxm-sz/2,cym-sz/2,sz,sz);
}

/* ---------- painel de opções (ficha → Settings) ---------- */
function ui(root,onChange){
  const css=document.createElement("style");css.textContent=
   ".dp{display:grid;gap:10px;padding:10px 0}.dp label{display:grid;gap:4px;font-size:.85rem;color:var(--muted,#9aa)}.dp select,.dp input[type=color]{width:100%;height:34px;background:#0a0c0d;color:inherit;border:1px solid var(--line,#2d3638);padding:0 6px}"+
   ".dp .row{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.dp .pre,.dp .ms{display:flex;flex-wrap:wrap;gap:6px}.dp .pre button,.dp .ms button{font-size:.8rem;padding:5px 9px;background:#0a0c0d;color:inherit;border:1px solid var(--line,#2d3638);cursor:pointer}"+
   ".dp .ms button i{display:inline-block;width:11px;height:11px;border-radius:50%;margin-right:5px;vertical-align:-1px;border:1px solid #fff6}.dp canvas{justify-self:center;max-width:100%}.dp h4{margin:6px 0 0;font:700 .95rem Cinzel,serif}";
  root.appendChild(css);
  const S=get(),box=document.createElement("div");box.className="dp";root.appendChild(box);
  const sel=(id,l,L)=>`<label>${l}<select data-k="${id}">${L.map(a=>`<option value="${a[0]}">${a[1]}</option>`).join("")}</select></label>`;
  box.innerHTML=`<canvas width="240" height="210"></canvas><div class="pre">${PRE.map((p,i)=>`<button type="button" data-p="${i}">${p.n}</button>`).join("")}</div>`+
    sel("st","Estilo",ST)+sel("tx","Textura",TX)+
    `<div class="row"><label>Cor<input type="color" data-k="c1"></label><label>Cor 2<input type="color" data-k="c2"></label><label>Número<input type="color" data-k="cn"></label></div>`+
    `<div class="row" style="grid-template-columns:1fr 1fr">${sel("ns","Estilo do número",NS)}${sel("fn","Fonte",FN)}</div>`+
    `<h4>Mesa de dados</h4><div class="ms">${MESAS.map(m=>`<button type="button" data-m="${m[1]}"><i style="background:${m[1]||"#888"}"></i>${m[0]}</button>`).join("")}<input type="color" id="dmesa" value="${lsGet(LM)||"#1f5a3a"}" style="width:46px;height:30px"></div>`;
  const cv=box.querySelector("canvas"),fields=box.querySelectorAll("[data-k]");
  let raf=0;const draw=()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>preview(cv,S))};
  const sync=()=>{fields.forEach(f=>{f.value=S[f.dataset.k]});draw()};
  const save=()=>{set(S);draw();onChange&&onChange(S)};
  fields.forEach(f=>f.addEventListener("input",()=>{S[f.dataset.k]=f.value;if(f.dataset.k!=="st"&&S.st==="classico"){S.st="opaco";sync()}save()}));
  box.querySelectorAll("[data-p]").forEach(b=>b.onclick=()=>{const p=PRE[+b.dataset.p];Object.assign(S,p);delete S.n;sync();save()});
  box.querySelectorAll("[data-m]").forEach(b=>b.onclick=()=>{lsSet(LM,b.dataset.m);applyMesa()});
  box.querySelector("#dmesa").addEventListener("input",e=>{lsSet(LM,e.target.value);applyMesa()});
  sync();
}

const DICE=window.DICE={ST,TX,NS,FN,PRE,MESAS,DEF,BUMP:.6,get,set,clean,mine,mats,makeEnv,ui,applyMesa,preview};
})();
