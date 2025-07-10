<template>
  <div class="rangeAtomWrap">
    <input type="range" :id="Id" :min="Min" :max="Max" :step="StepAmount" :value="Value" :class="RangeClass"
      aria-label="someLable" @input="handleInput" @change="handleChange" v-on="$attrs" />
  </div>
</template>

<script setup>
import { watch, onMounted } from "vue";
const props = defineProps({
  componentData: {
    type: Object,
    default: () => ({}),
  },
  Id: {
    type: String,
    default: "",
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
  RangeClass: {
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
  backgroundSize: {
    type: String,
    default: "0% 100%",
  },
});

// Emit the input and change events
const emit = defineEmits(["input", "change", "update:modelValue"]);

// Handle input event
const handleInput = (event) => {
  emit("input", event.target.value);
  emit("update:modelValue", event.target.value);
};

// Handle change event
const handleChange = (event) => {
  emit("change", event.target.value);
};

// Update the CSS variable when backgroundSize changes
watch(
  () => props.backgroundSize,
  (newSize) => {
    if (document.getElementById(props.Id)) {
      const element = document.getElementById(props.Id);
      // Extract percentage from newSize (which is in format "X% 100%")
      const percentage = parseFloat(newSize);
      // Set CSS variable
      element.style.setProperty("--range-percent", `${percentage}%`);
    }
  },
  { immediate: true }
);

// Watch for changes to the value prop
watch(
  () => props.Value,
  (newVal) => {
    if (document.getElementById(props.Id)) {
      const min = parseFloat(props.Min);
      const max = parseFloat(props.Max);
      const val = parseFloat(newVal);

      // Calculate percentage
      const percentage = ((val - min) / (max - min)) * 100;
      document
        .getElementById(props.Id)
        .style.setProperty("--range-percent", `${percentage}%`);
    }
  },
  { immediate: true }
);

// Set initial backgroundSize on mount
onMounted(() => {
  if (document.getElementById(props.Id)) {
    const percentage = parseFloat(props.backgroundSize);
    document
      .getElementById(props.Id)
      .style.setProperty("--range-percent", `${percentage}%`);
  }
});
</script>
