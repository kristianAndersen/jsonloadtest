<template>

  <button :id="id" :class="`BaseButton ${weight}`" :style="{ order: getOrderFromWeight(weight) }"
    class="baseButton general-width" @click.prevent="buttonClicked(step, value, id)">
    <span>
      <slot></slot>
      <label v-if="label" :class="lableclass"> {{ localized(label) }} </label>
    </span>
  </button>


</template>

<script setup>
import { useWeightToOrder } from "@/composable/useWeightToOrder";
const { getOrderFromWeight } = useWeightToOrder();
import { localized } from "@/composable/useLocalizedText.js";

const props = defineProps({
  value: {
    type: [String, Number, Boolean],
    default: "",
  },
  id: {
    type: String,
    required: true,
  },
  label: {
    type: [String, Object],
    default: " ",
  },
  weight: {
    type: Number,
    default: 0,
  },
  step: {
    type: Number,
    default: 0,
  },
  value: {
    type: [String, Number, Boolean],
    default: "",
  },
  step: {
    type: Number,
    default: 0,
  },
  lableclass: {
    type: String,
    default: "",
  },
  tooltip: {
    type: [String, Object],
    default: "Default Tooltip",
  },
  plusMinus: {
    type: String,
    default: "",
  },

})
const emit = defineEmits(["button-clicked"]);

const buttonClicked = (step, value, id) => {
  console.log(
    "Button clicked, step:",
    step,
    "value:",
    value,
    "id:",
    id,
    "plusminus:",
    props.plusMinus ? props.plusMinus : null,
  );
  emit("button-clicked", {
    step: step,
    value: value,
    id: id,
    plusminus: props.plusMinus,
  });
};

</script>
