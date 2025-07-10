<script setup>
defineOptions({
  name: "BaseFieldset"
});

defineProps({
  BaseFieldsetLegend: {
    type: String,
    default: "",
  },
  BaseFieldsetOverwriteClass: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <fieldset class="group-component" :class="BaseFieldsetOverwriteClass">
    <legend v-if="BaseFieldsetLegend.trim()" class="group-lable">
      {{ BaseFieldsetLegend }}
    </legend>
    <slot></slot>
  </fieldset>
</template>
