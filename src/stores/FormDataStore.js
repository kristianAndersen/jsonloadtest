import { ref, computed } from 'vue'
import formStepData from "../assets/formStepsdata.json";
import { defineStore } from 'pinia'

export const useDataStore = defineStore('FormDataStore', () => {

  const errorRef = ref(null);
  const formJsonData = ref(null);
  //language and currency
  const config = ref({});
  const loadingDataFormSteps = ref(false);

  const loadFormData = () => {

    loadingDataFormSteps.value = true;
    try {
      //console.log("Raw imported JSON:", formStepData);


      formJsonData.value = formStepData;
      config.value = formStepData.properties
      //console.log("Processed form data:", formJsonData.value);
    } catch (err) {
      console.error("Error loading form data:", err);
      errorRef.value = err.message;
    } finally {
      loadingDataFormSteps.value = false;
    }
  }

  return {

    loadingDataFormSteps,
    loadFormData,
    formJsonData,
    config,

  }
})
