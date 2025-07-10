<template>
  <div class="input-extra input-extra-closed"
    :class="{ 'input-extra-open input-extra-info': infoOpen || hasError, 'input-extra-error': hasError }">
    <p>


      <template v-if="!hasError">
        {{ localized(tooltip) }}
      </template>
      <template v-if="hasError">
        {{ localized(error) }}
      </template>

    </p>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

import { localized } from "@/composable/useLocalizedText.js";

const props = defineProps({
  isInfoOpen: {
    type: Boolean,
    default: false,
  },
  tooltip: {
    type: [String, Object],
    required: true,

  },
  error: {
    type: [String, Object],
    default: "",
  },
  hasError: {
    type: Boolean,
    default: false,
  },
  index: {
    type: Number,
    default: 0,
  },
  name: {
    type: String,
    default: "",
  },
});

const infoOpen = ref(false);

watch(
  () => props.isInfoOpen,
  (newValue) => {
    infoOpen.value = newValue;
    // console.log("isInfoOpen changed to", newValue, "for index", props.index);
  },
  { immediate: true }
);

watch(
  () => props.hasError,
  (newhasError) => {
    //  console.log("error changed in inputExtra", newhasError, "for index", props.index);
    // console.log("error content:", props.error);
  },
  { immediate: true }
);
</script>
