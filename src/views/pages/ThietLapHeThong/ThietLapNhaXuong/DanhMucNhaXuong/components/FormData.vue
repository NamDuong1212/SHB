<template>
  <Dialog
    v-model:visible="visibleModal"
    modal
    header="Nhà xưởng"
    :style="{ width: '55rem' }"
  >
    <div class="flex flex-col gap-3">
      <div class="bg-gray-50 p-4 rounded-lg shadow-sm">
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-6">
            <div class="flex flex-col gap-2">
              <label class="font-medium text-gray-700"
                >Mã nhà xưởng <sup class="text-red-500">*</sup></label
              >
              <InputText
                v-model="payload.factoryCode"
                class="w-full"
                placeholder="Nhập mã đơn vị "
                size="small"
              />
              <small class="text-red-500" v-if="messages.factoryCode">{{
                messages.factoryCode
              }}</small>
            </div>
          </div>
          <div class="col-span-6">
            <div class="flex flex-col gap-2">
              <label class="font-medium text-gray-700"
                >Tên nhà xưởng <sup class="text-red-500">*</sup></label
              >
              <InputText
                v-model="payload.factoryName"
                class="w-full"
                size="small"
                placeholder="Nhập tên nhà xưởng "
              />
              <small class="text-red-500" v-if="messages.factoryName">{{
                messages.factoryName
              }}</small>
            </div>
          </div>
          <div class="col-span-6">
            <div class="flex flex-col gap-2">
              <label class="font-medium text-gray-700"
                >Nhóm nhà xưởng <sup class="text-red-500">*</sup></label
              >
              <SelectTreeCustome
                :disable="payload.orgStructId != null || ItemsFactory?.length < 1"
                v-model="payload.factoryGroupId"
                @change="onFactoryGrpChange"
                placeholder="Bộ phận"
                url="GroupFactory"
                optionLabel="groupFactoryName"
                optionValue="id"
              ></SelectTreeCustome>
              <small class="text-red-500" v-if="messages.factoryGroupId">{{
                messages.factoryGroupId
              }}</small>
            </div>
          </div>
          <div class="col-span-6">
            <div class="flex flex-col gap-2">
              <label class="font-medium text-gray-700"
                >Mã nhà xưởng cha <sup class="text-red-500">*</sup>
                <i
                  style="font-size: 10px"
                  class="pi pi-exclamation-circle"
                  v-tooltip.top="
                    'Nếu không chọn mã cha, vui lòng chọn \'Đơn vị quản lý\''
                  "
                ></i
              ></label>
              <Select
                v-model="payload.parentId"
                placeholder="Chọn cấp tổ chức"
                :disabled="payload.orgStructId || ItemsFactory.length < 1"
                :options="ItemsFactory"
                option-value="id"
                option-label="factoryName"
                size="small"
                fluid
              ></Select>
              <small class="text-red-500"></small>
              <small class="text-red-500" v-if="messages.orgStrtName">{{
                messages.orgStrtName
              }}</small>
            </div>
          </div>
          <div class="col-span-6">
            <div class="flex flex-col gap-2">
              <label class="font-medium text-gray-700"
                >Đơn vị quản lý<sup class="text-red-500">*</sup></label
              >
              <SelectTreeCustome
                v-model="payload.orgStructId"
                :disabled="payload.parentId"
                placeholder="Bộ phận"
                url="OrganizationalStructure"
                optionLabel="orgStrtName"
                optionValue="id"
              ></SelectTreeCustome>
              <small class="text-red-500" v-if="messages.orgStructId">{{
                messages.orgStructId
              }}</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Upload file -->
      <div class="bg-gray-50 p-4 rounded-lg shadow-sm">
        <div class="flex flex-col gap-2">
          <label class="font-medium text-gray-700">Hình ảnh & Tài liệu</label>
          <div
            class="border-2 border-dashed border-gray-300 rounded-lg p-4 transition-all hover:bg-gray-100 cursor-pointer"
          >
            <div class="flex flex-col items-center justify-center">
              <div class="flex gap-2 mb-2">
                <Button
                  @click="Openfile()"
                  icon="pi pi-cloud-upload"
                  label="Tải lên"
                  outlined
                  size="small"
                ></Button>
                <Button
                  @click="removeAllFiles()"
                  icon="pi pi-trash"
                  label="Xóa tất cả"
                  text
                  severity="danger"
                  size="small"
                  v-if="payload.files && payload.files.length > 0"
                ></Button>
              </div>
              <input
                type="file"
                multiple
                class="hidden click-file"
                @change="UploadFileLocal($event)"
                accept="image/*,application/pdf"
              />
              <span class="text-xs text-gray-500 mb-3"
                >Hỗ trợ định dạng: JPG, PNG, PDF (tối đa 5MB)</span
              >

              <!-- File Preview -->
              <div v-if="payload.files && payload.files.length > 0" class="w-full">
                <div class="grid grid-cols-3 gap-3">
                  <div
                    v-for="(file, index) in payload.files"
                    :key="index"
                    class="relative group"
                  >
                    <!-- Image Preview -->
                    <div
                      v-if="file.type.includes('image')"
                      class="border rounded-md overflow-hidden h-24 flex items-center justify-center bg-white"
                    >
                      <img
                        :src="file.url"
                        class="max-h-full object-contain"
                        :alt="file.name"
                      />
                    </div>

                    <!-- PDF Preview -->
                    <div
                      v-else-if="file.type.includes('pdf')"
                      class="border rounded-md overflow-hidden h-24 flex flex-col items-center justify-center bg-white p-2"
                    >
                      <i class="pi pi-file-pdf text-red-500 text-2xl"></i>
                      <span class="text-xs text-center truncate w-full">{{
                        file.name
                      }}</span>
                    </div>

                    <!-- File Actions -->
                    <div
                      class="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Button
                        icon="pi pi-trash"
                        severity="danger"
                        text
                        rounded
                        size="small"
                        @click="removeFile(index)"
                      ></Button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Empty State -->
              <div v-else class="flex flex-col items-center my-4">
                <i class="pi pi-image text-gray-400 text-4xl mb-2"></i>
                <span class="text-gray-500">Chưa có tệp nào được tải lên</span>
              </div>
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
      <div class="flex justify-between w-full gap-2">
        <Button
          type="button"
          label="Huỷ"
          icon="pi pi-times"
          severity="secondary"
          size="small"
          @click="visibleModal = false"
        ></Button>
        <div class="flex gap-2">
          <Button
            v-if="payload.id"
            type="button"
            label="Xoá"
            icon="pi pi-trash"
            severity="danger"
            size="small"
            @click="openDeleteDialog()"
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
  <DeleteComp
    v-model:isOpenDelete="DeleteModal"
    :id="payload.id"
    @update:isOpenDelete="onDelete()"
    :content="'Bạn có chắc chắn muốn xóa?'"
    api="UnitOfMeasure"
  ></DeleteComp>
  <Loading v-if="isLoading"></Loading>
</template>
<script setup>
import FactorySerivce from "@/service/FactoryService";
import OrgsTrucService from "@/service/OrganizationalStructureService";
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
const ItemsFactory = ref([]);
const isLoading = ref(false);
const formData = new FormData();
const emits = defineEmits(["loadData"]);
const DeleteModal = ref(false);
const OrgLevelOpts = ref([]);
const payload = ref({
  factoryCode: "",
  factoryName: "",
  factoryGroupId: null,
  orgStructId: 0,
  parentId: null,
  isActive: true,
  files: [],
});
const clearPayload = JSON.stringify(payload.value);
const funClearPayload = () => {
  payload.value = JSON.parse(clearPayload);
};
const openDialog = async (data = null) => {
  fetchOrgLevel();
  if (data && data.id) {
    try {
      payload.value = {
        ...data,
        files: data.factoryImages.map((el) => ({
          name: el.imageName,
          type: "image",
          url: el.imageUrl,
        })),
      };
      if (!payload.value.files) {
        payload.value.files = [];
      }
    } catch (error) {}
  } else {
    funClearPayload();
  }
  messages.value = {};
  visibleModal.value = true;
};

const Openfile = () => {
  document.querySelector(".click-file").click();
};

const UploadFileLocal = async (event) => {
  const files = event.target.files;
  if (!files || files.length === 0) return;

  if (!payload.value.files) {
    payload.value.files = [];
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    // Kiểm tra kích thước file (5MB)
    if (file.size > 5 * 1024 * 1024) {
      proxy.$notify("E", `Tệp "${file.name}" vượt quá 5MB`, toast);
      continue;
    }
    // Thêm file vào danh sách hiển thị
    payload.value.files.push({
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
      file: file,
    });
  }

  // Reset input file
  event.target.value = "";

  proxy.$notify("S", "Đã thêm tệp vào danh sách", toast);
};

const removeFile = (index) => {
  if (payload.value.files && payload.value.files.length > index) {
    payload.value.files.splice(index, 1);
  }
};

const removeAllFiles = () => {
  payload.value.files = [];
  formData.delete("files");
};

const openDeleteDialog = () => {
  DeleteModal.value = true;
};
const saveData = async () => {
  isLoading.value = true;
  try {
    if (payload.value.files && payload.value.files.length > 0) {
      payload.value.files.forEach((fileItem, index) => {
        if (fileItem.file) {
          formData.append(`Files`, fileItem.file);
        }
      });
    }
    formData.append("Model", JSON.stringify(payload.value));
    const res = await FactorySerivce.save(payload.value, formData);
    if (res) {
      proxy.$notify("S", "Thao tác thành công!", toast);
      emits("loadData");
      visibleModal.value = false;
    }
  } catch (error) {
  } finally {
    isLoading.value = false;
    formData.delete("Model");
    formData.delete("Files");
  }
};
const onDelete = () => {
  proxy.$notify("S", "Xóa thành công!", toast);
  emits("loadData");
  visibleModal.value = false;
};
const fetchOrgLevel = async () => {
  try {
    const res = await OrgsTrucService.getOrgLevels();
    OrgLevelOpts.value = res.data.result;
  } catch (error) {}
};
defineExpose({
  openDialog,
});
const onFactoryGrpChange = async (e) => {
  try {
    const res = await FactorySerivce.getByGroupFactory(e);
    ItemsFactory.value = res.data.result;
  } catch (error) {}
};
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

.p-button.p-button-outlined {
  background-color: white;
  border: 1px solid #3b82f6;
  color: #3b82f6;
}

.p-button.p-button-outlined:hover {
  background-color: #eff6ff;
  border: 1px solid #3b82f6;
  color: #3b82f6;
}
</style>
