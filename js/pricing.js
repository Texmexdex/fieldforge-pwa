/**
 * FieldForge Pricing Engine
 * ZIP-based tax lookup and regional rate reference data
 * Built-in tax rates for major US counties + rate reference tables
 */

// Sales tax rates by ZIP prefix (simplified lookup)
// Real implementation would query an API or comprehensive database
const TAX_RATE_MAP = {
  // Texas (Harris County = 8.25%)
  '770': 8.25, '772': 8.25, '773': 8.25, '774': 8.25, '775': 8.25,
  // Florida (various counties)
  '330': 7.0, '331': 7.0, '332': 7.0, '333': 7.0, '334': 6.5,
  // California
  '900': 9.5, '901': 9.5, '902': 9.5, '903': 9.5, '904': 9.5,
  '905': 9.5, '906': 9.5, '907': 9.5, '908': 9.5, '909': 7.75,
  '910': 9.5, '911': 9.5, '912': 9.5, '913': 9.5, '914': 9.5,
  '915': 9.5, '916': 9.5, '917': 9.5, '918': 9.5,
  // New York
  '100': 8.875, '101': 8.875, '102': 8.875, '103': 8.875, '104': 8.875,
  // Additional common prefixes
  '750': 8.25, '751': 8.25, '752': 8.25,
  '300': 7.0, '301': 7.0, '302': 7.0, '303': 7.0,
  '480': 6.0, '481': 6.0, '482': 6.0,
  '850': 8.6, '852': 8.6, '853': 8.6,
  '190': 6.0, '191': 6.0, '192': 6.0,
  '440': 7.0, '441': 7.0, '442': 7.0,
  '800': 8.5, '801': 8.5, '802': 8.5, '803': 8.5,
  '900': 9.5, '901': 9.5, '902': 9.5,
  '950': 9.5, '951': 9.5,
  // Default fallback
  'default': 7.0
};

// State-specific default rates
const STATE_TAX_RATES = {
  'TX': 8.25, 'CA': 9.5, 'FL': 7.0, 'NY': 8.875,
  'GA': 7.0, 'NC': 7.0, 'IL': 10.25, 'PA': 6.0,
  'OH': 7.0, 'MI': 6.0, 'AZ': 8.6, 'WA': 10.5,
  'CO': 8.5, 'OR': 0.0, 'TN': 9.75, 'LA': 9.52,
  'NV': 8.25, 'NJ': 6.625, 'VA': 6.0, 'KY': 6.0
};

/**
 * Get sales tax rate for a ZIP code
 */
function getTaxRateForZip(zip) {
  if (!zip) return 0;
  const prefix = zip.toString().substring(0, 3);
  return TAX_RATE_MAP[prefix] ?? TAX_RATE_MAP['default'];
}

/**
 * Get county name from ZIP (simplified - real implementation needs full DB)
 */
function getCountyFromZip(zip) {
  // This is a simplified mapping - in production you'd use a proper ZIP database
  // For now, return a general region indicator
  if (!zip) return 'Unknown';
  
  // Very rough mapping of ZIP prefixes to regions
  const first3 = zip.toString().substring(0, 3);
  
  const regions = {
    '770': 'Harris County, TX', '772': 'Harris County, TX', '773': 'Montgomery County, TX',
    '774': 'Fort Bend County, TX', '775': 'Galveston County, TX',
    '330': 'Miami-Dade County, FL', '331': 'Miami-Dade County, FL',
    '300': 'Metro Atlanta, GA', '301': 'Metro Atlanta, GA',
    '900': 'Los Angeles County, CA', '902': 'Los Angeles County, CA',
    '100': 'New York County, NY', '104': 'Bronx County, NY',
    '750': 'Dallas County, TX', '751': 'Dallas County, TX',
    '850': 'Maricopa County, AZ', '852': 'Maricopa County, AZ',
  };
  
  return regions[first3] || 'Regional Average';
}

/**
 * Format currency
 */
function formatCurrency(amount) {
  return '$' + parseFloat(amount || 0).toFixed(2);
}

/**
 * Format rate with unit
 */
function formatRate(low, high, unit) {
  const formatNum = (n) => {
    if (n >= 1000) return '$' + (n/1000).toFixed(n % 1000 === 0 ? 0 : 1) + 'k';
    return '$' + n.toFixed(n % 1 === 0 ? 0 : 2);
  };
  return `${formatNum(low)} – ${formatNum(high)} / ${unit}`;
}

/**
 * Build rate reference table HTML for a trade
 */
function buildRateTable(trade) {
  const cat = SERVICE_CATALOGS[trade];
  if (!cat) return '<p>Select a trade to see rate reference.</p>';
  
  let html = `<table class="rate-table">
    <thead>
      <tr>
        <th>Service</th>
        <th>Low (Simple)</th>
        <th>High (Complex)</th>
        <th>Unit</th>
      </tr>
    </thead>
    <tbody>`;
  
  cat.services.forEach(svc => {
    html += `<tr>
      <td class="service-name">${svc.desc.split(':')[0]}</td>
      <td>${formatCurrency(svc.low)}</td>
      <td>${formatCurrency(svc.high)}</td>
      <td class="unit">${svc.unit}</td>
    </tr>`;
  });
  
  html += '</tbody></table>';
  return html;
}

/**
 * Look up service rate range by name
 */
function lookupServiceRate(serviceName, trade) {
  const cat = SERVICE_CATALOGS[trade];
  if (!cat) return null;
  
  // Try exact match first
  let svc = cat.services.find(s => s.desc.startsWith(serviceName.split(':')[0]));
  if (!svc) {
    // Try partial match
    const shortName = serviceName.split(':')[0].toLowerCase();
    svc = cat.services.find(s => s.desc.toLowerCase().includes(shortName));
  }
  
  return svc ? { low: svc.low, high: svc.high, unit: svc.unit } : null;
}