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
            <h2 class="font-bold text-2xl text-gray-800 mb-0">Files</h2>
            <p class="text-sm text-gray-500">Files Upload</p>
          </div>
        </div>
        <div>
          <Button size="small" @click="openAddFile" icon="pi pi-plus" label="Thêm mới"></Button>
        </div>
      </div>
    </div>
    
    <div class="card">
      <DataTable :value="Files" paginator rows="5" scrollable scrollHeight="600px" size="small" showGridlines>
        <Column header="#">
          <template #body="{ index }">
            {{ index + 1 }}
          </template>
        </Column>
        <Column header="File">
          <template #body="{ data }">
            <a class="hover:underline text-primary" :href="data.file_path">Xem file</a>
          </template>
        </Column>
        <Column header="Collection">
          <template #body="{ data }">
            <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {{ data.collection_name }}
            </span>
          </template>
        </Column>
        <Column header="Ngày tạo">
          <template #body="{ data }">
            {{ format(data.created_at, 'dd/MM/yyyy') }}
          </template>
        </Column>
        <Column header="Thao tác">
          <template #body="{ data }">
            <Button size="small" icon="pi pi-trash" severity="danger" @click="deleteFile(data.id)" outlined></Button>
          </template>
        </Column>
      </DataTable>
    </div>
    
    <Dialog v-model:visible="addFileModal" modal header="Tải lên file" :style="{ width: '50rem' }"
      class="chatbot-upload-dialog modern-dialog" :closable="false">
      <div class="upload-container p-4">
        <!-- Form fields -->
        <div class="form-fields mb-6">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Tiêu đề tài liệu *</label>
            <InputText v-model="payload.doc_title" placeholder="Nhập tiêu đề tài liệu" class="w-full" />
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Collection *</label>
            <div class="flex gap-2">
              <Select 
                v-model="payload.collection_name" 
                :options="Collections" 
                optionLabel="name" 
                optionValue="name"
                placeholder="Chọn collection..." 
                class="flex-1"
                :loading="collectionsLoading"
              >
                <template #value="slotProps">
                  <div v-if="slotProps.value" class="flex items-center gap-2">
                    <i class="pi pi-folder text-blue-500 text-sm"></i>
                    <span>{{ slotProps.value }}</span>
                  </div>
                  <span v-else class="text-gray-500">Chọn collection...</span>
                </template>
                <template #option="slotProps">
                  <div class="flex items-center gap-2 p-2">
                    <i class="pi pi-folder text-blue-500 text-sm"></i>
                    <span>{{ slotProps.option.name }}</span>
                  </div>
                </template>
              </Select>
              <Button 
                type="button" 
                icon="pi pi-refresh" 
                size="small" 
                severity="secondary" 
                @click="refreshCollections"
                :loading="collectionsLoading"
                v-tooltip.top="'Làm mới danh sách collection'"
                outlined
              />
            </div>
            <small class="text-gray-500 mt-1">Chọn collection để phân loại tài liệu</small>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
            <Textarea v-model="payload.description" placeholder="Nhập mô tả tài liệu" rows="3" class="w-full" />
          </div>
        </div>

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
            <h3 class="font-medium text-gray-700 mb-1">Kéo thả file vào đây</h3>
            <p class="text-sm text-gray-500 mb-3">hoặc click để chọn file</p>
            <div class="file-specs text-xs text-gray-400">PDF, DOCX, TXT, CSV (tối đa 20MB)</div>
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

                  <div v-else-if="fileType === 'csv'" class="file-icon text-green-600 mx-auto mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
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

          <input type="file" class="hidden click-file" @change="UploadFileLocal($event)" 
                 accept=".pdf,.doc,.docx,.txt,.csv" />
        </div>

        <div class="upload-status mt-4" v-if="uploadStatus.show">
          <ProgressBar v-if="uploadStatus.uploading" :value="uploadStatus.progress" class="mb-2" />
          <Message :severity="uploadStatus.severity" :closable="false">{{ uploadStatus.message }}</Message>
        </div>
      </div>
      
      <template #footer>
        <div class="flex justify-end gap-3">
          <Button size="small" type="button" label="Hủy" severity="secondary" icon="pi pi-times"
            @click="addFileModal = false" outlined></Button>
          <Button size="small" type="button" label="Lưu" icon="pi pi-check" @click="saveMedia"
            :loading="uploadStatus.uploading" :disabled="!isFormValid"></Button>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import http from '@/service/http';
import CollectionService from '@/service/CollectionService';
import { computed, onMounted, ref } from 'vue';

onMounted(() => {
  fetchAllImages()
  fetchCollections()
})

const payload = ref({
  doc_title: '',
  collection_name: '',
  description: '',
  file: null,
  imgPreview: null
})

const Files = ref([])
const Collections = ref([])
const collectionsLoading = ref(false)
const addFileModal = ref(false)
const isDropping = ref(false)
const uploadStatus = ref({
  show: false,
  uploading: false,
  progress: 0,
  message: '',
  severity: 'info'
})

const isFormValid = computed(() => {
  return payload.value.file && payload.value.doc_title.trim() && payload.value.collection_name
})

const fetchAllImages = async (id) => {
  try {
    const res = await http.get(`/doc/${id}`)
    Files.value = res.data.files
  } catch (error) {
    console.log(error);
  }
}

const fetchCollections = async () => {
  collectionsLoading.value = true
  try {
    const response = await CollectionService.getAll();
    Collections.value = response.data;
    // Tự động chọn collection đầu tiên nếu có và payload chưa có collection
    if (Collections.value.length > 0 && !payload.value.collection_name) {
      payload.value.collection_name = Collections.value[0].name;
    }
  } catch (error) {
    console.error("Không thể tải collections:", error);
    showUploadStatus('Không thể tải danh sách collection', 'error');
  } finally {
    collectionsLoading.value = false
  }
};

const refreshCollections = async () => {
  await fetchCollections();
  showUploadStatus('Làm mới danh sách collection thành công', 'success');
};

const openAddFile = () => {
  addFileModal.value = true
  resetPayload()
}

const Openfile = () => {
  document.querySelectorAll('.click-file')[0].click();
}

const handleFileDrop = (event) => {
  isDropping.value = false
  const files = event.dataTransfer.files
  if (files.length) {
    const file = files[0]
    if (isValidFileType(file)) {
      payload.value.file = file
      if (checkIsImageFile(file)) {
        payload.value.imgPreview = URL.createObjectURL(file)
      } else {
        payload.value.imgPreview = 'placeholder'
      }
    } else {
      showUploadStatus('File không được hỗ trợ. Chỉ chấp nhận PDF, DOCX, TXT, CSV', 'error')
    }
  }
}

const UploadFileLocal = (event) => {
  const files = event.target.files;
  if (files.length) {
    const file = files[0];
    if (isValidFileType(file)) {
      payload.value.file = file;
      if (checkIsImageFile(file)) {
        payload.value.imgPreview = URL.createObjectURL(file);
      } else {
        payload.value.imgPreview = 'placeholder';
      }
    } else {
      showUploadStatus('File không được hỗ trợ. Chỉ chấp nhận PDF, DOCX, TXT, CSV', 'error')
    }
  }
}

const resetPreview = (event) => {
  event.stopPropagation()
  payload.value.file = null
  payload.value.imgPreview = null
}

const saveMedia = async () => {
  let uploadInterval = null;
  
  try {
    // Validate form
    if (!payload.value.doc_title.trim()) {
      showUploadStatus('Vui lòng nhập tiêu đề tài liệu', 'error')
      return
    }
    if (!payload.value.collection_name) {
      showUploadStatus('Vui lòng chọn collection', 'error')
      return
    }
    if (!payload.value.file) {
      showUploadStatus('Vui lòng chọn file', 'error')
      return
    }

    // Hiển thị thanh tiến trình upload
    uploadStatus.value = {
      show: true,
      uploading: true,
      progress: 0,
      message: 'Đang tải lên...',
      severity: 'info'
    }

    // Giả lập tiến trình tải lên
    uploadInterval = setInterval(() => {
      if (uploadStatus.value.progress < 90) {
        uploadStatus.value.progress += 10
      }
    }, 200)

    // Tạo FormData theo đúng API specification
    const formData = new FormData();
    formData.append('file', payload.value.file);
    formData.append('doc_title', payload.value.doc_title);
    formData.append('collection_name', payload.value.collection_name);
    if (payload.value.description) {
      formData.append('description', payload.value.description);
    }

    // Gọi API upload using HTTP service
    const res = await http.post('/doc', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    clearInterval(uploadInterval)
    uploadStatus.value.progress = 100

    if (res.data) {
      showUploadStatus(`Tải lên thành công vào collection "${payload.value.collection_name}"!`, 'success')
      fetchAllImages();

      // Đóng dialog sau 1s
      setTimeout(() => {
        addFileModal.value = false;
        resetPayload();
      }, 1000)
    }
  } catch (error) {
    console.log(error);
    if (uploadInterval) {
      clearInterval(uploadInterval)
    }
    
    if (error.response?.status === 401) {
      showUploadStatus('Không có quyền truy cập. Vui lòng đăng nhập lại.', 'error')
    } else if (error.response?.status === 422) {
      showUploadStatus('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.', 'error')
    } else {
      showUploadStatus('Có lỗi xảy ra khi tải lên', 'error')
    }
  }
}

const deleteFile = async (fileId) => {
  try {
    await http.delete(`/api/v1/file/${fileId}`)
    fetchAllImages()
    showUploadStatus('Xóa file thành công', 'success')
  } catch (error) {
    console.log(error);
    showUploadStatus('Có lỗi xảy ra khi xóa file', 'error')
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

  setTimeout(() => {
    uploadStatus.value.show = false
  }, 3000)
}

const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B'
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
  else return (bytes / 1048576).toFixed(1) + ' MB'
}

const resetPayload = () => {
  payload.value = {
    doc_title: '',
    collection_name: Collections.value.length > 0 ? Collections.value[0].name : '',
    description: '',
    file: null,
    imgPreview: null
  };
  uploadStatus.value.show = false;
}

const checkIsImageFile = (file) => {
  return file && file.type.startsWith('image/');
}

const isValidFileType = (file) => {
  const validTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];
  
  const validExtensions = ['.pdf', '.doc', '.docx', '.txt', '.csv'];
  const filename = file.name.toLowerCase();
  
  return validTypes.includes(file.type) || validExtensions.some(ext => filename.endsWith(ext));
}

const isImageFile = computed(() => {
  return payload.value.file && payload.value.file.type.startsWith('image/');
})

const fileType = computed(() => {
  if (!payload.value.file) return '';

  const type = payload.value.file.type;
  const filename = payload.value.file.name.toLowerCase();
  
  if (type.includes('pdf') || filename.endsWith('.pdf')) return 'pdf';
  if (type.includes('word') || type.includes('doc') || filename.endsWith('.doc') || filename.endsWith('.docx')) return 'doc';
  if (type.includes('csv') || filename.endsWith('.csv')) return 'csv';
  if (type.includes('text') || filename.endsWith('.txt')) return 'txt';

  return 'other';
})

const fileExtension = computed(() => {
  if (!payload.value.file) return '';
  const filename = payload.value.file.name;
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
});
</script>
<style>
.upload-animation {
  animation: bounce 1.5s infinite ease-in-out;
}

@keyframes bounce {
  0%, 100% {
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

.form-fields {
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1rem;
}
</style>