<script setup>
import tableDoc from "@/components/table/tableBasic.vue";
import { renderInputFilter } from "@/composables/renderFilter";
import { FilterMatchMode, FilterOperator } from "@primevue/core/api";
import Button from "primevue/button";
import { h, onBeforeMount, ref } from "vue";
import FormData from "../components/FormData.vue";
const dialogRef = ref();
const filters = ref(null);
const TableBasic = ref();
const columns = ref([
  {
    field: "name",
    header: "Tên vai trò",
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
        rowData.name
      ),
  },
]);

onBeforeMount(() => {
  initFilters();
});

const initFilters = () => {
  filters.value = {
    Search: { value: null, matchMode: FilterMatchMode.CONTAINS },
    ItemCode: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    ItemName: {
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
    header="Danh sách vai trò"
    :columns="columns"
    :filters="filters"
    apiEndpoint="Permission/get-roles"
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
</template>
