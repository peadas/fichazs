/* A parede da escalada (fotos subindo), usada no menu (aba Equilíbrio > Alcançar) e na camada da tela do Owlbear.
   Não conversa com o Owlbear: só recebe o que desenhar (por isso nunca "trava conectando").
     const w = mountWall(elemento, {onDrop: id => ...});   // onDrop só no menu do mestre (botão Derrubar)
     w.update({g, list, isGm});   // g = escalada (normC); list = [{id,name,color,th,c}] (c = normCP); isGm = vê as alturas reais
     w.destroy();
   Só mexe no que mudou (nada é redesenhado à toa): é isso que evita o lag. */
const okImg=u=>typeof u==="string"&&/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(u)&&u.length<20000;
const okCor=c=>/^#[0-9a-f]{6}$/i.test(c||"")?c:"#e9ece7";
const CSS=`
.cwl{width:100%;color:#eef0ee;user-select:none;-webkit-user-select:none}
.cwl .rows{padding:4px 2px 6px;min-height:20px}
.cwl .pr{display:flex;align-items:center;gap:8px;font:700 1rem/1.25 "Barlow Condensed",sans-serif;letter-spacing:.05em;text-transform:uppercase}
.cwl .pr i{width:8px;height:8px;border-radius:50%;background:var(--c,#e9ece7);flex:none}
.cwl .pr span{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cwl .pr em{font-style:normal;color:#e9ece7;letter-spacing:.08em}
.cwl .pr.top em{color:#5fd38a}
.cwl .pr button{padding:0 6px;font:600 .7rem Barlow,sans-serif;height:18px;letter-spacing:.06em;text-transform:uppercase;color:#ff8f8c;background:transparent;border:1px solid #e0524f;cursor:pointer}
.cwl .none{color:#8f9a99;font-size:.88rem;padding:2px 0}
.cwl .wall{position:relative;height:250px;border:1px solid #1a2022;overflow:hidden;
  background:repeating-linear-gradient(0deg,#0000 0 27px,#05070799 27px 29px),repeating-linear-gradient(90deg,#0000 0 41px,#0507074d 41px 43px),linear-gradient(90deg,#161c1d,#202829 50%,#161c1d)}
.cwl .wall::before{content:"";position:absolute;left:0;right:0;top:0;height:22px;background:linear-gradient(180deg,#e9ece733,#0000);pointer-events:none}
.cwl .tp{position:absolute;left:0;right:0;top:0;height:0;border-top:2px dashed #e9ece7aa}
.cwl .tp small{position:absolute;right:6px;top:3px;font:700 .65rem "Barlow Condensed",sans-serif;letter-spacing:.16em;color:#e9ece7bb}
.cwl .lanes{position:absolute;inset:0;display:flex}
.cwl .lane{position:relative;flex:1 1 0;min-width:0;border-left:1px solid #0006}
.cwl .lane:first-child{border-left:0}
.cwl .lane::before{content:"";position:absolute;left:50%;top:0;bottom:0;width:2px;margin-left:-1px;background:linear-gradient(180deg,#0000,#c9b27a55 20%,#c9b27a55);opacity:.7}
.cwl .ph{position:absolute;left:50%;bottom:calc(6px + var(--f,0)*(100% - var(--s,48px) - 18px));width:var(--s,48px);height:var(--s,48px);margin-left:calc(var(--s,48px)/-2);border-radius:50%;border:3px solid var(--c,#e9ece7);background:#0e1213 center/cover no-repeat;display:grid;place-items:center;font:800 1.1rem Cinzel,serif;color:var(--c,#e9ece7);transition:bottom .9s cubic-bezier(.3,1.3,.5,1),transform .9s,opacity .9s;box-shadow:0 3px 10px #000a}
.cwl .ph b{position:absolute;bottom:-8px;right:-8px;min-width:20px;height:20px;padding:0 4px;display:grid;place-items:center;border-radius:10px;background:#0b0e0f;border:1px solid var(--c,#e9ece7);font:700 .72rem "Barlow Condensed",sans-serif;letter-spacing:.04em;color:#fff}
.cwl .lane.fall .ph{bottom:6px;transform:rotate(300deg) scale(.7);opacity:0;transition:bottom .75s cubic-bezier(.6,0,1,.6),transform .95s,opacity .95s}
.cwl .lane.fall{opacity:0;transition:opacity 1.1s}
.cwl .lane.win .ph{box-shadow:0 0 0 3px #5fd38a55,0 0 18px #5fd38a88}
.cwl .lg{padding:4px 2px 0;min-height:18px;font:600 .8rem "Barlow Condensed",sans-serif;letter-spacing:.06em;color:#a9b3b1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-transform:uppercase}
.cwl .lg.bad{color:#ff8f8c}.cwl .lg.good{color:#9be3b4}
`;
let cssDone=false;
function css(){
  if(cssDone)return;cssDone=true;
  const s=document.createElement("style");s.id="cwl-css";s.textContent=CSS;document.head.appendChild(s);
}
const E=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e};
/* quanto da altura a foto já subiu (0..1). Sem a altura revelada, a foto sobe em curva (nunca chega ao topo à toa). */
export function frac(g,c,full){
  if(c.top||c.p>=g.total)return 1;
  return full?Math.min(.98,c.p/g.total):Math.min(.86,1-Math.exp(-c.p/9));
}

export function mountWall(host,opts){
  css();
  const o=opts||{};
  host.classList.add("cwl");host.replaceChildren();
  const rows=E("div","rows"),wall=E("div","wall"),tp=E("div","tp"),lanesEl=E("div","lanes"),lg=E("div","lg");
  tp.append(E("small",null,"TOPO"));wall.append(tp,lanesEl);host.append(rows,wall,lg);
  const lanes=new Map();      // id do jogador -> {el, ph, b, ini, sig}
  let sigRows="",sigLog="",dead=false,timers=new Set();
  const later=(f,ms)=>{const t=setTimeout(()=>{timers.delete(t);f()},ms);timers.add(t)};

  function update(v){
    if(dead||!v||!v.g)return;
    const g=v.g,list=Array.isArray(v.list)?v.list:[],isGm=!!v.isGm;
    /* linhas do topo: NOME  0/?? */
    const rs=JSON.stringify([g.on,g.total,g.rev,isGm,list.map(x=>[x.id,x.name,x.color,x.c.p,x.c.top])]);
    if(rs!==sigRows){
      sigRows=rs;rows.replaceChildren();
      if(!g.on)rows.append(E("div","none","Nenhuma escalada ativa."));
      else if(!list.length)rows.append(E("div","none","Ninguém entrou ainda."));
      list.forEach(({id,name,color,c})=>{
        const full=isGm||g.rev||c.top,r=E("div","pr"+(c.top?" top":""));
        r.style.setProperty("--c",okCor(color));
        r.append(E("i"),E("span",null,name),E("em",null,c.top?"TOPO":Math.min(c.p,full?g.total:c.p)+"/"+(full?g.total:"??")));
        if(isGm&&o.onDrop){const b=E("button",null,"Derrubar");b.type="button";b.title="Faz "+name+" cair e sair da parede";b.onclick=()=>o.onDrop(String(id));r.append(b)}
        rows.append(r);
      });
    }
    /* parede: uma faixa por jogador, a foto sobe conforme o progresso */
    const want=new Set(list.map(x=>String(x.id))),W=wall.clientWidth||300;
    const s=Math.max(28,Math.min(58,Math.floor(W/Math.max(1,list.length))-10));
    for(const [id,l] of lanes)if(!want.has(id)){
      l.el.classList.add("fall");lanes.delete(id);later(()=>l.el.remove(),1200);
    }
    list.forEach(({id,name,color,th,c})=>{
      id=String(id);const full=isGm||g.rev||c.top;let l=lanes.get(id);
      if(!l){
        const e=E("div","lane"),ph=E("div","ph"),ini=E("span"),b=E("b");ph.append(ini,b);e.append(ph);lanesEl.append(e);
        l={el:e,ph,b,ini,sig:""};lanes.set(id,l);ph.style.setProperty("--f","0");
      }
      const sg=JSON.stringify([name,color,th&&1,s,c.p,c.top,full,g.total]);
      if(sg===l.sig)return;l.sig=sg;
      l.ph.style.setProperty("--c",okCor(color));l.ph.style.setProperty("--s",s+"px");
      l.ph.style.backgroundImage=okImg(th)?"url("+th+")":"none";
      l.ini.textContent=okImg(th)?"":String(name||"?").charAt(0).toUpperCase();
      l.b.textContent=c.p;
      l.el.classList.toggle("win",!!c.top);
      const f=frac(g,c,full);
      requestAnimationFrame(()=>{if(!dead)l.ph.style.setProperty("--f",String(f))});
    });
    /* último acontecimento */
    const ev=list.filter(x=>x.c.last).sort((a,b)=>b.c.last.t-a.c.last.t)[0],ls=JSON.stringify(ev?[ev.name,ev.c.last]:0);
    if(ls!==sigLog){
      sigLog=ls;lg.className="lg";lg.textContent="";
      if(ev){
        const L=ev.c.last;
        lg.textContent=ev.name+" · "+L.sk+" "+L.s+" (DT "+L.dt+") · "+(L.ok?"subiu "+L.amt:"falhou: "+L.amt+" de dano");
        lg.classList.add(L.ok?"good":"bad");
      }
    }
  }
  return{update,destroy(){dead=true;timers.forEach(clearTimeout);timers.clear();lanes.clear();host.replaceChildren();host.classList.remove("cwl")}};
}
