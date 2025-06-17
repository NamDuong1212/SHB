<template>
  <Dialog
    v-model:visible="visibleModal"
    modal
    header="Nhóm hàng hóa"
    :style="{ width: '50rem' }"
  >
    <div class="flex flex-col gap-3">
      <div class="bg-gray-50 p-4 rounded-lg shadow-sm">
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-6">
            <div class="flex flex-col gap-2">
              <label class="font-medium text-gray-700"
                >Mã nhóm <sup class="text-red-500">*</sup></label
              >
              <InputText
                v-model="payload.itemGroupCode"
                class="w-full"
                placeholder="Nhập mã nhóm"
                size="small"
                :invalid="!!messages.itemGroupCode"
              />
              <small class="text-red-500" v-if="messages.itemGroupCode">{{
                messages.itemGroupCode
              }}</small>
            </div>
          </div>
          <div class="col-span-6">
            <div class="flex flex-col gap-2">
              <label class="font-medium text-gray-700"
                >Tên nhóm <sup class="text-red-500">*</sup></label
              >
              <InputText
                v-model="payload.itemGroupName"
                class="w-full"
                size="small"
                placeholder="Nhập tên nhóm"
                :invalid="!!messages.itemGroupName"
              />
              <small class="text-red-500" v-if="messages.itemGroupName">{{
                messages.itemGroupName
              }}</small>
            </div>
          </div>
          <div class="col-span-12">
            <div class="flex flex-col gap-2">
              <label class="font-medium text-gray-700">Thuộc</label>
              <SelectTreeCustome
                v-model="payload.parentId"
                placeholder="Chọn nhóm cha"
                url="ItemGroup "
                optionLabel="itemGroupName"
                optionValue="id"
              ></SelectTreeCustome>
              <small class="text-red-500" v-if="messages.parentId">{{
                messages.parentId
              }}</small>
            </div>
          </div>
          <div class="col-span-12">
            <div class="flex flex-col gap-2">
              <label class="font-medium text-gray-700">Mô tả</label>
              <Textarea
                v-model="payload.itemGroupDescription"
                placeholder="Mô tả"
                size="small"
                rows="5"
                fluid
              ></Textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Trạng thái -->
      <div class="flex items-center p-3 bg-gray-50 rounded-lg">
        <div class="flex items-center gap-2">
          <ToggleSwitch
            v-model="payload.isActive"
            :true-value="true"
            :false-value="false"
          />
          <label class="font-medium text-gray-700">{{
            payload.isActive === true ? "Đang hoạt động" : "Không hoạt động"
          }}</label>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="flex justify-end w-full gap-2">
        <div class="flex gap-2">
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
      </div>
    </template>
  </Dialog>
</template>
<script setup>
import ItemGroupService from "@/service/ItemGroupService";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import { useToast } from "primevue/usetoast";
import { getCurrentInstance, ref } from "vue";

const { proxy } = getCurrentInstance();
const visibleModal = ref(false);
const messages = ref({});
const toast = useToast();
const props = defineProps({
  dataTable: Array,
});
const emits = defineEmits(["loadData"]);
const payload = ref({
  itemGroupCode: null,
  parentId: null,
  itemGroupDescription: null,
  parentId: null,
  isActive: true,
});
const clearPayload = JSON.stringify(payload.value);
const funClearPayload = () => {
  payload.value = JSON.parse(clearPayload);
};

const openDialog = async (data = null) => {
  if (data.id) {
    try {
      payload.value = { ...data };
    } catch (error) {}
  } else {
    funClearPayload();
  }
  messages.value = {};
  visibleModal.value = true;
};

const saveData = async () => {
  try {
    const res = await ItemGroupService.save(payload.value);
    if (res) {
      proxy.$notify("S", "Thao tác thành công!", toast);
      emits("loadData");
      visibleModal.value = false;
    }
  } catch (error) {
    if (error.isValidate) {
      messages.value = error;
    } else {
      proxy.$notify("S", error?.response?.data?.Message || error, toast);
    }
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
