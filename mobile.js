const help=document.createElement('div');help.id='installHelp';help.textContent='iPhone：在 Safari 打开 HTTPS 地址，点分享 → 添加到主屏幕。首次联网加载后可离线打开。请固定手机与灯光，改变方向后检查机位。';document.querySelector('h1').after(help);
let nav=document.createElement('nav');nav.className='mobile-nav';[['拍摄','camera'],['校准','batchName'],['结果','heat'],['记录','history']].forEach(([label,id])=>{let b=document.createElement('button');b.textContent=label;b.onclick=()=>$(id).closest('.card').scrollIntoView({behavior:'smooth',block:'start'});nav.append(b);});help.after(nav);
if(!window.isSecureContext)help.textContent='当前不是安全网页地址：iPhone 实时相机和离线安装需通过 HTTPS 打开。仍可选择照片进行分析。';
if('serviceWorker' in navigator&&location.protocol!=='file:')navigator.serviceWorker.register('./sw.js').catch(()=>{help.textContent+=' 离线缓存未启用，请保持联网。';});
// Keep the camera overlay synchronized with the actual video dimensions.
$('video').addEventListener('resize',paintGuide);
document.addEventListener('visibilitychange',()=>{if(document.hidden&&stream){stream.getTracks().forEach(t=>t.stop());stream=null;$('video').srcObject=null;$('cameraStatus').textContent='已暂停相机，返回后点击开启相机';}});
const oldRecordResult=recordResult;
recordResult=function(){let before=history.length;oldRecordResult();if(history.length>before)saveHistory();};saveRecord.onclick=recordResult;
function saveHistory(){try{localStorage.setItem('plate-history-v1',JSON.stringify({sequence,history}));$('history').textContent+=' · 已保存到本机';}catch(e){$('history').textContent+=' · 本机保存失败，请立即导出';}}
try{let saved=JSON.parse(localStorage.getItem('plate-history-v1')||'null');if(saved&&Array.isArray(saved.history)){history=saved.history;sequence=Number(saved.sequence)||0;$('history').textContent='已恢复本机记录 '+history.length+' 组，请及时导出备份。';}}catch(e){}
const oldClear=$('historyClear').onclick;$('historyClear').onclick=()=>{oldClear();saveHistory();};
const oldDownload=download;
download=function(name,text,type){let file=new File([text],name,{type});if(navigator.canShare&&navigator.canShare({files:[file]})&&/iPhone|iPad/.test(navigator.userAgent)){navigator.share({files:[file],title:name}).catch(e=>{if(e.name!=='AbortError')oldDownload(name,text,type);});}else oldDownload(name,text,type);};
