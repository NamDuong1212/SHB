<template>
  <Dialog
    v-model:visible="visibleModal"
    modal
    :header="payload.id ? 'Cập nhật vật tư hàng hóa' : 'Thêm vật tư hàng hóa'"
    :style="{ width: '100rem' }"
  >
    <div class="grid grid-cols-12 gap-5">
      <div class="col-span-9">
        <h3 class="text-lg font-medium text-blue-800 mb-3">Thông tin chung</h3>
        <div class="grid grid-cols-12 gap-5">
          <div class="col-span-2">
            <div class="flex flex-col gap-2">
              <label class="font-medium text-gray-700"
                >Tiền tố <sup class="text-red-500">*</sup></label
              >
              <Select
                placeholder="Chọn tiền tố"
                v-model="payload.suffix"
                class="w-full"
                :invalid="!!messages.suffix"
                :options="['MST']"
                size="small"
              />
            </div>
            <small class="text-red-500" v-if="!!messages.suffix">{{
              messages.suffix
            }}</small>
          </div>
          <div class="col-span-4">
            <div class="flex flex-col gap-2">
              <label class="font-medium text-gray-700">Mã vật tư hàng hóa </label>
              <InputText
                v-model="payload.itemCode"
                class="w-full"
                disabled
                placeholder="Nhập mã hàng hóa"
                size="small"
              />
            </div>
          </div>
          <div class="col-span-6">
            <div class="flex flex-col gap-2">
              <label class="font-medium text-gray-700">Mã cũ</label>
              <InputText
                v-model="payload.itemOlderCode"
                option-value="value"
                option-label="label"
                placeholder="Nhập mã cũ"
                size="small"
              ></InputText>
            </div>
          </div>
          <div class="col-span-6">
            <div class="flex flex-col gap-2">
              <label class="font-medium text-gray-700"
                >Tên vật tư, hàng hóa <sup class="text-red-500">*</sup></label
              >
              <InputText
                class="w-full"
                placeholder="Nhập tên hàng hóa"
                size="small"
                v-model="payload.itemName"
                :invalid="!!messages.itemName"
              />
            </div>
            <small class="text-red-500" v-if="!!messages.itemName">{{
              messages.unitOfMeasureGroupId
            }}</small>
          </div>
          <div class="col-span-6">
            <div class="flex flex-col gap-2">
              <label class="font-medium text-gray-700">Tên gọi khác </label>
              <InputText
                v-model="payload.itemOrtherName"
                class="w-full"
                placeholder="Nhập tên khác"
                size="small"
              />
            </div>
          </div>
          <div class="col-span-6">
            <div class="flex flex-col gap-2">
              <label class="font-medium text-gray-700"
                >Nhóm đơn vị tính <sup class="text-red-500">*</sup></label
              >
              <Select
                v-model="payload.unitOfMeasureGroupId"
                option-value="id"
                placeholder="Chọn nhóm đơn vị tính"
                option-label="unitGroupName"
                :options="UnitGrpOpts"
                @change="getUnitByGroup(payload.unitOfMeasureGroupId)"
                size="small"
                :invalid="!!messages.unitOfMeasureGroupId"
              ></Select>
            </div>
            <small class="text-red-500" v-if="!!messages.unitOfMeasureGroupId">{{
              messages.unitOfMeasureGroupId
            }}</small>
          </div>
          <div class="col-span-6">
            <div class="flex flex-col gap-2">
              <label class="font-medium text-gray-700"
                >Nhóm hàng hóa <sup class="text-red-500">*</sup></label
              >
              <SelectTreeCustome
                v-model="payload.itemGroupId"
                placeholder="Chọn nhóm hàng hóa"
                url="ItemGroup"
                optionLabel="itemGroupName"
                optionValue="id"
                :invalid="!!messages.itemGroupId"
              ></SelectTreeCustome>
            </div>
            <small class="text-red-500" v-if="!!messages.itemGroupId">{{
              messages.unitOfMeasureGroupId
            }}</small>
          </div>
          <div class="col-span-12">
            <div class="grid grid-cols-4">
              <div class="flex items-center gap-2">
                <Checkbox binary v-model="payload.isStock" />
                <label> Hàng lưu kho </label>
              </div>
              <div class="flex items-center gap-2">
                <Checkbox binary v-model="payload.isPurchase" />
                <label> Hàng mua </label>
              </div>
              <div class="flex items-center gap-2">
                <Checkbox binary v-model="payload.isSale" />
                <label> Hàng bán </label>
              </div>
              <div class="flex items-center gap-2">
                <Checkbox binary v-model="payload.isCentralized" />
                <label> Hàng mua sắm tập trung </label>
              </div>
            </div>
          </div>
          <div class="col-span-12">
            <div class="flex flex-col gap-2">
              <label class="font-medium text-gray-700">Trạng thái </label>
              <InputSwitch v-model="payload.isActive" size="small" />
            </div>
          </div>
        </div>
      </div>
      <div class="col-span-3">
        <UploadImage v-model="payload.itemImage"></UploadImage>
      </div>
      <div class="col-span-12">
        <Tabs value="0" class="w-full">
          <TabList class="border-b border-gray-200">
            <Tab value="0" class="p-3 hover:bg-gray-50 transition-colors">
              Thông tin chung
            </Tab>
            <Tab value="1" class="p-3 hover:bg-gray-50 transition-colors">
              Thông tin mua hàng
            </Tab>
            <Tab value="2" class="p-3 hover:bg-gray-50 transition-colors">
              Kho và kế hoạch
            </Tab>
            <Tab value="3" class="p-3 hover:bg-gray-50 transition-colors">
              Thuộc tính
            </Tab>
            <Tab value="4" class="p-3 hover:bg-gray-50 transition-colors"> Ghi chú </Tab>
            <Tab value="5" class="p-3 hover:bg-gray-50 transition-colors"> Đính kèm </Tab>
          </TabList>
          <TabPanels class="p-4">
            <TabPanel value="0">
              <div class="grid grid-cols-12 gap-5 items-center">
                <div class="col-span-4">
                  <div class="flex flex-col gap-2">
                    <label class="font-medium text-gray-700">Nhà sản xuất</label>
                    <InputText
                      class="w-full"
                      placeholder="Nhập nội dung"
                      size="small"
                      v-model="payload.manufacturer"
                    />
                  </div>
                </div>
                <div class="col-span-4">
                  <div class="flex flex-col gap-2">
                    <label class="font-medium text-gray-700">Thông số kỹ thuật</label>
                    <InputText
                      class="w-full"
                      placeholder="Nhập nội dung"
                      size="small"
                      v-model="payload.specifications"
                    />
                  </div>
                </div>
                <div class="col-span-4">
                  <div class="flex flex-col gap-2">
                    <label class="font-medium text-gray-700">Quy cách hàng hóa</label>
                    <InputText
                      class="w-full"
                      placeholder="Chọn nội dung"
                      size="small"
                      v-model="payload.itemStandard"
                    />
                  </div>
                </div>
                <div class="col-span-4">
                  <div class="flex flex-col gap-2">
                    <label class="font-medium text-gray-700">Tính chất</label>
                    <InputText
                      class="w-full"
                      placeholder="Nhập nội dung"
                      size="small"
                      v-model="payload.properties"
                    />
                  </div>
                </div>
                <div class="col-span-4">
                  <div class="flex flex-col gap-2">
                    <label class="font-medium text-gray-700">Tuổi mẫu</label>
                    <InputText
                      class="w-full"
                      v-model="payload.sampleAge"
                      placeholder="Nhập nội dung"
                      size="small"
                    />
                  </div>
                </div>
              </div>
            </TabPanel>
            <TabPanel value="1">
              <div class="grid grid-cols-12 gap-5">
                <div class="col-span-6 flex flex-col gap-4">
                  <div class="flex flex-col gap-2">
                    <label class="font-medium text-gray-700">Nhà cung cấp chính</label>
                    <Select
                      class="w-full"
                      size="small"
                      :options="Supplier"
                      option-label="supplierName"
                      option-value="id"
                      placeholder="Chọn nhà cung cấp"
                      v-model="payload.mainSupplierId"
                    />
                  </div>
                  <div class="flex flex-col gap-2">
                    <label class="font-medium text-gray-700">Đơn vị tính mua hàng</label>
                    <Select
                      class="w-full"
                      size="small"
                      :options="Unit"
                      option-label="replacementUnitOfMeasure.unitName"
                      option-value="replacementUnitOfMeasureId"
                      placeholder="Chọn đơn vị tính"
                      v-model="payload.purchaseUnitId"
                    />
                  </div>
                  <div class="flex flex-col gap-2">
                    <label class="font-medium text-gray-700">Khối lượng</label>
                    <InputNumber
                      class="w-full"
                      placeholder="Nhập khối lượng"
                      size="small"
                      v-model="payload.weight"
                    />
                  </div>
                </div>
                <div class="col-span-6 flex flex-col gap-4">
                  <div class="flex flex-col gap-2">
                    <label class="font-medium text-gray-700">Chiều dài</label>
                    <InputNumber
                      class="w-full"
                      placeholder="Nhập chiều dài"
                      size="small"
                      v-model="payload.length"
                    />
                  </div>
                  <div class="flex flex-col gap-2">
                    <label class="font-medium text-gray-700">Chiều rộng</label>
                    <InputNumber
                      class="w-full"
                      size="small"
                      placeholder="Nhập chiều rộng"
                      v-model="payload.width"
                    />
                  </div>
                  <div class="flex flex-col gap-2">
                    <label class="font-medium text-gray-700">Chiều cao</label>
                    <InputNumber
                      class="w-full"
                      size="small"
                      placeholder="Nhập chiều cao"
                      v-model="payload.height"
                    />
                  </div>
                </div>
              </div>
            </TabPanel>
            <TabPanel value="2">
              <div class="grid grid-cols-12 gap-5">
                <div class="col-span-6 flex flex-col gap-4">
                  <div class="flex flex-col gap-2">
                    <label class="font-medium text-gray-700">Đơn vị tính lưu kho</label>
                    <Select
                      class="w-full"
                      size="small"
                      :options="Unit"
                      option-label="replacementUnitOfMeasure.unitName"
                      option-value="replacementUnitOfMeasureId"
                      placeholder="Chọn đơn vị tính"
                      v-model="payload.storageUnitId"
                    />
                  </div>
                  <div class="flex flex-col gap-2">
                    <label class="font-medium text-gray-700">Tồn kho tối thiểu</label>
                    <InputNumber
                      class="w-full"
                      size="small"
                      placeholder="Nhập tồn kho tối thiểu"
                      v-model="payload.minStock"
                    />
                  </div>
                  <div class="flex flex-col gap-2">
                    <label class="font-medium text-gray-700">Tồn kho tối đa</label>
                    <InputNumber
                      class="w-full"
                      size="small"
                      placeholder="Nhập tồn kho tối đa"
                      v-model="payload.maxStock"
                    />
                  </div>
                </div>
                <div class="col-span-6 flex flex-col gap-4">
                  <div class="flex flex-col gap-2">
                    <label class="font-medium text-gray-700"
                      >Số lượng mua tối thiểu</label
                    >
                    <InputNumber
                      class="w-full"
                      size="small"
                      placeholder="Nhập số lượng"
                      v-model="payload.minPurchaseQuantity"
                    />
                  </div>
                  <div class="flex flex-col gap-2">
                    <label class="font-medium text-gray-700"
                      >Thời gian thực hiện đơn hàng</label
                    >
                    <InputNumber
                      class="w-full"
                      size="small"
                      placeholder="Nhập số ngày"
                      v-model="payload.orderProcessingTime"
                    />
                  </div>
                  <div class="flex flex-col gap-2">
                    <label class="font-medium text-gray-700"
                      >Thời gian cho phép chênh lệch</label
                    >
                    <InputNumber
                      class="w-full"
                      size="small"
                      v-model="payload.allowedTime"
                      placeholder="Nhập số ngày"
                    />
                  </div>
                </div>
              </div>
            </TabPanel>
            <TabPanel value="3">
              <div>
                <div class="flex flex-col gap-2">
                  <span class="font-bold">Thuộc tính hàng hóa</span>
                  <AutoComplete
                    v-model="selectAttribute"
                    dropdown
                    placeholder="Chọn thuộc tính"
                    class="w-1/2"
                    option-label="itemAttributeName"
                    @change="changeAttribute"
                    :suggestions="ItemAttribute"
                    @complete="searchAttribute"
                  />
                </div>
                <Accordion value="0">
                  <AccordionPanel
                    v-for="(tab, index) in payload.itemAttributeMain"
                    :key="tab.itemAttributeId"
                    :value="index"
                  >
                    <AccordionHeader>
                      <div class="flex justify-between w-full">
                        <span>{{ tab?.itemAttribute?.itemAttributeName }}</span>
                      </div>
                    </AccordionHeader>
                    <AccordionContent>
                      <MultiSelect
                        class="w-full"
                        filter
                        size="small"
                        maxSelectedLabels="5"
                        selectedItemsLabel="Đã chọn {0} giá trị"
                        placeholder="Chọn giá trị"
                        display="chip"
                        option-label="itemAttributeLineName"
                        option-value="id"
                        :options="tab?.itemAttribute?.itemAttributeLines"
                        v-model="tab.itemAttributeLine"
                      ></MultiSelect>
                    </AccordionContent>
                  </AccordionPanel>
                </Accordion>
              </div>
            </TabPanel>
            <TabPanel value="4">
              <div>
                <Textarea
                  rows="5"
                  cols="12"
                  v-model="payload.notes"
                  class="w-full"
                  placeholder="Nhập thông tin ghi chú"
                ></Textarea>
              </div>
            </TabPanel>
            <TabPanel value="5">
              <UploadDocument v-model="payload.itemFile"></UploadDocument>
            </TabPanel>
          </TabPanels>
        </Tabs>
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
import SelectTreeCustome from "@/components/SelectTree/SelectTreeCustome.vue";
import UploadDocument from "@/components/UploadDocument.vue";
import UploadImage from "@/components/UploadImage.vue";
import ItemAttributeService from "@/service/ItemAttributeService";
import ItemService from "@/service/ItemService";
import SupplierService from "@/service/SupplierService";
import UnitOfMeasureGroupSerivce from "@/service/UnitOfMeasureGroupSerivce";
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
  loadData: {
    type: Function,
    default: () => {},
  },
});
const UnitGrpOpts = ref([]);
const Supplier = ref([]);
const Unit = ref([]);
const ItemAttribute = ref([]);
const selectAttribute = ref();

const payload = ref({
  suffix: "MST",
  itemCode: "",
  itemOlderCode: "",
  itemName: "",
  itemOrtherName: "",
  itemGroupId: null,
  unitOfMeasureGroupId: null,
  isPurchase: false,
  isStock: false,
  isCentralized: false,
  isSale: false,
  manufacturer: "",
  specifications: "",
  itemStandard: "",
  properties: "",
  sampleAge: "",
  isActive: true,
  mainSupplierId: null,
  purchaseUnitId: null,
  weight: 1,
  length: 1,
  width: 1,
  height: 1,
  storageUnitId: null,
  minStock: 1,
  maxStock: 1,
  minPurchaseQuantity: 1,
  orderProcessingTime: 1,
  allowedTime: 1,
  notes: "",
  itemAttributeMain: [],
  itemImage: [],
  itemFile: [],
});
const dataClear = JSON.stringify(payload.value);

const openDialog = async (data = null) => {
  isLoading.value = true;
  if (data.id) {
    payload.value = await getByIdItem(data.id);
    if (payload.value.itemAttributeMain.length) {
      payload.value.itemAttributeMain.forEach((item) => {
        item.itemAttributeLineClone = item.itemAttributeLine;
        item.itemAttributeLine = item.itemAttributeLine.flatMap(
          (e) => e.itemAttributeLineId
        );
      });
    }
  } else {
    payload.value = JSON.parse(dataClear);
  }
  await getAllGroupUnit();
  await getAllSupplier();
  messages.value = {};
  visibleModal.value = true;
  isLoading.value = false;
};

const saveData = async () => {
  try {
    isLoading.value = true;
    await ItemService.save(payload.value);
    proxy.$notify("S", "Thao tác thành công!", toast);
    visibleModal.value = false;
    props.loadData();
  } catch (error) {
    if (error.isValidate) {
      messages.value = error;
    } else {
      proxy.$notify("E", error?.response?.data?.Message || error, toast);
    }
  } finally {
    isLoading.value = false;
  }
};

const getAllGroupUnit = async () => {
  try {
    const res = await UnitOfMeasureGroupSerivce.getAll();
    UnitGrpOpts.value = res.data.result;
  } catch (error) {}
};

const getAllSupplier = async () => {
  try {
    const res = await SupplierService.getAll();
    Supplier.value = res.data.result;
  } catch (error) {}
};

const getUnitByGroup = async (id) => {
  try {
    const res = await UnitOfMeasureGroupSerivce.getById(id);
    if (res.data) Unit.value = res.data.unitOfMeasureGroupLines;
  } catch (error) {}
};

const searchAttribute = async () => {
  try {
    const res = await ItemAttributeService.getAll();
    ItemAttribute.value = res.data.result;
  } catch (error) {
    console.log(error);
  }
};

const getByIdItem = async (id) => {
  try {
    const res = await ItemService.getById(id);
    return res.data;
  } catch (error) {
    return {};
  }
};

const changeAttribute = (e) => {
  const issetItem = payload.value.itemAttributeMain.find(
    (item) => item.itemAttributeId === e.value.id
  );

  if (issetItem == undefined)
    payload.value.itemAttributeMain.push({
      id: null,
      lineId: null,
      itemAttributeId: e.value.id,
      itemAttribute: e.value,
      itemAttributeLine: [],
    });

  setTimeout(() => {
    selectAttribute.value = "";
  }, 100);
};

defineExpose({
  openDialog,
});
</script>
