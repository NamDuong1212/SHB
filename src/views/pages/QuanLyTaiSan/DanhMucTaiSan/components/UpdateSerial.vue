<template>
    <Button icon="pi pi-pencil" text rounded @click="openEditDialog" />
    <Dialog v-model:visible="isVisible" modal :header="'Cập nhật mã serial'" :style="{ width: '90vw', maxWidth: '1200px' }" class="asset-dialog">
        <div class="flex flex-col gap-3">
            <!-- Basic Info Section -->
            <div class="basic-info-section">
                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-7">
                        <div class="flex flex-col gap-2 mb-3">
                            <label class="font-medium text-gray-700">Mã tài sản</label>
                            <InputText v-model="form.assetCode" readonly />
                        </div>
                        <div class="flex flex-col gap-2 mb-3">
                            <label class="font-medium text-gray-700">Tên tài sản</label>
                            <InputText v-model="form.assetName" readonly />
                        </div>
                        <div class="flex flex-col gap-2 mb-3">
                            <label class="font-medium text-gray-700">Mã serial</label>
                            <InputText v-model="form.assetSerial" readonly />
                        </div>
                        <div class="flex flex-col gap-2 mb-3">
                            <label class="font-medium text-gray-700">Trạng thái</label>
                            <Dropdown v-model="form.status" :options="statusOptions" optionLabel="label" optionValue="value" placeholder="Chọn trạng thái" class="w-full" />
                        </div>
                    </div>
                    <div class="col-span-5 flex flex-col items-center justify-center">
                        <canvas ref="qrCanvas"></canvas>
                        <div class="text-center mt-2">{{ form.serialCode }}</div>
                    </div>
                    <div class="col-span-12">
                        <div class="bg-white rounded-lg shadow-sm border border-gray-100">
                            <div class="flex justify-between items-center bg-gradient-to-r from-primary/90 to-primary/70 px-4 py-2.5 rounded-t-lg">
                                <span class="text-white font-medium flex items-center gap-2">
                                    <i class="pi pi-images"></i>
                                    Hình ảnh Serial
                                </span>
                                <Button icon="pi pi-plus" text class="!text-white hover:!bg-white/20 !p-2 transition-all duration-200" @click="$refs.fileInput.click()" />
                            </div>

                            <div class="p-4">
                                <input ref="fileInput" type="file" @change="handleFileUpload($event)" accept="image/*" class="hidden" multiple />

                                <div
                                    v-if="!form.osrnImgs || form.osrnImgs.length === 0"
                                    class="border border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer transition-all duration-200"
                                    @click="$refs.fileInput.click()"
                                    @dragover.prevent
                                >
                                    <div class="bg-primary/10 p-3 rounded-full mb-3">
                                        <i class="pi pi-cloud-upload text-2xl text-primary"></i>
                                    </div>
                                    <p class="text-sm text-center">
                                        Tải lên hình ảnh Serial<br />
                                        <span class="text-primary font-medium">Nhấn để chọn file</span>
                                    </p>
                                </div>

                                <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    <div v-for="(item, index) in form.osrnImgs" :key="index" class="relative group">
                                        <div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-200 group-hover:shadow-md group-hover:border-primary/50 h-full flex flex-col">
                                            <div class="relative overflow-hidden h-40">
                                                <Image
                                                    :src="item?.imgUrl || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROu4m_EZfWX487aV5yPF7LbaW7x42UKRji3A&s'"
                                                    alt="Asset Image"
                                                    preview
                                                    class="w-full h-full transition-all duration-300 group-hover:scale-105"
                                                    image-class="w-full h-full object-cover"
                                                />
                                                <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                    <Button icon="pi pi-trash" rounded text severity="danger" class="!bg-white/80 hover:!bg-white" @click.stop="removeImage(index)" />
                                                </div>
                                            </div>
                                            <div class="py-2 px-3 text-center text-xs text-gray-700 bg-gray-50 truncate">
                                                {{ item.imgName || `Ảnh ${index + 1}` }}
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Add more button -->
                                    <div
                                        class="relative border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center h-40 bg-gray-50/50 cursor-pointer hover:bg-gray-50 transition-all duration-200 hover:border-primary/50"
                                        @click="$refs.fileInput.click()"
                                        @dragover.prevent
                                    >
                                        <div class="bg-primary/10 p-2 rounded-full mb-2">
                                            <i class="pi pi-plus text-lg text-primary"></i>
                                        </div>
                                        <span class="text-xs text-gray-500">Thêm ảnh</span>
                                    </div>
                                </div>

                                <div v-if="form.osrnImgs && form.osrnImgs.length > 0" class="mt-3 flex justify-between items-center text-xs text-gray-500">
                                    <span>{{ form.osrnImgs.length }} hình ảnh đã tải lên</span>
                                    <Button icon="pi pi-trash" text size="small" severity="danger" label="Xóa tất cả" @click="form.osrnImgs = []" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tabs Section -->
            <TabView>
                <TabPanel header="Thông tin chi tiết">
                    <AssetInfoTab :asset-lines="form.osrnLines" />
                </TabPanel>
                <TabPanel header="Kiểm định, hiệu chuẩn">
                    <div class="p-3">
                        <h3 class="text-lg font-semibold mb-3">Thông tin kiểm định, hiệu chuẩn</h3>
                        <div class="placeholder-content p-4 bg-gray-50 rounded-md border border-gray-200 flex justify-center items-center" style="min-height: 150px">
                            <span class="text-gray-500">Tính năng đang phát triển</span>
                        </div>
                    </div>
                </TabPanel>
                <TabPanel header="Bảo hành, bảo hiểm">
                    <div class="p-3">
                        <h3 class="text-lg font-semibold mb-3">Thông tin bảo hành, bảo hiểm</h3>
                        <div class="placeholder-content p-4 bg-gray-50 rounded-md border border-gray-200 flex justify-center items-center" style="min-height: 150px">
                            <span class="text-gray-500">Tính năng đang phát triển</span>
                        </div>
                    </div>
                </TabPanel>
            </TabView>
        </div>

        <template #footer>
            <div class="flex justify-between">
                <Button type="button" icon="pi pi-refresh" text @click="onReset" />
                <div>
                    <Button type="button" label="Huỷ" icon="pi pi-times" text severity="secondary" @click="onCancel" class="mr-2" />
                    <Button type="button" label="Lưu" icon="pi pi-save" @click="onSubmit" />
                </div>
            </div>
        </template>
    </Dialog>
</template>

<script setup>
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import Image from 'primevue/image';
import InputText from 'primevue/inputtext';
import TabPanel from 'primevue/tabpanel';
import TabView from 'primevue/tabview';
import { useToast } from 'primevue/usetoast';
import { toCanvas } from 'qrcode';
import { ref, watch } from 'vue';
import AssetService from '../../../../../service/AssetService';
import AssetInfoTab from './AssetInfoTab.vue';

const toast = useToast();
const isVisible = ref(false);
const qrCanvas = ref(null);
const fileInput = ref(null);

// Props from parent component
const props = defineProps({
    editData: {
        type: Object,
        default: null
    },
    loadData: {
        type: Function,
        default: () => {}
    }
});

// Form data
const formDefault = {
    id: 0,
    assetId: 0,
    assetCode: '',
    assetName: '',
    assetSerial: '',
    serialCode: '',
    locationId: null,
    managingUnitId: null,
    quantity: null,
    status: '',
    receivedDate: null,
    organizationalStructure: null,
    factory: null,
    osrnLines: [],
    osrnImgs: [],
    devices: []
};

const form = ref({ ...formDefault });

// Status options
const statusOptions = [
    { label: 'Chưa kích hoạt', value: 'O' },
    { label: 'Kích hoạt', value: 'CP' },
    { label: 'Dừng bảo trì', value: 'C' },
    { label: 'Thanh lý', value: 'TL' }
];

// Show toast messages
const showToast = (severity, summary, detail = '') => {
    toast.add({
        severity: severity,
        summary: summary,
        detail: detail,
        life: 3000
    });
};

// Open edit dialog
const openEditDialog = async () => {
    form.value = { ...props.editData };

    // Convert string field input to array of numbers
    form.value.osrnLines.forEach((item) => {
        if (typeof item.fieldInput === 'string') {
            item.fieldInput = item.fieldInput.split(',').map(Number);
        }
    });

    await getDetailAssetType();
    isVisible.value = true;
};

// Handle dialog hide
const onCancel = () => {
    isVisible.value = false;
};

// Reset form
const onReset = () => {
    form.value = { ...formDefault };
};

// Submit form
const onSubmit = async () => {
    try {
        // Validate and save
        await AssetService.updateService(form.value);

        showToast('success', 'Cập nhật thành công');
        props.loadData();
        isVisible.value = false;
    } catch (error) {
        console.error('Lỗi khi lưu:', error);
        showToast('error', 'Lỗi dữ liệu', 'Vui lòng kiểm tra lại thông tin');
    }
};

// Generate QR code
const generateQRCode = () => {
    if (!qrCanvas.value || !form.value.serialCode) return;

    toCanvas(qrCanvas.value, form.value.serialCode, {
        width: 160,
        margin: 2,
        errorCorrectionLevel: 'H'
    }).catch((error) => {
        console.error('Error generating QR code:', error);
    });
};

// Get asset type details
const getDetailAssetType = async (typeId) => {
    try {
        const res = await AssetService.getById(props.editData.assetId);
        const response = await AssetService.getDetailAssetType(res.data.assetTypeId);
        if (form.value.osrnLines && form.value.osrnLines.length > 0) {
            // Update existing lines with options
            form.value.osrnLines = form.value.osrnLines.map((item) => ({
                ...item,
                options: response?.data?.assetTypeLines.find((line) => line.id === item.fieldId)?.options
            }));
        } else {
            // Create new lines from asset type
            form.value.osrnLines =
                response?.data?.assetTypeLines.map((item) => ({
                    id: 0,
                    lineId: 0,
                    fieldId: item.id,
                    fieldName: item.fieldName,
                    fieldType: item.fieldType,
                    maxLength: item.maxLength,
                    isRequired: item.isRequired,
                    isSelectable: item.isSelectable,
                    options: item.options,
                    fieldInput: []
                })) || [];
        }
    } catch (error) {
        showToast('error', 'Lỗi hệ thống', 'Lỗi khi lấy thông tin loại tài sản');
    }
};

// Handle file upload
const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);

    const imageList = [];
    files.forEach((file) => {
        imageList.push({
            id: 0,
            imgName: file.name,
            imgUrl: URL.createObjectURL(file),
            assetId: form.value.id
        });
    });

    form.value.Img1s = files;
    form.value.osrnImgs = imageList;
};

const removeImage = (index) => {
    if (form.value.osrnImgs) {
        const updatedImages = [...form.value.osrnImgs];
        updatedImages.splice(index, 1);
        form.value.osrnImgs = updatedImages;
    }
    if (form.value.Img1s) {
        const updatedImg1s = [...form.value.Img1s];
        updatedImg1s.splice(index, 1);
        form.value.Img1s = updatedImg1s;
    }
};

// Watch for changes to generate QR code
watch(isVisible, (value) => {
    if (value && form.value.serialCode) {
        setTimeout(generateQRCode, 100);
    }
});

watch(
    () => form.value.serialCode,
    (value) => {
        if (value && isVisible.value) {
            generateQRCode();
        }
    }
);

// Watch for props.editData changes
watch(
    () => props.editData,
    (newVal) => {
        if (newVal && isVisible.value) {
            form.value = { ...newVal };
            if (typeof form.value.osrnLines[0]?.fieldInput === 'string') {
                form.value.osrnLines.forEach((item) => {
                    item.fieldInput = item.fieldInput.split(',').map(Number);
                });
            }
        }
    },
    { deep: true }
);

// Expose functions to parent
defineExpose({
    openEditDialog
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

.hidden {
    display: none;
}

.image-container {
    min-height: 100px;
    max-height: 300px;
    overflow-y: auto;
    border-top: none;
    border-bottom-left-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
}

.card {
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow:
        0 1px 3px rgba(0, 0, 0, 0.12),
        0 1px 2px rgba(0, 0, 0, 0.24);
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
