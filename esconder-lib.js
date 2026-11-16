/* Esconder: peças compartilhadas (menu, camada na tela e segundo plano).
   Estado vai nos metadados do Owlbear: o mestre em K_G (painel, status, números chamados) e cada jogador em K_P (dados de esconderijo).
   Os valores dos dados ficam no metadado do jogador; o cliente do mestre só mostra o número quando ele foi chamado. */
export const K_P="ordem.esc/p", K_G="ordem.esc/g";
export const FACES=[4,6,8,10,12,20], MAXD=8;
export const MSG_ROLL="ordem.hud/quickroll";       // mesmo canal da rolagem rápida
export const MSG_NOTE="ordem.esc/note";             // aviso de ação (distrair, chamar atenção)
const num=(v,d)=>{const n=parseInt(v,10);return Number.isFinite(n)?n:d};
const lsg=k=>{try{return localStorage.getItem(k)}catch(e){return null}};
export const escLocal=()=>lsg("esc-on")==="1";

export function normP(m){
  const o=m&&typeof m==="object"?m:{};
  const dice=(Array.isArray(o.dice)?o.dice:[]).map(x=>x&&{f:FACES.includes(num(x.f,0))?num(x.f,0):6,v:Math.max(1,num(x.v,1)),n:String(x.n||"").slice(0,24),id:String(x.id||"").slice(0,12)}).filter(Boolean).slice(0,MAXD);
  return{dice,h:o.h?1:0,sk:String(o.sk||"").slice(0,24),note:o.note&&typeof o.note==="object"?{k:String(o.note.k||"").slice(0,12),t:num(o.note.t,0)}:null};
}
export function normG(m){
  const o=m&&typeof m==="object"?m:{};
  const calls=(Array.isArray(o.calls)?o.calls:[]).map(n=>num(n,0)).filter(n=>n>0&&n<=99).slice(0,12);
  return{on:!!o.on,st:String(o.st||"Caçando").slice(0,40),calls,ct:num(o.ct,0),ap:o.ap!==false,msg:String(o.msg||"").slice(0,120)};
}
/* tamanho do dado de esconderijo e o atributo-base, lidos da ficha deste navegador */
export const SKILLS=[["Furtividade","fis"],["Acrobacia","fis"],["Crime","fis"],["Atletismo","fis"],["Disciplina","emo"],["Enganação","emo"],["Sobrevivência","men"],["Inspecionar","men"]];
export const ATTR={fis:"Físico",men:"Mente",emo:"Emoção"};
export function sheet(){try{return JSON.parse(lsg("ficha-ordem")||"{}")||{}}catch(e){return{}}}
export function skillDice(sk){
  const d=sheet(),a=SKILLS.find(x=>x[0]===sk),at=d["at-"+sk]||(a?a[1]:"fis");
  const fa=num(d["a-"+at],6),fs=num(d["s-"+sk],4);
  return[{f:fs,n:sk},{f:fa,n:ATTR[at]||"Atributo"}].map(x=>({...x,f:FACES.includes(x.f)?x.f:(x.f>=20?20:x.f>=12?12:x.f>=10?10:x.f>=8?8:x.f>=6?6:4)}));
}
export const WAYS=[
  ["Atrás de um móvel","Furtividade"],["No escuro, sem se mexer","Furtividade"],["Sob algo ou dentro de algo","Furtividade"],
  ["Prendendo a respiração","Disciplina"],["Escalando para o alto","Atletismo"],["Fingindo ser outra coisa","Enganação"]
];
/* eventos da Fase das Criaturas (1d10 rolado pelo jogador; resultados altos são melhores) */
export const EVENTS=[
  [1,"O mestre diz dois números à escolha. Quem tem esses dados de esconderijo os descarta.",null],
  [2,"Sopro na nuca: o alvo fica parado (perde 2d6 PD) ou sai de perto (perde um dado de esconderijo).",null],
  [3,"As criaturas procuram todos os personagens.",[1,10]],
  [4,"As criaturas procuram todos os personagens.",[2,8]],
  [5,"As criaturas procuram todos os personagens.",[3,6]],
  [6,"As criaturas procuram todos os personagens.",[1,8]],
  [7,"As criaturas procuram todos os personagens.",[2,6]],
  [8,"Uma criatura salta num personagem: rola 1d12, 2d10 ou 3d8 conforme o maior dado de esconderijo dele (d12 / d10 / d8 ou menos).",[1,12]],
  [9,"Uma criatura procura um personagem: rola 1d10, 2d8 ou 3d6 conforme o maior dado dele.",[1,10]],
  [10,"As criaturas param um momento: não procuram nesta fase.",null]
];
const S='fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"';
export const ICON={
  hide:`<svg viewBox="0 0 24 24" ${S}><path d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12z" opacity=".6"/><circle cx="12" cy="12" r="3.2" opacity=".6"/><path d="M3 3l18 18"/></svg>`,
  distract:`<svg viewBox="0 0 24 24" ${S}><path d="M4 10v4h3l5 4V6L7 10z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/></svg>`,
  loud:`<svg viewBox="0 0 24 24" ${S}><path d="M12 3v11"/><circle cx="12" cy="19" r="1.4"/><path d="M5 6 3 4M19 6l2-2M4 12H2M22 12h-2"/></svg>`,
  plus:`<svg viewBox="0 0 24 24" ${S}><path d="M12 5v14M5 12h14"/></svg>`
};
