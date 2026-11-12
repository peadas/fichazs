/* Peças compartilhadas da Mesa (painel, mestre e segundo plano).
   Tudo roda no mesmo domínio da ficha, então a ficha é lida direto do localStorage
   e compartilhada na sala pelos metadados do jogador do Owlbear. Sem servidor. */
export const KEY="ordem.mesa/ficha";
export const LS={sheet:"ficha-ordem",img:"ficha-ordem-img",joined:"mesa-joined",collapsed:"mesa-collapsed"};
const MAX=14000;   // folga sob o limite de metadados do Owlbear (~16 kB)

const g=k=>{try{return localStorage.getItem(k)}catch(e){return null}};
const s=(k,v)=>{try{v==null?localStorage.removeItem(k):localStorage.setItem(k,v)}catch(e){}};
export const store={get:g,set:s};
const num=(v,d)=>{const n=parseInt(v,10);return Number.isFinite(n)?n:d};

/* ---- texto <-> base64, com gzip quando o navegador tem ---- */
const b64=u8=>{let t="";for(let i=0;i<u8.length;i+=0x8000)t+=String.fromCharCode.apply(null,u8.subarray(i,i+0x8000));return btoa(t)};
const unb64=t=>Uint8Array.from(atob(t),c=>c.charCodeAt(0));
async function pipe(u8,stream){return new Uint8Array(await new Response(new Blob([u8]).stream().pipeThrough(stream)).arrayBuffer())}
export async function pack(str){
  const u8=new TextEncoder().encode(str);
  if(typeof CompressionStream==="function"){try{return "g:"+b64(await pipe(u8,new CompressionStream("gzip")))}catch(e){}}
  return "p:"+b64(u8);
}
export async function unpack(t){
  if(!t||t.length<3)return null;
  const u8=unb64(t.slice(2));
  return new TextDecoder().decode(t[0]==="g"?await pipe(u8,new DecompressionStream("gzip")):u8);
}

/* ---- miniatura da foto (cabe nos metadados) ---- */
let tc={k:"",v:null};
export function thumb(url){
  if(!url)return Promise.resolve(null);
  const k=url.length+":"+url.slice(-48);
  if(tc.k===k)return Promise.resolve(tc.v);
  return new Promise(res=>{
    const im=new Image();
    im.onload=()=>{
      const r=Math.min(1,128/Math.max(im.width,im.height)),w=Math.max(1,Math.round(im.width*r)),h=Math.max(1,Math.round(im.height*r));
      const c=document.createElement("canvas");c.width=w;c.height=h;
      const x=c.getContext("2d");x.fillStyle="#1d2223";x.fillRect(0,0,w,h);x.drawImage(im,0,0,w,h);
      let v=null;try{v=c.toDataURL("image/jpeg",.55)}catch(e){}
      tc={k,v};res(v);
    };
    im.onerror=()=>res(null);im.src=url;
  });
}

/* assinatura barata para saber se algo mudou */
export const sig=()=>(g(LS.sheet)||"")+"|"+((g(LS.img)||"").length)+((g(LS.img)||"").slice(-24))+"|"+g(LS.joined);

/* o que este jogador publica na sala: resumo + miniatura + ficha completa (para o mestre) */
export async function buildEntry(fallbackName){
  const sheet=g(LS.sheet)||"{}";let d={};try{d=JSON.parse(sheet)||{}}catch(e){}
  const base={v:1,nome:((d.nome||"")+" "+(d.sob||"")).trim()||fallbackName||"",perfil:d.perfil||"",nivel:num(d.nivel,1),
    pv:num(d.pv,10),pvmax:num(d.pvmax,10),pd:num(d.pd,10),pdmax:num(d.pdmax,10),t:Date.now()};
  const th=await thumb(g(LS.img));
  for(const t of [{th,z:await pack(sheet)},{th,big:1},{big:1}]){
    const e={...base,...t};if(JSON.stringify(e).length<=MAX)return e;
  }
  return base;
}
