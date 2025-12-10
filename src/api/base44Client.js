// src/api/base44Client.js
// Local stub so Buyerscouter runs without Base44 backend or redirects.

export const base44 = {
  // Fake entity() API that returns a dummy in-memory collection
  entity() {
    const data = [];

    return {
      async list() {
        // Always return empty array for now
        return data;
      },
      async get(id) {
        return data.find(item => item.id === id) || null;
      },
      async create(item) {
        data.push(item);
        return item;
      },
      async update(id, updates) {
        const idx = data.findIndex(item => item.id === id);
        if (idx === -1) return null;
        data[idx] = { ...data[idx], ...updates };
        return data[idx];
      },
      async delete(id) {
        const idx = data.findIndex(item => item.id === id);
        if (idx === -1) return;
        data.splice(idx, 1);
      }
    };
  }
};
