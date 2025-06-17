<template>
  <Dialog
    v-model:visible="isModal"
    modal
    :header="payload.id ? 'Cập nhật loại tài sản' : 'Thêm mới loại tài sản'"
    :style="{ width: '90vw', maxWidth: '1000px' }"
  >
    <div class="flex flex-col gap-3">
      <TabView v-model:activeIndex="activeTab">
        <TabPanel header="Thông tin chung">
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-6">
              <div class="flex flex-col gap-2">
                <label class="font-medium text-gray-700"
                  >Mã loại<span class="text-red-500">*</span></label
                >
                <InputText
                  v-model="payload.code"
                  class="w-full"
                  placeholder="Mã loại"
                  disabled
                />
                <small class="text-red-500" v-if="messages.code">{{
                  messages.code
                }}</small>
              </div>
            </div>
            <div class="col-span-6">
              <div class="flex flex-col gap-2">
                <label class="font-medium text-gray-700"
                  >Tên loại tài sản<span class="text-red-500">*</span></label
                >
                <InputText
                  v-model="payload.name"
                  class="w-full"
                  placeholder="Tên loại tài sản"
                />
                <small class="text-red-500" v-if="messages.name">{{
                  messages.name
                }}</small>
              </div>
            </div>
            <div class="col-span-6">
              <div class="flex flex-col gap-2">
                <label class="font-medium text-gray-700"
                  >Nhóm tài sản<span class="text-red-500">*</span></label
                >
                <Dropdown
                  v-model="payload.assetGroupId"
                  :options="groupOptions"
                  optionLabel="name"
                  optionValue="id"
                  class="w-full"
                  placeholder="Chọn nhóm tài sản"
                />
                <small class="text-red-500" v-if="messages.assetGroupId">{{
                  messages.assetGroupId
                }}</small>
              </div>
            </div>
            <div class="col-span-6">
              <div class="flex flex-col gap-2">
                <label class="font-medium text-gray-700">Thông số</label>
                <MultiSelect
                  v-model="payload.deviceConfigIds"
                  :options="deviceConfigOptions"
                  optionLabel="name"
                  optionValue="id"
                  class="w-full"
                  placeholder="Chọn thông số"
                  display="chip"
                />
              </div>
            </div>
            <div class="col-span-12">
              <div class="flex flex-col gap-2">
                <label class="font-medium text-gray-700">Mô tả</label>
                <Textarea
                  v-model="payload.note"
                  class="w-full"
                  rows="3"
                  placeholder="Nhập mô tả"
                />
              </div>
            </div>
            <div class="col-span-6">
              <div class="flex flex-col gap-2">
                <div class="flex items-center gap-2 mb-2">
                  <Checkbox v-model="payload.isPerformanceGood" binary />
                  <label class="font-medium text-gray-700"
                    >Quản lý hiệu chuẩn, kiểm định thiết bị</label
                  >
                </div>
                <div class="flex items-center gap-2 mb-2">
                  <Checkbox v-model="payload.isDeviceActive" binary />
                  <label class="font-medium text-gray-700">Quản lý giá trị tài sản</label>
                </div>
                <div class="flex items-center gap-2">
                  <Checkbox v-model="payload.isWarrantyActive" binary />
                  <label class="font-medium text-gray-700"
                    >Quản lý bảo hành, bảo hiểm thiết bị</label
                  >
                </div>
              </div>
            </div>
            <div class="col-span-6">
              <div class="flex items-center gap-2">
                <ToggleSwitch v-model="payload.isActive" />
                <label class="font-medium text-gray-700">{{
                  payload.isActive ? "Đang hoạt động" : "Không hoạt động"
                }}</label>
              </div>
            </div>
          </div>
        </TabPanel>
        <TabPanel header="Thông tin chi tiết">
          <div class="flex flex-col">
            <div class="flex justify-end mb-2">
              <Button label="Thêm trường" icon="pi pi-plus" @click="addField" />
            </div>
            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-12">
                <DataTable
                  :value="filteredTypeLines"
                  class="p-datatable-sm"
                  :reorderableColumns="true"
                  @rowReorder="onRowReorder"
                >
                  <Column
                    rowReorder
                    headerStyle="width: 3rem"
                    :reorderableColumn="false"
                  />
                  <Column field="fieldName" header="Tên trường">
                    <template #body="{ data }">
                      <InputText v-model="data.fieldName" class="w-full" />
                    </template>
                  </Column>
                  <Column field="fieldType" header="Kiểu trường">
                    <template #body="{ data }">
                      <Dropdown
                        v-model="data.fieldType"
                        :options="fieldTypeOptions"
                        optionLabel="label"
                        optionValue="value"
                        class="w-full"
                      />
                    </template>
                  </Column>
                  <Column field="maxLength" header="Độ dài">
                    <template #body="{ data }">
                      <InputNumber
                        v-model="data.maxLength"
                        :disabled="data.fieldType !== 'text'"
                        class="w-full"
                      />
                    </template>
                  </Column>
                  <Column field="isRequired" header="Bắt buộc">
                    <template #body="{ data }">
                      <ToggleSwitch v-model="data.isRequired" />
                    </template>
                  </Column>
                  <Column field="isSelectable" header="Trường lựa chọn">
                    <template #body="{ data }">
                      <div class="flex items-center gap-2">
                        <ToggleSwitch v-model="data.isSelectable" />
                        <Button
                          v-if="data.isSelectable"
                          icon="pi pi-plus"
                          outlined
                          rounded
                          @click="openOptionDialog(data)"
                        />
                      </div>
                      <Dialog
                        v-model:visible="data.isOpenOption"
                        header="Tạo lựa chọn"
                        :style="{ width: '800px', minHeight: '300px' }"
                      >
                        <div class="flex justify-end mb-2">
                          <Button
                            label="Thêm"
                            icon="pi pi-plus"
                            @click="addOption(data.options)"
                          />
                        </div>
                        <DataTable
                          :value="filteredOptions(data.options)"
                          class="p-datatable-sm"
                        >
                          <Column field="value" header="#">
                            <template #body="{ index }">
                              {{ index + 1 }}
                            </template>
                          </Column>
                          <Column field="code" header="Mã trường">
                            <template #body="{ data }">
                              <InputText v-model="data.code" class="w-full" />
                            </template>
                          </Column>
                          <Column field="name" header="Tên trường">
                            <template #body="{ data }">
                              <InputText v-model="data.name" class="w-full" />
                            </template>
                          </Column>
                          <Column field="isDefault" header="Mặc định">
                            <template #body="{ data }">
                              <ToggleSwitch v-model="data.isDefault" />
                            </template>
                          </Column>
                          <Column header="Hành động">
                            <template #body="{ data, index }">
                              <Button
                                icon="pi pi-trash"
                                outlined
                                rounded
                                severity="danger"
                                @click="removeOption(data, index)"
                              />
                            </template>
                          </Column>
                        </DataTable>
                      </Dialog>
                    </template>
                  </Column>
                  <Column header="Hành động">
                    <template #body="{ data, index }">
                      <Button
                        icon="pi pi-trash"
                        outlined
                        rounded
                        severity="danger"
                        @click="removeTypeLines(data, index)"
                      />
                    </template>
                  </Column>
                </DataTable>
              </div>
            </div>
          </div>
        </TabPanel>
      </TabView>
    </div>
    <template #footer>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Huỷ"
          icon="pi pi-times"
          severity="secondary"
          @click="isModal = false"
        ></Button>
        <Button type="button" icon="pi pi-save" label="Lưu" @click="saveData"></Button>
      </div>
    </template>
  </Dialog>
</template>
<script setup>
import Button from "primevue/button";
import Checkbox from "primevue/checkbox";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import Dialog from "primevue/dialog";
import Dropdown from "primevue/dropdown";
import InputNumber from "primevue/inputnumber";
import InputText from "primevue/inputtext";
import MultiSelect from "primevue/multiselect";
import TabPanel from "primevue/tabpanel";
import TabView from "primevue/tabview";
import Textarea from "primevue/textarea";
import { useToast } from "primevue/usetoast";
import { computed, onMounted, ref } from "vue";
import AssetGroupService from "../../../../../service/AssetGroupTypeService";
import DeviceConfigService from "../../../../../service/DeviceConfigService";

const isModal = ref(false);
const messages = ref({});
const toast = useToast();
const activeTab = ref(0);

const props = defineProps({
  loadData: {
    type: Function,
    default: () => {},
  },
  dataTable: Array,
});

const payload = ref({
  id: 0,
  code: "",
  name: "",
  assetGroupId: null,
  note: "",
  isActive: true,
  isDeviceActive: false,
  isWarrantyActive: false,
  isPerformanceGood: false,
  assetTypeLines: [],
  deviceConfigIds: [],
});

// Các options cho select
const groupOptions = ref([]);
const deviceConfigOptions = ref([]);

// Kiểu trường
const fieldTypeOptions = [
  { label: "Chữ", value: "text" },
  { label: "Số", value: "number" },
  { label: "Ngày tháng", value: "date" },
  { label: "Boolean", value: "boolean" },
  { label: "Chung", value: "all" },
];

// Lọc các dòng không bị xóa
const filteredTypeLines = computed({
  get() {
    return payload.value.assetTypeLines.filter((line) => line.status !== "D");
  },
  set(value) {
    payload.value.assetTypeLines = value;
  },
});

// Lọc các option không bị xóa
const filteredOptions = (options) => {
  return options.filter((option) => option.status !== "D");
};

// Kiểm tra xem có trường nào được chọn không
const hasSelectedFields = computed(() => {
  return payload.value.assetTypeLines.some((field) => field.selected);
});

const openDialog = async (data = null) => {
  if (data && data.id) {
    payload.value = { ...data };
  } else {
    payload.value = {
      id: 0,
      code: "",
      name: "",
      assetGroupId: null,
      note: "",
      isActive: true,
      isDeviceActive: false,
      isWarrantyActive: false,
      isPerformanceGood: false,
      assetTypeLines: [],
      deviceConfigIds: [],
    };
    // Thêm một trường mẫu nếu là tạo mới
    addField();
  }
  messages.value = {};
  isModal.value = true;
};

// Thêm trường mới
const addField = () => {
  const newId =
    payload.value.assetTypeLines.length > 0
      ? Math.max(...payload.value.assetTypeLines.map((field) => field.id || 0)) + 1
      : 1;

  const newLineIndex = payload.value.assetTypeLines.length;
  payload.value.assetTypeLines.push({
    id: 0,
    line: newId,
    fieldName: "",
    fieldType: "text",
    maxLength: 100,
    lineIndex: newLineIndex,
    isRequired: false,
    isSelectable: false,
    selected: false,
    options: [],
    status: "A",
  });
};

// Xóa trường
const removeTypeLines = (data, index) => {
  if (data.id) {
    data.status = "D";
  } else {
    payload.value.assetTypeLines.splice(index, 1);
  }
};

// Mở dialog option
const openOptionDialog = (data) => {
  data.isOpenOption = true;
};

// Thêm option mới
const addOption = (options) => {
  options.push({
    code: "",
    name: "",
    isDefault: false,
    status: "A",
  });
};

// Xóa option
const removeOption = (data, index) => {
  if (data.id) {
    data.status = "D";
  } else {
    const parentField = payload.value.assetTypeLines.find((line) => line.isOpenOption);
    if (parentField && parentField.options) {
      parentField.options.splice(index, 1);
    }
  }
};

// Hàm hiển thị thông báo
const showToast = (severity, summary, detail = "") => {
  toast.add({
    severity: severity, // 'success', 'info', 'warn', 'error'
    summary: summary,
    detail: detail,
    life: 3000,
  });
};

const saveData = async () => {
  try {
    // Validate dữ liệu trước khi lưu
    // Có thể thêm validation ở đây

    const res = await AssetGroupService.save("AssetType", payload.value);
    if (payload.value.id) {
      const index = props.dataTable.findIndex((e) => e.id === res.data.id);
      props.dataTable[index] = res.data;
      showToast("success", "Cập nhật thành công", "Loại tài sản đã được cập nhật");
    } else {
      props.loadData();
      showToast("success", "Thêm mới thành công", "Loại tài sản đã được thêm mới");
    }

    isModal.value = false;
  } catch (error) {
    if (error.isValidate) {
      messages.value = error;
      showToast("error", "Lỗi dữ liệu", "Vui lòng kiểm tra lại thông tin");
    } else {
      showToast("error", "Lỗi hệ thống", "Đã xảy ra lỗi, vui lòng thử lại sau");
    }
  }
};
const onRowReorder = (event) => {
  filteredTypeLines.value = event.value;
  filteredTypeLines.value = filteredTypeLines.value.map((el, index) => ({
    ...el,
    lineIndex: index,
  }));
};
// Load dữ liệu khi component được tạo
onMounted(() => {
  // Lấy danh sách nhóm tài sản
  const getAllGroup = async () => {
    try {
      const res = await AssetGroupService.getAllGroup();
      groupOptions.value = res.data.result;
    } catch (error) {}
  };

  // Lấy danh sách thông số
  const getAllDeviceConfig = async () => {
    try {
      const res = await DeviceConfigService.getAll();
      deviceConfigOptions.value = res.data.result;
    } catch (error) {}
  };

  getAllGroup();
  getAllDeviceConfig();
});

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
