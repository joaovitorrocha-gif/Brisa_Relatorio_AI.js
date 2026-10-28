(()=>{
const ID='BRISA_CHATGPT_SHORTCUT';
const old=document.getElementById(ID); if(old) old.remove();

const css=`
#${ID}{font-family:Inter,Segoe UI,sans-serif!important;position:fixed!important;left:auto;top:auto;right:24px;bottom:100px;z-index:2147483647!important;pointer-events:none}
#${ID} .bubble{pointer-events:auto;width:60px;height:60px;border-radius:50%;background:#10a37f!important;color:#fff!important;border:2px solid #0b7a5e!important;font-size:16px;font-weight:900;box-shadow:0 8px 26px #0008,0 0 0 4px #10a37f33!important;cursor:grab;display:flex;align-items:center;justify-content:center;user-select:none;transition:transform 0.2s}
#${ID} .bubble:active{cursor:grabbing}
#${ID} .bubble:hover{background:#1a7f66!important;transform:scale(1.05)}
`;

const root=document.createElement('div');root.id=ID;
root.innerHTML=`<style>${css}</style><div class="bubble" title="Abrir ChatGPT">GPT</div>`;
document.body.appendChild(root);

const bubble=root.querySelector('.bubble');
let dragging=false,dragMoved=false,dx=0,dy=0,startX=0,startY=0;

bubble.addEventListener('pointerdown',e=>{
  dragging=true;dragMoved=false;startX=e.clientX;startY=e.clientY;
  const r=root.getBoundingClientRect(); dx=e.clientX-r.left; dy=e.clientY-r.top;
  try{e.currentTarget.setPointerCapture(e.pointerId)}catch(_){}
  e.preventDefault();
});
window.addEventListener('pointermove',e=>{
  if(!dragging)return;
  if(Math.abs(e.clientX-startX)>4||Math.abs(e.clientY-startY)>4)dragMoved=true;
  const w=60,h=60;
  root.style.left=Math.max(0,Math.min(window.innerWidth-w,e.clientX-dx))+'px';
  root.style.top=Math.max(0,Math.min(window.innerHeight-h,e.clientY-dy))+'px';
  root.style.right='auto';root.style.bottom='auto';
});
window.addEventListener('pointerup',()=>{dragging=false});
bubble.addEventListener('pointercancel',()=>{dragging=false});

// AQUI É ONDE A MÁGICA ACONTECE: ABRE O CHATGPT
bubble.addEventListener('click',e=>{
  if(dragMoved){e.preventDefault();e.stopPropagation();dragMoved=false;return}
  window.open('https://chatgpt.com/', '_blank');
});
})();