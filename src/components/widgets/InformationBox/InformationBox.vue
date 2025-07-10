<template>




    <div class="infoboxwrap">


        <BaseLabel :label="field.properties?.label">
            <template #textlable></template>
        </BaseLabel>


        <span v-html="processedText(field.properties.text)"></span>


    </div>
</template>
<script setup>

//widgets may need to use the context to accsess the translation
import { useLanguage } from "../../../composable/useLanguage";
const { t } = useLanguage();

import BaseLabel from "@/components/Base/inputs/BaseLabel.vue";
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

const processedText = (text) => {
    return t(text).replace(/\{\{(.*?)\}\}/g, '<strong>$1</strong>')

}


</script>