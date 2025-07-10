<template v-if="options && options.length > 0">

  <label class="BaseLable" :style="{ order: getOrderFromWeight(weight) }">

    <p> {{ localized(label) }}</p>

    <div class="lableicon" v-if="typeof tooltip === 'object' && tooltip !== null">
      <InfoIcon @click="toggleTooltip" />
    </div>
  </label>



  <div class="group-component" :style="{ order: getOrderFromWeight(weight) }" :id="id">

    <BaseButton v-for="option in options || []" :key="option.id" @button-clicked="buttonWasClicked" :id="option.id"
      :label="option.label"
      :class="[`BaseButton`, 'formButton', { 'formButton-active': activeButton === option.value, 'formButton-inactive': activeButton !== null && activeButton !== option.value }]"
      :style="{ order: getOrderFromWeight(option.weight) }" :value="option.value" :step="step"
      :addicon="option.addicon" />

    <div v-if="tooltip" class="groupComponentTooltip" style="order:10000">
      <div class="groupComponentTooltip-label"
        :class="{ 'extra-info-open': isTooltipVisible, 'extra-info-closed': !isTooltipVisible }">
        <div class="content-wrapper">

          <p>{{ localized(tooltip) }}</p>
        </div>
      </div>
    </div>


  </div>

</template>

<script setup>
import { ref } from "vue";


import BaseButton from '../../Base/Buttons/BaseButton.vue';
import { useWeightToOrder } from "@/composable/useWeightToOrder";
const { getOrderFromWeight } = useWeightToOrder();

import { useButtonState } from '@/composable/useButtonState.js';
const { setButtonData } = useButtonState()

import InfoIcon from "@/components/icons/InfoIcon.vue";
import { localized } from "@/composable/useLocalizedText.js";

const props = defineProps({
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
  label: {
    type: [String, Object],
    default: "Default Label",
  },
  fieldlable: {
    type: [String, Object],
    default: "Default fieldLabel",
  },
  placeholder: {
    type: [String, Object],
    default: "Default Placeholder",
  },
  tooltip: {
    type: [String, Object],
    default: '',
  },
  index: {
    type: Number,
    default: 0,
  },
  step: {
    type: Number,
    default: 0,
  },
  options: {
    type: Array,
    default: () => [],
  },
  lableclass: {
    type: String,
    default: "",
  },
  fname: {
    type: String,
    default: "",
  },
  error: {
    type: [String, Object, Boolean],
    default: null,
  },
  fieldData: {
    type: [Object, Array],
    default: null,
  },

})
const activeButton = ref(null);

const isTooltipVisible = ref(false)

const toggleTooltip = () => {
  isTooltipVisible.value = !isTooltipVisible.value


}

const emit = defineEmits(["button-group-clicked"]);

const buttonWasClicked = (data) => {

  if (props.id != 'add_Loan_credit') {
    activeButton.value = data.value;
  }
  emit("button-group-clicked", {

    value: data.value,
    id: data.id,
    label: data.label,
  });



  // only set button data if the value is one of the specified employment types
  const setButtons = `type_of_employment_fulltime 
  type_of_employment_selfemployed 
  type_of_employment_parttime 
  type_of_employment_pensioner 
  type_of_employment_unemployed 
  type_of_employment_student 
  type_of_employment_temporary 
  type_of_employment_other 
  type_of_housing_co-housing 
  type_of_housing_employee_housing 
  type_of_housing_partners_house 
  type_of_housing_parents 
  type_of_housing_own_house_apartment 
  type_of_housing_right_of_occupancy 
  type_of_housing_other_housing 
  
  add_Loan_credit_mortgage 
  add_Loan_credit_visa_credit_card 
  add_Loan_credit_eurocard
add_Loan_credit_mastercard
  add_Loan_credit_diners_club 
  add_Loan_credit_car_loan 
  add_Loan_credit_consumption 
  add_Loan_credit_student_loan 
 add_Loan_credit_other`;

  const searchTerm = data.value;
  const regex = new RegExp(`\\b${searchTerm}\\b`);

  if (setButtons.match(regex)) {
    console.log("setButtons", data.value, data.label);
    setButtonData(data.value, data.label)
  }

};


</script>
<style scoped></style>
