/**
 * FieldForge - Main Application
 * Quote & Invoice PWA for Field Service Trades
 */

// ============================================
// APP STATE & INIT
// ============================================

let currentState = null;
let activeTrade = 'general';

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

async function initApp() {
  // Load saved state
  currentState = loadState();
  
  // Set defaults
  if (!currentState.current.date) {
    currentState.current.date = new Date().toISOString().slice(0, 10);
  }
  if (!currentState.current.number) {
    currentState.current.number = generateDocNumber(currentState.settings);
  }
  
  // Render
  renderAll();
  
  // Register service worker (PWA install)
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }
  
  // Show install banner if applicable
  checkInstallPrompt();
  
  // Load business info from state
  loadBusinessInfo();
}

// ============================================
// RENDER FUNCTIONS
// ============================================

function renderAll() {
  renderControls();
  renderSheet();
  updateTotals();
}

function renderControls() {
  const tradeSelect = document.getElementById('trade-select');
  if (tradeSelect) {
    // Populate trade options
    const keys = getTradeKeys();
    tradeSelect.innerHTML = keys.map(k => {
      const cat = SERVICE_CATALOGS[k];
      return `<option value="${k}">${cat.icon} ${cat.name}</option>`;
    }).join('');
    
    // Set current trade
    tradeSelect.value = currentState.current.trade || 'general';
    activeTrade = tradeSelect.value;
    
    // Change handler
    tradeSelect.onchange = () => {
      activeTrade = tradeSelect.value;
      currentState.current.trade = activeTrade;
      saveState(currentState);
    };
  }
}

function renderSheet() {
  const sheet = document.getElementById('sheet');
  if (!sheet) return;
  
  // Update doc type toggle
  const docLabel = document.getElementById('doc-type');
  if (docLabel) {
    docLabel.textContent = currentState.current.type.toUpperCase();
    docLabel.classList.toggle('active', currentState.current.type === 'invoice');
  }
  
  // Update date
  const datePicker = document.getElementById('date-picker');
  if (datePicker) datePicker.value = currentState.current.date || '';
  
  // Update invoice number
  const invoiceNum = document.getElementById('invoice-num');
  if (invoiceNum) invoiceNum.value = currentState.current.number || '';
  
  // Update client fields
  const client = currentState.current.client || {};
  const nameIn = document.getElementById('client-name');
  const addrIn = document.getElementById('client-address');
  const cszIn = document.getElementById('client-csz');
  const phoneIn = document.getElementById('client-phone');
  const emailIn = document.getElementById('client-email');
  
  if (nameIn) nameIn.value = client.name || '';
  if (addrIn) addrIn.value = client.address || '';
  if (cszIn) cszIn.value = client.cityStateZip || '';
  if (phoneIn) phoneIn.value = client.phone || '';
  if (emailIn) emailIn.value = client.email || '';
  
  // Update job notes
  const jobNotes = document.getElementById('job-notes');
  if (jobNotes) jobNotes.value = currentState.current.jobNotes || '';
  
  // Update tax rate
  const taxRate = document.getElementById('tax-rate');
  if (taxRate) taxRate.value = currentState.current.taxRate || 0;
  
  // Render line items
  renderLineItems();
}

function renderLineItems() {
  const tbody = document.getElementById('lines');
  if (!tbody) return;
  
  const lines = currentState.current.lines || [];
  
  if (lines.length === 0) {
    // Add default empty row
    addRow();
    return;
  }
  
  tbody.innerHTML = '';
  lines.forEach((line, idx) => {
    const tr = createLineRow(line, idx);
    tbody.appendChild(tr);
  });
}

function createLineRow(line = {}, idx) {
  const tr = document.createElement('tr');
  const rate = line.rate || 0;
  const qty = line.qty || 1;
  const total = rate * qty;
  
  tr.innerHTML = `
    <td style="position:relative;">
      <textarea class="desc" rows="1" placeholder="Service description..." 
        oninput="autoGrow(this); calc()" data-idx="${idx}">${line.desc || ''}</textarea>
      <button class="pick-btn" onclick="showServicePicker(this)" title="Pick service">▼</button>
    </td>
    <td><input type="number" class="editable num" value="${qty}" min="0" step="1" 
      oninput="calc()" data-idx="${idx}"></td>
    <td><input type="number" class="editable money rate" placeholder="0.00" 
      value="${rate}" oninput="calc()" data-idx="${idx}"></td>
    <td><input type="text" class="editable money row-total" value="$${total.toFixed(2)}" readonly></td>
    <td class="c-del"><button class="del-x" onclick="deleteRow(${idx})">×</button></td>
  `;
  
  return tr;
}

// ============================================
// LINE ITEM MANAGEMENT
// ============================================

function addRow() {
  if (!currentState.current.lines) {
    currentState.current.lines = [];
  }
  
  // Add empty line
  currentState.current.lines.push({ desc: '', qty: 1, rate: 0 });
  
  // Create and append DOM row
  const tbody = document.getElementById('lines');
  if (tbody) {
    const idx = currentState.current.lines.length - 1;
    const tr = createLineRow(currentState.current.lines[idx], idx);
    tbody.appendChild(tr);
    
    // Auto-grow any textareas
    tr.querySelectorAll('textarea.desc').forEach(autoGrow);
    
    // Focus the new description field
    tr.querySelector('textarea.desc').focus();
  }
  
  saveState(currentState);
}

function deleteRow(idx) {
  if (!currentState.current.lines) return;
  
  // Remove from state
  currentState.current.lines.splice(idx, 1);
  
  // Re-render
  renderLineItems();
  calc();
  saveState(currentState);
}

function showServicePicker(btn) {
  // Remove any existing dropdown
  const existing = document.querySelector('.service-dropdown');
  if (existing) existing.remove();
  
  const dropdown = document.createElement('div');
  dropdown.className = 'service-dropdown';
  
  // Get services for active trade
  const services = SERVICE_CATALOGS[activeTrade]?.services || [];
  
  services.forEach(svc => {
    const item = document.createElement('div');
    item.className = 'service-item';
    
    const name = svc.desc.split(':')[0];
    const avgRate = ((svc.low + svc.high) / 2).toFixed(2);
    
    item.innerHTML = `<strong>$${avgRate}</strong> — ${name} <span>/ ${svc.unit}</span>`;
    item.title = svc.desc;
    
    item.onclick = () => {
      const row = btn.closest('tr');
      const idx = parseInt(row.querySelector('.desc').dataset.idx);
      
      // Update state
      if (currentState.current.lines[idx]) {
        currentState.current.lines[idx].desc = svc.desc;
        currentState.current.lines[idx].rate = parseFloat(avgRate);
      }
      
      // Update DOM
      const textarea = row.querySelector('.desc');
      const rateInput = row.querySelector('.rate');
      
      textarea.value = svc.desc;
      rateInput.value = avgRate;
      
      autoGrow(textarea);
      calc();
      saveState(currentState);
      
      dropdown.remove();
    };
    
    dropdown.appendChild(item);
  });
  
  btn.parentElement.appendChild(dropdown);
  dropdown.classList.add('show');
  
  // Close on click outside
  setTimeout(() => {
    const closeHandler = (e) => {
      if (!dropdown.contains(e.target) && e.target !== btn) {
        dropdown.remove();
        document.removeEventListener('click', closeHandler);
      }
    };
    document.addEventListener('click', closeHandler);
  }, 10);
}

// ============================================
// CALCULATIONS
// ============================================

function calc() {
  if (!currentState.current.lines) return;
  
  let subtotal = 0;
  
  // Update state from DOM
  const rows = document.querySelectorAll('#lines tr');
  rows.forEach((row, i) => {
    const descEl = row.querySelector('.desc');
    const qtyEl = row.querySelector('.num');
    const rateEl = row.querySelector('.rate');
    const totalEl = row.querySelector('.row-total');
    
    if (!descEl || !qtyEl || !rateEl || !totalEl) return;
    
    const idx = parseInt(descEl.dataset.idx);
    const qty = parseFloat(qtyEl.value) || 0;
    const rate = parseFloat(rateEl.value) || 0;
    const total = qty * rate;
    
    totalEl.value = '$' + total.toFixed(2);
    
    // Update state
    if (currentState.current.lines[idx]) {
      currentState.current.lines[idx].desc = descEl.value;
      currentState.current.lines[idx].qty = qty;
      currentState.current.lines[idx].rate = rate;
    }
    
    subtotal += total;
  });
  
  // Tax
  const taxRate = parseFloat(document.getElementById('tax-rate')?.value) || 0;
  const taxAmount = subtotal * (taxRate / 100);
  const grand = subtotal + taxAmount;
  
  // Update totals display
  const subtotalEl = document.getElementById('subtotal');
  const taxAmtEl = document.getElementById('tax-amt');
  const grandEl = document.getElementById('grand');
  
  if (subtotalEl) subtotalEl.textContent = '$' + subtotal.toFixed(2);
  if (taxAmtEl) taxAmtEl.textContent = '$' + taxAmount.toFixed(2);
  if (grandEl) grandEl.textContent = '$' + grand.toFixed(2);
  
  // Update state
  currentState.current.subtotal = subtotal;
  currentState.current.taxAmount = taxAmount;
  currentState.current.grand = grand;
  currentState.current.taxRate = taxRate;
  
  saveState(currentState);
}

// ============================================
// AUTO-GROW TEXTAREA
// ============================================

function autoGrow(el) {
  el.style.height = 'auto';
  el.style.height = el.scrollHeight + 'px';
}

// ============================================
// MODALS
// ============================================

function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('open');
    
    // If it's the rate reference modal, update content
    if (id === 'rate-modal') {
      updateRateModal();
    }
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('open');
}

function toggleModal() {
  const modal = document.getElementById('rate-modal');
  if (modal) {
    modal.classList.toggle('open');
    if (modal.classList.contains('open')) updateRateModal();
  }
}

function updateRateModal() {
  const content = document.getElementById('rate-modal-content');
  if (content) {
    const cat = SERVICE_CATALOGS[activeTrade];
    const zip = document.getElementById('zip-input')?.value || '';
    const county = zip ? getCountyFromZip(zip) : 'Select a ZIP to see regional rates';
    const taxRate = zip ? getTaxRateForZip(zip) : null;
    
    content.innerHTML = `
      <p class="modal-subtitle">
        ${county}${taxRate !== null ? ` — Tax Rate: ${taxRate}%` : ''}
      </p>
      ${buildRateTable(activeTrade)}
    `;
  }
}

// ============================================
// DOC TYPE TOGGLE
// ============================================

function toggleType() {
  currentState.current.type = currentState.current.type === 'invoice' ? 'quote' : 'invoice';
  saveState(currentState);
  renderSheet();
}

// ============================================
// FIELD UPDATES
// ============================================

function updateField(field, value) {
  switch(field) {
    case 'number':
      currentState.current.number = value;
      break;
    case 'date':
      currentState.current.date = value;
      break;
    case 'client-name':
      if (!currentState.current.client) currentState.current.client = {};
      currentState.current.client.name = value;
      break;
    case 'client-address':
      if (!currentState.current.client) currentState.current.client = {};
      currentState.current.client.address = value;
      break;
    case 'client-csz':
      if (!currentState.current.client) currentState.current.client = {};
      currentState.current.client.cityStateZip = value;
      break;
    case 'client-phone':
      if (!currentState.current.client) currentState.current.client = {};
      currentState.current.client.phone = value;
      break;
    case 'client-email':
      if (!currentState.current.client) currentState.current.client = {};
      currentState.current.client.email = value;
      break;
    case 'jobNotes':
      currentState.current.jobNotes = value;
      break;
    case 'footer':
      currentState.current.footer = value;
      break;
  }
  saveState(currentState);
}

// ============================================
// ZIP LOOKUP
// ============================================

function lookupZip() {
  const zip = document.getElementById('zip-input')?.value;
  if (!zip || zip.length < 5) {
    showToast('Enter a 5-digit ZIP code', 'error');
    return;
  }
  
  const taxRate = getTaxRateForZip(zip);
  const county = getCountyFromZip(zip);
  
  // Update tax rate field
  const taxRateEl = document.getElementById('tax-rate');
  if (taxRateEl) {
    taxRateEl.value = taxRate;
    calc();
  }
  
  // Update modal content
  updateRateModal();
  
  showToast(`Tax rate for ${county}: ${taxRate}%`, 'success');
}

// ============================================
// PDF & EMAIL
// ============================================

async function printPDF() {
  showToast('Generating PDF...', 'info');
  
  try {
    // Update state with current form values first
    syncFormToState();
    await generatePDF(currentState);
    showToast('PDF downloaded!', 'success');
  } catch (e) {
    console.error(e);
    showToast('PDF generation failed: ' + e.message, 'error');
  }
}

async function emailPDF() {
  showToast('Generating PDF...', 'info');
  
  try {
    syncFormToState();
    const filename = await generatePDF(currentState);
    
    // Create mailto link with PDF as attachment
    // Note: Most mail clients don't support attachments via mailto:
    // This is a limitation - in production you'd use a server-side mailer
    const client = currentState.current.client || {};
    const subject = encodeURIComponent(`${currentState.current.type === 'invoice' ? 'Invoice' : 'Quote'} ${currentState.current.number} from ${currentState.business.name || 'FieldForge'}`);
    const body = encodeURIComponent(
      `Dear ${client.name || 'Valued Customer'},\n\n` +
      `Please find attached ${currentState.current.type} ${currentState.current.number}.\n\n` +
      `Total: $${(currentState.current.grand || 0).toFixed(2)}\n\n` +
      `Thank you for your business!\n\n` +
      `${currentState.business.name || ''}\n` +
      `${currentState.business.phone || ''} | ${currentState.business.email || ''}`
    );
    
    // Try mailto (attachment won't work, but opens the email)
    window.location.href = `mailto:${client.email || ''}?subject=${subject}&body=${body}`;
    
    showToast('Email client opened. Note: Attach PDF manually to email.', 'info', 5000);
  } catch (e) {
    console.error(e);
    showToast('PDF generation failed: ' + e.message, 'error');
  }
}

function syncFormToState() {
  // Sync all form fields to state before PDF/email
  const datePicker = document.getElementById('date-picker');
  const invoiceNum = document.getElementById('invoice-num');
  const nameIn = document.getElementById('client-name');
  const addrIn = document.getElementById('client-address');
  const cszIn = document.getElementById('client-csz');
  const phoneIn = document.getElementById('client-phone');
  const emailIn = document.getElementById('client-email');
  const jobNotes = document.getElementById('job-notes');
  const footerIn = document.getElementById('footer-input');
  
  if (datePicker) currentState.current.date = datePicker.value;
  if (invoiceNum) currentState.current.number = invoiceNum.value;
  if (nameIn) { if (!currentState.current.client) currentState.current.client = {}; currentState.current.client.name = nameIn.value; }
  if (addrIn) { if (!currentState.current.client) currentState.current.client = {}; currentState.current.client.address = addrIn.value; }
  if (cszIn) { if (!currentState.current.client) currentState.current.client = {}; currentState.current.client.cityStateZip = cszIn.value; }
  if (phoneIn) { if (!currentState.current.client) currentState.current.client = {}; currentState.current.client.phone = phoneIn.value; }
  if (emailIn) { if (!currentState.current.client) currentState.current.client = {}; currentState.current.client.email = emailIn.value; }
  if (jobNotes) currentState.current.jobNotes = jobNotes.value;
  if (footerIn) currentState.current.footer = footerIn.value;
}

// ============================================
// SAVE / LOAD
// ============================================

function saveDocument() {
  syncFormToState();
  const doc = saveCurrentDocument();
  showToast(`Saved as ${doc.number}`, 'success');
}

function newDocument() {
  currentState.current = getDefaultState().current;
  currentState.current.number = generateDocNumber(currentState.settings);
  currentState.current.date = new Date().toISOString().slice(0, 10);
  currentState.current.trade = activeTrade;
  saveState(currentState);
  renderAll();
  showToast('New document started', 'info');
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================

function showToast(message, type = 'info', duration = 3000) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  // Animate in
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });
  
  // Remove after duration
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ============================================
// PWA INSTALL
// ============================================

let deferredPrompt = null;

function checkInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    const banner = document.getElementById('install-banner');
    if (banner) banner.classList.add('show');
  });
}

function installPWA() {
  if (!deferredPrompt) {
    showToast('Install not available. Try using Chrome on Android.', 'info');
    return;
  }
  
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then((choice) => {
    if (choice.outcome === 'accepted') {
      showToast('FieldForge installed!', 'success');
    }
    deferredPrompt = null;
    
    const banner = document.getElementById('install-banner');
    if (banner) banner.classList.remove('show');
  });
}

// ============================================
// LOGO UPLOAD
// ============================================

async function handleLogoUpload(file) {
  if (!file || !file.type.startsWith('image/')) {
    showToast('Please select an image file', 'error');
    return;
  }
  
  try {
    const base64 = await imageToBase64(file);
    currentState.business.logo = base64;
    saveState(currentState);
    
    // Show preview
    const preview = document.querySelector('.logo-upload');
    if (preview) {
      preview.innerHTML = `<img src="${base64}" alt="Logo">`;
    }
    
    showToast('Logo uploaded!', 'success');
  } catch (e) {
    showToast('Logo upload failed', 'error');
  }
}

// ============================================
// BUSINESS INFO
// ============================================

function loadBusinessInfo() {
  const biz = currentState.business || {};
  
  const nameEl = document.getElementById('biz-name');
  const taglineEl = document.getElementById('biz-tagline');
  const phoneEl = document.getElementById('biz-phone');
  const emailEl = document.getElementById('biz-email');
  const websiteEl = document.getElementById('biz-website');
  const logoPreview = document.querySelector('.logo-upload');
  
  if (nameEl) nameEl.value = biz.name || '';
  if (taglineEl) taglineEl.value = biz.tagline || '';
  if (phoneEl) phoneEl.value = biz.phone || '';
  if (emailEl) emailEl.value = biz.email || '';
  if (websiteEl) websiteEl.value = biz.website || '';
  
  if (logoPreview && biz.logo) {
    logoPreview.innerHTML = `<img src="${biz.logo}" alt="Logo">`;
  }
}

function updateBusinessInfo() {
  const nameEl = document.getElementById('biz-name');
  const taglineEl = document.getElementById('biz-tagline');
  const phoneEl = document.getElementById('biz-phone');
  const emailEl = document.getElementById('biz-email');
  const websiteEl = document.getElementById('biz-website');
  
  updateBusiness({
    name: nameEl?.value || '',
    tagline: taglineEl?.value || '',
    phone: phoneEl?.value || '',
    email: emailEl?.value || '',
    website: websiteEl?.value || ''
  });
  
  showToast('Business info saved', 'success');
}

function updateTotals() {
  const subtotalEl = document.getElementById('subtotal');
  const taxAmtEl = document.getElementById('tax-amt');
  const grandEl = document.getElementById('grand');
  
  if (subtotalEl) subtotalEl.textContent = '$' + (currentState.current.subtotal || 0).toFixed(2);
  if (taxAmtEl) taxAmtEl.textContent = '$' + (currentState.current.taxAmount || 0).toFixed(2);
  if (grandEl) grandEl.textContent = '$' + (currentState.current.grand || 0).toFixed(2);
}