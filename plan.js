/* Today's plan: easy day / hard day, levels, and a small log. Stays on the phone. */
(function(){
var K="knee-plan-log",LV="knee-level",$=function(i){return document.getElementById(i);};
var DAYS=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],HARD={1:1,3:1,5:1};
var LEVELS={1:{sets:2,reps:10,slow:false,txt:"2 sets of 10"},2:{sets:3,reps:12,slow:true,txt:"3 sets of 12, slow 3-second lowering"},3:{sets:3,reps:15,slow:true,txt:"3 sets of 15, slow 3-second lowering"}};
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
  else why="Easy day: stretches and the light circuit. Keep the knees moving.";
  return {hard:hard,why:why,name:DAYS[d]};
}
function today(l){return info(l,0);}
function nextHard(l){for(var i=1;i<=7;i++){var d=ago(-i);if(HARD[d.getDay()])return DAYS[d.getDay()];}return "";}
window.kneePlanDone=function(kind){var l=load(),k=key();l[k]=l[k]||{};if(kind==="hard")l[k].h=1;else if(kind==="easy")l[k].e=1;else l[k].m=1;save(l);render();};
function btn(txt,fn,primary){var b=document.createElement("button");b.textContent=txt;b.style.cssText="flex:1;min-width:140px;font-size:13px;padding:10px;text-align:left;"+(primary?"border-color:var(--border-accent);background:var(--bg-accent);color:var(--text-accent);":"");b.onclick=fn;return b;}
function render(){
  var root=$("plan");if(!root)return;var l=load(),t=today(l),lv=level(),L=LEVELS[lv];
  root.innerHTML="";
  var box=document.createElement("div");box.style.cssText="background:var(--surface-1);border-radius:12px;padding:12px;margin:0 0 12px;";
  var h=document.createElement("div");h.style.cssText="display:flex;justify-content:space-between;align-items:baseline;gap:8px;";
  var done=hadHard(l,0),tm=info(l,1);if(done)t={hard:false,name:t.name,why:"Hard session done today. Tomorrow, "+tm.name+", is "+(tm.hard?"a hard day":"an easy day: stretches and the light circuit")+"."};
  h.innerHTML='<span style="font-weight:500;font-size:15px;">Today, '+t.name+': '+(done?"hard session done ✓":(t.hard?"hard day":"easy day"))+'</span><span style="font-size:12px;color:var(--text-secondary);">next hard day: '+nextHard(l)+'</span>';
  var p=document.createElement("p");p.style.cssText="font-size:13px;color:var(--text-secondary);margin:6px 0 10px;line-height:1.5;";p.textContent=t.why;
  var row=document.createElement("div");row.style.cssText="display:flex;gap:8px;flex-wrap:wrap;margin:0 0 10px;";
  row.appendChild(btn("▶ Morning: stretches\n5 exercises, about 8 min",function(){kneeStart(MORNING,{sets:1,quiet:true},"morning");},false));
  if(done){}
  else if(t.hard)row.appendChild(btn("▶ Evening: hard day\nLevel "+lv+", "+L.txt+", 6 exercises",function(){kneeStart(HARDLIST,{sets:L.sets,reps:L.reps,slow:L.slow,quiet:true},"hard");},true));
  else row.appendChild(btn("▶ Evening: easy circuit\n4 exercises, 2 sets of 10",function(){kneeStart(EASY,{sets:2,reps:10,quiet:true},"easy");},true));
  [].forEach.call(row.children,function(b){b.style.whiteSpace="pre-line";});
  var lvrow=document.createElement("div");lvrow.style.cssText="display:flex;align-items:center;gap:8px;font-size:13px;margin:0 0 10px;flex-wrap:wrap;";
  var lt=document.createElement("span");lt.style.flex="1";lt.textContent="Level "+lv+": "+L.txt;
  var m=document.createElement("button"),pl=document.createElement("button");m.textContent="−";pl.textContent="+";[m,pl].forEach(function(b){b.style.cssText="width:36px;padding:6px;font-size:16px;";});
  m.disabled=lv<=1;pl.disabled=lv>=3;m.onclick=function(){setLevel(lv-1);};pl.onclick=function(){setLevel(lv+1);};
  lvrow.appendChild(lt);lvrow.appendChild(m);lvrow.appendChild(pl);
  var wk=document.createElement("div");wk.style.cssText="display:flex;gap:6px;margin:0 0 8px;";
  var now=new Date(),dow=(now.getDay()+6)%7;
  for(var i=0;i<7;i++){var d=new Date(now);d.setDate(now.getDate()-dow+i);var e=l[key(d)]||{},isT=i===dow,mark=e.h?"H":e.e?"E":e.m?"m":"·";
    var c=document.createElement("div");c.style.cssText="flex:1;text-align:center;font-size:11px;color:var(--text-secondary);";
    c.innerHTML='<div style="width:24px;height:24px;border-radius:50%;margin:0 auto 2px;line-height:20px;font-size:12px;border:2px solid '+(isT?'var(--border-accent)':'var(--border-strong)')+';background:'+(e.h?'#1D9E75':'transparent')+';color:'+(e.h?'#fff':'var(--text-primary)')+';">'+mark+'</div>'+"MTWTFSS".charAt(i);wk.appendChild(c);}
  var rule=document.createElement("p");rule.style.cssText="font-size:12px;color:var(--text-secondary);margin:0;line-height:1.5;";
  rule.textContent="H = hard day, E = easy circuit, m = morning stretches. Go up a level when the last set feels easy (2 extra reps) two sessions in a row and the knee is no worse next morning. Pain 3/10 or below. Tell your physio if the left knee swells.";
  box.appendChild(h);box.appendChild(p);box.appendChild(row);box.appendChild(lvrow);box.appendChild(wk);box.appendChild(rule);root.appendChild(box);
}
render();
})();
