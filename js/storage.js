/**
 * FieldForge Storage Manager
 * localStorage wrapper with JSON export/import
 */

const STORAGE_KEY = 'fieldforge_data';

/**
 * Get all app state from localStorage
 */
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultState();
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Storage load failed:', e);
    return getDefaultState();
  }
}

/**
 * Save all app state to localStorage
 */
function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (e) {
    console.error('Storage save failed:', e);
    return false;
  }
}

/**
 * Get default state structure
 */
function getDefaultState() {
  return {
    business: {
      name: '',
      tagline: '',
      email: '',
      phone: '',
      website: '',
      logo: null // base64 data URL
    },
    settings: {
      defaultTrade: 'general',
      taxRate: 0,
      invoicePrefix: 'INV',
      nextInvoiceNumber: 1
    },
    // Current invoice/quote being worked on
    current: {
      type: 'invoice', // 'invoice' | 'quote'
      number: '',
      date: '',
      client: {
        name: '',
        address: '',
        cityStateZip: '',
        phone: '',
        email: ''
      },
      jobNotes: '',
      lines: [],
      taxRate: 0,
      trade: 'general'
    },
    // Saved invoices/quotes
    documents: []
  };
}

/**
 * Save the current document
 */
function saveCurrentDocument() {
  const state = loadState();
  const doc = { ...state.current };
  doc.id = Date.now().toString();
  doc.savedAt = new Date().toISOString();
  doc.number = doc.number || generateDocNumber(state.settings);
  
  // Check if updating existing or new
  const existingIdx = state.documents.findIndex(d => d.id === doc.id);
  if (existingIdx >= 0) {
    state.documents[existingIdx] = doc;
  } else {
    state.documents.unshift(doc);
  }
  
  // Increment invoice number
  state.settings.nextInvoiceNumber++;
  state.current = getDefaultState().current;
  state.current.number = generateDocNumber(state.settings);
  
  saveState(state);
  return doc;
}

/**
 * Load a saved document into current
 */
function loadDocument(id) {
  const state = loadState();
  const doc = state.documents.find(d => d.id === id);
  if (doc) {
    state.current = { ...doc };
    saveState(state);
    return doc;
  }
  return null;
}

/**
 * Delete a saved document
 */
function deleteDocument(id) {
  const state = loadState();
  state.documents = state.documents.filter(d => d.id !== id);
  saveState(state);
}

/**
 * Update business info
 */
function updateBusiness(info) {
  const state = loadState();
  state.business = { ...state.business, ...info };
  saveState(state);
}

/**
 * Update settings
 */
function updateSettings(info) {
  const state = loadState();
  state.settings = { ...state.settings, ...info };
  saveState(state);
}

/**
 * Generate next document number
 */
function generateDocNumber(settings) {
  const prefix = settings.invoicePrefix || 'INV';
  const num = (settings.nextInvoiceNumber || 1).toString().padStart(4, '0');
  return `${prefix}-${num}`;
}

/**
 * Export all data as JSON file download
 */
function exportData() {
  const state = loadState();
  const json = JSON.stringify(state, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `fieldforge-export-${new Date().toISOString().slice(0,10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Import data from JSON file
 */
async function importData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        // Merge with existing, preferring imported
        const current = loadState();
        const merged = {
          ...current,
          ...data,
          business: { ...current.business, ...data.business },
          settings: { ...current.settings, ...data.settings }
        };
        saveState(merged);
        resolve({ success: true, count: data.documents?.length || 0 });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

/**
 * Convert image file to base64 for logo
 */
function imageToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Clear all data (factory reset)
 */
function clearAllData() {
  localStorage.removeItem(STORAGE_KEY);
  return getDefaultState();
}

/**
 * Get documents list (for UI)
 */
function getDocuments() {
  const state = loadState();
  return state.documents.map(d => ({
    id: d.id,
    number: d.number,
    type: d.type,
    clientName: d.client?.name || 'Unknown',
    date: d.date,
    savedAt: d.savedAt,
    grand: d.grand
  }));
}