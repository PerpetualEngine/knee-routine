/* Today's plan: easy day / hard day, levels, and a small log. Stays on the phone. */
(function(){
var K="knee-plan-log",LV="knee-level",$=function(i){return document.getElementById(i);};
var DAYS=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],HARD={1:1,3:1,5:1};
var LEVELS={1:{sets:2,reps:10,slow:false,txt:"2 sets of 10"},2:{sets:3,reps:12,slow:true,txt:"3 sets of 12, slow 3-second lowering"},3:{sets:3,reps:15,slow:true,txt:"3 sets of 15, slow 3-second lowering"}};
var DK="knee-defaults";
function cd(){var o={};try{o=JSON.parse(localStorage.getItem(DK))||{};}catch(e){}return o;}
function setCd(k,v){var o=cd();if(v==null)delete o[k];else o[k]=v;try{localStorage.setItem(DK,JSON.stringify(o));}catch(e){}render();if(window.kneeRefresh)window.kneeRefresh();}
window.kneeDefaults=cd;
var MORNING=[10,7,6,9,8],EASY=[0,3,2,1],HARDLIST=[0,1,2,3,4,5];
function key(d){d=d||new Date();return d.getFullYear()+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+("0"+d.getDate()).slice(-2);}
function ago(n){var d=new Date();d.setDate(d.getDate()-n);return d;}
function load(){var l=null;try{l=JSON.parse(localStorage.getItem(K));}catch(e){}if(!l){l={"2026-11-04":{h:1},"2026-11-05":{h:1},"2026-11-06":{h:1}};save(l);}
  try{if(!localStorage.getItem("knee-seed2")){localStorage.setItem("knee-seed2","1");if(!l["2026-11-10"]){l["2026-11-10"]={h:1};save(l);}}}catch(e){}return l;}
function save(l){try{localStorage.setItem(K,JSON.stringify(l));}catch(e){}}
function level(){var v=1;try{v=+localStorage.getItem(LV)||2;}catch(e){v=2;}return Math.max(1,Math.min(3,v));}
function setLevel(v){try{localStorage.setItem(LV,String(v));}catch(e){}render();}
function did(l,n){var e=l[key(ago(n))];return !!(e&&e.h);}
/* Evidence-based rule: strength for the same muscles about every 48 hours, at most 3 sessions in any 7 days. */
function info(l,off){
  var d=ago(-off),name=DAYS[d.getDay()],last=null,cnt=0,i;
  for(i=1;i<=6;i++){if(did(l,i-off)){if(last===null)last=i;cnt++;}}
  /* did(l,n) looks n days before today; for a day at offset off, days before it are n=i-off */
  var gap=last,strength=false,why;
  if(off===0&&did(l,0)){return {strength:false,done:true,name:name,why:"Strength session done today."};}
  if(gap!==null&&gap<2){why="Rest from strength. You trained strength "+(gap===1?"yesterday":"today")+", and the same muscles need about 48 hours between sessions. Stretching or an easy walk is fine.";}
  else if(cnt>=3){why="Rest from strength. You already did 3 strength sessions in the last 7 days, which is the weekly maximum.";}
  else{strength=true;why="Strength day. About 48 hours since your last strength session, and fewer than 3 this week.";}
  return {strength:strength,done:false,name:name,why:why};
}
function plan7(l){var out=[],sim={},i,k;for(k in l)sim[k]=l[k];
  for(i=0;i<7;i++){var d=ago(-i),dk=key(d),inf=(function(){var last=null,cnt=0,j;for(j=1;j<=6;j++){var e=sim[key(ago(j-i))];if(e&&e.h){if(last===null)last=j;cnt++;}}
      if(i===0&&sim[dk]&&sim[dk].h)return {s:false,done:true};if(last!==null&&last<2)return {s:false};if(cnt>=3)return {s:false};return {s:true};})();
    if(inf.s){sim[dk]={h:1,plan:1};}out.push({name:DAYS[d.getDay()],s:!!inf.s,done:!!inf.done});}
  return out;}
function today(l){return info(l,0);}
function nextStrength(l){var p=plan7(l);for(var i=1;i<p.length;i++)if(p[i].s)return p[i].name;return "";}
window.kneePlanDone=function(kind){var l=load(),k=key();l[k]=l[k]||{};if(kind==="hard"||kind==="strength")l[k].h=1;else if(kind==="easy")l[k].e=1;else l[k].m=1;save(l);render();};
function btn(txt,fn,primary){var b=document.createElement("button");b.textContent=txt;b.style.cssText="flex:1;min-width:140px;font-size:13px;padding:10px;text-align:left;"+(primary?"border-color:var(--border-accent);background:var(--bg-accent);color:var(--text-accent);":"");b.onclick=fn;return b;}
function render(){
  var root=$("plan");if(!root)return;var l=load(),t=today(l),lv=level(),L=LEVELS[lv],C=cd();
  root.innerHTML="";
  var box=document.createElement("div");box.style.cssText="background:var(--surface-1);border-radius:12px;padding:12px;margin:0 0 12px;";
  var h=document.createElement("div");h.style.cssText="display:flex;justify-content:space-between;align-items:baseline;gap:8px;";
  var done=t.done,nx=nextStrength(l);
  h.innerHTML='<span style="font-weight:500;font-size:15px;">Today, '+t.name+': '+(done?"strength done ✓":(t.strength?"strength day":"rest from strength"))+'</span><span style="font-size:12px;color:var(--text-secondary);">'+(t.strength&&!done?"":"next strength: "+nx)+'</span>';
  var p=document.createElement("p");p.style.cssText="font-size:13px;color:var(--text-secondary);margin:6px 0 10px;line-height:1.5;";p.textContent=t.why;
  var row=document.createElement("div");row.style.cssText="display:flex;gap:8px;flex-wrap:wrap;margin:0 0 10px;";
  if(done||!t.strength){}
  else row.appendChild(btn("▶ STRENGTH SESSION\n6 exercises, "+(C.sets||L.sets)+" sets of "+(C.reps||L.reps)+(L.slow?", slow lowering":""),function(){kneeStart(HARDLIST,{sets:C.sets||L.sets,reps:C.reps||L.reps,slow:L.slow,quiet:true},"strength");},true));
  row.appendChild(btn("Optional: stretches\n5 exercises, about 8 min",function(){kneeStart(MORNING,{sets:1,quiet:true},"morning");},false));
  [].forEach.call(row.children,function(b){b.style.whiteSpace="pre-line";});
  var lvrow=document.createElement("div");lvrow.style.cssText="display:flex;align-items:center;gap:8px;font-size:13px;margin:0 0 10px;flex-wrap:wrap;";
  var lt=document.createElement("span");lt.style.flex="1";lt.textContent="Level "+lv+": "+L.txt;
  var m=document.createElement("button"),pl=document.createElement("button");m.textContent="−";pl.textContent="+";[m,pl].forEach(function(b){b.style.cssText="width:36px;padding:6px;font-size:16px;";});
  m.disabled=lv<=1;pl.disabled=lv>=3;m.onclick=function(){setLevel(lv-1);};pl.onclick=function(){setLevel(lv+1);};
  lvrow.appendChild(lt);lvrow.appendChild(m);lvrow.appendChild(pl);
  var my=document.createElement("div");my.style.cssText="display:flex;flex-wrap:wrap;gap:10px 16px;align-items:center;font-size:13px;margin:0 0 10px;padding:8px 10px;border-radius:8px;background:var(--surface-2,rgba(0,0,0,.04));";
  var ttl=document.createElement("span");ttl.style.cssText="width:100%;font-weight:500;";ttl.textContent="My numbers (your own defaults)";my.appendChild(ttl);
  function stepper(label,key,val,min,max,step,unit){var w=document.createElement("span");w.style.cssText="display:inline-flex;align-items:center;gap:6px;";var t=document.createElement("span");t.textContent=label;var m=document.createElement("button"),p=document.createElement("button"),v=document.createElement("span");
    [m,p].forEach(function(b){b.style.cssText="width:32px;padding:4px;font-size:16px;";});m.textContent="−";p.textContent="+";v.style.cssText="min-width:42px;text-align:center;font-weight:500;"+(C[key]?"":"opacity:.6;");v.textContent=val+(unit||"");
    m.disabled=val<=min;p.disabled=val>=max;m.onclick=function(){setCd(key,Math.max(min,val-step));};p.onclick=function(){setCd(key,Math.min(max,val+step));};w.appendChild(t);w.appendChild(m);w.appendChild(v);w.appendChild(p);return w;}
  my.appendChild(stepper("Reps","reps",C.reps||L.reps,5,25,1,""));
  my.appendChild(stepper("Sets","sets",C.sets||L.sets,1,4,1,""));
  my.appendChild(stepper("Stretch hold","hold",C.hold||30,10,60,5," s"));
  var rs=document.createElement("button");rs.textContent="Reset";rs.style.cssText="font-size:12px;padding:4px 10px;";rs.disabled=!(C.reps||C.sets||C.hold);rs.onclick=function(){try{localStorage.removeItem(DK);}catch(e){}render();if(window.kneeRefresh)window.kneeRefresh();};my.appendChild(rs);
  var mynote=document.createElement("span");mynote.style.cssText="width:100%;font-size:12px;color:var(--text-secondary);";mynote.textContent="Faded numbers are the automatic level values. Tap + or − to set your own; they apply to every exercise and are counted out loud.";my.appendChild(mynote);
  var plan=document.createElement("div");plan.style.cssText="margin:0 0 10px;font-size:13px;line-height:1.45;";
  var ph=document.createElement("div");ph.style.cssText="font-weight:500;margin:0 0 4px;";ph.textContent="Your next 7 days";plan.appendChild(ph);
  var nm=function(a){return a.map(function(i){return ex[i].n;}).join(", ");};
  var strongTxt=(C.sets||L.sets)+" sets of "+(C.reps||L.reps)+(L.slow?", lower slowly for 3 s":"");
  var pl7=plan7(l);
  pl7.forEach(function(x,j){var r=document.createElement("div");
    r.style.cssText="display:flex;gap:8px;padding:6px 8px;border-radius:8px;margin:0 0 3px;"+(j===0?"background:var(--bg-accent);":"border:1px solid var(--border-strong);");
    var tag=x.done?"Done ✓":x.s?"STRENGTH":"Rest",body=x.done?"Strength session done.":x.s?nm(HARDLIST)+". "+strongTxt+".":"No strength. Stretches or an easy walk if you like.";
    r.innerHTML='<div style="width:34px;font-weight:500;">'+x.name.slice(0,3)+(j===0?"*":"")+'</div><div style="width:76px;font-weight:500;">'+tag+'</div><div style="flex:1;color:var(--text-secondary);">'+body+'</div>';plan.appendChild(r);});
  var diff=document.createElement("div");diff.style.cssText="font-size:12px;color:var(--text-secondary);margin:4px 0 0;";diff.textContent="Next 7 days (* = today). Rule: the same muscles about 48 hours apart, at most 3 strength sessions in any 7 days (general strength-training guidance, not a protocol for your exact knee).";plan.appendChild(diff);
  var wk=document.createElement("div");wk.style.cssText="display:flex;gap:6px;margin:0 0 8px;";
  var now=new Date(),dow=(now.getDay()+6)%7;
  for(var i=0;i<7;i++){var d=new Date(now);d.setDate(now.getDate()-dow+i);var e=l[key(d)]||{},isT=i===dow,mark=e.h?"S":e.m?"m":"·";
    var c=document.createElement("div");c.style.cssText="flex:1;text-align:center;font-size:11px;color:var(--text-secondary);";
    c.innerHTML='<div style="width:24px;height:24px;border-radius:50%;margin:0 auto 2px;line-height:20px;font-size:12px;border:2px solid '+(isT?'var(--border-accent)':'var(--border-strong)')+';background:'+(e.h?'#1D9E75':'transparent')+';color:'+(e.h?'#fff':'var(--text-primary)')+';">'+mark+'</div>'+"MTWTFSS".charAt(i);(function(dk,fut){if(fut)return;c.style.cursor="pointer";c.onclick=function(){var L2=load(),e2=L2[dk]||{};if(e2.h){delete e2.h;}else{e2.h=1;}L2[dk]=e2;save(L2);render();};})(key(d),i>dow);wk.appendChild(c);}
  var rule=document.createElement("p");rule.style.cssText="font-size:12px;color:var(--text-secondary);margin:0;line-height:1.5;";
  rule.textContent="Strength is the main work (your physio's advice); stretching is a bonus. Tap a day in the week strip to mark a strength session you did outside the app. S = strength, m = stretches. Go up a level when the last set feels easy (2 extra reps) two sessions in a row and the knee is no worse next morning. Pain 3/10 or below. Tell your physio if the left knee swells.";
  box.appendChild(h);box.appendChild(p);box.appendChild(row);box.appendChild(lvrow);box.appendChild(my);box.appendChild(wk);box.appendChild(plan);box.appendChild(rule);root.appendChild(box);
}
render();
})();
