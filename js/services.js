/**
 * FieldForge Service Catalog
 * Pre-built service templates for common field service trades
 * Each trade has services with low/high rate ranges
 */

const SERVICE_CATALOGS = {
  tree: {
    name: 'Tree Removal & Trimming',
    icon: '🌲',
    services: [
      { desc: 'Tree Removal (Small < 30\'): No climbing required, accessible location.', low: 350, high: 850, unit: 'Per Tree' },
      { desc: 'Tree Removal (Medium 30-60\'): Standard removal with rigging required.', low: 700, high: 1400, unit: 'Per Tree' },
      { desc: 'Tree Removal (Large 60\'+): Complex removal requiring extensive rigging.', low: 1300, high: 3500, unit: 'Per Tree' },
      { desc: 'Tree Removal (Complex): Sectional dismantling via climbing/rigging. Includes asset protection & ground control. ANSI Z133 compliant.', low: 800, high: 3500, unit: 'Per Tree' },
      { desc: 'Directional Felling: Precision ground-level felling. Requires clear drop zone (no rigging/climbing).', low: 300, high: 800, unit: 'Per Tree' },
      { desc: 'Stump Grinding: Mechanical stump removal below grade.', low: 2.5, high: 5, unit: 'Per Inch Diameter' },
      { desc: 'Trimming / Pruning: Canopy management and deadwood removal.', low: 250, high: 800, unit: 'Per Tree' },
      { desc: 'Canopy Management (Crown Reduction): Pruning to reduce wind sail effect and limb weight.', low: 300, high: 1000, unit: 'Per Tree' },
      { desc: 'Sanitary Pruning (Deadwooding): Removal of dead/diseased limbs (2" dia or larger).', low: 200, high: 600, unit: 'Per Tree' },
      { desc: 'Storm Restoration: Emergency hazardous debris removal from structures/driveways.', low: 500, high: 2500, unit: 'Per Job' },
      { desc: 'Site Clearing / Underbrush: Mechanical mulching of saplings & briars.', low: 800, high: 2500, unit: 'Per Acre/Day' },
      { desc: 'Debris Hauling: Loading, transport, and commercial disposal of vegetative waste.', low: 150, high: 400, unit: 'Per Load' },
      { desc: 'Crane Assist Fee: Heavy lifting machinery for zero-impact removal over structures.', low: 800, high: 1200, unit: 'Minimum / Day' },
      { desc: 'Bucking & Stacking: Processing felled timber into firewood lengths (16-18").', low: 100, high: 300, unit: 'Per Tree' },
      { desc: 'Natural Decomposition Treatment: Habitat-friendly stump breakdown promoter.', low: 50, high: 150, unit: 'Per Stump' },
      { desc: 'Brush Clearing: Hand clearing of saplings, briars, and light vegetation.', low: 500, high: 1500, unit: 'Per Day' },
      { desc: 'Hazardous Limb Removal: Single limb over structure or in high-risk position.', low: 200, high: 800, unit: 'Per Limb' },
      { desc: 'View Clearing: Selectively removing limbs to restore or create views.', low: 400, high: 1200, unit: 'Per Job' },
    ]
  },
  hvac: {
    name: 'HVAC / Heating & Cooling',
    icon: '❄️',
    services: [
      { desc: 'AC Unit Installation (Standard 3-5 Ton)', low: 4500, high: 8000, unit: 'Per Unit' },
      { desc: 'AC Unit Replacement (Same Size)', low: 4000, high: 7000, unit: 'Per Unit' },
      { desc: 'Furnace Installation (Gas/Electric)', low: 3000, high: 6000, unit: 'Per Unit' },
      { desc: 'Heat Pump Installation', low: 5000, high: 9000, unit: 'Per Unit' },
      { desc: 'Ductwork Installation (Per Linear Foot)', low: 12, high: 25, unit: 'Per LF' },
      { desc: 'Ductwork Repair / Modification', low: 150, high: 500, unit: 'Per Repair' },
      { desc: 'Thermostat Installation (Standard)', low: 75, high: 200, unit: 'Per Unit' },
      { desc: 'Smart Thermostat Installation', low: 100, high: 300, unit: 'Per Unit' },
      { desc: 'AC Recharge / Refrigerant', low: 150, high: 400, unit: 'Per Job' },
      { desc: 'Compressor Replacement', low: 800, high: 1800, unit: 'Per Unit' },
      { desc: 'Capacitor Replacement', low: 100, high: 250, unit: 'Per Unit' },
      { desc: 'Condensate Pump Replacement', low: 150, high: 350, unit: 'Per Unit' },
      { desc: 'Air Handler Installation', low: 1500, high: 3500, unit: 'Per Unit' },
      { desc: 'Mini-Split Installation (Per Zone)', low: 800, high: 2000, unit: 'Per Zone' },
      { desc: 'Maintenance Tune-Up (AC)', low: 100, high: 200, unit: 'Per Visit' },
      { desc: 'Maintenance Tune-Up (Furnace)', low: 100, high: 175, unit: 'Per Visit' },
      { desc: 'Indoor Air Quality Assessment', low: 75, high: 200, unit: 'Per Visit' },
    ]
  },
  landscaping: {
    name: 'Landscaping',
    icon: '🌿',
    services: [
      { desc: 'Lawn Installation (Sod, Per SF)', low: 0.8, high: 2.5, unit: 'Per SF' },
      { desc: 'Lawn Installation (Seed, Per SF)', low: 0.15, high: 0.5, unit: 'Per SF' },
      { desc: 'Mulch Installation (Per Cubic Yard)', low: 45, high: 85, unit: 'Per CY' },
      { desc: 'Planting - Small Shrub (1 Gal)', low: 30, high: 65, unit: 'Per Plant' },
      { desc: 'Planting - Medium Shrub (3 Gal)', low: 50, high: 100, unit: 'Per Plant' },
      { desc: 'Planting - Tree (15 Gal)', low: 150, high: 400, unit: 'Per Tree' },
      { desc: 'Planting - Tree (25 Gal)', low: 300, high: 700, unit: 'Per Tree' },
      { desc: 'Flower Bed Installation', low: 25, high: 60, unit: 'Per SF' },
      { desc: 'Paver Patio Installation (Per SF)', low: 12, high: 30, unit: 'Per SF' },
      { desc: 'Retaining Wall (Per SF)', low: 20, high: 55, unit: 'Per SF' },
      { desc: 'Sod Installation (Per SF)', low: 0.8, high: 2.5, unit: 'Per SF' },
      { desc: 'Sprinkler System Installation (Per Zone)', low: 350, high: 800, unit: 'Per Zone' },
      { desc: 'Sprinkler Repair', low: 75, high: 200, unit: 'Per Repair' },
      { desc: 'Landscape Design Consultation', low: 100, high: 300, unit: 'Per Hour' },
      { desc: 'Grading / Leveling (Per Hour)', low: 75, high: 150, unit: 'Per Hour' },
      { desc: 'French Drain Installation', low: 800, high: 2500, unit: 'Per Job' },
    ]
  },
  cleaning: {
    name: 'Cleaning Services',
    icon: '✨',
    services: [
      { desc: 'Standard House Cleaning (Per SF)', low: 0.08, high: 0.18, unit: 'Per SF' },
      { desc: 'Deep House Cleaning (Per SF)', low: 0.15, high: 0.35, unit: 'Per SF' },
      { desc: 'Move-In / Move-Out Clean', low: 250, high: 800, unit: 'Per Job' },
      { desc: 'Post-Construction Clean', low: 0.2, high: 0.5, unit: 'Per SF' },
      { desc: 'Window Cleaning (Interior/Exterior, Per Pane)', low: 3, high: 8, unit: 'Per Pane' },
      { desc: 'Carpet Cleaning (Per Room)', low: 80, high: 200, unit: 'Per Room' },
      { desc: 'Tile & Grout Cleaning (Per SF)', low: 2, high: 5, unit: 'Per SF' },
      { desc: 'Pressure Washing - Siding (Per SF)', low: 0.5, high: 1.2, unit: 'Per SF' },
      { desc: 'Pressure Washing - Driveway (Per SF)', low: 0.25, high: 0.6, unit: 'Per SF' },
      { desc: 'Pressure Washing - Deck (Per SF)', low: 0.4, high: 0.9, unit: 'Per SF' },
      { desc: 'Gutter Cleaning (Per Linear Foot)', low: 1, high: 3, unit: 'Per LF' },
      { desc: 'Maid Service (Per Hour)', low: 40, high: 90, unit: 'Per Hour' },
      { desc: 'Office Cleaning (Per Visit)', low: 150, high: 600, unit: 'Per Visit' },
    ]
  },
  painting: {
    name: 'Painting',
    icon: '🎨',
    services: [
      { desc: 'Interior Paint (Per SF, Includes Materials)', low: 2.5, high: 6, unit: 'Per SF' },
      { desc: 'Exterior Paint (Per SF, Includes Materials)', low: 3, high: 7, unit: 'Per SF' },
      { desc: 'Cabinet Painting (Per Door)', low: 80, high: 200, unit: 'Per Door' },
      { desc: 'Cabinet Refinishing (Per Linear Foot)', low: 30, high: 80, unit: 'Per LF' },
      { desc: 'Deck Staining / Sealing (Per SF)', low: 1.5, high: 4, unit: 'Per SF' },
      { desc: 'Fence Staining (Per LF)', low: 3, high: 8, unit: 'Per LF' },
      { desc: 'Wallpaper Removal (Per SF)', low: 1, high: 3, unit: 'Per SF' },
      { desc: 'Ceiling Texture / Popcorn Removal (Per SF)', low: 1.5, high: 4, unit: 'Per SF' },
      { desc: 'Trim Painting (Per Linear Foot)', low: 2, high: 6, unit: 'Per LF' },
      { desc: 'Door Painting (Per Door)', low: 40, high: 120, unit: 'Per Door' },
      { desc: 'Garage Floor Epoxy (Per SF)', low: 4, high: 10, unit: 'Per SF' },
      { desc: 'Power Washing (Per SF)', low: 0.25, high: 0.7, unit: 'Per SF' },
    ]
  },
  handyman: {
    name: 'Handyman / General Repair',
    icon: '🔧',
    services: [
      { desc: 'Hourly Labor Rate', low: 60, high: 125, unit: 'Per Hour' },
      { desc: 'Drywall Repair (Per Patch)', low: 75, high: 250, unit: 'Per Patch' },
      { desc: 'Drywall Repair (Per Sheet)', low: 150, high: 400, unit: 'Per Sheet' },
      { desc: 'Door Installation', low: 100, high: 350, unit: 'Per Door' },
      { desc: 'Door Hardware Replacement', low: 50, high: 150, unit: 'Per Door' },
      { desc: 'Window Replacement (Standard)', low: 200, high: 600, unit: 'Per Window' },
      { desc: 'Ceiling Fan Installation', low: 75, high: 200, unit: 'Per Unit' },
      { desc: 'Light Fixture Installation', low: 50, high: 150, unit: 'Per Fixture' },
      { desc: 'Outlet / Switch Replacement', low: 50, high: 120, unit: 'Per Unit' },
      { desc: 'Gutter Repair (Per Hour)', low: 75, high: 150, unit: 'Per Hour' },
      { desc: 'Fence Repair (Per Hour)', low: 75, high: 150, unit: 'Per Hour' },
      { desc: 'Plumbing Minor Repair (Per Hour)', low: 80, high: 175, unit: 'Per Hour' },
      { desc: 'Electrical Minor Repair (Per Hour)', low: 85, high: 200, unit: 'Per Hour' },
      { desc: 'Furniture Assembly', low: 60, high: 150, unit: 'Per Hour' },
      { desc: 'TV Mount Installation', low: 75, high: 200, unit: 'Per Unit' },
    ]
  },
  plumbing: {
    name: 'Plumbing',
    icon: '🚿',
    services: [
      { desc: 'Hourly Labor Rate', low: 85, high: 175, unit: 'Per Hour' },
      { desc: 'Drain Cleaning (Snake, Per Drain)', low: 100, high: 300, unit: 'Per Drain' },
      { desc: 'Water Heater Installation (Tank)', low: 800, high: 1800, unit: 'Per Unit' },
      { desc: 'Water Heater Installation (Tankless)', low: 1500, high: 3500, unit: 'Per Unit' },
      { desc: 'Faucet Installation / Replacement', low: 100, high: 300, unit: 'Per Faucet' },
      { desc: 'Toilet Installation / Replacement', low: 125, high: 350, unit: 'Per Toilet' },
      { desc: 'Shower Head / Head Replacement', low: 50, high: 150, unit: 'Per Unit' },
      { desc: 'Garbage Disposal Installation', low: 100, high: 250, unit: 'Per Unit' },
      { desc: 'Pipe Leak Repair (Per Hour)', low: 85, high: 200, unit: 'Per Hour' },
      { desc: 'Water Line Repair (Per Hour)', low: 100, high: 225, unit: 'Per Hour' },
      { desc: 'Sump Pump Installation', low: 300, high: 800, unit: 'Per Unit' },
      { desc: 'Sump Pump Repair', low: 150, high: 400, unit: 'Per Repair' },
      { desc: 'Gas Line Installation (Per Hour)', low: 100, high: 225, unit: 'Per Hour' },
      { desc: 'Water Softener Installation', low: 400, high: 1200, unit: 'Per Unit' },
      { desc: 'Bathroom Remodel (Per SF)', low: 80, high: 200, unit: 'Per SF' },
    ]
  },
  electrical: {
    name: 'Electrical',
    icon: '⚡',
    services: [
      { desc: 'Hourly Labor Rate', low: 90, high: 200, unit: 'Per Hour' },
      { desc: 'Outlet Installation (Standard, Per Unit)', low: 75, high: 200, unit: 'Per Unit' },
      { desc: 'GFCI Outlet Installation', low: 100, high: 250, unit: 'Per Unit' },
      { desc: 'Light Switch Replacement', low: 50, high: 125, unit: 'Per Switch' },
      { desc: 'Ceiling Fan Installation', low: 100, high: 275, unit: 'Per Unit' },
      { desc: 'Light Fixture Installation (Standard)', low: 75, high: 200, unit: 'Per Fixture' },
      { desc: 'Light Fixture Installation (Chandelier)', low: 150, high: 400, unit: 'Per Unit' },
      { desc: 'EV Charger Installation (Level 2)', low: 300, high: 800, unit: 'Per Unit' },
      { desc: 'Panel Upgrade (100→200 Amp)', low: 1200, high: 3000, unit: 'Per Job' },
      { desc: 'Sub-Panel Installation', low: 400, high: 1200, unit: 'Per Job' },
      { desc: 'Circuit Breaker Replacement', low: 75, high: 200, unit: 'Per Breaker' },
      { desc: 'Whole-House Rewire (Per SF)', low: 3, high: 8, unit: 'Per SF' },
      { desc: 'Smoke Detector Installation', low: 50, high: 150, unit: 'Per Unit' },
      { desc: 'Doorbell Installation', low: 75, high: 200, unit: 'Per Unit' },
    ]
  },
  roofing: {
    name: 'Roofing',
    icon: '🏠',
    services: [
      { desc: 'Roof Inspection', low: 100, high: 300, unit: 'Per Inspection' },
      { desc: 'Asphalt Shingle Replacement (Per SF)', low: 4, high: 10, unit: 'Per SF' },
      { desc: 'Metal Roof Installation (Per SF)', low: 8, high: 18, unit: 'Per SF' },
      { desc: 'Tile Roof Installation (Per SF)', low: 10, high: 25, unit: 'Per SF' },
      { desc: 'Flat Roof / TPO Installation (Per SF)', low: 6, high: 14, unit: 'Per SF' },
      { desc: 'Roof Tear-Off (Per SF)', low: 2, high: 6, unit: 'Per SF' },
      { desc: 'Skylight Installation', low: 300, high: 900, unit: 'Per Unit' },
      { desc: 'Gutter Installation (Per Linear Foot)', low: 6, high: 15, unit: 'Per LF' },
      { desc: 'Gutter Guard Installation (Per LF)', low: 4, high: 10, unit: 'Per LF' },
      { desc: 'Fascia / Soffit Repair (Per LF)', low: 5, high: 15, unit: 'Per LF' },
      { desc: 'Flashing Repair', low: 100, high: 400, unit: 'Per Repair' },
      { desc: 'Ventilation Installation', low: 150, high: 500, unit: 'Per Unit' },
    ]
  },
  general: {
    name: 'General Service',
    icon: '🔨',
    services: [
      { desc: 'Hourly Labor Rate', low: 65, high: 150, unit: 'Per Hour' },
      { desc: 'Consultation / Estimate', low: 0, high: 150, unit: 'Per Visit' },
      { desc: 'Trip Charge / Service Call', low: 50, high: 150, unit: 'Per Visit' },
      { desc: 'After-Hours / Emergency Rate', low: 125, high: 300, unit: 'Per Hour' },
      { desc: 'Permit Acquisition', low: 50, high: 300, unit: 'Per Permit' },
      { desc: 'Dumpster / Debris Removal', low: 200, high: 800, unit: 'Per Job' },
      { desc: 'Equipment Rental (Per Day)', low: 50, high: 500, unit: 'Per Day' },
      { desc: 'Material Pickup (Per Hour)', low: 60, high: 150, unit: 'Per Hour' },
    ]
  }
};

/**
 * Get all available trade keys
 */
function getTradeKeys() {
  return Object.keys(SERVICE_CATALOGS);
}

/**
 * Get catalog for a specific trade
 */
function getCatalog(trade) {
  return SERVICE_CATALOGS[trade] || null;
}

/**
 * Get trade name
 */
function getTradeName(trade) {
  return SERVICE_CATALOGS[trade]?.name || trade;
}

/**
 * Get all services for a trade formatted for dropdown
 */
function getServiceOptions(trade) {
  const cat = SERVICE_CATALOGS[trade];
  if (!cat) return [];
  return cat.services.map(s => ({
    desc: s.desc,
    rate: ((s.low + s.high) / 2).toFixed(2),
    low: s.low,
    high: s.high,
    unit: s.unit
  }));
}

/**
 * Build datalist options HTML for a trade's services
 */
function buildServiceDatalist(trade) {
  const opts = getServiceOptions(trade);
  return opts.map(o => `<option value="${o.desc}">`).join('\n');
}

/**
 * Get rate range for a service description
 */
function getServiceRateRange(desc, trade) {
  const cat = SERVICE_CATALOGS[trade];
  if (!cat) return { low: 0, high: 0 };
  const svc = cat.services.find(s => s.desc === desc);
  return svc ? { low: svc.low, high: svc.high } : { low: 0, high: 0 };
}

/**
 * Export all catalogs as JSON (for customization)
 */
function exportCatalogs() {
  return JSON.stringify(SERVICE_CATALOGS, null, 2);
}

/**
 * Import custom catalogs
 */
function importCatalogs(json) {
  try {
    const parsed = JSON.parse(json);
    Object.assign(SERVICE_CATALOGS, parsed);
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
}