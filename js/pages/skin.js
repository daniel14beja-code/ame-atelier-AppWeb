/* ÂME Skin: cuadrícula de jabones con orden por precio */
const jabones=PRODUCTS.filter(p=>p.col==='skin');
function draw(){const m=$('#so').value,l=[...jabones];if(m==='a')l.sort((a,b)=>minP(a)-minP(b));if(m==='d')l.sort((a,b)=>minP(b)-minP(a));
  $('#gr').innerHTML=l.map(p=>productHTML(p,'cd')).join('');bindProducts($('#gr'));reveal()}
$('#so').onchange=draw;draw();
