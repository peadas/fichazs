/* Peças compartilhadas da Mesa (painel, mestre e segundo plano).
   Tudo roda no mesmo domínio da ficha, então a ficha é lida direto do localStorage
   e compartilhada na sala pelos metadados do jogador do Owlbear. Sem servidor. */
export const KEY="ordem.mesa/ficha";
export const KEY_NPC="ordem.mesa/npcs";   // NPCs que o mestre mostrou na mesa
export const LS={sheet:"ficha-ordem",img:"ficha-ordem-img",joined:"mesa-joined",collapsed:"mesa-collapsed"};
const MAX=12000;   // folga sob o limite de metadados do Owlbear (~16 kB)

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
const tcm=new Map();
export function thumb(url,S=128,q=.55){
  if(!url)return Promise.resolve(null);
  const k=S+":"+url.length+":"+url.slice(-48);
  if(tcm.has(k))return Promise.resolve(tcm.get(k));
  return new Promise(res=>{
    const im=new Image();
    im.onload=()=>{
      const r=Math.min(1,S/Math.max(im.width,im.height)),w=Math.max(1,Math.round(im.width*r)),h=Math.max(1,Math.round(im.height*r));
      const c=document.createElement("canvas");c.width=w;c.height=h;
      const x=c.getContext("2d");x.fillStyle="#1d2223";x.fillRect(0,0,w,h);x.drawImage(im,0,0,w,h);
      let v=null;try{v=c.toDataURL("image/jpeg",q)}catch(e){}
      tcm.set(k,v);if(tcm.size>16)tcm.delete(tcm.keys().next().value);res(v);
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

/* PV/PD do jogador direto do menu: grava na mesma ficha que a janela da ficha usa (ela se atualiza sozinha) */
export function mineLive(){
  let d={};try{d=JSON.parse(g(LS.sheet)||"{}")||{}}catch(e){}
  return{pv:num(d.pv,10),pvmax:num(d.pvmax,10),pd:num(d.pd,10),pdmax:num(d.pdmax,10)};
}
export function setMine(key,val){                   // key: "pv" | "pd"
  let d={};try{d=JSON.parse(g(LS.sheet)||"{}")||{}}catch(e){}
  const max=num(d[key+"max"],10);d[key]=Math.max(0,Math.min(max,val));
  if(d[key+"max"]==null)d[key+"max"]=max;
  s(LS.sheet,JSON.stringify(d));
}

/* ---- publicar / retirar a minha ficha da sala (usado pela tela da Mesa, pela ficha e pelo segundo plano) ---- */
export async function publishMine(OBR,name){
  let nm=name;if(nm==null){try{nm=await OBR.player.getName()}catch(e){nm=""}}
  await OBR.player.setMetadata({[KEY]:await buildEntry(nm)});
}
export async function unpublishMine(OBR){await OBR.player.setMetadata({[KEY]:undefined})}
/* "estou na mesa?": vale a marca salva OU já existir a minha ficha publicada na sala */
export async function amJoined(OBR){
  if(g(LS.joined)==="1")return true;
  try{const m=await OBR.player.getMetadata();return !!(m&&m[KEY])}catch(e){return false}
}
/* o navegador deixa esta página guardar dados? (alguns bloqueiam em páginas dentro de outras) */
export function storageOk(){
  try{const k="mesa-probe";localStorage.setItem(k,"1");const ok=localStorage.getItem(k)==="1";localStorage.removeItem(k);return ok}catch(e){return false}
}

/* ================= NPCs (ficam no navegador do mestre; só os "mostrados" vão para a sala) ================= */
export const npcs=()=>{try{const a=JSON.parse(g("mesa-npcs")||"[]");return Array.isArray(a)?a:[]}catch(e){return[]}};
export const saveNpcs=a=>s("mesa-npcs",JSON.stringify(a));
export const npcSheet=id=>{try{return JSON.parse(g("npc:"+id)||"{}")||{}}catch(e){return{}}};
export const setNpcSheet=(id,d)=>s("npc:"+id,JSON.stringify(d));
export const npcImg=id=>g("npc:"+id+":img");
export const npcDel=id=>{s("npc:"+id,null);s("npc:"+id+":img",null);s("npc:"+id+":exp",null);saveNpcs(npcs().filter(n=>n.id!==id))};
export function npcInfo(id){
  const d=npcSheet(id);
  return{nome:((d.nome||"")+" "+(d.sob||"")).trim()||"NPC sem nome",perfil:d.perfil||"",nivel:num(d.nivel,1),
    pv:num(d.pv,10),pvmax:num(d.pvmax,10),pd:num(d.pd,10),pdmax:num(d.pdmax,10)};
}
export function npcSet(id,key,val){                 // define PV/PD do NPC (segmentos clicáveis)
  const d=npcSheet(id),max=num(d[key+"max"],10);
  d[key]=Math.max(0,Math.min(max,val));if(d[key+"max"]==null)d[key+"max"]=max;setNpcSheet(id,d);
}
/* olho do NPC: fechado (oculto) = as rolagens do mestre para ele não aparecem para os outros jogadores */
export const npcOculto=id=>!!npcs().find(n=>n.id===id&&n.oculto);
export function npcOlho(id,oculto){
  const l=npcs(),n=l.find(x=>x.id===id);if(!n)return;
  n.oculto=oculto===undefined?!n.oculto:!!oculto;saveNpcs(l);return n.oculto;
}
export function npcAdjust(id,key,delta){            // key: "pv" | "pd"
  const d=npcSheet(id),max=num(d[key+"max"],10),cur=num(d[key],10);
  d[key]=Math.max(0,Math.min(max,cur+delta));setNpcSheet(id,d);
}
export async function buildNpcs(){
  const out=[];
  for(const n of npcs()){
    if(!n.shown)continue;const i=npcInfo(n.id);
    out.push({id:n.id,nome:i.nome,pv:i.pv,pvmax:i.pvmax,pd:i.pd,pdmax:i.pdmax,th:await thumb(npcImg(n.id),72,.5)});
  }
  if(JSON.stringify(out).length>MAX)out.forEach(o=>{delete o.th});
  return out;
}
export const sigNpcs=()=>npcs().map(n=>n.id+(n.shown?"1":"0")+(g("npc:"+n.id)||"")+((g("npc:"+n.id+":img")||"").length)).join("|");
/* NPCs mostrados por qualquer jogador (o mestre), no mesmo formato de um jogador */
export function npcsOf(players){
  const out=[];
  for(const p of players){
    const a=p&&p.metadata&&p.metadata[KEY_NPC];if(!Array.isArray(a))continue;
    for(const n of a)out.push({id:"npc:"+n.id,npc:n.id,name:n.nome,color:"#c9b27a",isNpc:true,metadata:{[KEY]:n}});
  }
  return out;
}

/* ================= janelas grandes (popover centralizado; clicar fora da janela fecha) ================= */
async function openBig(OBR,id,rel,query,maxW,maxH){
  let vw=1280,vh=860;
  try{vw=await OBR.viewport.getWidth();vh=await OBR.viewport.getHeight()}catch(e){}
  const url=new URL(rel,location.href).href+"?pop="+encodeURIComponent(id)+query;
  try{await OBR.popover.close(id)}catch(e){}
  try{
    await OBR.popover.open({id,url,width:Math.max(360,Math.min(maxW,vw-24)),height:Math.max(360,Math.min(maxH,vh-24)),
      anchorReference:"POSITION",anchorPosition:{left:Math.round(vw/2),top:Math.round(vh/2)},
      anchorOrigin:{horizontal:"CENTER",vertical:"CENTER"},transformOrigin:{horizontal:"CENTER",vertical:"CENTER"},
      disableClickAway:false,marginThreshold:8});
    try{await OBR.action.close()}catch(e){}
  }catch(e){console.warn("[mesa] não consegui abrir a janela",e)}
}
/* a ficha do próprio jogador (ou de um NPC do mestre) */
export const openFicha=(OBR,npcId)=>openBig(OBR,"ordem.ficha/sheet"+(npcId?"/"+npcId:""),"ficha.html",npcId?"&npc="+encodeURIComponent(npcId):"",1120,860);
/* a ficha de um jogador, aberta pelo mestre (editável) */
export const openGm=(OBR,playerId)=>openBig(OBR,"ordem.mesa/gm/"+playerId,"gm.html","&p="+encodeURIComponent(playerId),1280,920);
