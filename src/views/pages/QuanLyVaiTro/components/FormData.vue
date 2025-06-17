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
                placeholder="Nhập nội dung"
                size="small"
                v-model="payload.roleName"
              />
            </div>
          </div>
          <div class="col-span-12">
            <div class="p-5">
              <Privilege
                :Claims="payload.permissionList"
                v-model:claim="payload.permissionList"
              ></Privilege>
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
import Privilege from "@/components/Privilege.vue";
import RoleService from "@/service/RoleService";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
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

const payload = ref({
  groupItemId: null,
  isActive: false,
});

const openDialog = async (data = null) => {
  if (data.id) {
    payload.value = { ...data };
    payload.value.roleName = data.name;
    payload.value.permissionList = await getByID(data.id);
  } else {
    payload.value = {};
  }
  messages.value = {};
  visibleModal.value = true;
};

const getByID = async (id) => {
  try {
    const res = await RoleService.getById(id);
    return res.data;
  } catch (error) {
    return {};
  }
};

const saveData = async () => {
  try {
    isLoading.value = true;
    const response = await RoleService.save(payload.value);
    proxy.$notify("S", "Thao tác thành công!", toast);
    visibleModal.value = false;
  } catch (error) {
    if (error.isValidate) {
      messages.value = error;
    } else {
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
