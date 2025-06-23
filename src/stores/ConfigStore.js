import { defineStore } from "pinia";

export const useConfigStore = defineStore('ConfigStore', {
  state: () => ({
    Language: {},
    Currency: {},
    RenderMode: {},
  }),
  actions: {
    setLanguage(lang) {
      // Update state
      console.log('Setting language to:', lang)
      this.Language = lang;
    },
    setCurrency(currency) {
      // Update state
      console.log('Setting currency to:', currency)
      this.Currency = currency;
    },
    setRenderMode(renderMode) {
      // Update state
      console.log('Setting renderMode to:', renderMode)
      this.RenderMode = renderMode;
    },
  },
  getters: {
    getLanguage: (state) => {
      return state.Language;
    },
    getCurrency: (state) => {
      return state.Currency;
    },
    getRenderMode: (state) => {
      return state.RenderMode;
    }
  }

})
