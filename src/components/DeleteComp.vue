<template>
  <Dialog v-model:visible="isOpenDelete" modal :style="{ width: '30rem' }">
    <template #header>
      <div class="flex items-center gap-2">
        <i class="pi pi-exclamation-triangle text-xl"></i>
        <span class="text-xl font-semibold">Xác nhận xóa</span>
      </div>
    </template>

    <div class="flex flex-col gap-4">
      <p class="text-gray-700">{{ content }}</p>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Hủy"
          severity="secondary"
          outlined
          @click="isOpenDelete = false"
        ></Button>
        <Button
          type="button"
          label="Xác nhận"
          severity="danger"
          @click="handleDelete"
        ></Button>
      </div>
    </template>
  </Dialog>
</template>
<script setup>
import http from "@/service/http";
import { computed } from "vue";

const props = defineProps({
  isOpenDelete: {
    type: Boolean,
    default: false,
  },
  id: {
    type: String,
    default: "",
  },
  content: {
    type: String,
    default: "",
  },
  api: {
    type: Object,
    default: () => {},
  },
  loadData: {
    type: Function,
    default: () => {},
  },
});

const emit = defineEmits(["update:isOpenDelete", "loadData"]);

const isOpenDelete = computed({
  get: () => props.isOpenDelete,
  set: (value) => emit("update:isOpenDelete", value),
});

const handleDelete = async () => {
  try {
    const res = await http.delete(`${props.api}/${props.id}`);
    if (res) {
      emit("loadData");
      isOpenDelete.value = false;
    }
  } catch (error) {}
};
</script>
<style scoped>
:deep(.p-dialog-header) {
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}

:deep(.p-dialog-content) {
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
}

:deep(.p-button.p-button-danger) {
  background: #ef4444;
}

:deep(.p-button.p-button-danger:hover) {
  background: #dc2626;
}
</style>
