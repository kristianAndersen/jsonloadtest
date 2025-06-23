<!-- if remderMode is not pagination then skip the step counts-->
<template>
  <div class="stepperWrap">

    <div class="dotSteps" v-if="renderMode === 'pagination'">
      <div v-for="(step, index) in stepsNumber" :key="index" class="stepDot" :class="{}">
        {{ index + 1 }}
      </div>
      <progress value="0" max="100" class="step-progress"></progress>
    </div>
    <!-- {{ progressValue }}-->
  </div>
</template>

<script setup>


import { useConfigStore } from '@/stores/ConfigStore';
const configStore = useConfigStore();
const renderMode = configStore.getRenderMode;

defineProps({
  stepsNumber: {
    type: Number,
    default: 1,
  },
  currentStep: {
    type: Number,
    default: 0,
  },
});


</script>
