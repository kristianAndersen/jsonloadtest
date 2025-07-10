<template>

  <button :id="id" :style="{ order: getOrderFromWeight(weight) }"
    :class="['baseButton', 'general-width', `BaseButton ${weight}`, overwriteClass ? overwriteClass : '']"
    @click.prevent="buttonClicked(step, value, id)">
    <span>
      <slot></slot>
      <label v-if="label" :class="lableclass"> {{ localized(label) }} </label>
    </span>

    <AddIcon v-if="addicon" class="add-icon" />
  </button>


</template>

<script setup>
import { useWeightToOrder } from "@/composable/useWeightToOrder";
const { getOrderFromWeight } = useWeightToOrder();
import { localized } from "@/composable/useLocalizedText.js";
import AddIcon from "@/components/icons/AddIcon.vue";
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
  overwriteClass: {
    type: String,
    default: "",
  },
  addicon: {
    type: Boolean,
    default: false,
  },

})
const emit = defineEmits(["button-clicked"]);

const buttonClicked = (step, value, id) => {
  /* console.log(
     "Button clicked, step:",
     step,
     "value:",
     value,
     "id:",
     id,
     "plusminus:",
     props.plusMinus ? props.plusMinus : null,
   );*/
  emit("button-clicked", {
    step: step,
    value: value,
    id: id,
    label: props.label,
    plusminus: props.plusMinus,
  });
};

</script>
