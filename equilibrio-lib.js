/* Equilíbrio > Equilibrar: regras e peças compartilhadas (menu, janela da balança e segundo plano).
   Estado nos metadados do Owlbear: o mestre em K_B (a balança: ligada, nome, rodadas da travessia) e cada jogador em K_BP
   (se subiu, os dois d10, os dados de equilíbrio gastos...). Só UM jogador fica na balança por vez: vale quem subiu primeiro (campo t).
   O mestre expulsa por mensagem (ordem.bal/kick). */
import {sheet} from "./esconder-lib.js?v=2.13.1";
export const K_B="ordem.bal/g", K_BP="ordem.bal/p";
const num=(v,d)=>{const n=parseInt(v,10);return Number.isFinite(n)?n:d};
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export const ST=["idle","fall","done","fell"];       // pronto para rolar · caindo (pode gastar dado) · atravessou · caiu

export function normB(m){
  const o=m&&typeof m==="object"?m:{};
  return{id:num(o.id,0),on:!!o.on,rounds:clamp(num(o.rounds,3),1,30),name:String(o.name||"").slice(0,30)};
}
export function normBP(m){
  const o=m&&typeof m==="object"?m:{},k=o.sk&&typeof o.sk==="object"?o.sk:null;
  return{id:num(o.id,0),in:o.in?1:0,t:Math.max(0,num(o.t,0)),rd:Math.max(0,num(o.rd,0)),st:ST.includes(o.st)?o.st:"idle",
    a:clamp(num(o.a,0),0,99),b:clamp(num(o.b,0),0,99),n:clamp(num(o.n,2),0,20),sp:clamp(num(o.sp,0),0,20),pend:clamp(num(o.pend,0),0,4),
    sk:k?{n:String(k.n||"").slice(0,24),a:num(k.a,0),b:num(k.b,0),t:num(k.t,0)}:null};
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

/* ---- transições (puras, testáveis) ---- */
const won=(c,a,b,rounds)=>{const rd=c.rd+1;return{a,b,rd,st:rd>=rounds?"done":"idle",pend:0}};
/* acabou de rolar os 2d10 */
export function afterTest(c,a,b,rounds){
  if(balOK(a,b))return won(c,a,b,rounds);
  return{a,b,st:c.n-c.sp<=0?"fell":"fall",pend:0};
}
/* rolou um dado de equilíbrio: gasta o dado e espera o jogador escolher em qual d10 somar */
export const afterSpend=(c,v)=>({sp:Math.min(c.n,c.sp+1),pend:clamp(v,1,4)});
/* somou o dado de equilíbrio (lado "a" ou "b") */
export function afterAdd(c,side,rounds){
  if(!c.pend)return{};
  const a=c.a+(side==="a"?c.pend:0),b=c.b+(side==="b"?c.pend:0);
  if(balOK(a,b))return won(c,a,b,rounds);
  return{a,b,st:c.n-c.sp<=0?"fell":"fall",pend:0};
}
export const RESET={st:"idle",a:0,b:0,rd:0,sp:0,pend:0};
