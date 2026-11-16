/* dice-style.js — estilos de dado (material + textura procedural + número), cor da mesa e painel de opções.
   Usado pela ficha (painel em Settings) e pelo overlay (renderização 3D). Carregar depois do engine.js. */
(function(){
"use strict";
const VER="2.10.2",LS="ordem.ficha/dice2",LS0="ordem.ficha/dice",LM="ordem.ficha/mesa";
const KINDS=[["","Normal"],["pv","Pavor"],["rel","Relação"]];
const ORIG={"":{bg:"#d0a93f",fg:"#ecc962",face:"#08080a"},pv:{bg:"#14171c",fg:"#e9a23b",face:"#14171c"},rel:{bg:"#e9e3d3",fg:"#8c2f3a",face:"#e9e3d3"}};
const ST=[["opaco","Opaco"],["transl","Translúcido"],["metal","Metálico"],["classico","Original"]];
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
  if(Object.keys(genC).length>40)for(const k in genC)delete genC[k];
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

/* ---------- configuração salva (uma por tipo de dado: "" normal, pv pavor, rel relação) ---------- */
const KS=["","pv","rel"];
function getAll(){
  let o={};
  try{o=JSON.parse(lsGet(LS)||"null")}catch(e){o=null}
  if(!o){o={};try{const old=JSON.parse(lsGet(LS0)||"null");if(old&&old.st)o[""]=old}catch(e){}}
  const r={};KS.forEach(k=>{r[k]=Object.assign({},DEF,o&&o[k]||{})});return r;
}
const get=k=>getAll()[k||""];
const META="ordem.ficha/dice";let obrRef=null;
/* publica o estilo nos metadados do jogador no Owlbear: todos os navegadores da sala (inclusive o do mestre) leem de lá */
function publish(force){
  const o=obrRef||(window.OBRX&&window.OBRX.OBR);if(!o||!o.player||!o.player.setMetadata)return;
  const c=clean(getAll());if(!c&&!force)return;
  try{o.player.setMetadata({[META]:c||{}}).catch(()=>{})}catch(e){}
}
function setAll(A){lsSet(LS,JSON.stringify(A));publish(true)}
function importMeta(m){ // traz o que já está nos metadados para o armazenamento local (outro aparelho / outra aba)
  const c=clean(m);if(!c)return false;const A={};KS.forEach(k=>{A[k]=Object.assign({},DEF,c[k]||{})});lsSet(LS,JSON.stringify(A));return true;
}
function cleanOne(s){
  if(!s||typeof s!=="object"||!ST.some(a=>a[0]===s.st)||s.st==="classico")return null;
  const pick=(L,v,d)=>L.some(a=>a[0]===v)?v:d,col=(v,d)=>HEX.test(v)?v:d;
  return{st:s.st,tx:pick(TX,s.tx,DEF.tx),c1:col(s.c1,DEF.c1),c2:col(s.c2,DEF.c2),cn:col(s.cn,DEF.cn),ns:pick(NS,s.ns,DEF.ns),fn:pick(FN,s.fn,DEF.fn)};
}
/* aceita {"":cfg,pv:cfg,rel:cfg} (ou uma cfg só, formato antigo); devolve null se nenhum tipo está personalizado */
function clean(s){
  if(!s||typeof s!=="object")return null;
  if(s.st)s={"":s};
  const o={};let any=0;KS.forEach(k=>{o[k]=cleanOne(s[k]);if(o[k])any=1});
  return any?o:null;
}
const mine=()=>clean(getAll());
/* cores para os dadinhos de resultado (fundo e número com contraste garantido) */
function lum(h){const[r,g,b]=rgb(h).map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*r+.7152*g+.0722*b}
function chipColors(cfg){
  if(!cfg)return null;
  let bg=cfg.c1,fg=cfg.cn;
  const cr=(a,b)=>{const x=lum(a),y=lum(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
  if(cr(bg,fg)<4.2)fg=lum(bg)>.4?"#101214":"#ffffff";
  return{bg:`linear-gradient(155deg,${shade(bg,.28)},${bg} 55%,${shade(bg,-.35)})`,fg};
}

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
function poly(x,cx,cy,R,n,rot){x.beginPath();for(let i=0;i<n;i++){const a=rot+i*2*Math.PI/n;i?x.lineTo(cx+R*Math.cos(a),cy+R*Math.sin(a)):x.moveTo(cx+R*Math.cos(a),cy+R*Math.sin(a))}x.closePath()}
const n2c={};
function num2(n,cfg){const k=n+"|"+cfg.ns+cfg.fn+cfg.cn;if(!n2c[k]){if(Object.keys(n2c).length>80)for(const q in n2c)delete n2c[q];n2c[k]=numCanvas(n,cfg)}return n2c[k]}
/* desenha um dado 2D (usado na prévia do menu e na reserva 2D do overlay, quando não há WebGL) */
function drawDie(x,cx,cy,R,sides,rot,cfg,kind,num){
  const o=ORIG[kind||""],orig=cfg.st==="classico";
  x.save();poly(x,cx,cy,R,sides,rot);x.clip();
  if(orig){x.fillStyle=o.bg;x.fillRect(cx-R,cy-R,2*R,2*R);
    if(!kind){x.fillStyle=o.face;poly(x,cx,cy,R*.8,sides,rot);x.fill()}}
  else{
    if(cfg.st==="transl"){x.fillStyle="#1a1d22";x.fillRect(cx-R,cy-R,2*R,2*R);x.globalAlpha=.82}
    x.drawImage(gen(cfg).c,cx-R,cy-R,R*2,R*2);x.globalAlpha=1;
    if(cfg.st==="metal"){x.fillStyle="rgba(255,255,255,.12)";x.fillRect(cx-R,cy-R,2*R,2*R)}
  }
  const g=x.createRadialGradient(cx-R*.35,cy-R*.45,2,cx,cy,R*1.3);g.addColorStop(0,"rgba(255,255,255,.5)");g.addColorStop(.3,"rgba(255,255,255,0)");g.addColorStop(1,"rgba(0,0,0,.55)");
  x.fillStyle=g;x.fillRect(cx-R,cy-R,2*R,2*R);x.restore();
  x.strokeStyle="rgba(0,0,0,.45)";x.lineWidth=Math.max(.8,R*.03);
  if(sides===6){x.beginPath();[0,2,4].forEach((k,i)=>{const a=rot+k*Math.PI/3,px=cx+R*Math.cos(a),py=cy+R*Math.sin(a);i?x.lineTo(px,py):x.moveTo(px,py)});x.closePath();x.stroke()}
  poly(x,cx,cy,R,sides,rot);x.lineWidth=Math.max(1,R*.05);x.strokeStyle="rgba(0,0,0,.65)";x.stroke();
  const nc=num2(num,orig?{ns:"tinta",fn:"classica",cn:o.fg}:cfg),sz=R*1.05;
  x.drawImage(nc.c,cx-sz/2,cy-sz/2,sz,sz);
}
function shape(x,cx,cy,R,n,cfg,kind,num){drawDie(x,cx,cy,R,n===20?6:n===6?4:5,n===6?Math.PI/4:-Math.PI/2,cfg,kind,num)}
function preview(cv,cfg,kind){
  const x=cv.getContext("2d"),W=cv.width,H=cv.height;x.clearRect(0,0,W,H);
  shape(x,W*.2,H*.52,H*.34,6,cfg,kind,12);shape(x,W*.5,H*.5,H*.42,20,cfg,kind,20);shape(x,W*.8,H*.52,H*.34,6,cfg,kind,6);
}
/* d20 no meio, d12 (pentágono) e d6 nas pontas */
function previewShapes(cv,cfg,kind){
  const x=cv.getContext("2d"),W=cv.width,H=cv.height;x.clearRect(0,0,W,H);
  shape(x,W*.17,H*.55,H*.33,12,cfg,kind,12);shape(x,W*.5,H*.5,H*.42,20,cfg,kind,20);shape(x,W*.83,H*.55,H*.33,6,cfg,kind,6);
}

/* ---------- painel de opções ---------- */
const CSS=`.dz-wrap{display:grid;gap:14px;padding:8px 0 4px}.dz-wrap h5{margin:8px 0 -4px;font:700 .78rem Cinzel,serif;letter-spacing:.14em;text-transform:uppercase;color:#ecc962b0}
.dz-prev{position:relative;border:1px solid var(--line,#2d3638);border-radius:12px;background:radial-gradient(circle at 50% 25%,#2a3234,#090b0c);padding:10px 8px 6px;text-align:center}
.dz-prev canvas{max-width:100%;height:auto;filter:drop-shadow(0 6px 10px #000a)}
.dz-ok{position:absolute;right:12px;top:8px;font-size:.72rem;color:#7be39a;opacity:0;transform:translateY(-3px);transition:.3s}.dz-ok.on{opacity:1;transform:none}
.dz-cap{font-size:.74rem;color:var(--muted,#9aa);margin:2px 0 0}
.dz-tabs{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;background:#0a0c0d;border:1px solid var(--line,#2d3638);border-radius:12px;padding:4px}
.dz-tabs button{border:0;border-radius:9px;padding:9px 4px;background:none;color:inherit;font:600 .86rem "Barlow Condensed",sans-serif;letter-spacing:.06em;text-transform:uppercase;cursor:pointer}
.dz-tabs button.on{background:#ecc962;color:#1a1405}
.dz-pre{display:grid;grid-template-columns:repeat(auto-fill,minmax(88px,1fr));gap:8px}
.dz-card,.dz-tx button{display:grid;justify-items:center;gap:5px;padding:9px 4px 7px;background:#0a0c0d;border:1px solid var(--line,#2d3638);border-radius:12px;cursor:pointer;color:inherit;font-size:.72rem;transition:border-color .15s,transform .15s}
.dz-card:hover,.dz-tx button:hover{border-color:#ecc96288;transform:translateY(-1px)}.dz-card.on,.dz-tx button.on{border-color:#ecc962;box-shadow:0 0 0 1px #ecc962 inset}
.dz-tx{display:grid;grid-template-columns:repeat(auto-fill,minmax(92px,1fr));gap:8px}.dz-tx canvas{border-radius:8px;width:100%;height:auto}
.dz-chips{display:flex;flex-wrap:wrap;gap:6px}.dz-chips button{padding:8px 13px;border-radius:999px;background:#0a0c0d;border:1px solid var(--line,#2d3638);color:inherit;font-size:.82rem;cursor:pointer}
.dz-chips button.on{background:#ecc962;border-color:#ecc962;color:#1a1405;font-weight:700}
.dz-col{display:flex;gap:18px}.dz-col label{display:grid;justify-items:center;gap:5px;font-size:.74rem;color:var(--muted,#9aa)}
.dz-col input{-webkit-appearance:none;appearance:none;width:46px;height:46px;border-radius:50%;border:2px solid #fff4;padding:0;background:none;cursor:pointer}
.dz-col input::-webkit-color-swatch-wrapper{padding:0}.dz-col input::-webkit-color-swatch{border:0;border-radius:50%}.dz-col input::-moz-color-swatch{border:0;border-radius:50%}
.dz-act{display:flex;gap:8px;flex-wrap:wrap}.dz-act button{flex:1;min-width:130px;padding:10px 12px;border-radius:10px;border:1px solid #ecc962;background:#ecc96218;color:#ecc962;font-weight:700;cursor:pointer}.dz-act button.g{border-color:var(--line,#2d3638);background:none;color:inherit;font-weight:400}
.dz-ms{display:flex;flex-wrap:wrap;gap:8px;align-items:center}.dz-ms button{display:grid;justify-items:center;gap:4px;background:none;border:0;color:inherit;font-size:.68rem;cursor:pointer}.dz-ms button i{width:34px;height:34px;border-radius:50%;border:2px solid #fff3}.dz-ms button.on i{border-color:#ecc962;box-shadow:0 0 0 2px #ecc96255}
.dz-ms input{-webkit-appearance:none;appearance:none;width:34px;height:34px;border-radius:50%;border:2px dashed #fff5;padding:0;background:none;cursor:pointer}.dz-ms input::-webkit-color-swatch-wrapper{padding:0}.dz-ms input::-webkit-color-swatch{border:0;border-radius:50%}`;
function ui(root,opts){
  opts=opts||{};
  if(!document.getElementById("dz-css")){const c=document.createElement("style");c.id="dz-css";c.textContent=CSS;document.head.appendChild(c)}
  const A=getAll();let kind="";const cur=()=>A[kind];
  const btn=(g,L)=>L.map(a=>`<button type="button" data-g="${g}" data-v="${a[0]}">${a[1]}</button>`).join("");
  root.innerHTML=`<div class="dz-wrap">
   <div class="dz-prev"><canvas width="360" height="132"></canvas><span class="dz-ok">✓ Aplicado</span><p class="dz-cap">Vale já na próxima rolagem, para todos na mesa.</p></div>
   <div class="dz-tabs">${KINDS.map(k=>`<button type="button" data-kind="${k[0]}">${k[1]}</button>`).join("")}</div>
   <h5>Temas</h5><div class="dz-pre">${PRE.map((p,i)=>`<button type="button" class="dz-card" data-p="${i}"><canvas width="104" height="104" style="width:52px;height:52px"></canvas><span>${p.n}</span></button>`).join("")}</div>
   <h5>Estilo</h5><div class="dz-chips">${btn("st",ST)}</div>
   <h5>Textura</h5><div class="dz-tx">${TX.map(a=>`<button type="button" data-g="tx" data-v="${a[0]}"><canvas width="120" height="56"></canvas><span>${a[1]}</span></button>`).join("")}</div>
   <h5>Cores</h5><div class="dz-col"><label><input type="color" data-c="c1">Dado</label><label><input type="color" data-c="c2">Detalhe</label><label><input type="color" data-c="cn">Número</label></div>
   <h5>Número</h5><div class="dz-chips">${btn("ns",NS)}</div><div class="dz-chips">${btn("fn",FN)}</div>
   <div class="dz-act">${opts.test?'<button type="button" id="dz-test">Testar rolagem</button>':""}<button type="button" class="g" id="dz-reset">Voltar ao original</button></div>
   <h5>Mesa de dados</h5><div class="dz-ms">${MESAS.map(m=>`<button type="button" data-m="${m[1]}"><i style="background:${m[1]||"#555"}"></i>${m[0]}</button>`).join("")}<input type="color" id="dz-mesa" value="${lsGet(LM)||"#1f5a3a"}" title="Outra cor"></div>
  </div>`;
  const $q=s=>root.querySelector(s),$$=s=>[...root.querySelectorAll(s)],cv=$q(".dz-prev canvas"),ok=$q(".dz-ok");
  let t1=0,t2=0;
  const thumbs=()=>{ // miniaturas das texturas com as cores atuais
    $$('.dz-tx button').forEach(b=>{const c=b.querySelector("canvas"),x=c.getContext("2d"),g=gen({tx:b.dataset.v,c1:cur().c1,c2:cur().c2}).c;x.clearRect(0,0,c.width,c.height);x.drawImage(g,40,60,160,76,0,0,c.width,c.height)});
  };
  const sync=()=>{
    const S=cur();
    $$(".dz-tabs button").forEach(b=>b.classList.toggle("on",b.dataset.kind===kind));
    $$("[data-g]").forEach(b=>b.classList.toggle("on",S[b.dataset.g]===b.dataset.v));
    $$("[data-c]").forEach(i=>{i.value=S[i.dataset.c]});
    $$("[data-m]").forEach(b=>b.classList.toggle("on",(lsGet(LM)||"")===b.dataset.m));
    cancelAnimationFrame(t1);t1=requestAnimationFrame(()=>previewShapes(cv,S,kind));
    clearTimeout(t2);t2=setTimeout(thumbs,220);
  };
  const save=()=>{setAll(A);ok.classList.add("on");clearTimeout(save.t);save.t=setTimeout(()=>ok.classList.remove("on"),1600);opts.onChange&&opts.onChange(A)};
  const touch=()=>{if(cur().st==="classico")cur().st="opaco"};
  root.addEventListener("click",e=>{
    const b=e.target.closest("button");if(!b||!root.contains(b))return;
    if(b.dataset.kind!==undefined){kind=b.dataset.kind;sync();return}
    if(b.dataset.p!==undefined){const p=PRE[+b.dataset.p];A[kind]=Object.assign({},DEF,p);delete A[kind].n;save();sync();return}
    if(b.dataset.g){if(b.dataset.g!=="st")touch();cur()[b.dataset.g]=b.dataset.v;save();sync();return}
    if(b.dataset.m!==undefined){lsSet(LM,b.dataset.m);applyMesa();sync();return}
    if(b.id==="dz-reset"){cur().st="classico";save();sync();return}
    if(b.id==="dz-test"&&opts.test){save();opts.test()}
  });
  root.addEventListener("input",e=>{
    const i=e.target;
    if(i.dataset&&i.dataset.c){touch();cur()[i.dataset.c]=i.value;save();sync()}
    else if(i.id==="dz-mesa"){lsSet(LM,i.value);applyMesa();$$("[data-m]").forEach(b=>b.classList.remove("on"))}
  });
  sync();
  // miniaturas dos temas, uma por vez para não travar
  const cards=$$(".dz-card");let n=0;
  const next=()=>{if(n>=cards.length)return;const c=cards[n].querySelector("canvas"),x=c.getContext("2d");shape(x,52,52,46,20,Object.assign({},DEF,PRE[n]),"",20);n++;setTimeout(next,16)};
  setTimeout(next,60);
}

const DICE=window.DICE={VER,ST,TX,NS,FN,PRE,MESAS,DEF,KINDS,BUMP:.6,get,getAll,setAll,clean,cleanOne,mine,chipColors,mats,makeEnv,ui,applyMesa,drawDie,preview:previewShapes,META,publish,importMeta,useOBR:o=>{obrRef=o}};
})();
