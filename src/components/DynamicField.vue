<template>

  <component :is="component" v-bind="componentProps" :step="step" :fieldlable="fieldlable" />



</template>

<script setup>

import { computed } from "vue";
const props = defineProps({
  component: {
    type: Object,
    required: true
  },
  field: {
    type: Object,
    required: true
  },
  step: {
    type: Number,
    required: true
  },
  fieldlable: {
    type: [String, Object],
    default: ""
  },
});





const componentProps = computed(() => ({
  type: props.field.type,
  id: props.field.id,
  name: props.field.name,
  weight: props.field.weight,


  //...(props.field?.properties?.tooltip && { tooltip: props.field?.properties?.tooltip }),
  tooltip: props.field?.properties?.tooltip,
  label: props.field?.properties?.label,
  placeholder: props.field?.properties?.placeholder,
  error: props.field?.properties?.error,
  fname: props.field?.name,

  ...(props.field?.properties?.options && { options: props.field?.properties?.options }),
  fieldData: props.field
}));


</script>
