// Photo-first flow: no saved rig and no recognition against a live preview.
rig=null;$('reuse').checked=false;
['saveRig','reuse','rigStatus'].forEach(id=>{let el=$(id);if(id==='reuse')el.parentElement.hidden=true;else el.hidden=true;});
$('camera').closest('.card').querySelector('p').textContent='整板入镜、12列大致水平。拍照后自动找孔。';
$('capture').textContent='拍照并自动找孔';
function plateCrop(width,height){const ratio=1.5;let w=width,h=height;if(width/height>ratio)w=height*ratio;else h=width/ratio;return {x:(width-w)/2,y:(height-h)/2,width:w,height:h};}
$('capture').onclick=()=>{let v=$('video');if(!stream||!v.videoWidth)return alert('请先开启相机');let crop=plateCrop(v.videoWidth,v.videoHeight),shot=document.createElement('canvas');shot.width=Math.round(crop.width);shot.height=Math.round(crop.height);shot.getContext('2d').drawImage(v,crop.x,crop.y,crop.width,crop.height,0,0,shot.width,shot.height);loadPhoto(shot.toDataURL('image/png'),true);};
paintGuide=function(){let g=$('guide');g.getContext('2d').clearRect(0,0,g.width,g.height);};paintGuide();
const previousPhotoLoad=loadPhoto;loadPhoto=function(...args){rig=null;$('reuse').checked=false;$('aligned').checked=false;previousPhotoLoad(...args);};
let photoGeneration=0,estimatedPositions=false;
function fallbackCenters(width,height){let pitch=Math.min(width*.86/11,height*.80/7);return Array.from({length:96},(_,i)=>[width/2+(i%12-5.5)*pitch,height/2+(Math.floor(i/12)-3.5)*pitch]);}
async function afterPhotoLoaded(){let generation=++photoGeneration;let current=img;estimatedPositions=false;$('step').textContent='正在自动识别孔位…';await $('autoDetect').onclick();if(generation!==photoGeneration||img!==current)return;if(wellCenters?.length===96&&corners.length===4){analyze();$('step').textContent='已识别96孔，可逐孔拖动调整。';$('positionStatus').textContent='请检查A1方向与取样圈。';}else{estimatedPositions=true;wellCenters=fallbackCenters(cv.width,cv.height);corners=[wellCenters[0],wellCenters[11],wellCenters[95],wellCenters[84]];$('radius').value=Math.max(3,Math.round(Math.abs(wellCenters[1][0]-wellCenters[0][0])*.22));mark=false;anchorMode=false;invalidatePosition();analyze();$('step').textContent='自动识别未通过，已生成96个估算孔圈。';$('positionStatus').textContent='橙圈为估算位置。逐孔拖到真实孔中心，全部检查后确认对齐。';}}
const preEstimateAnalyze=analyze;analyze=function(){preEstimateAnalyze();if(estimatedPositions&&!$('aligned').checked&&data.length){valid=false;data.forEach(d=>d.auto='待复核');render();$('notice').textContent='估算孔位尚未确认，请调整全部孔圈后确认对齐。';}draw();};$('analyze').onclick=analyze;
const preEstimateDraw=draw;draw=function(){preEstimateDraw();if(!img||!estimatedPositions||!wellCenters)return;ctx.strokeStyle='#d97706';wells.forEach((w,i)=>{let [x,y]=center(i);ctx.beginPath();ctx.arc(x,y,+$('radius').value,0,Math.PI*2);ctx.stroke();});};
$('aligned').addEventListener('change',()=>{if(data.length)analyze();});
$('camera').closest('.card').querySelector('p').textContent='将整块板放入横向画面，拍照后每个孔圈都可拖动。';
$('video').parentElement.classList.add('plate-camera');
// Loaded batch settings must never restore a camera-position template.
$('batchSelect').addEventListener('change',()=>{rig=null;$('reuse').checked=false;paintGuide();});
