<script setup>
import DeleteComps from "@/components/DeleteComps.vue";
import tableDoc from "@/components/table/tableBasic.vue";
import { renderDropdownFilter, renderInputFilter } from "@/composables/renderFilter";
import { FilterMatchMode, FilterOperator } from "@primevue/core/api";
import Button from "primevue/button";
import Tag from "primevue/tag";
import { h, onBeforeMount, ref } from "vue";
import FormData from "../components/FormData.vue";

const DeleteModal = ref(false);
const dataId = ref([]);
const dialogRef = ref();
const filters = ref(null);
const TableBasic = ref();
const columns = ref([
  {
    field: "unitCode",
    header: "Mã đơn vị tính",
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
        rowData.unitCode
      ),
  },
  {
    field: "unitName",
    header: "Tên đơn vị tính",
    sortable: true,
    display: true,
    renderFilter: renderInputFilter(),
    renderValue: (rowData) => h("span", {}, rowData.unitName),
  },
  {
    field: "length",
    header: "Chiều dài",
    sortable: true,
    display: true,
    renderFilter: renderInputFilter(),
    renderValue: (rowData) => h("span", {}, `${rowData.length} ${rowData.unitOfLength}`),
  },
  {
    field: "width",
    header: "Chiều rộng",
    sortable: true,
    display: true,
    renderFilter: renderInputFilter(),
    renderValue: (rowData) => h("span", {}, `${rowData.width} ${rowData.unitOfLength}`),
  },
  {
    field: "height",
    header: "Chiều cao",
    sortable: true,
    display: true,
    renderFilter: renderInputFilter(),
    renderValue: (rowData) => h("span", {}, `${rowData.height} ${rowData.unitOfLength}`),
  },
  {
    field: "weight",
    header: "Khối lượng",
    sortable: true,
    display: true,
    renderFilter: renderInputFilter(),
    renderValue: (rowData) => h("span", {}, `${rowData.weight} ${rowData.unitOfWeight}`),
  },
  {
    field: "isActive",
    header: "Trạng thái",
    sortable: true,
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

    unitCode: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    unitName: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    length: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    width: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    height: {
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

const openDeleteDialog = () => {
  DeleteModal.value = true;
};
</script>

<template>
  <tableDoc
    ref="TableBasic"
    header="Danh mục đơn vị tính"
    :columns="columns"
    :filters="filters"
    apiEndpoint="UnitOfMeasure"
    v-model:selection="dataId"
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
      <Button
        type="button"
        label="Xoá"
        icon="pi pi-trash"
        severity="danger"
        size="small"
        @click="openDeleteDialog()"
      ></Button>
    </template>
  </tableDoc>
  <FormData ref="dialogRef" @loadData="refreshData"></FormData>
  <DeleteComps
    v-model:isOpenDelete="DeleteModal"
    :ids="dataId.flatMap((e) => e.id)"
    :loadData="refreshData"
    :content="`Bạn có chắc chắn muốn xóa ${dataId.length} không?`"
    api="Currency"
  ></DeleteComps>
</template>
