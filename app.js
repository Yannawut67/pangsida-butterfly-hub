/**
 * Application Logic for Pang Sida Butterfly Hub
 * v3 — Multi-image batch scan (max 30), PWA
 */
const DEFAULT_SPECIES = [
  {
    id: "paris_peacock", commonName: "Paris Peacock", thaiName: "ผีเสื้อหางติ่งนางละเวง",
    scientificName: "Papilio paris", family: "Papilionidae",
    description: "หนึ่งในผีเสื้อที่สวยงามที่สุดในอุทยานแห่งชาติปางสีดา ปีกมีสีดำสนิทประกายเขียว และมีจุดวงกลมสีเขียวมรกตเหลือบน้ำเงินขนาดใหญ่อยู่ที่ปีกคู่หลัง",
    image: "resources/images/paris_peacock.png", discoveryDate: "2026-06-20", confidence: "98", reporter: "Pang Sida Ranger",
    notes: "พบเห็นได้หนาแน่นบริเวณน้ำตกปางสีดา"
  },
  {
    id: "orange_albatross", commonName: "Orange Albatross", thaiName: "ผีเสื้อหนอนใบกุ่มส้ม",
    scientificName: "Appias nero", family: "Pieridae",
    description: "ผีเสื้อที่มีสีส้มสว่างสดใสสะดุดตา ตัวผู้มักรวมตัวกันเป็นกลุ่มใหญ่นับร้อยตัวเพื่อดูดกินโปรตีนและเกลือแร่ตามพื้นดินชื้นแฉะ",
    image: "resources/images/orange_albatross.png", discoveryDate: "2026-06-18", confidence: "96", reporter: "S. Watcher",
    notes: "พบรวมกลุ่มเป็นจำนวนมากที่จุดชมผีเสื้อกิโลเมตรที่ 20"
  },
  {
    id: "lime_butterfly", commonName: "Lime Butterfly", thaiName: "ผีเสื้อหางติ่งธรรมดา",
    scientificName: "Papilio demoleus", family: "Papilionidae",
    description: "ผีเสื้อขนาดกลางถึงใหญ่ ปีกสีดำลายจุดเหลืองนวลกระจายทั่วปีก บินเร็วและชอบตอมดอกไม้ในทุ่งโล่งและชายป่า",
    image: "resources/images/lime_butterfly.png", discoveryDate: "2026-06-21", confidence: "95", reporter: "T. Conservation",
    notes: "พบได้ทั่วไปตามแปลงไม้ดอกรอบที่ทำการอุทยานฯ"
  },
  { id: "common_cruiser", commonName: "Common Cruiser", thaiName: "ผีเสื้อกะทกรกธรรมดา", scientificName: "Vindula erota", family: "Nymphalidae", description: "ผีเสื้อปีกแหลมสีน้ำตาลส้ม ขอบปีกมีหยักคล้ายคลื่น มักเกาะบินสูงตามยอดไม้", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=300", discoveryDate: "2026-05-15", confidence: "N/A (Manual)", reporter: "Pang Sida Staff", notes: "พบบริเวณห้วยน้ำเย็น" },
  { id: "lemon_emigrant", commonName: "Lemon Emigrant", thaiName: "ผีเสื้อหนอนคูนธรรมดา", scientificName: "Catopsilia pomona", family: "Pieridae", description: "ผีเสื้อสีเหลืองมะนาวอ่อน บินเร็วมาก เป็นหนึ่งในสปีชีส์ที่พบบ่อยที่สุดในอุทยานฯ", image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=300", discoveryDate: "2026-05-10", confidence: "N/A (Manual)", reporter: "Pang Sida Staff", notes: "พบได้ตลอดเส้นทางขึ้นจุดชมวิว" }
];
let db = [...DEFAULT_SPECIES];
let activeScanFiles = [];
let activeScanDataUris = [];
const MAX_SCAN_IMAGES = 30;
const DEFAULT_AI_URL = "https://steady-follow-nail-suzuki.trycloudflare.com";

document.addEventListener("DOMContentLoaded", () => {
  loadLocalDatabase(); renderSpeciesGrid(); renderChart(); updateCounters();
  setupEventListeners(); checkSheetsConnectionStatus(); checkAIConnectionStatus();
  setInterval(checkAIConnectionStatus, 60000); initHotspotMap();
});
function loadLocalDatabase() {
  const d = localStorage.getItem("pang_sida_butterflies");
  if (d) try { db = JSON.parse(d); } catch(e) {}
}
function saveLocalDatabase() { localStorage.setItem("pang_sida_butterflies", JSON.stringify(db)); }

// ── Species Grid ──
function renderSpeciesGrid(filteredDb = db) {
  const grid = document.getElementById("butterflyGrid"); if (!grid) return;
  if (!filteredDb.length) { grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text-secondary);"><p>ไม่พบข้อมูลผีเสื้อตามเงื่อนไข</p></div>'; return; }
  grid.innerHTML = filteredDb.map(s => {
    const src = s.image.startsWith("resources/") || s.image.startsWith("data:") ? s.image : "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400";
    return `<div class="butterfly-card" onclick="openDetailsModal('${s.id}')"><div class="card-img-wrapper"><img src="${src}" class="card-img" onerror="this.src='https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400'"><span class="family-badge">${s.family}</span></div><div class="card-content"><div class="card-names"><h4>${s.thaiName}</h4><p>${s.commonName} (<em>${s.scientificName}</em>)</p></div><div class="card-stats"><div class="card-stat">โดย: <span>${s.reporter}</span></div><div class="card-stat">สแกน: <span>${s.confidence!=="N/A (Manual)"?s.confidence+"%":"ระบุเอง"}</span></div></div></div></div>`;
  }).join("");
}
function updateCounters() {
  document.getElementById("totalSpeciesCount").textContent = db.length;
  document.getElementById("aiVerifiedCount").textContent = db.filter(s => s.confidence && s.confidence !== "N/A (Manual)").length;
  document.getElementById("familiesCount").textContent = new Set(db.map(s => s.family)).size;
}
function renderChart() {
  const c = document.getElementById("chartContainer"); if (!c) return;
  const counts = {}; db.forEach(s => counts[s.family] = (counts[s.family]||0)+1);
  const max = Math.max(...Object.values(counts), 1);
  c.innerHTML = Object.entries(counts).map(([f,n]) => `<div class="chart-bar-wrapper" onclick="filterByFamily('${f}')"><div class="chart-bar" style="height:${(n/max)*100}%" data-value="${n}"></div><span class="chart-label">${f.substring(0,5)}...</span></div>`).join("");
}
function filterSpecies() {
  const q = document.getElementById("searchInput").value.toLowerCase();
  const fam = document.getElementById("familyFilter").value;
  renderSpeciesGrid(db.filter(s => (s.commonName.toLowerCase().includes(q)||s.thaiName.includes(q)||s.scientificName.toLowerCase().includes(q)) && (fam==="all"||s.family===fam)));
}
function filterByFamily(f) { document.getElementById("familyFilter").value=f; switchTab("directory"); filterSpecies(); }

// ── Events ──
function setupEventListeners() {
  document.getElementById("searchInput")?.addEventListener("input", filterSpecies);
  const ff = document.getElementById("familyFilter");
  if (ff) { ff.addEventListener("change", filterSpecies); ff.innerHTML = '<option value="all">ทั้งหมดทุกตระกูล</option>'+[...new Set(db.map(s=>s.family))].map(f=>`<option value="${f}">${f}</option>`).join(""); }
  
  const dz = document.getElementById("dropzone"), fi = document.getElementById("fileInput");
  if (dz && fi) {
    dz.addEventListener("click", () => fi.click());
    dz.addEventListener("dragover", e => { e.preventDefault(); dz.classList.add("dragover"); });
    dz.addEventListener("dragleave", () => dz.classList.remove("dragover"));
    dz.addEventListener("drop", e => { e.preventDefault(); dz.classList.remove("dragover"); if (e.dataTransfer.files.length) handleFilesSelect(e.dataTransfer.files); });
    fi.addEventListener("change", e => { if (e.target.files.length) handleFilesSelect(e.target.files); });
  }
  document.querySelectorAll(".nav-links .nav-btn").forEach(b => b.addEventListener("click", () => switchTab(b.dataset.tab)));
  document.querySelectorAll(".modal-overlay").forEach(m => m.addEventListener("click", e => { if (e.target===m||e.target.closest(".modal-close")) closeAllModals(); }));
  
  const sf = document.getElementById("settingsForm");
  if (sf) sf.addEventListener("submit", e => { e.preventDefault();
    const s=document.getElementById("sheetsUrl").value.trim(), a=document.getElementById("aiApiUrl").value.trim();
    if(s) localStorage.setItem("pang_sida_sheets_url",s); if(a) localStorage.setItem("pang_sida_ai_url",a.replace(/\/+$/,""));
    checkSheetsConnectionStatus(); checkAIConnectionStatus(); closeAllModals(); alert("บันทึกการตั้งค่าสำเร็จ!");
  });
  const savedS = localStorage.getItem("pang_sida_sheets_url"); if (savedS) document.getElementById("sheetsUrl").value = savedS;
  const savedA = localStorage.getItem("pang_sida_ai_url"); if (savedA) document.getElementById("aiApiUrl").value = savedA;
  document.getElementById("discoveryForm")?.addEventListener("submit", handleDiscoverySubmit);
}
function switchTab(t) {
  document.querySelectorAll(".nav-links .nav-btn").forEach(b => b.classList.toggle("active", b.dataset.tab===t));
  const dash=document.getElementById("dashboardTab"), dir=document.getElementById("directoryTab"), scan=document.querySelector(".scanner-panel"), grid=document.querySelector(".main-grid");
  if (t==="dashboard") { dash.style.display="block"; dir.style.display="block"; grid.style.gridTemplateColumns="480px 1fr"; scan.style.display="block"; }
  else if (t==="scanner") { dash.style.display="none"; dir.style.display="none"; grid.style.gridTemplateColumns="1fr"; scan.style.display="block"; }
  else { dash.style.display="none"; dir.style.display="block"; grid.style.gridTemplateColumns="1fr"; scan.style.display="none"; }
}

// ── MULTI-FILE UPLOAD (max 30) ──
function handleFilesSelect(files) {
  const imgs = Array.from(files).filter(f => f.type.match("image.*"));
  if (!imgs.length) { alert("กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น!"); return; }
  if (activeScanFiles.length + imgs.length > MAX_SCAN_IMAGES) { alert(`สูงสุด ${MAX_SCAN_IMAGES} รูป (มี ${activeScanFiles.length} แล้ว)`); return; }
  let loaded = 0;
  imgs.forEach(file => { const r = new FileReader(); r.onload = e => { activeScanFiles.push(file); activeScanDataUris.push(e.target.result); loaded++; if (loaded===imgs.length) { renderScanGallery(); document.getElementById("startScanBtn").removeAttribute("disabled"); document.getElementById("scanResults").style.display="none"; } }; r.readAsDataURL(file); });
}
function renderScanGallery() {
  const dz = document.getElementById("dropzone");
  if (!activeScanFiles.length) { dz.innerHTML = dropzoneDefaultHTML; document.getElementById("startScanBtn").setAttribute("disabled","true"); return; }
  const n = activeScanFiles.length;
  dz.innerHTML = `<div style="padding:1rem;"><div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:0.8rem;">${activeScanDataUris.map((u,i)=>`<div style="position:relative;flex-shrink:0;cursor:pointer;" onclick="removeScanImage(${i})"><img src="${u}" style="width:80px;height:80px;object-fit:cover;border-radius:6px;border:2px solid var(--glass-border);"><span style="position:absolute;top:-6px;right:-6px;background:#ff5252;color:#fff;border-radius:50%;width:20px;height:20px;display:flex;align-items:center;justify-content:center;font-size:11px;">×</span></div>`).join("")}</div><div style="display:flex;align-items:center;justify-content:space-between;"><span style="font-size:0.85rem;color:var(--text-muted);">📸 <strong>${n}</strong>/${MAX_SCAN_IMAGES} รูป${n<MAX_SCAN_IMAGES?' — ลากเพิ่มได้':''}</span><button onclick="resetScanner()" style="background:none;border:1px solid var(--glass-border);color:var(--text-secondary);padding:4px 12px;border-radius:4px;font-size:0.8rem;cursor:pointer;">ล้างทั้งหมด</button></div></div>`;
}
function removeScanImage(i) { activeScanFiles.splice(i,1); activeScanDataUris.splice(i,1); renderScanGallery(); if(!activeScanFiles.length) document.getElementById("startScanBtn").setAttribute("disabled","true"); }
const dropzoneDefaultHTML = `<div class="dropzone-icon"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg></div><h3>ลากไฟล์ภาพมาที่นี่ หรือคลิกเพื่ออัปโหลด</h3><p>รองรับไฟล์ JPG, PNG สูงสุด ${MAX_SCAN_IMAGES} รูป (ระบบจะวิเคราะห์ทีละรูป)</p>`;

// ── BATCH AI SCAN ──
function getAIBaseUrl() { return (localStorage.getItem("pang_sida_ai_url")||DEFAULT_AI_URL).replace(/\/+$/,""); }
async function startAIScan() {
  const scanBtn = document.getElementById("startScanBtn"), resultsDiv = document.getElementById("scanResults");
  if (!activeScanFiles.length) return;
  scanBtn.setAttribute("disabled","true"); resultsDiv.style.display="block";
  resultsDiv.innerHTML = `<div style="padding:1.5rem;text-align:center;">
    <p style="margin-bottom:1rem;">กำลังวิเคราะห์ <strong>${activeScanFiles.length}</strong> รูป…</p>
    <div style="background:rgba(255,255,255,0.06);border-radius:4px;height:6px;overflow:hidden;margin-bottom:0.5rem;"><div id="bpFill" style="background:var(--accent-green);height:100%;width:0%;transition:width 0.3s;"></div></div>
    <div id="bpStatus" style="font-size:0.85rem;color:var(--text-muted);"></div>
    <div id="bpResults" style="margin-top:1rem;text-align:left;max-height:60vh;overflow-y:auto;"></div></div>`;
  
  const apiBase = getAIBaseUrl(), all = [], total = activeScanFiles.length;
  for (let i=0;i<total;i++) {
    const f=activeScanFiles[i]; document.getElementById("bpFill").style.width=Math.round((i/total)*100)+"%";
    document.getElementById("bpStatus").textContent=`รูปที่ ${i+1}/${total} — กำลังส่ง…`;
    try { const fd=new FormData(); fd.append("image",f); const c=new AbortController(); setTimeout(()=>c.abort(),30000);
      const r=await fetch(`${apiBase}/api/identify`,{method:"POST",body:fd,signal:c.signal});
      if(!r.ok) throw new Error(`HTTP ${r.status}`); all.push({name:f.name,ok:true,data:await r.json()}); }
    catch(e) { all.push({name:f.name,ok:false,error:e.message}); }
  }
  document.getElementById("bpFill").style.width="100%"; document.getElementById("bpStatus").textContent=`เสร็จ! ${all.length} รูป`;
  const ok=all.filter(r=>r.ok).length;
  document.getElementById("bpResults").innerHTML = `<p style="margin-bottom:0.8rem;font-size:0.9rem;">✅ ${ok}/${total} วิเคราะห์สำเร็จ</p>`+
    all.map((r,i)=>{ if(!r.ok) return `<div style="padding:0.5rem;margin-bottom:0.4rem;background:rgba(255,82,82,0.1);border-radius:6px;border-left:3px solid #ff5252;"><span style="font-size:0.8rem;">❌ ${r.name}: ${r.error}</span></div>`;
    const t=r.data.top_predictions?.[0]||{}, conf=parseFloat(t.confidence||r.data.confidence||0), col=conf>=60?"var(--accent-green)":conf>=30?"var(--accent-gold)":"#ff5252";
    return `<div style="padding:0.5rem;margin-bottom:0.4rem;background:rgba(255,255,255,0.04);border-radius:6px;border-left:3px solid ${col};"><span style="font-weight:600;">${i+1}. ${t.name_th||r.data.name_th||"?"}</span><span style="float:right;color:${col};font-weight:700;">${conf.toFixed(1)}%</span><br><span style="font-size:0.8rem;color:var(--text-muted);">${r.name} · <em>${t.name_sci||r.data.name_sci||""}</em></span></div>`; }).join("")+
    `<button class="scan-btn" onclick="resetScanner()" style="margin-top:0.8rem;">สแกนชุดใหม่</button>`;
  scanBtn.removeAttribute("disabled");
}
function resetScanner() { activeScanFiles=[]; activeScanDataUris=[]; renderScanGallery(); document.getElementById("scanResults").style.display="none"; }

// ── Sheets / AI Status ──
function checkSheetsConnectionStatus() {
  const u=localStorage.getItem("pang_sida_sheets_url"), i=document.getElementById("sheetsStatusIndicator"), t=document.getElementById("sheetsStatusText");
  if(!i||!t) return;
  if(u) { i.className="status-dot active"; t.textContent="Sheets: เชื่อมต่อแล้ว"; t.style.color="var(--accent-green)"; }
  else { i.className="status-dot"; t.textContent="Sheets: ออฟไลน์"; t.style.color="var(--text-secondary)"; }
}
async function checkAIConnectionStatus() {
  const i=document.getElementById("aiStatusIndicator"), t=document.getElementById("aiStatusText");
  if(!i||!t) return; t.textContent="AI: ตรวจสอบ…"; t.style.color="var(--text-secondary)"; i.className="status-dot";
  try { const c=new AbortController(); setTimeout(()=>c.abort(),8000); const r=await fetch(`${getAIBaseUrl()}/api/species`,{signal:c.signal});
    if(r.ok) { i.className="status-dot active"; t.textContent="AI: ออนไลน์ (40 species)"; t.style.color="var(--accent-green)"; }
    else throw new Error(`HTTP ${r.status}`); } catch(e) { i.className="status-dot"; t.textContent="AI: ออฟไลน์"; t.style.color="#ff5252"; }
}
async function testAIConnection() {
  const s=document.getElementById("aiTestStatus"); if(!s) return;
  const u=(document.getElementById("aiApiUrl").value||"").trim().replace(/\/+$/,"");
  if(!u) { s.textContent="กรุณาใส่ URL"; s.style.color="#ff5252"; return; }
  s.textContent="กำลังทดสอบ…"; s.style.color="var(--text-secondary)";
  try { const c=new AbortController(); setTimeout(()=>c.abort(),10000); const r=await fetch(`${u}/api/species`,{signal:c.signal});
    if(!r.ok) throw new Error(`HTTP ${r.status}`); const d=await r.json(); const n=Array.isArray(d)?d.length:(d.species?d.species.length:"?");
    s.textContent=`✓ สำเร็จ — ${n} species`; s.style.color="var(--accent-green)"; }
  catch(e) { s.textContent=`✗ ${e.message}`; s.style.color="#ff5252"; }
}

// ── Details Modal ──
function openDetailsModal(id) {
  const s=db.find(x=>x.id===id); if(!s) return;
  const m=document.getElementById("detailsModal");
  m.querySelector(".modal-header-img").style.backgroundImage=`url('${s.image.startsWith("resources/")||s.image.startsWith("data:")?s.image:"https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400"}')`;
  m.querySelector(".modal-body-content").innerHTML=`<div class="modal-title-sec"><h3>${s.thaiName}</h3><p>${s.commonName} (<em>${s.scientificName}</em>)</p></div><div class="modal-meta-grid"><div class="meta-item"><span>วงศ์</span><strong>${s.family}</strong></div><div class="meta-item"><span>วันที่พบ</span><strong>${s.discoveryDate}</strong></div><div class="meta-item"><span>ผู้รายงาน</span><strong>${s.reporter}</strong></div></div><div class="modal-desc"><p>${s.description}</p></div>${s.notes?`<div class="modal-notes"><h5>บันทึกเพิ่มเติม</h5><p>${s.notes}</p></div>`:""}`;
  m.classList.add("open");
}
function openSettingsModal() { document.getElementById("settingsModal").classList.add("open"); }
function closeAllModals() { document.querySelectorAll(".modal-overlay").forEach(m=>m.classList.remove("open")); }
function openNewDiscoveryModal() { document.getElementById("discoveryModal").classList.add("open");
  const fp=document.getElementById("formPreview"); if(fp&&activeScanDataUris.length) fp.innerHTML=`<img src="${activeScanDataUris[0]}" style="width:100%;max-height:150px;object-fit:contain;border-radius:8px;">`; }
async function handleDiscoverySubmit(e) {
  e.preventDefault(); const sd=document.getElementById("formStatus"); sd.style.display="block"; sd.className="form-status loading"; sd.innerHTML="กำลังนำส่ง…";
  const d={commonName:document.getElementById("discCommonName").value.trim(),scientificName:document.getElementById("discSciName").value.trim(),family:document.getElementById("discFamily").value,reporter:document.getElementById("discReporter").value.trim()||"Anonymous Ranger",notes:document.getElementById("discNotes").value.trim(),timestamp:new Date().toISOString()};
  try { const u=localStorage.getItem("pang_sida_sheets_url"); if(u) await fetch(u,{method:"POST",mode:"no-cors",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"new_discovery",...d})});
    db.push({id:"disc_"+Date.now(),commonName:d.commonName||"New Species",thaiName:d.commonName||"ชนิดใหม่",scientificName:d.scientificName||"Sida sp.",family:d.family,description:"รายงานการค้นพบใหม่",image:activeScanDataUris[0]||"",discoveryDate:new Date().toISOString().split("T")[0],confidence:"N/A (Discovery)",reporter:d.reporter,notes:d.notes});
    saveLocalDatabase(); renderSpeciesGrid(); renderChart(); updateCounters(); sd.className="form-status success"; sd.innerHTML="✅ บันทึกสำเร็จ!";
    setTimeout(()=>{ closeAllModals(); resetScanner(); },1500); } catch(err) { sd.className="form-status error"; sd.innerHTML=`❌ ${err.message}`; }
}

// ── Map ──
function initHotspotMap() { /* SVG map in HTML — interactive via onclick on symbols */ }
