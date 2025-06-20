<template>
  <div class="chat-container  flex flex-col gap-3 h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
    <!-- Header -->
    <div class="chat-header col-span-12 rounded-xl bg-white  p-4">
      <div class="flex justify-between items-center max-w-9xl mx-auto">
        <div class="flex items-center gap-3">
          <div
            class="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z">
              </path>
            </svg>
          </div>
          <div>
            <h2 class="font-bold text-2xl text-gray-800 mb-0">Collections</h2>
            <p class="text-sm text-gray-500">Quản lý Collections</p>
          </div>
        </div>
        <div>
          <button class="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="19" cy="12" r="1"></circle>
              <circle cx="5" cy="12" r="1"></circle>
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div class="card">
      <DataTable v-model:expandedRows="expandedRows" :value="Collections" paginator rows="5" dataKey="collection_id"
        @rowExpand="onRowExpand" scrollable scrollHeight="600px" size="small" showGridlines>
        <template #header>
          <div class="flex justify-end p-2">
            <Button size="small" @click="openAddFile" icon="pi pi-plus" label="Thêm mới Collections"></Button>
          </div>
        </template>
        <template #expansion="{ data }">
          <div class="flex items-center justify-between">
            <h4 class="m-0">Documents</h4>
            <Button size="small" @click="openUploadFile(data)" label="Cập nhật" icon="pi pi-upload"></Button>
          </div>
          <DataTable :value="Document">
            <template #empty>
              <div class="text-center">
                Trống
              </div>
            </template>
            <Column header="Tiêu đề">
              <template #body="{ data }">
                {{ data.metadata?.title }}
              </template>
            </Column>
            <Column header="Mô tả">
              <template #body="{ data }">
                {{ data.metadata?.description }}
              </template>
            </Column>
            <Column header="Tài liệu">
              <template #body="{ data }">
                <Button v-if="data.metadata?.source_file" icon="pi pi-eye" text severity="info" label="Xem tài liệu"
                  class="p-button-rounded" :pt="{
                    root: { class: 'hover:bg-blue-50 transition-colors' }
                  }" @click="openFile(data.metadata.source_file)" v-tooltip.top="'Xem trước tài liệu'" />
                <span v-else class="text-gray-400">Không có tài liệu</span>
              </template>
            </Column>
            <Column field="predicted_tags" header="Tag">
              <template #body="{ data }">
                <div class="flex gap-2">
                  <div v-for="item in data.predicted_tags" :key="item">
                    <Tag :value="item.tag"></Tag>
                  </div>
                </div>
              </template>
            </Column>
            <Column header="Thao tác">
              <template #body="{ data }">
                <Button icon="pi pi-trash" text severity="danger" @click="removeDoc(data)"></Button>
              </template>
            </Column>
          </DataTable>
        </template>

        <Column expander style="width: 5rem" />
        <Column header="STT">
          <template #body="{ index }">
            {{ index + 1 }}
          </template>
        </Column>
        <Column header="Tên Collections">
          <template #body="{ data }">
            <span>{{ data.collection_name }}</span>
          </template>
        </Column>
        <Column header="Ngày tạo">
          <template #body="{ data }">
            {{ format(data.created_at, 'dd/MM/yyyy') }}
          </template>
        </Column>
        <Column header="Ngày cập nhật">
          <template #body="{ data }">
            {{ format(data.updated_at, 'dd/MM/yyyy') }}
          </template>
        </Column>
        <Column header="Thao tác">
          <template #body="{ data }">
            <Button severity="danger" size="small" icon="pi pi-trash" rounded text @click="removeFile(data)"></Button>
          </template>
        </Column>
      </DataTable>
    </div>
    <Dialog v-model:visible="addFileModal" modal header="Collections" :style="{ width: '35rem' }">
      <Tabs v-model:value="tabValue">
        <TabList>
          <Tab :disabled="tabValue == '1'" value="0">Tạo Collections</Tab>
          <Tab :disabled="tabValue == '0'" value="1">Nhập Files</Tab>
        </TabList>
        <TabPanels>
          <TabPanel value="0">
            <div class="flex flex-col gap-2">
              <label for="">Tên Collections</label>
              <InputText size="small" v-model="payload.collection_name" placeholder="Nhập tên Collections"></InputText>
            </div>
          </TabPanel>
          <TabPanel value="1">
            <div class="upload-container">
              <!-- Upload area -->
              <div
                class="upload-area relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer mb-6"
                :class="[
                  isDropping ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100',
                  payload.imgPreview ? 'bg-white border-blue-500' : ''
                ]" @dragenter.prevent="isDropping = true" @dragleave.prevent="isDropping = false"
                @dragover.prevent="isDropping = true" @drop.prevent="handleFileDrop" @click="Openfile">
                <div v-if="!payload.imgPreview" class="text-center">
                  <div class="upload-icon mx-auto mb-4 flex items-center justify-center transition-all duration-300"
                    :class="isDropping ? 'text-blue-500 scale-110' : 'text-gray-400'">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                      class="upload-animation">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                  </div>
                  <h4 class="font-medium text-gray-700 mb-1">Kéo thả file vào đây</h4>
                  <p class="text-sm text-gray-500 mb-3">hoặc click để chọn file</p>
                  <!-- <div class="file-specs text-xs text-gray-400">PDF, DOCX, JPG, PNG, MP4, ZIP (tối đa 20MB)</div> -->
                </div>

                <div v-else class="preview-container relative w-full">
                  <div class="preview-wrapper relative rounded-lg overflow-hidden shadow-md mx-auto max-w-sm">
                    <div v-if="isImageFile" class="preview-image">
                      <img :src="payload.imgPreview" class="w-full object-cover max-h-56" alt="Preview" />
                    </div>

                    <div v-else class="file-preview-box p-6 bg-gray-50 flex items-center justify-center min-h-[200px]">
                      <div class="file-icon-container text-center">
                        <div v-if="fileType === 'pdf'" class="file-icon text-red-500 mx-auto mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <path d="M9 15v-6h6v6"></path>
                            <path d="M9 15v-6h6v6"></path>
                            <path d="M9 15v-6h6v6"></path>
                          </svg>
                        </div>

                        <div v-else-if="fileType === 'doc'" class="file-icon text-blue-600 mx-auto mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                          </svg>
                        </div>

                        <div v-else-if="fileType === 'video'" class="file-icon text-purple-600 mx-auto mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                            <polygon points="10 8 16 12 10 16 10 8"></polygon>
                          </svg>
                        </div>

                        <div v-else-if="fileType === 'zip'" class="file-icon text-yellow-500 mx-auto mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path
                              d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z">
                            </path>
                            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                            <line x1="12" y1="22.08" x2="12" y2="12"></line>
                          </svg>
                        </div>

                        <div v-else class="file-icon text-gray-500 mx-auto mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                            <polyline points="13 2 13 9 20 9"></polyline>
                          </svg>
                        </div>

                        <p class="file-extension text-lg font-bold">{{ fileExtension.toUpperCase() }}</p>
                      </div>
                    </div>

                    <div
                      class="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-40 transition-all flex items-center justify-center">
                      <button @click.stop="resetPreview"
                        class="remove-preview-btn opacity-0 hover:opacity-100 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-all duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div class="file-info mt-3 text-center">
                    <p class="text-sm font-medium text-gray-700">{{ payload.file ? payload.file.name : '' }}</p>
                    <p class="text-xs text-gray-500">{{ payload.file ? formatFileSize(payload.file.size) : '' }}</p>
                  </div>
                </div>

                <input type="file" class="hidden click-file" @change="UploadFileLocal($event)" />
              </div>

              <div class="upload-status mt-4" v-if="uploadStatus.show">
                <ProgressBar v-if="uploadStatus.uploading" :value="uploadStatus.progress" class="mb-2" />
                <Message :severity="uploadStatus.severity" :closable="false">{{ uploadStatus.message }}</Message>
              </div>
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
      <template #footer>
        <div class="flex justify-end gap-2">
          <Button size="small" type="button" label="Hủy" severity="secondary" icon="pi pi-times"
            @click="addFileModal = false" text></Button>
          <Button size="small" type="button" :label="tabValue == '0' ? `Tiếp tục` : `Lưu`"
            :icon="tabValue == '0' ? `pi pi-arrow-right` : `pi pi-check`" @click="saveMedia"></Button>
        </div>
      </template>
    </Dialog>

    <Dialog v-model:visible="confirmDeleteDialog" modal :style="{ width: '30rem' }" :closable="false">
      <template #header>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <i class="pi pi-exclamation-triangle text-red-500 text-xl"></i>
          </div>
          <span class="text-xl font-semibold">Xác nhận xóa</span>
        </div>
      </template>
      <div class="flex flex-col gap-4">
        <p class="text-gray-600">
          Bạn có chắc chắn muốn xóa collection <span class="font-semibold">{{ selectedCollection?.collection_name
          }}</span>?
        </p>
        <p class="text-sm text-gray-500">
          Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan đến collection này sẽ bị xóa vĩnh viễn.
        </p>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <Button type="button" label="Hủy" size="small" severity="secondary" @click="confirmDeleteDialog = false"
            text></Button>
          <Button type="button" size="small" label="Xóa" icon="pi pi-trash" severity="danger" @click="confirmDelete">

          </Button>
        </div>
      </template>
    </Dialog>

    <Dialog v-model:visible="confirmDeleteDocDialog" modal :style="{ width: '35rem' }" :closable="false">
      <template #header>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <i class="pi pi-exclamation-triangle text-red-500 text-xl"></i>
          </div>
          <span class="text-xl font-semibold">Xác nhận xóa</span>
        </div>
      </template>
      <div class="flex flex-col gap-4">
        <p class="text-gray-600">
          Bạn có chắc chắn muốn xóa tài liệu <span class="font-semibold">{{ selectedDocument?.metadata?.title }}</span>?
        </p>
        <p class="text-sm text-gray-500">
          Hành động này không thể hoàn tác. Tài liệu này sẽ bị xóa vĩnh viễn khỏi collection.
        </p>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <Button type="button" size="small" label="Hủy" severity="secondary" @click="confirmDeleteDocDialog = false"
            text></Button>
          <Button type="button" size="small" label="Xóa" icon="pi pi-trash" severity="danger"
            @click="confirmDeleteDoc"></Button>
        </div>
      </template>
    </Dialog>
    <loading v-if="isLoading"></loading>
  </div>
</template>
<script setup>
import http from '@/service/http';
import { format } from 'date-fns';
import { useToast } from "primevue";
import { computed, getCurrentInstance, onMounted, ref } from 'vue';

const toast = useToast();
const { proxy } = getCurrentInstance();
const formData = new FormData()

onMounted(() => {
  fetchAllCollections()
})
const payload = ref({
  collection_name: "",
  visibility: "",
})
const uploadStatus = ref({
  show: false,
  uploading: false,
  progress: 0,
  message: '',
  severity: 'info'
})
const tabValue = ref('0')
const visible = ref(false)
const Document = ref(null)
const Collections = ref([])
const addFileModal = ref(false)
const confirmDeleteDialog = ref(false)
const isDropping = ref(false)
const isLoading = ref(false)
const selectedCollection = ref(null)
const expandedRows = ref({});
const confirmDeleteDocDialog = ref(false)
const selectedDocument = ref(null)
const fileExtension = computed(() => {
  if (!payload.value.file) return '';
  const filename = payload.value.file.name;
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
});
const fetchAllCollections = async () => {
  isLoading.value = true;

  try {
    const res = await http.get(`collections`)
    Collections.value = res.data
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
}
const removeFile = async (data) => {
  selectedCollection.value = data
  confirmDeleteDialog.value = true
}
const confirmDelete = async () => {
  isLoading.value = true;
  try {
    const res = await http.delete(`collection/${selectedCollection.value.collection_id}/delete`)
    if (res.data) {
      fetchAllCollections()
      confirmDeleteDialog.value = false
      selectedCollection.value = null
      proxy.$notify('S', 'Xóa thành công!', toast)
    }
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}
const checkIsImageFile = (file) => {
  return file && file.type.startsWith('image/');
}

const isImageFile = computed(() => {
  return payload.value.file && payload.value.file.type.startsWith('image/');
})
const openAddFile = () => {
  addFileModal.value = true
  resetPayload()
}
const Openfile = () => {
  document.querySelectorAll('.click-file')[0].click();
};
const handleFileDrop = (event) => {
  isDropping.value = false
  const files = event.dataTransfer.files
  if (files.length) {
    const file = files[0]
    payload.value.file = file
    if (checkIsImageFile(file)) {
      payload.value.imgPreview = URL.createObjectURL(file)
    } else {
      payload.value.imgPreview = 'placeholder'
    }
  }
}
const UploadFileLocal = (event) => {
  const files = event.target.files;
  if (files.length) {
    payload.value.file = files[0];
    if (checkIsImageFile(files[0])) {
      payload.value.imgPreview = URL.createObjectURL(files[0]);
    } else {
      payload.value.imgPreview = 'placeholder';
    }
  }
};
const fileType = computed(() => {
  if (!payload.value.file) return '';

  const type = payload.value.file.type;
  if (type.includes('pdf')) return 'pdf';
  if (type.includes('word') || type.includes('doc')) return 'doc';
  if (type.includes('video')) return 'video';
  if (type.includes('zip') || type.includes('rar') || type.includes('compressed')) return 'zip';

  // Kiểm tra theo tên file nếu MIME type không rõ ràng
  const filename = payload.value.file.name.toLowerCase();
  if (filename.endsWith('.pdf')) return 'pdf';
  if (filename.endsWith('.doc') || filename.endsWith('.docx')) return 'doc';
  if (filename.endsWith('.mp4') || filename.endsWith('.avi') || filename.endsWith('.mov')) return 'video';
  if (filename.endsWith('.zip') || filename.endsWith('.rar') || filename.endsWith('.7z')) return 'zip';

  return 'other';
})

const saveMedia = async () => {
  if (tabValue.value === '0') {
    return CreateCollect()
  }
  return funUpload()
}
const CreateCollect = async () => {
  try {
    const res = await http.post(`collections/create`, payload.value)
    if (res.data) {
      proxy.$notify('S', 'Tạo Collections thành công!', toast)
      tabValue.value = '1'
      fetchAllCollections()
    }
  } catch (error) {
    proxy.$notify('E', error, toast)

  }
}
const funUpload = async () => {
  formData.append('collection_name', payload.value.collection_name)
  formData.append('file', payload.value.file)
  uploadStatus.value = {
    show: true,
    uploading: true,
    progress: 0,
    message: 'Đang tải lên...',
    severity: 'info'
  }

  // Giả lập tiến trình tải lên
  const uploadInterval = setInterval(() => {
    if (uploadStatus.value.progress < 90) {
      uploadStatus.value.progress += 10
    }
  }, 200)
  try {
    const res = await http.post(`run-pipeline`, formData)
    clearInterval(uploadInterval)
    uploadStatus.value.progress = 100
    proxy.$notify('S', 'Tải lên thành công!', toast)
    addFileModal.value = false
    resetPayload()
    tabValue.value = '0'
  } catch (error) {
    proxy.$notify('E', error.response.data ? error.response.data.error : 'Đã có lỗi xảy ra', toast)
    uploadStatus.value.progress = 0
    uploadStatus.value.show = false
    formData.delete('collection_name')
    formData.delete('file')

  } finally {
    fetchAllCollections()
  }
}
const showUploadStatus = (message, severity = 'info') => {
  uploadStatus.value = {
    show: true,
    uploading: false,
    progress: 100,
    message: message,
    severity: severity
  }

  if (severity === 'success') {
    setTimeout(() => {
      uploadStatus.value.show = false
    }, 3000)
  }
}

const resetPayload = () => {
  payload.value = {
    collection_name: '',
  };
  uploadStatus.value.show = false;
  tabValue.value = '0'

};
const onRowExpand = async (event) => {
  expandedRows.value = {};
  expandedRows.value[event.data.collection_id] = true;
  Document.value = [];
  try {
    const res = await http.get(`collection/documents/${event.data.collection_id}`)
    Document.value = res.data
  } catch (error) {
    console.log(error);
  }
};
const removeDoc = async (data) => {
  selectedDocument.value = data
  confirmDeleteDocDialog.value = true
}
const confirmDeleteDoc = async () => {
  try {
    const res = await http.delete(`document/${selectedDocument.value.doc_id}/delete`)
    if (res.data) {
      onRowExpand({ data: selectedCollection.value })
      confirmDeleteDocDialog.value = false
      selectedDocument.value = null
    }
  } catch (error) {
    console.log(error)
  }
};
const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B'
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
  else return (bytes / 1048576).toFixed(1) + ' MB'
};
const resetPreview = (event) => {
  event.stopPropagation()
  payload.value.file = null
  payload.value.imgPreview = null
};
const openFile = (url) => {
  window.open(url, '_blank');
};
const openUploadFile = (data) => {
  payload.value.file = null
  payload.value.imgPreview = null
  payload.value.collection_name = data.collection_name
  tabValue.value = '1'
  addFileModal.value = true
};
</script>
<style>
.upload-animation {
  animation: bounce 1.5s infinite ease-in-out;
}

@keyframes bounce {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-5px);
  }
}

.remove-preview-btn {
  transform: scale(0.8);
}

.preview-wrapper:hover .remove-preview-btn {
  opacity: 1;
  transform: scale(1);
}

.file-preview-box {
  background: repeating-linear-gradient(45deg,
      #f0f4f8,
      #f0f4f8 10px,
      #e9eef5 10px,
      #e9eef5 20px);
  border-radius: 8px;
  box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.05);
}

.file-icon {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  transition: transform 0.2s ease;
}

.file-preview-box:hover .file-icon {
  transform: scale(1.05);
}

.file-extension {
  color: #4b5563;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  letter-spacing: 0.05em;
}
</style>