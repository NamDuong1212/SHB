<script setup>
import DeleteComps from "@/components/DeleteComps.vue";
import tableDoc from "@/components/table/tableBasic.vue";
import CollectionService from "@/service/CollectionService";
import { FilterMatchMode } from "@primevue/core/api";
import Button from "primevue/button";
import { h, onBeforeMount, ref } from "vue";
import FormData from "../components/FormData.vue";
import GlobalDocumentForm from "@/components/GlobalDocumentForm.vue";
import { useConfirm } from "primevue/useconfirm";
import ConfirmDialog from "primevue/confirmdialog";
import ProgressSpinner from 'primevue/progressspinner';
import DocumentService from "@/service/DocumentService";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";

const toast = useToast();
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
    const { data } = await CollectionService.getAll(params);

    if (data && data.info && data.info.data) {
      const responseData = data.info.data;

      collections.value = responseData.collections;

      return {
        data: responseData.collections,
        total: responseData.total
      };
    }
    return { data: [], total: 0 };

  } catch (error) {
    console.error("Error fetching collections:", error);
    return { data: [], total: 0 };
  }
};
const getDocumentsByCollection = async (id) => {
  try {
    loadingDocuments.value[id] = true;
    const { data } = await CollectionService.getDocumentsByCollection(id);

    if (data && data.info && data.info.data && data.info.data.documents) {
      collectionDocuments.value[id] = data.info.data.documents;
      expandedRows.value[id] = !expandedRows.value[id];
    } else {
      collectionDocuments.value[id] = []; 
      expandedRows.value[id] = !expandedRows.value[id];
      console.warn("No documents found or unexpected response structure for collection:", id);
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

const downloadDocument = (doc) => {
  if (doc.download_link) {
    const a = document.createElement('a');
    a.href = doc.download_link;
    a.download = getFileName(doc.source_file);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } else {
    toast.add({
      severity: "error",
      summary: "Lỗi",
      detail: "Không có đường dẫn tải về cho tài liệu này.",
      life: 3000
    });
  }
};

const deleteDocument = (id) => {
  confirm.require({
    message: `Bạn có chắc chắn muốn xóa tài liệu này không?`,
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
        await DocumentService.delete(id);

        Object.keys(collectionDocuments.value).forEach(collectionId => {
          collectionDocuments.value[collectionId] = collectionDocuments.value[collectionId]
            .filter(doc => doc.id !== id);
        });

        toast.add({
          severity: "success",
          summary: "Xóa thành công",
          detail: "Tài liệu đã được xóa.",
          life: 3000
        });
      } catch (error) {
        console.error("Lỗi xoá tài liệu", error);
        toast.add({
          severity: "error",
          summary: "Lỗi",
          detail: "Xóa tài liệu thất bại.",
          life: 3000
        });
      }
    }
  });
};

const columns = ref([
  {
    field: "collection_name",
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
              rowData.collection_name
            ),
            loadingDocuments.value[rowData.id] &&
            h(ProgressSpinner, { style: { width: '20px', height: '20px' } })
          ]
        ),
        expandedRows.value[rowData.id] &&
        h(
          "div",
          {
            class: "documents-container pl-4 mt-2 transition-all transition-duration-300"
          },
          [
            h(
              "div",
              {
                class: "documents-scroll-container"
              },
              [
                collectionDocuments.value[rowData.id]?.map((doc) =>
                  h(
                    "div",
                    {
                      class: "document-card p-3 mb-2 surface-50 border-round-lg shadow-1"
                    },
                    [
                      h("div", { class: "flex justify-between items-center" }, [
                        h("div", { class: "flex items-center gap-2" }, [
                          h("i", { class: getFileIconClass(doc.storage_path) }),
                          h("span", { class: "font-semibold cursor-pointer hover:underline", onClick: () => downloadDocument(doc) }, doc.doc_name),
                        ]),

                        h(Button, {
                          icon: "pi pi-trash",
                          class: "p-button-sm",
                          severity: "danger",
                          outlined: true,
                          onClick: () => deleteDocument(doc.id)
                        })
                      ]),
                      h("div", { class: "mt-2 flex gap-3 text-sm" }, [
                        h("span", { class: "text-600" }, [
                          h("i", { class: "pi pi-calendar-times mr-2" }),
                          new Date(doc.created_at).toLocaleDateString('vi-VN')
                        ]),

                      ])
                    ])
                )
              ])
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
    field: "username",
    header: "Người tạo",
    display: true,
    renderValue: (rowData) => h("span", {}, rowData.username || "Không xác định"),
  },
  {
    field: "created_at",
    header: "Ngày tạo",
    display: true,
    renderValue: (rowData) => h("span", {}, new Date(rowData.created_at).toLocaleDateString('vi-VN')),
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
          rowData.name !== "foxai" && h(
            Button,
            {
              icon: "pi pi-trash",
              size: "small",
              severity: "danger",
              outlined: true,

              onClick: () => deleteCollection(rowData.collection_name),
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
        toast.add({
          severity: "success",
          summary: "Xóa thành công",
          detail: `Collection "${name}" đã được xóa.`,
          life: 3000
        });
        console.log(`Collection ${name} deleted successfully`);
      } catch (error) {
        console.error("Error deleting collection:", error);

        let errorMessage = "Xóa collection thất bại.";

        if (error.response?.data?.detail) {
          errorMessage = error.response.data.detail;
        } else if (error.message) {
          errorMessage = error.message;
        }

        toast.add({
          severity: "error",
          summary: "Lỗi",
          detail: errorMessage,
          life: 5000
        });
      }
    }
  });
};

const handleBatchDelete = async (names) => {
  try {
    const deletePromises = names.map(name => CollectionService.delete(name));
    const results = await Promise.allSettled(deletePromises);

    const successCount = results.filter(result => result.status === 'fulfilled').length;
    const failedCount = results.filter(result => result.status === 'rejected').length;

    refreshData();

    if (successCount > 0) {
      toast.add({
        severity: "success",
        summary: "Xóa thành công",
        detail: `${successCount} collection đã được xóa thành công.`,
        life: 3000
      });
    }

    if (failedCount > 0) {
      const errorMessages = results
        .filter(result => result.status === 'rejected')
        .map(result => result.reason?.response?.data?.detail || result.reason?.message || 'Lỗi không xác định')
        .filter((message, index, array) => array.indexOf(message) === index); // Loại bỏ duplicate

      toast.add({
        severity: "error",
        summary: "Lỗi",
        detail: `${failedCount} collection xóa thất bại: ${errorMessages.join(', ')}`,
        life: 5000
      });
    }

  } catch (error) {
    console.error("Error deleting collections:", error);
    toast.add({
      severity: "error",
      summary: "Lỗi",
      detail: "Có lỗi xảy ra khi xóa collections.",
      life: 3000
    });
  }
};
</script>

<template>
  <Toast />
  <div class="collection-container">
    <tableDoc ref="TableBasic" v-model:selection="dataSelection" header="Danh sách collection" :columns="columns"
      :filters="filters" :apiFunction="getAllCollection" :paginator="true" @resetFilter="initFilters">
      <template #header>
        <div class="flex gap-2">
          <Button @click="openAddDialog" type="button" icon="pi pi-plus" severity="primary" label="Tạo collection"
            size="small" />
          <Button @click="openDocumentDialog" type="button" icon="pi pi-file" severity="success" label="Thêm document"
            size="small" />
        </div>
      </template>
    </tableDoc>

    <FormData ref="dialogRef" @loadData="refreshData"></FormData>
    <GlobalDocumentForm ref="documentDialogRef" :collections="collections" @refresh="refreshData"></GlobalDocumentForm>

    <ConfirmDialog></ConfirmDialog>

    <DeleteComps v-model:isOpenDelete="modelDialogDelete" :ids="dataSelection.flatMap((e) => e.collection_name)"
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
  height: 100vh;
  overflow: auto;
}

.collection-wrapper {
  overflow: visible;
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

/* Custom scrollbar */
.documents-scroll-container::-webkit-scrollbar {
  width: 6px;
}

.documents-scroll-container::-webkit-scrollbar-track {
  background: var(--surface-200);
  border-radius: 3px;
}

.documents-scroll-container::-webkit-scrollbar-thumb {
  background: var(--primary-color);
  border-radius: 3px;
}

.documents-scroll-container::-webkit-scrollbar-thumb:hover {
  background: var(--primary-600);
}

.document-card {
  transition: all 0.2s ease;
  border: 1px solid var(--surface-200);
  flex-shrink: 0;
  /* Ngăn card bị co lại */
}

.document-card:hover {
  transform: translateX(4px);
  background: var(--surface-100) !important;
  border-color: var(--primary-200);
}

.pi-chevron-down,
.pi-chevron-right {
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

/* Đảm bảo table có thể scroll */
:deep(.p-datatable-wrapper) {
  overflow: visible;
}

:deep(.p-datatable-tbody) {
  overflow: visible;
}

:deep(.p-datatable-tbody tr) {
  overflow: visible;
}

:deep(.p-datatable-tbody td) {
  overflow: visible;
}
</style>