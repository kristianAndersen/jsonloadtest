<script setup>
import { defineAsyncComponent, ref, computed, reactive, onMounted } from 'vue';
import DynamicField from '@/components/DynamicField.vue';
import BaseLabel from '@/components/Base/inputs/BaseLabel.vue';

const props = defineProps({
    field: {
        type: Object,
        required: true,
    },
    step: {
        type: Number,
        default: 0
    },
    order: {
        type: Number,
        default: 0
    },
    fieldlable: {
        type: [String, Object],
        default: ''
    },
});

const componentMap = {
    BaseButton: defineAsyncComponent(
        () => import('@/components/Base/Buttons/BaseButton.vue'),
    ),
    BaseInput: defineAsyncComponent(
        () => import('@/components/Base/inputs/BaseInput.vue'),
    ),
    CompositInput: defineAsyncComponent(
        () => import('@/components/Composite/inputs/CompositInput.vue'),
    ),
};

const resolveComponent = (componentName) => {
    if (componentMap[componentName]) {
        return componentMap[componentName];
    }
};

const emit = defineEmits(["update:modelValue"]);

const stepinput = reactive({});
const inputValue = ref("0");
const typeCheck = ref('');

const owerwriteClass_plus = 'stepper-button buttonPlus';
const owerwriteClass_minus = 'stepper-button buttonMinus';
const overwriteClass_input = 'stepper-input';

// Get input type from field properties
const getTypeCheck = () => {
    return typeCheck.value;
}

const setTypeCheck = (fields) => {
    typeCheck.value = fields.type;
}

const componentProps = computed(() => {
    const field = Object.values(props.field.fields || {})
        .find(field => field?.properties?.props);

    return field
        ? {
            type: field.properties.props.type,
            min: field.properties.props.min,
            max: field.properties.props.max,
            vmodel: field.properties.props.vmodel,
            mode: field.properties.props.mode,
            step: field.properties.props.step || 1, // Add step property
        }
        : {
            type: 'number',
            min: null,
            max: null,
            mode: 'numeric',
            step: 1
        }; // Provide defaults
});

// For numeric mode - start at 0
const numericValue = ref(0);

// Create displayValue computed property
const displayValue = computed(() => {
    if (componentProps.value?.mode === "numeric") {
        return componentProps.value?.formatter
            ? componentProps.value.formatter(numericValue.value)
            : numericValue.value.toString();
    }
    return numericValue.value.toString();
});

const increment = () => {
    console.log('Increment action triggered for ' + getTypeCheck());

    if (componentProps.value?.mode === "numeric") {
        // Get step value from componentProps, not numericValue
        const stepValue = componentProps.value?.step || 1;

        // Calculate new value
        const newValue = numericValue.value + stepValue;
        const validatedValue = validateNumericBounds(newValue);

        // Update the reactive value
        numericValue.value = validatedValue;

        // Update the input field directly
        updateInputField(validatedValue);

        // Emit the change
        emit("update:modelValue", validatedValue);
    }
}

const decrement = () => {
    console.log('Decrement action triggered for ' + getTypeCheck());

    if (componentProps.value?.mode === "numeric") {
        // Get step value from componentProps, not numericValue
        const stepValue = componentProps.value?.step || 1;

        // Calculate new value
        const newValue = numericValue.value - stepValue;
        const validatedValue = validateNumericBounds(newValue);

        // Update the reactive value
        numericValue.value = validatedValue;

        // Update the input field directly
        updateInputField(validatedValue);

        // Emit the change
        emit("update:modelValue", validatedValue);
    }
}

const updateInputField = (value) => {
    Object.keys(stepinput).forEach(fieldId => {
        const inputComponent = stepinput[fieldId];
        if (inputComponent && inputComponent.$el) {
            // If it's a component, you might need to access the input differently
            // This depends on how your BaseInput component is structured
            const inputEl = inputComponent.$el.querySelector('input') || inputComponent.$el;
            if (inputEl && inputEl.tagName === 'INPUT') {
                inputEl.value = value;
                // Trigger input event to ensure reactivity
                inputEl.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }
    });

    // Also update the display value
    inputValue.value = value.toString();
}

// Helper function to validate numeric min/max bounds
const validateNumericBounds = (value) => {
    let result = value;

    const props = componentProps.value;

    if (props?.min !== null && props?.min !== undefined && value < props.min) {
        result = props.min;
    }

    if (props?.max !== null && props?.max !== undefined && value > props.max) {
        result = props.max;
    }

    // Additional check for maxAllowedValue
    if (props?.maxAllowedValue !== null && props?.maxAllowedValue !== undefined && value > props.maxAllowedValue) {
        result = props.maxAllowedValue;
    }

    return result;
};

const buttonWasClicked = (data) => {
    switch (data.value) {
        case 'increment':
            increment();
            break;
        case 'decrement':
            decrement();
            break;
        default:
            console.warn('Unknown button action:', data.value);
    }
}

// Initialize the component
onMounted(() => {
    // Start at 0
    numericValue.value = 0;
    inputValue.value = "0";
    emit("update:modelValue", 0);
});
</script>

<template>
    <template v-for="(fields, index) in field.fields" :key="index">
        <template v-if="fields.name == 'current_Marital status'">
            <DynamicField :component="resolveComponent(fields.properties?.component)" :field="fields" :step="step"
                :fieldlable="fields.properties?.label" />
        </template>
    </template>

    <div class="stepper-input-container" :style="{ order }">
        <BaseLabel :label="field.properties?.label">
            <template #textlable></template>
        </BaseLabel>

        <div class="stepper-input-group general-width">
            <template v-for="(fields, index) in field.fields" :key="index">

                <template v-if="fields.name == 'step_plus' && fields.name != 'step_minus'">
                    <DynamicField v-if="resolveComponent(fields.properties.component)"
                        :component="resolveComponent(fields?.properties?.component)" :field="fields" :step="step"
                        :overwriteClass="owerwriteClass_plus" :value="fields.properties.value" :id="fields.id"
                        @button-clicked="buttonWasClicked" />
                </template>

                <template v-if="fields.properties.component == 'BaseInput'">
                    {{ setTypeCheck(fields) }}

                    <DynamicField v-if="resolveComponent(fields.properties.component)"
                        :component="resolveComponent(fields?.properties?.component)" :field="fields" :step="step"
                        :overwriteClass="overwriteClass_input" v-bind="componentProps" :value="displayValue"
                        :ref="(el) => (stepinput[fields.id] = el)" />
                </template>

                <template v-if="fields.name == 'step_minus'">
                    <DynamicField v-if="resolveComponent(fields.properties.component)"
                        :component="resolveComponent(fields?.properties?.component)" :field="fields" :step="step"
                        :overwriteClass="owerwriteClass_minus" :value="fields.properties.value" :id="fields.id"
                        @button-clicked="buttonWasClicked" />
                </template>

            </template>
        </div>
    </div>
</template>

<style scoped>
.inputField {
    border-radius: 0 !important;
}
</style>