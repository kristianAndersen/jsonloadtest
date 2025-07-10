<template>
  <input class="inputField inputOutput" type="tel" :id="Id" :name="name"
    onkeypress="return event.charCode > 47 && event.charCode < 58;" maxlength="11" required
    style="color: #222529 !important" pattern="[0-9]*" inputmode="numeric" :value="Value" @input="handleInputChange"
    @blur="validateInput" />
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  Id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  Value: {
    type: String,
    required: true,
  },
  minAmount: {
    type: Number,
    default: 500,
  },
  maxAmount: {
    type: Number,
    default: 70000,
  },
  stepAmount: {
    type: Number,
    default: 500,
  },
});

const emit = defineEmits(["update:modelValue", "amountChange"]);

const rawInputValue = ref("");

// Handle input change from the tel field
function handleInputChange(event) {
  rawInputValue.value = event.target.value.replace(/[^0-9]/g, ""); // Keep only digits

  // Emit the raw input value as it changes
  emit("update:modelValue", event.target.value);
}

// Validate input when user finishes editing the text field
function validateInput() {
  if (rawInputValue.value) {
    let numValue = parseInt(rawInputValue.value, 10);

    // Validate range
    if (isNaN(numValue)) {
      return; // Don't update if not a valid number
    } else {
      numValue = Math.min(Math.max(numValue, props.minAmount), props.maxAmount);
      // Round to nearest step
      numValue = Math.round(numValue / props.stepAmount) * props.stepAmount;
    }

    // Emit the validated numerical value
    emit("amountChange", numValue);
    rawInputValue.value = "";
  }
}
</script>
