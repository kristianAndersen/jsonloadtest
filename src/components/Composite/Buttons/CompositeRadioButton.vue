<!-- CompositeRadioButton.vue -->
<template>
  <div class="group-component" :style="{ order: getOrderFromWeight(weight) }">

    <label class="BaseLable">

      {{ localized(label) }}

      <div class="lableicon" v-if="tooltip">
        <InfoIcon @click="toggleTooltip" />
      </div>
    </label>

    <BaseButton v-for="option in options || []" :key="option.id || option.value" @button-clicked="buttonWasClicked"
      :id="option.id" class="radioButton" :label="option.label"
      :class="[`BaseButton`, 'formButton', { selected: isButtonSelected(option.id, option.value) }, { 'formButton-active': activeButton === option.value, 'formButton-inactive': activeButton !== null && activeButton !== option.value }]"
      :style="{ order: getOrderFromWeight(option.weight) }" :value="option.value" :step="step" :lableclass="radiolable">


      <input type="radio" :value="option.value" :name="fname" :checked="modelValue === option.value" :class="[
        'box-shadow',
        option.value === true || option.value === 'true'
          ? 'trueValue'
          : 'falseValue',
      ]" :ref="(el) => (radioCheckRef[option.value] = el)" />


    </BaseButton>
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
import { ref, onMounted } from "vue";
import { localized } from "@/composable/useLocalizedText.js";
import BaseButton from "../../Base/Buttons/BaseButton.vue";
import InfoIcon from "@/components/icons/InfoIcon.vue";


import { useRadioStore } from "../../../stores/RadioStore";

import { useWeightToOrder } from "@/composable/useWeightToOrder";
const { getOrderFromWeight } = useWeightToOrder();

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
  placeholder: {
    type: [String, Object],
    default: "Default Placeholder",
  },
  tooltip: {
    type: [String, Object],
    required: true,
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
  fname: {
    type: String,
    default: "",
  },
  modelValue: {
    type: [String, Number, Boolean],
    default: null
  },
});

const isTooltipVisible = ref(false)
const activeButton = ref(null);
const toggleTooltip = () => {
  isTooltipVisible.value = !isTooltipVisible.value


}

const radiolable = ref("radio-label");
const radioCheckRef = ref({});
const emit = defineEmits(['update:modelValue', 'radiobutton-clicked']);

// Get the store
const radioStore = useRadioStore();
/*
// Create a unique instance for this radio button
const radioButtonState = useRadioButtonClick(props.id);
const { setIsOpen } = radioButtonState;
// Provide this state to be injected by any GroupDependOn component
provide(`radio-${props.id}`, radioButtonState);
*/

// When a button is clicked, perform these operations
const buttonWasClicked = (data) => {

  // Set the radio as checked visually
  if (radioCheckRef.value[data.value]) {
    radioCheckRef.value[data.value].checked = true;
  }
  activeButton.value = data.value;
  emit('update:modelValue', data.value);
  // Use the Pinia store to set the state
  radioStore.setOpen(props.id, data.value);
  // Get the field name and ID
  // const fieldId = props.id;
  //const fieldName = props.fname
  //emit("Radio-clicked", { value: data.value });
  emit("radiobutton-clicked", {

    value: data.value,
    id: data.id,

  });

}

onMounted(() => {
  // Check for initial values
  if (props.id) {

    const initialValue = undefined;
    props.options.forEach((option) => {

      if (
        (initialValue === true && option.value === "true") ||
        (initialValue === false && option.value === "false") ||
        initialValue === option.value
      ) {

        // Set the radio button checked state
        if (radioCheckRef.value[option.value]) {
          radioCheckRef.value[option.value].checked = true;
        }
      }


    })
  }
});

const isButtonSelected = (buttonId, value) => {
  console.log("isButtonSelected", buttonId, value, props.modelValue);
  // Check if the button is selected based on the modelValue
  return props.modelValue === value || (props.modelValue === true && value === "true") || (props.modelValue === false && value === "false");
}


//const emit = defineEmits(["Radio-clicked"]);
</script>
