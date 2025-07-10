<!--CompositInput.vue-->
<template>
  <div class="inputFieldWrap inputWrap-width" :style="{ order: getOrderFromWeight(weight) }">

    <PrimitiveInput :label="label" :type="type" :id="id" :name="name" :weight="weight" :fieldsId="fieldsId"
      :placeholder="placeholder" @icon-clicked="iconWasClicked" :isInfoOpen="activeFieldIndex === index && showEkstra"
      :index="index" :tooltip="tooltip" :modelValue="modelValue" :step="step"
      @update:modelValue="$emit('update:modelValue', $event)" @onBlur="handleBlur" @onInput="handleInput"
      @onPaste="handlePaste" @onFocus="handleFocus">

      <template v-slot="{ index }">
        <BaseInputEkstra :isInfoOpen="activeFieldIndex === index && showEkstra" :tooltip="tooltip" :error="currentError"
          :hasError="hasValidationError" :index="index" :name="name" />
      </template>
    </PrimitiveInput>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";

import PrimitiveInput from "@/components/Primitive/inputs/PrimitiveInput.vue";
import BaseInputEkstra from "@/components/Composite/inputs/BaseInputEkstra.vue";


import { useWeightToOrder } from "@/composable/useWeightToOrder";
const { getOrderFromWeight } = useWeightToOrder();

import { useValidationStore } from "../../../stores/ValidationStore";
const validationStore = useValidationStore();

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
    default: "input",
  },
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  weight: {
    type: Number,
    default: 1,
  },
  fieldsId: {
    type: String,
    default: "poopFieldsId",
  },
  label: {
    type: [String, Object],
    default: "Default Label",
  },
  placeholder: {
    type: [String, Object],
    default: "Default Placeholder",
  },
  tooltip: {
    type: Object,
    default: () => ({ "da-DK": "Default Error Message" }),
  },
  error: {
    type: Object,
    default: () => ({ "da-DK": "Default Error Message" }),
  },
  index: {
    type: Number,
    default: 0,
  },
  step: {
    type: Number,
    default: 1,
  },
});

//const internalValue = ref(props.modelValue);
const emit = defineEmits([
  'update:modelValue',
  'onInput',
  'onPaste',
  'onBlur',
  'onFocus'
]);

// Track which field's icon was clicked
const activeFieldIndex = ref(-1);
const showEkstra = ref(false);
const _tooltip = ref("");
const fieldTouched = ref(false);
//const success = ref(false);

const hasValidationError = computed(() => {

  if (props.type === 'currency') {
    return false; // Skip validation for currency type
  }
  // Only show error if field has been touched via blur
  if (!fieldTouched.value) {
    console.log('Field not touched yet, no validation');
    return false;
  }

  const hasError = validationStore.getFieldError(props.step, props.id);
  // console.log(`CompositInput.hasValidationError - step: ${props.step}, id: ${props.id}, hasError: ${hasError}, touched: ${fieldTouched.value}`);
  return hasError;
});

const currentError = computed(() => {
  if (!fieldTouched.value) {
    return props.error;

  }

  const errorMessage = validationStore.getFieldErrorMessage(props.step, props.id);
  // console.log(`CompositInput.currentError - step: ${props.step}, id: ${props.id}, errorMessage: ${errorMessage}`);
  if (errorMessage) {
    return props.error;
  }
  return props.error;
});


// Update handleBlur to mark field as touched
const handleBlur = (value) => {
  console.log('Field touched via blur');
  //fieldTouched.value = true; // Mark as touched ONLY on blur
  emit('onBlur', value);
};

const handleInput = (value) => {


  emit('onInput', value);
};

const handlePaste = (value) => {

  emit('onPaste', value);
};

const handleFocus = (value) => {

  emit('onFocus', value);
};


const iconWasClicked = (data) => {
  console.log('Icon clicked - fieldTouched before:', fieldTouched.value);

  // If there's an error AND field has been touched, don't allow closing
  if (fieldTouched.value && hasValidationError.value && activeFieldIndex.value === data.index && showEkstra.value) {
    console.log('Prevented closing due to error');
    return;
  }

  // Handle the toggle logic - this should NOT set fieldTouched
  if (activeFieldIndex.value === data.index) {
    showEkstra.value = !showEkstra.value;
  } else {
    showEkstra.value = true;
    activeFieldIndex.value = data.index;
  }

  _tooltip.value = data.tooltip;
  console.log('Icon clicked - fieldTouched after:', fieldTouched.value);
};

// Watch for errors and auto-open BaseInputEkstra when error occurs
// But only if the field has actually been touched
watch(hasValidationError, (newHasError) => {
  if (newHasError && fieldTouched.value) {
    console.log('Opening BaseInputEkstra due to validation error');
    showEkstra.value = true;
    activeFieldIndex.value = props.index;
  }
});
</script>
