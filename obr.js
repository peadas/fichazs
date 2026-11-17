/* Carrega o SDK oficial do Owlbear Rodeo direto de uma CDN (sem precisar de npm).
   v2.14.0: antes, se as CDNs falhassem UMA vez (internet instável na hora que o jogador entra), a página ficava morta até dar F5.
   Agora cada tentativa tem limite de tempo, repete em várias rodadas e muda o endereço (#rN) para o navegador não reaproveitar a falha. */
const URLS=[
  "https://cdn.jsdelivr.net/npm/@owlbear-rodeo/sdk@3.1.0/+esm",
  "https://esm.sh/@owlbear-rodeo/sdk@3.1.0",
  "https://esm.run/@owlbear-rodeo/sdk@3.1.0"
];
const pick=m=>{for(const c of [m&&m.default,m&&m.default&&m.default.default,m&&m.OBR,m])if(c&&typeof c.onReady==="function")return c;return null};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const timeout=(p,ms)=>Promise.race([p,new Promise((_,no)=>setTimeout(()=>no(new Error("tempo esgotado")),ms))]);
let cached=null;
export async function loadOBR(opts){
  if(cached)return cached;
  const rounds=(opts&&opts.rounds)||5;
  for(let r=0;r<rounds;r++){
    for(const u of URLS){
      try{const O=pick(await timeout(import(r?u+"#r"+r:u),9000));if(O)return cached=O}
      catch(e){console.warn("[ficha] SDK do Owlbear não carregou de",u,"(rodada "+(r+1)+")",e&&e.message||e)}
    }
    await sleep(600*(r+1));
  }
  return null;
}
/* true quando a página está mesmo dentro do Owlbear e o SDK já conversa com ele */
export function ready(OBR){
  return new Promise(res=>{
    if(!OBR||!OBR.isAvailable){res(false);return}
    if(OBR.isReady){res(true);return}
    OBR.onReady(()=>res(true));
  });
}
