<template>
    <Dialog v-model:visible="isModal" modal :header="payload.id ? 'Cập nhật tài sản' : 'Thêm mới tài sản'" :style="{ width: '90vw', maxWidth: '1600px' }" class="asset-dialog">
        <div class="flex flex-col gap-3">
            <!-- Basic Info Section -->
            <div class="basic-info-section">
                <AssetBasicInfo :assetInfo="payload" :assetGroups="groupOptions" @uploadFile="handleFileUpload" @getDetailAssetType="getDetailAssetType" ref="assetBasicInfoRef" />
            </div>

            <!-- Tabs Section -->
            <Tabs value="0">
                <TabList>
                    <Tab value="0">Bảo trì phòng ngừa</Tab>
                    <Tab value="1">Vận hành</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel value="0">
                        <MaintenanceTab
                            :maintenance="payload.assetMaintenance"
                            :deviceConfig="deviceConfig"
                            :optionsOrganizationalStructure="organizationalStructure"
                            :optionsWareHouse="warehouse"
                            :optionsUnitOfMeasure="unitOfMeasure"
                            :option-item="item"
                            @updateMaintenance="updateMaintenance"
                            @getAssetMaintenanceLines="getAssetMaintenanceLines"
                            @uploadFile="handleFileUpload"
                        />
                    </TabPanel>
                    <TabPanel value="1">
                        <OperationTab :assetOperations="payload.assetOperations" :deviceConfigOption="deviceConfigOption" :fuelCodes="fuelCodes" :optionsOrganizationalStructure="warehouse" @deleteRow="deleteRow" />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </div>

        <template #footer>
            <div class="flex justify-between">
                <Button type="button" icon="pi pi-refresh" text @click="resetForm" />
                <div>
                    <Button type="button" label="Huỷ" icon="pi pi-times" text severity="secondary" @click="isModal = false" class="mr-2" />
                    <Button type="button" label="Lưu" icon="pi pi-save" @click="saveData" />
                </div>
            </div>
        </template>
    </Dialog>
</template>

<script setup>
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import TabPanel from 'primevue/tabpanel';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

// Import sub-components (to be created)
import AssetService from '../../../../../service/AssetService';
import AssetDataHelper from '../AssetDataHelper';
import AssetBasicInfo from './AssetBasicInfo.vue';
import MaintenanceTab from './MaintenanceTab.vue';
import OperationTab from './OperationTab.vue';

const isModal = ref(false);
const messages = ref({});
const toast = useToast();
const activeTab = ref(0);
const assetBasicInfoRef = ref(null);

// Data references
const groupOptions = ref([]);
const deviceConfig = ref([]);
const deviceConfigOption = ref([]);
const fuelCodes = ref([]);
const organizationalStructure = ref([]);
const warehouse = ref([]);
const unitOfMeasure = ref([]);
const item = ref([]);
const props = defineProps({
    loadData: {
        type: Function,
        default: () => {}
    },
    dataTable: Array
});

// Default payload structure
const payload = ref({
    id: 0,
    assetCode: '',
    assetName: '',
    assetGroupId: null,
    assetTypeId: null,
    assetSerial: '',
    fatherId: null,
    note: '',
    isActive: true,
    isDeviceActive: false,
    isWarrantyActive: false,
    isPerformanceGood: false,
    assetImgs: [],
    assetMaintenance: {
        type: '',
        assetMaintenanceLines: []
    },
    assetOperations: {
        isStatusRecorded: false,
        isConsumptionRecorded: false,
        fuelCodes: [],
        assetOperationLines: []
    }
});

// Handle file uploads
const handleFileUpload = (event, data, isDocument = false) => {
    const files = Array.from(event.target.files);

    if (!isDocument && data.id > 0 && data.assetImgs && data.assetImgs.length > 0) {
        // Add to existing images
        const imageList = [...data.assetImgs];

        files.forEach((file) => {
            imageList.push({
                id: 0,
                imgName: file.name,
                imgUrl: URL.createObjectURL(file),
                assetId: data.id
            });
        });

        data.Image1s = files;
        data.assetImgs = imageList;
    } else if (isDocument) {
        // Document attachment for maintenance
        const imageList = [];
        files.forEach((file) => {
            imageList.push({
                id: 0,
                fileName: file.name,
                fileUrl: URL.createObjectURL(file),
                assetId: data.id || 0
            });
        });
        data.FDoc = files[0];
        data.workTaskAttachment = imageList[0];
    } else {
        // New asset images
        const imageList = [];
        files.forEach((file) => {
            imageList.push({
                id: 0,
                imgName: file.name,
                imgUrl: URL.createObjectURL(file),
                assetId: data.id || 0
            });
        });
        data.Image1s = files;
        data.assetImgs = imageList;
    }
};

// Get asset type details
const getDetailAssetType = async (typeId) => {
    if (!typeId) {
        payload.value.assetLines = [];
        return;
    }

    try {
        const response = await AssetService.getDetailAssetType(typeId);
        deviceConfig.value = response?.data?.assetTypeDeviceConfig || [];
        deviceConfigOption.value = deviceConfig.value.map((item) => ({
            code: item.deviceConfig.code,
            name: item.deviceConfig.name,
            unit: item.deviceConfig.unit
        }));
    } catch (error) {
        showToast('error', 'Lỗi hệ thống', 'Lỗi khi lấy thông tin loại tài sản');
    }
};

// Update maintenance data
const updateMaintenance = (updatedMaintenance) => {
    payload.value.assetMaintenance = updatedMaintenance;
};

// Generate maintenance lines based on type
const getAssetMaintenanceLines = (type) => {
    payload.value.assetMaintenance.assetMaintenanceLines = [];

    const device = deviceConfig.value;
    if (device.length === 0) {
        showToast('error', 'Lỗi dữ liệu', 'Vui lòng chọn loại tài sản');
        return;
    }

    if (type === 'Thời gian') {
        payload.value.assetMaintenance.assetMaintenanceLines = [
            {
                criterion: '',
                frequency: '',
                repeatDate: [],
                repeatCount: 0,
                partner: '',
                maintenanceCode: '',
                autoSchedule: 0,
                autoScheduleType: '',
                taskLists: [],
                sparePartMaterials: []
            }
        ];
    } else if (type === 'Thông số hoạt động' || type === 'Thời gian & Thông số') {
        device.forEach((item) => {
            payload.value.assetMaintenance.assetMaintenanceLines.push({
                criterion: 'TS',
                frequency: item?.deviceConfig?.code + ' - ' + item?.deviceConfig?.name,
                repeatDate: [],
                partner: '',
                repeatCount: 0,
                repeatType: item?.deviceConfig?.unit,
                maintenanceCode: '',
                autoSchedule: 0,
                autoScheduleType: item?.deviceConfig?.unit,
                taskLists: [],
                sparePartMaterials: []
            });
        });
    }
};

// Delete operation row
const deleteRow = (index) => {
    payload.value.assetOperations.assetOperationLines.splice(index, 1);
};

// Display toast messages
const showToast = (severity, summary, detail = '') => {
    toast.add({
        severity: severity,
        summary: summary,
        detail: detail,
        life: 3000
    });
};

// Save data
const saveData = async () => {
    try {
        await AssetService.save(payload.value);

        showToast('success', payload.value.id ? 'Cập nhật thành công' : 'Thêm mới thành công', payload.value.id ? 'Thông số hoạt động đã được cập nhật' : 'Thông số hoạt động đã được thêm mới');

        props.loadData();

        isModal.value = false;
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

            showToast('error', 'Lỗi dữ liệu', detailMessage);
        } else {
            showToast('error', 'Lỗi hệ thống', 'Đã xảy ra lỗi, vui lòng thử lại sau');
        }
    }
};

// Reset form
const resetForm = () => {
    // Reset to default values
    payload.value = {
        id: 0,
        assetCode: '',
        assetName: '',
        assetGroupId: null,
        assetTypeId: null,
        assetSerial: '',
        fatherId: null,
        note: '',
        isActive: true,
        isDeviceActive: false,
        isWarrantyActive: false,
        isPerformanceGood: false,
        assetImgs: [],
        assetMaintenance: {
            type: '',
            assetMaintenanceLines: []
        },
        assetOperations: {
            isStatusRecorded: false,
            isConsumptionRecorded: false,
            fuelCodes: [],
            assetOperationLines: []
        }
    };

    messages.value = {};
    activeTab.value = 0;
};

// Open dialog with data
const openDialog = async (data = null) => {
    resetForm();

    if (data && data.id) {
        // Edit mode - populate form with existing data
        const res = await AssetService.getById(data.id);
        payload.value = AssetDataHelper.formatAssetForEdit(res.data);

        // Get asset type details if needed
        if (payload.value.assetTypeId) {
            await getDetailAssetType(payload.value.assetTypeId);
        }

        // Set appropriate tab based on data
        if (payload.value.assetMaintenance?.type) {
            activeTab.value = 0;
        } else if (payload.value.assetOperations?.assetOperationLines?.length > 0) {
            activeTab.value = 1;
        }
    }

    isModal.value = true;
};

// Load initial data
onMounted(async () => {
    // Load asset groups
    try {
        const groupResponse = await AssetService.getAllOption('AssetGroup');
        groupOptions.value = groupResponse.data.result;
    } catch (error) {
        console.error('Error loading asset groups:', error);
    }

    // Load organizational structure
    try {
        const resWarehouse = await AssetService.getAllOption('Warehouse');
        warehouse.value = resWarehouse.data.result;
    } catch (error) {
        console.error('Error loading organizational structure:', error);
    }
    // Load organizational structure
    try {
        const orgResponse = await AssetService.getAllOption('OrganizationalStructure');
        organizationalStructure.value = orgResponse.data;
    } catch (error) {
        console.error('Error loading organizational structure:', error);
    }
    // Load unit of measure
    try {
        const uomResponse = await AssetService.getAllOption('UnitOfMeasure');
        unitOfMeasure.value = uomResponse.data.result;
    } catch (error) {
        console.error('Error loading unit of measure:', error);
    }
    try {
        const resItem = await AssetService.getAllOption('Item');
        item.value = resItem.data.result;
    } catch (error) {
        console.error('Error loading unit of measure:', error);
    }
});

defineExpose({
    openDialog
});
</script>

<style>
.asset-dialog .p-dialog-content {
    padding: 0 1.5rem;
}

.basic-info-section {
    margin-bottom: 1rem;
    padding: 1rem;
    background-color: #f8f9fa;
    border-radius: 0.5rem;
}

/* Toast styles */
.p-toast .p-toast-message.p-toast-message-success {
    background-color: #ecfdf5;
    border-left: 6px solid #10b981;
}

.p-toast .p-toast-message.p-toast-message-error {
    background-color: #fef2f2;
    border-left: 6px solid #ef4444;
}

.p-toast .p-toast-message.p-toast-message-info {
    background-color: #eff6ff;
    border-left: 6px solid #3b82f6;
}

.p-toast .p-toast-message.p-toast-message-warn {
    background-color: #fffbeb;
    border-left: 6px solid #f59e0b;
}
</style>
