<template>

  <Basefieldset class="details" :class="{ 'is-open': open }">
    <div class="group-component overwrite-group-component-padding">
      <div role="summary" class="summary general-width" @click="toggleOpen">
        <div class="summaryWrap show-summary" :class="{ 'hide-summary': open }">

          <span v-if="!open" class="fade-in">click to adjust current loan settings:<br> <b> {{ laUpadteDisplay }}.
              Estimated payment*:
              {{ axcostDisplay }} </b></span>
          <span v-if="open" class="fade-in">Close </span>

        </div>
      </div>

      <div role="definition" class="content" :style="{
        height: contentHeight,
        transition: allowTransition ? 'height 400ms ease-in-out' : 'none',
        '-webkit-transition': allowTransition
          ? 'height 400ms ease-in-out'
          : 'none',
        '-moz-transition': allowTransition
          ? 'height 400ms ease-in-out'
          : 'none',
        '-ms-transition': allowTransition
          ? 'height 400ms ease-in-out'
          : 'none',
        '-o-transition': allowTransition
          ? 'height 400ms ease-in-out'
          : 'none',
      }" ref="contentRef">
        <div class="innerContent" ref="innerContent">
          <!--  -->
          <CompositRange @loanamount="laUpadte" />

          <div class="group-component overwrite-group-component-padding">
            <ApproximateCost :text="fg.properties?.text" @axcost="axcostUpdate" />
          </div>

        </div>
      </div>
    </div>
  </Basefieldset>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import Basefieldset from "../../Base/containers/Basefieldset.vue";
import ApproximateCost from "./ApproximateCost.vue";
import CompositRange from "../../Composite/inputs/CompositRange.vue"


defineProps({

  fg: {
    type: Object,

  },
});



const open = ref(true); // Set default to open
const contentRef = ref(null);
const innerContent = ref(null);
const actualHeight = ref(0);
const allowTransition = ref(false); // Initially disable transitions

const axcostDisplay = ref();
const laUpadteDisplay = ref();
onMounted(async () => {
  // Give the browser more time to render everything completely firefox hack...
  setTimeout(() => {
    if (innerContent.value) {
      innerContent.value.offsetHeight;
      actualHeight.value = innerContent.value.scrollHeight;
      // Enable transitions after height is properly calculated
      setTimeout(() => {
        allowTransition.value = true;
      }, 200);
    }
  }, 300);
});


const axcostUpdate = (value) => {
  axcostDisplay.value = value;

};
const laUpadte = (value) => {
  laUpadteDisplay.value = value;
};
const contentHeight = computed(() => {
  // If we're in the initial open state and transitions aren't allowed yet,
  // return 'auto' to prevent any visual jumps
  if (open.value && !allowTransition.value) {
    return "auto";
  }
  return open.value ? `${actualHeight.value}px` : "0px";
});

const toggleOpen = () => {
  console.log("toggleOpen");
  // Measure height if needed
  if (!open.value && actualHeight.value === 0 && innerContent.value) {
    actualHeight.value = (innerContent.value.scrollHeight += 520); // Add some padding
  }
  open.value = !open.value;
};

const resizeObserver = new ResizeObserver(() => {
  if (open.value && innerContent.value) {
    actualHeight.value = innerContent.value.scrollHeight;
  }
});

onMounted(() => {
  if (innerContent.value) {
    resizeObserver.observe(innerContent.value);
  }
});

onUnmounted(() => {
  resizeObserver.disconnect();
});
</script>
<style scoped>
.fade-in {
  animation: fadeIn 0.5s;
  -webkit-animation: fadeIn 0.5s;
  -moz-animation: fadeIn 0.5s;
  -o-animation: fadeIn 0.5s;
  -ms-animation: fadeIn 0.5s;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@-moz-keyframes fadeIn {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@-webkit-keyframes fadeIn {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@-o-keyframes fadeIn {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@-ms-keyframes fadeIn {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>
