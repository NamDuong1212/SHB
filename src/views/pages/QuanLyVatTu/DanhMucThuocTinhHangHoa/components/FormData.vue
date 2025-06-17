<template>
  <Dialog
    v-model:visible="ItemModal"
    modal
    header="Thuộc tính hàng hóa"
    :style="{ width: '50rem' }"
  >
    <div class="flex flex-col gap-3">
      <div>
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-12">
            <div class="flex flex-col gap-2">
              <label class="font-medium text-gray-700"
                >Tên thuộc tính <sup class="text-red-500">*</sup></label
              >
              <InputText
                v-model="payload.itemAttributeName"
                class="w-full"
                :invalid="messages.itemAttributeName"
                placeholder="Nhập tên thuộc tính"
              />
              <small class="text-red-500" v-if="messages.itemAttributeName">{{
                messages.itemAttributeName
              }}</small>
            </div>
          </div>
          <div class="col-span-12">
            <div class="flex flex-col gap-2">
              <label class="font-medium text-gray-700">Mô tả </label>
              <Textarea
                v-model="payload.description"
                class="w-full"
                placeholder="Nhập mô tả"
                rows="5"
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="grid grid-cols-4 gap-4">
          <div class="col-span-12">
            <DataTable :value="payload.itemAttributeLines" size="small" showGridlines>
              <Column header="#" headerStyle="width:3rem">
                <template #body="{ index }">{{ index + 1 }}</template>
              </Column>
              <Column header="Tên">
                <template #body="{ data }">
                  <InputText
                    class="w-full"
                    v-model="data.itemAttributeLineName"
                  ></InputText>
                </template>
              </Column>
              <Column
                header="Hành động"
                headerStyle="width:7rem"
                style="text-align: center"
              >
                <template #body="{ data, index }">
                  <Button
                    icon="pi pi-trash"
                    size="small"
                    text
                    severity="danger"
                    @click="removeLine(index)"
                  ></Button>
                </template>
              </Column>
            </DataTable>
            <div class="mt-3">
              <Button
                label="Thêm dòng"
                icon="pi pi-pi-trash"
                size="small"
                outlined
                @click="addLineItem"
              ></Button>
            </div>
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
          @click="ItemModal = false"
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
import ItemAttributeService from "@/service/ItemAttributeService";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import { useToast } from "primevue/usetoast";
import { getCurrentInstance, ref } from "vue";

const { proxy } = getCurrentInstance();
const ItemModal = ref(false);
const messages = ref({});
const toast = useToast();
const props = defineProps({
  dataTable: Array,
});
const emits = defineEmits(["loadData"]);

const payload = ref({
  itemAttributeName: null,
  description: null,
  isActive: true,
  itemAttributeLines: [],
});

const openDialog = async (data = null) => {
  if (data && data.id) {
    try {
      const res = await ItemAttributeService.getById(data.id);
      payload.value = res.data;
    } catch (error) {}
  } else {
    payload.value = {
      itemAttributeName: null,
      description: null,
      isActive: true,
      itemAttributeLines: [],
    };
  }
  messages.value = {};
  ItemModal.value = true;
};

const addLineItem = () => {
  payload.value.itemAttributeLines.push({
    itemAttributeLineName: null,
  });
};

const saveData = async () => {
  try {
    const res = await ItemAttributeService.save(payload.value);
    if (res) {
      proxy.$notify("S", "Thao tác thành công!", toast);
      emits("loadData");
      ItemModal.value = false;
    }
  } catch (error) {
    if (error.isValidate) {
      messages.value = error;
    } else {
      proxy.$notify("S", error?.response?.data?.Message || error, toast);
    }
  }
};

const removeLine = (index) => {
  payload.value.itemAttributeLines.splice(1, index);
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
