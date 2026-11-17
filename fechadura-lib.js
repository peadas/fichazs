/* Fechadura: regras compartilhadas (menu e segundo plano). Mesmo molde do Equilibrar.
   Estado nos metadados do Owlbear: o mestre em K_F (a fechadura: tipo, pinos, senha, PA, DT, rodada, quebrada, chave)
   e cada jogador em K_FP (se entrou, os dados que escolheu, pinos certos, tentativas...). Só UM jogador fica na fechadura por vez
   (vale quem entrou primeiro). O progresso fica com a fechadura: quem entra depois herda os pinos já abertos.
   Sem janela própria: a cena é desenhada na aba do menu; o resultado dos dados do arrombamento é aplicado pelo segundo plano. */
import {sheet} from "./esconder-lib.js?v=2.16.3";
export const K_F="ordem.fech/g", K_FP="ordem.fech/p";
export const FACES=[4,6,8,10,12,20];
export const NMIN=3, NMAX=10;
const num=(v,d)=>{const n=parseInt(v,10);return Number.isFinite(n)?n:d};
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const arr=(a,len,f)=>Array.from({length:len},(_,i)=>f(Array.isArray(a)?a[i]:undefined,i));

export function normF(m){
  const o=m&&typeof m==="object"?m:{},n=clamp(num(o.n,4),NMIN,NMAX),fc=FACES.includes(num(o.faces,6))?num(o.faces,6):6;
  const s=Array.isArray(o.s)&&o.s.length===n?o.s.map(x=>clamp(num(x,1),1,fc)):[];
  return{id:num(o.id,0),on:!!o.on,kind:o.kind==="bau"?"bau":"porta",name:String(o.name||"").slice(0,30),n,faces:fc,
    pa:clamp(num(o.pa,10),1,300),dt:clamp(num(o.dt,10),1,60),max:clamp(num(o.max,12),1,99),snd:o.snd?1:0,
    rd:Math.max(0,num(o.rd,0)),br:o.br?1:0,bt:Math.max(0,num(o.bt,0)),ko:o.ko?1:0,s,
    items:Array.isArray(o.items)?o.items.slice(0,20).map(x=>String(x).slice(0,40)).filter(Boolean):[],
    dead:Array.isArray(o.dead)?o.dead.slice(-20).map(x=>String(x).slice(0,40)):[]};
}
export function normFP(m){
  const o=m&&typeof m==="object"?m:{},k=o.sk&&typeof o.sk==="object"?o.sk:null,n=clamp(Array.isArray(o.v)?o.v.length:0,0,NMAX);
  return{id:num(o.id,0),in:o.in?1:0,t:Math.max(0,num(o.t,0)),u:Math.max(0,num(o.u,0)),md:o.md==="f"?"f":"d",
    v:arr(o.v,n,x=>clamp(num(x,1),1,20)),lv:arr(o.lv,n,x=>clamp(num(x,0),0,20)),ok:arr(o.ok,n,x=>x?1:0),fb:arr(o.fb,n,x=>clamp(num(x,0),-1,1)),
    at:Math.max(0,num(o.at,0)),nw:arr(o.nw,n,x=>x?1:0),pu:Math.max(0,num(o.pu,0)),tu:Math.max(0,num(o.tu,0)),ru:Math.max(0,num(o.ru,0)),rr:Math.max(0,num(o.rr,0)),ar:Math.max(0,num(o.ar,0)),
    st:o.st==="open"||o.st==="broken"?o.st:"idle",how:o.how==="force"||o.how==="pick"?o.how:"",
    sk:k?{n:String(k.n||"").slice(0,24),a:num(k.a,0),b:num(k.b,0),s:num(k.s,0),dt:num(k.dt,0),ok:k.ok?1:0,amt:num(k.amt,0),t:num(k.t,0)}:null,
    lg:Array.isArray(o.lg)?o.lg.slice(-5).map(s=>String(s).slice(0,80)):[]};
}

/* tentativas por rodada = pelo valor do dado de Crime da ficha: d4=1, d6=2, d8=3, d10=4, d12=5 (e assim por diante) */
export const crimeFace=()=>{const f=num(sheet()["s-Crime"],4);return f>=4?f:4};
export const triesPerRound=()=>Math.max(1,Math.floor(crimeFace()/2)-1);
/* ouvir de novo (só no modo sem guia): metade da face do dado de Crime por rodada (d4=2, d6=3, d8=4, d10=5, d12=6) */
export const replaysPerRound=()=>Math.max(1,Math.floor(crimeFace()/2));
export const replaysLeft=(c,g)=>Math.max(0,replaysPerRound()-(c.rr===g.rd?c.pu:0));
export const triesLeft=(c,g)=>Math.max(0,triesPerRound()-(c.rr===g.rd?c.ru:0));

/* quem está na fechadura: entre os jogadores (sem o mestre) que entraram nesta fechadura, o que entrou primeiro */
export function occupant(g,players){
  if(!g||!g.on||!g.id)return null;
  const l=(players||[]).filter(p=>p&&p.role!=="GM").map(p=>({p,c:normFP(p.metadata&&p.metadata[K_FP])})).filter(x=>x.c.in&&x.c.id===g.id);
  l.sort((x,y)=>x.c.t-y.c.t||String(x.p.id).localeCompare(String(y.p.id)));
  return l[0]||null;
}
/* o progresso da fechadura: o registro mais recente entre todos os jogadores que mexeram NESTA fechadura (quem saiu deixa o progresso lá) */
export function lockState(g,players){
  const base=normFP(null);if(!g||!g.id)return base;
  let best=null;
  for(const p of players||[]){
    if(!p||p.role==="GM")continue;
    const c=normFP(p.metadata&&p.metadata[K_FP]);if(c.id!==g.id)continue;
    if(!best||c.u>best.u)best=c;
  }
  return best||base;
}
/* situação: aberta (como), quebrada (não dá mais para destrancar) */
export function status(g,ls){
  const open=!!(g.ko||ls.st==="open"),how=g.ko?"key":(ls.st==="open"?ls.how||"pick":"");
  const broken=!open&&!!(g.br||ls.st==="broken");
  return{open,how,broken,cracks:broken||how==="force"||(!!g.br&&open)};
}
const okFor=(g,ls)=>arr(ls.ok,g.n,x=>x?1:0);
/* entrar: herda os pinos abertos de quem esteve antes */
export function enterPatch(g,mine,ls){
  const now=Date.now(),ok=okFor(g,ls),same=mine.id===g.id&&mine.rr===g.rd;
  return{id:g.id,in:1,t:now,u:now,md:"d",ok,v:arr(ls.v,g.n,(x,i)=>ok[i]?clamp(num(x,1),1,g.faces):1),lv:arr(null,g.n,()=>0),fb:arr(null,g.n,()=>0),at:0,
    tu:ls.tu,ar:ls.ar,st:ls.st,how:ls.how,ru:same?mine.ru:0,pu:same?mine.pu:0,nw:arr(null,g.n,()=>0),rr:g.rd,sk:null,lg:ls.lg};
}
export const LEAVE={in:0};
/* mudar o número de um dado (pino) */
export function setDie(g,c,i,val){
  if(!g||c.st!=="idle"||i<0||i>=g.n||c.ok[i])return null;
  const v=arr(c.v,g.n,x=>clamp(num(x,1),1,g.faces));v[i]=((val-1+g.faces)%g.faces)+1;
  return{v,u:Date.now()};
}
/* tentar abrir: compara cada dado com a senha. Pino certo fica aberto (verde); os outros ganham "alto" ou "baixo" */
export function tryOpen(g,c){
  if(!g.on||!c.in||c.id!==g.id||c.md!=="d"||c.st!=="idle"||g.ko||g.br||g.s.length!==g.n||triesLeft(c,g)<=0)return null;
  const ok=okFor(g,c),v=arr(c.v,g.n,x=>clamp(num(x,1),1,g.faces)),fb=v.map((x,i)=>ok[i]?0:(x===g.s[i]?0:(x>g.s[i]?1:-1)));
  const nok=ok.map((o,i)=>o||(fb[i]===0?1:0)),tu=c.tu+1,ru=(c.rr===g.rd?c.ru:0)+1,done=nok.every(Boolean),now=Date.now();
  const sym=fb.map((f,i)=>ok[i]?"✓":(f===0?"✓":(g.snd?"·":(f>0?"▲":"▼")))).join(" ");
  let st="idle",how="",line="Tentativa "+tu+": "+(g.snd?nok.filter(Boolean).length+"/"+g.n+" certos":sym);
  if(done){st="open";how="pick";line+=" · aberta!"}
  else if(tu>=g.max){st="broken";line+=" · a fechadura quebrou!"}
  return{ok:nok,fb,nw:ok.map(o=>o?0:1),pu:(c.rr===g.rd?c.pu:0),lv:v,v:v.map((x,i)=>nok[i]?x:x),at:now,u:now,tu,ru,rr:g.rd,st,how,lg:[...c.lg,line].slice(-5)};
}
/* resultado do teste de arrombar (Atletismo etc.): sucesso soma o dado alto (RA) à pontuação acumulada; chegando à PA, arromba */
export function afterForce(g,c,R,dice){
  if(!g||!g.on||!R||g.id!==R.cid||!c.in||c.id!==g.id||g.ko||c.st==="open"||!Array.isArray(dice)||dice.length<2)return null;
  const a=+dice[0][1]||0,b=+dice[1][1]||0,s=a+b,ok=s>=g.dt,amt=Math.max(a,b),now=Date.now();
  const ar=ok?Math.min(g.pa,c.ar+amt):c.ar,done=ar>=g.pa;
  const sk={n:String(R.sk||"Atletismo").slice(0,24),a,b,s,dt:g.dt,ok:ok?1:0,amt,t:now};
  const line=sk.n+": "+a+" + "+b+" = "+s+" (DT "+g.dt+") · "+(ok?"+"+amt+" de força ("+ar+"/"+g.pa+")":"falhou")+(done?" · arrombada!":"");
  return{ar,sk,u:now,st:done?"open":c.st,how:done?"force":c.how,lg:[...c.lg,line].slice(-5)};
}
export const rollSecret=(n,faces)=>Array.from({length:n},()=>1+Math.floor(Math.random()*faces));
export const kindName=k=>k==="bau"?"Baú":"Porta";

/* mensagens de situação (iguais no menu e para quem só olha) */
export function statusText(g,o,me,nick,S){
  if(!g.on)return["Nenhuma fechadura ativa.",""];
  if(S.open)return[S.how==="key"?"Aberta com a chave.":S.how==="force"?"Arrombada! Pode ter feito barulho ou danificado o conteúdo.":"Destrancada!","good"];
  if(S.broken)return["A fechadura quebrou: só dá para arrombar.","bad"];
  if(!o)return["A fechadura está livre.",""];
  return[(me?"Você está":nick(o.p)+" está")+" na fechadura.",""];
}

/* mostrar a fechadura na tela do Owlbear: por padrão aparece para todos (o mestre ativou, é para ser vista); cada um pode desligar */
export const fechWants=pref=>pref!=="0";
/* o que a cena desenha, igual no menu e na tela do Owlbear (o som só toca no menu de quem está na fechadura) */
export function sceneView(g,o,ls,S,sound){
  const c=o?o.c:null,src=c||ls,hint=!g.snd,mode=S.broken?"f":(c?c.md:"d");
  const okv=Array.from({length:g.n},(_,i)=>src.ok[i]?1:0);
  return{n:g.n,ok:g.on?okv:okv.map(()=>0),
    vals:Array.from({length:g.n},(_,i)=>g.on&&(src.ok[i]||c)?(src.v[i]||(c?1:0)):0),
    tint:Array.from({length:g.n},(_,i)=>g.on&&c&&hint&&!src.ok[i]&&src.fb[i]&&src.lv[i]===src.v[i]?src.fb[i]:0),
    fb:src.fb,at:g.on?src.at:0,pick:g.on&&c&&mode==="d"&&!S.open&&!S.broken?"in":"out",
    open:g.on&&S.open,how:S.how,broken:g.on&&S.broken,cracks:g.on&&S.cracks,hint,sound:!!sound};
}
/* bolsa do mestre: fechaduras salvas para usar de novo (ficam só neste navegador) */
export function bagItem(g){
  return{name:(g.name||kindName(g.kind)).slice(0,30),kind:g.kind,n:g.n,faces:g.faces,pa:g.pa,dt:g.dt,max:g.max,snd:g.snd,s:g.s.slice(),items:g.items.slice(),at:Date.now()};
}
export function bagLoad(raw){
  try{const a=JSON.parse(raw||"[]");return(Array.isArray(a)?a:[]).slice(0,40).map(x=>{const f=normF(x);return{...bagItem(f),at:num(x&&x.at,0)}})}catch(e){return[]}
}
