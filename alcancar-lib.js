/* Equilíbrio > Alcançar: peças compartilhadas (menu, janela da escalada e segundo plano).
   Estado nos metadados do Owlbear: o mestre em K_C (a escalada: DT, altura, se a altura está revelada),
   cada jogador em K_CP (se entrou, quanto já subiu, último teste). O mestre derruba um jogador por mensagem (ordem.cl/drop). */
import {sheet,ATTR} from "./esconder-lib.js?v=2.15.1";
export const K_C="ordem.cl/g", K_CP="ordem.cl/p";
export const RISK_DT=3;                         // modo arriscado: DT +3
export const FACES=[4,6,8,10,12,14,16,18,20];
const num=(v,d)=>{const n=parseInt(v,10);return Number.isFinite(n)?n:d};
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));

export function normC(m){
  const o=m&&typeof m==="object"?m:{};
  return{id:num(o.id,0),on:!!o.on,dt:clamp(num(o.dt,10),1,60),total:clamp(num(o.total,20),1,500),rev:!!o.rev,name:String(o.name||"").slice(0,30)};
}
export function normCP(m){
  const o=m&&typeof m==="object"?m:{},l=o.last&&typeof o.last==="object"?o.last:null;
  return{id:num(o.id,0),in:o.in?1:0,p:Math.max(0,num(o.p,0)),top:o.top?1:0,fell:o.fell?1:0,
    last:l?{sk:String(l.sk||"").slice(0,24),a:num(l.a,0),b:num(l.b,0),s:num(l.s,0),dt:num(l.dt,0),ok:l.ok?1:0,amt:num(l.amt,0),m:l.m==="r"?"r":"s",t:num(l.t,0)}:null};
}

/* perícias da ficha (nome, atributo-base padrão) */
export const SK=[["Acrobacia","fis"],["Animais","emo"],["Aptidão","men"],["Atletismo","fis"],["Bruxaria","men"],["Crime","fis"],["Disciplina","emo"],["Enganação","emo"],["Furtividade","fis"],["Inspecionar","men"],["Intimidar","emo"],["Intuição","emo"],["Luta","fis"],["Medicina","men"],["Percepção","men"],["Persuasão","emo"],["Pontaria","fis"],["Sobrevivência","men"],["Vigor","fis"]];
export const MAIN=["Atletismo","Acrobacia"];     // atalhos da janela
const near=f=>FACES.includes(f)?f:FACES.reduce((a,b)=>Math.abs(b-f)<Math.abs(a-f)?b:a,4);
/* os dois dados do teste (perícia + atributo), lidos da ficha deste navegador */
export function testDice(sk){
  const d=sheet(),a=SK.find(x=>x[0]===sk),at=d["at-"+sk]||(a?a[1]:"fis");
  return[{f:near(num(d["s-"+sk],4)),n:sk},{f:near(num(d["a-"+at],6)),n:ATTR[at]||"Atributo"}];
}

const S='fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"';
export const ICON={
  scale:`<svg viewBox="0 0 24 24" ${S}><path d="M12 3.5V20M7.5 20.5h9M4 7.5h16"/><path d="M4 7.5 1.8 13.2a2.7 2.7 0 0 0 4.4 0zM20 7.5l-2.2 5.7a2.7 2.7 0 0 0 4.4 0z"/><circle cx="12" cy="2.6" r=".9"/></svg>`,
  reach:`<svg viewBox="0 0 24 24" ${S}><path d="M2 21 9.5 7.5 13.5 14l3-4.5L22 21z"/><path d="M9.5 7.5V2.5l4 1.8-4 1.7"/></svg>`,
  safe:`<svg viewBox="0 0 24 24" ${S}><path d="M12 3 4.5 6v5.5c0 4.6 3.1 8.2 7.5 9.5 4.4-1.3 7.5-4.9 7.5-9.5V6z"/></svg>`,
  risk:`<svg viewBox="0 0 24 24" ${S}><path d="M13 2.5 4.5 13.5H11L10 21.5l8.5-11H12z"/></svg>`,
  fall:`<svg viewBox="0 0 24 24" ${S}><path d="M12 3v14M6 12l6 6 6-6"/></svg>`
};

/* ---- v2.15.1: sem janela própria. As regras abaixo são puras e usadas pelo menu, pela camada da tela e pelo segundo plano ---- */
/* quem está na parede: jogadores (sem o mestre) que entraram NESTA escalada. players = [{id,role,metadata}] */
export function climbersOf(g,players){
  if(!g||!g.on||!g.id)return[];
  return(players||[]).filter(p=>p&&p.role!=="GM").map(p=>({p,c:normCP(p.metadata&&p.metadata[K_CP])})).filter(x=>x.c.in&&x.c.id===g.id);
}
/* a parede aparece na tela do Owlbear? pref: "1" ligado, "0" desligado, vazio = automático (mestre e quem está nela veem) */
export const clWants=(pref,isGm,inClimb)=>pref==="1"?true:pref==="0"?false:(!!isGm||!!inClimb);
/* resultado de um teste de escalada. R = o que foi pedido ({cid,mode,sk}); dice = [[face,valor],[face,valor]].
   Devolve só o que muda na subida do jogador (ou null se o resultado não vale mais: escalada acabou, já está no topo...). */
export function afterClimb(g,c,R,dice){
  if(!g||!g.on||!R||g.id!==R.cid||!c.in||c.id!==g.id||c.top||!Array.isArray(dice)||dice.length<2)return null;
  const a=+dice[0][1]||0,b=+dice[1][1]||0,s=a+b,md=R.mode==="r"?"r":"s",dt=g.dt+(md==="r"?RISK_DT:0);
  const ok=s>=dt,amt=md==="r"?Math.max(a,b):Math.min(a,b);
  const p=ok?Math.min(g.total,c.p+amt):c.p,top=p>=g.total?1:0;
  return{p,top,fell:0,last:{sk:String(R.sk||"").slice(0,24),a,b,s,dt,ok:ok?1:0,amt,m:md,t:Date.now()}};
}
