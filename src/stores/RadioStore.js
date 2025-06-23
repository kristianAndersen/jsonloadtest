// src/stores/radioStore.js
import { defineStore } from 'pinia';

export const useRadioStore = defineStore('radio', {
  state: () => ({
    openStates: {}
  }),
  actions: {
    setOpen(id, value) {
      // Log for debugging
      console.log(`[RadioStore] Setting ${id} to ${value}`);
      
      // Update state
      this.openStates[id] = value;
    },
    resetAll() {
      this.openStates = {};
    },
    resetById(id) {
      delete this.openStates[id];
    }
  },
  getters: {
    isOpen: (state) => (id) => {
      return !!state.openStates[id];
    }
  }
});