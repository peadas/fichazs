/* Sons da fechadura, sintetizados na hora (sem arquivo de áudio, nada para baixar).
   trunk = número ALTO demais (meio agudo, seco)   ·   trink = número BAIXO demais (tilintar de metal)   ·   click = pino certo
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
const play=fn=>{if(!soundOn())return;const c=ac();if(!c)return;try{fn(c,c.currentTime+0.01)}catch(e){}};
export const sfx={
  unlock:()=>{ac()},
  /* "trunk": número alto. Pancada curta e seca, meio aguda */
  trunk:()=>play((c,t)=>{tone(c,t,"square",470,250,0.13,0.2,1500);burst(c,t,950,1.2,0.05,0.35)}),
  /* "trink": número baixo. Tilintar agudo de metal */
  trink:()=>play((c,t)=>{tone(c,t,"sine",2150,2150,0.24,0.2);tone(c,t,"sine",3220,3220,0.16,0.1);burst(c,t,5200,2,0.02,0.2,"highpass")}),
  /* "click": pino certo, o pino sobe */
  click:()=>play((c,t)=>{burst(c,t,2600,3,0.03,0.4);tone(c,t,"sine",190,110,0.09,0.3);tone(c,t+0.05,"triangle",900,1500,0.07,0.08)}),
  /* fechadura abriu */
  open:()=>play((c,t)=>{tone(c,t,"sine",95,55,0.28,0.45);burst(c,t+0.04,700,0.8,0.3,0.12);burst(c,t+0.3,2200,4,0.04,0.25)}),
  /* fechadura quebrou */
  broke:()=>play((c,t)=>{burst(c,t,500,0.5,0.5,0.5,"lowpass");tone(c,t,"square",150,40,0.35,0.25,600);[0.08,0.19,0.31].forEach((d,i)=>tone(c,t+d,"sine",1500+i*650,1500+i*650,0.12,0.08))})
};
