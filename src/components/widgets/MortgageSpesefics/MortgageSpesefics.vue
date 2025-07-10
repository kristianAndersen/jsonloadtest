<template>

    <div class="group-component-wrap" :style="{ order: order }">


        <div v-for="item in addedComponents" :key="item.id" class="group-component loancredit"
            :style="{ order: item._order }">
            <div class="loancredit-header">{{ localized(item.label) }} <button @click="removeComponent(item.id)"
                    class="remove-btn">Remove</button></div>
            <div class="main-field-wrapper">

                <template v-for="(value, key) in field.fields" :key="key">

                    <DynamicField :component="resolveComponent(value.component)" :field="value" :step="step"
                        :ref="(el) => (FieldComponent[value.id] = el)" />
                </template>
            </div>
        </div>




    </div>
</template>

<script setup>
import { watch, ref, defineAsyncComponent } from 'vue'
import { localized } from "@/composable/useLocalizedText.js";
import DynamicField from "../../DynamicField.vue";

import { useButtonState } from '@/composable/useButtonState'
const { buttonData } = useButtonState()
const { buttonLable } = useButtonState()

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

const FieldComponent = ref({});

const componentMap = {
    GroupButtons: defineAsyncComponent(() => import("../../Groups/Buttons/GroupButtons.vue")),
    CompositeRadioButton: defineAsyncComponent(() => import("../../Composite/Buttons/CompositeRadioButton.vue")),
    CompositInput: defineAsyncComponent(() => import("../../Composite/inputs/CompositInput.vue")),
};

const resolveComponent = (componentName) => {
    return componentMap[componentName] || null;
};

// Array to store added components
const addedComponents = ref([])

// Counter for unique IDs
const componentCounter = ref(0)
const orderCounter = ref(100000)
// Function to add a new component instance
const addNewComponent = (data, label) => {
    const newComponent = {
        id: `component_${componentCounter.value++}`,
        _order: `${orderCounter.value--}`, // Use the counter for order
        data: data,
        label: label,
        timestamp: Date.now()
    }
    addedComponents.value.push(newComponent)
}

// Function to remove a component instance by ID
const removeComponent = (componentId) => {
    const index = addedComponents.value.findIndex(item => item.id === componentId)
    if (index !== -1) {
        addedComponents.value.splice(index, 1)
    }
}

// Watch for button clicks and add new components
watch([buttonData, buttonLable], ([newData, newLabel]) => {
    if (newData && newLabel) {
        console.log('Adding new component for button:', newData, newLabel)
        addNewComponent(newData, newLabel)
    }
})
</script>-->