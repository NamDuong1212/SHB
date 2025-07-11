<script setup>
import DeleteComps from "@/components/DeleteComps.vue";
import tableDoc from "@/components/table/tableBasic.vue";
import { renderDropdownFilter } from "@/composables/renderFilter";
import { FilterMatchMode } from "@primevue/core/api";
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
    field: "organizationLevelName",
    header: "Tên collection",
    display: true,
    renderValue: (rowData) =>
      h(
        "span",
        {
          class: "text-blue-600 font-semibold cursor-pointer hover:underline",
          onClick: () => openAddDialog(rowData),
        },
        rowData.organizationLevelName
      ),
  },
  {
    field: "description",
    header: "Mô tả",
    display: true,
    renderValue: (rowData) => h("span", {}, rowData.description),
  },
]);

onBeforeMount(() => {
  initFilters();
});

const initFilters = () => {
  filters.value = {
    Search: { value: null, matchMode: FilterMatchMode.CONTAINS },
    isActive: {
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
  <tableDoc ref="TableBasic" v-model:selection="dataSelection" header="Danh sách collection" :columns="columns"
    :filters="filters" apiEndpoint="" @resetFilter="initFilters">
    <template #header>
      <Button :disabled="!dataSelection.length" @click="delteItems()" size="small" label="Xóa" icon="pi pi-trash"
        severity="danger"></Button>
      <Button @click="openAddDialog" type="button" icon="pi pi-plus" severity="primary" label="Thêm mới" size="small" />
    </template>
  </tableDoc>
  <FormData ref="dialogRef" :loadData="refreshData"></FormData>
  <DeleteComps v-model:isOpenDelete="modelDialogDelete" :ids="dataSelection.flatMap((e) => e.id)"
    @update:isOpenDelete="refreshData()" :content="`Bạn có chắc chắn muốn xóa ${dataSelection.length} bản ghi không?`"
    api="OrganizationalLevel"></DeleteComps>
</template>
