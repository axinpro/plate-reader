const bacteria=new URLSearchParams(location.search).get('module')==='bacteria';
const picker=document.createElement('div');picker.className='card';picker.innerHTML='<h2>选择模块</h2><p><a href="?module=mycoplasma">支原体 · 颜色判读</a></p><p><a href="?module=bacteria">细菌 · 沉淀判读</a></p>';document.querySelector('h1').before(picker);
if(!new URLSearchParams(location.search).has('module')){Array.from(document.querySelectorAll('body > .card')).forEach(el=>{if(el!==picker)el.hidden=true;});document.querySelector('h1').textContent='96孔板药敏分析';}
if(bacteria){
document.title='细菌沉淀分析';document.querySelector('h1').textContent='细菌药敏分析 · 沉淀信号';document.querySelector('h1').nextElementSibling.textContent='G12：无药有菌生长对照；H12：培养基阴性对照。检出沉淀提示仍有生长信号。';
$('refBase').value='H12';$('refMin').value='G12';$('refEnd').value='G12';$('freeze').disabled=true;$('freeze').textContent='逐板对照校准';$('unfreeze').hidden=true;$('profileIn').disabled=true;$('profileOut').disabled=true;$('batchStatus').textContent='每板以G12/H12校准。';$('swatches').innerHTML='';batch=null;
[$('refBase'),$('refMin'),$('refEnd')].forEach(e=>e.disabled=true);
let settings=document.createElement('div');settings.innerHTML='沉淀阈值<input id="sedThreshold" type="number" min="1" max="99" value="35"><p>H12=0，G12=100。默认阈值35，需验证。</p>';$('batchStatus').after(settings);
$('controls').parentElement.lastChild.textContent=' 已确认G12阳性、H12阴性';$('endpoint').parentElement.lastChild.textContent=' 已确认MIC终点规则';
referenceWells=()=>['G12','H12'];
referenceColors=()=>({base:data[95],min:data[83],end:data[83]});
const colorAnalyze=analyze;
analyze=function(){colorAnalyze();if(!data.length||!raw)return;let spacing=Math.hypot(...center(1).map((n,k)=>n-center(0)[k])),r=spacing*.36;
function measure(i){let [cx,cy]=center(i),core=[],ring=[],bad=0,n=0;for(let y=Math.floor(cy-r);y<=cy+r;y++)for(let x=Math.floor(cx-r);x<=cx+r;x++){let d=Math.hypot(x-cx,y-cy)/r;if(d>1)continue;n++;if(x<0||y<0||x>=cv.width||y>=cv.height){bad++;continue;}let p=4*(y*cv.width+x),rgb=[raw[p],raw[p+1],raw[p+2]],l=.2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2];if(Math.max(...rgb)>250||Math.min(...rgb)<8){bad++;continue;}if(d<.38)core.push(l);else if(d>.65)ring.push(l);}let median=a=>{a.sort((a,b)=>a-b);return a.length?a[Math.floor(a.length/2)]:NaN;};let c=median(core),a=median(ring);return {score:(a-c)/Math.max(a,1),bad:bad/Math.max(n,1),core:c,ring:a};}
let samples=data.map((d,i)=>measure(i)),neg=samples[95],pos=samples[83],delta=pos.score-neg.score;threshold=Math.min(99,Math.max(1,+$('sedThreshold').value||35));valid=Number.isFinite(delta)&&delta>.04&&neg.bad<.2&&pos.bad<.2;
batch={name:'细菌沉淀 / '+($('batchName').value.trim()||'当前批次'),created:new Date().toISOString(),wells:['G12','H12'],refs:{base:data[95],end:data[83]},module:'bacteria'};data.forEach((d,i)=>{let s=samples[i];d.sediment=s;d.bad=s.bad;d.index=100*(s.score-neg.score)/Math.max(delta,.0001);d.auto=!valid||!Number.isFinite(d.index)||s.bad>.2||Math.abs(d.index-threshold)<(+$('band').value||8)?'待复核':d.index>=threshold?'生长信号':'未达阈值';});render();$('notice').textContent=(valid?'沉淀对照分离有效':'沉淀对照无效，请检查定位、反光或 G12/H12')+'；阈值 '+threshold+'。检出沉淀=仍有生长信号；未检出不等于灭菌。';};$('analyze').onclick=analyze;$('sedThreshold').onchange=analyze;
let note=document.createElement('p');note.textContent='静置后拍摄；气泡、析出和划痕须复核。取样需要覆盖孔中心，不能仅凭本示例照片保证准确率。';$('notice').before(note);
}
