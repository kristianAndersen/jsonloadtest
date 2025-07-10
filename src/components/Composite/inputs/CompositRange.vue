<template>
  <BaseInputOutput :Value="formattedAmount" Id="inputOutput" :name="inputOutput_ID" :min-amount="minAmount"
    :max-amount="maxAmount" :step-amount="StepAmount" @amount-change="updateLoanAmount" />
  <PrimitiveRange Id="inputRange" :Value="loanAmount.toString()" :Min="minAmount.toString()" :Max="maxAmount.toString()"
    :StepAmount="StepAmount.toString()" :MinLable="formatCurrency(currency, minAmount)"
    :MaxLable="formatCurrency(currency, maxAmount)" @input="handleRangeInput" @update:modelValue="handleRangeInput" />
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import PrimitiveRange from "../../Primitive/inputs/PrimitiveRange.vue";
import BaseInputOutput from "../../Base/inputs/BaseInputOutput.vue";
import { useLoanCalculator } from "../../../composable/useLoanCalculator.js";
import { useFormatter } from "../../../composable/useFormatter.js";

const props = defineProps({
  initialAmount: {
    type: Number,
    default: 250000,
  },
  minAmount: {
    type: Number,
    default: 5000,
  },
  maxAmount: {
    type: Number,
    default: 400000,
  },
  StepAmount: {
    type: Number,
    default: 500,
  },
  defaultCurrency: {
    type: String,
    default: "DKK",
    validator: (value) => ["EUR", "DKK", "NOK", "SEK"].includes(value),
  },

});

const { setLoanAmount, loan_amount } = useLoanCalculator();
const { formatCurrency } = useFormatter();

const inputOutput_ID = "amountValue";

// Emits for parent component
const emit = defineEmits(["update:amount", "update:currency", "loanamount"]);

// Reactive state
const loanAmount = ref(props.initialAmount);
const currency = ref(props.defaultCurrency);

// Computed property for formatted amount
const formattedAmount = computed(() => {
  return formatCurrency(currency.value, loanAmount.value);
});

// Function to update loan amount from the input component
function updateLoanAmount(value) {
  loanAmount.value = value;
  setLoanAmount(value);
  // Emit change to parent if needed
  emit("update:amount", value);

}

// Function to handle range input events
function handleRangeInput(value) {
  // Convert the string value to number and ensure it respects step amount
  const numValue =
    Math.round(Number(value) / props.StepAmount) * props.StepAmount;
  loanAmount.value = numValue;
  setLoanAmount(numValue);
  emit("update:amount", numValue);
}

// Add watcher to sync with the shared state if it changes elsewhere
watch(loan_amount, (newValue) => {
  if (newValue !== loanAmount.value) {
    loanAmount.value = newValue;
  }
  emit("loanamount", formattedAmount.value)
});

onMounted(() => {
  // Set initial loan amount
  loanAmount.value = props.initialAmount;
  setLoanAmount(props.initialAmount);
  emit("loanamount", formattedAmount.value)
});
</script>
