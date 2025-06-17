<template>
    <div class="flex flex-col">
        <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-semibold">Phân loại <span class="text-red-500">*</span></h3>
            <div class="flex items-end gap-2">
                <Select size="small" v-model="maintenanceType" :options="maintenanceTypes" class="w-64" placeholder="Loại bảo trì" @change="onTypeChange" />
                <Button size="small" v-if="maintenanceType !== 'Thông số hoạt động'" label="Thêm" icon="pi pi-plus" @click="addAssetLines" />
            </div>
        </div>

        <DataTable v-if="maintenanceType" :value="maintenance.assetMaintenanceLines" class="p-datatable-sm" v-model:expandedRows="expandedRows">
            <Column expander style="width: 5rem" />
            <Column field="criterion" header="Tiêu chí">
                <template #body="{ data }">
                    {{ data.criterion === 'TS' ? 'Thông số' : 'Thời gian' }}
                </template>
            </Column>
            <Column field="frequency" header="Tần suất/Thông số">
                <template #body="{ data }">
                    <Select size="small" v-if="data.criterion !== 'TS'" v-model="data.frequency" :options="frequencies" class="w-full" placeholder="Chọn tần suất" @change="data.repeatDate = []" />
                    <InputText size="small" v-else v-model="data.frequency" class="w-full" readonly />
                </template>
            </Column>
            <Column field="repeatDate" header="Lặp lại">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <template v-if="data.criterion === 'TS'">
                            <InputNumber size="small" v-model="data.repeatCount" :suffix="data.repeatType" />
                        </template>
                        <template v-else>
                            <TreeSelect v-if="data.frequency === 'QL_Hàng quý'" v-model="data.repeatDate" :options="AssetDataHelper.simpleQuy" selectionMode="checkbox" size="small" placeholder="Chọn quý" class="w-full" :maxSelectedLabels="3" />
                            <TreeSelect
                                v-else-if="data.frequency === 'WL_Hàng tuần'"
                                v-model="data.repeatDate"
                                :options="AssetDataHelper.simpleTuan"
                                selectionMode="checkbox"
                                size="small"
                                placeholder="Chọn ngày"
                                :maxSelectedLabels="3"
                                class="w-full"
                            />
                            <TreeSelect
                                v-else-if="data.frequency === 'ML_Hàng tháng'"
                                v-model="data.repeatDate"
                                size="small"
                                :options="AssetDataHelper.simpleThang"
                                selectionMode="checkbox"
                                :maxSelectedLabels="3"
                                placeholder="Chọn ngày"
                                class="w-full"
                            />
                            <TreeSelect
                                size="small"
                                v-else-if="data.frequency === 'YL_Hàng năm'"
                                v-model="data.repeatDate"
                                :options="AssetDataHelper.simpleNam"
                                selectionMode="checkbox"
                                :maxSelectedLabels="3"
                                placeholder="Chọn tháng"
                                class="w-full"
                            />
                            <InputText size="small" readonly placeholder="Hàng ngày" v-else></InputText>
                        </template>
                    </div>
                </template>
            </Column>
            <Column field="maintenanceCode" header="Mã bảo trì">
                <template #body="{ data }">
                    <div>
                        <InputText size="small" v-model="data.maintenanceCode" placeholder="Nhập mã bảo trì" class="w-full" />
                    </div>
                </template>
            </Column>
            <Column field="partner" header="Đối tác">
                <template #body="{ data }">
                    <Select size="small" v-model="data.partner" :options="partnerOptions" optionLabel="label" optionValue="value" class="w-full" placeholder="Chọn đối tác" :disabled="!!data.id" @change="resetTasksAndMaterials(data)" />
                </template>
            </Column>
            <Column field="autoSchedule" header="Lịch tự động">
                <template #body="{ data }">
                    <InputGroup>
                        <InputNumber v-model="data.autoSchedule" prefix="Trước: " size="small" />
                        <Select v-if="data.criterion !== 'TS'" v-model="data.autoScheduleType" :options="timeUnitOptions" class="max-w-28" size="small" />
                    </InputGroup>
                </template>
            </Column>
            <Column field="action" header="Hành động">
                <template #body="{ data, index }">
                    <Button icon="pi pi-trash" text rounded severity="danger" @click="deleteMaintenanceLine(index)" />
                </template>
            </Column>
            <template #expansion="{ data }">
                <div class="p-3" v-if="data.partner === 'NB'">
                    <MaintenanceExpanded
                        :taskLists="data.taskLists"
                        :sparePartMaterials="data.sparePartMaterials"
                        :optionsOrganizationalStructure="optionsOrganizationalStructure"
                        :optionsWareHouse="optionsWareHouse"
                        :optionsUnitOfMeasure="optionsUnitOfMeasure"
                        :option-item="optionItem"
                        @addTask="addTask($event, data)"
                        @deleteTask="deleteTask($event, data)"
                        @addSparePartMaterial="addSparePartMaterial($event, data)"
                        @deleteSparePartMaterial="deleteSparePartMaterial($event, data)"
                        @moveTask="moveTask($event, data)"
                        @uploadFile="handleFileUpload"
                    />
                </div>
            </template>
        </DataTable>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import AssetDataHelper from '../AssetDataHelper';
import MaintenanceExpanded from './MaintenanceExpanded.vue';

const props = defineProps({
    maintenance: {
        type: Object,
        required: true
    },
    deviceConfig: {
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

const emit = defineEmits(['updateMaintenance', 'getAssetMaintenanceLines', 'uploadFile']);

const selectedDateKeys = ref({});
const expandedRows = ref([]);
// Computed properties
const maintenanceType = computed({
    get: () => props.maintenance.type,
    set: (val) => {
        emit('updateMaintenance', { ...props.maintenance, type: val });
    }
});

// Options
const maintenanceTypes = ref(['Thời gian', 'Thông số hoạt động', 'Thời gian & Thông số']);
const frequencies = ref(['DL_Hàng ngày', 'WL_Hàng tuần', 'ML_Hàng tháng', 'QL_Hàng quý', 'YL_Hàng năm']);
const partnerOptions = ref([
    { label: 'Nội bộ', value: 'NB' },
    { label: 'Thuê ngoài', value: 'TN' }
]);
const timeUnitOptions = ref(['Giờ', 'Ngày', 'Tuần']);

// Methods
const onTypeChange = (event) => {
    emit('getAssetMaintenanceLines', event.value);
};

const addAssetLines = () => {
    const lines = [...(props.maintenance.assetMaintenanceLines || [])];
    lines.push({
        criterion: '',
        frequency: '',
        repeatDate: [],
        partner: '',
        repeatCount: 0,
        maintenanceCode: '',
        autoSchedule: 0,
        autoScheduleType: '',
        taskLists: [],
        sparePartMaterials: [],
        expanded: false
    });

    emit('updateMaintenance', {
        ...props.maintenance,
        assetMaintenanceLines: lines
    });
};

const deleteMaintenanceLine = (index) => {
    const lines = [...props.maintenance.assetMaintenanceLines];
    lines.splice(index, 1);

    emit('updateMaintenance', {
        ...props.maintenance,
        assetMaintenanceLines: lines
    });
};

const resetTasksAndMaterials = (data) => {
    data.taskLists = [];
    data.sparePartMaterials = [];
    data.expanded = false;
};

// Task management
const addTask = (event, data) => {
    if (!data.taskLists) {
        data.taskLists = [];
    }

    data.taskLists.push({
        selected: false,
        lineIndex: data.taskLists.length,
        detailWorkName: '',
        note: '',
        orgStrctId: null,
        status: '',
        workTaskAttachment: {}
    });
};

const deleteTask = (index, data) => {
    data.taskLists.splice(index, 1);
    // Update lineIndex values
    data.taskLists.forEach((task, i) => {
        task.lineIndex = i;
    });
};

const moveTask = (event, data) => {
    data.taskLists = event.value;
    // Update lineIndex values
    data.taskLists.forEach((task, i) => {
        task.lineIndex = i;
    });
};

// Spare part material management
const addSparePartMaterial = (event, data) => {
    if (!data.sparePartMaterials) {
        data.sparePartMaterials = [];
    }

    data.sparePartMaterials.push({
        classify: '',
        itemId: 0,
        itemCode: '',
        itemName: '',
        unitOfMeasureId: null,
        quantity: 0,
        warehouseId: null,
        isRequired: false
    });
};

const deleteSparePartMaterial = (index, data) => {
    data.sparePartMaterials.splice(index, 1);
};

// File upload
const handleFileUpload = (event, data) => {
    emit('uploadFile', event, data, true);
};

const updateDateSelection = (keys, data) => {
    data.repeatDate = keys;
};
</script>

<style scoped>
:deep(.p-button-rotate) .p-button-icon {
    transform: rotate(45deg);
}

:deep(.p-datatable-wrapper) {
    overflow-x: auto;
}
</style>
