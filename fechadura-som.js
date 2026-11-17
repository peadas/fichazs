/* Sons da fechadura, sintetizados na hora (sem arquivo de áudio, nada para baixar).
   alto = número ALTO demais: "tic" agudo e seco de metal   ·   baixo = número BAIXO demais: "toc" grave e abafado de metal
   click = pino certo (o tambor encaixa: clic-clac)   ·   open = chave girando e trava deslizando   ·   broke = metal estalando
   O navegador só libera o som depois de um clique do jogador: o botão "Tentar abrir" chama unlock(). */
let ctx=null;
const C0=typeof window!=="undefined"&&(window.AudioContext||window.webkitAudioContext);
function ac(){
  if(!C0)return null;
  if(!ctx){try{ctx=new C0()}catch(e){return null}}
  if(ctx.state==="suspended")ctx.resume().catch(()=>{});
  return ctx;
}
export const soundOn=()=>{try{return localStorage.getItem("fech-snd")!=="0"}catch(e){return true}};
const out=(c,peak,a,d,t)=>{const g=c.createGain();g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(0.0002,peak),t+a);g.gain.exponentialRampToValueAtTime(0.0001,t+a+d);g.connect(c.destination);return g};
function noise(c,dur){
  const n=Math.max(1,Math.floor(c.sampleRate*dur)),b=c.createBuffer(1,n,c.sampleRate),d=b.getChannelData(0);
  for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*(1-i/n);
  const s=c.createBufferSource();s.buffer=b;return s;
}
function burst(c,t,freq,q,dur,peak,type){
  const s=noise(c,dur),f=c.createBiquadFilter();f.type=type||"bandpass";f.frequency.value=freq;f.Q.value=q;
  s.connect(f);f.connect(out(c,peak,0.002,dur,t));s.start(t);s.stop(t+dur+0.02);
}
function tone(c,t,type,f0,f1,dur,peak,lp){
  const o=c.createOscillator();o.type=type;o.frequency.setValueAtTime(f0,t);if(f1&&f1!==f0)o.frequency.exponentialRampToValueAtTime(f1,t+dur);
  let n=o;if(lp){const f=c.createBiquadFilter();f.type="lowpass";f.frequency.value=lp;o.connect(f);n=f}
  n.connect(out(c,peak,0.004,dur,t));o.start(t);o.stop(t+dur+0.05);
}
/* v2.16.3: alto/baixo agora usam o áudio real da gazua (tic-alto.mp3 mais agudo, toc-baixo.mp3 mais grave).
   Se o arquivo não carregar, cai no som sintetizado de antes. */
const SAMP={alto:{f:"tic-alto.mp3",g:0.8},baixo:{f:"toc-baixo.mp3",g:0.9}};
function loadSamples(c){
  Object.keys(SAMP).forEach(k=>{
    const x=SAMP[k];if(x.b||x.l)return;x.l=1;
    fetch(new URL(x.f,import.meta.url).href+"?v=2.16.3").then(r=>r.ok?r.arrayBuffer():Promise.reject()).then(a=>new Promise((ok,no)=>c.decodeAudioData(a,ok,no))).then(b=>{x.b=b}).catch(()=>{x.l=0});
  });
}
function sample(k){
  const x=SAMP[k],c=ac();if(!c||!x)return false;
  loadSamples(c);if(!x.b)return false;
  try{const s=c.createBufferSource(),g=c.createGain();s.buffer=x.b;g.gain.value=x.g;s.connect(g);g.connect(c.destination);s.start();return true}catch(e){return false}
}
const play=fn=>{if(!soundOn())return;const c=ac();if(!c)return;try{fn(c,c.currentTime+0.01)}catch(e){}};
/* metal de verdade: vários tons "desafinados" entre si (como uma barra de aço) que somem rápido */
const metal=(c,t,f,parts,dur,peak)=>parts.forEach(([r,g,d])=>tone(c,t,"sine",f*r,f*r,dur*d,peak*g));
const TIC=[[1,1,1],[2.76,.55,.6],[5.4,.3,.35],[8.9,.15,.2]];
const TOC=[[1,1,1],[2.32,.6,.7],[4.1,.3,.45]];
export const sfx={
  unlock:()=>{const c=ac();if(c)loadSamples(c)},
  /* número ALTO: "tic" agudo, seco, de pino de aço */
  alto:()=>{if(soundOn()&&sample("alto"))return;play((c,t)=>{metal(c,t,2350,TIC,0.17,0.2);burst(c,t,6500,1.5,0.012,0.32,"highpass")})},
  /* número BAIXO: "toc" grave e abafado, de peça pesada de latão */
  baixo:()=>{if(soundOn()&&sample("baixo"))return;play((c,t)=>{metal(c,t,520,TOC,0.24,0.34);tone(c,t,"sine",170,95,0.1,0.34);burst(c,t,800,1,0.03,0.3)})},
  /* pino certo: o tambor encaixa (clic-clac) */
  click:()=>play((c,t)=>{burst(c,t,3300,3,0.02,0.4);metal(c,t,1450,TIC,0.08,0.2);tone(c,t+0.055,"sine",240,150,0.07,0.32);burst(c,t+0.055,1800,2,0.025,0.3);metal(c,t+0.06,1900,TIC,0.1,0.14)}),
  /* abriu: chave girando (catraca) e a trava deslizando com um baque */
  open:()=>play((c,t)=>{[0,0.07,0.14,0.21].forEach((d,i)=>{burst(c,t+d,2600+i*250,4,0.02,0.3);metal(c,t+d,1700+i*150,TIC,0.06,0.1)});tone(c,t+0.3,"sine",120,55,0.3,0.5);burst(c,t+0.3,650,0.8,0.22,0.16);metal(c,t+0.32,880,TOC,0.32,0.14);burst(c,t+0.6,3000,4,0.03,0.2)}),
  /* quebrou: metal estalando */
  broke:()=>play((c,t)=>{burst(c,t,3800,1,0.1,0.5,"highpass");burst(c,t,450,0.5,0.45,0.5,"lowpass");tone(c,t,"square",150,40,0.35,0.22,600);metal(c,t+0.02,1240,TIC,0.3,0.14);[0.1,0.2,0.33].forEach((d,i)=>metal(c,t+d,2100+i*700,TIC,0.12,0.1))})
};
