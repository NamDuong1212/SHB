<script setup>
import DeleteComps from "@/components/DeleteComps.vue";
import GlobalDocumentForm from "@/components/GlobalDocumentForm.vue";
import tableDoc from "@/components/table/tableBasic.vue";
import CollectionService from "@/service/CollectionService";
import DocumentService from "@/service/DocumentService";
import { FilterMatchMode } from "@primevue/core/api";
import Button from "primevue/button";
import ConfirmDialog from "primevue/confirmdialog";
import ProgressSpinner from 'primevue/progressspinner';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { computed, h, onBeforeMount, ref } from "vue";
import FormData from "../components/FormData.vue";
import TruncatedText from "@/components/TruncatedText.vue";

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

// Responsive breakpoint check
const isMobile = computed(() => {
  if (typeof window !== 'undefined') {
    return window.innerWidth < 640;
  }
  return false;
});

const isTablet = computed(() => {
  if (typeof window !== 'undefined') {
    return window.innerWidth >= 640 && window.innerWidth < 768;
  }
  return false;
});


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
    }
  } catch (error) {
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
            class: "collection-header flex items-center gap-1 sm:gap-2 p-1 sm:p-2 border-round cursor-pointer hover:surface-100",
            onClick: () => getDocumentsByCollection(rowData.id),
          },
          [
            h("i", {
              class: `pi ${expandedRows.value[rowData.id] ? "pi-chevron-down" : "pi-chevron-right"} transition-transform transition-duration-300 text-xs sm:text-sm`,
            }),
            h(
              "span",
              { class: "text-blue-600 font-semibold text-xs sm:text-sm truncate" },
              rowData.collection_name
            ),
            loadingDocuments.value[rowData.id] &&
            h(ProgressSpinner, { style: { width: '16px', height: '16px' }, class: 'sm:w-5 sm:h-5' })
          ]
        ),
        expandedRows.value[rowData.id] &&
        h(
          "div",
          {
            class: "documents-container pl-2 sm:pl-4 mt-2 transition-all transition-duration-300"
          },
          [
            h(
              "div",
              {
                class: "documents-scroll-container max-h-60 sm:max-h-80 overflow-y-auto"
              },
              [
                collectionDocuments.value[rowData.id]?.map((doc) =>
                  h(
                    "div",
                    {
                      class: "document-card p-2 sm:p-3 mb-2 surface-50 border-round-lg shadow-1"
                    },
                    [
                      h("div", { class: "flex justify-between items-start gap-2" }, [
                        h("div", { class: "flex items-center gap-1 sm:gap-2 flex-1 min-w-0" }, [
                          h("i", { class: `${getFileIconClass(doc.storage_path)} text-sm sm:text-base flex-shrink-0` }),
                          h("span", {
                            class: "font-semibold cursor-pointer hover:underline text-xs sm:text-sm truncate",
                            onClick: () => downloadDocument(doc),
                            title: doc.doc_name
                          }, doc.doc_name),
                        ]),

                        h(Button, {
                          icon: "pi pi-trash",
                          class: "p-button-sm flex-shrink-0",
                          severity: "danger",
                          outlined: true,
                          size: "small",
                          onClick: () => deleteDocument(doc.id)
                        })
                      ]),
                      h("div", { class: "mt-2 flex flex-col sm:flex-row gap-1 sm:gap-3 text-xs sm:text-sm" }, [
                        h("span", { class: "text-600 flex items-center gap-1" }, [
                          h("i", { class: "pi pi-calendar-times text-xs" }),
                          h("span", { class: "truncate" }, new Date(doc.effective_from).toLocaleDateString('vi-VN'))
                        ]),
                        h("span", { class: "text-600 flex items-center gap-1" }, [
                          h("i", { class: "pi pi-calendar-plus text-xs" }),
                          h("span", { class: "truncate" }, new Date(doc.effective_to).toLocaleDateString('vi-VN'))
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
    style: { minWidth: '200px' },
    renderValue: (rowData) => h(TruncatedText, {
      text: rowData.description || "",
      maxLength: 290,
      textClass: "text-xs sm:text-sm"
    }), 
  },
  {
    field: "username",
    header: "Người tạo",
    display: true,
    style: { minWidth: '120px' },
    renderValue: (rowData) => h("span", { class: "text-xs sm:text-sm" }, rowData.username || "Không xác định"),
  },
  {
    field: "created_at",
    header: "Ngày tạo",
    display: true,
    style: { minWidth: '120px' },
    renderValue: (rowData) => h("span", { class: "text-xs sm:text-sm" }, new Date(rowData.created_at).toLocaleDateString('vi-VN')),
  },
  {
    field: "actions",
    header: "Thao tác",
    display: true,
    style: { minWidth: '100px' },
    renderValue: (rowData) =>
      h(
        "div",
        { class: "flex gap-1 sm:gap-2 justify-center" },
        [
          rowData.collection_name && h(
            Button,
            {
              icon: "pi pi-trash",
              size: "small",
              severity: "danger",
              outlined: true,
              onClick: () => deleteCollection(rowData),
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

const deleteCollection = (collection) => {
  confirm.require({
    message: `Bạn có chắc chắn muốn xóa collection "${collection.collection_name}" không?`,
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
        await CollectionService.delete(collection.id);
        refreshData();
        toast.add({
          severity: "success",
          summary: "Xóa thành công",
          detail: `Collection "${collection.collection_name}" đã được xóa.`,
          life: 3000
        });
      } catch (error) {

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

const handleBatchDelete = async (ids) => {
  try {
    const deletePromises = ids.map(id => CollectionService.delete(id));
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
        .map(result => {
          const detail = result.reason?.response?.data?.detail;
          if (Array.isArray(detail)) {
            return detail.map(d => d.msg).join('. ');
          }
          return detail || result.reason?.message || 'Lỗi không xác định'
        })
        .filter((message, index, array) => array.indexOf(message) === index);

      toast.add({
        severity: "error",
        summary: "Lỗi",
        detail: `${failedCount} collection xóa thất bại: ${errorMessages.join(', ')}`,
        life: 5000
      });
    }

  } catch (error) {
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
  <div class="collection-container p-6">
    <tableDoc ref="TableBasic" v-model:selection="dataSelection" header="Danh sách collection" :columns="columns"
      :filters="filters" :apiFunction="getAllCollection" :paginator="true" @resetFilter="initFilters">
      <template #header>
        <div class="flex flex-wrap gap-2 sm:gap-3">
          <Button @click="openAddDialog" type="button" icon="pi pi-plus" severity="primary"
            class="bg-gradient-to-r from-amber-500 to-amber-200 text-xs sm:text-sm"
            :label="!isMobile ? 'Tạo collection' : ''" size="small" :title="isMobile ? 'Tạo collection' : ''" />
          <Button @click="openDocumentDialog" type="button" icon="pi pi-file" severity="success"
            :label="!isMobile ? 'Thêm document' : ''" class="text-xs sm:text-sm" size="small"
            :title="isMobile ? 'Thêm document' : ''" />
        </div>
      </template>
    </tableDoc>

    <FormData ref="dialogRef" @loadData="refreshData"></FormData>
    <GlobalDocumentForm ref="documentDialogRef" :collections="collections" @refresh="refreshData"></GlobalDocumentForm>

    <ConfirmDialog></ConfirmDialog>

    <DeleteComps v-model:isOpenDelete="modelDialogDelete" :ids="dataSelection.map((e) => e.id)"
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

@media (min-width: 768px) {
  .collection-container {
    padding: 1rem;
  }
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
  margin-left: 5px;
}

@media (min-width: 640px) {
  .documents-container {
    margin-left: 10px;
  }
}

/* Custom scrollbar */
.documents-scroll-container::-webkit-scrollbar {
  width: 4px;
}

@media (min-width: 640px) {
  .documents-scroll-container::-webkit-scrollbar {
    width: 6px;
  }
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
}

.document-card:hover {
  transform: translateX(2px);
  background: var(--surface-100) !important;
  border-color: var(--primary-200);
}

@media (min-width: 640px) {
  .document-card:hover {
    transform: translateX(4px);
  }
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
  width: 16px !important;
  height: 16px !important;
}

@media (min-width: 640px) {
  .p-progress-spinner {
    width: 20px !important;
    height: 20px !important;
  }
}

/* Table responsive */
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
  padding: 0.5rem !important;
}

@media (min-width: 768px) {
  :deep(.p-datatable-tbody td) {
    padding: 0.75rem !important;
  }
}

/* Mobile responsive for table */
@media (max-width: 767px) {
  :deep(.p-datatable) {
    font-size: 0.75rem;
  }

  :deep(.p-datatable .p-datatable-thead > tr > th) {
    padding: 0.5rem 0.25rem;
    font-size: 0.75rem;
  }

  :deep(.p-datatable .p-datatable-tbody > tr > td) {
    padding: 0.5rem 0.25rem;
  }

  :deep(.p-paginator) {
    padding: 0.5rem;
  }

  :deep(.p-paginator .p-paginator-pages) {
    display: none;
  }

  :deep(.p-inputtext) {
    font-size: 0.875rem;
    padding: 0.5rem;
  }
}

/* Hide some columns on mobile */
@media (max-width: 640px) {

  :deep(.p-datatable th:nth-child(4)),
  :deep(.p-datatable td:nth-child(4)) {
    display: none;
  }

  :deep(.p-datatable th:nth-child(5)),
  :deep(.p-datatable td:nth-child(5)) {
    display: none;
  }
}

@media (max-width: 480px) {

  :deep(.p-datatable th:nth-child(3)),
  :deep(.p-datatable td:nth-child(3)) {
    display: none;
  }
}

/* Button responsive */
@media (max-width: 640px) {
  :deep(.p-button-label) {
    display: none;
  }

  :deep(.p-button) {
    padding: 0.5rem;
    min-width: auto;
  }
}

/* Header responsive */
:deep(.p-datatable-header) {
  padding: 0.5rem !important;
}

@media (min-width: 768px) {
  :deep(.p-datatable-header) {
    padding: 1rem !important;
  }
}

/* Search input responsive */
:deep(.p-input-icon-field) {
  width: 100% !important;
  max-width: 300px;
}

@media (min-width: 640px) {
  :deep(.p-input-icon-field) {
    max-width: 400px;
  }
}

@media (min-width: 768px) {
  :deep(.p-input-icon-field) {
    max-width: 30rem;
  }
}

/* Flex layout responsive */
:deep(.p-datatable-header .flex) {
  flex-direction: column;
  gap: 0.5rem;
  align-items: stretch;
}

@media (min-width: 768px) {
  :deep(.p-datatable-header .flex) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

/* Text truncation for mobile */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 640px) {
  .collection-header span {
    max-width: 150px;
  }

  .document-card span {
    max-width: 120px;
  }
}
</style>