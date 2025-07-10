<template>

  <!--count the numbers of steps -->
  <template v-if="steps && Object.keys(steps).length >= 2">
    <Teleport :to="'#teleport-stepsInForm'">
      <StepsInForm :stepsNumber="Object.keys(steps).length" />
    </Teleport>
  </template>

  <template v-for="(step, stepId) in steps" :key="stepId">
    <div class="step-content">
      <!-- <h2>Step: {{ localized(step.properties?.label) }}</h2>-->

      <template v-for="(section, sectionId) in step.sections" :key="sectionId">

        <!-- Only render the sections div when content will stay in it -->
        <div v-if="!section?.visibility?.dependsOn && section.type != 'widget'" class="sections">
          <section class="lala section">
            <!--<h3>Section: {{ section.type }} -- {{ section.properties?.component }} -->
            <h3>{{
              localized(section.properties?.label)
            }}</h3>
            <div class="fieldgroups-container">

              <BaseGroup v-for="(fieldgroup, fieldgroupId) in section.fieldgroups" :key="fieldgroupId"
                :BaseFieldsetLegend="fieldgroup.properties?.label" :fieldgroup="fieldgroup"
                :order="getOrderFromWeight(fieldgroup.weight)" :dependsOn="section?.visibility?.dependsOn">
              </BaseGroup>
            </div>
          </section>
        </div>





        <!-- Handle section teleported content separately -->
        <teleport v-if="section?.visibility?.dependsOn" defer :to="`#${section?.visibility?.dependsOn}_section_wrap`">

          <GroupDependOn _class="depend--On" :data="section.fieldgroups" :dependsOn="section?.visibility?.dependsOn"
            :order="getOrderFromWeight(section.fieldgroups.weight)" :step="step" :type="section.type" />
        </teleport>

        <!-- Widgets -->
        <template v-if="section.type == 'widget' && section.properties?.component === 'LoanSummary'">

          <Teleport :to="'#LoanSummary-target'">

            <component :is="resolveComponent(section.properties?.component)"
              :step="Number(step.properties && step.properties?.label ? step.properties?.label : 0,)"
              :sectionID="section.sectionId" :label="section.properties?.label" :text="step.properties?.text"
              :properties="section.properties" :fg="section" />
          </Teleport>
        </template>


        <template
          v-if="section.type == 'widget' && section.properties?.component != 'LoanSummary' && section.properties?.component != 'EmploymentSpecifics'">

          <component :is="resolveComponent(section.properties?.component)"
            :step="Number(step.properties && step.properties?.label ? step.properties?.label : 0,)"
            :sectionID="section.sectionId" :label="section.properties?.label" :properties="section.properties"
            :fg="section" :order="getOrderFromWeight(section.weight)" />

        </template>


      </template>
    </div>
  </template>


</template>
<script setup>

import { computed, defineAsyncComponent } from 'vue'
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

const componentMap = {
  PaginationNext: defineAsyncComponent(
    () => import("../components/widgets/PaginationNext/PaginationNext.vue"),
  ),
  TermsAndConditions: defineAsyncComponent(
    () => import("../components/widgets/TermsAndConditions/TermsAndConditions.vue"),
  ),
  LoanSummary: defineAsyncComponent(
    () => import("../components/widgets/LoanSummary/LoanSummary.vue"),
  ),
  CompositeStepperButton: defineAsyncComponent(
    () => import("../components/Composite/Buttons/CompositeStepperButton.vue"),
  ),

};

const resolveComponent = (componentName) => {
  if (componentMap[componentName]) {
    return componentMap[componentName];
  }
};

</script>
