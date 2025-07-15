<script setup>
import DeleteComps from "@/components/DeleteComps.vue";
import tableDoc from "@/components/table/tableBasic.vue";
import CollectionService from "@/service/CollectionService";
import { renderDropdownFilter } from "@/composables/renderFilter";
import { FilterMatchMode } from "@primevue/core/api";
import Button from "primevue/button";
import Tag from "primevue/tag";
import { h, onBeforeMount, ref } from "vue";
import FormData from "../components/FormData.vue";
import DocumentForm from "../components/DocumentForm.vue";
import { useConfirm } from "primevue/useconfirm";
import ConfirmDialog from "primevue/confirmdialog";

const dialogRef = ref();
const documentDialogRef = ref();
const filters = ref(null);
const TableBasic = ref();
const dataSelection = ref([]);
const modelDialogDelete = ref(false);
const collections = ref([]);
const confirm = useConfirm();

const getAllCollection = async (params = {}) => {
  try {
    // Remove pagination parameters and only keep filtering params if needed
    const filteredParams = {};
    if (params.Search) filteredParams.Search = params.Search;
    if (params.isActive) filteredParams.isActive = params.isActive;

    const { data } = await CollectionService.getAll(filteredParams);
    if (data) {
      collections.value = data; // Store collections for document form
      return data.collections;
    }
  } catch (error) {
    console.error("Error fetching collections:", error);
    return [];
  }
};

const columns = ref([
  {
    field: "name",
    header: "Tên collection",
    display: true,
    renderValue: (rowData) =>
      h(
        "span",
        {
          class: "text-blue-600 font-semibold cursor-pointer hover:underline",
        },
        rowData.name
      ),
  },
  {
    field: "description",
    header: "Mô tả",
    display: true,
    renderValue: (rowData) => h("span", {}, rowData.description || ""),
  },
  {
    field: "actions",
    header: "Thao tác",
    display: true,
    renderValue: (rowData) =>
      h(
        "div",
        { class: "flex gap-2" },
        [
          h(
            Button,
            {
              icon: "pi pi-trash",
              size: "small",
              severity: "danger",
              outlined: true,
              onClick: () => deleteCollection(rowData.name),
            }
          ),
        ]
      ),
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

const openDocumentDialog = () => {
  documentDialogRef.value?.openDialog();
};

const refreshData = () => {
  TableBasic.value?.refresh();
  dataSelection.value = [];
};

const delteItems = () => {
  modelDialogDelete.value = true;
};

const deleteCollection = (name) => {
  confirm.require({
    message: `Bạn có chắc chắn muốn xóa collection "${name}" không?`,
    header: 'Xác nhận xóa',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: 'Hủy',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Xóa',
      severity: 'danger'
    },
    accept: async () => {
      try {
        await CollectionService.delete(name);
        refreshData();
        console.log(`Collection ${name} deleted successfully`);
      } catch (error) {
        console.error("Error deleting collection:", error);
      }
    }
  });
};

const handleBatchDelete = async (names) => {
  try {
    const deletePromises = names.map(name => CollectionService.delete(name));
    await Promise.all(deletePromises);

    refreshData();
    console.log(`${names.length} collections deleted successfully`);
  } catch (error) {
    console.error("Error deleting collections:", error);
  }
};
</script>

<template>
  <div class="collection-container">
    <tableDoc ref="TableBasic" v-model:selection="dataSelection" header="Danh sách collection" :columns="columns"
      :filters="filters" :apiFunction="getAllCollection" :paginator="false" @resetFilter="initFilters">
      <template #header>
        <div class="flex gap-2">
          <Button @click="openAddDialog" type="button" icon="pi pi-plus" severity="primary" label="Thêm collection" size="small" />
          <Button @click="openDocumentDialog" type="button" icon="pi pi-file" severity="success" label="Tạo document" size="small" />
        </div>
      </template>
    </tableDoc>

    <FormData ref="dialogRef" :loadData="refreshData"></FormData>
    <DocumentForm ref="documentDialogRef" :collections="collections" @refresh="refreshData"></DocumentForm>

    <ConfirmDialog></ConfirmDialog>

    <DeleteComps v-model:isOpenDelete="modelDialogDelete" :ids="dataSelection.flatMap((e) => e.name)"
      @update:isOpenDelete="refreshData()" @confirm="handleBatchDelete"
      :content="`Bạn có chắc chắn muốn xóa ${dataSelection.length} bản ghi không?`" api="collection">
    </DeleteComps>
  </div>
</template>


<style scoped>
.p-button.p-button-primary {
  color: white !important;
}

.p-button.p-button-success {
  color: white !important;
}

.collection-container {
  padding: 1rem;
}
</style>