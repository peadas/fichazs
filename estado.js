/* Estado do MESTRE (Esconder, Escalada, Balança) guardado nos metadados da SALA, não nos do jogador-mestre.
   Por quê: os metadados de um jogador somem quando ele recarrega a página (F5) ou a internet dele cai, e o do mestre ainda
   carrega ficha, foto e NPCs (perto do limite de tamanho do Owlbear). Resultado antigo: o painel/janela sumia ou nem chegava
   nos jogadores até todo mundo dar F5. Na sala o estado fica de pé, é pequeno, e quem entra/recarrega recebe na hora.
   Se a sala não aceitar a gravação (API ausente ou sem permissão), cai no jeito antigo (metadados do jogador). */
const KEYS=["ordem.esc/g","ordem.cl/g","ordem.bal/g","ordem.fech/g"];

export function makeState(OBR){
  const ok=!!(OBR&&OBR.room&&typeof OBR.room.getMetadata==="function"&&typeof OBR.room.setMetadata==="function");
  let cache={};const subs=new Set();
  const fire=()=>subs.forEach(f=>{try{f(cache)}catch(e){console.warn("[estado]",e)}});
  const pick=m=>{const o={};if(m&&typeof m==="object")for(const k of KEYS)if(m[k]&&typeof m[k]==="object")o[k]=m[k];return o};
  const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
  async function load(){
    if(!ok)return cache;
    try{const n=pick(await OBR.room.getMetadata());if(!same(n,cache)){cache=n;fire()}}
    catch(e){console.warn("[estado] não consegui ler a sala",e)}
    return cache;
  }
  if(ok){try{OBR.room.onMetadataChange(m=>{const n=pick(m);if(!same(n,cache)){cache=n;fire()}})}catch(e){console.warn("[estado] sem eventos da sala",e)}}
  return{
    ok,subs,load,
    get:k=>cache[k],                         // valor da sala (undefined se a sala não tem)
    /* grava na sala. Devolve true se gravou; false se quem chamou deve gravar no jogador (jeito antigo) */
    async set(k,v){
      if(!ok||!KEYS.includes(k))return false;
      try{await OBR.room.setMetadata({[k]:v});cache={...cache,[k]:v};fire();return true}
      catch(e){console.warn("[estado] a sala não aceitou a gravação",e);return false}
    }
  };
}

/* o valor vigente de uma chave do mestre: o da sala se existir; senão o dos metadados do mestre (formato antigo) */
export function pickGm(ST,gm,k){
  const v=ST&&ST.get(k);
  return v!==undefined?v:(gm&&gm.metadata&&gm.metadata[k]);
}
