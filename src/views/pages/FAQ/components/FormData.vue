<template>
  <Dialog v-model:visible="visible" modal header="FAQ" :style="{ width: '55rem' }">
    <div class="flex flex-col gap-3">
      <div class="bg-gray-50 p-4 rounded-lg shadow-sm">
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-12">
            <div class="flex flex-col gap-2">
              <label class="font-medium text-gray-700">Tiêu đề <sup class="text-red-500">*</sup></label>
              <InputText v-model="payload.organizationLevelName" :invalid="messages.organizationLevelName"></InputText>
              <small class="text-red-500">{{ messages.organizationLevelName }}</small>
            </div>
          </div>
          <div class="col-span-12">
            <div class="flex flex-col gap-2">
              <label class="font-medium text-gray-700">Hình ảnh </label>
              <FileUpload></FileUpload>
            </div>
          </div>
          <div class="col-span-12">
            <div class="flex flex-col gap-2">
              <label class="font-medium text-gray-700">Danh sách FAQ </label>
              <DataTable :value="[]">
                <Column header="#"></Column>
                <Column header="Câu hỏi"></Column>
                <Column header="Câu trả lời"></Column>
                <Column header="Hành động"></Column>
                <template #footer>
                  <Button label="Thêm dòng" size="small" icon="pi pi-plus" outlined></Button>
                </template>
              </DataTable>
            </div>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="flex justify-end gap-2">
        <Button size="small" type="button" icon="pi pi-times" label="Đóng" severity="secondary"
          @click="visible = false"></Button>
        <Button type="button" size="small" label="Lưu" icon="pi pi-save" @click="saveData"></Button>
      </div>
    </template>
  </Dialog>
</template>
<script setup>
import OrganizationalService from "@/service/OrganizationalService";
import { useToast } from "primevue/usetoast";
import { getCurrentInstance, onMounted, ref } from "vue";
const emits = defineEmits(["loadData"]);
const { proxy } = getCurrentInstance();
const toast = useToast();

onMounted(() => { });
const visible = ref(false);
const payload = ref({ isActive: true });
const clearPayload = JSON.stringify(payload.value);
const messages = ref({});
const openDialog = async (data = null) => {
  if (data.id) {
    payload.value = { ...data };
  } else {
    funClearPayload();
    messages.value = {};
  }
  visible.value = true;
};
const saveData = async () => {
  try {
    const res = await OrganizationalService.save(payload.value);
    if (res.data) {
      proxy.$notify("S", "Thao tác thành công!", toast);
      visible.value = false;
      funClearPayload();
      emits("loadData");
    }
  } catch (error) {
    if (error.isValidate) {
      messages.value = error;
    } else {
      proxy.$notify("E", error?.response.data?.Message, toast);
    }
  }
};

const funClearPayload = () => {
  payload.value = JSON.parse(clearPayload);
};
defineExpose({
  openDialog,
});
</script>
<style></style>
