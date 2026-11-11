// dumps every phrase the app can speak (used by gen_audio.py)
const fs=require('fs'),vm=require('vm');
const ctx={};vm.createContext(ctx);
vm.runInContext(fs.readFileSync('exdata.js','utf8')+';this.ex=ex;',ctx);
const r=fs.readFileSync('routine.js','utf8');
vm.runInContext(r.slice(r.indexOf('var META=['),r.indexOf('];\nex.forEach')+2)+';this.META=META;',ctx);
const k=fs.readFileSync('knee3d.js','utf8');
const grab=(a,b)=>k.slice(k.indexOf(a),k.indexOf(b));
vm.runInContext(grab('var VT={','order.forEach')+grab('var FT={','var marks=[]')+';this.VT=VT;this.FT=FT;',ctx);
vm.runInContext(grab('var EX={R:',"document.getElementById('bExplain')")+';this.EX=EX;',ctx);
ctx.ex.forEach((e,i)=>Object.assign(e,ctx.META[i]));
const split=t=>(t.match(/[^.!?]+[.!?]*/g)||[t]).map(s=>s.trim()).filter(Boolean);
const out=new Set();
for(let i=1;i<=25;i++)out.add(String(i));
['5','4','3','2','1','10','9','8','7','6','Last one','Ease in','Release','30 seconds','20 seconds','10 seconds','Rest. Next hold coming up.','Set done. Rest.',"That's everything. Great work. Remember to note how your knees feel tomorrow.",'Nice work.',"This is how I will sound. Breathe in, and let's begin. One. Two. Three."].forEach(x=>out.add(x));
ctx.ex.forEach((e,i)=>{out.add('Next: '+e.n+'. '+e.say+(e.each?' Start with your right '+e.unit+'.':''));out.add(e.n+' done.');if(e.each)out.add('Switch to your left '+e.unit+'.');split(e.v).forEach(s=>out.add(s));split(e.fv).forEach(s=>out.add(s));});
Object.values(ctx.VT).forEach(t=>split(t).forEach(s=>out.add(s)));
Object.values(ctx.FT).forEach(o=>Object.values(o).forEach(t=>split(t).forEach(s=>out.add(s))));
Object.values(ctx.EX).forEach(t=>split(t).forEach(s=>out.add(s)));
const NWS=["zero","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen","twenty"],NWT={30:"thirty",35:"thirty-five",40:"forty",45:"forty-five",50:"fifty",55:"fifty-five",60:"sixty",25:"twenty-five"};
const nw=n=>NWT[n]||NWS[n];
const cap=s=>s[0].toUpperCase()+s.slice(1);
ctx.ex.forEach(e=>{out.add('Next: '+e.n+'.');if(e.each)out.add('Start with your right '+e.unit+'.');
 const eachT=e.each?' on each '+e.unit:'';
 if(e.H){for(let s=1;s<=3;s++)for(let h=10;h<=60;h+=5)out.add(cap(nw(s))+' '+(s===1?'hold':'holds')+' of '+nw(h)+' seconds'+eachT+'.');}
 else{for(let s=1;s<=4;s++)for(let r=5;r<=25;r++)out.add(cap(nw(s))+' '+(s===1?'set':'sets')+' of '+nw(r)+eachT+'.');}});
out.add('Lower slowly, for three seconds.');
console.log(JSON.stringify([...out]));
