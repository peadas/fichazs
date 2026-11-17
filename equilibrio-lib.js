/* Equilíbrio > Equilibrar: regras e peças compartilhadas (menu, camada da tela e segundo plano).
   Estado nos metadados do Owlbear: o mestre em K_B (a balança: ligada, nome, rodadas da travessia) e cada jogador em K_BP
   (se subiu, os dois d10, os dados de equilíbrio gastos, o diário...). Só UM jogador fica na balança por vez: vale quem subiu primeiro (campo t).
   O mestre expulsa por mensagem (ordem.bal/kick).
   v2.15.1: sem janela própria. A cena é desenhada no menu (aba) e na camada dos dados; o resultado dos dados é aplicado pelo segundo plano. */
import {sheet} from "./esconder-lib.js?v=2.15.1";
export const K_B="ordem.bal/g", K_BP="ordem.bal/p";
const num=(v,d)=>{const n=parseInt(v,10);return Number.isFinite(n)?n:d};
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export const ST=["idle","fall","done","fell"];       // pronto para rolar · caindo (pode gastar dado) · atravessou · caiu
const LOGMAX=5;

export function normB(m){
  const o=m&&typeof m==="object"?m:{};
  return{id:num(o.id,0),on:!!o.on,rounds:clamp(num(o.rounds,3),1,30),name:String(o.name||"").slice(0,30)};
}
export function normBP(m){
  const o=m&&typeof m==="object"?m:{},k=o.sk&&typeof o.sk==="object"?o.sk:null;
  return{id:num(o.id,0),in:o.in?1:0,t:Math.max(0,num(o.t,0)),rd:Math.max(0,num(o.rd,0)),st:ST.includes(o.st)?o.st:"idle",
    a:clamp(num(o.a,0),0,99),b:clamp(num(o.b,0),0,99),n:clamp(num(o.n,2),0,20),sp:clamp(num(o.sp,0),0,20),pend:clamp(num(o.pend,0),0,4),
    sk:k?{n:String(k.n||"").slice(0,24),a:num(k.a,0),b:num(k.b,0),t:num(k.t,0)}:null,
    lg:Array.isArray(o.lg)?o.lg.slice(-LOGMAX).map(s=>String(s).slice(0,70)):[]};
}

/* equilibrou: os dois d10 iguais ou com 1 ponto de diferença */
export const balOK=(a,b)=>Math.abs(a-b)<=1;
/* dados de equilíbrio = metade do dado de Acrobacia (d4→2, d6→3, d8→4...), sempre d4 */
export function acroFace(){const f=num(sheet()["s-Acrobacia"],4);return f>=4?f:4}
export const diceCount=()=>Math.max(1,Math.floor(acroFace()/2));

/* quem está na balança: entre os jogadores (sem o mestre) que subiram nesta balança, o que subiu primeiro */
export function occupant(g,players){
  if(!g||!g.on||!g.id)return null;
  const l=(players||[]).filter(p=>p&&p.role!=="GM").map(p=>({p,c:normBP(p.metadata&&p.metadata[K_BP])})).filter(x=>x.c.in&&x.c.id===g.id);
  l.sort((x,y)=>x.c.t-y.c.t||String(x.p.id).localeCompare(String(y.p.id)));
  return l[0]||null;
}

/* ---- transições (puras, testáveis). Cada uma devolve só o que muda; "lg" é o diário (últimas 5 linhas) ---- */
const addLog=(c,t)=>[...(c.lg||[]),t].slice(-LOGMAX);
const won=(c,a,b,rounds,t)=>{const rd=c.rd+1,fim=rd>=rounds;return{a,b,rd,st:fim?"done":"idle",pend:0,lg:addLog(c,t+(fim?" · atravessou!":" · equilibrou"))}};
const lost=(c,a,b,t)=>{const semDado=c.n-c.sp<=0;return{a,b,st:semDado?"fell":"fall",pend:0,lg:addLog(c,t+(semDado?" · sem dados: caiu":" · caindo!"))}};
/* acabou de rolar os 2d10 */
export function afterTest(c,a,b,rounds){
  const t="Rodada "+(c.rd+1)+": "+a+" e "+b;
  return balOK(a,b)?won(c,a,b,rounds,t):lost(c,a,b,t);
}
/* rolou um dado de equilíbrio: gasta o dado e espera o jogador escolher em qual d10 somar */
export const afterSpend=(c,v)=>{const p=clamp(v,1,4);return{sp:Math.min(c.n,c.sp+1),pend:p,lg:addLog(c,"Dado de equilíbrio: +"+p)}};
/* somou o dado de equilíbrio (lado "a" ou "b") */
export function afterAdd(c,side,rounds){
  if(!c.pend)return{};
  const a=c.a+(side==="a"?c.pend:0),b=c.b+(side==="b"?c.pend:0),t="+"+c.pend+" no "+(side==="a"?c.a:c.b)+" → "+a+" e "+b;
  return balOK(a,b)?won(c,a,b,rounds,t):lost(c,a,b,t);
}
export const afterFall=c=>({st:"fell",pend:0,lg:addLog(c,"Deixou cair")});
export const RESET={st:"idle",a:0,b:0,rd:0,sp:0,pend:0,lg:[]};

/* a balança aparece na tela do Owlbear? pref: "1" ligado, "0" desligado, vazio = automático (mestre e quem está nela veem) */
export const balWants=(pref,isGm,isOcc)=>pref==="1"?true:pref==="0"?false:(!!isGm||!!isOcc);

/* frase de situação (a mesma no menu e na tela). o = {p,c} de occupant(); me = true se quem lê é o ocupante */
export function statusText(g,o,me,nick){
  if(!g.on)return["Nenhuma balança ativa.",""];
  if(!o)return["A balança está livre.",""];
  const c=o.c,who=me?"Você":nick(o.p),diff=Math.abs(c.a-c.b),left=c.n-c.sp;
  if(c.st==="done")return[me?"Você atravessou!":nick(o.p)+" atravessou!","good"];
  if(c.st==="fell")return[me?"Você caiu! Tomara que saiba nadar…":nick(o.p)+" caiu!","bad"];
  if(c.pend)return[me?"Dado de equilíbrio: +"+c.pend+". Escolha em qual dado somar.":nick(o.p)+" rolou +"+c.pend+" e escolhe onde somar.",""];
  if(c.st==="fall")return[who+" "+(me?"está":"está")+" caindo! "+c.a+" e "+c.b+" (diferença "+diff+"). "+(left>0?(me?"Gaste um dado de equilíbrio ou deixe cair.":"Pode gastar um dado de equilíbrio."):"Sem dados de equilíbrio."),"bad"];
  if(c.a||c.b)return[who+" equilibrou! "+c.a+" e "+c.b+(me&&c.st==="idle"?" Role a próxima rodada.":""),"good"];
  return[me?"Role 2d10: iguais ou com 1 de diferença equilibram.":nick(o.p)+" está na balança.",""];
}
