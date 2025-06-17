<template>
    <div class="grid grid-cols-12 gap-4">
        <div class="col-span-6">
            <div class="flex flex-col gap-2">
                <label class="font-medium text-gray-700">Mã tài sản<span class="text-red-500">*</span></label>
                <InputText v-model="assetInfo.assetCode" class="w-full" placeholder="Nhập mã tài sản" size="small" />
                <small class="text-red-500" v-if="messages.assetCode">{{ messages.assetCode }}</small>
            </div>
        </div>
        <div class="col-span-6">
            <div class="flex flex-col gap-2">
                <label class="font-medium text-gray-700">Nhóm tài sản<span class="text-red-500">*</span></label>
                <Select size="small" v-model="assetInfo.assetGroupId" :options="assetGroups" optionLabel="name" optionValue="id" class="w-full" placeholder="Chọn nhóm tài sản" />
                <small class="text-red-500" v-if="messages.assetGroupId">{{ messages.assetGroupId }}</small>
            </div>
        </div>
        <div class="col-span-6">
            <div class="flex flex-col gap-2">
                <label class="font-medium text-gray-700">Tên tài sản<span class="text-red-500">*</span></label>
                <InputText size="small" v-model="assetInfo.assetName" class="w-full" placeholder="Nhập tên tài sản" />
                <small class="text-red-500" v-if="messages.assetName">{{ messages.assetName }}</small>
            </div>
        </div>
        <div class="col-span-6">
            <div class="flex flex-col gap-2">
                <label class="font-medium text-gray-700">Loại tài sản</label>
                <Select
                    size="small"
                    v-model="assetInfo.assetTypeId"
                    :options="getAssetTypes"
                    optionLabel="name"
                    optionValue="id"
                    class="w-full"
                    placeholder="Chọn loại tài sản"
                    :disabled="!assetInfo.assetGroupId"
                    @change="$emit('getDetailAssetType', assetInfo.assetTypeId)"
                />
                <small class="text-red-500" v-if="messages.assetTypeId">{{ messages.assetTypeId }}</small>
            </div>
        </div>
        <div class="col-span-6">
            <div class="flex flex-col gap-2">
                <label class="font-medium text-gray-700">Tài sản cha</label>
                <Select size="small" v-model="assetInfo.fatherId" :options="assetData" optionLabel="assetName" optionValue="id" class="w-full" placeholder="Chọn tài sản cha" />
            </div>
            <div class="col-span-6">
                <div class="grid grid-cols-2 gap-4 mt-5">
                    <div class="flex items-center gap-2">
                        <Checkbox v-model="assetInfo.isPerformanceGood" binary inputId="isPerformanceGood" />
                        <label for="isPerformanceGood" class="font-medium text-gray-700">Quản lý hiệu chuẩn, kiểm định thiết bị</label>
                    </div>
                    <div class="flex items-center gap-2">
                        <Checkbox v-model="assetInfo.isDeviceActive" binary inputId="isDeviceActive" />
                        <label for="isDeviceActive" class="font-medium text-gray-700">Quản lý giá trị tài sản</label>
                    </div>
                    <div class="flex items-center gap-2">
                        <Checkbox v-model="assetInfo.isWarrantyActive" binary inputId="isWarrantyActive" />
                        <label for="isWarrantyActive" class="font-medium text-gray-700">Quản lý bảo hành, bảo hiểm thiết bị</label>
                    </div>
                    <div class="flex items-center gap-2">
                        <ToggleSwitch v-model="assetInfo.isActive" inputId="isActive" />
                        <label for="isActive" class="font-medium text-gray-700">{{ assetInfo.isActive ? 'Đang hoạt động' : 'Không hoạt động' }}</label>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-span-6">
            <div class="flex flex-col gap-2">
                <label class="font-medium text-gray-700">Ghi chú</label>
                <Textarea size="small" v-model="assetInfo.note" class="w-full" rows="6" placeholder="Nhập ghi chú" />
            </div>
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
                        v-if="!assetInfo.assetImgs || assetInfo.assetImgs.length === 0"
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

                    <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        <div v-for="(item, index) in assetInfo.assetImgs" :key="index" class="relative group">
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

                    <div v-if="assetInfo.assetImgs && assetInfo.assetImgs.length > 0" class="mt-3 flex justify-between items-center text-xs text-gray-500">
                        <span>{{ assetInfo.assetImgs.length }} hình ảnh đã tải lên</span>
                        <Button icon="pi pi-trash" text size="small" severity="danger" label="Xóa tất cả" @click="assetInfo.assetImgs = []" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import Image from 'primevue/image';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import { computed, onMounted, ref } from 'vue';
import AssetService from '../../../../../service/AssetService';

const props = defineProps({
    assetInfo: {
        type: Object,
        required: true
    },
    assetGroups: {
        type: Array,
        default: () => []
    }
});

const emit = defineEmits(['uploadFile', 'getDetailAssetType']);
const messages = ref({});
const assetData = ref([]);
const fileInput = ref(null);

// Get asset types for selected group
const getAssetTypes = computed(() => {
    const group = props.assetGroups.find((g) => g.id === props.assetInfo.assetGroupId);
    return group?.assetTypes || [];
});

const getAssetData = async () => {
    try {
        const response = await AssetService.getAll();
        assetData.value = response.data.result;
    } catch (error) {
        console.error('Error loading assets:', error);
    }
};

const handleFileUpload = (event) => {
    emit('uploadFile', event, props.assetInfo);
};

const removeImage = (index) => {
    if (props.assetInfo.assetImgs) {
        const updatedImages = [...props.assetInfo.assetImgs];
        updatedImages.splice(index, 1);
        props.assetInfo.assetImgs = updatedImages;
    }
    if (props.assetInfo.Image1s) {
        const updatedImages = [...props.assetInfo.Image1s];
        updatedImages.splice(index, 1);
        props.assetInfo.Image1s = updatedImages;
    }
};

onMounted(() => {
    getAssetData();
});
</script>

<style scoped>
.hidden {
    display: none;
}

.card {
    border-radius: 0.5rem;
    box-shadow:
        0 1px 3px rgba(0, 0, 0, 0.12),
        0 1px 2px rgba(0, 0, 0, 0.24);
    overflow: hidden;
}
</style>
