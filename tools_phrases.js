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
for(let i=1;i<=15;i++)out.add(String(i));
['5','4','3','2','1','10','9','8','7','6','Last one','Ease in','Release','20 seconds','10 seconds','Rest. Next hold coming up.','Set done. Rest.',"That's everything. Great work. Remember to note how your knees feel tomorrow.",'Nice work.',"This is how I will sound. Breathe in, and let's begin. One. Two. Three."].forEach(x=>out.add(x));
ctx.ex.forEach((e,i)=>{out.add('Next: '+e.n+'. '+e.say+(e.each?' Start with your right '+e.unit+'.':''));out.add(e.n+' done.');if(e.each)out.add('Switch to your left '+e.unit+'.');split(e.v).forEach(s=>out.add(s));split(e.fv).forEach(s=>out.add(s));});
Object.values(ctx.VT).forEach(t=>split(t).forEach(s=>out.add(s)));
Object.values(ctx.FT).forEach(o=>Object.values(o).forEach(t=>split(t).forEach(s=>out.add(s))));
Object.values(ctx.EX).forEach(t=>split(t).forEach(s=>out.add(s)));
const W={1:"one",2:"two",3:"three",10:"ten",12:"twelve",15:"fifteen",30:"thirty"};
const cap=s=>s[0].toUpperCase()+s.slice(1);
ctx.ex.forEach(e=>{out.add('Next: '+e.n+'.');if(e.each)out.add('Start with your right '+e.unit+'.');
 if(e.H){out.add('One hold of '+W[e.H]+' seconds'+(e.each?' on each '+e.unit:'')+'.');}
 else[[1,10],[2,10],[3,12],[3,15]].forEach(c=>out.add(cap(W[c[0]])+' '+(c[0]===1?'set':'sets')+' of '+W[c[1]]+(e.each?' on each '+e.unit:'')+'.'));});
out.add('Lower slowly, for three seconds.');
console.log(JSON.stringify([...out]));
