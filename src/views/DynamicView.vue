<!--Dynamic view render -->
<template>
  <div class="dynamic-view">
    <component :is="currentComponent" :step="step" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { defineAsyncComponent, computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const step = ref(0);

watch(
  () => route.name,
  (newPath) => {
    step.value = Number(newPath);
  },
);

onMounted(() => {
  step.value = Number(route.name);
});

// Dynamically import the component  based on the route's meta.step property
const currentComponent = computed(() => {
  console.log("Current step:", route.meta.step);
  return defineAsyncComponent(() => import(`./${route.meta.step}.vue`));
});

</script>
