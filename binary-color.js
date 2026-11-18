function binaryColorState(index, cutoff){
  if(!Number.isFinite(index)||!Number.isFinite(cutoff))return null;
  return index>=cutoff?'生长信号':'未达阈值';
}
// Apply only to color analysis. Sediment analysis retains its separate method.
const beforeBinaryAnalyze=analyze;
analyze=function(){
  beforeBinaryAnalyze();
  if(bacteria||!data.length)return;
  const failed=data.filter(d=>!Number.isFinite(d.index)||d.bad>.2||d.off>15);
  if(!valid||failed.length){
    const message=!valid?'颜色参照无效，请重新校准。':'取色异常：'+failed.map(d=>d.well).join('、')+'。请调整孔圈或重新拍照。';
    valid=false;data=[];overrides={};$('heat').innerHTML='';$('mic').innerHTML='';$('notice').textContent=message;refreshSaveUI();return;
  }
  overrides={};data.forEach(d=>{d.auto=binaryColorState(d.index,threshold);});
  render();$('notice').textContent='最低生长指数 '+threshold.toFixed(2)+'：达到或超过为生长，低于为未达阈值。';refreshSaveUI();
};
$('analyze').onclick=analyze;
if(!bacteria){
  $('band').value=0;$('band').hidden=true;
  const label=$('band').previousSibling;if(label&&label.nodeType===3)label.textContent='';
  const legend=$('heat').parentElement.querySelector('small');if(legend)legend.textContent='蓝：未达阈值　黄：生长。指数不是菌量；未达阈值不等于完全无生长。';
}
