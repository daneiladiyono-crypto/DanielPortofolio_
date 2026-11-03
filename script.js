(()=>{
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
$('#yr').textContent=new Date().getFullYear();

// loader -> hero entrance
addEventListener('load',()=>setTimeout(()=>document.body.classList.add('ready'),reduce?0:700));

// typing effect
const words=['Suka langsung mencoba.','Belajar coding, design, dan editing.','Bikin website dari ide mentah.','Masih terus berkembang.'];
const el=$('#typed');let w=0,c=0,del=false;
(function type(){
  const t=words[w];
  el.textContent=t.slice(0,c);
  if(reduce){el.textContent=words[0];return}
  if(!del&&c===t.length){del=true;return setTimeout(type,1600)}
  if(del&&c===0){del=false;w=(w+1)%words.length}
  c+=del?-1:1;
  setTimeout(type,del?28:60);
})();

// nav
const nav=$('#nav'),bar=$('#progress'),mb=$('#menuBtn'),menu=$('#menu');
addEventListener('scroll',()=>{
  nav.classList.toggle('solid',scrollY>40);
  const h=document.documentElement;
  bar.style.width=(scrollY/(h.scrollHeight-innerHeight)*100)+'%';
},{passive:true});
mb.onclick=()=>{const o=menu.classList.toggle('open');mb.setAttribute('aria-expanded',o)};
$$('#menu a').forEach(a=>a.onclick=()=>{menu.classList.remove('open');mb.setAttribute('aria-expanded',false)});

// reveal + counters
function count(e){
  const to=+e.dataset.n,s=e.dataset.s||'',t0=performance.now();
  (function f(t){const p=Math.min((t-t0)/1400,1);e.textContent=Math.round(to*(1-Math.pow(1-p,3)))+s;if(p<1)requestAnimationFrame(f)})(t0);
}
const io=new IntersectionObserver(es=>es.forEach(x=>{
  if(!x.isIntersecting)return;
  x.target.classList.add('in');
  $$('[data-n]',x.target).forEach(count);
  io.unobserve(x.target);
}),{threshold:.2});
$$('.rv').forEach(e=>io.observe(e));

// glow follows cursor
const g=$('#glow');
addEventListener('pointermove',e=>{g.style.transform=`translate(${e.clientX}px,${e.clientY}px)`});

// 3D tilt on project cards
if(!reduce&&matchMedia('(hover:hover)').matches){
  $$('.card').forEach(c=>{
    c.addEventListener('pointermove',e=>{
      const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      c.style.transform=`perspective(1000px) rotateY(${x*6}deg) rotateX(${-y*6}deg) translateY(-4px)`;
    });
    c.addEventListener('pointerleave',()=>c.style.transform='');
  });
}

// particle network background
const cv=$('#bg'),ctx=cv.getContext('2d');let W,H,P=[],m={x:-999,y:-999};
function size(){
  W=cv.width=innerWidth;H=cv.height=innerHeight;
  const n=Math.min(90,Math.floor(W*H/16000));
  P=Array.from({length:n},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35}));
}
addEventListener('resize',size);size();
addEventListener('pointermove',e=>{m.x=e.clientX;m.y=e.clientY});
function draw(){
  ctx.clearRect(0,0,W,H);
  for(const p of P){
    p.x+=p.vx;p.y+=p.vy;
    if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;
    const dx=p.x-m.x,dy=p.y-m.y,d=Math.hypot(dx,dy);
    if(d<140){p.x+=dx/d*1.2;p.y+=dy/d*1.2}
    ctx.fillStyle='rgba(150,160,255,.7)';ctx.beginPath();ctx.arc(p.x,p.y,1.6,0,6.3);ctx.fill();
  }
  for(let i=0;i<P.length;i++)for(let j=i+1;j<P.length;j++){
    const d=Math.hypot(P[i].x-P[j].x,P[i].y-P[j].y);
    if(d<120){ctx.strokeStyle=`rgba(120,130,255,${.22*(1-d/120)})`;ctx.beginPath();ctx.moveTo(P[i].x,P[i].y);ctx.lineTo(P[j].x,P[j].y);ctx.stroke()}
  }
  if(!reduce)requestAnimationFrame(draw);
}
draw();

// ripple saat tombol ditekan
const RIP='.btn,.pill,.totop,.ai-chips button,.ai-form button';
document.addEventListener('pointerdown',e=>{
  const t=e.target.closest(RIP);if(!t||reduce)return;
  const r=t.getBoundingClientRect(),d=Math.max(r.width,r.height),s=document.createElement('span');
  s.className='rip';s.style.cssText=`width:${d}px;height:${d}px;left:${e.clientX-r.left-d/2}px;top:${e.clientY-r.top-d/2}px`;
  t.appendChild(s);setTimeout(()=>s.remove(),700);
});
// tombol "magnet": sedikit mengikuti kursor
if(!reduce&&matchMedia('(hover:hover)').matches){
  let last=null;const clr=b=>{b.style.removeProperty('--mx');b.style.removeProperty('--my')};
  document.addEventListener('pointermove',e=>{
    const b=e.target.closest('.btn');
    if(last&&last!==b){clr(last);last=null}
    if(!b)return;last=b;
    const r=b.getBoundingClientRect();
    b.style.setProperty('--mx',((e.clientX-r.left-r.width/2)*.16)+'px');
    b.style.setProperty('--my',((e.clientY-r.top-r.height/2)*.26)+'px');
  });
}
})();
