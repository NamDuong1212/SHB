<template>
    <form @submit.prevent="onSubmit">
        <div class="grid grid-cols-12 gap-6">
            <!-- Main content area -->
            <div class="col-span-12 lg:col-span-9 mt-4">
                <div class="flex justify-between w-full mb-3">
                    <div class="flex items-center gap-3">
                        <Button icon="pi pi-arrow-left" text rounded @click="router.push('/nhap-moi-thiet-bi')" class="transition-colors" />
                        <h1 class="text-xl font-bold text-primary m-0">YÊU CẦU NHẬP MỚI</h1>
                    </div>
                    <div class="flex flex-col w-2/6">
                        <AutoComplete
                            :invalid="messages.deviceLines"
                            id="assetCode"
                            class="customerAuto w-full"
                            v-model="keySearch"
                            :suggestions="optionSearch"
                            placeholder="Nhập mã tài sản, tên hoặc serial..."
                            @complete="searchAsset"
                            @item-select="handleUpdateRequest"
                        >
                            <template #empty>
                                <div class="p-4 text-center text-gray-500">
                                    <i class="pi pi-search mb-2 text-2xl opacity-50"></i>
                                    <p class="m-0">Không tìm thấy kết quả</p>
                                </div>
                            </template>
                            <template #option="{ option }">
                                <div class="flex items-center gap-3 p-3 border-b border-gray-200 hover:bg-gray-50 w-full">
                                    <i class="pi pi-box text-primary"></i>
                                    <div>
                                        <div class="font-medium">{{ option.assetCode }}</div>
                                        <div class="text-sm text-gray-600">{{ option.assetName }}</div>
                                    </div>
                                </div>
                            </template>
                        </AutoComplete>
                        <small class="text-red-500" v-if="messages.deviceLines">
                            {{ messages.deviceLines }}
                        </small>
                    </div>
                </div>

                <DataTable :value="form.deviceLines" class="p-datatable-sm" :rowHover="true" showGridlines stripedRows responsiveLayout="scroll">
                    <template #empty> <div class="p-5 text-center">Không có bản ghi nào.</div> </template>

                    <Column field="index" header="#" style="width: 3rem">
                        <template #body="{ index }">
                            <span class="text-sm font-medium p-2 bg-primary/10 rounded-full h-8 w-8 flex items-center justify-center">
                                {{ index + 1 }}
                            </span>
                        </template>
                    </Column>
                    <Column field="assetCode" header="Mã tài sản">
                        <template #body="{ data }">
                            <div class="font-medium">{{ data.assetCode }}</div>
                        </template>
                    </Column>
                    <Column field="assetName" header="Tên tài sản">
                        <template #body="{ data }">
                            <div class="text-gray-700">{{ data.assetName }}</div>
                        </template>
                    </Column>
                    <Column field="serial" header="Serial">
                        <template #body="{ data, index }">
                            <div class="p-input-filled">
                                <InputText size="small" v-model="data.serial" class="w-full" placeholder="Nhập serial" :invalid="messages[`deviceLines[${index}].serial`]" />
                                <small class="text-red-500" v-if="messages[`deviceLines[${index}].serial`]">
                                    {{ messages[`deviceLines[${index}].serial`] }}
                                </small>
                            </div>
                        </template>
                    </Column>
                    <Column field="assetValue" header="Giá trị tài sản">
                        <template #body="{ data, index }">
                            <div class="p-input-filled">
                                <InputNumber size="small" v-model="data.assetValue" class="w-full" placeholder="Nhập giá trị" :invalid="messages[`deviceLines[${index}].assetValue`]" mode="currency" currency="VND" locale="vi-VN" />
                                <small class="text-red-500" v-if="messages[`deviceLines[${index}].assetValue`]">
                                    {{ messages[`deviceLines[${index}].assetValue`] }}
                                </small>
                            </div>
                        </template>
                    </Column>
                    <Column style="width: 5rem">
                        <template #body="{ index }">
                            <Button icon="pi pi-trash" severity="danger" text rounded @click="handleDelete(index)" class="transition-all hover:bg-red-50" />
                        </template>
                    </Column>
                </DataTable>
            </div>

            <!-- Sidebar -->
            <div class="col-span-12 lg:col-span-3">
                <div class="sticky">
                    <Card class="shadow-none border-1 border-gray-200 mb-4 !bg-gray-50">
                        <template #title>
                            <div class="flex items-center justify-between w-full">
                                <div class="flex items-center gap-2 text-primary">
                                    <i class="pi pi-cog"></i>
                                    <span>Thông tin yêu cầu</span>
                                </div>
                                <div class="text-xs bg-primary/10 p-2 rounded-md text-primary">
                                    {{ format.dateTime(date) }}
                                </div>
                            </div>
                        </template>
                        <template #content>
                            <div class="flex flex-col gap-4">
                                <div class="p-float-label">
                                    <label for="managingUnit">Đơn vị quản lý</label>
                                    <TreeSelect
                                        id="managingUnit"
                                        :invalid="messages.managingUnitId"
                                        v-model="form.managingUnitId"
                                        @change="handleChangeManagingUnit"
                                        :options="optionsOrg"
                                        size="small"
                                        optionLabel="label"
                                        class="w-full"
                                        placeholder="Chọn bộ phận"
                                    />
                                    <small class="text-red-500" v-if="messages.managingUnitId">{{ messages.managingUnitId }}</small>
                                </div>

                                <div class="p-float-label">
                                    <label for="location">Vị trí</label>
                                    <Dropdown id="location" size="small" v-model="form.locationId" :options="optionLocation" optionLabel="factoryName" optionValue="id" class="w-full mt-1" :disabled="!form.managingUnitId" />
                                </div>

                                <div class="p-float-label">
                                    <label for="decisionNumber">Số quyết định</label>
                                    <InputText size="small" id="decisionNumber" v-model="form.decisionNumber" class="w-full mt-1" :class="{ 'p-invalid': !!messages.decisionNumber }" />
                                    <small class="text-red-500" v-if="messages.decisionNumber">{{ messages.decisionNumber }}</small>
                                </div>

                                <div class="p-float-label">
                                    <label for="decisionDate">Ngày quyết định</label>
                                    <Calendar size="small" id="decisionDate" v-model="form.decisionDate" dateFormat="yy-mm-dd" class="w-full mt-1" :showIcon="true" :invalid="messages.decisionDate" />
                                    <small class="text-red-500" v-if="messages.decisionDate">{{ messages.decisionDate }}</small>
                                </div>

                                <div class="p-float-label">
                                    <label for="recoveryEmployee">Nhân viên thanh lý</label>
                                    <InputText size="small" id="recoveryEmployee" v-model="form.recoveryEmployee" class="w-full mt-1" />
                                </div>

                                <div class="p-float-label">
                                    <label for="note">Lý do</label>
                                    <Textarea size="small" id="note" v-model="form.note" class="w-full mt-1" rows="3" autoResize />
                                </div>
                            </div>
                        </template>
                        <template #footer>
                            <div class="flex gap-2">
                                <Button size="small" icon="pi pi-refresh" label="Làm mới" outlined @click="onReset" class="w-1/2" />
                                <Button size="small" icon="pi pi-save" label="Gửi yêu cầu" severity="primary" class="w-1/2" @click="onSubmit" />
                            </div>
                        </template>
                    </Card>
                </div>
            </div>
        </div>
    </form>
</template>

<script setup>
import DeviceAdditionService from '@/service/DeviceAdditionService';
import { useToast } from 'primevue/usetoast';
import { getCurrentInstance, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import format from '../../../../../../helper/format';

const toast = useToast();
const router = useRouter();
const messages = ref({});

const date = ref(new Date());

setInterval(() => {
    date.value = new Date();
}, 1000);

// Form data
const form = ref(JSON.parse(JSON.stringify(DeviceAdditionService.dataRequestDefault)));
const keySearch = ref(null);
const optionSearch = ref([]);
const optionLocation = ref([]);
const optionsOrg = ref([]);
const { proxy } = getCurrentInstance();

// Load organizational structures on mount
onMounted(async () => {
    try {
        const res = await DeviceAdditionService.getByOrganizationalStructure();
        optionsOrg.value = res.data.map((node) => mapNode(node));
    } catch (error) {
        proxy.$notify('E', 'Không thể tải danh sách đơn vị quản lý', toast);
    }
});
const mapNode = (node, parentKey = '') => {
    return {
        key: node.id,
        label: node.orgStrtName,
        data: node.orgStrtCode,
        children: node.children?.map((child) => mapNode(child)) || []
    };
};
// Search assets
const searchAsset = async (event) => {
    try {
        const result = await DeviceAdditionService.searchAsset(event.query);
        optionSearch.value = result.data.result || [];
    } catch (error) {
        proxy.$notify('E', 'Lỗi không tìm kiếm được', toast);
    }
};

// Handle update request when selecting an asset
const handleUpdateRequest = (event) => {
    if (event.value) {
        const selectedAsset = event.value;
        const check = form.value.deviceLines.find((item) => item.assetCode === selectedAsset.assetCode);

        if (check) {
            proxy.$notify('W', 'Tài sản đã tồn tại trong danh sách', toast);
            keySearch.value = null;
            return;
        }

        form.value.deviceLines.push({
            id: 0,
            lineId: 0,
            assetId: selectedAsset.id,
            assetCode: selectedAsset.assetCode,
            assetName: selectedAsset.assetName,
            serial: '',
            assetValue: null,
            assetLiquidationPrice: 0
        });
        setTimeout(() => {
            keySearch.value = null;
        }, 10);
    }
};

// Handle change of managing unit
const handleChangeManagingUnit = async (event) => {
    optionLocation.value = [];
    if (form.value.managingUnitId) {
        try {
            const res = await DeviceAdditionService.getLocation(Object.keys(event)[0]);
            optionLocation.value = res.data;
            form.value.locationId = null;
        } catch (error) {
            proxy.$notify('E', 'Không thể tải danh sách vị trí', toast);
        }
    }
};

// Handle delete asset from list
const handleDelete = (rowIndex) => {
    form.value.deviceLines.splice(rowIndex, 1);
};

// Submit form
const onSubmit = async () => {
    try {
        const data = JSON.parse(JSON.stringify(form.value));
        if (data.managingUnitId) {
            const id = Object.keys(data.managingUnitId);
            data.managingUnitId = parseInt(id);
        }

        await DeviceAdditionService.save(data);
        proxy.$notify('S', 'Yêu cầu nhập mới tài sản đã được gửi thành công', toast);
        router.push('/nhap-moi-thiet-bi');
    } catch (error) {
        if (error.isValidate) {
            messages.value = error;
            return;
        }
        if (error?.response?.data?.Message) {
            proxy.$notify('E', error.reEponse.data.Message, toast);
        } else {
            proxy.$notify('E', 'Có lỗi xảy ra khi gửi yêu cầu', toast);
        }
    }
};

// Reset form
const onReset = () => {
    form.value = JSON.parse(JSON.stringify(DeviceAdditionService.dataRequestDefault));
    optionSearch.value = [];
    messages.value = {};
};
</script>

<style scoped>
.p-card .p-card-content {
    padding: 1rem;
}

.p-card .p-card-title {
    padding: 1rem 1rem 0 1rem;
    margin-bottom: 0;
}

.p-card .p-card-footer {
    padding: 0 1rem 1rem 1rem;
}

.p-datatable .p-datatable-thead > tr > th {
    background-color: #f8f9fa;
    color: #495057;
    font-weight: 600;
}

.p-float-label {
    margin-bottom: 0.5rem;
}

.p-inputtext:enabled:focus {
    box-shadow: 0 0 0 0.1rem rgba(var(--primary-color-rgb), 0.2);
}

.p-dropdown:not(.p-disabled).p-focus {
    box-shadow: 0 0 0 0.1rem rgba(var(--primary-color-rgb), 0.2);
}

.sticky {
    position: sticky;
    top: 1rem;
}
</style>
<style>
.customerAuto > .p-inputtext {
    width: 100% !important;
}
</style>
