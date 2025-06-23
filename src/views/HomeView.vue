<script setup>


import { ref } from 'vue'

import formData from '@/assets/formStepsdata.json'

const steps = ref(formData.steps)
/*

const step = ref(null)
function processFieldgroups(fieldgroups, indent = '    ') {
  Object.entries(fieldgroups || {}).forEach(([fieldgroupId, fieldgroup]) => {
    console.log(`-----------component: ${fieldgroup.component}`)
    console.log(`${indent}Fieldgroup ${fieldgroupId}:`, fieldgroup.properties?.label)

    // Process fields in this fieldgroup
    Object.entries(fieldgroup.fields || {}).forEach(([fieldId, field]) => {
      console.log(`${indent}  Field ${fieldId}:`, field.name, field.type)

      console.log(`${indent}    Label:`, field.properties?.label)

      // Recursively process nested fieldgroups within fields
      if (field.fieldgroups) {
        processFieldgroups(field.fieldgroups, indent + '    ')
      }

      // Process nested fields (fieldSubGroup type)
      if (field.fields) {
        console.log(`${indent}    Nested fields:`)
        Object.entries(field.fields).forEach(([nestedFieldId, nestedField]) => {
          console.log(`${indent}      Field ${nestedFieldId}:`, nestedField.name, nestedField.type)
        })
      }
    })

    // Process nested fieldgroups at fieldgroup level
    if (fieldgroup.fieldgroups) {
      processFieldgroups(fieldgroup.fieldgroups, indent + '  ')
    }
  })
}

// Main iteration
Object.entries(formData.steps).forEach(([stepId, step]) => {
  console.log(`################ Step `, step.properties.label, stepId)
  step.value = step.properties.label;

  Object.entries(step.sections || {}).forEach(([sectionId, section]) => {
    console.log(`  Section ${sectionId}:`, section.type)
    processFieldgroups(section.fieldgroups)
  })
})

*/

</script>



<template>
  <main>
    <div v-for="(step, stepId) in steps" :key="stepId" class="step">
      <h2>Step: {{ step.properties.label }}</h2>

      <div v-for="(section, sectionId) in step.sections" :key="sectionId" class="section">
        <h3>Section: {{ section.type }} -- {{ section.properties?.component }} {{ section.properties?.label }}</h3>

        <div v-for="(fieldgroup, fieldgroupId) in section.fieldgroups" :key="fieldgroupId" class="fieldgroup">
          <h4>Fieldgroup: {{ fieldgroup.properties?.label }}</h4>

          <div v-for="(field, fieldId) in fieldgroup.fields" :key="fieldId" class="field">
            <p><strong>Field:</strong> {{ field.name }} ({{ field.type }})</p>
            <p><em>{{ field.properties?.label }}</em></p>

            <!-- Nested fields -->
            <div v-if="field.fields" class="nested-fields">
              <h6>Nested Fields:</h6>
              <div v-for="(nestedField, nestedFieldId) in field.fields" :key="nestedFieldId" class="nested-field">
                <p>{{ nestedField.name }} ({{ nestedField.type }})</p>
              </div>
            </div>
          </div>

          <!-- Nested fieldgroups -->
          <div v-if="fieldgroup.fieldgroups" class="nested-fieldgroups">
            <div v-for="(nestedFieldgroup, nestedFieldgroupId) in fieldgroup.fieldgroups" :key="nestedFieldgroupId"
              class="nested-fieldgroup">
              <h5>Nested Fieldgroup: {{ nestedFieldgroup.properties?.label }}</h5>
              <!-- Continue nesting as needed -->
            </div>
          </div>

        </div>
      </div>
    </div>
  </main>
</template>
<style scoped>
.step {
  margin: 20px 0;
  padding: 15px;
  border: 2px solid #333;
}

.section {
  margin: 15px 0;
  padding: 10px;
  border: 1px solid #666;
}

.fieldgroup {
  margin: 10px 0;
  padding: 8px;
  border: 1px solid #999;
}

.field {
  margin: 5px 0;
  padding: 5px;
  background: #f5f5f5;
  color: #333;
}

.nested-fields,
.nested-fieldgroups {
  margin-left: 20px;
}
</style>
