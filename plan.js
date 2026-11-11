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
function load(){var l=null;try{l=JSON.parse(localStorage.getItem(K));}catch(e){}if(!l){l={"2026-11-04":{h:1},"2026-11-05":{h:1},"2026-11-06":{h:1}};save(l);}return l;}
function save(l){try{localStorage.setItem(K,JSON.stringify(l));}catch(e){}}
function level(){var v=1;try{v=+localStorage.getItem(LV)||2;}catch(e){v=2;}return Math.max(1,Math.min(3,v));}
function setLevel(v){try{localStorage.setItem(LV,String(v));}catch(e){}render();}
function hadHard(l,n){var e=l[key(ago(n))];return !!(e&&e.h);}
function info(l,off){
  var d=ago(-off).getDay(),hard=!!HARD[d],why,y=function(n){return hadHard(l,n-off);};
  if(y(1)&&y(2)&&y(3)){hard=false;why="You did the full routine 3 days in a row. Today is lighter, so the knees can adapt.";}
  else if(y(1)){hard=false;why="Yesterday was a hard day, so today is lighter.";}
  else if(hard)why="Hard day. Hard days are Monday, Wednesday and Friday, never back to back.";
  else why="Easy day: the light strength circuit. Strength is the main thing, stretches are optional.";
  return {hard:hard,why:why,name:DAYS[d]};
}
function today(l){return info(l,0);}
function nextHard(l){for(var i=1;i<=7;i++){var d=ago(-i);if(HARD[d.getDay()])return DAYS[d.getDay()];}return "";}
window.kneePlanDone=function(kind){var l=load(),k=key();l[k]=l[k]||{};if(kind==="hard")l[k].h=1;else if(kind==="easy")l[k].e=1;else l[k].m=1;save(l);render();};
function btn(txt,fn,primary){var b=document.createElement("button");b.textContent=txt;b.style.cssText="flex:1;min-width:140px;font-size:13px;padding:10px;text-align:left;"+(primary?"border-color:var(--border-accent);background:var(--bg-accent);color:var(--text-accent);":"");b.onclick=fn;return b;}
function render(){
  var root=$("plan");if(!root)return;var l=load(),t=today(l),lv=level(),L=LEVELS[lv],C=cd();
  root.innerHTML="";
  var box=document.createElement("div");box.style.cssText="background:var(--surface-1);border-radius:12px;padding:12px;margin:0 0 12px;";
  var h=document.createElement("div");h.style.cssText="display:flex;justify-content:space-between;align-items:baseline;gap:8px;";
  var done=hadHard(l,0),tm=info(l,1);if(done)t={hard:false,name:t.name,why:"Hard session done today. Tomorrow, "+tm.name+", is "+(tm.hard?"a hard day":"an easy day with the light strength circuit")+"."};
  h.innerHTML='<span style="font-weight:500;font-size:15px;">Today, '+t.name+': '+(done?"hard session done ✓":(t.hard?"hard day":"easy day"))+'</span><span style="font-size:12px;color:var(--text-secondary);">next hard day: '+nextHard(l)+'</span>';
  var p=document.createElement("p");p.style.cssText="font-size:13px;color:var(--text-secondary);margin:6px 0 10px;line-height:1.5;";p.textContent=t.why;
  var row=document.createElement("div");row.style.cssText="display:flex;gap:8px;flex-wrap:wrap;margin:0 0 10px;";
  if(done){}
  else if(t.hard)row.appendChild(btn("▶ STRENGTH: hard day\n6 exercises, "+(C.sets||L.sets)+" sets of "+(C.reps||L.reps)+(L.slow?", slow lowering":""),function(){kneeStart(HARDLIST,{sets:C.sets||L.sets,reps:C.reps||L.reps,slow:L.slow,quiet:true},"hard");},true));
  else row.appendChild(btn("▶ STRENGTH: easy circuit\n4 exercises, "+(C.sets||2)+" sets of "+(C.reps||10),function(){kneeStart(EASY,{sets:C.sets||2,reps:C.reps||10,quiet:true},"easy");},true));
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
  var ph=document.createElement("div");ph.style.cssText="font-weight:500;margin:0 0 4px;";ph.textContent="What to do each day";plan.appendChild(ph);
  var nm=function(a){return a.map(function(i){return ex[i].n;}).join(", ");};
  var strongTxt=(C.sets||L.sets)+" sets of "+(C.reps||L.reps)+(L.slow?", lower slowly for 3 s":"");
  var lightTxt=(C.sets||2)+" sets of "+(C.reps||10);
  var now2=new Date(),dow2=(now2.getDay()+6)%7;
  for(var j=0;j<7;j++){var dd=new Date(now2);dd.setDate(now2.getDate()-dow2+j);var en=l[key(dd)]||{},off=j-dow2,r=document.createElement("div");
    r.style.cssText="display:flex;gap:8px;padding:6px 8px;border-radius:8px;margin:0 0 3px;"+(off===0?"background:var(--bg-accent);":"border:1px solid var(--border-strong);");
    var tag,body,dn=DAYS[dd.getDay()].slice(0,3);
    if(off<0){tag=en.h?"Strong ✓":en.e?"Light ✓":"Rest";body=en.h?"Done: all 6 strength exercises.":en.e?"Done: light circuit.":"";}
    else{var inf=info(l,off);if(off===0&&(hadHard(l,0)||en.e)){tag=en.h?"Strong ✓":"Light ✓";body="Done today.";}else{tag=inf.hard?"STRONG":"Light";body=inf.hard?nm(HARDLIST)+". "+strongTxt+".":nm(EASY)+". "+lightTxt+". No squat or calf raise.";}}
    r.innerHTML='<div style="width:34px;font-weight:500;">'+dn+'</div><div style="width:64px;font-weight:500;">'+tag+'</div><div style="flex:1;color:var(--text-secondary);">'+body+'</div>';
    plan.appendChild(r);}
  var diff=document.createElement("div");diff.style.cssText="font-size:12px;color:var(--text-secondary);margin:4px 0 0;";diff.textContent="Difference: a strong day adds the mini squat and calf raise, does more sets, and lowers slowly. A light day keeps the four hip and thigh exercises and skips the two that load the knee most. Stretches are optional on any day.";plan.appendChild(diff);
  var wk=document.createElement("div");wk.style.cssText="display:flex;gap:6px;margin:0 0 8px;";
  var now=new Date(),dow=(now.getDay()+6)%7;
  for(var i=0;i<7;i++){var d=new Date(now);d.setDate(now.getDate()-dow+i);var e=l[key(d)]||{},isT=i===dow,mark=e.h?"H":e.e?"E":e.m?"m":"·";
    var c=document.createElement("div");c.style.cssText="flex:1;text-align:center;font-size:11px;color:var(--text-secondary);";
    c.innerHTML='<div style="width:24px;height:24px;border-radius:50%;margin:0 auto 2px;line-height:20px;font-size:12px;border:2px solid '+(isT?'var(--border-accent)':'var(--border-strong)')+';background:'+(e.h?'#1D9E75':'transparent')+';color:'+(e.h?'#fff':'var(--text-primary)')+';">'+mark+'</div>'+"MTWTFSS".charAt(i);wk.appendChild(c);}
  var rule=document.createElement("p");rule.style.cssText="font-size:12px;color:var(--text-secondary);margin:0;line-height:1.5;";
  rule.textContent="Strength is the main work (your physio's advice); stretching is a bonus. H = hard day, E = easy circuit, m = optional stretches. Go up a level when the last set feels easy (2 extra reps) two sessions in a row and the knee is no worse next morning. Pain 3/10 or below. Tell your physio if the left knee swells.";
  box.appendChild(h);box.appendChild(p);box.appendChild(row);box.appendChild(lvrow);box.appendChild(my);box.appendChild(wk);box.appendChild(plan);box.appendChild(rule);root.appendChild(box);
}
render();
})();
