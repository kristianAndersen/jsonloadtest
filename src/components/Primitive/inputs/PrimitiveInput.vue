<!--PrimitiveInput.vue-->
<template>
  <BaseLabel :label="label" :labelFor="id">
    <template #textlable></template>
    <template #lableicon>
      <InfoIcon v-if="tooltip" @click="handleIconClick" @mousedown.prevent />
    </template>
  </BaseLabel>

  <BaseInput :id="id" :placeholder="placeholder" :name="name" :index="index" :fieldsId="fieldsId" :class="{
    'has-success': success && !hasError,
    'has-info-open': isInfoOpen || hasError,
    'has-info-closed': !isInfoOpen && !hasError
  }" :type="type" :step="step" :modelValue="modelValue" @update:modelValue="$emit('update:modelValue', $event)"
    @onBlur="handleBlur" @onInput="handleInput" @onPaste="handlePaste" @onFocus="handleFocus" />

  <slot :index="index"></slot>
</template>
<script setup>
import { ref } from "vue";
import BaseInput from '@/components/Base/inputs/BaseInput.vue';
import BaseLabel from '@/components/Base/inputs/BaseLabel.vue';
import InfoIcon from "@/components/icons/InfoIcon.vue";

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
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
    required: true,
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
    default: "Default Tooltip",
  },
  isInfoOpen: {
    type: Boolean,
    default: false,
  },
  hasError: {
    type: Boolean,
    default: false,
  },
  index: {
    type: Number,
    default: 0,
  },
  step: {
    type: Number,
    default: 1,
  },
});



const success = ref(false);

const emit = defineEmits([
  "icon-clicked",
  "update:modelValue",
  "onBlur",
  "onInput",
  "onPaste",
  "onFocus"
]);

// Event handlers to forward BaseInput events
const handleBlur = (value) => {
  emit('onBlur', value);
};

const handleInput = (value) => {

  if (value.valid) {
    success.value = true;
  }

  emit('onInput', value);
};

const handlePaste = (value) => {
  emit('onPaste', value);
};

const handleFocus = (value) => {
  emit('onFocus', value);
};


const handleIconClick = (event) => {
  // Prevent the click from bubbling and causing focus/blur issues
  event.preventDefault();
  event.stopPropagation();

  emit("icon-clicked", {
    index: props.index,
    tooltip: props.tooltip,
  });
};
</script>
