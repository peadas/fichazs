/* Carrega o SDK oficial do Owlbear Rodeo direto de uma CDN (sem precisar de npm).
   v2.14.4: antes, se as CDNs falhassem UMA vez (internet instável na hora que o jogador entra), a página ficava morta até dar F5.
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
/* v2.14.4: se o Owlbear recusar uma gravação por TAMANHO (ficha+foto+jogo passando do limite), o jogo não pode simplesmente falhar:
   tira as peças pesadas (ficha completa e foto, que só servem para o mestre/cartão), tenta de novo e avisa o publicador para não reenviar por uns minutos. */
const SIZE_ERR=/large|size|limit|exceed|too big|byte|payload|413/i;
function guard(O){
  try{
    if(!O||!O.player||O.player.__guarded)return O;
    const orig=O.player.setMetadata.bind(O.player);
    O.player.setMetadata=async u=>{
      try{return await orig(u)}
      catch(e){
        const heavy=u&&("ordem.mesa/z" in u||"ordem.mesa/img" in u);
        if(heavy||!SIZE_ERR.test(String(e&&e.message||e)))throw e;
        try{localStorage.setItem("shed",String(Date.now()))}catch(_){}
        console.warn("[ficha] metadados cheios: aliviando ficha completa/foto para o jogo funcionar");
        return await orig({...u,"ordem.mesa/z":undefined,"ordem.mesa/img":undefined});
      }
    };
    O.player.__guarded=true;
  }catch(e){}
  return O;
}
export async function loadOBR(opts){
  if(cached)return cached;
  const rounds=(opts&&opts.rounds)||5;
  for(let r=0;r<rounds;r++){
    for(const u of URLS){
      try{const O=pick(await timeout(import(r?u+"#r"+r:u),9000));if(O)return cached=guard(O)}
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
