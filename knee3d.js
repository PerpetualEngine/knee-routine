(function(){
if(!window.THREE||!THREE.OrbitControls){document.getElementById('pname').textContent='The 3D library could not load. Try again in a moment.';return;}
var cv=document.getElementById('c'),W=cv.clientWidth||380,H=380;
var renderer=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true});
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));renderer.setSize(W,H,false);
var scene=new THREE.Scene();
var camera=new THREE.PerspectiveCamera(38,W/H,1,400);
camera.position.set(34,8,40);
var controls=new THREE.OrbitControls(camera,cv);
controls.target.set(0,0,0);controls.enableDamping=true;controls.enablePan=false;controls.minDistance=20;controls.maxDistance=90;controls.update();
scene.add(new THREE.HemisphereLight(0xffffff,0x8a8a8a,0.95));
var dl=new THREE.DirectionalLight(0xffffff,0.8);dl.position.set(25,35,45);scene.add(dl);
var dl2=new THREE.DirectionalLight(0xffffff,0.45);dl2.position.set(-30,10,-35);scene.add(dl2);
var knee=new THREE.Group();scene.add(knee);
var parts={},order=[];
function P(id,name,layer,desc){var g=new THREE.Group();knee.add(g);parts[id]={id:id,name:name,layer:layer,desc:desc,g:g,mats:[],hidden:false};order.push(id);return parts[id];}
function M(p,geo,color,rough){var mat=new THREE.MeshStandardMaterial({color:color,roughness:rough||0.6,metalness:0});p.mats.push(mat);var m=new THREE.Mesh(geo,mat);m.userData.pid=p.id;p.g.add(m);return m;}
function V(a){return new THREE.Vector3(a[0],a[1],a[2]);}
function place(m,a,b){var p1=V(a),p2=V(b),d=p2.clone().sub(p1);m.position.copy(p1).add(p2).multiplyScalar(0.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.clone().normalize());}
function C(p,a,b,rA,rB,color,sx,sz,rough){var len=V(a).distanceTo(V(b));var m=M(p,new THREE.CylinderGeometry(rB,rA,len,18),color,rough);place(m,a,b);m.scale.set(sx||1,1,sz||1);return m;}
function S(p,x,y,z,r,sx,sy,sz,color,rough){var m=M(p,new THREE.SphereGeometry(r,24,16),color,rough);m.position.set(x,y,z);m.scale.set(sx,sy,sz);return m;}
function B(p,a,b,maxR,color,sx,sz){var len=V(a).distanceTo(V(b)),pts=[],N=14,i,t,r;for(i=0;i<=N;i++){t=i/N;r=(i===0||i===N)?0.001:maxR*Math.pow(Math.sin(Math.PI*Math.pow(t,0.85)),0.8);pts.push(new THREE.Vector2(Math.max(r,0.001),(t-0.5)*len));}var m=M(p,new THREE.LatheGeometry(pts,22),color,0.8);place(m,a,b);m.scale.set(sx||1,1,sz||1);return m;}
function men(id,name,cx,th,gap,desc){var p=P(id,name,'menisci',desc);var g=new THREE.TorusGeometry(1.7,0.5,10,36,Math.PI*2-gap);g.rotateZ(th+gap/2);g.rotateX(-Math.PI/2);g.scale(1,0.55,1.15);var m=M(p,g,0xB8D3DC,0.5);m.position.set(cx,-1.22,-0.2);return p;}
var bone=0xE6DFC8,p;
p=P('femur','Femur (thigh bone)','bones','The long thigh bone. Its rounded lower end forms the top of the knee joint.');
C(p,[0,5.5,0],[0,25.5,0],2.7,2.4,bone,1,1,0.5);
C(p,[0,1.5,-0.3],[0,5.5,-0.3],4.3,2.7,bone,1,0.75,0.5);
S(p,2.0,1.2,-0.6,2.5,1,0.9,1.25,bone,0.5);
S(p,-2.0,1.2,-0.6,2.5,1,0.9,1.25,bone,0.5);
p=P('tibia','Tibia (shin bone)','bones','The main shin bone. Its flat top, the plateau, carries your body weight.');
C(p,[2.1,-2.3,-0.2],[2.1,-1.5,-0.2],2.2,2.2,bone,1,1.15,0.5);
C(p,[-2.1,-2.3,-0.2],[-2.1,-1.5,-0.2],2.2,2.2,bone,1,1.15,0.5);
C(p,[0,-5.3,-0.2],[0,-2.3,-0.2],2.4,4.2,bone,1,0.8,0.5);
C(p,[0,-20.3,-0.3],[0,-5.3,-0.3],1.5,2.4,bone,1,1,0.5);
S(p,0,-5.6,2.0,0.9,1,1.3,0.8,bone,0.5);
S(p,0.5,-1.3,-0.2,0.5,1,1.2,1,bone,0.5);
S(p,-0.5,-1.3,-0.2,0.5,1,1.2,1,bone,0.5);
p=P('fibula','Fibula','bones','The slim bone beside the shin. It anchors the outer ligament and a hamstring.');
S(p,-3.6,-3.8,-1.5,1.1,1,1,1,bone,0.5);
C(p,[-2.4,-20,-1.5],[-3.6,-4.8,-1.5],0.6,0.7,bone,1,1,0.5);
p=P('patella','Patella (kneecap)','bones','Glides in the groove of the femur. The cartilage on its back is the softening spot on your MRI.');
S(p,0,1.0,3.4,1.7,1.05,1.2,0.5,bone,0.5);
men('mm','Medial meniscus (inner)',2.1,Math.PI,1.2,'Inner shock absorber. On your right knee MRI it has a grade I signal at its back part.');
men('lm','Lateral meniscus (outer)',-2.1,0,0.9,'Outer shock absorber. Normal on both of your MRIs.');
p=P('acl','ACL (anterior cruciate)','ligaments','Stops the shin sliding forward under the thigh bone. Normal on both MRIs.');
C(p,[0.4,-1.5,0.9],[-0.8,1.2,-1.6],0.38,0.38,0xF2D06B,1,1,0.5);
p=P('pcl','PCL (posterior cruciate)','ligaments','Stops the shin sliding backward. Normal on both MRIs.');
C(p,[0.1,-1.5,-2.0],[0.9,1.0,0.3],0.42,0.42,0xE3A857,1,1,0.5);
p=P('mcl','MCL (inner side ligament)','ligaments','A broad band that steadies the inner knee against sideways force. Normal on your MRIs.');
C(p,[3.0,-9,-0.3],[4.8,0.4,-0.4],0.4,0.4,0xD9B45C,0.35,2.4,0.55);
p=P('lcl','LCL (outer side ligament)','ligaments','A thin cord that steadies the outer knee. Normal on your MRIs.');
C(p,[-3.6,-3.6,-1.4],[-4.8,0.4,-0.6],0.28,0.28,0xE8CB7D,1,1,0.5);
p=P('qt','Quadriceps tendon','tendons','Connects the quad muscles to the top of the kneecap.');
C(p,[0,2.4,3.5],[0,9,3.5],0.8,0.8,0xF1EBDD,1.9,0.5,0.45);
p=P('pt','Patellar tendon','tendons','Connects the kneecap to the shin bone just below the knee. This is where you feel pain under the kneecap.');
C(p,[0,-5.4,2.7],[0,-0.6,3.5],0.8,0.8,0xF1EBDD,1.5,0.5,0.45);
p=P('rf','Rectus femoris (quad)','muscles','Front of the thigh. Straightens the knee and lifts the hip.');
B(p,[0,22,4.1],[0,7,4.0],1.9,0xB5473C,1,0.85);
p=P('vl','Vastus lateralis (quad)','muscles','The biggest, outer quad. Helps hold the kneecap in line.');
B(p,[-3.4,22,1.5],[-3.7,4.5,1.3],2.0,0xA83F36,1,1);
p=P('vm','Vastus medialis (quad)','muscles','The inner quad. Its lower part steadies the kneecap, so it matters for your knees.');
B(p,[3.4,18,1.5],[2.8,2.0,2.6],1.9,0xC0554A,1,1);
p=P('vi','Vastus intermedius (quad)','muscles','A deep quad that sits under the rectus. Straightens the knee.');
B(p,[0,21,3.0],[0,6,3.1],1.5,0x9C3A32,1,0.6);
p=P('bf','Biceps femoris (hamstring)','muscles','Outer hamstring. Bends the knee and attaches near the top of the fibula.');
B(p,[-1.8,22,-3.9],[-4.0,-3.0,-2.0],1.6,0x8F3A33,1,0.9);
p=P('st','Semitendinosus (hamstring)','muscles','Inner hamstring. Bends the knee and turns the shin inward.');
B(p,[1.6,22,-3.9],[3.2,-5.5,-0.8],1.3,0xA14139,1,0.9);
p=P('gm','Gastrocnemius, inner head','muscles','Inner calf muscle. Crosses behind the knee down to the heel.');
B(p,[1.9,1.5,-3.8],[1.2,-14,-3.0],2.0,0x9E3B34,1,0.9);
p=P('gl','Gastrocnemius, outer head','muscles','Outer calf muscle. Crosses behind the knee down to the heel.');
B(p,[-1.9,1.5,-3.8],[-1.2,-14,-3.0],1.9,0xA84239,1,0.9);
p=P('ta','Tibialis anterior','muscles','Shin muscle at the front of the lower leg. Lifts the foot.');
B(p,[-1.6,-4.0,2.9],[-0.5,-18,2.5],1.3,0xB04A40,1,0.8);
var VT={
femur:"The femur is your thigh bone, the longest and strongest bone in the body. Its rounded lower end sits on top of the shin bone and forms the main hinge of the knee. At the front it has a shallow groove where the kneecap glides up and down every time you bend and straighten. If the kneecap does not track smoothly in that groove, the cartilage behind it takes extra pressure. That is the kind of irritation chondromalacia describes.",
tibia:"The tibia, or shin bone, is the main weight-bearing bone of the lower leg. Its flat top, called the plateau, carries your body weight through the knee, with the two menisci sitting on it like cushions. The inner side usually takes a little more load than the outer side, which is why wear-type changes often show up on the inner side first.",
fibula:"The fibula is the slim bone beside the shin. It carries very little body weight. Its job at the knee is to anchor the outer side ligament and the biceps femoris hamstring tendon, so think of it as a side anchor rather than a weight bearer.",
patella:"The patella, or kneecap, is a small bone sitting inside the quadriceps tendon. It works like a pulley, giving your quads more leverage when you straighten the knee. The back of it is covered with thick cartilage that glides on the thigh bone. On your MRI, the cartilage on the inner part of the kneecap shows mild chondromalacia, which means early softening. It is mild, and it is why your physio wants strong quads and hips, and no deep squats for now, because deep bends press the kneecap hardest into its groove.",
mm:"The menisci are two C-shaped pads of tough cartilage between the thigh bone and the shin bone. They spread the load, absorb shock and help keep the joint stable. This one is the medial meniscus, on the inner side. On your right knee, the MRI shows a grade one signal in its back part, called the posterior horn. Grade one means a change inside the tissue, usually from wear, that does not reach the surface. It is not a tear, and signals like this are common, often without symptoms. On your left knee this meniscus looks normal.",
lm:"This is the lateral meniscus, the cushion on the outer side of the knee. It is more mobile than the inner one and is normal on both of your MRIs.",
acl:"The anterior cruciate ligament runs from the back of the thigh bone to the front of the shin. It stops the shin sliding forward and helps control twisting. It looks normal on both of your MRIs, so the front to back stability of your knees looks fine.",
pcl:"The posterior cruciate ligament is the stronger partner of the ACL. It crosses behind it and stops the shin sliding backward. It looks normal on both of your MRIs.",
mcl:"The medial collateral ligament is a broad band on the inner side of the knee. It stops the knee buckling inward and works closely with the inner meniscus. It looks normal on your MRIs.",
lcl:"The lateral collateral ligament is a thin cord on the outer side of the knee. It stops the knee bowing outward. It looks normal on your MRIs.",
qt:"The quadriceps tendon joins the four quad muscles to the top of the kneecap. When your quads contract, this tendon pulls the kneecap upward and the knee straightens. The strength exercises in your routine train the muscles feeding this tendon.",
pt:"The patellar tendon joins the kneecap to the shin bone just below the knee. Together with the quad tendon it passes the force of the thigh muscles down to the lower leg. Many people feel pain here in the front of the knee when it is irritated or overloaded.",
rf:"The rectus femoris is the quad muscle in the middle of the front of the thigh. It straightens the knee and also lifts the hip, because it crosses both joints. The straight leg raise trains it well, without bending the knee.",
vl:"The vastus lateralis is the biggest quad, on the outer side of the thigh. If it is much stronger or tighter than the inner quad, it can pull the kneecap slightly outward, which is one reason physios like to balance the quads.",
vm:"The vastus medialis is the inner quad, and its lower fibres run close to the kneecap. They help steady the kneecap and keep it gliding in its groove, so this muscle matters a lot for chondromalacia. Your quad exercises build it.",
vi:"The vastus intermedius is a deep quad that sits underneath the rectus femoris, right against the thigh bone. It is a pure knee straightener, and it works in every leg raise, mini squat and stair step.",
bf:"The biceps femoris is the outer hamstring. It bends the knee and attaches near the top of the fibula. Together with the inner hamstring it helps control the knee when you slow down or land.",
st:"The semitendinosus is the inner hamstring. It bends the knee and turns the shin inward. Keeping the hamstrings supple with the hamstring stretch helps the knee move freely.",
gm:"This is the inner head of the gastrocnemius, the calf muscle. It starts just above the knee and runs behind it down to the heel, so it crosses the knee joint and helps control it. Calf raises and the calf stretch look after it.",
gl:"This is the outer head of the gastrocnemius, the calf muscle. Like the inner head it crosses behind the knee, then joins the heel tendon. Strong, flexible calves absorb load with every step.",
ta:"The tibialis anterior is the muscle along the front of your shin. It lifts the foot upward, so your toes clear the ground when you walk."
};
order.forEach(function(id){parts[id].v=VT[id]||parts[id].desc;});
var FT={
patella:{both:"The amber patch on the back of the kneecap shows where your MRI found mild chondromalacia, on the inner side."},
mm:{R:"The amber patch at the back of this meniscus marks the grade one signal, the posterior horn, in your right knee."},
tibia:{R:"The amber band at the inner joint line marks the early degenerative changes in your right knee's inner joint space."}
};
var marks=[];
function patch(pid,x,y,z,sx,sy,sz,color,emis,side){var m=new THREE.Mesh(new THREE.SphereGeometry(1,20,14),new THREE.MeshStandardMaterial({color:color,emissive:emis,emissiveIntensity:0.55,roughness:0.5,transparent:true,opacity:0.72,depthTest:false,depthWrite:false}));m.renderOrder=6;m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.visible=false;m.userData.noPick=true;m.userData.side=side;parts[pid].g.add(m);marks.push(m);return m;}
function blob(x,y,z,sx,sy,sz,op){var m=new THREE.Mesh(new THREE.SphereGeometry(1,28,20),new THREE.MeshStandardMaterial({color:0x1e6fe0,emissive:0x1050b8,emissiveIntensity:0.9,roughness:0.3,transparent:true,opacity:op,depthWrite:false,depthTest:false}));m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.renderOrder=5;m.visible=false;m.userData.side='L';m.userData.noPick=true;knee.add(m);marks.push(m);return m;}
var AMB=0xEF9F27,AMBE=0xB36B00;
patch('patella',1.0,1.0,2.95,1.0,1.05,0.4,AMB,AMBE,'both');
patch('mm',2.3,-1.2,-2.1,1.1,0.7,0.95,AMB,AMBE,'R');
patch('tibia',4.1,-0.8,-0.3,0.5,1.1,1.6,AMB,AMBE,'R');
blob(0,0.3,0.6,4.8,2.7,4.4,0.28);
blob(0,4.6,2.4,2.7,2.4,1.2,0.45);
var layers=[['muscles','Muscles'],['tendons','Tendons'],['ligaments','Ligaments'],['menisci','Menisci'],['bones','Bones']];
var chipsEl=document.getElementById('chips'),chipBtns={};
layers.forEach(function(l){var b=document.createElement('button');b.textContent=l[1];b.style.cssText='font-size:12px;padding:6px 10px;';b.onclick=function(){var ids=order.filter(function(id){return parts[id].layer===l[0];});var allVis=ids.every(function(id){return !parts[id].hidden;});ids.forEach(function(id){parts[id].hidden=allVis;if(allVis&&sel===id)clearSel();});if(!allVis){stack=stack.filter(function(id){return parts[id].layer!==l[0];});}refresh();};chipsEl.appendChild(b);chipBtns[l[0]]=b;});
var sel=null,stack=[],side='R',findingsOn=true,vOn=true;
var nameEl=document.getElementById('pname'),descEl=document.getElementById('pdesc'),noteEl=document.getElementById('note');
function clearSel(){if(sel){parts[sel].mats.forEach(function(m){m.emissive.setHex(0x000000);});}sel=null;}
function findingFor(id){var f=FT[id];if(!f||!findingsOn)return '';return f[side]||f.both||'';}
var vTok=0;
function talk(text){var my=++vTok;if(window.stopSpeak)stopSpeak();if(!vOn||!window.kneeOpt||!kneeOpt.voice||!window.speakLong)return;window.kneeAudio&&kneeAudio();speakLong(text,function(){return my!==vTok;});}
function hush(){vTok++;if(window.stopSpeak)stopSpeak();}
function setSel(id){clearSel();sel=id;talk(parts[id].v+' '+findingFor(id));parts[id].mats.forEach(function(m){m.emissive.setHex(0x1D9E75);m.emissiveIntensity=0.7;});}
function refresh(){
order.forEach(function(id){parts[id].g.visible=!parts[id].hidden;});
layers.forEach(function(l){var ids=order.filter(function(id){return parts[id].layer===l[0];});var allVis=ids.every(function(id){return !parts[id].hidden;});var b=chipBtns[l[0]];b.style.borderColor=allVis?'var(--border-accent)':'';b.style.background=allVis?'var(--bg-accent)':'';b.style.color=allVis?'var(--text-accent)':'';});
marks.forEach(function(m){m.visible=findingsOn&&(m.userData.side==='both'||m.userData.side===side);});
if(sel){nameEl.textContent=parts[sel].name;descEl.textContent=parts[sel].desc+' Tap it again to hide it.';}else{nameEl.textContent='Tap a part to select it';descEl.textContent='Tap the selected part again to hide it and see what is underneath. Drag to rotate, pinch to zoom.';}
var hc=order.filter(function(id){return parts[id].hidden;}).length;
var txt=hc?hc+' hidden. Undo or Reset brings them back. ':'';
if(findingsOn){txt+=(side==='R'?'Amber = MRI findings in your right knee (kneecap cartilage, back of the inner meniscus, inner joint line). They glow through the tissue, and hide with the part they sit on.':'Amber = kneecap cartilage, inner side. Blue = the extra joint fluid (effusion) in your left knee. They glow through the tissue, and hide with the part they sit on.');}
noteEl.textContent=txt;
}
var ray=new THREE.Raycaster(),down=null;
cv.addEventListener('pointerdown',function(e){down={x:e.clientX,y:e.clientY,t:Date.now()};});
cv.addEventListener('pointerup',function(e){if(!down)return;var dx=e.clientX-down.x,dy=e.clientY-down.y,dt=Date.now()-down.t;down=null;if(Math.hypot(dx,dy)<6&&dt<500)pick(e);});
function pick(e){
var r=cv.getBoundingClientRect(),v=new THREE.Vector2(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1);
ray.setFromCamera(v,camera);
var list=[];order.forEach(function(id){if(!parts[id].hidden){parts[id].g.children.forEach(function(c){if(c.isMesh&&!c.userData.noPick)list.push(c);});}});
var hits=ray.intersectObjects(list,false);
if(!hits.length){clearSel();hush();refresh();return;}
var id=hits[0].object.userData.pid;
if(sel===id){parts[id].hidden=true;stack.push(id);clearSel();hush();}else{setSel(id);}
refresh();
}
document.getElementById('bSide').onclick=function(){side=side==='R'?'L':'R';knee.scale.x=side==='R'?1:-1;this.textContent=side==='R'?'Switch to left knee':'Switch to right knee';refresh();};
document.getElementById('bFind').textContent='Hide my findings';
document.getElementById('bFind').onclick=function(){findingsOn=!findingsOn;this.textContent=findingsOn?'Hide my findings':'Show my findings';refresh();};
var bV=document.getElementById('bVoice');bV.onclick=function(){vOn=!vOn;bV.textContent=vOn?'Voice: on':'Voice: off';if(!vOn)hush();};
var EX={R:'Your right knee. The MRI from the second of November shows three mild, early findings, drawn in amber. One: mild chondromalacia on the inner part of the back of the kneecap, which means the cartilage there has started to soften. Two: a grade one signal in the back part of the inner meniscus. That is a change inside the tissue, usually from wear, and it is not a tear. Three: early degenerative changes along the inner joint line. Your cruciate ligaments look normal. All of this is mild. Strong quads, hips and calves share the load, which takes pressure off these areas, and that is what your routine is built to do.',
L:'Your left knee. The MRI shows mild joint effusion, which is extra fluid inside the joint, drawn in blue. It collects above and behind the kneecap. Fluid is the knee reacting to irritation, and it usually settles as the irritation calms down. There is also mild chondromalacia on the inner side of the back of the kneecap, drawn in amber. Both menisci and both cruciate ligaments look normal. Keep exercise gentle, keep pain at three out of ten or below, and tell your physio if the swelling increases.'};
document.getElementById('bExplain').onclick=function(){if(!findingsOn){findingsOn=true;refresh();}talk(EX[side]);};
document.getElementById('bUndo').onclick=function(){while(stack.length){var id=stack.pop();if(parts[id].hidden){parts[id].hidden=false;break;}}refresh();};
document.getElementById('bReset').onclick=function(){order.forEach(function(id){parts[id].hidden=false;});stack=[];clearSel();refresh();};
refresh();
function loop(){requestAnimationFrame(loop);controls.update();renderer.render(scene,camera);}
loop();
})();
