// Load static buyers data from buyers.json
import buyersData from '@/data/buyers.json';

// -----------------------------------------------------------------------------
// BUYERS ENTITY — now powered by your exported JSON instead of Base44
// -----------------------------------------------------------------------------

export const Buyer = {
  async list() {
    // return all buyers
    return buyersData;
  },

  async get(id) {
    // find buyer by id
    return buyersData.find(b => String(b.id) === String(id)) || null;
  }
};

// -----------------------------------------------------------------------------
// PROPERTY SEARCH (stubbed out)
// If your UI uses PropertySearch, we return empty results to avoid errors.
// -----------------------------------------------------------------------------

export const PropertySearch = {
  async list() {
    return [];
  },

  async get() {
    return null;
  }
};

// -----------------------------------------------------------------------------
// USER (stubbed)
// No Base44 auth anymore, so return a dummy user object.
// -----------------------------------------------------------------------------

export const User = {
  async getCurrentUser() {
    return {
      id: "local-user",
      name: "Local User",
      email: "your-email@example.com"
    };
  }
};
