<!-- components/LanguageSelector.vue -->
<script setup>
import { useLanguage } from "@/composable/useLanguage";

const { current, available, setLanguage } = useLanguage();

const languageNames = {
  "en-GB": "English",
  "da-DK": "Dansk",
  "fi-FI": "Suomi",
};
</script>

<template>
  <div class="language-selector">
    <button v-for="lang in available" :key="lang" :class="{ active: lang === current }" @click="setLanguage(lang)">
      {{ languageNames[lang] }}
    </button>
  </div>
</template>
