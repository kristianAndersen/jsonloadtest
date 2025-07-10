<template>
  <BaseRangeInput :Id="Id" :Value="currentValue" :Min="Min" :Max="Max" :StepAmount="StepAmount" :Name="Name"
    :AriaLabel="AriaLabel" :AtomRangeClass="AtomRangeClass" :hasIcon="hasIcon" :iconClass="iconClass"
    :backgroundSize="backgroundSize" @input="handleInput" @change="handleChange" v-on="$attrs" />

  <div class="slider-labels">
    <span>{{ MinLable }}</span>
    <span>{{ MaxLable }}</span>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import BaseRangeInput from "../../Base/inputs/BaseRangeInput.vue";

const props = defineProps({
  Id: {
    type: String,
    default: "rangeInput",
  },
  Value: {
    type: String,
    default: "50",
  },
  Min: {
    type: String,
    default: "0",
  },
  Max: {
    type: String,
    default: "100",
  },
  MinLable: {
    type: String,
    default: "0",
  },
  MaxLable: {
    type: String,
    default: "0",
  },
  StepAmount: {
    type: String,
    default: "1",
  },
  Name: {
    type: String,
    default: "RangeNuclei",
  },
  AriaLabel: {
    type: String,
    default: "RangeNuclei",
  },
  AtomRangeClass: {
    type: String,
    default: "",
  },
  hasIcon: {
    type: Boolean,
    default: false,
  },
  iconClass: {
    type: String,
    default: "",
  },
});
// Emit the input and change events
const emit = defineEmits(["input", "change", "update:modelValue"]);

const currentValue = ref(props.Value);

// Watch for changes to the prop
watch(
  () => props.Value,
  (newVal) => {
    currentValue.value = newVal;
  },
  { immediate: true }
);

// Compute the background size based on the current value
const backgroundSize = computed(() => {
  const min = parseFloat(props.Min);
  const max = parseFloat(props.Max);
  const val = parseFloat(currentValue.value);

  // Calculate percentage
  const percentage = ((val - min) / (max - min)) * 100;
  return `${percentage}% 100%`;
});

// Handle input event
const handleInput = (value) => {
  currentValue.value = value;
  emit("input", value);
  emit("update:modelValue", value);
};

// Handle change event
const handleChange = (value) => {
  emit("change", value);
};
</script>
