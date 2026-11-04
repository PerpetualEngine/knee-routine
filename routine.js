(function(){
/* ---------- per-exercise guide data ---------- */
var META=[
{each:1,unit:"leg",sets:2,rest:30,say:"Two sets of ten on each leg. Hold two seconds at the top.",v:"The straight leg raise trains your quadriceps, the big muscle on the front of your thigh that straightens the knee. Because the knee stays straight, the kneecap barely presses into the groove of the thigh bone, so this is one of the gentlest ways to build quad strength when the kneecap cartilage is sensitive. Before you lift, tighten the thigh hard, as if pushing the back of your knee into the floor. That is what switches the muscle on. Then lift slowly to the height of the other knee, hold, and lower with control. The slow lowering is where a lot of the strength is built."},
{each:0,sets:2,rest:30,say:"Two sets of ten. Hold two seconds at the top.",v:"The glute bridge works the gluteus maximus, your biggest hip muscle, together with the hamstrings. Strong glutes control how your thigh bone rotates, so your knee does not drift inward when you walk, climb stairs or stand on one leg. A knee that stays in line puts less uneven pressure behind the kneecap. Press through your heels, lift until your shoulders, hips and knees make one line, and do not arch your lower back."},
{each:1,unit:"leg",sets:2,rest:30,say:"Two sets of ten on each leg.",v:"The standing side leg lift trains the gluteus medius and the other hip abductors, the muscles on the side of your hip. They keep your pelvis level every time you stand on one leg, which is every step you take. When they are weak, the thigh tends to fall inward and the knee takes extra twisting load. Stay tall, keep your toes pointing forward, and lift the leg out to the side without leaning your body."},
{each:1,unit:"side",sets:2,rest:30,say:"Two sets of twelve on each side. Slow and controlled.",v:"The clamshell targets the deep hip rotators and the gluteus medius. These muscles turn the thigh outward and steady the hip, which supports the knee from above. Keep your feet together and your hips still so the pelvis does not roll backward, and open only the top knee. The burn on the outside of your hip is the right muscle working."},
{each:0,sets:2,rest:45,say:"Two sets of ten, shallow bend only.",v:"The mini squat trains the quads, glutes and calves together, but only through a shallow bend of thirty to forty degrees. Pressure behind the kneecap rises as the knee bends deeper, so staying shallow lets you build strength with the least stress on the softened cartilage. Sit your hips back, keep your knees over your toes, and stay in the pain-free range. This is also the movement you need for stairs and for getting out of a chair."},
{each:0,sets:2,rest:30,say:"Two sets of fifteen, two seconds up and two seconds down.",v:"The calf raise strengthens the gastrocnemius and the soleus, your calf muscles. The gastrocnemius crosses behind the knee, so it helps control and protect the joint, and your calves absorb load with every step you walk. Go up for two seconds, down for two, and use the wall only for balance."},
{each:1,unit:"leg",sets:2,rest:10,H:30,say:"Two holds of thirty seconds on each leg.",v:"The quad stretch lengthens the muscle on the front of your thigh. Tight quads can pull on the kneecap and raise the pressure behind it, so keeping them supple is part of looking after the kneecap. Pull your heel gently toward your glute, keep your knees close together, and stand tall without arching your back. Stay below any sharp pain."},
{each:1,unit:"leg",sets:2,rest:10,H:30,say:"Two holds of thirty seconds on each leg.",v:"The hamstring stretch lengthens the muscles on the back of your thigh, which cross behind the knee. Tight hamstrings can make the knee feel stiff and shorten your stride. Keep the lifted leg as straight as is comfortable, let the towel do the pulling, and keep your head relaxed on the floor."},
{each:1,unit:"leg",sets:2,rest:10,H:30,say:"Two holds of thirty seconds on each leg.",v:"The calf stretch lengthens the gastrocnemius, which crosses behind the knee, and the soleus below it. Keep the heel of the back foot flat and the back leg straight, and you will feel it in the upper part of the calf. Lean the hips toward the wall."},
{each:1,unit:"side",sets:2,rest:10,H:30,say:"Two holds of thirty seconds on each side.",v:"The hip flexor stretch opens the front of the hip. Tight hip flexors tilt the pelvis forward and change how the thigh and knee line up. Tuck your tailbone under, then ease the hip forward. The cushion is there to protect the kneecap of your back leg."},
{each:1,unit:"leg",sets:2,rest:10,H:30,say:"Two holds of thirty seconds on each leg.",v:"Knee to chest gently bends the knee and hip through a comfortable range, loosens the lower back and the glutes, and is a safe way to keep the knee moving. Hug the knee toward your chest, keep the other leg relaxed and flat, and breathe out slowly."}
];
ex.forEach(function(e,i){var m=META[i];for(var k in m)e[k]=m[k];});

var $=function(id){return document.getElementById(id);};
/* ---------- options ---------- */
var opt={beep:true,voice:true,learn:true,rate:0.85,vname:""};
try{var so=JSON.parse(localStorage.getItem("knee-opt")||"{}");for(var k in so)if(k in opt)opt[k]=(k==="rate"?(+so[k]||0.85):k==="vname"?String(so[k]):!!so[k]);}catch(e){}
window.kneeOpt=opt;
function saveOpt(){try{localStorage.setItem("knee-opt",JSON.stringify(opt));}catch(e){}}

/* ---------- audio ---------- */
var AC=null;
function audio(){try{if(!AC)AC=new(window.AudioContext||window.webkitAudioContext)();if(AC.state==="suspended")AC.resume();}catch(e){}}
window.kneeAudio=audio;
function beep(f,d,v){if(!opt.beep||!AC)return;try{var o=AC.createOscillator(),g=AC.createGain(),t=AC.currentTime;o.type="sine";o.frequency.value=f;g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(v||0.25,t+0.01);g.gain.exponentialRampToValueAtTime(0.0001,t+d);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+d+0.05);}catch(e){}}

/* ---------- voice ---------- */
var hasSpeech="speechSynthesis" in window,voice=null;
function enVoices(){return hasSpeech?speechSynthesis.getVoices().filter(function(v){return /^en/i.test(v.lang);}):[];}
function score(v){var n=v.name,sc=0;if(/natural|neural|premium|enhanced|siri/i.test(n))sc+=5;if(/google/i.test(n))sc+=3;if(/samantha|ava|serena|allison|karen|daniel|moira|tessa|aaron|nicky/i.test(n))sc+=3;if(/^en[-_]US/i.test(v.lang))sc+=2;if(/^en[-_](GB|AU|IE|ZA)/i.test(v.lang))sc+=1;if(/compact|espeak|robot|fred|zarvox|bad|whisper|trinoids|bubbles|cellos|boing|bells/i.test(n))sc-=6;return sc;}
function pickVoice(){
  if(!hasSpeech)return;var vs=enVoices();if(!vs.length){voice=null;return;}
  voice=vs.filter(function(v){return v.name===opt.vname;})[0]||vs.slice().sort(function(a,b){return score(b)-score(a);})[0];
  fillSel(vs);
}
function fillSel(vs){var sel=$("vsel");if(!sel)return;var cur=voice&&voice.name;sel.innerHTML="";vs.slice().sort(function(a,b){return score(b)-score(a);}).forEach(function(v,i){var o=document.createElement("option");o.value=v.name;o.textContent=(i===0?"\u2605 ":"")+v.name+" ("+v.lang+")";if(v.name===cur)o.selected=true;sel.appendChild(o);});}
if(hasSpeech){speechSynthesis.onvoiceschanged=pickVoice;}
function say(txt,cut){return new Promise(function(res){
  if(!opt.voice||!hasSpeech){res();return;}
  if(cut)speechSynthesis.cancel();
  var u=new SpeechSynthesisUtterance(txt),done=false,to;
  function fin(){if(!done){done=true;clearTimeout(to);res();}}
  u.lang=(voice&&voice.lang)||"en-US";if(voice)u.voice=voice;u.rate=Math.max(0.5,Math.min(1.3,opt.rate+(/^[\d\s]+$|^last one$|seconds$/i.test(txt)?0.15:0)));u.pitch=1;u.onend=fin;u.onerror=fin;
  to=setTimeout(fin,3000+txt.length*(130/opt.rate));
  speechSynthesis.speak(u);
});}
function speakLong(text,guard){
  var parts=text.match(/[^.!?]+[.!?]*/g)||[text];
  return parts.reduce(function(p,s){return p.then(function(){if(guard&&guard())return;return say(s.trim()).then(function(){return new Promise(function(r){setTimeout(r,350);});});});},Promise.resolve());
}
function stopSpeak(){if(hasSpeech)speechSynthesis.cancel();}
window.speakLong=speakLong;window.stopSpeak=stopSpeak;window.kneeSay=say;

/* ---------- clock + control ---------- */
var ctl={pause:false,abort:null,talk:false,running:false,plan:[],after:null};
var clk=0,lt=performance.now();
setInterval(function(){var n=performance.now();if(!ctl.pause)clk+=(n-lt)/1000;lt=n;},20);
function until(T){return new Promise(function(res,rej){(function poll(){if(ctl.abort){rej(ctl.abort);return;}if(clk>=T){res();return;}setTimeout(poll,15);})();});}
async function span(sec,tick){var s=clk,k=1;while(k<sec){await until(s+k);if(tick)tick(k);k++;}await until(s+sec);}
async function S(t,cut){await say(t,cut);if(ctl.abort)throw ctl.abort;}
function guard(){return ctl.abort||ctl.talk;}

/* ---------- UI ---------- */
var cur=0,btns=[],lists=$("lists"),grid=null;
ex.forEach(function(e,i){
  if(e.sec){var h=document.createElement("p");h.textContent=e.sec;h.style.cssText="font-size:13px;color:var(--text-secondary);margin:"+(i?"12px":"0")+" 0 6px;";lists.appendChild(h);grid=document.createElement("div");grid.style.cssText="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;";lists.appendChild(grid);}
  var b=document.createElement("button");b.textContent=(i+1)+". "+e.n;b.style.cssText="font-size:13px;padding:8px 6px;text-align:left;";b.onclick=function(){nav(i,true);};grid.appendChild(b);btns.push(b);
});
function setBig(t){$("big").textContent=t;}
function setPhase(t){$("phase").textContent=t;}
function setSub(t){$("sub").textContent=t;}
function mark(on,b){b.style.borderColor=on?"var(--border-accent)":"";b.style.background=on?"var(--bg-accent)":"";b.style.color=on?"var(--text-accent)":"";}
var pvTok=0,talkTok=0;
function setEx(i){
  cur=(i+ex.length)%ex.length;pvTok++;talkTok++;if(!ctl.running)stopSpeak();
  var e=ex[cur];$("name").textContent=e.n;$("cue").textContent=e.c;$("dose").textContent=e.p;$("extra").textContent=e.x;
  btns.forEach(function(b,j){mark(j===cur,b);});
  if(!ctl.running){setSeg(1,1,0);setBig(" ");setPhase("Ready");setSub("");}
}
function ui(){
  var r=ctl.running;
  $("pp").textContent=r?(ctl.pause?"▶ Resume":"❚❚ Pause"):"▶ Start this exercise";
  $("whole").disabled=r;$("stop").disabled=!r;$("prev").disabled=false;
  $("preview").disabled=r;$("explain").disabled=r;
  ["beep","voice","learn"].forEach(function(k){var b=$("o_"+k);b.textContent={beep:"Beeps",voice:"Voice",learn:"Teach me"}[k]+": "+(opt[k]?"on":"off");mark(opt[k],b);});
}
function nav(i,absolute){
  var t=absolute?i:(cur+i+ex.length)%ex.length;
  if(!ctl.running){setEx(t);return;}
  if(ctl.plan.length>1){ctl.abort={jump:t};}else{ctl.after=t;ctl.abort="stop";}
  stopSpeak();
}

/* ---------- drawing ---------- */
var seg={s:0,d:0,from:1,to:1};
function setSeg(from,to,d){seg={s:clk,d:d,from:from,to:to};}
function pts(l){return l.map(function(q){return q[0].toFixed(1)+","+q[1].toFixed(1);}).join(" ");}
function pl(l,col,w){return '<polyline points="'+pts(l)+'" fill="none" stroke="'+col+'" stroke-width="'+w+'" stroke-linecap="round" stroke-linejoin="round"/>';}
function ss(x){x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);}
var fig=$("fig");
function frame(){
  var x=seg.d>0?(clk-seg.s)/seg.d:1,p=seg.from+(seg.to-seg.from)*ss(x),e=ex[cur];
  var o=e.f(p),h="";(o.wall||[]).forEach(function(l){h+=pl(l,"var(--border-strong)",3);});
  h+='<circle cx="'+o.head[0].toFixed(1)+'" cy="'+o.head[1].toFixed(1)+'" r="'+(o.circ||9)+'" fill="none" stroke="'+T+'" stroke-width="4"/>';
  o.rest.forEach(function(l){h+=pl(l,T,5);});o.work.forEach(function(l){h+=pl(l,G,5);});fig.innerHTML=h;
  requestAnimationFrame(frame);
}

/* ---------- workout steps ---------- */
async function countdown(sec,label,every){
  setPhase(label);var s=clk;
  for(var k=0;k<sec;k++){
    var left=sec-k;setBig(String(left));
    if(every||left<=3)say(String(left),true);
    beep(left<=3?1000:600,0.06,0.18);
    await until(s+k+1);
  }
  beep(1300,0.25,0.3);setBig("Go");
}
async function doRep(e,n,total){
  var u=e.t[0],h=e.t[1],d=e.t[2],tick=function(){beep(1400,0.03,0.07);};
  setBig(n+"/"+total);
  setPhase("Lift");setSeg(0,1,u);beep(880,0.14,0.3);say(n===total?"Last one":String(n),true);
  await span(u,tick);
  setPhase("Hold");setSeg(1,1,0);beep(660,0.14,0.3);
  await span(h,tick);
  setPhase("Lower");setSeg(1,0,d);beep(440,0.14,0.3);
  await span(d,tick);
}
async function doHold(e){
  var u=e.t[0],h=e.H,d=e.t[2];
  setBig(" ");setPhase("Ease in");setSeg(0,1,u);beep(880,0.14,0.3);say("Ease in",true);
  await span(u);
  setPhase("Hold");setSeg(1,1,0);beep(660,0.2,0.3);
  var s=clk;
  for(var k=1;k<=h;k++){
    await until(s+k);var left=h-k;setBig(String(left));
    if(left===20||left===10)say(left+" seconds",true);else if(left>0&&left<=5)say(String(left),true);
    beep(left<=5?900:1400,left<=5?0.08:0.03,left<=5?0.2:0.07);
  }
  setPhase("Release");setSeg(1,0,d);beep(440,0.2,0.3);say("Release",true);
  await span(d);
}
async function runEx(idx){
  var e=ex[idx];setEx(idx);setSeg(0,0,0);setBig(" ");setPhase("Next up");setSub(e.n);
  var sides=e.each?["right","left"]:[null];
  await S("Next: "+e.n+". "+e.say+(e.each?" Start with your right "+e.unit+".":""),true);
  if(opt.learn&&opt.voice){ctl.talk=false;$("skiptalk").hidden=false;setPhase("Listen");await speakLong(e.v,guard);$("skiptalk").hidden=true;ctl.talk=false;if(ctl.abort)throw ctl.abort;}
  await countdown(8,"Get in position",false);
  for(var s=0;s<sides.length;s++){
    if(s>0){setSeg(0,0,0);setBig(" ");setPhase("Switch sides");await S("Switch to your left "+e.unit+".",true);await countdown(10,"Switch sides",true);}
    for(var k=1;k<=e.sets;k++){
      setSub((sides[s]?sides[s].charAt(0).toUpperCase()+sides[s].slice(1)+" "+e.unit+" · ":"")+(e.H?"Hold ":"Set ")+k+" of "+e.sets);
      if(e.H){await doHold(e);}else{for(var r=1;r<=e.R;r++)await doRep(e,r,e.R);}
      if(k<e.sets){setSeg(0,0,0);setBig(" ");setPhase("Rest");await S(e.H?"Rest. Next hold coming up.":"Set done. Rest.",true);await countdown(e.rest,"Rest",false);}
    }
  }
  setSeg(0,0,0);setBig("✓");setPhase("Done");setSub(e.n);
  await S(e.n+" done.",true);
}
async function wake(on){try{if(on&&navigator.wakeLock){ctl.wl=await navigator.wakeLock.request("screen");}else if(ctl.wl){await ctl.wl.release();ctl.wl=null;}}catch(e){}}
async function session(plan){
  if(ctl.running)return;
  audio();stopSpeak();talkTok++;pvTok++;
  ctl.running=true;ctl.abort=null;ctl.pause=false;ctl.talk=false;ctl.plan=plan;ui();wake(true);
  var i=0;
  try{
    while(i<plan.length){
      try{await runEx(plan[i]);i++;}
      catch(a){
        if(a&&typeof a==="object"&&"jump" in a){var ix=plan.indexOf(a.jump);if(ix>=0)i=ix;ctl.abort=null;stopSpeak();continue;}
        throw a;
      }
    }
    setBig("✓");setPhase(plan.length>1?"Routine complete":"Done");
    await say(plan.length>1?"That's everything. Great work. Remember to note how your knees feel tomorrow.":"Nice work.",true);
  }catch(a){}
  ctl.running=false;ctl.abort=null;ctl.pause=false;$("skiptalk").hidden=true;stopSpeak();wake(false);
  if(ctl.after!=null){var t=ctl.after;ctl.after=null;setEx(t);}else{setEx(cur);}
  ui();
}

/* ---------- buttons ---------- */
$("prev").onclick=function(){nav(-1);};
$("next").onclick=function(){nav(1);};
$("pp").onclick=function(){
  if(!ctl.running){session([cur]);return;}
  ctl.pause=!ctl.pause;
  if(hasSpeech){if(ctl.pause)speechSynthesis.pause();else speechSynthesis.resume();}
  ui();
};
$("whole").onclick=function(){session(ex.map(function(e,i){return i;}));};
$("stop").onclick=function(){if(ctl.running){ctl.abort="stop";ctl.pause=false;stopSpeak();}};
$("skiptalk").onclick=function(){ctl.talk=true;stopSpeak();};
$("preview").onclick=async function(){
  if(ctl.running)return;audio();var my=++pvTok,e=ex[cur];
  var wait=function(sec){var T=clk+sec;return new Promise(function(r){(function p(){if(pvTok!==my||clk>=T){r();return;}setTimeout(p,15);})();});};
  setSeg(0,1,e.t[0]);await wait(e.t[0]);if(pvTok!==my)return;
  await wait(Math.min(e.t[1],2));if(pvTok!==my)return;
  setSeg(1,0,e.t[2]);await wait(e.t[2]);if(pvTok!==my)return;
  setSeg(1,1,0);
};
$("explain").onclick=async function(){
  if(ctl.running)return;audio();var my=++talkTok;stopSpeak();
  await speakLong(ex[cur].v,function(){return talkTok!==my;});
};
["beep","voice","learn"].forEach(function(k){$("o_"+k).onclick=function(){audio();opt[k]=!opt[k];saveOpt();if(k==="voice"&&!opt.voice)stopSpeak();ui();};});
document.addEventListener("visibilitychange",function(){if(!document.hidden&&ctl.running)wake(true);});

pickVoice();
$("vsel").onchange=function(){opt.vname=this.value;saveOpt();pickVoice();};
$("vrate").value=opt.rate;$("vrateo").textContent=opt.rate.toFixed(2)+"x";
$("vrate").oninput=function(){opt.rate=+this.value;$("vrateo").textContent=opt.rate.toFixed(2)+"x";saveOpt();};
$("vtest").onclick=function(){audio();stopSpeak();say("This is how I will sound. Breathe in, and let's begin. One. Two. Three.",true);};
setEx(0);ui();requestAnimationFrame(frame);
})();
