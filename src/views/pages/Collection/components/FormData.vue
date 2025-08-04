<template>
  <Dialog v-model:visible="visible" modal header="Tạo collection" :style="{ width: '80rem' }">
    <div class="bg-gray-50 p-4 rounded-lg">
      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-6">
          <div class="flex flex-col gap-2">
            <label class="font-medium text-gray-700">Tên collection <sup class="text-red-500">*</sup></label>
            <InputText v-model="payload.collection_name" class="w-full" placeholder="Nhập tên collection " size="small" />
            <small class="text-red-500" v-if="messages.collection_name">{{
              messages.collection_name
            }}</small>
          </div>
        </div>
        <div class="col-span-6">
          <div class="flex flex-col gap-2">
            <label class="font-medium text-gray-700">Mô tả <sup class="text-red-500">*</sup></label>
            <InputText v-model="payload.description" class="w-full" size="small" placeholder="Nhập mô tả"
              :invalid="!!messages.description" />
            <small class="text-red-500" v-if="messages.description">{{
              messages.description
            }}</small>
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
import CollectionService from "@/service/CollectionService";
import { InputText } from "primevue";
import { useToast } from "primevue/usetoast";
import { getCurrentInstance, onMounted, ref } from "vue";
const emits = defineEmits(["loadData"]);
const { proxy } = getCurrentInstance();
const toast = useToast();

onMounted(() => { });
const visible = ref(false);
const payload = ref({ collection_name: null, description: null, collection_style: 'string', creativity_level: 0.1 });
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
    const res = await CollectionService.create(payload.value);
    if (res.data) {
      proxy.$notify("S", "Thao tác thành công!", toast);
      visible.value = false;
      funClearPayload();
      // Gọi emit để refresh bảng
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
