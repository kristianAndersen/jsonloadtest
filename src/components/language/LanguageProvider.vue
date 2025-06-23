<!-- components/LanguageProvider.vue -->
<script setup>
import { createLanguageContext } from "@/composable/useLanguage";

// Create and provide the language context
const languageContext = createLanguageContext();

// Expose to parent component if needed
defineExpose({ languageContext });
</script>

<template>

  <!-- Render slots so child components are rendered -->
  <slot></slot>
</template>
