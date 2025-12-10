// Load static buyers data from the correct location
import buyersData from '@/buyers.json';

// -----------------------------------------------------------------------------
// BUYERS ENTITY — powered by your exported JSON instead of Base44
// -----------------------------------------------------------------------------

export const Buyer = {
  async list() {
    // Return all buyers from your JSON file
    return buyersData;
  },

  async get(id) {
    // Return a buyer by id
    return buyersData.find(b => String(b.id) === String(id)) || null;
  }
};

// -----------------------------------------------------------------------------
// PROPERTY SEARCH (stubbed)
// If your UI tries to use this, it won't crash.
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
// Base44 auth removed. Provide a safe fallback user.
// -----------------------------------------------------------------------------

export const User = {
  async getCurrentUser() {
    return {
      id: "local-user",
      name: "Local User",
      email: "user@example.com"
    };
  }
};

