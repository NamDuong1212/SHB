<script setup>
import DeleteComps from "@/components/DeleteComps.vue";
import tableTree from "@/components/table/tableTree.vue";
import { Tag } from "primevue";
import { h, ref } from "vue";
import FormData from "../components/FormData.vue";

const dialogRef = ref();
const dataSelection = ref([]);
const modelDialogDelete = ref(false);
const TableBasic = ref();

const columns = ref([
  {
    field: "groupFactoryCode",
    header: "Mã nhóm kho",
    sortable: true,
    display: true,
    renderValue: (rowData) =>
      h(
        "button",
        {
          class: "text-blue-600 font-semibold cursor-pointer hover:underline",
          onClick: () => openDialogForm(rowData),
        },
        rowData.groupFactoryCode
      ),
  },
  {
    field: "groupFactoryName",
    header: "Tên nhà xưởng",
    sortable: true,
    display: true,
    renderValue: (rowData) => h("span", {}, rowData.groupFactoryName || "-"),
  },
  {
    field: "isActive",
    header: "Trạng thái",
    sortable: true,
    display: true,
    renderValue: (rowData) => {
      const severityMap = {
        true: "success",
        false: "warning",
      };
      const value = {
        true: "Hoạt động",
        Completed: "Không hoạt đông",
      };
      return h(Tag, {
        value: value[rowData.isActive] || null,
        severity: severityMap[rowData.isActive] || null,
      });
    },
  },
]);

const openDialogForm = (data) => {
  dialogRef.value?.openDialog(data);
};

const refreshData = () => {
  TableBasic.value?.refresh();
};
</script>

<template>
  <tableTree
    ref="TableBasic"
    header="Danh sách nhóm nhà xưởng"
    :columns="columns"
    apiEndpoint="GroupFactory"
  >
    <template #header>
      <Button
        icon="pi pi-plus"
        label="Thêm mới"
        severity="primary"
        size="small"
        @click="openDialogForm"
      />
    </template>
  </tableTree>
  <FormData ref="dialogRef"></FormData>
  <DeleteComps
    v-model:isOpenDelete="modelDialogDelete"
    :ids="dataSelection.flatMap((e) => e.id)"
    :content="`Bạn có chắc chắn muốn xóa ${dataSelection.length} bản ghi ?`"
    api="PreventiveMaintenance"
    :loadData="refreshData"
  ></DeleteComps>
</template>
