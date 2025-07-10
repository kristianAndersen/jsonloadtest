<template>
  <label :for="labelFor" class="BaseLable">
    {{ localized(label) }}
    <slot name="lableicon"></slot>
  </label>

</template>

<script setup>

import { localized } from "../../../composable/useLocalizedText";

defineProps({
  label: {
    type: [String, Object],
    required: true,
    default: "Default Label",
  },
  labelFor: {
    type: String,
    default: "no text provided",
  },
});
</script>
