<script setup>
//import CompositInput from '@/components/Composite/inputs/CompositInput.vue';

import { watch, ref, defineAsyncComponent } from 'vue'
import { useButtonState } from '@/composable/useButtonState'

import DynamicField from "../../DynamicField.vue";

defineProps({
    field: {
        type: Object,
        required: true
    },
    order: {
        type: Number,
        required: true
    },
    step: {
        type: Number,
        required: true
    }
})
const { buttonData } = useButtonState()
const FieldComponent = ref({});


const componentMap = {
    GroupButtons: defineAsyncComponent(() => import("../../Groups/Buttons/GroupButtons.vue")),
    CompositeRadioButton: defineAsyncComponent(() => import("../../Composite/Buttons/CompositeRadioButton.vue")),
    CompositInput: defineAsyncComponent(() => import("../../Composite/inputs/CompositInput.vue")),
    //  EmploymentSpecifics: defineAsyncComponent(() => import("../../widgets/EmploymentSpecifics/EmploymentSpecifics.vue")),
};

const resolveComponent = (componentName) => {
    return componentMap[componentName] || null;
};


const btnClicked = ref('')
watch(buttonData, (newData) => {
    if (newData) {
        console.log('Button state changed:', newData)
        // Handle the data
        btnClicked.value = newData
    }
})

const shouldShowField = (val) => {
    // console.log('Checking if field should be shown:', val, 'type:', typeof val, 'btnClicked:', btnClicked.value)

    // Don't show anything if no button has been clicked yet
    if (!btnClicked.value || btnClicked.value === '') {
        return false
    }

    // Convert val to string if it's not already a string iyt is not it is an array
    const stringVal = String(val || '')

    // Check if the field value contains the clicked button value
    return stringVal.match(new RegExp(`\\b${btnClicked.value}\\b`))
}

</script>

<template>
    <div class="group-component" :style="{ order: order }">

        <div class="main-field-wrapper">

            <template v-for="(value, key) in field.fields" :key="key">

                <template v-if="shouldShowField(value.value)">

                    <DynamicField :component="resolveComponent(value.component)" :field="value" :step="step"
                        :ref="(el) => (FieldComponent[value.id] = el)" />
                </template>

            </template>
        </div>






        <!-- {{ btnClicked }}.  TODO: make a store. or something that tracks if a person is married-->
        <template v-if="btnClicked === 'parttime'">
            Spouse's monthly income before taxes (if married)
        </template>
        <template v-if="btnClicked === 'selfemployed'">
            Spouse's monthly income before taxes (if married)
        </template>
        <template v-if="btnClicked === 'fulltime'">
            Spouse's monthly income before taxes (if married)
        </template>
        <template v-if="btnClicked === 'pensioner'">
            Spouse's monthly income before taxes (if married)
        </template>
        <template v-if="btnClicked === 'temporary'">
            Spouse's monthly income before taxes (if married)

        </template>
        <template v-if="btnClicked === 'student'">
            Spouse's monthly income before taxes (if married)
        </template>
        <template v-if="btnClicked === 'unemployed'">
            Spouse's monthly income before taxes (if married)
        </template>
        <template v-if="btnClicked === 'other'">
            Spouse's monthly income before taxes (if married)
        </template>
        <!--
      

        Do you have any other income?
        -->
    </div>
</template>