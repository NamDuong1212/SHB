<template>
    <div class="grid grid-cols-3 gap-4">
        <div v-for="(item, index) in assetLines" :key="index" class="px-3">
            <div class="field mb-3">
                <div class="flex">
                    <div class="flex-1">
                        <label :for="`field-${index}`" class="block mb-1">{{ `Tên trường số ${index + 1}*` }}</label>
                        <InputGroup>
                            <InputText v-model="item.fieldName" readonly class="w-full" />
                            <MultiSelect v-model="item.fieldInput" :options="item.options" optionLabel="name" optionValue="id" filter placeholder="Chọn" :maxSelectedLabels="1" />
                        </InputGroup>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import InputText from 'primevue/inputtext';
import { ref } from 'vue';

const op = ref();

defineProps({
    assetLines: {
        type: Array,
        default: () => []
    }
});

// Update fieldType array value
const updateFieldType = (item, code, isChecked) => {
    // Ensure fieldInput is an array
    if (!Array.isArray(item.fieldInput)) {
        item.fieldInput = [];
    }

    if (isChecked) {
        // Add to array if not already present
        if (!item.fieldInput.includes(code)) {
            item.fieldInput.push(code);
        }
    } else {
        // Remove from array if present
        const index = item.fieldInput.indexOf(code);
        if (index !== -1) {
            item.fieldInput.splice(index, 1);
        }
    }
};
</script>

<style scoped>
.field-checkbox {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
}
</style>
