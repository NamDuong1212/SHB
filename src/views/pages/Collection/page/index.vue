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
import { get } from "lodash";
import ProgressSpinner from 'primevue/progressspinner';

const dialogRef = ref();
const documentDialogRef = ref();
const filters = ref(null);
const TableBasic = ref();
const dataSelection = ref([]);
const modelDialogDelete = ref(false);
const collections = ref([]);
const confirm = useConfirm();
const collectionDocuments = ref({});
const expandedRows = ref({});
const loadingDocuments = ref({});

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

const getDocumentsByCollection = async (id) => {
  try {
    loadingDocuments.value[id] = true;
    const { data } = await CollectionService.getDocumentsByCollection(id);
    if (data) {
      collectionDocuments.value[id] = data.documents;
      expandedRows.value[id] = !expandedRows.value[id];
    }
  } catch (error) {
    console.error(`Error fetching documents for collection ${id}:`, error);
  } finally {
    loadingDocuments.value[id] = false;
  }
};

const getFileExtension = (filename) => {
  if (!filename) return '';
  return filename.split('.').pop().toLowerCase();
};

const getFileIconClass = (filename) => {
  const ext = getFileExtension(filename);
  switch (ext) {
    case 'pdf': return 'pi pi-file-pdf text-red-500';
    case 'doc':
    case 'docx': return 'pi pi-file-word text-blue-500';
    case 'xls':
    case 'xlsx': return 'pi pi-file-excel text-green-500';
    case 'ppt':
    case 'pptx': return 'pi pi-file-ppt text-orange-500';
    case 'txt': return 'pi pi-file text-gray-500';
    default: return 'pi pi-file text-gray-400';
  }
};

const getFileName = (path) => {
  if (!path) return '';
  return path.split('/').pop();
};



const columns = ref([
{
  field: "name",
  header: "Tên collection",
  display: true,
  renderValue: (rowData) =>
    h("div", { class: "collection-wrapper" }, [
      h(
        "div",
        {
          class: "collection-header flex items-center gap-2 p-2 border-round cursor-pointer hover:surface-100",
          onClick: () => getDocumentsByCollection(rowData.id),
        },
        [
          h("i", {
            class: `pi ${expandedRows.value[rowData.id] ? "pi-chevron-down" : "pi-chevron-right"} transition-transform transition-duration-300`,
          }),
          h(
            "span",
            { class: "text-blue-600 font-semibold" },
            rowData.name
          ),
          loadingDocuments.value[rowData.id] &&
            h(ProgressSpinner, { style: { width: '20px', height: '20px' }})
        ]
      ),
      expandedRows.value[rowData.id] &&
        h("div", { 
          class: "documents-container pl-4 mt-2 transition-all transition-duration-300"
        }, [
          collectionDocuments.value[rowData.id]?.map(doc =>
            h("div", { 
              class: "document-card p-3 mb-2 surface-50 border-round-lg shadow-1" 
            }, [
              // Dòng tiêu đề + loại file + tên file
              h("div", { class: "flex justify-content-between align-items-center" }, [
                h("div", { class: "flex align-items-center gap-2" }, [
                  h("i", { class: getFileIconClass(doc.source_file) }),
                  h("span", { class: "font-semibold" }, doc.title),
                  h("span", { class: "text-sm text-500" }, `(${getFileName(doc.source_file)})`)
                ]),
              ]),
              // Dòng info phụ: Ngày + size
              h("div", { class: "mt-2 flex gap-3 text-sm" }, [
                h("span", { class: "text-600" }, [
                  h("i", { class: "pi pi-calendar-times mr-2" }),
                  new Date(doc.created_at).toLocaleDateString('vi-VN')
                ]),
                h("span", { class: "text-600" }, [
                  h("i", { class: "pi pi-file mr-2" }),
                  `${(doc.file_size / 1024).toFixed(1)} KB`
                ])
              ]),
              
            ])
          )
        ])
    ])
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
.p-button.p-button-success{
  color: white !important;
} 

  .collection-wrapper {
  overflow: hidden;
}

.collection-header {
  transition: all 0.2s ease;
}

.collection-header:hover {
  background-color: var(--surface-100);
}

.documents-container {
  border-left: 2px solid var(--primary-color);
  margin-left: 10px;
}

.document-card {
  transition: all 0.2s ease;
  border: 1px solid var(--surface-200);
}

.document-card:hover {
  transform: translateX(4px);
  background: var(--surface-100) !important;
  border-color: var(--primary-200);
}

.pi-chevron-down, .pi-chevron-right {
  color: var(--primary-color);
}

.transition-transform {
  transition: transform 0.3s ease;
}

.transition-all {
  transition: all 0.3s ease;
}

/* Spinner styles */
.p-progress-spinner {
  width: 20px !important;
  height: 20px !important;
}
</style>