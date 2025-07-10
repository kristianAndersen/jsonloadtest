<script setup>
import {
  defineAsyncComponent, reactive,
  watch, nextTick
} from "vue";

import DynamicField from "../../DynamicField.vue";
import GroupDependOn from "../../Groups/Containers/GroupDependOn.vue";

import { useWeightToOrder } from "@/composable/useWeightToOrder";

const { getOrderFromWeight } = useWeightToOrder();

defineProps({
  fieldgroup: {
    type: Object,
    default: () => { },
  },
  step: {
    type: Number,
    default: 0,
  },
  id: {
    type: String,
  },
  order: {
    type: Number,
  },
  BaseFieldsetLegend: {
    type: [String, Object],
    default: "",
  },
  visibility: {
    type: Object,
    default: () => ({})
  },
  type: {
    type: String,
    default: "",
  },
  dependsOn: {
    type: String,
    default: '',
  },
})



// Removed isFullWith ref - not needed

const componentMap = {
  GroupButtons: defineAsyncComponent(() => import("../../Groups/Buttons/GroupButtons.vue")),
  CompositeRadioButton: defineAsyncComponent(() => import("../../Composite/Buttons/CompositeRadioButton.vue")),
  CompositInput: defineAsyncComponent(() => import("../../Composite/inputs/CompositInput.vue")),
  CompositeStepperButton: defineAsyncComponent(() => import("../../Composite/Buttons/CompositeStepperButton.vue")),
  EmploymentSpecifics: defineAsyncComponent(() => import("../../widgets/EmploymentSpecifics/EmploymentSpecifics.vue")),
  HousingSpecifics: defineAsyncComponent(() => import("../../widgets/HousingSpecifics/HousingSpecifics.vue")),
  MortgageSpesefics: defineAsyncComponent(() => import("../../widgets/MortgageSpesefics/MortgageSpesefics.vue")),
  InformationBox: defineAsyncComponent(() => import("../../widgets/InformationBox/InformationBox.vue")),
};

const resolveComponent = (componentName) => {
  return componentMap[componentName] || null;
};

// Create a reactive object to store field types by their dependsOn target
const dependentFieldTypes = reactive({})



// Method to set the field type for a dependsOn target
const setDependentFieldType = (dependsOnId, fieldType) => {
  dependentFieldTypes[dependsOnId] = fieldType
  return '' // Return empty string so it doesn't show in template
}


// Method to check if a field should have fullwidth class
const shouldBeFullWidth = (fieldId) => {
  return dependentFieldTypes[fieldId] === 'fieldSubGroup'
}



//reactive object to hold references to elements in the baseGroup

const baseGroup = reactive({});


// Watch the entire baseGroup object for changes
//and remove empty divs that have no children not the bedst fix but it works for now
watch(baseGroup, async () => {
  await nextTick(); // Wait for DOM updates

  // Check each element in baseGroup
  Object.keys(baseGroup).forEach(fieldId => {
    const element = baseGroup[fieldId];

    if (element) {
      // Check if element has no children (you can use either condition)
      if (!element.hasChildNodes() || element.children.length === 0) {
        element.remove();
        delete baseGroup[fieldId];
      }
    }
  });
}, { flush: 'post', deep: true });
</script>

<template>
  <fieldset :id="id" :style="{ order }" class="group-component fieldgroup">
    <div class="main-field-wrapper">

      <template v-for="(field, index) in fieldgroup.fields" :key="index">

        <template v-if="!field?.visibility?.dependsOn && field.type !== 'widget'">
          <!--section fields-->

          <DynamicField v-if="resolveComponent(fieldgroup.properties?.component)"
            :component="resolveComponent(fieldgroup.properties?.component)" :field="field" :step="step"
            :fieldlable="field.properties?.label" />
        </template>

        <template v-if="!field?.visibility?.dependsOn && field.type == 'widget'">
          <!--section widget fields-->

          <component :is="resolveComponent(field.properties?.component)" :step="step"
            :fieldlable="field.properties?.label" :field="field" :order="getOrderFromWeight(field.weight)" />

        </template>


        <!--empty div to teleport nested section to-->

        <div v-if="field.id" :id="field.id + '_section_wrap'" :style="{ order: getOrderFromWeight(field.weight) + 1 }"
          :class="{
          }" :ref="(el) => (baseGroup[field.id] = el)">
        </div>

        <!--empty div to teleport fieldSubGroup (nested section fields)-->
        <div v-if="field.id !== undefined && shouldBeFullWidth(field.id)" :id="field.id + '_sub_wrap'"
          :style="{ order: getOrderFromWeight(field.weight) + 1 }" class="fullwidth">
        </div>

        <template v-if="field?.visibility?.dependsOn && field.type === 'fieldSubGroup'">

          <!--get fieldtype that gets teleported so singlefields get wraped in a fullwidth div ( shouldBeFullWidth )-->
          {{ setDependentFieldType(field.visibility.dependsOn, field.type) }}
          <teleport defer :to="`#${field?.visibility?.dependsOn}_sub_wrap`">
            <fieldset class="group-component fieldgroup teleported">
              <GroupDependOn _class="depend--On" :data="field" :dependsOn="field?.visibility?.dependsOn"
                :order="getOrderFromWeight(field.weight + 1)" :nested=true />
            </fieldset>
          </teleport>
        </template>


        <!--Nested fields-->
        <template v-if="field.fields">

          <template v-for="(nestedField, nestedFieldId) in field.fields" :key="nestedFieldId">

            <template v-if="!nestedField?.visibility?.dependsOn && field.type != 'widget'">

              <DynamicField :component="resolveComponent(nestedField.properties?.component)" :field="nestedField"
                :step="step" :fieldlable="nestedField.properties?.label" />
            </template>

            <template v-if="nestedField?.visibility?.dependsOn && nestedField.type === 'fieldSubGroup'">
              <GroupDependOn _class="depend--On" :data="nestedField" :dependsOn="nestedField?.visibility?.dependsOn"
                :order="getOrderFromWeight(nestedField.weight + 1)" :nested=true />
            </template>

          </template>
        </template>

        <div v-if="fieldgroup.fieldgroups" class="nested-fieldgroups">

          <div v-for="(nestedFieldgroup, nestedFieldgroupId) in fieldgroup.fieldgroups" :key="nestedFieldgroupId"
            class="nested-fieldgroup">
            <h5>Nested Fieldgroup: {{ nestedFieldgroup.properties?.label }}</h5>
          </div>
        </div>

      </template>
    </div>
  </fieldset>
</template>

<style scoped>
.fullwidth {
  width: 100%;
}

.noshow {
  display: none;
}
</style>
