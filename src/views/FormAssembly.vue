<template>

  <!--count the numbers of steps -->
  <template v-if="steps && Object.keys(steps).length >= 2">
    <Teleport :to="'#teleport-stepsInForm'">
      <StepsInForm :stepsNumber="Object.keys(steps).length" />
    </Teleport>
  </template>


  <div v-for="(step, stepId) in steps" :key="stepId" class="step-content">




    <h2>Step: {{ localized(step.properties?.label) }}</h2>

    <div v-for="(section, sectionId) in step.sections" :key="sectionId" class="sections">


      <h3>Section: {{ section.type }} -- {{ section.properties?.component }} {{ localized(section.properties?.label)
      }}</h3>

      <!--  <p v-if="section?.visibility" class="nestedSection"><strong>{{ section?.visibility }}</strong></p>-->

      <template v-if="!section?.visibility?.dependsOn">
        <BaseGroup v-for="(fieldgroup, fieldgroupId) in section.fieldgroups" :key="fieldgroupId"
          :BaseFieldsetLegend="fieldgroup.properties?.label" :fieldgroup="fieldgroup"
          :order="getOrderFromWeight(fieldgroup.weight)" :visibility="section?.visibility"> </BaseGroup>
      </template>

      <!-- DependsOn section / nested section -->
      <template v-if="section?.visibility?.dependsOn">
        <teleport defer :to="`#${section?.visibility?.dependsOn}_wrap`">
          <GroupDependOn _class="depend--On" :data="section.fieldgroups" :dependsOn="section?.visibility?.dependsOn"
            :order="getOrderFromWeight(section.fieldgroups.weight)" :step="step" />
        </teleport>
      </template>



      <!--  <h4>Fieldgroup: {{ localized(fieldgroup.properties?.label) }}</h4>-->


      <!--
          <div v-if="field.fields" class="nested-fields">
            <h6>Nested Fields:</h6>
            <div v-for="(nestedField, nestedFieldId) in field.fields" :key="nestedFieldId" class="nested-field">
              <p>{{ nestedField.name }} ({{ nestedField.type }})</p>
              {{ localized(nestedField.properties?.label) }}
            </div>
          </div>
        </div>


        <div v-if="fieldgroup.fieldgroups" class="nested-fieldgroups">
          <div v-for="(nestedFieldgroup, nestedFieldgroupId) in fieldgroup.fieldgroups" :key="nestedFieldgroupId"
            class="nested-fieldgroup">
            <h5>Nested Fieldgroup: {{ nestedFieldgroup.properties?.label }}</h5>
            {{ nestedFieldgroup }}
          </div>
        </div>-->



    </div>
  </div>


</template>
<script setup>

import { computed } from 'vue'
import { localized } from "@/composable/useLocalizedText.js";

import GroupDependOn from "../components/Groups/Containers/GroupDependOn.vue";
import { useDataStore } from "@/stores/FormDataStore";
import BaseGroup from "@/components/Base/containers/BaseGroup.vue";
import StepsInForm from "@/components/widgets/StepsInForm.vue";
const dataStore = useDataStore();

import { useWeightToOrder } from "@/composable/useWeightToOrder";
const { getOrderFromWeight } = useWeightToOrder();

const steps = computed(() => dataStore.formJsonData.steps || {});


defineProps({
  step: {
    type: Number,
    required: true
  }
})



</script>
<style scoped>
.sections {
  margin-top: 2rem;
  margin-bottom: 2rem;

  background-color: aqua;
}

.nestedSection {
  background-color: lightcoral;
}
</style>
