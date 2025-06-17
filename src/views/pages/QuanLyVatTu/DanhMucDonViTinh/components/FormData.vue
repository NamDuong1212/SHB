<template>
  <Dialog
    v-model:visible="UnitModal"
    modal
    header="Đơn vị tính"
    :style="{ width: '50rem' }"
  >
    <div class="flex flex-col gap-3">
      <div>
        <h3 class="text-lg font-medium text-blue-800 mb-3">Thông tin cơ bản</h3>
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-4">
            <div class="flex flex-col gap-2">
              <label class="font-medium text-gray-700"
                >Mã đơn vị tính <sup class="text-red-500">*</sup></label
              >
              <InputText
                v-model="payload.unitCode"
                class="w-full"
                :invalid="messages.unitCode"
                placeholder="Nhập mã đơn vị tính"
              />
              <small class="text-red-500" v-if="messages.unitCode">{{
                messages.unitCode
              }}</small>
            </div>
          </div>
          <div class="col-span-8">
            <div class="flex flex-col gap-2">
              <label class="font-medium text-gray-700"
                >Tên đơn vị tính <sup class="text-red-500">*</sup></label
              >
              <InputText
                v-model="payload.unitName"
                class="w-full"
                :invalid="messages.unitName"
                placeholder="Nhập tên đơn vị tính"
              />
              <small class="text-red-500" v-if="messages.unitName">{{
                messages.unitName
              }}</small>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h3 class="text-lg font-medium text-green-800 mb-3">Thông tin kích thước</h3>
        <div class="grid grid-cols-4 gap-4">
          <div class="col">
            <div class="flex flex-col gap-2">
              <label class="font-medium text-gray-700">Chiều dài</label>
              <InputNumber v-model="payload.length" fluid />
            </div>
          </div>

          <div class="col">
            <div class="flex flex-col gap-2">
              <label class="font-medium text-gray-700">Chiều rộng</label>
              <InputNumber v-model="payload.width" fluid />
            </div>
          </div>
          <div class="col">
            <div class="flex flex-col gap-2">
              <label class="font-medium text-gray-700">Chiều cao</label>
              <InputNumber v-model="payload.height" fluid />
            </div>
          </div>
          <div class="col">
            <div class="flex flex-col gap-2">
              <label class="font-medium text-gray-700">Đơn vị kích thước</label>
              <Dropdown
                v-model="payload.unitOfLength"
                :options="['Mm', 'Cm', 'M']"
                class="w-full"
                placeholder="Chọn đơn vị"
              />
            </div>
          </div>
          <div class="col">
            <div class="flex flex-col gap-2">
              <label class="font-medium text-gray-700">Khối lượng</label>
              <InputNumber v-model="payload.weight" fluid />
            </div>
          </div>
          <div class="col">
            <div class="flex flex-col gap-2">
              <label class="font-medium text-gray-700">Đơn vị tính khối lượng</label>
              <Dropdown
                v-model="payload.unitOfWeight"
                :options="['Mg', 'Cg', 'Dg', 'G', 'Kg']"
                class="w-full"
                placeholder="Chọn đơn vị"
              />
            </div>
          </div>
        </div>

        <div
          class="mt-4 p-3 bg-white rounded-lg border border-green-200 flex items-center"
        >
          <i class="pi pi-calculator text-green-600 mr-2 text-xl"></i>
          <div>
            <span class="font-medium">Thể tích: </span>
            <span class="text-green-700"
              >{{ volume.toFixed(2) }} {{ payload.unitOfLength }}³</span
            >
          </div>
        </div>
      </div>

      <!-- Trạng thái -->
      <div class="flex items-center p-3 bg-gray-50 rounded-lg">
        <div class="flex items-center gap-2">
          <ToggleSwitch v-model="payload.isActive" />
          <label class="font-medium text-gray-700">{{
            payload.isActive ? "Đang hoạt động" : "Không hoạt động"
          }}</label>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="flex gap-2">
        <Button
          type="button"
          label="Đóng"
          icon="pi pi-times"
          severity="secondary"
          size="small"
          @click="UnitModal = false"
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
</template>
<script setup>
import UnitOfMeasureSerivce from "@/service/UnitOfMeasureSerivce";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import Dropdown from "primevue/dropdown";
import InputNumber from "primevue/inputnumber";
import InputText from "primevue/inputtext";
import { useToast } from "primevue/usetoast";
import { computed, getCurrentInstance, ref } from "vue";

const { proxy } = getCurrentInstance();
const UnitModal = ref(false);
const messages = ref({});
const toast = useToast();
const props = defineProps({
  dataTable: Array,
});
const emits = defineEmits(["loadData"]);

const payload = ref({
  unitCode: "",
  unitName: "",
  unitOfLength: "cm",
  length: 0,
  width: 0,
  height: 0,
  weight: 0,
  isActive: true,
});

const openDialog = async (data = null) => {
  if (data && data.id) {
    try {
      const res = await UnitOfMeasureSerivce.getById(data.id);
      payload.value = res.data;
    } catch (error) {}
  } else {
    payload.value = {
      unitCode: "",
      unitName: "",
      unitOfLength: "cm",
      length: 0,
      width: 0,
      height: 0,
      weight: 0,
      isActive: true,
    };
  }
  messages.value = {};
  UnitModal.value = true;
};

const volume = computed(() => {
  const { width, length, height } = payload.value;
  return (width || 0) * (length || 0) * (height || 0);
});

const saveData = async () => {
  try {
    const res = await UnitOfMeasureSerivce.save(payload.value);
    if (res) {
      proxy.$notify("S", "Thao tác thành công!", toast);
      emits("loadData");
      UnitModal.value = false;
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
