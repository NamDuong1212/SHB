<script setup>
import tableDoc from "@/components/table/tableBasic.vue";
import { renderDropdownFilter, renderInputFilter } from "@/composables/renderFilter";
import { FilterMatchMode, FilterOperator } from "@primevue/core/api";
import Button from "primevue/button";
import Tag from "primevue/tag";
import { h, onBeforeMount, ref } from "vue";
import FormData from "../components/FormData.vue";
const dialogRef = ref();
const filters = ref(null);
const TableBasic = ref();
const modelDialogDelete = ref(false);
const dataSelection = ref([]);

const columns = ref([
  {
    field: "supplierCode",
    header: "Mã nhà cung cấp",
    display: true,
    renderFilter: renderInputFilter(),
    renderValue: (rowData) =>
      h(
        "span",
        {
          class: "text-blue-600 font-semibold cursor-pointer",
          onClick: () => openAddDialog(rowData),
        },
        rowData.supplierCode
      ),
  },
  {
    field: "supplierName",
    header: "Tên nhà cung cấp",
    display: true,
    renderFilter: renderInputFilter(),
    renderValue: (rowData) => h("span", {}, rowData.supplierName),
  },
  // {
  //   field: "length",
  //   header: "Địa chỉ",
  //   sortable: true,
  //   display: true,
  //   renderFilter: renderInputFilter(),
  //   renderValue: (rowData) => h("span", {}, rowData.length),
  // },
  {
    field: "tax",
    header: "Mã số thuế / Số CCCD",
    sortable: true,
    display: true,
    renderFilter: renderInputFilter(),
    renderValue: (rowData) => h("span", {}, rowData.tax),
  },

  {
    field: "height",
    header: "Số điện thoại",
    display: true,
    renderFilter: renderInputFilter(),
    renderValue: (rowData) => h("span", {}, rowData.height),
  },
  {
    field: "isActive",
    header: "Trạng thái",
    display: true,
    renderFilter: renderDropdownFilter({
      placeholder: "Chọn...",
      options: [],
    }),
    renderValue: (rowData) => {
      const severityMap = {
        true: "info",
        false: "danger",
      };
      return h(Tag, {
        value: rowData.isActive ? `Đang hoạt động` : `Ngừng hoạt động`,
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

    errorCode: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    supplierName: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    isActive: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
  };
};
const openAddDialog = (data) => {
  dialogRef.value?.openDialog(data);
};
const refreshData = () => {
  TableBasic.value?.refresh();
};
const delteItems = () => {
  modelDialogDelete.value = true;
};
</script>

<template>
  <tableDoc
    ref="TableBasic"
    v-model:selection="dataSelection"
    header="Danh mục nhà cung cấp"
    :columns="columns"
    :filters="filters"
    apiEndpoint="Supplier"
    @resetFilter="initFilters"
  >
    <template #header>
      <Button
        :disabled="!dataSelection.length"
        @click="delteItems()"
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
  </tableDoc>
  <FormData ref="dialogRef" :loadData="refreshData"></FormData>
  <DeleteComps
    v-model:isOpenDelete="modelDialogDelete"
    :ids="dataSelection.flatMap((e) => e.id)"
    @update:isOpenDelete="refreshData()"
    :content="`Bạn có chắc chắn muốn xóa ${dataSelection.length} bản ghi không ?`"
    api="Supplier"
  ></DeleteComps>
</template>
