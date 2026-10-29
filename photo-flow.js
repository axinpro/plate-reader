// Photo-first flow: no saved rig and no recognition against a live preview.
rig=null;$('reuse').checked=false;
['saveRig','reuse','rigStatus'].forEach(id=>{let el=$(id);if(id==='reuse')el.parentElement.hidden=true;else el.hidden=true;});
$('camera').closest('.card').querySelector('p').textContent='整板入镜、12列大致水平。拍照后自动找孔。';
$('capture').textContent='拍照并自动找孔';
$('capture').onclick=()=>{let v=$('video');if(!stream||!v.videoWidth)return alert('请先开启相机');let shot=document.createElement('canvas');shot.width=v.videoWidth;shot.height=v.videoHeight;shot.getContext('2d').drawImage(v,0,0);loadPhoto(shot.toDataURL('image/png'),true);};
paintGuide=function(){let g=$('guide');g.getContext('2d').clearRect(0,0,g.width,g.height);};paintGuide();
const previousPhotoLoad=loadPhoto;loadPhoto=function(...args){rig=null;$('reuse').checked=false;$('aligned').checked=false;previousPhotoLoad(...args);};
let photoGeneration=0;
async function afterPhotoLoaded(){let generation=++photoGeneration;let current=img;$('step').textContent='正在自动识别孔位…';await $('autoDetect').onclick();if(generation!==photoGeneration||img!==current)return;if(wellCenters?.length===96&&corners.length===4){analyze();$('step').textContent='已识别96孔。可拖动孔圈调整，检查后确认对齐。';$('positionStatus').textContent='已自动找孔；请检查A1方向与取样圈。';}else{$('step').textContent='自动识别未通过，请重拍或手动定位。';}}
// Loaded batch settings must never restore a camera-position template.
$('batchSelect').addEventListener('change',()=>{rig=null;$('reuse').checked=false;paintGuide();});
