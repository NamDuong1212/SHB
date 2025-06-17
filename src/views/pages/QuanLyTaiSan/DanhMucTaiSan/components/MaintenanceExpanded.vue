<template>
    <div class="flex flex-col gap-4">
        <!-- Task List Section -->
        <div class="border rounded-lg shadow-sm">
            <div class="bg-gray-50 p-3 flex justify-between items-center border-b">
                <h4 class="text-lg font-medium m-0">Danh sách công việc</h4>
                <div class="flex gap-2">
                    <Button size="small" icon="pi pi-plus" @click="$emit('addTask')" />
                </div>
            </div>
            <div class="p-3 flex items-center">
                <DataTable :value="taskLists" class="p-datatable-sm w-full" :reorderableColumns="true" @rowReorder="moveTask" dataKey="lineIndex">
                    <Column rowReorder headerStyle="width: 3rem" :reorderableColumn="false" />
                    <Column field="detailWorkName " header="Công việc">
                        <template #body="{ data }">
                            <InputText v-model="data.detailWorkName" class="w-full" placeholder="Nhập tên công việc" size="small" />
                        </template>
                    </Column>
                    <Column field="orgStrctId" header="Bộ phận">
                        <template #body="{ data }">
                            <TreeSelect v-model="data.orgStrctId" :options="optionsOrganizationalStructureTree" size="small" optionLabel="label" class="w-full" placeholder="Chọn bộ phận" />
                        </template>
                    </Column>
                    <Column field="note" header="Ghi chú">
                        <template #body="{ data }">
                            <InputText v-model="data.note" class="w-full" placeholder="Nhập ghi chú" size="small" />
                        </template>
                    </Column>
                    <Column field="workTaskAttachment" header="Đính kèm">
                        <template #body="{ data, index }">
                            <div class="flex justify-center">
                                <Button
                                    :icon="data.workTaskAttachment?.fileName ? 'pi pi-file' : 'pi pi-paperclip'"
                                    v-tooltip="data.workTaskAttachment?.fileName"
                                    rounded
                                    text
                                    @click="triggerFileInput(index)"
                                    :class="{ 'p-button-info': data.workTaskAttachment?.fileName }"
                                />
                                <input type="file" :ref="(el) => (fileInputs[index] = el)" class="hidden" @change="handleFileUpload($event, data)" accept="image/*,.doc,.docx,.pdf,.xls,.xlsx" />
                            </div>
                        </template>
                    </Column>
                    <Column field="action" header="Hành động">
                        <template #body="{ index }">
                            <Button icon="pi pi-trash" severity="danger" text rounded @click="$emit('deleteTask', index)" />
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>

        <!-- Spare Parts Section -->
        <div class="border rounded-lg shadow-sm">
            <div class="bg-gray-50 p-3 flex justify-between items-center border-b">
                <h4 class="text-lg font-medium m-0">Phụ tùng, vật tư</h4>
                <Button size="small" icon="pi pi-plus" @click="$emit('addSparePartMaterial')" />
            </div>
            <div class="p-3">
                <DataTable :value="sparePartMaterials" class="p-datatable-sm">
                    <Column field="index" header="#">
                        <template #body="{ index }">
                            {{ index + 1 }}
                        </template>
                    </Column>
                    <Column field="classify" header="Phân loại">
                        <template #body="{ data }">
                            <Select size="small" v-model="data.classify" :options="classifyOptions" class="w-full" placeholder="Chọn phân loại" />
                        </template>
                    </Column>
                    <Column field="materialCode" header="Mã vật tư">
                        <template #body="{ data }">
                            <Select size="small" v-model="data.itemId" @update:model-value="getItem($event, data)" :options="optionItem" optionLabel="itemCode" optionValue="id" class="w-full" placeholder="Nhập mã vật tư" />
                        </template>
                    </Column>
                    <Column field="itemName" header="Tên vật tư">
                        <template #body="{ data }">
                            {{ data.item?.itemName }}
                        </template>
                    </Column>
                    <Column field="unitOfMeasureId" header="Đơn vị tính">
                        <template #body="{ data }">
                            <Select disabled size="small" v-model="data.unitOfMeasureId" :options="optionsUnitOfMeasure" optionLabel="unitOfMeasureName" optionValue="id" class="w-full" placeholder="Chọn đơn vị tính" />
                        </template>
                    </Column>
                    <Column field="quantity" header="Số lượng">
                        <template #body="{ data }">
                            <InputNumber size="small" v-model="data.quantity" class="w-full" placeholder="Nhập số lượng" />
                        </template>
                    </Column>
                    <Column field="warehouseId" header="Kho">
                        <template #body="{ data }">
                            <Select size="small" v-model="data.warehouseId" :options="optionsWareHouse" optionLabel="warehouseName" optionValue="id" class="w-full" placeholder="Chọn kho" />
                        </template>
                    </Column>
                    <Column field="isRequired" header="Bắt buộc">
                        <template #body="{ data }">
                            <div class="flex justify-center">
                                <ToggleSwitch size="small" v-model="data.isRequired" />
                            </div>
                        </template>
                    </Column>
                    <Column field="action" header="Hành động">
                        <template #body="{ index }">
                            <Button icon="pi pi-trash" severity="danger" text rounded @click="$emit('deleteSparePartMaterial', index)" />
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<script setup>
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import { computed, ref } from 'vue';

const props = defineProps({
    taskLists: {
        type: Array,
        default: () => []
    },
    sparePartMaterials: {
        type: Array,
        default: () => []
    },
    optionsOrganizationalStructure: {
        type: Array,
        default: () => []
    },
    optionsWareHouse: {
        type: Array,
        default: () => []
    },
    optionsUnitOfMeasure: {
        type: Array,
        default: () => []
    },
    optionItem: {
        type: Array,
        default: () => []
    }
});

const emit = defineEmits(['addTask', 'deleteTask', 'addSparePartMaterial', 'deleteSparePartMaterial', 'moveTask', 'uploadFile']);
const fileInputs = ref([]);
const classifyOptions = ref(['Cụm lắp ráp', 'Phụ tùng/vật tư']);

// Computed for task selection
const hasSelectedTask = computed(() => {
    return props.taskLists.some((task) => task.selected);
});
const optionsOrganizationalStructureTree = computed(() => {
    const mapNode = (node, parentKey = '') => {
        return {
            key: node.id,
            label: node.orgStrtName,
            data: node.orgStrtCode,
            children: node.children?.map((child) => mapNode(child)) || []
        };
    };

    return props.optionsOrganizationalStructure.map((node) => mapNode(node));
});
// Get the first selected task index
const getSelectedTaskIndex = () => {
    const index = props.taskLists.findIndex((task) => task.selected);
    return index >= 0 ? index : null;
};

// Trigger file input click
const triggerFileInput = (index) => {
    if (fileInputs.value[index]) {
        fileInputs.value[index].click();
    }
};

// Handle file upload
const handleFileUpload = (event, data) => {
    emit('uploadFile', event, data, true);
};

const moveTask = (event) => {
    emit('moveTask', event);
};
// Truncate file name if too long
const truncateFileName = (fileName) => {
    if (!fileName) return '';
    return fileName.length > 15 ? fileName.substring(0, 12) + '...' : fileName;
};

const getItem = (event, data) => {
    const item = props.optionItem.find((el) => el.id == event);
    data.item = item;
    data.unitOfMeasureId = item.unitGroupId;
};
</script>

<style scoped>
.hidden {
    display: none;
}
</style>
