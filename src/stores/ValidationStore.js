//ValidationStore.js

import { defineStore } from "pinia";
import validationSchema from "../composable/validationSchema";

import { useConfigStore } from './../stores/ConfigStore';
const configStore = useConfigStore();

const _language = configStore.getLanguage || 'en-GB'
const _currency = configStore.getCurrency || 'ERU'

export const useValidationStore = defineStore("ValidationStore", {
  state: () => ({
    rawValues: {},
    validationErrors: {}, // Track validation errors for fields
    isValid: true, // Overall form validity
    validationMessages: {}, // Store messages for validation feedback
    fieldStates: {}, // Add this to track field states
  }),
  actions: {
    getFieldKey(step, id) {
      return `${step}_${id}`;
    },

    // Initialize field state if it doesn't exist
    initializeFieldState(fieldKey) {
      if (!this.fieldStates[fieldKey]) {
        this.fieldStates[fieldKey] = {
          focused: false,
          touched: false,
          hasError: false,
          errorMessage: null
        };
      }
    },

    runValidation(type, value, language = _language, currency = _currency) {
      const config = validationSchema[type];
      if (!config || !config.validator) return { valid: true, value };

      if (type === 'text') {
        return value
      } else if (type === 'number') {
        return value
      } else if (type === 'email') {
        return config.validator(value);
      } else if (type === 'tel') {
        return config.validator(value);
      } else if (type === 'ssn') {
        return config.validator(value, language);
      } else if (type === 'currency') {
        return config.validator(value, language, currency);
      }


    },



    //on Focus
    onFocus(step, id, type, value, language = _language, currency = _currency) {
      const fieldKey = this.getFieldKey(step, id);
      this.initializeFieldState(fieldKey);

      this.fieldStates[fieldKey] = {
        ...this.fieldStates[fieldKey],
        focused: true,
        touched: true
      };

      const config = validationSchema[type];
      if (config && typeof config.onFocus === "function") {
        return config.onFocus(value, language, currency);
      }
      // For currency, remove formatting on focus if formatter exists
      if (type === "currency" && config && typeof config.formatter === "function") {

        // Show value (unformatted) on focus
        return config.currencyFocus(value, language, currency);

      }
      return value;

    },


    //on input
    onInput(step, id, type, value) {
      const fieldKey = this.getFieldKey(step, id);
      this.initializeFieldState(fieldKey);

      if (!value || value.trim() === '') return value;

      // Emoji regex
      const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
      let baseValidation = value.replace(emojiRegex, "");


      switch (type) {
        case 'text':
          baseValidation = baseValidation.replace(/[^0-9A-Za-zæøåÆØÅöÖäÄüÜß+\-\s]/g, '');
          break;
        case 'number':
          baseValidation = baseValidation.replace(/[^0-9-]/g, "");
          break;
        case 'email':
          baseValidation = baseValidation.normalize('NFC');
          baseValidation = baseValidation.replace(/[^0-9A-Za-zæøåÆØÅöÖäÄüÜß+\-@._]/g, '');
          break;
        case 'tel':

          // 1. Remove common separators like spaces, dots, dashes
          baseValidation = baseValidation.replace(/[-.\s]/g, '');

          // 2. Remove all characters that are NOT digits or +
          baseValidation = baseValidation.replace(/[^\d+]/g, '');

          // 3. Ensure + is only at the beginning (remove any extra + signs)
          baseValidation = baseValidation.replace(/\+(?=.)/g, (match, offset) => offset === 0 ? '+' : '');


          // baseValidation = baseValidation.replace(/[^0-9-]/g, "");
          baseValidation = this.runValidation(type, baseValidation);
          console.log('Cleaning phone input:', baseValidation);
          break;
        case 'ssn':
          baseValidation = baseValidation.replace(/[^0-9A-Z+-]/g, '');
          break;
        case 'currency':
          baseValidation = baseValidation.replace(/[^0-9]/g, "");
          break;
        default:
          console.warn(`Unsupported input type: ${type}`);
      }

      return baseValidation;
    },

    //on blur
    onBlur(step, id, type, value, language = _language, currency = _currency) {

      const fieldKey = this.getFieldKey(step, id);
      this.initializeFieldState(fieldKey);

      this.fieldStates[fieldKey] = {
        ...this.fieldStates[fieldKey],
        focused: false,
        touched: true
      };

      const validationResult = this.runValidation(type, value, language, currency);
      return validationResult
    },

    //on paste
    /*
    onPaste(step, id, type, value, language = _language, currency = _currency) {

    },*/


  },
  getters: {
    hasValidationErrors: (state) =>
      Object.keys(state.validationErrors).length > 0,
    getValidationError: (state) => (field) =>
      state.validationErrors[field] || null,
    getValidationMessage: (state) => (field) =>
      state.validationMessages[field] || null,
  },
});
