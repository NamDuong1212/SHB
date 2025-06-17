<template>
    <Button label="Mở ca vận hành" severity="primary" @click="localShow = true" v-if="!form.id" size="small" />
    <Button label="Đóng ca vận hành" severity="danger" @click="openCloseCa" v-else size="small" />
    <Dialog v-model:visible="localShow" modal :style="{ minWidth: '30vw', maxWidth: '90vw' }" :closable="false" @hide="onDialogHide">
        <div class="relative">
            <div class="sticky top-0 z-[5] bg-white flex justify-between items-center">
                <div>
                    <div class="text-[18px] font-bold">{{ formTitle }}</div>
                    <div>Vui lòng mở ca để thực hiện các chức năng cho nhân viên</div>
                </div>
                <Button icon="pi pi-times" text rounded @click="onCancel" />
            </div>
            <Divider />
            <div>
                <form @submit.prevent="onSubmit" @reset="onReset" ref="formRef">
                    <div class="p-4 rounded-xl" :class="form.id && 'bg-gray-50'">
                        <div class="flex">
                            <div class="w-1/2 pr-[10px]">
                                <label for="">Tên nhân viên ca</label>
                                <InputText size="small" v-model="form.creator" placeholder="Nhân viên ca" class="w-full mt-1" readonly :invalid="messages.creator" />
                                <small class="text-red-500" v-if="messages.creator">{{ messages.creator }}</small>
                            </div>
                            <div class="w-1/2">
                                <label for="">Thời gian</label>
                                <InputText size="small" readonly :placeholder="format.dateTime(form.createdDate)" class="w-full mt-1 mb-3" :invalid="messages.createdDate" />
                                <small class="text-red-500" v-if="messages.createdDate">{{ messages.createdDate }}</small>
                            </div>
                        </div>
                        <div v-if="form.id === 0">
                            <label for="">Ghi chú</label>
                            <InputText size="small" v-model="form.note" placeholder="Ghi chú" class="w-full mt-1" :invalid="messages.note" />
                            <small class="text-red-500" v-if="messages.note">{{ messages.note }}</small>
                        </div>

                        <div v-if="form.id" class="mt-[6px]">
                            <IconField class="w-full">
                                <InputIcon icon="pi pi-search" />
                                <IconField>
                                    <InputIcon class="pi pi-search" />
                                    <AutoComplete
                                        id="assetCode"
                                        class="customerAuto w-full"
                                        size="large"
                                        option-label="assetCode"
                                        v-model="keySearch"
                                        :suggestions="optionSearch"
                                        placeholder="Nhập mã tài sản, tên hoặc serial..."
                                        @complete="searchAsset"
                                        @item-select="setModel"
                                    >
                                        <template #empty>
                                            <div class="p-4 text-center text-gray-500">
                                                <i class="pi pi-search mb-2 text-2xl opacity-50"></i>
                                                <p class="m-0">Không tìm thấy kết quả</p>
                                            </div>
                                        </template>
                                        <template #option="{ option }">
                                            <div class="flex items-center gap-3 p-3 border-b border-gray-200 hover:bg-gray-50 w-full">
                                                <i class="pi pi-hashtag text-primary"></i>
                                                <div>
                                                    <div class="font-medium">{{ option.assetSerial }}</div>
                                                    <div class="text-sm text-gray-600">{{ option.assetName }}</div>
                                                </div>
                                            </div>
                                        </template>
                                    </AutoComplete>
                                </IconField>
                            </IconField>
                            <small class="text-red-500" v-if="messages.deviceOperationLines">{{ messages.deviceOperationLines }}</small>
                        </div>
                    </div>
                    <Accordion :value="tab" multiple class="border border-b-0 mt-[16px]" v-if="form.deviceOperationLines.length > 0">
                        <AccordionPanel v-for="(item, indexItem) in form.deviceOperationLines" :key="indexItem" :value="indexItem">
                            <AccordionHeader>
                                <div class="flex items-center gap-[12px] w-[65vw]">
                                    <Badge severity="primary" class="p-[4px] text-[16px]">
                                        <span class="font-bold">{{ indexItem + 1 }}</span>
                                    </Badge>
                                    <div class="text-[15px] text-gray-900">
                                        <div>
                                            <span class="font-normal"> Tên thiết bị:</span> <span class="font-bold">{{ item.assetSerial }}</span>
                                        </div>
                                        <div>
                                            <span class="font-normal"> Tên tài sản:</span> <span class="font-bold">{{ item.assetName }}</span>
                                        </div>
                                    </div>
                                </div>
                                <Button icon="pi pi-times" text severity="danger" @click="form.deviceOperationLines.splice(indexItem, 1)" />
                            </AccordionHeader>
                            <AccordionContent>
                                <Divider />
                                <div class="grid grid-cols-12">
                                    <div class="col-span-7">
                                        <div class="mb-[15px]">
                                            <label for="">Mã tài sản</label>
                                            <InputText size="small" v-model="item.assetCode" placeholder="Mã tài sản" class="w-full" readonly />
                                        </div>
                                        <div class="mb-[15px]">
                                            <label for="">Tên tài sản</label>

                                            <InputText size="small" v-model="item.assetName" placeholder="Tên tài sản" class="w-full" readonly />
                                        </div>
                                        <div class="mb-[15px]">
                                            <label for="">Serial</label>

                                            <InputText size="small" v-model="item.assetSerial" placeholder="Serial" class="w-full" readonly />
                                        </div>
                                    </div>
                                    <div class="col-span-5">
                                        <QRCodeList :assetSerial="item" />
                                    </div>

                                    <div class="col-span-12 mt-[4px]">
                                        <Tabs value="0">
                                            <TabList>
                                                <Tab value="0" as="div" class="flex items-center gap-2">
                                                    <i class="pi pi-sliders-h mr-2" />
                                                    <span>Thông số</span>
                                                </Tab>
                                                <Tab value="1" as="div" class="flex items-center gap-2">
                                                    <i class="pi pi-info-circle mr-2" />
                                                    <span>Trạng thái</span>
                                                </Tab>
                                                <Tab value="2" as="div" class="flex items-center gap-2">
                                                    <i class="pi pi-bolt mr-2" />
                                                    <span>Nhiên liệu</span>
                                                </Tab>
                                            </TabList>
                                            <TabPanels class="!p-0">
                                                <TabPanel value="0" as="p" class="m-0">
                                                    <DataTable :value="item.deviceSpecifications" dataKey="id" class="w-full" showGridlines stripedRows>
                                                        <Column header="Mã thông số">
                                                            <template #body="{ data, index }">
                                                                <Dropdown
                                                                    size="small"
                                                                    v-model="data.parameterId"
                                                                    placeholder="Thông số"
                                                                    optionValue="id"
                                                                    optionLabel="name"
                                                                    :options="item.optionOperation"
                                                                    @change="renParameter($event.value, data)"
                                                                    class="w-full"
                                                                    :invalid="messages[`deviceOperationLines[${indexItem}].deviceSpecifications[${index}].parameterId`]"
                                                                />
                                                                <small class="text-red-500" v-if="messages[`deviceOperationLines[${indexItem}].deviceSpecifications[${index}].parameterId`]">{{
                                                                    messages[`deviceOperationLines[${indexItem}].deviceSpecifications[${index}].parameterId`]
                                                                }}</small>
                                                            </template>
                                                        </Column>
                                                        <Column header="Tên thông số">
                                                            <template #body="{ data }"> {{ data.parameterName }} </template>
                                                        </Column>
                                                        <Column header="Đơn vị">
                                                            <template #body="{ data }"> {{ data.parameterUnit }} </template>
                                                        </Column>
                                                        <Column header="Tích luỹ">
                                                            <template #body="{ data }">
                                                                <Checkbox v-model="data.isAccumulated" binary />
                                                            </template>
                                                        </Column>

                                                        <Column header="Thực tế">
                                                            <template #body="{ data, index }">
                                                                <InputNumber
                                                                    size="small"
                                                                    v-model="data.value"
                                                                    min="0"
                                                                    max="4800"
                                                                    buttonLayout="horizontal"
                                                                    class="w-full"
                                                                    :invalid="messages[`deviceOperationLines[${indexItem}].deviceSpecifications[${index}].value`]"
                                                                />
                                                                <small class="text-red-500" v-if="messages[`deviceOperationLines[${indexItem}].deviceSpecifications[${index}].value`]">{{
                                                                    messages[`deviceOperationLines[${indexItem}].deviceSpecifications[${index}].value`]
                                                                }}</small>
                                                            </template>
                                                        </Column>
                                                        <Column header="Thời gian">
                                                            <template #body="{ data, index }">
                                                                <DatePicker size="small" v-model="data.lastUpdated" showTime hourFormat="24" fluid :invalid="messages[`deviceOperationLines[${indexItem}].deviceSpecifications[${index}].lastUpdated`]" />
                                                                <small class="text-red-500" v-if="messages[`deviceOperationLines[${indexItem}].deviceSpecifications[${index}].lastUpdated`]">{{
                                                                    messages[`deviceOperationLines[${indexItem}].deviceSpecifications[${index}].lastUpdated`]
                                                                }}</small>
                                                            </template>
                                                        </Column>
                                                        <Column header="Hành động">
                                                            <template #body="{ data, index }">
                                                                <Button size="small" icon="pi pi-trash" severity="danger" text rounded @click="confirmDelete(item.deviceSpecifications, index)" />
                                                            </template>
                                                        </Column>
                                                        <template #empty>
                                                            <div class="text-center p-[16px]">
                                                                <span>Không có dữ liệu</span>
                                                            </div>
                                                        </template>
                                                    </DataTable>
                                                    <Button size="small" icon="pi pi-plus" label="Thêm thông số" outlined severity="primary" class="mt-[16px]" @click="addDeviceSpecifications(item)" />
                                                    <small class="text-red-500" v-if="messages[`deviceOperationLines[${indexItem}].deviceSpecifications`]">{{ messages[`deviceOperationLines[${indexItem}].deviceSpecifications`] }}</small>
                                                </TabPanel>
                                                <TabPanel value="1" as="p" class="m-0">
                                                    <DataTable :value="item.deviceStatus" dataKey="id" class="w-full" showGridlines stripedRows>
                                                        <Column header="Trạng thái">
                                                            <template #body="{ data, index }">
                                                                <Select
                                                                    size="small"
                                                                    v-model="data.isActive"
                                                                    option-label="label"
                                                                    option-value="value"
                                                                    :options="[
                                                                        { label: 'Hoạt động', value: true },
                                                                        { label: 'Dừng', value: false }
                                                                    ]"
                                                                    showTime
                                                                    fluid
                                                                    :invalid="messages[`deviceOperationLines[${indexItem}].deviceStatus[${index}].isActive`]"
                                                                />
                                                                <small class="text-red-500" v-if="messages[`deviceOperationLines[${indexItem}].deviceStatus[${index}].isActive`]">{{
                                                                    messages[`deviceOperationLines[${indexItem}].deviceStatus[${index}].isActive`]
                                                                }}</small>
                                                            </template>
                                                        </Column>
                                                        <Column header="Từ">
                                                            <template #body="{ data, index }">
                                                                <DatePicker size="small" v-model="data.startTime" showTime hourFormat="24" fluid :invalid="messages[`deviceOperationLines[${indexItem}].deviceStatus[${index}].startTime`]" />
                                                                <small class="text-red-500" v-if="messages[`deviceOperationLines[${indexItem}].deviceStatus[${index}].startTime`]">{{
                                                                    messages[`deviceOperationLines[${indexItem}].deviceStatus[${index}].startTime`]
                                                                }}</small>
                                                            </template>
                                                        </Column>
                                                        <Column header="Đến">
                                                            <template #body="{ data, index }">
                                                                <DatePicker size="small" v-model="data.endTime" showTime hourFormat="24" fluid :invalid="messages[`deviceOperationLines[${indexItem}].deviceStatus[${index}].endTime`]" />
                                                                <small class="text-red-500" v-if="messages[`deviceOperationLines[${indexItem}].deviceStatus[${index}].endTime`]">{{
                                                                    messages[`deviceOperationLines[${indexItem}].deviceStatus[${index}].endTime`]
                                                                }}</small>
                                                            </template>
                                                        </Column>

                                                        <Column header="Loại sự cố">
                                                            <template #body="{ data, index }">
                                                                <Select size="small" v-model="data.incidentType" :options="['Sự cố']" showTime fluid :invalid="messages[`deviceOperationLines[${indexItem}].deviceStatus[${index}].incidentType`]" />
                                                                <small class="text-red-500" v-if="messages[`deviceOperationLines[${indexItem}].deviceStatus[${index}].incidentType`]">{{
                                                                    messages[`deviceOperationLines[${indexItem}].deviceStatus[${index}].incidentType`]
                                                                }}</small>
                                                            </template>
                                                        </Column>
                                                        <Column header="Hành động">
                                                            <template #body="{ data, index }">
                                                                <Button size="small" icon="pi pi-trash" severity="danger" text rounded @click="confirmDelete(item.deviceStatus, index)" />
                                                            </template>
                                                        </Column>
                                                        <template #empty>
                                                            <div class="text-center p-[16px]">
                                                                <span>Không có dữ liệu</span>
                                                            </div>
                                                        </template>
                                                    </DataTable>
                                                    <Button size="small" icon="pi pi-plus" label="Thêm trạng thái" outlined severity="primary" class="mt-[16px]" @click="addTrangThai(item)" />
                                                    <small class="text-red-500" v-if="messages[`deviceOperationLines[${indexItem}].deviceStatus`]">{{ messages[`deviceOperationLines[${indexItem}].deviceStatus`] }}</small>
                                                </TabPanel>
                                                <TabPanel value="2">
                                                    <DataTable :value="item.deviceFuel" dataKey="id" class="w-full" showGridlines stripedRows>
                                                        <Column header="Mã nhiên liệu">
                                                            <template #body="{ data, index }">
                                                                <Dropdown
                                                                    size="small"
                                                                    v-model="data.fuelId"
                                                                    placeholder="Mã nhiên liệu"
                                                                    optionValue="id"
                                                                    optionLabel="itemCode"
                                                                    :options="optionItem"
                                                                    @change="renItem($event.value, data)"
                                                                    :invalid="messages[`deviceOperationLines[${indexItem}].deviceFuel[${index}].fuelId`]"
                                                                    class="w-full"
                                                                />
                                                                <small class="text-red-500" v-if="messages[`deviceOperationLines[${indexItem}].deviceFuel[${index}].fuelId`]">{{
                                                                    messages[`deviceOperationLines[${indexItem}].deviceFuel[${index}].fuelId`]
                                                                }}</small>
                                                            </template>
                                                        </Column>
                                                        <Column header="Loại nhiên liệu">
                                                            <template #body="{ data }"> {{ data.fuelName }} </template>
                                                        </Column>
                                                        <Column header="Đơn vị">
                                                            <template #body="{ data }"> {{ data.fuelUnit?.unitGroupName || '--' }} </template>
                                                        </Column>

                                                        <Column header="Số lượng tiêu thụ">
                                                            <template #body="{ data, index }">
                                                                <InputNumber
                                                                    size="small"
                                                                    v-model="data.quantity"
                                                                    min="0"
                                                                    buttonLayout="horizontal"
                                                                    class="w-full"
                                                                    :invalid="messages[`deviceOperationLines[${indexItem}].deviceFuel[${index}].quantity`]"
                                                                />
                                                                <small class="text-red-500" v-if="messages[`deviceOperationLines[${indexItem}].deviceFuel[${index}].quantity`]">{{
                                                                    messages[`deviceOperationLines[${indexItem}].deviceFuel[${index}].quantity`]
                                                                }}</small>
                                                            </template>
                                                        </Column>

                                                        <Column header="Hành động">
                                                            <template #body="{ data, index }">
                                                                <Button size="small" icon="pi pi-trash" severity="danger" text rounded @click="confirmDelete(item.deviceFuel, index)" />
                                                            </template>
                                                        </Column>
                                                        <template #empty>
                                                            <div class="text-center p-[16px]">
                                                                <span>Không có dữ liệu</span>
                                                            </div>
                                                        </template>
                                                    </DataTable>
                                                    <Button size="small" icon="pi pi-plus" label="Thêm nhiên liệu" outlined severity="primary" class="mt-[16px]" @click="addNhienLieu(item)" />
                                                    <small class="text-red-500" v-if="messages[`deviceOperationLines[${indexItem}].deviceFuel`]">{{ messages[`deviceOperationLines[${indexItem}].deviceFuel`] }}</small>
                                                </TabPanel>
                                            </TabPanels>
                                        </Tabs>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionPanel>
                    </Accordion>
                    <div class="!mt-[25px] flex justify-end">
                        <Button label="Mở ca vận hành" type="submit" severity="primary" v-if="!form.id" />
                        <div class="flex gap-[8px]" v-else>
                            <Button size="small" label="Đóng ca vận hành" @click="cancelDeviceOperation" text severity="danger" />
                            <Button size="small" label="Cập nhật ca vận hành" type="submit" severity="primary" />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </Dialog>
</template>

<script setup>
import { useToast } from 'primevue/usetoast';
import { computed, getCurrentInstance, onMounted, ref, watch } from 'vue';
import format from '../../../../../helper/format';
import AssetService from '../../../../../service/AssetService';
import SuppliesService from '../../../../../service/ItemService';
import Service from '../service';
import QRCodeList from './QRCodeList.vue';
const { proxy } = getCurrentInstance();

const toast = useToast();
const formRef = ref(null);
const messages = ref({});
const account = ref(JSON.parse(localStorage.getItem('auth_user') || '{}'));
const tab = ref([0]);
// Props từ component cha
const props = defineProps({
    editData: {
        type: Object,
        default: null
    },
    typeId: {
        type: Number,
        default: null
    },
    loadData: {
        type: Function,
        default: null
    }
});

const localShow = ref(false);
const dataDefault = {
    id: 0,
    locationId: 2,
    managingUnitId: 2,
    note: null,
    isActive: true,
    creatorId: account.value.id,
    createdDate: new Date(),
    creator: account.value.userName,
    closeDate: null,
    deviceOperationLines: []
};

const form = ref(JSON.parse(JSON.stringify(dataDefault)));
// Tiêu đề form
const formTitle = computed(() => {
    return form.value.id ? 'Cập nhật ca vận hành' : 'Mở ca vận hành';
});

// Xử lý khi submit form
const onSubmit = async () => {
    try {
        await Service.save(form.value);
        proxy.$notify('S', form.value.id ? 'Cập nhật ca vận hành thành công' : 'Mở ca vận hành thành công', toast);
        localShow.value = false;
        if (props.loadData) {
            props.loadData();
        }
    } catch (error) {
        if (error.isValidate) {
            messages.value = error;

            // Get first two errors for display
            const errorMessages = Object.values(error)
                .filter((item) => typeof item === 'string')
                .slice(0, 2);

            const remainingCount = Object.values(error).length - 2 - 1; // -1 for isValidate

            let detailMessage = errorMessages.join(', ');
            if (remainingCount > 0) {
                detailMessage += ` và ${remainingCount} lỗi khác`;
            }
            proxy.$notify('E', detailMessage, toast);
        } else {
            proxy.$notify('E', 'Đã xảy ra lỗi, vui lòng thử lại sau', toast);
        }
    }
};
const optionItem = ref([]);
const getOption = async () => {
    try {
        const res = await SuppliesService.getAll({ Filter: 'groupItemId=34' });
        optionItem.value = res.data?.result || [];
    } catch (error) {}
};
const onDialogHide = () => {
    if (props.loadData) {
        props.loadData();
    }
};

const openCloseCa = () => {
    localShow.value = true;
    onReset();
};

// Reset form
const onReset = () => {
    form.value = JSON.parse(JSON.stringify(dataDefault));

    // Nếu đang chỉnh sửa, cập nhật lại giá trị từ props
    if (props.editData) {
        updateFormFromProps();
    }
};

// Hủy và đóng dialog
const onCancel = async () => {
    localShow.value = false;
};

const cancelDeviceOperation = async () => {
    try {
        await Service.save({ ...form.value, isActive: false }, false);
    } catch (error) {
         
    } finally {
        localShow.value = false;
    }
};

// Cập nhật form từ props
const updateFormFromProps = async () => {
    if (props.editData) {
        const deviceOperationLines = await Promise.all(
            props.editData.deviceOperationLines.map(async (el) => {
                const res = await AssetService.getById(el.assetId);
                const optionOperation = res.data?.assetOperations?.assetOperationLines.map((el) => dataDeviceConfig.value.find((e) => e.code === el.parameterCode)) || [];

                const deviceSpecifications = el.deviceSpecifications.map((itemDev) => ({
                    ...itemDev,
                    lastUpdated: new Date(itemDev.lastUpdated)
                }));
                const deviceStatus = el.deviceStatus.map((itemDev) => ({
                    ...itemDev,
                    endTime: new Date(itemDev.endTime),
                    startTime: new Date(itemDev.startTime)
                }));

                return {
                    ...el,
                    deviceSpecifications,
                    deviceStatus,
                    optionOperation
                };
            })
        );
        form.value = { ...props.editData, deviceOperationLines };
    }
};

const keySearch = ref('');
const optionSearch = ref([]);
const searchAsset = async (event) => {
    try {
        const result = await Service.searchAsset(event.query);
        optionSearch.value = result.data || [];
    } catch (error) {
        proxy.$notify('E', 'Lỗi không tìm kiếm được', toast);
    }
};
const setModel = async (event) => {
    const val = event.value;
    if (val) {
        const check = form.value.deviceOperationLines.find((item) => item.assetSerial === val.assetSerial);
        if (check) {
            proxy.$notify('W', 'Mã tài sản đã tồn tại', toast);
            setTimeout(() => {
                keySearch.value = '';
            }, 1);
            return;
        }
        const res = await AssetService.getById(val.id);
        const optionOperation = res.data?.assetOperations?.assetOperationLines.map((el) => dataDeviceConfig.value.find((e) => e.code === el.parameterCode)) || [];
        form.value.deviceOperationLines.push({
            id: 0,
            lineId: 0,
            assetId: val.id,
            assetCode: val.assetCode,
            assetName: val.assetName,
            assetSerial: val.assetSerial,
            serialCode: val.serialCode,
            tab: 0,
            deviceSpecifications: [],
            deviceStatus: [],
            deviceFuel: [],
            optionOperation
        });
        tab.value = [form.value.deviceOperationLines.length - 1];
        setTimeout(() => {
            keySearch.value = '';
        }, 1);
    }
};

const confirmDelete = (item, index) => {
    item.splice(index, 1);
};

const dataDeviceConfig = ref([]);

const getDeviceConfig = async () => {
    try {
        const res = await Service.getDeviceConfig();
        dataDeviceConfig.value = res.data.result;
    } catch (error) {
        console.error('Lỗi khi lấy cấu hình thiết bị:', error);
        dataDeviceConfig.value = [];
    }
};

// Watch props.editData để cập nhật form khi có dữ liệu mới
watch(
    () => props.editData,
    (newVal) => {
        if (newVal) {
            updateFormFromProps();
        } else {
            onReset();
        }
    },
    { immediate: true }
);

const addDeviceSpecifications = (item) => {
    item.deviceSpecifications.push({
        id: 0,
        parameterCode: '',
        parameterName: '',
        parameterUnit: '',
        isAccumulated: false,
        value: 0,
        lastUpdated: ''
    });
};

const addTrangThai = (item) => {
    item.deviceStatus.push({
        id: 0,
        isActive: true,
        startTime: '',
        endTime: '',
        incidentType: ''
    });
};

const addNhienLieu = (item) => {
    item.deviceFuel.push({
        id: 0,
        fuelUnitId: '',
        fuelUnit: [],
        quantity: 0,
        fuelType: '',
        fuelName: '',
        fuelUnitId: '',
        fuelCode: ''
    });
};

const renParameter = (val, row) => {
    const res = dataDeviceConfig.value.find((item) => item.id === val);
    row.parameterCode = res?.code;
    row.parameterName = res?.name;
    row.parameterUnit = res?.unit;
};
const renItem = (val, row) => {
    const res = optionItem.value.find((item) => item.id === val);
    row.fuelCode = res?.itemCode;
    row.fuelName = res?.itemName;
    row.fuelUnitId = res?.unitGroupId;
    row.fuelUnit = res?.unitGroup;
};

onMounted(() => {
    getDeviceConfig();
    getOption();
});
</script>

<style scoped>
:deep(.p-tabview-nav) {
    background-color: #6366f1;
}

:deep(.p-tabview-nav-link) {
    color: white !important;
}

:deep(.p-tabview-selected .p-tabview-nav-link) {
    background-color: #4f46e5 !important;
}

:deep(.p-dialog-header) {
    padding: 0;
}

:deep(.p-dialog-content) {
    padding: 0;
}
</style>
