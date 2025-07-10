<!--baseInput-->
<template>
  <input class="inputField" :class="{
    'has-success': validationState.isValid,
    'error': !validationState.isValid,
    [overwriteClass]: overwriteClass
  }" :inputmode="inputMode" :id="id" :type="inputType" :placeholder="localized(placeholder)"
    :ref="(el) => (baseinput[fieldsId] = el)" :name="name" v-model="inputValue" @input="handleInputEvent"
    @keydown="handleKeydownEvent" @focus="handleFocus" @blur="handleBlur"
    :style="'order:' + getOrderFromWeight(weight)" />
</template>

<script setup>
import { onMounted, ref, computed, watch } from "vue";
import { localized } from "../../../composable/useLocalizedText";

import { useNordicPhoneValidation } from '../../../composable/validation/phoneValidation/useNordicPhoneValidation'
import { useEmailValidation } from '../../../composable/validation/emailValidation/useEmailValidation';
import { useCurrencyValidation } from '../../../composable/validation/currencyValidation/useCurrencyValidation';

import { useYearValidation } from "@/composable/validation/yearValidation/useYearValidation";
import { useSsnValidation } from '../../../composable/validation/ssnValidation/useSsnValidation';
import { useConfigStore } from '../../../stores/ConfigStore';
import { useWeightToOrder } from "@/composable/useWeightToOrder";
const { getOrderFromWeight } = useWeightToOrder();

const configStore = useConfigStore();
const _language = configStore.getLanguage || 'en-GB'
const _currency = configStore.getCurrency || 'ERU'

const baseinput = ref({});
const inputType = ref('text');
const inputMode = ref('text');

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  component: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "text",
  },
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  fieldsId: {
    type: String,
  },
  placeholder: {
    type: [String, Object],
    default: "Default Placeholder",
  },
  index: {
    type: Number,
    default: 0,
  },
  step: {
    type: Number,
    default: 1,
  },
  hasError: {
    type: Boolean,
    default: false,
  },
  _class: {
    type: String,
    default: "",
  },
  required: {
    type: Boolean,
    default: false,
  },
  weight: {
    type: Number,
    default: 0,
  },
  overwriteClass: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(['update:modelValue']);

const countryCode = (cc) => {
  if (cc == 'da-DK') {
    return 'DK';
  } else if (cc == 'sv-SE') {
    return 'SE';
  } else if (cc == 'no-NO') {
    return 'NO';
  } else if (cc == 'fi-FI') {
    return 'FI';
  }
  console.warn(`Unknown language code: ${cc}, defaulting to DK`);
  return 'DK';
};


const currencyCode = (cc) => {
  if (cc == 'da-DK') {
    return 'DKK';
  } else if (cc == 'sv-SE') {
    return 'SEK';
  } else if (cc == 'no-NO') {
    return 'NOK';
  } else if (cc == 'fi-FI') {
    return 'EUR';
  }
  console.warn(`Unknown language code: ${cc}, defaulting to DK`);
  return 'DK';
};



// Validation based on props.type
const createValidation = (type) => {
  switch (type) {
    case 'tel':
      return useNordicPhoneValidation(countryCode(_language))

    case 'email':
      return useEmailValidation();
    case 'ssn':
      return useSsnValidation(_language);

    case 'currency':
      return useCurrencyValidation(_language, _currency, currencyCode(_language));

    case 'year':
      return useYearValidation();
    default:
      return null;
  }
};

// Conditionally instantiate validation only for types that need it
const validation = computed(() => {

  const validationTypes = ['ssn', 'currency', 'tel', 'email', 'year']; // Add 'email', 'ssn', etc.

  if (validationTypes.includes(props.type)) {
    return createValidation(props.type);
  }

  return null;
});

// unified validation state that works for all input types
const validationState = computed(() => {

  if (validation.value && validation.value.validation) {
    return validation.value.validation.value;
  }

  // If no validation is yet added or for inputs without specific validation
  return {
    isValid: null,//!props.hasError && (!props.required || (props.modelValue && props.modelValue.toString().trim() !== '')),
    errors: [],
    formatted: props.modelValue
  };
});

// Get the reactive value from validation (like tel.value for phone)
const getValidationValue = () => {
  if (validation.value) {
    if (props.type === 'ssn' && validation.value.ssn) {
      return validation.value.ssn.value;
    }
    // For phone validation, it's tel.value
    if (props.type === 'tel' && validation.value.tel) {
      return validation.value.tel.value;
    }
    // Add other validation value getters as needed
    if (props.type === 'email' && validation.value.email) {
      return validation.value.email.value;
    }
    if (props.type === 'currency' && validation.value.currency) {
      return validation.value.currency.value;
    }
    if (props.type === 'year' && validation.value.year) {
      return validation.value.year.value;
    }
    if (props.type === 'number' && validation.value.number) {
      return validation.value.number.value;
    }
  }
  return null;
};

//Set the reactive value in validation (like tel.value for phone)
const setValidationValue = (value) => {
  if (validation.value) {
    if (props.type === 'ssn' && validation.value.ssn) {
      validation.value.ssn.value = value;
      return;
    }
    // Phone validation
    if (props.type === 'tel' && validation.value.tel) {
      validation.value.tel.value = value;
      return;
    }
    // Email validation
    if (props.type === 'email' && validation.value.email) {
      validation.value.email.value = value;
      return;
    }
    //currency
    if (props.type === 'currency' && validation.value.currency) {
      validation.value.currency.value = value;
      return;
    }
    if (props.type === 'year' && validation.value.year) {
      validation.value.year.value = value;
      return;
    }



  }
};

const inputValue = computed({
  get() {
    const validationValue = getValidationValue();
    return validationValue !== null ? validationValue : props.modelValue;
  },
  set(value) {
    if (validation.value) {
      setValidationValue(value);
    }
    emit('update:modelValue', value);
  }
});

// Event handlers that delegate to validation composable
const handleInputEvent = (event) => {
  if (validation.value && validation.value.handleInput) {
    validation.value.handleInput(event);

    // Get the updated value from the validation composable
    const updatedValue = getValidationValue();
    emit('update:modelValue', updatedValue);
  } else {
    // Default input handling for non-validated inputs
    emit('update:modelValue', event.target.value);
  }
}

const handleKeydownEvent = (event) => {
  if (validation.value && validation.value.handleKeydown) {
    validation.value.handleKeydown(event);
  }
  // For non-validated inputs, allow all keystrokes (default behavior)
};

const handleFocus = (event) => {
  if (props.type == 'currency') {
    if (validation.value && validation.value.handleFocus) {
      validation.value.handleFocus(event);

    } else {
      // Default input handling for non-validated inputs
      emit('update:modelValue', event.target.value);
    }
  }
};

const handleBlur = (event) => {
  if (props.type == 'currency') {
    if (validation.value && validation.value.handleBlur) {
      validation.value.handleBlur(event);

    } else {
      // Default input handling for non-validated inputs
      emit('update:modelValue', event.target.value);
    }
  }
};
// Watch for changes in validation state
watch(() => validationState.value, (newValidation) => {
  if (validation.value && newValidation.isValid) {
    // Optionally emit the formatted version
    emit('update:modelValue', newValidation.formatted);
  }
}, { deep: true });

// Set HTML input type and inputmode
const setInputType = () => {
  switch (props.type) {
    case 'text':
      inputType.value = 'text';
      inputMode.value = 'text';
      break;
    case 'number':
      inputType.value = 'number';
      inputMode.value = 'numeric';
      break;
    case 'year':
      inputType.value = 'number';
      inputMode.value = 'numeric';
      break;
    case 'email':
      inputType.value = 'email';
      inputMode.value = 'email';
      break;
    case 'tel':

      inputType.value = 'tel';
      inputMode.value = 'tel';
      break;
    case 'ssn':
      inputType.value = 'text';
      inputMode.value = 'numeric';
      break;
    case 'currency':
      inputType.value = 'text';
      inputMode.value = 'numeric';
      break;
    default:
      inputType.value = 'text';
      inputMode.value = 'text';
      console.warn(`Unsupported input type: ${props.type}, defaulting to text`);
  }
};

onMounted(() => {
  setInputType();
});

watch(() => props.modelValue, (newValue) => {
  const validationValue = getValidationValue();
  if (validation.value && newValue !== validationValue) {
    setValidationValue(newValue?.toString() || '');
  }
});
</script>
