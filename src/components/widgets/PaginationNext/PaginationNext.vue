<template>
  <div class="group-component">

    <BaseButton :id="sectionID" class="paginationNext">{{ localized(label) }}</BaseButton>
  </div>
</template>

<script setup>
import BaseButton from "../../Base/Buttons/BaseButton.vue";
import { localized } from "../../../composable/useLocalizedText.js";

defineProps({
  step: {
    type: Number,
    required: true,
  },
  sectionID: {
    type: String,
    default: "Default Title",
  },
  label: {
    type: [String, Object],
    default: "Default Subtitle",
  },
})
</script>
