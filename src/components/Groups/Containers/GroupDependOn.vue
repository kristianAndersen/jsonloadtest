<template>

  <div class="showHidecontent" :class="{ 'is-open': isOpen, transitioning: allowTransition }" ref="contentRef"
    :style="[{ order: getOrderFromWeight(data.weight), maxHeight: contentMaxHeight }]">

    <div class="innerContent" ref="innerContentRef">
      <div class="dependOn" ref="innerContentDependOnRef">

        <template v-if="!nested">

          <BaseGroup v-for="[key, value] in Object.entries(data)" :key="key"
            :BaseFieldsetLegend="value?.properties?.label" :fieldgroup="value" :order="getOrderFromWeight(value.weight)"
            :visibility="value?.visibility" :step="step" :type="type" :dependsOn="dependsOn" :id="id" />
        </template>

        <div v-else class="group-component fieldgroup">
          <div class="main-field-wrapper">

            <template v-for="[key, value] in Object.entries(data)" :key="key">

              <template v-for="(nvalue, index) in value" :key="`${key}-${index}`">
                <DynamicField v-if="resolveComponent(nvalue?.properties?.component)"
                  :component="resolveComponent(nvalue?.properties?.component)" :field="nvalue" :step="step"
                  :fieldlable="nvalue?.properties?.label" />
              </template>
            </template>
          </div>
        </div>


      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick, watch, defineAsyncComponent } from 'vue'
import DynamicField from '../../DynamicField.vue'
import { useRadioStore } from '../../../stores/RadioStore'
import BaseGroup from '../../Base/containers/BaseGroup.vue'
import { useWeightToOrder } from "@/composable/useWeightToOrder";
const { getOrderFromWeight } = useWeightToOrder();
const props = defineProps({

  dependsOn: {
    type: String,
    default: '',
  },
  _class: {
    type: String,
    default: '',
  },
  data: {
    type: [Object, Array],
    default: () => ({}),
  },
  nested: {
    type: Boolean,
    default: false,
  },
  step: {
    type: Number,
    default: 0,
  },
  type: {
    type: String,
    default: '',
  },

})

const radioStore = useRadioStore()

const isOpen = computed(() => radioStore.isOpen(props.dependsOn))

const contentRef = ref(null)
const innerContentRef = ref(null)
const innerContentDependOnRef = ref(null)
const actualHeight = ref(0)
const allowTransition = ref(false)

const contentMaxHeight = computed(() => {
  if (isOpen.value && !allowTransition.value) return 'none'

  const paddedHeight = actualHeight.value // Add 10px padding

  return isOpen.value ? `${paddedHeight}px` : '0px'
})

const updateHeight = () => {
  if (!isOpen.value) return
  if (innerContentRef.value) {
    actualHeight.value = innerContentRef.value.scrollHeight
  }
}

// Debounce for resize observer
let resizeTimeout
const updateHeightDebounced = () => {
  clearTimeout(resizeTimeout)
  resizeTimeout = setTimeout(() => {
    updateHeight()
  }, 50)
}

const resizeObserver = new ResizeObserver(updateHeightDebounced)

watch(
  [innerContentRef, innerContentDependOnRef],
  ([inner, dependOn]) => {
    resizeObserver.disconnect()

    if (inner) resizeObserver.observe(inner)
    if (dependOn) resizeObserver.observe(dependOn)

    if (inner || dependOn) {
      allowTransition.value = true
      updateHeight()
    }
  },
  { immediate: true }
)

watch(isOpen, (open) => {
  console.log(isOpen.value + ' isOpen changed to: ' + open)
  if (open) {
    nextTick(() => updateHeight())
  }
})

onMounted(() => {
  setTimeout(() => updateHeight(), 300)
})

onUnmounted(() => {
  resizeObserver.disconnect()
  clearTimeout(resizeTimeout)
})

const componentMap = {
  GroupButtons: defineAsyncComponent(() => import("../../Groups/Buttons/GroupButtons.vue")),
  CompositeRadioButton: defineAsyncComponent(() => import("../../Composite/Buttons/CompositeRadioButton.vue")),
  CompositInput: defineAsyncComponent(() => import("../../Composite/inputs/CompositInput.vue")),
  EmploymentSpecifics: defineAsyncComponent(() => import("../../widgets/EmploymentSpecifics/EmploymentSpecifics.vue")),
  MortgageSpesefics: defineAsyncComponent(() => import("../../widgets/MortgageSpesefics/MortgageSpesefics.vue")),

};

const resolveComponent = (componentName) => {
  return componentMap[componentName] || null;
};


</script>

<style scoped>
.showHidecontent {
  position: relative;
  display: flex;
  flex: 1;
  overflow: hidden;
  z-index: 2;
  padding: 0;
}

.innerContent {
  width: 100%;
}

.dependOn {
  padding-bottom: 1rem;
}

.transitioning {
  transition: max-height 300ms ease;
  overflow: hidden;
}

.main-field-wrapper {
  padding: 0;
}
</style>
