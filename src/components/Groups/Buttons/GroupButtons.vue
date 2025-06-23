<template>

  <label class="BaseLable" :style="{ order: getOrderFromWeight(weight) }">
    {{ fieldlable }}
    <p> {{ localized(fieldlable) }}</p>
    <div class="lableicon" v-if="tooltip != Object">
      <InfoIcon @click="toggleTooltip" />
    </div>
  </label>



  <div class="group-component" :style="{ order: getOrderFromWeight(weight) }" :id="id">

    <BaseButton v-for="option in options || []" :key="option.id" @button-clicked="buttonWasClicked" :id="option.id"
      :label="option.label"
      :class="[`BaseButton`, 'formButton', { 'formButton-active': activeButton === option.value, 'formButton-inactive': activeButton !== null && activeButton !== option.value }]"
      :style="{ order: getOrderFromWeight(option.weight) }" :value="option.value" :step="step" />

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


import InfoIcon from "@/components/Icons/InfoIcon.vue";


import { localized } from "@/composable/useLocalizedText.js";

defineProps({
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
    default: "Default Tooltip",
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

  activeButton.value = data.value;

  emit("button-group-clicked", {

    value: data.value,
    id: data.id,

  });

};
</script>
<style scoped></style>
