<template>

  <span class="InputRangeLable">Estimeret ydelse* ved<span class="boldInputLable">
      {{ yearcount <= 1 ? `${yearcount} year` : `${yearcount} years` }} </span></span>

    <div class="plus-minus-wrap">
      <BaseButton class="plusminusButton minus-icon" :id="minusButton" plusMinus="minus"
        @button-clicked="handlePlusMinusChange"></BaseButton>

      <span class="ApproximateCost-plusminusOutput">{{ formattedPayment }}</span>

      <BaseButton class="plusminusButton plus-icon" :id="plusButton" plusMinus="plus"
        @button-clicked="handlePlusMinusChange"></BaseButton>
    </div>
    <div class="ApproximateCost-dynamic-example" v-html="formattedExample"></div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import BaseButton from "../../Base/Buttons/BaseButton.vue";
import { useLoanCalculator } from "../../../composable/useLoanCalculator.js";
import { useFormatter } from "../../../composable/useFormatter.js";

import { useLanguage } from "../../../composable/useLanguage";
const { t } = useLanguage();



const minusButton = "minusButton";
const plusButton = "plusButton";

const props = defineProps({
  defaultCurrency: {
    type: String,
    default: "DKK",
    validator: (value) => ["EUR", "DKK", "NOK", "SEK"].includes(value),
  },
  text: {
    type: [Object, String],
    default: "",
  },


});

const { setYearCount, currentLoanData, loan_amount } = useLoanCalculator();
const { formatCurrency, formatterPercent } = useFormatter();

const yearcount = ref(5);
const payment = ref(0);

const interest = ref(0);
const amount = ref(0);
const apr = ref(0);
const total_payment = ref(0);
const total_cost = ref(0);

const emit = defineEmits(["axcost"])

// Update monthly payment and example whenever loan data changes
watch(
  currentLoanData,
  (newVal) => {
    if (newVal && newVal.monthly_payment !== undefined) {
      payment.value = newVal.monthly_payment;

      interest.value = newVal.interest;
      amount.value = newVal.amount;
      apr.value = newVal.apr;
      total_payment.value = newVal.total_payment;
      total_cost.value = newVal.total_cost;
    }
  },
  { immediate: true, deep: true }
);

// Also watch loan_amount to detect changes from the range slider
watch(
  loan_amount,
  () => {
    // console.log("Loan amount changed in ApproximateCostMolecule");
  },
  { immediate: true }
);

// Format the payment with currency
const formattedPayment = computed(() => {



  return formatCurrency(props.defaultCurrency, payment.value) + "/md.";
});

// Format the example text with currency and precent
const formattedExample = computed(() => {

  //localize the text
  let template = t(props.text) || '';

  // Check if the template contains any of the dynamic "tokens"
  const replacements = {
    '{{amount}}': `<span class="ApproximateCost-dynamic-example-amount">${formatCurrency(props.defaultCurrency, amount.value)}</span>`,
    '{{apr}}': `<span class="ApproximateCost-dynamic-example-amount">${formatterPercent(props.defaultCurrency, Number(apr.value))}</span>`,
    '{{total_payment}}': `<span class="ApproximateCost-dynamic-example-amount">${formatCurrency(props.defaultCurrency, total_payment.value)}</span>`,
    '{{total_cost}}': `<span class="ApproximateCost-dynamic-example-amount">${formatCurrency(props.defaultCurrency, total_cost.value)}</span>`
  };

  // Replace each token with its formatted value
  Object.entries(replacements).forEach(([token, value]) => {
    template = template.replace(token, value);
  });

  return template;

});

/* Plus - minus button */
const handlePlusMinusChange = (value) => {
  if (value.plusminus === "plus") {
    // Only increment if less than max (15)
    yearcount.value = yearcount.value < 15 ? yearcount.value + 1 : 15;

  } else if (value.plusminus === "minus") {
    // Only decrement if greater than min (1)
    yearcount.value = yearcount.value > 1 ? yearcount.value - 1 : 1;

  }
};

// Watch year count changes and update loan calculator
watch(yearcount, (newVal) => {
  setYearCount(newVal);
});

watch(formattedPayment, (newVal) => {
  console.log(newVal)

  emit("axcost", formattedPayment.value + ' at ' + yearcount.value + ' years')
});


onMounted(() => {
  setYearCount(yearcount.value);
  emit("axcost", formattedPayment.value + ' at ' + yearcount.value + ' years')
});
</script>
