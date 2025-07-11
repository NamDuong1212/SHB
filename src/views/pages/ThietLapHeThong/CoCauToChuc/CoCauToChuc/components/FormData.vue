<template>
  <Dialog v-model:visible="visibleModal" modal header="Cơ cấu tổ chức" :style="{ width: '50rem' }">
    <div class="flex flex-col gap-3">
      <div class="bg-gray-50 p-4 rounded-lg shadow-sm">
        <div class="grid grid-cols-12 gap-4">
          <!-- <div class="col-span-6">
            <div class="flex flex-col gap-2">
              <label class="font-medium text-gray-700">Mã đơn vị <sup class="text-red-500">*</sup></label>
              <InputText v-model="payload.orgStrCode" class="w-full" placeholder="Nhập mã đơn vị " size="small" />
              <small class="text-red-500" v-if="messages.orgStrCode">{{
                messages.orgStrCode
              }}</small>
            </div>
          </div> -->
          <div class="col-span-6">
            <div class="flex flex-col gap-2">
              <label class="font-medium text-gray-700">Tên đơn vị <sup class="text-red-500">*</sup></label>
              <InputText v-model="payload.orgName" class="w-full" size="small" placeholder="Nhập tên đơn vị"
                :invalid="!!messages.orgName" />
              <small class="text-red-500" v-if="messages.orgName">{{
                messages.orgName
              }}</small>
            </div>
          </div>
          <div class="col-span-6">
            <div class="flex flex-col gap-2">
              <label class="font-medium text-gray-700">Thuộc đơn vị <sup class="text-red-500">*</sup></label>
              <SelectTreeCustome 
                v-model="payload.parentOrgId" 
                placeholder="Bộ phận" 
                url="OrganizationalStructure"
                optionLabel="orgName" 
                optionValue="id"
                :disabled="payload.orgType === 'Tổ chức'"
              />
            </div>
          </div>
          <div class="col-span-6">
            <div class="flex flex-col gap-2">
              <label class="font-medium text-gray-700">
                Cấp tổ chức <sup class="text-red-500">*</sup>
              </label>
              <Select v-model="payload.orgType" placeholder="Chọn cấp tổ chức" :options="fixedOrgLevels"
                option-value="value" option-label="label" size="small" :invalid="!!messages.orgType"
                fluid />
              <small class="text-red-500" v-if="messages.orgType">
                {{ messages.orgType }}
              </small>
            </div>
          </div>

        </div>
      </div>

      <!-- Trạng thái -->
      <div class="flex items-center p-3 bg-gray-50 rounded-lg">
        <div class="flex items-center gap-2">
          <ToggleSwitch v-model="payload.isActive" :true-value="true" :false-value="false" />
          <label class="font-medium text-gray-700">{{
            payload.isActive === true ? "Đang hoạt động" : "Không hoạt động"
          }}</label>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="flex justify-end w-full gap-2">
        <div class="flex gap-2">
          <Button type="button" label="Đóng" icon="pi pi-times" severity="secondary" size="small"
            @click="visibleModal = false"></Button>
          <Button type="button" icon="pi pi-save" label="Lưu" size="small" @click="saveData"></Button>
        </div>
      </div>
    </template>
  </Dialog>
</template>
<script setup>
import OrgsTrucService from "@/service/OrganizationalStructureService";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import { useToast } from "primevue/usetoast";
import { getCurrentInstance, ref, watch } from "vue";

const { proxy } = getCurrentInstance();
const visibleModal = ref(false);
const messages = ref({});
const toast = useToast();
const props = defineProps({
  dataTable: Array,
});
const emits = defineEmits(["loadData"]);
const DeleteModal = ref(false);

const fixedOrgLevels = [
  { label: "Tổ chức", value: "Tổ chức" },
  { label: "Chi nhánh", value: "Chi nhánh" },
  { label: "Phòng ban", value: "Phòng ban" },
];

const OrgLevelOpts = ref([]);
const payload = ref({
  orgName: null,
  orgType: null,
  parentOrgId: null,
  isActive: true,
});

// Watch để tự động clear parentOrgId thành null khi orgType là "Tổ chức"
watch(() => payload.value.orgType, (newOrgType) => {
  if (newOrgType === "Tổ chức") {
    payload.value.parentOrgId = null;
  }
});

const clearPayload = JSON.stringify(payload.value);
const funClearPayload = () => {
  payload.value = JSON.parse(clearPayload);
};
const openDialog = async (data = null) => {

  if (data && data.id) {
    try {
      const res = await OrgsTrucService.getById(data.id);
      payload.value = res.data;
    } catch (error) { }
  } else {
    funClearPayload();
  }
  messages.value = {};
  visibleModal.value = true;
};

const saveData = async () => {
  try {
    const res = await OrgsTrucService.save(payload.value);
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
