// Load static buyers data from src/buyers.json
import rawBuyersData from '@/buyers.json';

// -----------------------------------------------------------------------------
// Normalize buyers JSON into a plain array
// This handles shapes like:
//   [ {...}, {...} ]
//   { "Sheet1": [ {...}, {...} ] }
//   { "buyers": [ {...} ] }
// -----------------------------------------------------------------------------
function normalizeBuyers(data) {
  if (Array.isArray(data)) return data;

  if (data && typeof data === 'object') {
    // Common case: { Sheet1: [ ... ] }
    if (Array.isArray(data.Sheet1)) return data.Sheet1;

    // Fall back to "first array property" on the object
    const keys = Object.keys(data);
    for (const key of keys) {
      if (Array.isArray(data[key])) {
        return data[key];
      }
    }
  }

  // Fallback: no buyers found
  return [];
}

const buyersData = normalizeBuyers(rawBuyersData);

// -----------------------------------------------------------------------------
// BUYERS ENTITY — powered by your exported JSON instead of Base44
// We return several common shapes so the existing UI can pick what it expects.
// -----------------------------------------------------------------------------

export const Buyer = {
  async list() {
    return {
      items: buyersData,     // if UI uses data.items
      data: buyersData,      // if UI uses data.data
      results: buyersData,   // if UI uses data.results
      count: buyersData.length
    };
  },

  async get(id) {
    return buyersData.find(b => String(b.id) === String(id)) || null;
  }
};

// -----------------------------------------------------------------------------
// PROPERTY SEARCH (stubbed so UI won't crash if it calls it)
// -----------------------------------------------------------------------------

export const PropertySearch = {
  async list() {
    return {
      items: [],
      data: [],
      results: [],
      count: 0
    };
  },

  async get() {
    return null;
  }
};

// -----------------------------------------------------------------------------
// USER (stubbed)
// -----------------------------------------------------------------------------

export const User = {
  async getCurrentUser() {
    return {
      id: 'local-user',
      name: 'Local User',
      email: 'user@example.com'
    };
  }
};
