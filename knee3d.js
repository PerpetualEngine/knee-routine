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
var marks=[];
function mark(pid,x,y,z,side){var m=new THREE.Mesh(new THREE.SphereGeometry(0.55,16,12),new THREE.MeshStandardMaterial({color:0xEF9F27,emissive:0xB36B00,emissiveIntensity:0.9,roughness:0.4}));m.position.set(x,y,z);m.visible=false;m.userData.noPick=true;m.userData.side=side;parts[pid].g.add(m);marks.push(m);}
mark('patella',0.9,1.0,2.6,'both');
mark('mm',2.3,-1.2,-2.5,'R');
var layers=[['muscles','Muscles'],['tendons','Tendons'],['ligaments','Ligaments'],['menisci','Menisci'],['bones','Bones']];
var chipsEl=document.getElementById('chips'),chipBtns={};
layers.forEach(function(l){var b=document.createElement('button');b.textContent=l[1];b.style.cssText='font-size:12px;padding:6px 10px;';b.onclick=function(){var ids=order.filter(function(id){return parts[id].layer===l[0];});var allVis=ids.every(function(id){return !parts[id].hidden;});ids.forEach(function(id){parts[id].hidden=allVis;if(allVis&&sel===id)clearSel();});if(!allVis){stack=stack.filter(function(id){return parts[id].layer!==l[0];});}refresh();};chipsEl.appendChild(b);chipBtns[l[0]]=b;});
var sel=null,stack=[],side='R',findingsOn=false;
var nameEl=document.getElementById('pname'),descEl=document.getElementById('pdesc'),noteEl=document.getElementById('note');
function clearSel(){if(sel){parts[sel].mats.forEach(function(m){m.emissive.setHex(0x000000);});}sel=null;}
function setSel(id){clearSel();sel=id;parts[id].mats.forEach(function(m){m.emissive.setHex(0x1D9E75);m.emissiveIntensity=0.7;});}
function refresh(){
order.forEach(function(id){parts[id].g.visible=!parts[id].hidden;});
layers.forEach(function(l){var ids=order.filter(function(id){return parts[id].layer===l[0];});var allVis=ids.every(function(id){return !parts[id].hidden;});var b=chipBtns[l[0]];b.style.borderColor=allVis?'var(--border-accent)':'';b.style.background=allVis?'var(--bg-accent)':'';b.style.color=allVis?'var(--text-accent)':'';});
marks.forEach(function(m){m.visible=findingsOn&&(m.userData.side==='both'||side==='R');});
if(sel){nameEl.textContent=parts[sel].name;descEl.textContent=parts[sel].desc+' Tap it again to hide it.';}else{nameEl.textContent='Tap a part to select it';descEl.textContent='Tap the selected part again to hide it and see what is underneath. Drag to rotate, pinch to zoom.';}
var hc=order.filter(function(id){return parts[id].hidden;}).length;
var txt=hc?hc+' hidden. Undo or Reset brings them back. ':'';
if(findingsOn){txt+=(side==='R'?'Amber dots: kneecap cartilage and the back part of the inner meniscus. Hide the femur to see the kneecap dot.':'Amber dot: kneecap cartilage, inner side. Hide the femur to see it. The joint fluid cannot be drawn here.');}
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
if(!hits.length){clearSel();refresh();return;}
var id=hits[0].object.userData.pid;
if(sel===id){parts[id].hidden=true;stack.push(id);clearSel();}else{setSel(id);}
refresh();
}
document.getElementById('bSide').onclick=function(){side=side==='R'?'L':'R';knee.scale.x=side==='R'?1:-1;this.textContent=side==='R'?'Switch to left knee':'Switch to right knee';refresh();};
document.getElementById('bFind').onclick=function(){findingsOn=!findingsOn;this.textContent=findingsOn?'Hide my findings':'Show my findings';refresh();};
document.getElementById('bUndo').onclick=function(){while(stack.length){var id=stack.pop();if(parts[id].hidden){parts[id].hidden=false;break;}}refresh();};
document.getElementById('bReset').onclick=function(){order.forEach(function(id){parts[id].hidden=false;});stack=[];clearSel();refresh();};
refresh();
function loop(){requestAnimationFrame(loop);controls.update();renderer.render(scene,camera);}
loop();
})();
