<template>
    <Dialog v-model:visible="isModal" modal :header="payload.id ? 'Cập nhật thông số hoạt động' : 'Thêm mới thông số hoạt động'" :style="{ width: '50rem' }">
        <div class="flex flex-col gap-3">
            <div class="p-4 rounded-lg shadow-sm">
                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-6">
                        <div class="flex flex-col gap-2">
                            <label class="font-medium text-gray-700">Mã thông số<span class="text-red-500">*</span></label>
                            <InputText v-model="payload.code" class="w-full" placeholder="Nhập mã đơn vị tính" />
                            <small class="text-red-500" v-if="messages.code">{{ messages.code }}</small>
                        </div>
                    </div>
                    <div class="col-span-6">
                        <div class="flex flex-col gap-2">
                            <label class="font-medium text-gray-700">Đơn vị tính<span class="text-red-500">*</span></label>
                            <InputText v-model="payload.unit" class="w-full" placeholder="Nhập tên đơn vị tính" />
                            <small class="text-red-500" v-if="messages.unit">{{ messages.unit }}</small>
                        </div>
                    </div>
                    <div class="col-span-12">
                        <div class="flex flex-col gap-2">
                            <label class="font-medium text-gray-700">Tên thông số<span class="text-red-500">*</span></label>
                            <InputText v-model="payload.name" class="w-full" placeholder="Nhập tên đơn vị tính" />
                            <small class="text-red-500" v-if="messages.name">{{ messages.name }}</small>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Trạng thái -->
            <div class="flex items-center p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center gap-2">
                    <ToggleSwitch v-model="payload.isActive" />
                    <label class="font-medium text-gray-700">{{ payload.isActive ? 'Đang hoạt động' : 'Không hoạt động' }}</label>
                </div>
            </div>
        </div>
        <template #footer>
            <div class="flex justify-end gap-2">
                <Button type="button" label="Huỷ" icon="pi pi-times" severity="secondary" @click="isModal = false"></Button>
                <Button type="button" icon="pi pi-save" label="Lưu" @click="saveData"></Button>
            </div>
        </template>
    </Dialog>
</template>
<script setup>
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import { useToast } from 'primevue/usetoast';
import { computed, getCurrentInstance, ref } from 'vue';
import DeviceConfigService from '../../../../../service/DeviceConfigService';

const { proxy } = getCurrentInstance();
const isModal = ref(false);
const messages = ref({});
const toast = useToast();
const props = defineProps({
    loadData: {
        type: Function,
        default: () => {}
    },
    dataTable: Array
});
const payload = ref({
    code: '',
    name: '',
    unit: '',
    isActive: true
});

const openDialog = async (data = null) => {
    if (data && data.id) {
        payload.value = { ...data };
    } else {
        payload.value = {
            code: '',
            name: '',
            unit: '',
            isActive: true
        };
    }
    messages.value = {};
    isModal.value = true;
};

const volume = computed(() => {
    const { width, length, height } = payload.value;
    return (width || 0) * (length || 0) * (height || 0);
});

// Hàm hiển thị thông báo
const showToast = (severity, summary, detail = '') => {
    toast.add({
        severity: severity, // 'success', 'info', 'warn', 'error'
        summary: summary,
        detail: detail,
        life: 3000
    });
};

const saveData = async () => {
    try {
        const res = await DeviceConfigService.save(payload.value);
        if (payload.value.id) {
            showToast('success', 'Cập nhật thành công', 'Đơn vị tính đã được cập nhật');
        } else {
            showToast('success', 'Thêm mới thành công', 'Đơn vị tính đã được thêm mới');
        }
        props.loadData();

        isModal.value = false;
    } catch (error) {
         

        if (error.isValidate) {
            messages.value = error;
            showToast('error', 'Lỗi dữ liệu', 'Vui lòng kiểm tra lại thông tin');
        } else {
            showToast('error', 'Lỗi hệ thống', 'Đã xảy ra lỗi, vui lòng thử lại sau');
        }
    }
};

defineExpose({
    openDialog
});
</script>
<style>
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
