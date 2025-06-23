<script setup>

import { defineAsyncComponent } from "vue";
import { localized } from "@/composable/useLocalizedText.js";
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
})




const componentMap = {
  GroupButtons: defineAsyncComponent(() => import("../../Groups/buttons/GroupButtons.vue")),
  CompositeRadioButton: defineAsyncComponent(() => import("../../Composite/Buttons/CompositeRadioButton.vue")),
};

const resolveComponent = (componentName) => {
  return componentMap[componentName] || null;
};

</script>

<template>


  <fieldset :id="id" :style="{ order }" class="group-component">
    <!-- Main fields -->
    <div class="main-field-wrapper">

      <legend v-if="fieldgroup?.properties?.label" class="group-lable">

        {{ localized(fieldgroup.properties?.label) }}
      </legend>

      <div v-for="(field, index) in fieldgroup.fields" :key="index"
        class="fieldgroup dependency-fieldgroup-wrapper group-component"
        :style="{ order: getOrderFromWeight(field.weight) }" :id="field.id">



        <!--   <p><strong>Field:</strong> {{ field.name }} ({{ field.type }}) {{ field.weight }}</p>
        <p><em>{{ field.properties?.label }}</em></p>-->
        <template v-if="!field?.visibility?.dependsOn">
          <DynamicField :component="resolveComponent(fieldgroup.properties?.component)" :field="field" :step="step"
            :fieldlable="field.properties?.label" />
        </template>


        <template v-if="field?.visibility?.dependsOn">

          <teleport defer :to="`#${field?.visibility?.dependsOn}_wrap`">
            <GroupDependOn _class="depend--On" :data="field.fields" :dependsOn="field?.visibility?.dependsOn"
              :order="getOrderFromWeight(field.weight + 1)" />
          </teleport>


        </template>


        <!--dependsOn section teleports here-->
        <div :id="field.id + '_wrap'" :style="{ order: getOrderFromWeight(field.weight) + 1 }"></div>

        <div v-if="field.fields && !field?.visibility?.dependsOn" class="nested-fields">
          <h6>Nested Fields:</h6>
          <div v-for="(nestedField, nestedFieldId) in field.fields" :key="nestedFieldId" class="nested-field">
            <p>{{ nestedField.name }} ({{ nestedField.type }})</p>
          </div>
        </div>


        <div v-if="fieldgroup.fieldgroups" class="nested-fieldgroups">
          <div v-for="(nestedFieldgroup, nestedFieldgroupId) in fieldgroup.fieldgroups" :key="nestedFieldgroupId"
            class="nested-fieldgroup">
            <h5>Nested Fieldgroup: {{ nestedFieldgroup.properties?.label }}</h5>
          </div>
        </div>

      </div>
    </div>

  </fieldset>






</template>
<style scoped></style>
