/* Canal LOCAL entre as páginas da extensão (janela da escalada/balança, menu, segundo plano).
   v2.15.0: antes tudo dependia de OBR.broadcast com destination:"LOCAL". Se o Owlbear atrasasse ou perdesse essa mensagem,
   a janela não mexia, não fechava e o segundo plano achava que ela tinha morrido. Agora cada aviso sai por TRÊS caminhos:
   BroadcastChannel e evento do localStorage (diretos entre as páginas, sem passar pelo Owlbear) e o LOCAL do Owlbear.
   Quem recebe ignora a cópia repetida (mesmo id). */
const NAME="ordem.local",LSK="ordem.evt";
export function localChannel(getOBR){
  const subs=new Map(),seen=[];let cid="";
  const getCid=()=>{try{const O=getOBR&&getOBR();if(O&&O.player&&O.player.getConnectionId)O.player.getConnectionId().then(v=>{cid=String(v||"")}).catch(()=>{})}catch(e){}};
  let bc=null;try{bc=new BroadcastChannel(NAME)}catch(e){}
  const fresh=id=>{if(!id)return true;if(seen.includes(id))return false;seen.push(id);if(seen.length>120)seen.shift();return true};
  const deliver=(n,d,id,c)=>{if(c&&cid&&c!==cid)return;          // aviso de OUTRA aba do mesmo navegador: ignora
    if(!fresh(id))return;(subs.get(n)||[]).slice().forEach(f=>{try{f(d)}catch(e){console.warn("[canal]",e)}})};
  if(bc)bc.onmessage=e=>{const m=e&&e.data;if(m&&m.n)deliver(m.n,m.d,m.id,m.c)};
  try{addEventListener("storage",e=>{if(e.key!==LSK||!e.newValue)return;try{const m=JSON.parse(e.newValue);if(m&&m.n)deliver(m.n,m.d,m.id,m.c)}catch(_){}})}catch(e){}
  let hooked=false;
  const hook=()=>{                       // liga o caminho do Owlbear quando o SDK já carregou
    const O=getOBR&&getOBR();if(!O||!O.broadcast)return false;
    for(const n of subs.keys())if(!hooked_names.has(n)){hooked_names.add(n);try{O.broadcast.onMessage(n,ev=>{const d=ev&&ev.data;deliver(n,d&&d.__d,d&&d.__id,d&&d.__c)})}catch(e){}}
    return true;
  };
  const hooked_names=new Set();
  setInterval(()=>{if(!cid)getCid();hook()},1500);
  return{
    send(n,d){
      const id=Math.random().toString(36).slice(2)+Date.now().toString(36);
      try{bc&&bc.postMessage({n,d,id,c:cid})}catch(e){}
      try{localStorage.setItem(LSK,JSON.stringify({n,d,id,c:cid}))}catch(e){}
      try{const O=getOBR&&getOBR();O&&O.broadcast.sendMessage(n,{__d:d,__id:id,__c:cid},{destination:"LOCAL"}).catch(()=>{})}catch(e){}
    },
    on(n,cb){const a=subs.get(n)||[];subs.set(n,a);a.push(cb);hook();return()=>{const i=a.indexOf(cb);if(i>=0)a.splice(i,1)}}
  };
}
