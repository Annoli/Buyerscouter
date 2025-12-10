// Match Score Engine - Calculates accurate match scores between properties and buyers

export function calculateMatchScore(property, buyer) {
  const weights = {
    county: 25,
    price: 20,
    lotSize: 15,
    floodZone: 12,
    utilities: 10,
    roadAccess: 8,
    recency: 10
  };

  let scores = {};

  // County Match (25%)
  const buyerCounties = (buyer.target_counties || []).map(c => c.toLowerCase());
  const propertyCounty = (property.county || '').toLowerCase();
  if (buyerCounties.includes(propertyCounty)) {
    scores.county = 100;
  } else {
    // Check adjacent counties logic could be added here
    scores.county = 0;
  }

  // Price Match (20%)
  const askingPrice = property.asking_price || 0;
  const minPrice = buyer.price_range_min || 0;
  const maxPrice = buyer.price_range_max || Infinity;
  
  if (askingPrice >= minPrice && askingPrice <= maxPrice) {
    // Perfect fit
    const midPoint = (minPrice + maxPrice) / 2;
    const distance = Math.abs(askingPrice - midPoint) / (maxPrice - minPrice);
    scores.price = Math.round(100 - (distance * 30)); // 70-100 range for in-range prices
  } else if (askingPrice < minPrice) {
    // Below range - usually good for buyers
    const percentBelow = (minPrice - askingPrice) / minPrice;
    scores.price = Math.round(Math.max(60, 90 - (percentBelow * 100)));
  } else {
    // Above range
    const percentAbove = (askingPrice - maxPrice) / maxPrice;
    scores.price = Math.round(Math.max(0, 70 - (percentAbove * 200)));
  }

  // Lot Size Match (15%)
  const lotSize = property.lot_size_acres || 0;
  const minLot = buyer.lot_size_min_acres || 0;
  const maxLot = buyer.lot_size_max_acres || Infinity;
  
  if (lotSize >= minLot && lotSize <= maxLot) {
    scores.lotSize = 100;
  } else if (lotSize < minLot) {
    const percentBelow = (minLot - lotSize) / minLot;
    scores.lotSize = Math.round(Math.max(20, 80 - (percentBelow * 100)));
  } else {
    const percentAbove = (lotSize - maxLot) / maxLot;
    scores.lotSize = Math.round(Math.max(20, 80 - (percentAbove * 100)));
  }

  // Flood Zone Match (12%)
  const floodZoneMap = {
    'Zone X': ['Zone X Only', 'Zone AE Acceptable', 'Any Zone', 'No Preference'],
    'Zone AE': ['Zone AE Acceptable', 'Any Zone', 'No Preference'],
    'Zone A': ['Any Zone', 'No Preference'],
    'Zone VE': ['Any Zone', 'No Preference'],
    'Unknown': ['Zone X Only', 'Zone AE Acceptable', 'Any Zone', 'No Preference', 'None']
  };
  
  const propertyFlood = property.flood_zone || 'Unknown';
  const buyerTolerance = buyer.flood_zone_tolerance || 'No Preference';
  
  if (buyerTolerance === 'No Preference' || buyerTolerance === 'Any Zone') {
    scores.floodZone = 100;
  } else if (floodZoneMap[propertyFlood]?.includes(buyerTolerance)) {
    scores.floodZone = 100;
  } else if (buyerTolerance === 'None' && propertyFlood !== 'Zone X') {
    scores.floodZone = 20;
  } else {
    scores.floodZone = 50;
  }

  // Utilities Match (10%)
  const utilityMatch = {
    'City Water & Sewer': ['City Water & Sewer Required', 'City Water Required', 'Well/Septic Acceptable', 'No Preference'],
    'City Water Only': ['City Water Required', 'Well/Septic Acceptable', 'No Preference'],
    'Well/Septic': ['Well/Septic Acceptable', 'No Preference'],
    'None': ['No Preference']
  };
  
  const propertyUtils = property.utilities || 'None';
  const buyerUtils = buyer.utilities_preference || 'No Preference';
  
  if (buyerUtils === 'No Preference') {
    scores.utilities = 100;
  } else if (utilityMatch[propertyUtils]?.includes(buyerUtils)) {
    scores.utilities = 100;
  } else {
    scores.utilities = 30;
  }

  // Road Access Match (8%)
  const roadMatch = {
    'Paved': ['Paved Required', 'Gravel Acceptable', 'Easement Acceptable', 'No Preference'],
    'Gravel': ['Gravel Acceptable', 'Easement Acceptable', 'No Preference'],
    'Easement': ['Easement Acceptable', 'No Preference'],
    'None': ['No Preference']
  };
  
  const propertyRoad = property.road_access || 'Paved';
  const buyerRoad = buyer.road_access_requirement || 'No Preference';
  
  if (buyerRoad === 'No Preference') {
    scores.roadAccess = 100;
  } else if (roadMatch[propertyRoad]?.includes(buyerRoad)) {
    scores.roadAccess = 100;
  } else {
    scores.roadAccess = 25;
  }

  // Recency Score (10%)
  const lastPurchase = buyer.last_purchase_date ? new Date(buyer.last_purchase_date) : null;
  if (lastPurchase) {
    const daysSince = Math.floor((new Date() - lastPurchase) / (1000 * 60 * 60 * 24));
    if (daysSince <= 30) scores.recency = 100;
    else if (daysSince <= 60) scores.recency = 90;
    else if (daysSince <= 90) scores.recency = 80;
    else if (daysSince <= 180) scores.recency = 60;
    else if (daysSince <= 365) scores.recency = 40;
    else scores.recency = 20;
  } else {
    scores.recency = 30;
  }

  // Calculate weighted total
  let totalScore = 0;
  let totalWeight = 0;
  
  for (const [key, weight] of Object.entries(weights)) {
    totalScore += (scores[key] || 0) * weight;
    totalWeight += weight;
  }

  const finalScore = Math.round(totalScore / totalWeight);

  // Calculate confidence indicators
  const confidence = {
    marketFit: Math.round((scores.county * 0.4 + scores.recency * 0.6)),
    priceFit: scores.price,
    locationMatch: scores.county,
    buyerActivity: Math.min(100, (buyer.total_lots_acquired_6mo || 0) * 10 + scores.recency * 0.5)
  };

  return {
    totalScore: finalScore,
    breakdown: scores,
    confidence,
    weights
  };
}

export function generateMatchReasoning(property, buyer, scoreData) {
  const { breakdown, totalScore } = scoreData;
  const matched = [];
  const notMatched = [];

  // County
  if (breakdown.county >= 80) {
    matched.push(`Actively buys in ${property.county} County`);
  } else {
    notMatched.push(`${property.county} County is not in their primary target area`);
  }

  // Price
  if (breakdown.price >= 80) {
    matched.push(`Price of $${property.asking_price?.toLocaleString()} fits within their $${buyer.price_range_min?.toLocaleString()}-$${buyer.price_range_max?.toLocaleString()} range`);
  } else if (breakdown.price >= 50) {
    matched.push(`Price is slightly outside their preferred range but may still be acceptable`);
  } else {
    notMatched.push(`Price of $${property.asking_price?.toLocaleString()} is outside their $${buyer.price_range_min?.toLocaleString()}-$${buyer.price_range_max?.toLocaleString()} range`);
  }

  // Lot Size
  if (breakdown.lotSize >= 80) {
    matched.push(`Lot size of ${property.lot_size_acres} acres matches their ${buyer.lot_size_min_acres}-${buyer.lot_size_max_acres} acre preference`);
  } else {
    notMatched.push(`Lot size of ${property.lot_size_acres} acres is outside their ${buyer.lot_size_min_acres}-${buyer.lot_size_max_acres} acre preference`);
  }

  // Flood Zone
  if (breakdown.floodZone >= 80) {
    matched.push(`Flood zone ${property.flood_zone} is acceptable (tolerance: ${buyer.flood_zone_tolerance})`);
  } else {
    notMatched.push(`Flood zone ${property.flood_zone} may be an issue (prefers ${buyer.flood_zone_tolerance})`);
  }

  // Utilities
  if (breakdown.utilities >= 80) {
    matched.push(`Utilities setup (${property.utilities}) meets their requirements`);
  } else {
    notMatched.push(`Utilities (${property.utilities}) don't match preference (${buyer.utilities_preference})`);
  }

  // Recency
  if (breakdown.recency >= 80) {
    matched.push(`Recently active buyer with purchases in the last 60 days`);
  } else if (breakdown.recency >= 50) {
    matched.push(`Moderately active with purchases in the last 6 months`);
  }

  // Generate suggested offer price
  const suggestedOfferLow = Math.round(property.asking_price * (buyer.typical_offer_percentage || 75) / 100);
  const suggestedOfferHigh = Math.round(property.asking_price * ((buyer.typical_offer_percentage || 75) + 10) / 100);

  return {
    matched,
    notMatched,
    summary: totalScore >= 80 
      ? `Strong match - ${buyer.company_name} has a high likelihood of interest based on their buying patterns.`
      : totalScore >= 60 
      ? `Moderate match - Some criteria align but there may be negotiation needed.`
      : totalScore >= 40
      ? `Weak match - Limited criteria alignment, consider as backup option.`
      : `Poor match - Most criteria don't align with this buyer's preferences.`,
    suggestedOffer: { low: suggestedOfferLow, high: suggestedOfferHigh },
    strengthLevel: totalScore >= 80 ? 'Strong' : totalScore >= 60 ? 'Moderate' : totalScore >= 40 ? 'Weak' : 'Poor'
  };
}