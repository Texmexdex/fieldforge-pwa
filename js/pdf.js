/**
 * FieldForge PDF Generator
 * Uses jsPDF for client-side PDF generation
 * No server required - runs entirely in browser
 */

// We'll load jsPDF from CDN dynamically
let jsPDF = null;

async function loadJsPDF() {
  if (jsPDF) return jsPDF;
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.onload = () => {
      jsPDF = window.jspdf.jsPDF;
      resolve(jsPDF);
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

/**
 * Generate PDF from current invoice/quote state
 */
async function generatePDF(state) {
  await loadJsPDF();
  
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter'
  });
  
  const pageWidth = 216; // Letter width in mm
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);
  let y = margin;
  
  // Colors
  const dark = [26, 26, 26];
  const mid = [102, 102, 102];
  const accent = [37, 99, 235];
  
  // Helper functions
  const setFont = (style = 'normal', weight = 'normal', size = 10) => {
    doc.setFont('helvetica', style, weight);
    doc.setFontSize(size);
  };
  
  const text = (str, x, yPos, options = {}) => {
    doc.setTextColor(...(options.color || dark));
    doc.text(str, x, yPos, options);
  };
  
  const line = (yPos, color = mid) => {
    doc.setDrawColor(...color);
    doc.setLineWidth(0.3);
    doc.line(margin, yPos, pageWidth - margin, yPos);
  };
  
  // ===== HEADER =====
  // Logo if exists
  if (state.business.logo) {
    try {
      doc.addImage(state.business.logo, 'JPEG', margin, y, 25, 25);
    } catch (e) {
      // Logo failed, skip
    }
    y += 5;
  } else if (state.business.name) {
    setFont('bold', 800, 16);
    text(state.business.name.toUpperCase(), margin, y + 8);
    y += 8;
  }
  
  // Company info (right side)
  const rightX = pageWidth - margin;
  doc.setFontAlign('right');
  
  if (state.business.name) {
    setFont('bold', 800, 14);
    text(state.business.name.toUpperCase(), rightX, y + 6);
    y += 6;
  }
  
  if (state.business.tagline) {
    setFont('normal', 400, 7);
    text(state.business.tagline.toUpperCase(), rightX, y + 4);
    y += 4;
  }
  
  if (state.business.phone || state.business.email) {
    setFont('normal', 400, 8);
    let contactInfo = [];
    if (state.business.phone) contactInfo.push(state.business.phone);
    if (state.business.email) contactInfo.push(state.business.email);
    text(contactInfo.join('  |  '), rightX, y + 4);
  }
  
  doc.setFontAlign('left');
  y += 20;
  
  // Divider line
  line(y, dark);
  y += 8;
  
  // ===== DOC TYPE + META =====
  setFont('bold', 800, 20);
  text(state.current.type.toUpperCase(), margin, y + 5, { color: [180, 180, 180] });
  
  // Invoice # and Date (right side)
  doc.setFontAlign('right');
  setFont('bold', 700, 10);
  const metaY = y;
  text(`Invoice #: ${state.current.number || 'N/A'}`, rightX, metaY + 5);
  setFont('normal', 400, 9);
  text(`Date: ${state.current.date || new Date().toISOString().slice(0,10)}`, rightX, metaY + 10);
  
  doc.setFontAlign('left');
  y += 20;
  
  // ===== CLIENT INFO =====
  setFont('bold', 700, 8);
  text('BILL TO', margin, y);
  y += 5;
  
  setFont('bold', 700, 11);
  text(state.current.client?.name || '', margin, y);
  y += 5;
  
  setFont('normal', 400, 9);
  if (state.current.client?.address) {
    text(state.current.client.address, margin, y);
    y += 4;
  }
  if (state.current.client?.cityStateZip) {
    text(state.current.client.cityStateZip, margin, y);
    y += 4;
  }
  if (state.current.client?.phone || state.current.client?.email) {
    let contact = [];
    if (state.current.client?.phone) contact.push(state.current.client.phone);
    if (state.current.client?.email) contact.push(state.current.client.email);
    text(contact.join('  |  '), margin, y);
  }
  
  y += 10;
  
  // Job notes if present
  if (state.current.jobNotes) {
    setFont('bold', 700, 8);
    text('JOB NOTES', margin, y);
    y += 5;
    setFont('normal', 400, 9);
    
    // Word wrap job notes
    const noteLines = doc.splitTextToSize(state.current.jobNotes, contentWidth);
    noteLines.forEach(ln => {
      text(ln, margin, y);
      y += 4;
    });
    y += 8;
  }
  
  // ===== LINE ITEMS TABLE =====
  line(y);
  y += 5;
  
  // Table header
  setFont('bold', 700, 8);
  const colWidths = { desc: 80, qty: 15, rate: 35, total: 35 };
  
  text('DESCRIPTION', margin, y);
  text('QTY', margin + colWidths.desc + 10, y);
  doc.setFontAlign('right');
  text('RATE', margin + colWidths.desc + colWidths.qty + 15, y);
  text('TOTAL', pageWidth - margin, y);
  doc.setFontAlign('left');
  
  y += 4;
  line(y, dark);
  y += 5;
  
  // Line items
  setFont('normal', 400, 9);
  
  const lines = state.current.lines || [];
  lines.forEach(item => {
    if (!item.desc) return;
    
    // Description (may wrap)
    const descLines = doc.splitTextToSize(item.desc, colWidths.desc - 5);
    descLines.forEach((ln, i) => {
      text(ln, margin, y);
      y += 4;
    });
    
    // Qty
    text(String(item.qty || 1), margin + colWidths.desc + 10, y - (descLines.length * 4) + (descLines.length * 4/2));
    
    // Rate
    doc.setFontAlign('right');
    text('$' + (parseFloat(item.rate) || 0).toFixed(2), margin + colWidths.desc + colWidths.qty + 15, y - (descLines.length * 4) + (descLines.length * 4/2));
    
    // Total
    const total = (parseFloat(item.qty) || 0) * (parseFloat(item.rate) || 0);
    text('$' + total.toFixed(2), pageWidth - margin, y - (descLines.length * 4) + (descLines.length * 4/2));
    doc.setFontAlign('left');
    
    y += Math.max(descLines.length * 4, 8);
  });
  
  y += 5;
  line(y);
  y += 10;
  
  // ===== TOTALS =====
  const totalsX = pageWidth - margin - 80;
  
  // Subtotal
  setFont('normal', 400, 10);
  text('Subtotal', totalsX, y);
  doc.setFontAlign('right');
  text('$' + (state.current.subtotal || 0).toFixed(2), pageWidth - margin, y);
  doc.setFontAlign('left');
  y += 6;
  
  // Tax
  text(`Tax (${state.current.taxRate || 0}%)`, totalsX, y);
  doc.setFontAlign('right');
  text('$' + (state.current.taxAmount || 0).toFixed(2), pageWidth - margin, y);
  doc.setFontAlign('left');
  y += 6;
  
  // Grand total
  line(y, dark);
  y += 6;
  setFont('bold', 800, 12);
  text('TOTAL', totalsX, y);
  doc.setFontAlign('right');
  text('$' + (state.current.grand || 0).toFixed(2), pageWidth - margin, y);
  doc.setFontAlign('left');
  y += 15;
  
  // ===== FOOTER =====
  if (state.current.footer) {
    setFont('normal', 400, 8);
    const footerLines = doc.splitTextToSize(state.current.footer, contentWidth);
    footerLines.forEach(ln => {
      text(ln, margin, y);
      y += 4;
    });
  }
  
  // Save
  const filename = `${state.current.type.toUpperCase()}-${state.current.number || 'draft'}-${(state.current.client?.name || 'client').replace(/\s+/g, '-')}.pdf`;
  doc.save(filename);
  
  return filename;
}

/**
 * Open PDF in new tab (for preview)
 */
async function previewPDF(state) {
  await loadJsPDF();
  
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter'
  });
  
  // Same generation logic as above, but return blob URL
  // For now, just generate and save
  return generatePDF(state);
}