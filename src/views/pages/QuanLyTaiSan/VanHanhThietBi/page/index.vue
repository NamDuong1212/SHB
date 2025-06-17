<template>
    <section class="p-[16px] pb-[32px] pt-[8px]" style="height: 90vh">
        <!-- Header -->
        <div class="flex justify-between items-center">
            <div>
                <span class="text-xl font-bold text-primary">DANH MỤC CA VẬN HÀNH</span>
            </div>
            <Update :edit-data="editData" :type-id="typeId" :loadData="loadData" />
        </div>
        <!-- End -->

        <!-- Content -->
        <div class="flex mt-[12px]">
            <div style="width: calc(25% - 15px); margin-right: 15px; box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1); padding: 10px" class="bg-gray-50 rounded-lg overflow-hidden">
                <div class="flex justify-between items-center">
                    <div class="text-[18px] font-bold text-gray-700">Danh sách ca</div>
                    <Button icon="pi pi-filter" size="small" severity="secondary" outlined label="Bộ lọc" @click="showFormFilter = true" />
                </div>
                <div class="mt-[4px] overflow-y-auto" style="width: 100%; max-height: 80vh">
                    <div
                        v-for="item in dataList"
                        :key="item.id"
                        @click="getById(item.id)"
                        :class="dataDetail.id == item.id && 'bg-[#f0f4fce0] !border-[3px]'"
                        class="w-full bg-white border-[1px] border-primary-300 rounded-xl text-[12px] xl:text-[14px] p-[8px] hover:bg-[#f0f0f0] hover:cursor-pointer"
                        style="box-sizing: border-box; margin: 6px 0"
                    >
                        <div class="flex justify-between items-center" v-if="isSameDay(item.createdDate, item.closeDate)">
                            <div class="flex items-center gap-[8px]">
                                <div class="text-primary font-bold">
                                    {{ item.createdDate ? formatC.date(item.createdDate) : '' }}
                                </div>
                                <div class="">
                                    (
                                    {{ item.createdDate ? formatC.time(item.createdDate) : '' }}
                                    - {{ item.closeDate ? formatC.time(item.closeDate) : '' }} )
                                </div>
                            </div>
                            <Tag :severity="item.isActive ? '' : 'secondary'" :value="item.isActive ? 'Đang mở' : 'Đã đóng'" class="!px-3"></Tag>
                        </div>
                        <div class="flex justify-between items-center mb-1" v-else>
                            <div class="flex flex-col gap-[3px]">
                                <div>
                                    Từ: <span class="text-primary font-bold"> {{ item.createdDate ? formatC.dateTime(item.createdDate) : '' }}</span>
                                </div>
                                <div>
                                    Đến: <span class="text-primary font-bold">{{ item.createdDate ? formatC.dateTime(item.createdDate) : '' }}</span>
                                </div>
                            </div>
                            <Tag :severity="item.isActive ? '' : 'secondary'" :value="item.isActive ? 'Đang mở' : 'Đã đóng'" class="!px-3"></Tag>
                        </div>
                        <div class="mb-1">
                            Đơn vị quản lý:
                            <span class="font-bold">{{ item.unit ? item.unit : '--' }}</span>
                        </div>
                        <div class="mb-1">
                            Nhân viên:
                            <span class="font-bold">{{ item.creator ? item.creator : '' }}</span>
                        </div>
                        <div>
                            Vị trí:
                            <span class="font-bold">{{ item.position ? item.position : '--' }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div style="width: calc(75%)" class="rounded-lg">
                <IconField>
                    <InputIcon class="pi pi-search" />
                    <InputText v-model="keySearch" @update:model-value="searchDataDetail" class="h-12 w-full" placeholder="Nhập mã tài sản, tên hoặc serial..."> </InputText>
                </IconField>

                <div class="overflow-y-auto" style="width: 100%; max-height: 78vh">
                    <Accordion :multiple="true" class="border border-b-0 mt-2" v-if="dataDetail?.deviceOperationLines?.length > 0">
                        <AccordionTab v-for="(item, index) in dataDetail.deviceOperationLines" :key="item.id">
                            <template #header>
                                <div class="flex items-center gap-[12px]">
                                    <Badge severity="primary" class="p-[4px] text-[15px]">
                                        <span class="font-bold">{{ index + 1 }}</span>
                                    </Badge>
                                    <div class="text-base text-gray-900">
                                        <div>
                                            <span class="font-normal"> Tên thiết bị:</span> <span class="font-bold">{{ item.assetSerial }}</span>
                                        </div>
                                        <div>
                                            <span class="font-normal"> Tên tài sản:</span> <span class="font-bold">{{ item.assetName }}</span>
                                        </div>
                                    </div>
                                </div>
                            </template>

                            <Divider />

                            <div class="text-[17px] font-bold border-b-[2px] border-[#778ece]">
                                <span class="bg-primary text-white py-[5px] rounded-md pl-[10px] pr-[10px]" style="border-top-left-radius: 8px; border-top-right-radius: 8px"> <i class="pi pi-sliders-h"></i> Chỉ số </span>
                            </div>
                            <DataTable :value="item.deviceSpecifications" dataKey="id" class="w-full" showGridlines stripedRows>
                                <Column header="Mã thông số">
                                    <template #body="{ data }">
                                        {{ data.parameterId }}
                                    </template>
                                </Column>
                                <Column header="Tên thông số">
                                    <template #body="{ data }">
                                        {{ data.parameterName }}
                                    </template>
                                </Column>
                                <Column header="Đơn vị">
                                    <template #body="{ data }">
                                        {{ data.parameterUnit }}
                                    </template>
                                </Column>
                                <Column header="Tích luỹ">
                                    <template #body="{ data }">
                                        <Checkbox v-model="data.isAccumulated" binary />
                                    </template>
                                </Column>
                                <Column header="Thực tế">
                                    <template #body="{ data }">
                                        {{ data.value }}
                                    </template>
                                </Column>
                                <Column header="Thời gian">
                                    <template #body="{ data }">
                                        {{ formatC.dateTime(data.lastUpdated) }}
                                    </template>
                                </Column>

                                <template #empty>
                                    <div class="text-center p-[16px]">
                                        <span>Không có dữ liệu</span>
                                    </div>
                                </template>
                            </DataTable>

                            <div class="text-[17px] font-bold border-b-[2px] border-[#778ece] mt-[16px]">
                                <span class="bg-primary text-white py-[5px] rounded-md pl-[10px] pr-[10px]" style="border-top-left-radius: 8px; border-top-right-radius: 8px"> <i class="pi pi-clock"></i> Thời gian </span>
                            </div>
                            <DataTable :value="item.deviceStatus" dataKey="id" class="w-full" showGridlines stripedRows>
                                <Column header="Trạng thái">
                                    <template #body="{ data }">
                                        {{ data.isActive ? 'Hoạt động' : 'Dừng' }}
                                    </template>
                                </Column>
                                <Column header="Từ">
                                    <template #body="{ data }">
                                        {{ formatC.dateTime(data.startTime) }}
                                    </template>
                                </Column>
                                <Column header="Đến">
                                    <template #body="{ data }">
                                        {{ formatC.dateTime(data.endTime) }}
                                    </template>
                                </Column>
                                <Column header="Loại sự cố">
                                    <template #body="{ data }">
                                        {{ data.incidentType }}
                                    </template>
                                </Column>

                                <template #empty>
                                    <div class="text-center p-[16px]">
                                        <span>Không có dữ liệu</span>
                                    </div>
                                </template>
                            </DataTable>

                            <div class="text-[17px] font-bold border-b-[2px] border-[#778ece] mt-[16px]">
                                <span class="bg-primary text-white py-[5px] rounded-md pl-[10px] pr-[10px]" style="border-top-left-radius: 8px; border-top-right-radius: 8px"> <i class="pi pi-bolt"></i> Nhiên liệu </span>
                            </div>
                            <DataTable :value="item.deviceFuel" dataKey="id" class="w-full" showGridlines stripedRows>
                                <Column header="Mã nhiên liệu">
                                    <template #body="{ data }"> {{ data.fuelCode }} </template>
                                </Column>
                                <Column header="Loại nhiên liệu">
                                    <template #body="{ data }"> {{ data.fuelName }} </template>
                                </Column>
                                <Column header="Đơn vị">
                                    <template #body="{ data }"> {{ data.fuelUnit?.unitGroupName || '--' }} </template>
                                </Column>
                                <Column header="Số lượng tiêu thụ">
                                    <template #body="{ data }">
                                        {{ formatC.int(data.quantity) }}
                                    </template>
                                </Column>
                                <template #empty>
                                    <div class="text-center p-[16px]">
                                        <span>Không có dữ liệu</span>
                                    </div>
                                </template>
                            </DataTable>
                        </AccordionTab>
                    </Accordion>
                    <div v-else class="flex flex-col items-center justify-center p-8 bg-white border mt-2">
                        <i class="pi pi-inbox !text-6xl text-gray-400"></i>
                        <h3 class="text-xl font-semibold text-gray-600 mb-2">Không có dữ liệu</h3>
                        <p class="text-gray-500">Vui lòng chọn ca khác hoặc thử lại sau</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Filter -->
        <Dialog v-model:visible="showFormFilter" modal header="Bộ lọc" :style="{ width: '400px' }" :closable="false">
            <div class="p-[12px]">
                <form @submit.prevent="applyFilter" @reset="resetFilter" class="flex flex-col">
                    <div class="mb-[12px]">
                        <label for="fromDate" class="block mb-[4px]">Từ ngày</label>
                        <Calendar id="fromDate" v-model="formFilter.fromDate" dateFormat="yy-mm-dd" class="w-full" showIcon />
                    </div>

                    <div class="mb-[8px]">
                        <label for="toDate" class="block mb-[4px]">Đến ngày</label>
                        <Calendar id="toDate" v-model="formFilter.toDate" dateFormat="yy-mm-dd" class="w-full" showIcon />
                    </div>

                    <div class="mt-[20px]">
                        <Button label="Áp dụng bộ lọc" type="submit" icon="pi pi-filter" severity="primary" class="w-full mb-[12px]" />
                        <div class="grid grid-cols-2 gap-[8px]">
                            <div>
                                <Button label="Đặt lại" type="reset" icon="pi pi-refresh" text severity="secondary" @click="applyFilter" class="w-full" />
                            </div>
                            <div>
                                <Button label="Đóng" @click="showFormFilter = false" icon="pi pi-times" severity="danger" text class="w-full" />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </Dialog>
    </section>
</template>

<script setup>
import { format } from 'date-fns';
import { useToast } from 'primevue/usetoast';
import { getCurrentInstance, onMounted, ref } from 'vue';
import formatC from '../../../../../helper/format';
import Update from '../components/Update.vue';
import { default as AssetService, default as Service } from '../service';

const toast = useToast();
const loading = ref(false);
const { proxy } = getCurrentInstance();
const dataList = ref([]);
const typeId = ref(null);
const itemToDeleteId = ref(null);
const deleteConfirmMessage = ref('');
const deleteApiEndpoint = ref('');
const tab = ref([]);
// Trạng thái mở các form
const showFormFilter = ref(false);
const showFormGroup = ref(false);
const showFormDelete = ref(false);
const editData = ref();
// Bộ lọc
const initialPagination = ref({
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0,
    sortBy: 'code',
    descending: true
});
const keySearch = ref('');
const formFilter = ref({
    isActive: null,
    fromDate: null,
    toDate: null
});

// Xử lý khi submit form thành công
const handleSubmitSuccess = () => {
    loadData();
};

// Mở dialog chỉnh sửa
const openEditDialog = (row) => {
    editData.value = row;
    showFormGroup.value = true;
};

// Xác nhận xóa
const confirmDelete = (row) => {
    itemToDeleteId.value = row.id;
    const deleteInfo = AssetService.getDeleteConfirmation();
    deleteConfirmMessage.value = deleteInfo.message;
    deleteApiEndpoint.value = deleteInfo.endpoint;
    showFormDelete.value = true;
};

// Áp dụng bộ lọc
const applyFilter = async () => {
    initialPagination.value.page = 1;
    await loadData();
};

// Đặt lại bộ lọc
const resetFilter = () => {
    formFilter.value = {
        isActive: null,
        fromDate: null,
        toDate: null
    };
};

// Tải dữ liệu
const loadData = async (param = {}) => {
    const conditions = Object.entries(formFilter.value)
        .filter(([key, value]) => value !== null && value !== undefined)
        .map(([key, value]) => {
            if (key === 'fromDate') {
                return `(createDate>=${format(value, 'yyyy-dd-MM')})`;
            }
            if (key === 'toDate') {
                return `(createDate<=${format(value, 'yyyy-dd-MM')})`;
            }
            return `(${key}=${value})`;
        });
    const filter = conditions.join(',');
    try {
        loading.value = true;
        const res = await Service.getAll({
            ...param,
            Filter: filter
        });
        getByUser();
        dataList.value = res.data.result;
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
        toast.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Lỗi khi tải dữ liệu thông số hoạt động',
            life: 3000
        });
    } finally {
        loading.value = false;
    }
};

const dataDetail = ref({});
const dataDetailClone = ref({});
const getById = async (id) => {
    try {
        const res = await Service.getById(id);
        dataDetail.value = res.data;
        dataDetailClone.value = JSON.parse(JSON.stringify(res.data));
    } catch (error) {
         
    }
};

const searchDataDetail = (event) => {
    if (!keySearch.value.trim()) {
        // If search is empty, restore original data
        dataDetail.value.deviceOperationLines = JSON.parse(JSON.stringify(dataDetailClone.value.deviceOperationLines || []));
        return;
    }

    const searchTerm = keySearch.value.toLowerCase();

    if (dataDetailClone.value?.deviceOperationLines) {
        const filteredData = dataDetailClone.value.deviceOperationLines.filter((line) => {
            return line.assetCode?.toLowerCase().includes(searchTerm) || line.assetName?.toLowerCase().includes(searchTerm) || line.assetSerial?.toLowerCase().includes(searchTerm);
        });

        dataDetail.value.deviceOperationLines = filteredData;
    }
};

const getByUser = async () => {
    try {
        const res = await Service.getByUser();
        editData.value = res.data;
    } catch (error) {
        editData.value = null;
    }
};
function isSameDay(createdDate, closeDate) {
    if (!createdDate || !closeDate) return true;

    const created = new Date(createdDate);
    const close = new Date(closeDate);

    // So sánh ngày, tháng và năm của cả 2 ngày
    return created.getFullYear() === close.getFullYear() && created.getMonth() === close.getMonth() && created.getDate() === close.getDate();
}
// Tải dữ liệu khi component được tạo
onMounted(() => {
    loadData();
    getByUser();
});
</script>

<style>
.p-datatable {
    border-radius: 4px;
}

.p-accordion .p-accordion-header-link {
    padding: 1rem;
    border: 1px solid #dee2e6;
    border-bottom: 0;
    border-top-right-radius: 4px;
    border-top-left-radius: 4px;
    background: #f8f9fa;
    color: #212529;
    font-weight: 600;
    transition: box-shadow 0.2s;
}

.p-accordion .p-accordion-content {
    padding: 1rem;
    border: 1px solid #dee2e6;
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
    background: #ffffff;
    color: #212529;
}
</style>
