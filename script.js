const $=id=>document.getElementById(id);
const races={elves:"The Elves",hobbits:"The Hobbits",dwarves:"The Dwarves",men:"The Men"};
let names=[],activeRealm="all",history=[];
const storeKey="four-realms-picker-v1";
function save(){try{localStorage.setItem(storeKey,JSON.stringify({names,history}));}catch(e){}}
function load(){try{const d=JSON.parse(localStorage.getItem(storeKey)||"{}");names=Array.isArray(d.names)?d.names:[];history=Array.isArray(d.history)?d.history:[];}catch(e){names=[];history=[];}}
function toast(msg){$("toast").textContent=msg;$("toast").classList.add("show");setTimeout(()=>$("toast").classList.remove("show"),2300)}
function pool(realm=activeRealm){return names.filter(n=>realm==="all"||n.realm===realm)}
function render(){
 const filtered=pool();$("nameCount").textContent=`${filtered.length} name${filtered.length===1?"":"s"} gathered`;$("poolLabel").textContent=activeRealm==="all"?"All realms":races[activeRealm];$("activeRealmBadge").textContent=activeRealm==="all"?"ALL REALMS":races[activeRealm].toUpperCase();
 $("nameList").innerHTML=filtered.length?filtered.map(n=>`<li><span>${escapeHtml(n.name)} <small>· ${races[n.realm]}</small></span><button class="remove-name" data-id="${n.id}" aria-label="Remove ${escapeHtml(n.name)}">×</button></li>`).join(""):'<li class="empty-state">No names in this realm yet. Add some above.</li>';
 $("nameList").querySelectorAll("[data-id]").forEach(b=>b.addEventListener("click",()=>{names=names.filter(n=>n.id!==b.dataset.id);save();render()}));
 $("historyList").innerHTML=history.length?history.slice().reverse().map(h=>`<li>${escapeHtml(h.name)} <span>${races[h.realm]} · ${h.time}</span></li>`).join(""):'<li class="empty-state">No names have been chosen yet.</li>';
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function addName(name,realm){name=name.trim();if(!name)return false;if(names.some(n=>n.name.toLowerCase()===name.toLowerCase()&&n.realm===realm)){toast("That name is already in this realm.");return false}names.push({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random()),name,realm});return true}
$("addNameBtn").addEventListener("click",()=>{const v=$("nameInput").value;if(addName(v,$("nameRealm").value)){ $("nameInput").value="";save();render();toast("Name added to the gathering.")}});
$("nameInput").addEventListener("keydown",e=>{if(e.key==="Enter")$("addNameBtn").click()});
$("bulkBtn").addEventListener("click",()=>{$("bulkInput").classList.toggle("hidden");if(!$("bulkInput").classList.contains("hidden"))$("bulkInput").focus();else{const lines=$("bulkInput").value.split(/\r?\n/);let count=0;lines.forEach(v=>{if(addName(v,$("nameRealm").value))count++});$("bulkInput").value="";save();render();if(count)toast(`${count} names added.`)}});
$("clearBtn").addEventListener("click",()=>{if(!pool().length)return toast("There are no names to clear.");if(confirm(`Clear ${pool().length} names from ${activeRealm==="all"?"all realms":races[activeRealm]}?`)){names=names.filter(n=>activeRealm!=="all"&&n.realm!==activeRealm);save();render();toast("The name pool has been cleared.")}});
function selectRealm(realm){activeRealm=realm;document.querySelectorAll(".realm-card").forEach(c=>c.classList.toggle("selected",c.dataset.realm===realm));render();$("app").scrollIntoView({behavior:"smooth",block:"start"})}
document.querySelectorAll(".realm-card").forEach(c=>c.addEventListener("click",()=>selectRealm(c.dataset.realm)));
$("realm-map").addEventListener?.("click",()=>{});
$("enterBtn").addEventListener("click",()=>$("app").scrollIntoView({behavior:"smooth"}));
function draw(){
 const available=pool();if(!available.length){toast("Gather names in this realm before drawing.");return}
 const multi=$("multiMode").checked;const count=multi?Math.max(1,Math.min(30,Number($("multiCount").value)||1)):1;
 if(count>available.length){toast(`Only ${available.length} names are available.`);return}
 const chosen=[...available].sort(()=>Math.random()-.5).slice(0,count);
 $("ringStage").classList.add("igniting");$("result").classList.remove("chosen");$("resultName").textContent="The Ring is awakening…";$("resultRace").textContent="The ancient power is stirring";
 $("drawBtn").disabled=true;
 setTimeout(()=>{
   $("ringStage").classList.remove("igniting");$("result").classList.add("chosen");
   $("resultName").textContent=chosen.map(n=>n.name).join(" · ");$("resultRace").textContent=chosen.map(n=>races[n.realm]).join(" / ");
   const time=new Date().toLocaleString();chosen.forEach(n=>history.push({...n,time}));
   if($("removeAfter").checked){const ids=new Set(chosen.map(n=>n.id));names=names.filter(n=>!ids.has(n.id))}
   save();render();$("drawBtn").disabled=false;toast(chosen.length===1?"The Ring has chosen.":"The Ring has chosen your fellowship.");
   playChime();
 },1900);
}
$("drawBtn").addEventListener("click",draw);
$("multiMode").addEventListener("change",e=>$("multiCountWrap").classList.toggle("hidden",!e.target.checked));
$("groupBtn").addEventListener("click",()=>{
 const realm=$("groupRealm").value;const source=pool(realm);if(source.length<2)return toast("Add at least two names to form groups.");
 const count=Math.max(2,Math.min(20,Number($("groupCount").value)||2));const shuffled=[...source].sort(()=>Math.random()-.5);const groups=Array.from({length:Math.min(count,source.length)},()=>[]);
 shuffled.forEach((n,i)=>groups[i%groups.length].push(n));
 $("groupsOutput").innerHTML=groups.map((g,i)=>`<article class="group-card"><h4>FELLOWSHIP ${String(i+1).padStart(2,"0")}</h4><ul>${g.map(n=>`<li>${escapeHtml(n.name)} <small>(${races[n.realm].replace("The ","")})</small></li>`).join("")}</ul></article>`).join("");
});
$("historyClear").addEventListener("click",()=>{history=[];save();render();toast("Chronicles cleared.")});
const audio=$("bgAudio");let musicOn=false;
$("musicToggle").addEventListener("click",async()=>{try{if(!musicOn){await audio.play();musicOn=true;$("musicLabel").textContent="Music on"}else{audio.pause();musicOn=false;$("musicLabel").textContent="Music off"}}catch(e){toast("Tap again to allow music playback.")}});
function playChime(){try{const ctx=new (window.AudioContext||window.webkitAudioContext)();[523.25,659.25,783.99].forEach((f,i)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type="sine";o.frequency.value=f;o.connect(g);g.connect(ctx.destination);g.gain.setValueAtTime(.0001,ctx.currentTime+i*.12);g.gain.exponentialRampToValueAtTime(.07,ctx.currentTime+i*.12+.04);g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+i*.12+.65);o.start(ctx.currentTime+i*.12);o.stop(ctx.currentTime+i*.12+.7)});setTimeout(()=>ctx.close(),1200)}catch(e){}}
let deferredPrompt;$("installBtn").classList.add("hidden");window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;$("installBtn").classList.remove("hidden")});$("installBtn").addEventListener("click",async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;$("installBtn").classList.add("hidden")});
if("serviceWorker"in navigator&&location.protocol.startsWith("http"))window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
load();render();
