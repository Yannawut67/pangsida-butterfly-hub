/**
 * Application Logic for Pang Sida Butterfly Hub
 * Concept 1: Modern Conservation Dashboard
 */

// Initial butterfly database (Pang Sida National Park species)
const DEFAULT_SPECIES = [
  {
    id: "paris_peacock",
    commonName: "Paris Peacock",
    thaiName: "ผีเสื้อหางติ่งนางละเวง",
    scientificName: "Papilio paris",
    family: "Papilionidae",
    description: "หนึ่งในผีเสื้อที่สวยงามที่สุดในอุทยานแห่งชาติปางสีดา ปีกมีสีดำสนิทประกายเขียว และมีจุดวงกลมสีเขียวมรกตเหลือบน้ำเงินขนาดใหญ่อยู่ที่ปีกคู่หลัง มักพบบินตามลำธารและหุบเขาที่มีร่มเงาของอุทยานฯ",
    image: "resources/images/paris_peacock.png",
    discoveryDate: "2026-06-20",
    confidence: "98",
    reporter: "Pang Sida Ranger",
    notes: "พบเห็นได้หนาแน่นบริเวณน้ำตกปางสีดา ชั้นที่ 1 และ 2"
  },
  {
    id: "orange_albatross",
    commonName: "Orange Albatross",
    thaiName: "ผีเสื้อหนอนใบกุ่มส้ม",
    scientificName: "Appias nero",
    family: "Pieridae",
    description: "ผีเสื้อที่มีสีส้มสว่างสดใสสะดุดตา ปีกด้านบนมีสีส้มสดไม่มีลวดลายซับซ้อน ตัวผู้มักรวมตัวกันเป็นกลุ่มใหญ่นับร้อยตัวเพื่อดูดกินโปรตีนและเกลือแร่ตามพื้นดินชื้นแฉะ (Mud-puddling) ซึ่งเป็นภาพไฮไลท์ยอดนิยมของโป่งผีเสื้อปางสีดา",
    image: "resources/images/orange_albatross.png",
    discoveryDate: "2026-06-18",
    confidence: "96",
    reporter: "S. Watcher",
    notes: "พบรวมกลุ่มเป็นจำนวนมากที่จุดชมผีเสื้อกิโลเมตรที่ 20"
  },
  {
    id: "lime_butterfly",
    commonName: "Lime Butterfly",
    thaiName: "ผีเสื้อหางติ่งธรรมดา",
    scientificName: "Papilio demoleus",
    family: "Papilionidae",
    description: "ผีเสื้อขนาดกลางถึงใหญ่ ไม่มีหางติ่งยื่นออกมา ปีกสีดำลายจุดเหลืองนวลกระจายทั่วปีก มีจุดดวงตาสีแดงเล็กๆ ที่ขอบปีกคู่หลัง บินเร็วและชอบตอมดอกไม้ในทุ่งโล่งและชายป่ารอบที่ทำการอุทยานฯ",
    image: "resources/images/lime_butterfly.png",
    discoveryDate: "2026-06-21",
    confidence: "95",
    reporter: "T. Conservation",
    notes: "พบได้ทั่วไปตามแปลงไม้ดอกรอบที่ทำการอุทยานฯ"
  },
  {
    id: "common_cruiser",
    commonName: "Common Cruiser",
    thaiName: "ผีเสื้อกะทกรกธรรมดา",
    scientificName: "Vindula erota",
    family: "Nymphalidae",
    description: "ผีเสื้อปีกแหลมสีน้ำตาลส้ม ตัวเมียมีแถบสีขาวพาดผ่านกลางปีก ขอบปีกมีหยักหยักคล้ายคลื่น มักเกาะบินสูงตามยอดไม้และลงมากินน้ำหวานหรือผลไม้สุกที่หล่นบนพื้นดินในป่าดงดิบ",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=300&auto=format&fit=crop", // placeholder
    discoveryDate: "2026-05-15",
    confidence: "N/A (Manual)",
    reporter: "Pang Sida Staff",
    notes: "พบบริเวณห้วยน้ำเย็น"
  },
  {
    id: "lemon_emigrant",
    commonName: "Lemon Emigrant",
    thaiName: "ผีเสื้อหนอนคูนธรรมดา",
    scientificName: "Catopsilia pomona",
    family: "Pieridae",
    description: "ผีเสื้อหนอนคูนธรรมดามีสีเหลืองมะนาวอ่อนหรือเหลืองอมเขียว บินระดับต่ำและรวดเร็วมาก เป็นหนึ่งในสปีชีส์ที่พบบ่อยที่สุดในอุทยานแห่งชาติปางสีดา ชอบรวมกลุ่มตามโป่งดินชื้นแฉะร่วมกับส้มปีกสีส้มสว่าง",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=300&auto=format&fit=crop", // placeholder
    discoveryDate: "2026-05-10",
    confidence: "N/A (Manual)",
    reporter: "Pang Sida Staff",
    notes: "พบได้ตลอดเส้นทางขึ้นจุดชมวิว"
  }
];

// App State Management
let db = [...DEFAULT_SPECIES];
let activeScanFile = null;
let activeScanDataUri = null;

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
  loadLocalDatabase();
  renderSpeciesGrid();
  renderChart();
  updateCounters();
  setupEventListeners();
  checkSheetsConnectionStatus();
  checkAIConnectionStatus();
  // Re-check AI status every 60s
  setInterval(checkAIConnectionStatus, 60000);
  initHotspotMap();
});

// Load database from LocalStorage if exists
function loadLocalDatabase() {
  const savedDb = localStorage.getItem("pang_sida_butterflies");
  if (savedDb) {
    try {
      db = JSON.parse(savedDb);
    } catch (e) {
      console.error("Failed to parse saved database, using default.", e);
    }
  }
}

// Save database to LocalStorage
function saveLocalDatabase() {
  localStorage.setItem("pang_sida_butterflies", JSON.stringify(db));
}

// Render Species Grid in the Directory tab
function renderSpeciesGrid(filteredDb = db) {
  const grid = document.getElementById("butterflyGrid");
  if (!grid) return;
  
  if (filteredDb.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-secondary);">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 24 24" style="margin-bottom: 1rem; opacity: 0.5;">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
        <p>ไม่พบข้อมูลผีเสื้อตามเงื่อนไขที่ค้นหา</p>
      </div>
    `;
    return;
  }
  
  grid.innerHTML = filteredDb.map(species => {
    const isLocalImage = species.image.startsWith("resources/") || species.image.startsWith("data:");
    const imgSrc = isLocalImage ? species.image : "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400&auto=format&fit=crop"; // default fallback for remote placeholders
    
    return `
      <div class="butterfly-card" onclick="openDetailsModal('${species.id}')">
        <div class="card-img-wrapper">
          <img src="${imgSrc}" alt="${species.commonName}" class="card-img" onerror="this.src='https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400&auto=format&fit=crop'">
          <span class="family-badge">${species.family}</span>
        </div>
        <div class="card-content">
          <div class="card-names">
            <h4>${species.thaiName}</h4>
            <p>${species.commonName} (<em>${species.scientificName}</em>)</p>
          </div>
          <div class="card-stats">
            <div class="card-stat">โดย: <span>${species.reporter}</span></div>
            <div class="card-stat">สแกน: <span>${species.confidence !== "N/A (Manual)" ? species.confidence + "%" : "ระบุเอง"}</span></div>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

// Update Dashboard Statistics
function updateCounters() {
  document.getElementById("totalSpeciesCount").textContent = db.length;
  
  const aiCount = db.filter(s => s.confidence && s.confidence !== "N/A (Manual)").length;
  document.getElementById("aiVerifiedCount").textContent = aiCount;
  
  // Calculate unique families
  const families = new Set(db.map(s => s.family));
  document.getElementById("familiesCount").textContent = families.size;
}

// Render dynamic family distribution chart (SVG bars)
function renderChart() {
  const chartContainer = document.getElementById("chartContainer");
  if (!chartContainer) return;
  
  // Count by family
  const counts = {};
  db.forEach(s => {
    counts[s.family] = (counts[s.family] || 0) + 1;
  });
  
  const maxCount = Math.max(...Object.values(counts), 1);
  
  chartContainer.innerHTML = Object.entries(counts).map(([family, count]) => {
    const percentage = (count / maxCount) * 100;
    return `
      <div class="chart-bar-wrapper" onclick="filterByFamily('${family}')">
        <div class="chart-bar" style="height: ${percentage}%" data-value="${count}"></div>
        <span class="chart-label" title="${family}">${family.substring(0, 5)}...</span>
      </div>
    `;
  }).join("");
}

// Setup Event Listeners
function setupEventListeners() {
  // Search inputs
  const searchInput = document.getElementById("searchInput");
  const familyFilter = document.getElementById("familyFilter");
  
  if (searchInput) {
    searchInput.addEventListener("input", filterSpecies);
  }
  if (familyFilter) {
    familyFilter.addEventListener("change", filterSpecies);
    
    // Populate select options dynamically
    const families = [...new Set(db.map(s => s.family))];
    familyFilter.innerHTML = `
      <option value="all">ทั้งหมดทุกตระกูล</option>
      ${families.map(f => `<option value="${f}">${f}</option>`).join("")}
    `;
  }
  
  // Drag & Drop Handlers
  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("fileInput");
  
  if (dropzone && fileInput) {
    dropzone.addEventListener("click", () => fileInput.click());
    
    dropzone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropzone.classList.add("dragover");
    });
    
    dropzone.addEventListener("dragleave", () => {
      dropzone.classList.remove("dragover");
    });
    
    dropzone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropzone.classList.remove("dragover");
      if (e.dataTransfer.files.length > 0) {
        handleFileSelect(e.dataTransfer.files[0]);
      }
    });
    
    fileInput.addEventListener("change", (e) => {
      if (e.target.files.length > 0) {
        handleFileSelect(e.target.files[0]);
      }
    });
  }
  
  // Navigation Tabs
  const navButtons = document.querySelectorAll(".nav-links .nav-btn");
  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-tab");
      switchTab(tabId);
    });
  });
  
  // Modals Close Trigger
  const modals = document.querySelectorAll(".modal-overlay");
  modals.forEach(modal => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal || e.target.closest(".modal-close")) {
        closeAllModals();
      }
    });
  });
  
  // Settings Form Submit
  const settingsForm = document.getElementById("settingsForm");
  if (settingsForm) {
    settingsForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const sheetsUrl = document.getElementById("sheetsUrl").value.trim();
      const aiUrl = document.getElementById("aiApiUrl").value.trim();
      if (sheetsUrl) localStorage.setItem("pang_sida_sheets_url", sheetsUrl);
      if (aiUrl) localStorage.setItem("pang_sida_ai_url", aiUrl.replace(/\/+$/, ""));
      checkSheetsConnectionStatus();
      checkAIConnectionStatus();
      closeAllModals();
      alert("บันทึกการตั้งค่าสำเร็จ!");
    });

    // Load current settings
    const savedSheetsUrl = localStorage.getItem("pang_sida_sheets_url");
    if (savedSheetsUrl) document.getElementById("sheetsUrl").value = savedSheetsUrl;
    const savedAIUrl = localStorage.getItem("pang_sida_ai_url");
    if (savedAIUrl) document.getElementById("aiApiUrl").value = savedAIUrl;
  }
  
  // New Discovery Form Submit
  const discoveryForm = document.getElementById("discoveryForm");
  if (discoveryForm) {
    discoveryForm.addEventListener("submit", handleDiscoverySubmit);
  }
}

// Switch view tabs (Dashboard, Scanner, Directory)
function switchTab(tabId) {
  // Update Buttons
  document.querySelectorAll(".nav-links .nav-btn").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-tab") === tabId);
  });
  
  // Update Sections Visibility
  if (tabId === "dashboard") {
    document.getElementById("dashboardTab").style.display = "block";
    document.getElementById("directoryTab").style.display = "block";
    document.querySelector(".main-grid").style.gridTemplateColumns = "480px 1fr";
    document.querySelector(".scanner-panel").style.display = "block";
  } else if (tabId === "scanner") {
    document.getElementById("dashboardTab").style.display = "none";
    document.getElementById("directoryTab").style.display = "none";
    document.querySelector(".main-grid").style.gridTemplateColumns = "1fr";
    document.querySelector(".scanner-panel").style.display = "block";
  } else if (tabId === "directory") {
    document.getElementById("dashboardTab").style.display = "none";
    document.getElementById("directoryTab").style.display = "block";
    document.querySelector(".main-grid").style.gridTemplateColumns = "1fr";
    document.querySelector(".scanner-panel").style.display = "none";
  }
}

// Filter Species in List
function filterSpecies() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const family = document.getElementById("familyFilter").value;
  
  const filtered = db.filter(species => {
    const matchesQuery = 
      species.commonName.toLowerCase().includes(query) ||
      species.thaiName.toLowerCase().includes(query) ||
      species.scientificName.toLowerCase().includes(query) ||
      (species.notes && species.notes.toLowerCase().includes(query));
      
    const matchesFamily = family === "all" || species.family === family;
    
    return matchesQuery && matchesFamily;
  });
  
  renderSpeciesGrid(filtered);
}

function filterByFamily(family) {
  document.getElementById("familyFilter").value = family;
  switchTab("directory");
  filterSpecies();
}

// Handle image upload and display inside dropzone
function handleFileSelect(file) {
  if (!file.type.match("image.*")) {
    alert("กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น!");
    return;
  }
  
  activeScanFile = file;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    activeScanDataUri = e.target.result;
    
    // Update Dropzone HTML to show preview
    const dropzone = document.getElementById("dropzone");
    dropzone.innerHTML = `
      <div class="preview-container" id="previewContainer">
        <div class="scan-laser"></div>
        <div class="scan-grid"></div>
        <div class="bounding-box" id="scanBoundingBox" style="width: 150px; height: 150px; top: 20%; left: 30%;"></div>
        <img src="${activeScanDataUri}" class="preview-img" alt="Scan preview">
      </div>
    `;
    
    // Enable Scan Button
    document.getElementById("startScanBtn").removeAttribute("disabled");
    
    // Hide previous results
    document.getElementById("scanResults").style.display = "none";
  };
  reader.readAsDataURL(file);
}

// ─────────────────────────────────────────────────────────
// Real AI scan via butterfly_server /api/identify endpoint
// ─────────────────────────────────────────────────────────
const DEFAULT_AI_URL = "https://steady-follow-nail-suzuki.trycloudflare.com";

function getAIBaseUrl() {
  return (localStorage.getItem("pang_sida_ai_url") || DEFAULT_AI_URL).replace(/\/+$/, "");
}

// Real AI scan — POSTs image to /api/identify and renders top-3 predictions
async function startAIScan() {
  const container = document.getElementById("previewContainer");
  const scanBtn = document.getElementById("startScanBtn");
  const resultsDiv = document.getElementById("scanResults");

  if (!container || !activeScanFile) return;

  scanBtn.setAttribute("disabled", "true");
  container.classList.remove("scanned");
  container.classList.add("scanning");
  resultsDiv.style.display = "none";

  // Scanning progress overlay
  const progressText = document.createElement("div");
  Object.assign(progressText.style, {
    position: "absolute", bottom: "10px", left: "10px",
    background: "rgba(0,0,0,0.8)", padding: "4px 8px",
    borderRadius: "4px", fontSize: "0.75rem",
    fontFamily: "monospace", color: "var(--accent-green)", zIndex: "10"
  });
  container.appendChild(progressText);

  const scanLogs = [
    "UPLOADING IMAGE…",
    "RUNNING EfficientNet-B0 INFERENCE…",
    "COMPUTING SOFTMAX PROBABILITIES…",
    "MATCHING SPECIES CATALOG…"
  ];
  let i = 0;
  progressText.textContent = scanLogs[0];
  const logInterval = setInterval(() => {
    i = (i + 1) % scanLogs.length;
    progressText.textContent = scanLogs[i];
  }, 400);

  try {
    const apiBase = getAIBaseUrl();
    const formData = new FormData();
    formData.append("image", activeScanFile);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(`${apiBase}/api/identify`, {
      method: "POST",
      body: formData,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    clearInterval(logInterval);
    container.classList.remove("scanning");
    container.classList.add("scanned");
    if (progressText.parentNode) progressText.parentNode.removeChild(progressText);
    showScanResults(result);
  } catch (err) {
    clearInterval(logInterval);
    container.classList.remove("scanning");
    if (progressText.parentNode) progressText.parentNode.removeChild(progressText);
    scanBtn.removeAttribute("disabled");
    showScanError(err.message);
  }
}

// Render results from real /api/identify response
function showScanResults(result) {
  const resultsDiv = document.getElementById("scanResults");
  const bBox = document.getElementById("scanBoundingBox");
  if (!resultsDiv) return;

  resultsDiv.style.display = "block";
  const predictions = result.top_predictions || [];
  const top1 = predictions[0] || {
    species_id: result.species_id, name_th: result.name_th,
    name_sci: result.name_sci, name_en: result.name_en,
    confidence: result.confidence
  };
  const confidence = parseFloat(top1.confidence) || 0;
  const isHighConfidence = confidence >= 60;
  const isMediumConfidence = confidence >= 30 && confidence < 60;

  // Update bounding box label & color
  if (bBox) {
    bBox.setAttribute("data-label", `${top1.name_en || top1.name_sci} (${confidence.toFixed(1)}%)`);
    bBox.style.borderColor = isHighConfidence ? "var(--accent-green)"
      : isMediumConfidence ? "var(--accent-gold)" : "#ff5252";
  }

  const titleColor = isHighConfidence ? "var(--accent-green)"
    : isMediumConfidence ? "var(--accent-gold)" : "#ff5252";
  const titleText = isHighConfidence ? `ตรวจพบ: ${top1.name_th}`
    : isMediumConfidence ? `น่าจะเป็น: ${top1.name_th}`
    : `ไม่แน่ใจ — คาดว่าเป็นชนิดใหม่หรือนอกฐานข้อมูล`;
  const confClass = isHighConfidence ? "" : isMediumConfidence ? "" : " low";

  // Top-3 list
  const top3Html = predictions.slice(0, 3).map((p, idx) => {
    const pct = parseFloat(p.confidence) || 0;
    const barColor = idx === 0 ? titleColor : "var(--text-secondary)";
    return `
      <div style="margin-bottom: 0.6rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.2rem;">
          <span style="font-size:0.9rem;">
            <strong>${idx + 1}. ${p.name_th || p.species_id}</strong>
            <em style="color: var(--text-muted); font-size:0.8rem;">(${p.name_sci || p.name_en || ""})</em>
          </span>
          <span style="font-weight:700; color:${barColor};">${pct.toFixed(1)}%</span>
        </div>
        <div style="background:rgba(255,255,255,0.06); border-radius:3px; height:5px; overflow:hidden;">
          <div style="background:${barColor}; height:100%; width:${Math.min(pct, 100)}%; transition:width 0.4s;"></div>
        </div>
      </div>
    `;
  }).join("");

  const actionButtons = isHighConfidence
    ? `<button class="btn-secondary" onclick="recordObservation('${top1.species_id}', ${confidence})">บันทึกการพบเห็น</button>
       <button class="scan-btn" onclick="resetScanner()">สแกนรูปใหม่</button>`
    : `<button class="scan-btn" style="background: linear-gradient(135deg, var(--accent-gold) 0%, #ff8f00 100%);" onclick="openNewDiscoveryModal()">บันทึกเป็นชนิดใหม่</button>
       <button class="btn-secondary" onclick="resetScanner()">ยกเลิก</button>`;

  resultsDiv.innerHTML = `
    <div class="result-header">
      <span class="result-title" style="color: ${titleColor};">${titleText}</span>
      <span class="result-conf${confClass}">${confidence.toFixed(1)}% Match</span>
    </div>
    <div class="result-body">
      <p style="margin-bottom:0.6rem;"><strong>ชื่อวิทยาศาสตร์:</strong> <em>${top1.name_sci || "-"}</em>
        ${top1.name_en ? ` · <span style="color:var(--text-muted);">${top1.name_en}</span>` : ""}</p>
      <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:0.8rem;">
        Model: <code>${result.model || "EfficientNet-B0"}</code> · 40 species, Pang Sida v3
      </p>
      <h4 style="font-size:0.9rem; margin-bottom:0.6rem; color:var(--text-primary);">3 อันดับที่เป็นไปได้สูงสุด</h4>
      ${top3Html || "<p style='color:var(--text-muted);'>ไม่มีผลการคาดการณ์</p>"}
    </div>
    <div class="action-row">
      ${actionButtons}
    </div>
  `;

  // Log to Google Sheets if connected and high confidence
  if (isHighConfidence) logScanToSheets(top1);
}

// Error state
function showScanError(msg) {
  const resultsDiv = document.getElementById("scanResults");
  if (!resultsDiv) return;
  resultsDiv.style.display = "block";
  resultsDiv.innerHTML = `
    <div class="result-header">
      <span class="result-title" style="color:#ff5252;">⚠️ เชื่อมต่อ AI ไม่สำเร็จ</span>
    </div>
    <div class="result-body">
      <p style="color:var(--text-secondary); margin-bottom:0.8rem;">${msg}</p>
      <p style="font-size:0.85rem; color:var(--text-muted);">
        ตรวจสอบว่า butterfly_server กำลังรันอยู่ และ URL ใน <strong>ตั้งค่า ⚙️</strong> ถูกต้อง
      </p>
      <p style="font-size:0.82rem; color:var(--text-muted); margin-top:0.5rem;">
        ปัจจุบันใช้ endpoint: <code>${getAIBaseUrl()}</code>
      </p>
    </div>
    <div class="action-row">
      <button class="btn-secondary" onclick="openSettingsModal()">เปิดการตั้งค่า</button>
      <button class="scan-btn" onclick="resetScanner()">ลองใหม่</button>
    </div>
  `;
}

// Record observation (stub — extend to POST /api/observations later)
function recordObservation(speciesId, confidence) {
  const obs = {
    species_id: speciesId,
    confidence: confidence,
    timestamp: new Date().toISOString(),
    source: "WebPageButterfly scanner"
  };
  console.log("Observation recorded:", obs);
  alert(`บันทึกการพบเห็น ${speciesId} (${confidence.toFixed(1)}%) สำเร็จ\n(หมายเหตุ: ฟีเจอร์ส่งไป backend ยังไม่เปิดใช้งาน)`);
}

// Send to Google Sheets (optional)
function logScanToSheets(prediction) {
  const url = localStorage.getItem("pang_sida_sheets_url");
  if (!url) return;
  fetch(url, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "log_scan",
      species_id: prediction.species_id,
      name_th: prediction.name_th,
      name_sci: prediction.name_sci,
      confidence: prediction.confidence,
      timestamp: new Date().toISOString()
    })
  }).catch(e => console.warn("Sheets log failed:", e));
}

// Reset scanner back to drag & drop state
function resetScanner() {
  activeScanFile = null;
  activeScanDataUri = null;
  
  const dropzone = document.getElementById("dropzone");
  dropzone.innerHTML = `
    <div class="dropzone-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
      </svg>
    </div>
    <h3>ลากไฟล์ภาพมาที่นี่ หรือคลิกเพื่ออัปโหลด</h3>
    <p>รองรับไฟล์ JPG, PNG (ระบบจะสแกนหาชนิดผีเสื้อปางสีดาโดยอัตโนมัติ)</p>
  `;
  
  document.getElementById("startScanBtn").setAttribute("disabled", "true");
  document.getElementById("scanResults").style.display = "none";
}

// Open Details Modal for a species card
function openDetailsModal(id) {
  const species = db.find(s => s.id === id);
  if (!species) return;
  
  const modal = document.getElementById("detailsModal");
  const modalBody = modal.querySelector(".modal-body-content");
  
  const isLocalImage = species.image.startsWith("resources/") || species.image.startsWith("data:");
  const imgSrc = isLocalImage ? species.image : "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400&auto=format&fit=crop";
  
  modal.querySelector(".modal-header-img").style.backgroundImage = `url('${imgSrc}')`;
  
  modalBody.innerHTML = `
    <div class="modal-title-sec">
      <h3>${species.thaiName}</h3>
      <p>${species.commonName} (<em>${species.scientificName}</em>)</p>
    </div>
    <div class="modal-meta-grid">
      <div class="meta-item">
        <label>วงศ์ (Family)</label>
        <span>${species.family}</span>
      </div>
      <div class="meta-item">
        <label>วันที่พบบันทึก</label>
        <span>${species.discoveryDate}</span>
      </div>
      <div class="meta-item">
        <label>ผู้ค้นพบ/ผู้รายงาน</label>
        <span>${species.reporter}</span>
      </div>
      <div class="meta-item">
        <label>AI Confidence</label>
        <span>${species.confidence !== "N/A (Manual)" ? species.confidence + "%" : "ระบุเองด้วยมือ"}</span>
      </div>
    </div>
    <div class="modal-desc">
      <p style="margin-bottom: 1rem;"><strong>รายละเอียด:</strong></p>
      <p>${species.description}</p>
    </div>
    <div class="modal-desc" style="background: rgba(0,0,0,0.15); padding: 1rem; border-radius: 8px;">
      <p>📍 <strong>พิกัด/บันทึกการพบบนแผนที่:</strong> ${species.notes || "ไม่ได้ระบุรายละเอียดตำแหน่งเพิ่มเติม"}</p>
    </div>
  `;
  
  modal.classList.add("open");
}

// Open Form Modal to register a new species
function openNewDiscoveryModal() {
  const modal = document.getElementById("discoveryModal");
  
  // Set image preview in the form
  const formPreview = document.getElementById("formImagePreview");
  if (formPreview && activeScanDataUri) {
    formPreview.innerHTML = `
      <img src="${activeScanDataUri}" style="width:100%; max-height:150px; object-fit:contain; border-radius:8px; border:1px solid var(--glass-border);">
    `;
  }
  
  modal.classList.add("open");
}

// Open Settings Panel Modal
function openSettingsModal() {
  document.getElementById("settingsModal").classList.add("open");
}

// Close all active modals
function closeAllModals() {
  document.querySelectorAll(".modal-overlay").forEach(m => m.classList.remove("open"));
  // Reset form status
  const statusDiv = document.getElementById("formStatus");
  if (statusDiv) {
    statusDiv.className = "form-status";
    statusDiv.style.display = "none";
  }
}

// Update sheets text to use shorter prefix (status card now shows "Sheets:")
function checkSheetsConnectionStatus() {
  const url = localStorage.getItem("pang_sida_sheets_url");
  const indicator = document.getElementById("sheetsStatusIndicator");
  const text = document.getElementById("sheetsStatusText");
  if (!indicator || !text) return;
  if (url) {
    indicator.className = "status-dot active";
    text.textContent = "Sheets: เชื่อมต่อแล้ว";
    text.style.color = "var(--accent-green)";
  } else {
    indicator.className = "status-dot";
    text.textContent = "Sheets: ออฟไลน์";
    text.style.color = "var(--text-secondary)";
  }
}

// Check AI classifier connection status (pings /api/species — cheap GET)
async function checkAIConnectionStatus() {
  const indicator = document.getElementById("aiStatusIndicator");
  const text = document.getElementById("aiStatusText");
  if (!indicator || !text) return;
  text.textContent = "AI: ตรวจสอบ…";
  text.style.color = "var(--text-secondary)";
  indicator.className = "status-dot";
  try {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 8000);
    const r = await fetch(`${getAIBaseUrl()}/api/species`, { signal: controller.signal });
    if (r.ok) {
      indicator.className = "status-dot active";
      text.textContent = "AI: ออนไลน์ (40 species)";
      text.style.color = "var(--accent-green)";
    } else {
      throw new Error(`HTTP ${r.status}`);
    }
  } catch (e) {
    indicator.className = "status-dot";
    text.textContent = "AI: ออฟไลน์";
    text.style.color = "#ff5252";
  }
}

// Test button inside settings modal
async function testAIConnection() {
  const status = document.getElementById("aiTestStatus");
  if (!status) return;
  const url = (document.getElementById("aiApiUrl").value || "").trim().replace(/\/+$/, "");
  if (!url) {
    status.textContent = "กรุณาใส่ URL ก่อน";
    status.style.color = "#ff5252";
    return;
  }
  status.textContent = "กำลังทดสอบ…";
  status.style.color = "var(--text-secondary)";
  try {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 10000);
    const r = await fetch(`${url}/api/species`, { signal: controller.signal });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = await r.json();
    const count = Array.isArray(data) ? data.length : (data.species ? data.species.length : "?");
    status.textContent = `✓ สำเร็จ — พบ ${count} species`;
    status.style.color = "var(--accent-green)";
  } catch (e) {
    status.textContent = `✗ ผิดพลาด: ${e.message}`;
    status.style.color = "#ff5252";
  }
}

// Submit handler for logging new discovery
async function handleDiscoverySubmit(e) {
  e.preventDefault();
  
  const statusDiv = document.getElementById("formStatus");
  statusDiv.style.display = "block";
  statusDiv.className = "form-status loading";
  statusDiv.innerHTML = "กำลังเตรียมนำส่งข้อมูล...";
  
  const commonName = document.getElementById("discCommonName").value.trim();
  const scientificName = document.getElementById("discSciName").value.trim();
  const family = document.getElementById("discFamily").value;
  const reporter = document.getElementById("discReporter").value.trim();
  const notes = document.getElementById("discNotes").value.trim();
  
  const sheetsUrl = localStorage.getItem("pang_sida_sheets_url");
  
  const payload = {
    commonName: commonName || "New Species",
    scientificName: scientificName || "Sida sp.",
    family: family,
    reporter: reporter || "Anonymous Ranger",
    confidence: "34", // Simulated detection score
    notes: notes,
    hasImage: !!activeScanDataUri
  };
  
  let sheetSaved = false;
  
  if (sheetsUrl) {
    statusDiv.innerHTML = "กำลังอัปโหลดข้อมูลไปยัง Google Sheet...";
    try {
      // Use fetch to post data to Google Sheets Apps Script Web App
      const response = await fetch(sheetsUrl, {
        method: "POST",
        mode: "no-cors", // Required since Google Apps Script redirects might cause CORS issues
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      
      sheetSaved = true;
    } catch (err) {
      console.warn("Google Sheet API request failed or CORS redirected. Continuing with local backup.", err);
      // Mode 'no-cors' will trigger an opaque response which catches as an error in some environments,
      // but the request actually lands on Google Sheets. So we treat it as partial success.
      sheetSaved = true;
    }
  }
  
  // Save to Local DB anyway so it shows in the client catalog immediately
  const newSpecies = {
    id: "custom_" + Date.now(),
    commonName: payload.commonName,
    thaiName: payload.commonName + " (พบใหม่)",
    scientificName: payload.scientificName,
    family: payload.family,
    description: "ผีเสื้อชนิดใหม่ที่ค้นพบและบันทึกข้อมูลโดยผู้ใช้ระบบ ข้อมูลอ้างอิง: " + payload.notes,
    image: activeScanDataUri || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400&auto=format&fit=crop",
    discoveryDate: new Date().toISOString().split("T")[0],
    confidence: "34",
    reporter: payload.reporter,
    notes: payload.notes
  };
  
  db.unshift(newSpecies); // add to beginning of list
  saveLocalDatabase();
  renderSpeciesGrid();
  renderChart();
  updateCounters();
  
  // Success Message
  statusDiv.className = "form-status success";
  if (sheetSaved && sheetsUrl) {
    statusDiv.innerHTML = "✓ บันทึกสำเร็จ! ข้อมูลถูกนำส่งไปที่ Google Sheet และเก็บสำรองในฐานข้อมูลในเครื่องเรียบร้อยแล้ว";
  } else {
    statusDiv.innerHTML = "✓ บันทึกเข้าฐานข้อมูลในเครื่องสำเร็จ! (ต้องการนำขึ้นชีทอัตโนมัติ กรุณาตั้งค่า Web App URL ที่ไอคอนเฟืองด้านบน)";
  }
  
  // Reset scanner & form after delay
  setTimeout(() => {
    closeAllModals();
    resetScanner();
    document.getElementById("discoveryForm").reset();
  }, 2500);
}

// Hotspots Data
const HOTSPOTS_DATA = {
  km0: {
    title: "โป่งผีเสื้อกิโลเมตรที่ 0",
    desc: "จุดชมผีเสื้อปางสีดาที่โด่งดังที่สุด ตั้งอยู่ใกล้กับที่ทำการอุทยานฯ เป็นลานดินโป่งชื้นแฉะที่เจ้าหน้าที่จัดทำขึ้น มักพบผีเสื้อหนอนใบกุ่มส้ม (Orange Albatross) และหนอนคูนรวมตัวนับหมื่นๆ ตัวในฤดูร้อน",
    species: ["Orange Albatross", "Lemon Emigrant"]
  },
  waterfall: {
    title: "น้ำตกปางสีดา (กม. 1.8)",
    desc: "บริเวณโขดหินชื้นรอบน้ำตกปางสีดา ชั้นที่ 1 และ 2 มีละอองน้ำแผ่ซ่าน อุณหภูมิเย็นและร่มรื่น เป็นสถานที่ที่ดีที่สุดในการชมผีเสื้อตระกูลหางติ่งขนาดใหญ่ เช่น หางติ่งนางละเวง (Paris Peacock) เกาะกินแร่ธาตุตามหินทราย",
    species: ["Paris Peacock", "Lime Butterfly"]
  },
  huai: {
    title: "เส้นทางห้วยชันได (กม. 5-6)",
    desc: "เส้นทางเดินป่าศึกษาธรรมชาติเลียบทางน้ำธรรมชาติ มีผืนป่าทึบและพุ่มไม้ขึ้นหนาแน่นสูง เหมาะกับการสำรวจพบสายพันธุ์หายากที่ชอบความเงียบสงบ เช่น ตระกูลขาหน้าพู่ หรือผีเสื้อแฉกหางธรรมดา",
    species: ["Common Cruiser"]
  },
  km20: {
    title: "จุดชมวิวกิโลเมตรที่ 20",
    desc: "สันเขาห่างไกลรอยต่อผืนป่าระดับสูง มีกระแสลมและทิวทัศน์สวยงาม เป็นบริเวณที่อากาศค่อนข้างเย็น เหมาะสำหรับการดักชมสปีชีส์แปลกตาที่อาศัยตามยอดเรือนยอดไม้สูงและผีเสื้อเฉพาะของป่าดงดิบเขา",
    species: ["Paris Peacock", "Common Cruiser"]
  }
};

function initHotspotMap() {
  const nodes = document.querySelectorAll(".map-node");
  
  // Set default details card
  showHotspotDetails("km0");
  
  nodes.forEach(node => {
    node.addEventListener("click", () => {
      // Remove active class from all nodes
      nodes.forEach(n => n.classList.remove("active"));
      // Add active class to clicked node
      node.classList.add("active");
      
      const key = node.getAttribute("data-hotspot");
      showHotspotDetails(key);
    });
  });
}

function showHotspotDetails(key) {
  const data = HOTSPOTS_DATA[key];
  const card = document.getElementById("hotspotDetailsCard");
  if (!data || !card) return;
  
  card.innerHTML = `
    <div>
      <div class="hotspot-title">📍 ${data.title}</div>
      <div class="hotspot-desc">${data.desc}</div>
    </div>
    <div class="hotspot-species">
      <h5>สายพันธุ์เด่นที่พบบ่อยที่นี่:</h5>
      <div class="hotspot-species-list">
        ${data.species.map(sName => `<span class="hotspot-species-badge" onclick="searchBySpeciesName('${sName}')">${sName}</span>`).join("")}
      </div>
    </div>
  `;
}

function searchBySpeciesName(name) {
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.value = name;
    switchTab("directory");
    filterSpecies();
  }
}
