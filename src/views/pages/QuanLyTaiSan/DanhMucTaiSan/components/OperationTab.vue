<template>
    <div class="flex flex-col">
        <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-semibold">Chỉ số</h3>
            <Button size="small" label="Thêm" icon="pi pi-plus" @click="addOperation" />
        </div>

        <DataTable :value="assetOperations.assetOperationLines" class="p-datatable-sm">
            <Column field="index" header="#">
                <template #body="{ index }">
                    {{ index + 1 }}
                </template>
            </Column>
            <Column field="parameterCode" header="Mã thông số">
                <template #body="{ data }">
                    <Select size="small" v-model="data.parameterCode" :options="deviceConfigOption" optionLabel="name" optionValue="code" class="w-full" placeholder="Chọn thông số" @change="updateParameter(data)" />
                </template>
            </Column>
            <Column field="parameterName" header="Tên thông số">
                <template #body="{ data }">
                    {{ data.parameterName }}
                </template>
            </Column>
            <Column field="parameterUnit" header="Đơn vị">
                <template #body="{ data }">
                    {{ data.parameterUnit }}
                </template>
            </Column>
            <Column field="isAccumulated" header="Tích lũy" header-class="w-20">
                <template #body="{ data }">
                    <div class="flex justify-center">
                        <Checkbox size="small" v-model="data.isAccumulated" binary />
                    </div>
                </template>
            </Column>
            <Column field="parameterMinValue" header="Min">
                <template #body="{ data }">
                    <InputNumber size="small" v-model="data.parameterMinValue" class="w-full" />
                </template>
            </Column>
            <Column field="parameterMaxValue" header="Max">
                <template #body="{ data }">
                    <InputNumber size="small" :min="data.parameterMinValue" v-model="data.parameterMaxValue" class="w-full" />
                </template>
            </Column>
            <Column field="hasAlert" header="Cảnh báo" header-class="w-24">
                <template #body="{ data }">
                    <div class="flex justify-center">
                        <Checkbox v-model="data.hasAlert" binary />
                    </div>
                </template>
            </Column>
            <Column field="action" header="Hành động">
                <template #body="{ rowIndex }">
                    <Button icon="pi pi-trash" severity="danger" text rounded @click="$emit('deleteRow', rowIndex)" />
                </template>
            </Column>
        </DataTable>

        <div class="grid grid-cols-12 gap-4 mt-6">
            <div class="col-span-12 md:col-span-6">
                <div class="flex items-center gap-2 mb-3">
                    <Checkbox v-model="assetOperations.isStatusRecorded" binary inputId="recordStatus" />
                    <label for="recordStatus" class="text-gray-700"> Ghi nhận trạng thái hoạt động & trạng thái dừng trong ca vận hành </label>
                </div>
            </div>

            <div class="col-span-12">
                <div class="flex flex-col gap-2">
                    <div class="flex items-center gap-2">
                        <Checkbox v-model="assetOperations.isConsumptionRecorded" binary inputId="recordConsumption" />
                        <label for="recordConsumption" class="text-gray-700"> Ghi nhận mức tiêu hao nhiên liệu thiết bị trong ca vận hành </label>
                    </div>

                    <div v-if="assetOperations.isConsumptionRecorded" class="ml-7 mt-2">
                        <MultiSelect v-model="assetOperations.fuelCodes" :options="optionsOrganizationalStructure" optionLabel="warehouseName" optionValue="id" class="w-full md:w-96" placeholder="Chọn mã nhiên liệu" size="small" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import InputNumber from 'primevue/inputnumber';
import MultiSelect from 'primevue/multiselect';

const props = defineProps({
    assetOperations: {
        type: Object,
        required: true
    },
    deviceConfigOption: {
        type: Array,
        default: () => []
    },
    fuelCodes: {
        type: Array,
        default: () => []
    },
    optionsOrganizationalStructure: {
        type: Array,
        default: () => []
    }
});

const emit = defineEmits(['deleteRow']);

// Add new operation line
const addOperation = () => {
    if (!props.assetOperations.assetOperationLines) {
        props.assetOperations.assetOperationLines = [];
    }

    props.assetOperations.assetOperationLines.push({
        parameterCode: '',
        parameterName: '',
        parameterUnit: '',
        isAccumulated: false,
        parameterMinValue: 0,
        parameterMaxValue: 0,
        hasAlert: false
    });
};

// Update parameter details based on selected code
const updateParameter = (data) => {
    const parameter = props.deviceConfigOption.find((item) => item.code === data.parameterCode);
    if (parameter) {
        data.parameterName = parameter.name;
        data.parameterUnit = parameter.unit;
    }
};
</script>
