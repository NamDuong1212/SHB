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
const columns = ref([
  {
    field: "unitGroupName",
    header: "Tên nhóm đơn vị",
    sortable: true,
    display: true,
    renderFilter: renderInputFilter(),
    renderValue: (rowData) =>
      h(
        "span",
        {
          class: "text-blue-600 font-semibold cursor-pointer",
          onClick: () => openAddDialog(rowData),
        },
        rowData.unitGroupName
      ),
  },
  {
    field: "unitGroupDescription",
    header: "Mô tả",
    sortable: false,
    display: true,
    renderValue: (rowData) => h("span", {}, rowData.unitGroupDescription),
  },
  {
    field: "isActive",
    header: "Trạng thái",
    sortable: true,
    display: true,
    renderFilter: renderDropdownFilter({
      placeholder: "Chọn...",
      options: ["true", "false"],
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
    unitGroupName: {
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
    header="Danh mục nhóm đơn vị tính"
    :columns="columns"
    :filters="filters"
    apiEndpoint="UnitOfMeasureGroup"
    @resetFilter="initFilters"
  >
    <template #header>
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
  <!-- <loading></loading> -->
</template>
