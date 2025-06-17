<script setup>
import DeleteComps from "@/components/DeleteComps.vue";
import tableDoc from "@/components/table/tableBasic.vue";
import { renderInputFilter } from "@/composables/renderFilter";
import format from "@/helper/format";
import { FilterMatchMode, FilterOperator } from "@primevue/core/api";
import Button from "primevue/button";
import Tag from "primevue/tag";
import { h, onBeforeMount, ref } from "vue";
import FormData from "../components/FormData.vue";

const dialogRef = ref();
const filters = ref(null);
const TableBasic = ref();
const dataSelection = ref([]);
const modelDialogDelete = ref(false);

const columns = ref([
  {
    field: "itemCode",
    header: "Mã hàng hóa",
    sortable: true,
    display: true,
    renderFilter: renderInputFilter(),
    renderValue: (rowData) =>
      h(
        "button",
        {
          class: "text-blue-600 font-semibold cursor-pointer hover:underline",
          onClick: () => openAddDialog(rowData),
        },
        rowData.itemCode
      ),
  },
  {
    field: "itemName",
    header: "Tên hàng hóa",
    sortable: false,
    display: true,
    renderFilter: renderInputFilter(),

    renderValue: (rowData) => h("span", {}, rowData.itemName),
  },
  {
    field: "itemOrtherName",
    header: "Tên gọi khác",
    sortable: false,
    display: true,
    renderValue: (rowData) => h("span", {}, rowData.itemOrtherName),
  },
  {
    field: "itemGroup",
    header: "Nhóm hàng hóa",
    sortable: false,
    display: true,
    renderValue: (rowData) => h("span", {}, rowData?.itemGroup?.itemGroupName),
  },
  {
    field: "unitOfMeasureGroup",
    header: "Nhóm ĐVT",
    sortable: false,
    display: true,
    renderValue: (rowData) => h("span", {}, rowData?.unitOfMeasureGroup?.unitGroupName),
  },
  {
    field: "isActive",
    header: "Trạng thái",
    display: true,
    showFilterMatchModes: false,
    renderValue: (rowData) => {
      const severityMap = {
        true: "success",
        false: "danger",
      };
      return h(Tag, {
        value: rowData.isActive === true ? "Đang hoạt động" : "Ngừng hoạt động",
        severity: severityMap[rowData.isActive] || null,
      });
    },
  },
]);

onBeforeMount(() => {
  initFilters();
});

const initFilters = () => {
  filters.value = {
    Search: { value: null, matchMode: FilterMatchMode.CONTAINS },
    itemCode: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    itemName: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
  };
};
const openAddDialog = (data) => {
  dialogRef.value?.openDialog(data);
};
const refreshData = () => {
  TableBasic.value?.refresh();
};
</script>

<template>
  <tableDoc
    ref="TableBasic"
    header="Danh mục hàng hóa"
    :columns="columns"
    :filters="filters"
    apiEndpoint="Item"
    v-model:selection="dataSelection"
    @resetFilter="initFilters"
    :isExpanded="true"
  >
    <template #header>
      <Button
        :disabled="!dataSelection.length"
        @click="modelDialogDelete = true"
        label="Xóa"
        icon="pi pi-trash"
        severity="danger"
        size="small"
      ></Button>
      <Button
        @click="openAddDialog"
        type="button"
        icon="pi pi-plus"
        severity="primary"
        label="Thêm mới"
        size="small"
      />
    </template>
    <template #expansion="{ data }">
      <div class="card">
        <Tabs value="0">
          <TabList>
            <Tab value="0"> Thông tin chung</Tab>
            <Tab value="1">Thông tin mua hàng</Tab>
            <Tab value="2">Kho và kế hoạch</Tab>
            <Tab value="3">Thuộc tính</Tab>
            <Tab value="4">Ghi chú</Tab>
            <Tab value="5">Tài liệu đính kèm</Tab>
          </TabList>
          <TabPanels>
            <TabPanel value="0">
              <div class="grid grid-cols-12">
                <div class="col-span-3">
                  <Galleria :value="data.itemImage">
                    <template #item="slotProps">
                      <img
                        :src="slotProps.item.fileUrl"
                        :alt="slotProps.item.fileName"
                        style="width: 330px; height: 200px"
                        class="object-cover"
                      />
                    </template>
                    <template #thumbnail="slotProps">
                      <img
                        :src="slotProps.item.fileUrl"
                        :alt="slotProps.item.fileName"
                        style="width: 50px; height: 50px"
                        class="object-cover"
                      />
                    </template>
                  </Galleria>
                </div>
                <div class="col-span-9 px-5 py-3">
                  <div class="grid grid-cols-12 gap-6">
                    <div class="col-span-6 border-b py-2">
                      <div class="flex justify-between">
                        <b>Thông số kỹ thuật</b>
                        <span>{{ data.specifications }}</span>
                      </div>
                    </div>
                    <div class="col-span-6 border-b py-2">
                      <div class="flex justify-between">
                        <b>Nhà sản xuất</b>
                        <span>{{ data.manufacturer }}</span>
                      </div>
                    </div>
                    <div class="col-span-6 border-b py-2">
                      <div class="flex justify-between">
                        <b>Quy cách bao bì</b>
                        <span>{{ data.itemStandard }}</span>
                      </div>
                    </div>
                    <div class="col-span-6 border-b py-2">
                      <div class="flex justify-between">
                        <b>Tính chất</b>
                        <span>{{ data.properties }}</span>
                      </div>
                    </div>
                    <div class="col-span-6 border-b py-2">
                      <div class="flex justify-between">
                        <b>Tuổi mẫu</b>
                        <span>{{ data.sampleAge }}</span>
                      </div>
                    </div>
                    <div class="col-span-12">
                      <div class="grid grid-cols-4">
                        <div class="flex items-center gap-2">
                          <Checkbox binary v-model="data.isStock" disabled />
                          <label> Hàng lưu kho </label>
                        </div>
                        <div class="flex items-center gap-2">
                          <Checkbox binary v-model="data.isPurchase" disabled />
                          <label> Hàng mua </label>
                        </div>
                        <div class="flex items-center gap-2">
                          <Checkbox binary v-model="data.isSale" disabled />
                          <label> Hàng bán </label>
                        </div>
                        <div class="flex items-center gap-2">
                          <Checkbox binary v-model="data.isCentralized" disabled />
                          <label> Hàng mua sắm tập trung </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>
            <TabPanel value="1">
              <div class="grid grid-cols-12">
                <div class="col-span-12">
                  <div class="grid grid-cols-12 gap-6">
                    <div class="col-span-6 border-b py-2">
                      <div class="flex justify-between">
                        <b>Nhà cung cấp chính</b>
                        <span>{{ data.mainSupplier?.supplierName }}</span>
                      </div>
                    </div>
                    <div class="col-span-6 border-b py-2">
                      <div class="flex justify-between">
                        <b>Chiều dài</b>
                        <span>{{ data.length }}</span>
                      </div>
                    </div>
                    <div class="col-span-6 border-b py-2">
                      <div class="flex justify-between">
                        <b>Đơn vị tính mua hàng</b>
                        <span>{{ data?.purchaseUnit?.unitName }}</span>
                      </div>
                    </div>
                    <div class="col-span-6 border-b py-2">
                      <div class="flex justify-between">
                        <b>Chiều rộng</b>
                        <span>{{ data.width }}</span>
                      </div>
                    </div>
                    <div class="col-span-6 border-b py-2">
                      <div class="flex justify-between">
                        <b>Khối lượng</b>
                        <span>{{ data.weight }}</span>
                      </div>
                    </div>
                    <div class="col-span-6 border-b py-2">
                      <div class="flex justify-between">
                        <b>Chiều cao</b>
                        <span>{{ data.height }}</span>
                      </div>
                    </div>
                    <div class="col-span-6 border-b py-2">
                      <div class="flex justify-between">
                        <b>Thể tích</b>
                        <span>{{ data.volumn }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>
            <TabPanel value="2">
              <div class="grid grid-cols-12">
                <div class="col-span-12">
                  <div class="grid grid-cols-12 gap-6">
                    <div class="col-span-6 border-b py-2">
                      <div class="flex justify-between">
                        <b>Đơn vị tính lưu kho</b>
                        <span>{{ data?.storageUnit?.unitName }}</span>
                      </div>
                    </div>
                    <div class="col-span-6 border-b py-2">
                      <div class="flex justify-between">
                        <b>Số lượng mua tối thiểu</b>
                        <span>{{ data.minPurchaseQuantity }}</span>
                      </div>
                    </div>
                    <div class="col-span-6 border-b py-2">
                      <div class="flex justify-between">
                        <b>Tồn kho tối thiểu</b>
                        <span>{{ data.minStock }}</span>
                      </div>
                    </div>
                    <div class="col-span-6 border-b py-2">
                      <div class="flex justify-between">
                        <b>Thời gian thực hiện đơn hàng</b>
                        <span>{{ data.orderProcessingTime }}</span>
                      </div>
                    </div>
                    <div class="col-span-6 border-b py-2">
                      <div class="flex justify-between">
                        <b>Tồn kho tối đa</b>
                        <span>{{ data.maxStock }}</span>
                      </div>
                    </div>
                    <div class="col-span-6 border-b py-2">
                      <div class="flex justify-between">
                        <b>Thời gian cho phép chênh lệch</b>
                        <span>{{ data.allowedTime }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>
            <TabPanel value="3">
              <div class="grid grid-cols-12">
                <div class="col-span-12">
                  <div class="grid grid-cols-12 gap-6">
                    <div
                      class="col-span-6 border-b py-2"
                      v-for="item in data.itemAttributeMain"
                    >
                      <div class="flex justify-between">
                        <b>{{ item.itemAttribute.itemAttributeName }}</b>
                        <span>{{
                          item.itemAttribute.itemAttributeLines
                            .flatMap((e) => e.itemAttributeLineName)
                            .join(",")
                        }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>
            <TabPanel value="4">
              <div class="grid grid-cols-12">
                <div class="col-span-12">
                  <div class="flex flex-wrap-reverse">
                    <p class="whitespace-pre-line">
                      {{ data.notes }}
                    </p>
                  </div>
                </div>
              </div>
            </TabPanel>
            <TabPanel value="5">
              <div class="grid grid-cols-12">
                <div class="col-span-12">
                  <DataTable :value="data.itemFile" size="small">
                    <Column header="Tên tệp tin" field="fileName">
                      <template #body="{ data }">
                        <a
                          class="text-blue-500 hover:underline cursor-pointer"
                          :href="data.fileUrl"
                          target="_blank"
                          >{{ data.fileName }}</a
                        >
                      </template>
                    </Column>
                    <Column header="Ghi chú" field="notes"></Column>
                    <Column header="Ngày tạo" field="createdAt">
                      <template #body="{ data }">
                        <span>{{ format.date(data.createdAt) }}</span>
                      </template>
                    </Column>
                  </DataTable>
                </div>
              </div>
            </TabPanel>
          </TabPanels>
          <Divider></Divider>
          <div class="flex justify-end gap-3">
            <Button
              label="Cập nhật"
              icon="pi pi-pencil"
              size="small"
              @click="openAddDialog(data)"
            ></Button>
            <Button
              label="Xóa"
              icon="pi pi-trash"
              severity="danger"
              size="small"
            ></Button>
          </div>
        </Tabs>
      </div>
    </template>
  </tableDoc>
  <FormData ref="dialogRef" :loadData="refreshData"></FormData>
  <DeleteComps
    v-model:isOpenDelete="modelDialogDelete"
    :ids="dataSelection.flatMap((e) => e.id)"
    @update:isOpenDelete="refreshData()"
    :content="`Bạn có chắc chắn muốn xóa ${dataSelection.length} bản ghi không ?`"
    api="Item"
  ></DeleteComps>
</template>
