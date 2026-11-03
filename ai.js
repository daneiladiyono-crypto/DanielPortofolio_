(()=>{
const API="https://api.synoxcloud.xyz/ai-chat/asynt-ai";
const CTX="Kamu Asisten AI di website portofolio Daniel (BUKAN support Asyntai). Jawab singkat, ramah, bahasa Indonesia, hanya berdasarkan info ini. Daniel: anak muda suka teknologi, pemrograman, web; lebih suka langsung mencoba. Skill: editing 80%, design 60%, coding 55%. Proyek: Daniel.Mail, ARVEX Seleksi, TikTok Downloader, Neel Numbers. Kontak: wa.me/6285199384842, TikTok @_danielk4zz. Jika di luar info ini, bilang belum tahu dan arahkan ke WhatsApp Daniel.";
const L={
 proj:"Daniel punya 4 website yang sudah live:\n• **Daniel.Mail**: layanan email sementara. https://danielmailv2.vercel.app/\n• **ARVEX Seleksi**: seleksi anggota clan komunitas. https://arvex-seleksi.vercel.app/\n• **TikTok Downloader**: unduh video tanpa watermark, foto slideshow, dan MP3. https://tiktok-download-green.vercel.app\n• **Neel Numbers**: nomor virtual untuk OTP WhatsApp. https://virtualnumber-six.vercel.app/",
 who:"Daniel adalah anak muda yang tertarik besar pada teknologi, pemrograman, dan pengembangan website. Dia lebih suka langsung mencoba daripada cuma membayangkan, dan punya kemauan kuat untuk belajar dan mengembangkan ide.",
 skill:"Penilaian Daniel untuk dirinya sendiri: **Editing 80%**, **Design 60%**, **Coding 55%**. Alat yang dipakai: HTML, CSS, JavaScript, GitHub, Vercel, dan video editing. Angkanya masih terus naik.",
 contact:"Kamu bisa menghubungi Daniel lewat:\n• WhatsApp: https://wa.me/6285199384842\n• TikTok: https://www.tiktok.com/@_danielk4zz",
 arvex:"**ARVEX Seleksi** adalah website seleksi anggota clan komunitas, lengkap dengan halaman Rules dan FAQ. Coba di https://arvex-seleksi.vercel.app/",
 mail:"**Daniel.Mail** adalah layanan email sementara untuk menerima pesan saat mencoba layanan online. Buat inbox baru langsung dari browser di https://danielmailv2.vercel.app/",
 dl:"**TikTok Downloader** mengunduh video TikTok tanpa watermark hingga Full HD 1080p, foto slideshow, dan audio MP3. Coba di https://tiktok-download-green.vercel.app",
 neel:"**Neel Numbers** menyediakan nomor virtual untuk menerima kode OTP WhatsApp. Dapat nomor acak, lalu cek OTP-nya langsung dari browser di https://virtualnumber-six.vercel.app/",
 hi:"Halo juga! Ada yang mau kamu tahu soal Daniel, proyeknya, atau skillnya?"
};
const RULES=[[/arvex|seleksi|clan/,"arvex"],[/daniel\.?mail|email sementara|temp.?mail/,"mail"],[/downloader|download|unduh|watermark/,"dl"],[/neel|nomor virtual|virtual number|otp/,"neel"],[/hubung|kontak|whatsapp|\bwa\b|tiktok|sosmed|sosial media/,"contact"],[/skill|kemampuan|keahlian|bisa apa|coding|desain|design|editing/,"skill"],[/proyek|project|karya|portofolio|website apa/,"proj"],[/siapa|tentang|profil|biografi|perkenal/,"who"],[/^(halo|hai|hi|hello|assalamualaikum|p)\b/,"hi"]];
const local=t=>{const q=t.toLowerCase();for(const[r,k]of RULES)if(r.test(q))return L[k];return""};
const HI="Halo! Aku asisten AI di portofolio Daniel ✨ Mau tahu soal proyek, skill, atau cara menghubungi Daniel? Tanya aja, atau pilih di bawah.";
const SUG=["Siapa Daniel?","Proyek apa saja?","Skill Daniel","Cara hubungi Daniel"];
const newSid=()=>"web"+Math.random().toString(36).slice(2,10)+Date.now().toString(36);
let sid;try{sid=localStorage.getItem("dn-ai")}catch(e){}
if(!sid){sid=newSid();try{localStorage.setItem("dn-ai",sid)}catch(e){}}
let busy=false;

const root=document.createElement("div");root.id="ai";
root.innerHTML=`
<button class="ai-fab" id="aiFab" aria-label="Buka asisten AI" aria-expanded="false" aria-controls="aiPanel"><span class="ai-ring"></span>
<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l2.2 5.8L20 10l-5.8 2.2L12 18l-2.2-5.8L4 10l5.8-2.2z"/><path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z" opacity=".8"/></svg></button>
<div class="ai-tip" id="aiTip"><span>Tanya asisten AI ✨</span><button id="aiTipX" aria-label="Tutup">×</button></div>
<section class="ai-panel" id="aiPanel" role="dialog" aria-label="Asisten AI Daniel">
<header class="ai-head"><div class="ai-orb"></div><div><b>Asisten Daniel</b><small><i></i>Online</small></div>
<button id="aiClear" aria-label="Mulai chat baru" title="Chat baru">↺</button><button id="aiClose" aria-label="Tutup">×</button></header>
<div class="ai-msgs" id="aiMsgs" aria-live="polite"></div>
<div class="ai-chips" id="aiChips"></div>
<form class="ai-form" id="aiForm"><input id="aiIn" placeholder="Tulis pesan..." autocomplete="off" maxlength="500" aria-label="Pesan"><button id="aiSend" aria-label="Kirim"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 20.5v-6.8l9-1.7-9-1.7V3.5L22 12z"/></svg></button></form>
<p class="ai-note">Jawaban AI bisa keliru, cek lagi hal penting.</p></section>`;
document.body.appendChild(root);

const $=id=>document.getElementById(id);
const fab=$("aiFab"),panel=$("aiPanel"),msgs=$("aiMsgs"),chips=$("aiChips"),input=$("aiIn"),tip=$("aiTip");

const esc=s=>s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmt=t=>esc(t)
  .replace(/(https?:\/\/[^\s<]+[^\s<.,;:!?)])/g,'<a href="$1" target="_blank" rel="noopener">$1</a>')
  .replace(/\*\*(.+?)\*\*/g,"<b>$1</b>").replace(/`([^`]+)`/g,"<code>$1</code>").replace(/\n/g,"<br>");

function add(role,html,raw){
  const r=document.createElement("div");r.className="ai-row "+role;
  r.innerHTML=(role==="bot"?'<div class="ai-orb sm"></div>':"")+'<div class="ai-msg">'+(raw?html:fmt(html))+"</div>";
  msgs.appendChild(r);msgs.scrollTop=msgs.scrollHeight;return r;
}
const typing=()=>add("bot",'<div class="ai-dots"><i></i><i></i><i></i></div>',true);

function pick(j,d=0){
  if(j==null||d>4)return"";
  if(typeof j==="string")return j.trim();
  if(Array.isArray(j))return pick(j[0],d+1);
  if(typeof j==="object"){
    for(const k of["result","response","message","reply","answer","text","output","content","data"])if(j[k]!=null){const r=pick(j[k],d+1);if(r)return r}
    for(const v of Object.values(j))if(typeof v==="string"&&v.length>1&&!/^(true|false|ok|success)$/i.test(v))return v;
  }
  return"";
}

function setBusy(b){busy=b;input.disabled=b;$("aiSend").disabled=b}

async function send(t){
  t=t.trim();if(!t||busy)return;
  chips.hidden=true;add("user",t);input.value="";setBusy(true);
  const tp=typing(),loc=local(t);
  if(loc){
    await new Promise(r=>setTimeout(r,550+Math.random()*450));
    tp.remove();add("bot",loc);setBusy(false);if(panel.classList.contains("open"))input.focus();return;
  }
  const ctl=new AbortController(),to=setTimeout(()=>ctl.abort(),30000);
  try{
    const r=await fetch(API+"?text="+encodeURIComponent(CTX+" Pertanyaan pengguna: "+t)+"&session="+encodeURIComponent(sid)+"&apikey=FREE",{signal:ctl.signal});
    if(!r.ok)throw new Error("Server membalas "+r.status);
    const raw=await r.text();let j;try{j=JSON.parse(raw)}catch(e){j=raw}
    let out=pick(j);if(!out)throw new Error("Balasan kosong");
    if(/asyntai/i.test(out))out="Hmm, itu di luar yang aku tahu. Aku paling paham soal Daniel, proyek, dan skillnya. Untuk hal lain, hubungi Daniel langsung: https://wa.me/6285199384842";
    tp.remove();add("bot",out);
  }catch(e){
    tp.remove();add("bot","Maaf, aku belum bisa menjawab sekarang ("+(e.name==="AbortError"?"waktu habis":e.message)+"). Coba kirim lagi sebentar lagi ya.");
  }finally{clearTimeout(to);setBusy(false);if(panel.classList.contains("open"))input.focus()}
}

function reset(){
  msgs.innerHTML="";sid=newSid();try{localStorage.setItem("dn-ai",sid)}catch(e){}
  add("bot",HI);chips.hidden=false;
}
const SIC=["M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z", "M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z", "M7 2v11h3v9l7-12h-4l4-8z", "M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"];
chips.innerHTML=SUG.map((s,i)=>'<button type="button"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+SIC[i]+'"/></svg> '+s+"</button>").join("");
chips.addEventListener("click",e=>{const b=e.target.closest("button");if(b)send(b.textContent)});
add("bot",HI);

function open(o){
  panel.classList.toggle("open",o);fab.setAttribute("aria-expanded",o);
  tip.classList.remove("show");
  if(o)setTimeout(()=>input.focus({preventScroll:true}),350);
}
fab.onclick=()=>open(!panel.classList.contains("open"));
$("aiClose").onclick=()=>{open(false);fab.focus()};
$("aiClear").onclick=reset;
$("aiTipX").onclick=()=>tip.classList.remove("show");
$("aiForm").addEventListener("submit",e=>{e.preventDefault();send(input.value)});
addEventListener("keydown",e=>{if(e.key==="Escape"&&panel.classList.contains("open"))open(false)});
setTimeout(()=>{if(!panel.classList.contains("open"))tip.classList.add("show")},4000);
setTimeout(()=>tip.classList.remove("show"),13000);

// tombol di hero
const cta=document.querySelector(".hero .cta");
if(cta){const b=document.createElement("button");b.type="button";b.className="btn ai";b.innerHTML='<span class="bi"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.2 5.8L20 10l-5.8 2.2L12 18l-2.2-5.8L4 10l5.8-2.2z"/></svg></span> Tanya Asisten AI';b.onclick=()=>open(true);cta.appendChild(b)}
})();
