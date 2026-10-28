(()=>{
const ID='BRISA_REPORT_AI';
const old=document.getElementById(ID); if(old) old.remove();

// Tema Verde/Escuro inspirado em IAs
const css=`
#${ID}{font-family:Inter,Segoe UI,Arial,sans-serif!important;color:#ececf1!important;position:fixed!important;left:auto;top:auto;right:24px;bottom:100px;z-index:2147483647!important;pointer-events:none}
#${ID} *{box-sizing:border-box}
#${ID} .bubble,#${ID} .panel{pointer-events:auto}
#${ID} .bubble{width:64px;height:64px;border-radius:50%;background:#10a37f!important;color:#fff!important;border:2px solid #0b7a5e!important;font-size:24px;font-weight:900;box-shadow:0 8px 26px #0008,0 0 0 4px #10a37f33!important;cursor:grab;touch-action:none;user-select:none;display:flex;align-items:center;justify-content:center}
#${ID} .bubble:active{cursor:grabbing}
#${ID} .bubble:hover{background:#1a7f66!important;box-shadow:0 8px 28px #0009,0 0 0 5px #10a37f44!important}
#${ID} .panel{display:none;position:absolute;right:0;bottom:76px;width:min(400px,calc(100vw - 24px));background:#202123!important;color:#ececf1!important;border:1px solid #4d4d4f!important;border-radius:16px!important;box-shadow:0 24px 70px #000b!important;overflow:hidden}
#${ID} .top{background:#343541!important;color:#fff!important;border-bottom:1px solid #4d4d4f!important;padding:16px!important;display:flex;align-items:center;gap:10px;cursor:default;user-select:none}
#${ID} .brand{font-size:15px!important;letter-spacing:.5px!important;font-weight:800}
#${ID} .sub{font-size:11px!important;color:#8e8ea0!important;margin-top:3px}
#${ID} .close{margin-left:auto;background:#444654!important;color:#fff!important;border:1px solid #565869!important;border-radius:8px;padding:6px 12px;font-weight:900;cursor:pointer}
#${ID} .content{padding:16px!important;background:#202123!important}
#${ID} .field{margin-bottom:12px}
#${ID} label{display:block;font-size:12px;color:#c5c5d2;margin-bottom:6px;font-weight:600}
#${ID} input,#${ID} textarea{width:100%;background:#40414f!important;color:#fff!important;border:1px solid #565869!important;border-radius:8px!important;padding:12px!important;font-size:14px!important;outline-color:#10a37f}
#${ID} textarea{min-height:100px;resize:vertical}
#${ID} .btn{width:100%;background:#10a37f!important;color:#fff!important;border:1px solid #0b7a5e!important;border-radius:8px!important;padding:12px!important;font-weight:700!important;cursor:pointer;margin-top:10px;font-size:14px;transition:0.2s}
#${ID} .btn:hover{background:#1a7f66!important}
#${ID} .toast{position:absolute;right:16px;bottom:16px;background:#10a37f!important;color:#fff!important;padding:10px 14px;border-radius:8px;display:none;font-weight:700;font-size:13px;box-shadow:0 4px 12px #0008;pointer-events:none}
`;

const root=document.createElement('div');root.id=ID;
root.innerHTML=`<style>${css}</style>
<div class="bubble" title="Gerador de Relatórios AI">AI</div>
<div class="panel">
  <div class="top" id="drag_ai">
    <div>
      <div class="brand">BRISA RELATÓRIOS AI</div>
      <div class="sub">Integração rápida com ChatGPT</div>
    </div>
    <button class="close">×</button>
  </div>
  <div class="content">
    <div class="field">
      <label>Nome do Cliente / Contrato</label>
      <input id="ai_cliente" placeholder="Ex: João da Silva">
    </div>
    <div class="field">
      <label>Motivo do Contato</label>
      <input id="ai_motivo" placeholder="Ex: Sem acesso à internet">
    </div>
    <div class="field">
      <label>Anotações Rápidas (O que foi feito?)</label>
      <textarea id="ai_notas" placeholder="Ex: Roteador reiniciado, cabo verificado, acesso normalizado em 5 min."></textarea>
    </div>
    <button class="btn" id="ai_gerar">✨ Copiar e Abrir ChatGPT</button>
  </div>
</div>
<div class="toast" id="toast_ai">Pronto! Cole (Ctrl+V) no ChatGPT.</div>`;
document.body.appendChild(root);

const $=s=>root.querySelector(s);
let toastTimer;
function showToast(){
  const t=$('#toast_ai'); t.style.display='block';
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>t.style.display='none',3000);
}

// Lógica de geração do Prompt
$('#ai_gerar').onclick=()=>{
  const cliente=$('#ai_cliente').value.trim()||'Não informado';
  const motivo=$('#ai_motivo').value.trim()||'Não informado';
  const notas=$('#ai_notas').value.trim()||'Sem detalhes adicionais';
  
  // Aqui configuramos como o ChatGPT deve se comportar e agir
  const prompt = `Aja como um analista de suporte de telecomunicações de excelência. Escreva um relatório de atendimento profissional, claro, objetivo e formatado em tópicos. Não invente dados que não forneci, apenas melhore a escrita das minhas notas.

DADOS DO ATENDIMENTO:
- Cliente/Contrato: ${cliente}
- Motivo do Contato: ${motivo}
- Ações Realizadas/Anotações: ${notas}

Gere o relatório agora, pronto para ser salvo no sistema:`;

  // Copia para a área de transferência e abre o ChatGPT
  navigator.clipboard.writeText(prompt).then(()=>{
    showToast();
    setTimeout(()=>window.open('https://chatgpt.com/', '_blank'), 800);
  }).catch(e=>{
    alert('Erro ao copiar. O navegador pode ter bloqueado.');
  });
};

// Lógica de arrastar (movimentação)
const panel=$('.panel'),bubble=$('.bubble');
$('.close').onclick=()=>{panel.style.display='none'};
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
  const w=root.offsetWidth||64,h=root.offsetHeight||64;
  root.style.left=Math.max(0,Math.min(window.innerWidth-w,e.clientX-dx))+'px';
  root.style.top=Math.max(0,Math.min(window.innerHeight-h,e.clientY-dy))+'px';
  root.style.right='auto';root.style.bottom='auto';
});
window.addEventListener('pointerup',()=>{dragging=false});
bubble.addEventListener('click',e=>{
  if(dragMoved){e.preventDefault();e.stopPropagation();dragMoved=false;return}
  panel.style.display=panel.style.display==='block'?'none':'block';
});
})();