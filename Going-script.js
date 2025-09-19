(function(){
  const LS_KEY = 'going:header';
  const defaultState = {
    img: 'cobelog2.jpg',
    text: 'CRISPIN JR, COBELO',
  };

  function $(sel){ return document.querySelector(sel) }

  function loadState(){
    try{ const raw = localStorage.getItem(LS_KEY); return raw? JSON.parse(raw): defaultState }
    catch(e){ return defaultState }
  }

  function saveState(state){ localStorage.setItem(LS_KEY, JSON.stringify(state)) }

  function applyState(state){
    const img = $('#headerLogoImg');
    const text = $('#headerLogoText');
    if(img) img.src = state.img || defaultState.img;
    if(text) text.textContent = state.text || defaultState.text;
  }

  function initEditor(){
    const btn = document.getElementById('editLogoBtn');
    if(!btn) return;

    // create modal
    const modal = document.createElement('div');
    modal.id = 'logoEditorModal';
    modal.innerHTML = `
      <div class="editor-panel">
        <div class="editor-actions top-right">
          <button id="editorSave">Save</button>
          <button id="editorReset">Reset</button>
          <button id="editorClose">Close</button>
        </div>
        <h3>Customize</h3>
        <div style="display:flex;gap:10px;align-items:center">
          <div style="flex:1">
            <label>Choose image file: <input id="editorFile" type="file" accept="image/*"></label>
            <div style="font-size:0.8rem;color:#666;margin-top:6px">Or paste an image URL below</div>
            <input id="editorImg" type="text" placeholder="cobelog2.jpg or https://..." style="width:100%;margin-top:6px">
          </div>
          <div style="width:120px;text-align:center">
            <div style="width:96px;height:96px;border-radius:50%;overflow:hidden;border:1px solid #ddd;display:inline-block">
              <img id="editorPreviewSmall" src="" alt="preview" style="width:100%;height:100%;object-fit:cover">
            </div>
          </div>
        </div>
        <div style="margin-top:8px">
          <label>Name (displayed under logo):<br><input id="editorText" type="text" placeholder="Your name" style="width:100%"></label>
        </div>
            <!-- Link input removed: logo no longer stores a href -->

        <div id="cropArea" style="margin-top:10px;display:none">
          <div style="max-width:640px;max-height:360px;overflow:hidden">
            <img id="cropperImage" src="" alt="To crop" style="max-width:100%;display:block;">
          </div>
          <div style="margin-top:8px;display:flex;gap:8px;justify-content:flex-end">
            <button id="cropApply">Apply Crop</button>
            <button id="cropCancel">Cancel Crop</button>
          </div>
        </div>

        
      </div>`;
    document.body.appendChild(modal);

    // --- Gmail helper UI wiring (demo + paste-token fetch) ---
    const gmailConnectBtn = document.getElementById('gmailConnectBtn');
    const gmailDemoBtn = document.getElementById('gmailDemoBtn');
    const gmailStatus = document.getElementById('gmailStatus');
    const gmailMessages = document.getElementById('gmailMessages');

    async function fetchGmailMessages(token){
      if(!token) throw new Error('No access token provided');
      gmailStatus.textContent = 'Fetching messages...';
      gmailMessages.innerHTML = '';
      gmailMessages.style.display = 'block';
      try{
        const listRes = await fetch('https://www.googleapis.com/gmail/v1/users/me/messages?maxResults=10', {
          headers: { Authorization: 'Bearer ' + token }
        });
        if(!listRes.ok) throw new Error('List fetch failed: ' + (await listRes.text()));
        const listJson = await listRes.json();
        const msgs = listJson.messages || [];
        if(msgs.length === 0){ gmailMessages.innerHTML = '<div style="padding:8px;color:#666">No messages found.</div>'; gmailStatus.textContent = 'No messages'; return }
        for(const m of msgs){
          try{
            const mr = await fetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${m.id}?format=full`, {
              headers: { Authorization: 'Bearer ' + token }
            });
            if(!mr.ok) { continue }
            const mj = await mr.json();
            const snippet = mj.snippet || '';
            let subject = '(no subject)', from = '(unknown)';
            const headers = (mj.payload && mj.payload.headers) || [];
            headers.forEach(h=>{ if(h.name==='Subject') subject = h.value; if(h.name==='From') from = h.value; });
            const time = mj.internalDate ? new Date(Number(mj.internalDate)).toLocaleString() : '';
            const item = document.createElement('div');
            item.style.padding = '8px'; item.style.borderBottom = '1px solid #eee';
            item.innerHTML = `<div style="font-weight:600">${subject}</div><div style="font-size:0.85rem;color:#555">${from} · ${time}</div><div style="margin-top:6px;color:#333">${snippet}</div>`;
            gmailMessages.appendChild(item);
          }catch(e){ console.warn('msg fetch err', e) }
        }
        gmailStatus.textContent = 'Loaded messages';
      }catch(err){ gmailStatus.textContent = 'Error: ' + err.message; gmailMessages.innerHTML = '' }
    }

    gmailDemoBtn && gmailDemoBtn.addEventListener('click', ()=>{
      gmailMessages.style.display = 'block';
      gmailMessages.innerHTML = '';
      const demo = [
        {s:'Welcome to Cobelo', f:'Cobelocrispin <no-reply@example.com>', t: 'Today', sn:'Thanks for joining Cobelo — here are some tips...'},
        {s:'Your receipt', f:'sales@shop.example', t:'Yesterday', sn:'Payment received. Order #12345...'},
        {s:'Reset your password', f:'security@service.example', t:'2 days ago', sn:'Click here to reset your password...'}
      ];
      demo.forEach(d=>{
        const item = document.createElement('div'); item.style.padding='8px'; item.style.borderBottom='1px solid #eee';
        item.innerHTML = `<div style="font-weight:600">${d.s}</div><div style="font-size:0.85rem;color:#555">${d.f} · ${d.t}</div><div style="margin-top:6px;color:#333">${d.sn}</div>`;
        gmailMessages.appendChild(item);
      });
      gmailStatus.textContent = 'Demo messages shown';
    });

    gmailConnectBtn && gmailConnectBtn.addEventListener('click', async ()=>{
      // Simple fallback: ask the user to paste an access token (OAuth Playground or your OAuth flow)
      const token = prompt('Paste a Gmail OAuth access token (from OAuth Playground or your app)');
      if(!token) return;
      gmailStatus.textContent = 'Using provided token';
      try{ await fetchGmailMessages(token) }catch(e){ gmailStatus.textContent = 'Fetch failed: ' + e.message }
    });

    // wire buttons
    document.getElementById('editorClose').addEventListener('click', ()=> modal.classList.remove('open'));
    const fileInput = document.getElementById('editorFile');
    const imgInput = document.getElementById('editorImg');
    const previewSmall = document.getElementById('editorPreviewSmall');
    const cropArea = document.getElementById('cropArea');
    const cropperImg = document.getElementById('cropperImage');
    let cropper = null;

    function loadImageToCropper(src){
      cropperImg.src = src;
      cropArea.style.display = '';
      // destroy previous
      if(cropper){ try{ cropper.destroy() }catch(e){}; cropper = null }
      cropper = new Cropper(cropperImg, { aspectRatio: 1, viewMode: 1, autoCropArea: 1 });
    }

    fileInput.addEventListener('change', (ev)=>{
      const f = ev.target.files && ev.target.files[0];
      if(!f) return;
      const reader = new FileReader();
      reader.onload = function(e){
        previewSmall.src = e.target.result;
        imgInput.value = e.target.result; // store data URL in input
        loadImageToCropper(e.target.result);
      };
      reader.readAsDataURL(f);
    });

    imgInput.addEventListener('change', ()=>{
      const val = imgInput.value.trim();
      if(!val) return;
      // preview and enable crop if it's an image data URL or remote URL
      previewSmall.src = val;
      try{ loadImageToCropper(val); }catch(e){ console.warn('Cropper load failed', e) }
    });

    document.getElementById('cropCancel').addEventListener('click', ()=>{
      if(cropper){ try{ cropper.destroy() }catch(e){}
      }
      cropper = null;
      cropArea.style.display = 'none';
    });

    document.getElementById('cropApply').addEventListener('click', ()=>{
      if(!cropper) return;
      const canvas = cropper.getCroppedCanvas({ width: 256, height: 256, imageSmoothingQuality: 'high' });
      const dataUrl = canvas.toDataURL('image/png');
      // set preview and input to dataURL
      previewSmall.src = dataUrl;
      imgInput.value = dataUrl;
      // destroy cropper
      try{ cropper.destroy() }catch(e){}
      cropper = null;
      cropArea.style.display = 'none';
    });
    document.getElementById('editorSave').addEventListener('click', ()=>{
      const state = loadState();
      state.img = document.getElementById('editorImg').value || state.img;
      state.text = document.getElementById('editorText').value || state.text;
      saveState(state);
      applyState(state);
      modal.classList.remove('open');
    });
    document.getElementById('editorReset').addEventListener('click', ()=>{
      localStorage.removeItem(LS_KEY);
      applyState(defaultState);
      // update inputs
      document.getElementById('editorImg').value = defaultState.img;
      document.getElementById('editorText').value = defaultState.text;
    });

    btn.addEventListener('click', ()=>{
      const state = loadState();
      document.getElementById('editorImg').value = state.img;
      document.getElementById('editorText').value = state.text;
      modal.classList.add('open');
      document.getElementById('editorImg').focus();
    });
  }

  // init on DOM ready
  document.addEventListener('DOMContentLoaded', ()=>{
    const state = loadState();
    applyState(state);
    initEditor();
  });
})();
const toggleDropdown = (dropdown, menu, isOpen) => {
  dropdown.classList.toggle("open", isOpen);
  menu.style.height = isOpen ? `${menu.scrollHeight}px` : 0;
};
// Close all open dropdowns
const closeAllDropdowns = () => {
  document.querySelectorAll(".dropdown-container.open").forEach((openDropdown) => {
    toggleDropdown(openDropdown, openDropdown.querySelector(".dropdown-menu"), false);
  });
};
// Attach click event to all dropdown toggles
document.querySelectorAll(".dropdown-toggle").forEach((dropdownToggle) => {
  dropdownToggle.addEventListener("click", (e) => {
    e.preventDefault();
    const dropdown = dropdownToggle.closest(".dropdown-container");
    const menu = dropdown.querySelector(".dropdown-menu");
    const isOpen = dropdown.classList.contains("open");
    closeAllDropdowns(); // Close all open dropdowns
    toggleDropdown(dropdown, menu, !isOpen); // Toggle current dropdown visibility
  });
});
// Attach click event to sidebar toggle buttons
document.querySelectorAll(".sidebar-toggler, .sidebar-menu-button").forEach((button) => {
  button.addEventListener("click", () => {
    closeAllDropdowns(); // Close all open dropdowns
    document.querySelector(".sidebar").classList.toggle("collapsed"); // Toggle collapsed class on sidebar
  });
});
// Collapse sidebar by default on small screens
if (window.innerWidth <= 1024) document.querySelector(".sidebar").classList.add("collapsed");