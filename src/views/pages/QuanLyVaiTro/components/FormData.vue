<template>
  <Dialog
    v-model:visible="visibleModal"
    modal
    :header="payload.id ? 'Cập nhật vai trò' : 'Thêm mới vai trò'"
    :style="{ width: '85rem' }"
  >
    <div class="grid grid-cols-12 gap-5">
      <div class="col-span-12">
        <div class="grid grid-cols-12 gap-5">
          <div class="col-span-12">
            <div class="flex flex-col gap-2">
              <label class="font-medium text-gray-700"
                >Tên vai trò<sup class="text-red-500">*</sup></label
              >
              <InputText
                placeholder="Nhập tên vai trò"
                size="small"
                v-model="payload.roleName"
              />
            </div>
          </div>
          
          <div class="col-span-12">
            <div class="flex flex-col gap-2">
              <label class="font-medium text-gray-700">Quyền hạn</label>
              <div class="flex flex-wrap gap-2">
                <Button
                  v-for="permission in availablePermissions"
                  :key="permission.value"
                  :label="permission.label"
                  :severity="isPermissionSelected(permission.value) ? 'primary' : 'secondary'"
                  :outlined="!isPermissionSelected(permission.value)"
                  size="small"
                  @click="togglePermission(permission.value)"
                />
              </div>
            </div>
          </div>
          
          <div class="col-span-12">
            <div class="flex flex-col gap-2">
              <label class="font-medium text-gray-700">Nhóm ID</label>
              <InputText
                placeholder="Nhập nhóm ID"
                size="small"
                v-model="payload.orgIds"
              />
            </div>
          </div>
          
          <div class="col-span-12">
            <div class="flex flex-col gap-2">
              <label class="font-medium text-gray-700">Trạng thái</label>
              <ToggleSwitch v-model="payload.isActive"></ToggleSwitch>
            </div>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="flex justify-end w-full gap-2">
        <Button
          type="button"
          label="Đóng"
          icon="pi pi-times"
          severity="secondary"
          size="small"
          @click="visibleModal = false"
        ></Button>
        <Button
          type="button"
          icon="pi pi-save"
          label="Lưu"
          size="small"
          @click="saveData"
        ></Button>
      </div>
    </template>
  </Dialog>
  <Loading v-if="isLoading"></Loading>
</template>

<script setup>
import RoleService from "@/service/RoleService";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import ToggleSwitch from "primevue/toggleswitch";
import { useToast } from "primevue/usetoast";
import { getCurrentInstance, ref } from "vue";

const { proxy } = getCurrentInstance();
const visibleModal = ref(false);
const messages = ref({});
const toast = useToast();
const isLoading = ref(false);

const props = defineProps({
  dataTable: Array,
});

const emits = defineEmits(["loadData"]);

// Add, View, Edit, Delete cố định 
const availablePermissions = ref([
  { label: "Thêm", value: "Add" },
  { label: "Xem", value: "View" },
  { label: "Sửa", value: "Edit" },
  { label: "Xoá", value: "Delete" },
]);

const payload = ref({
  roleName: "",
  permissions: [],
  orgIds: "",
  isActive: false,
});

const isPermissionSelected = (permission) => {
  return payload.value.permissions?.includes(permission) || false;
};

const togglePermission = (permission) => {
  if (!payload.value.permissions) {
    payload.value.permissions = [];
  }
  
  const index = payload.value.permissions.indexOf(permission);
  if (index > -1) {
    payload.value.permissions.splice(index, 1);
  } else {
    payload.value.permissions.push(permission);
  }
};

const openDialog = async (data = null) => {
  if (data?.id) {
    payload.value = { ...data };
    payload.value.roleName = data.name || data.roleName;
    // Lấy permissions từ API hoặc data
    payload.value.permissions = data.permissions || [];
    payload.value.orgIds = data.orgIds || "";
  } else {
    payload.value = {
      roleName: "",
      permissions: [],
      orgIds: "",
      isActive: false,
    };
  }
  messages.value = {};
  visibleModal.value = true;
};

const saveData = async () => {
  try {
    isLoading.value = true;
    
    // Chuẩn bị dữ liệu theo format yêu cầu
    const dataToSave = {
      ...payload.value,
      
    };
    
    const response = await RoleService.save(dataToSave);
    proxy.$notify("S", "Thao tác thành công!", toast);
    visibleModal.value = false;
    emits("loadData");
  } catch (error) {
    if (error.isValidate) {
      messages.value = error;
    } else {
      proxy.$notify("E", "Có lỗi xảy ra!", toast);
    }
  } finally {
    isLoading.value = false;
  }
};

defineExpose({
  openDialog,
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