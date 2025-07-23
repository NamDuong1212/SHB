<template>
  <Dialog 
  v-model:visible="visible" 
  :modal="false"
  :dismissableMask="!uploadStatus.uploading"
  :closeOnEscape="!uploadStatus.uploading"
  :draggable="!isMinimized"
  :style="dialogStyle"
  class="document-form-dialog" 
  :closable="!uploadStatus.uploading"
  @hide="resetForm"
>
    <!-- Custom Header -->
    <template #header>
      <div class="flex justify-between items-center w-full">
        <span class="text-xl font-medium">Tạo document mới</span>
        <Button
          v-if="uploadStatus.uploading"
          type="button"
          :icon="isMinimized ? 'pi pi-window-maximize' : 'pi pi-window-minimize'"
          class="p-button-text p-button-sm"
          @click="isMinimized = !isMinimized"
          v-tooltip.left="isMinimized ? 'Phóng to' : 'Thu nhỏ'"
        />
      </div>
    </template>

    <!-- Main Content -->
    <div v-if="!isMinimized" class="p-4">
      <!-- Form Fields -->
      <div class="space-y-4 mb-6">
        <!-- Document Title -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Tiêu đề tài liệu *
          </label>
          <InputText 
            v-model="formData.doc_title" 
            placeholder="Nhập tiêu đề tài liệu" 
            class="w-full" 
            :class="{ 'p-invalid': errors.doc_title }"
          />
          <small v-if="errors.doc_title" class="p-error">{{ errors.doc_title }}</small>
        </div>
        
        <!-- Collection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Collection *
          </label>
          <div class="flex gap-2">
            <Select 
              v-model="formData.collection_name" 
              :options="Collections" 
              optionLabel="name" 
              optionValue="name"
              placeholder="Chọn collection..." 
              class="flex-1"
              :loading="collectionsLoading"
              :class="{ 'p-invalid': errors.collection_name }"
            >
              <template #value="{ value }">
                <div v-if="value" class="flex items-center gap-2">
                  <i class="pi pi-folder text-blue-500 text-sm"></i>
                  <span>{{ value }}</span>
                </div>
                <span v-else class="text-gray-500">Chọn collection...</span>
              </template>
              <template #option="{ option }">
                <div class="flex items-center gap-2 p-2">
                  <i class="pi pi-folder text-blue-500 text-sm"></i>
                  <span>{{ option.name }}</span>
                </div>
              </template>
            </Select>
            <Button 
              type="button" 
              icon="pi pi-refresh" 
              size="small" 
              severity="secondary" 
              @click="fetchCollections"
              :loading="collectionsLoading"
              v-tooltip.top="'Làm mới danh sách collection'"
              outlined
            />
          </div>
          <small v-if="errors.collection_name" class="p-error">{{ errors.collection_name }}</small>
        </div>
        
        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Mô tả
          </label>
          <Textarea 
            v-model="formData.description" 
            placeholder="Nhập mô tả tài liệu" 
            rows="3" 
            class="w-full" 
          />
        </div>
      </div>

      <!-- Upload Area -->
      <div
        class="upload-area relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer"
        :class="{ 
          'border-primary-500 bg-primary-50': isDropping,
          'border-gray-300 hover:border-primary-500 hover:bg-gray-50': !isDropping 
        }"
        @dragenter.prevent="isDropping = true" 
        @dragleave.prevent="isDropping = false"
        @dragover.prevent="isDropping = true" 
        @drop.prevent="handleFileDrop" 
        @click="openFileDialog"
      >
        <!-- Upload Prompt -->
        <div v-if="!formData.imgPreview" class="text-center">
          <i class="pi pi-upload text-4xl mb-4" :class="{ 'upload-animation': isDropping }"></i>
          <h3 class="font-medium text-gray-700 mb-1">Kéo thả file vào đây</h3>
          <p class="text-sm text-gray-500 mb-3">hoặc click để chọn file</p>
          <div class="text-xs text-gray-400">PDF, DOCX, TXT, CSV, XLSX (tối đa 20MB)</div>
        </div>

        <!-- File Preview -->
        <div v-else class="preview-container relative w-full">
          <div class="preview-wrapper relative rounded-lg overflow-hidden shadow-md mx-auto max-w-sm">
            <!-- Preview Content -->
            <div class="file-preview-box p-6 bg-gray-50 flex items-center justify-center min-h-[200px]">
              <div class="text-center">
                <i :class="[fileIconClass, 'text-4xl mb-3']"></i>
                <p class="text-lg font-bold file-extension">{{ fileExtension.toUpperCase() }}</p>
              </div>
            </div>

            <!-- Remove Button -->
            <button 
              @click.stop="resetPreview"
              class="remove-preview-btn absolute top-2 right-2 opacity-0 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-all duration-300"
            >
              <i class="pi pi-times"></i>
            </button>
          </div>
          
          <!-- File Info -->
          <div class="text-center mt-3">
            <p class="text-sm font-medium text-gray-700">{{ formData.file?.name }}</p>
            <p class="text-xs text-gray-500">{{ formatFileSize(formData.file?.size) }}</p>
          </div>
        </div>

        <input 
          type="file" 
          ref="fileInput"
          class="hidden" 
          @change="handleFileSelect" 
          accept=".pdf,.doc,.docx,.txt,.csv,.xlsx" 
        />
      </div>

      <div v-if="errors.file" class="mt-2">
        <small class="p-error">{{ errors.file }}</small>
      </div>

      <!-- Upload Status -->
      <div v-if="uploadStatus.show" class="mt-4">
        <ProgressBar v-if="uploadStatus.uploading" :value="uploadStatus.progress" class="mb-2" />
        <Message :severity="uploadStatus.severity" :closable="false">{{ uploadStatus.message }}</Message>
      </div>
    </div>

    <!-- Minimized View -->
    <div v-else class="p-4">
      <div class="text-center mb-3">
        <h3 class="text-lg font-medium mb-2">{{ formData.doc_title }}</h3>
        <p class="text-sm text-gray-600 mb-2">
          Collection: {{ formData.collection_name }}
        </p>
        <p class="text-sm text-gray-500">
          {{ formData.file?.name }} ({{ formatFileSize(formData.file?.size) }})
        </p>
      </div>
      <ProgressBar :value="uploadStatus.progress" class="mb-2" />
      <Message :severity="uploadStatus.severity" class="text-sm">
        {{ uploadStatus.message }}
      </Message>
    </div>
    
    <!-- Footer -->
    <template #footer>
      <div class="flex justify-end gap-3">
        <Button 
          size="small" 
          type="button" 
          label="Hủy" 
          severity="secondary" 
          icon="pi pi-times"
          @click="closeDialog" 
          outlined
        />
        <Button 
          size="small" 
          type="button" 
          :label="uploadStatus.uploading ? 'Đang tạo...' : 'Tạo document'"
          icon="pi pi-check" 
          @click="createDocument"
          :loading="uploadStatus.uploading" 
          :disabled="!isFormValid || uploadStatus.uploading"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import http from '@/service/http'
import CollectionService from '@/service/CollectionService'

const emit = defineEmits(['refresh', 'created'])

// Reactive data
const visible = ref(false)
const collectionsLoading = ref(false)
const isDropping = ref(false)
const fileInput = ref(null)
const Collections = ref([])
const dialogStyle = computed(() => ({
  width: isMinimized.value ? '300px' : '50rem',
  margin: isMinimized.value ? '0' : 'auto',
  position: 'fixed',
  bottom: isMinimized.value ? '20px' : 'auto',
  right: isMinimized.value ? '20px' : '50%',
  transform: isMinimized.value ? 'none' : 'translateX(50%)',
  transition: 'all 0.3s ease-in-out',
  zIndex: 1000
}))

const isMinimized = ref(false)
const formData = ref({
  doc_title: '',
  collection_name: '',
  description: '',
  file: null,
  imgPreview: null
})

const errors = ref({})

const uploadStatus = ref({
  show: false,
  uploading: false,
  progress: 0,
  message: '',
  severity: 'info'
})


const isFormValid = computed(() => {
  return formData.value.file && 
         formData.value.doc_title.trim() && 
         formData.value.collection_name &&
         Object.keys(errors.value).length === 0
})

const isImageFile = computed(() => {
  return formData.value.file && formData.value.file.type.startsWith('image/')
})

const fileType = computed(() => {
  if (!formData.value.file) return ''

  const type = formData.value.file.type
  const filename = formData.value.file.name.toLowerCase()
  
  if (type.includes('pdf') || filename.endsWith('.pdf')) return 'pdf'
  if (type.includes('word') || type.includes('doc') || filename.endsWith('.doc') || filename.endsWith('.docx')) return 'doc'
  if (type.includes('csv') || filename.endsWith('.csv')) return 'csv'
  if (type.includes('text') || filename.endsWith('.txt')) return 'txt'
  if (type.includes('excel') || type.includes('sheet') || filename.endsWith('.xlsx')) return 'xlsx'

  return 'other'
})

const fileExtension = computed(() => {
  if (!formData.value.file) return ''
  const filename = formData.value.file.name
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
})

const fileIconClass = computed(() => {
  const baseClass = 'file-icon'
  switch (fileType.value) {
    case 'pdf': return `${baseClass} text-red-500`
    case 'doc': return `${baseClass} text-blue-600`
    case 'csv': return `${baseClass} text-green-600`
    case 'xlsx': return `${baseClass} text-emerald-600`
    default: return `${baseClass} text-gray-500`
  }
})

// Methods
const fetchCollections = async () => {
  collectionsLoading.value = true
  try {
    const response = await CollectionService.getAll()
    Collections.value = response.data.data
    
    // Tự động chọn collection đầu tiên nếu có và form chưa có collection
    if (Collections.value.length > 0 && !formData.value.collection_name) {
      formData.value.collection_name = Collections.value[0].name
    }
    
    showUploadStatus('Làm mới danh sách collection thành công', 'success')
  } catch (error) {
    console.error('Không thể tải collections:', error)
    showUploadStatus('Không thể tải danh sách collection', 'error')
  } finally {
    collectionsLoading.value = false
  }
}

const openDialog = () => {
  visible.value = true
  resetForm()
  fetchCollections()
}

const closeDialog = () => {
  visible.value = false
}

const resetForm = () => {
  formData.value = {
    doc_title: '',
    collection_name: Collections.value.length > 0 ? Collections.value[0].name : '',
    description: '',
    file: null,
    imgPreview: null
  }
  errors.value = {}
  uploadStatus.value.show = false
}

const validateForm = () => {
  errors.value = {}
  
  if (!formData.value.doc_title.trim()) {
    errors.value.doc_title = 'Tiêu đề tài liệu là bắt buộc'
  }
  
  if (!formData.value.collection_name) {
    errors.value.collection_name = 'Vui lòng chọn collection'
  }
  
  if (!formData.value.file) {
    errors.value.file = 'Vui lòng chọn file'
  }
  
  return Object.keys(errors.value).length === 0
}

const openFileDialog = () => {
  fileInput.value?.click()
}

const handleFileDrop = (event) => {
  isDropping.value = false
  const files = event.dataTransfer.files
  if (files.length) {
    processFile(files[0])
  }
}

const handleFileSelect = (event) => {
  const files = event.target.files
  if (files.length) {
    processFile(files[0])
  }
}

const processFile = (file) => {
  if (isValidFileType(file)) {
    if (file.size > 20 * 1024 * 1024) { // 20MB limit
      showUploadStatus('File vượt quá kích thước cho phép (20MB)', 'error')
      return
    }
    
    formData.value.file = file
    if (checkIsImageFile(file)) {
      formData.value.imgPreview = URL.createObjectURL(file)
    } else {
      formData.value.imgPreview = 'placeholder'
    }

    if (errors.value.file) {
      delete errors.value.file
    }
  } else {
    showUploadStatus('File không được hỗ trợ. Chỉ chấp nhận PDF, DOCX, TXT, CSV, XLSX', 'error')
  }
}

const resetPreview = () => {
  formData.value.file = null
  formData.value.imgPreview = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
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
  ]
  
  const validExtensions = ['.pdf', '.doc', '.docx', '.txt', '.csv', '.xlsx']
  const filename = file.name.toLowerCase()
  
  return validTypes.includes(file.type) || validExtensions.some(ext => filename.endsWith(ext))
}

const checkIsImageFile = (file) => {
  return file && file.type.startsWith('image/')
}

const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B'
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
  else return (bytes / 1048576).toFixed(1) + ' MB'
}

const createDocument = async () => {
  if (!validateForm()) {
    return
  }

  isMinimized.value = true
  let uploadInterval = null
  
  try {
    // Show upload progress
    uploadStatus.value = {
      show: true,
      uploading: true,
      progress: 0,
      message: 'Đang tải lên document...',
      severity: 'info'
    }

    // Simulate upload progress
    uploadInterval = setInterval(() => {
      if (uploadStatus.value.progress < 90) {
        uploadStatus.value.progress += 10
      }
    }, 200)

    // Create FormData
    const formDataToSend = new FormData()
    formDataToSend.append('file', formData.value.file)
    formDataToSend.append('doc_title', formData.value.doc_title)
    formDataToSend.append('collection_name', formData.value.collection_name)
    if (formData.value.description) {
      formDataToSend.append('description', formData.value.description)
    }

    // Call API
    const response = await http.post('/doc/', formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    clearInterval(uploadInterval)
    uploadStatus.value.progress = 100

    if (response.data) {
      showUploadStatus(`Document đã được tạo thành công trong collection "${formData.value.collection_name}"!`, 'success')
      emit('created', response.data)
      emit('refresh')

      uploadStatus.value = {
      show: true,
      uploading: false,
      progress: 100,
      message: `Document "${formData.value.doc_title}" đã được tạo thành công!`,
      severity: 'success'
    }

      setTimeout(() => {
      visible.value = false
      isMinimized.value = false // Reset minimized state
    }, 2000)
    }
  } catch (error) {
    console.error('Error creating document:', error)
    if (uploadInterval) {
      clearInterval(uploadInterval)
    }
    
    let errorMessage = 'Có lỗi xảy ra khi tạo document'
    
    if (error.response?.status === 401) {
      errorMessage = 'Không có quyền truy cập. Vui lòng đăng nhập lại.'
    } else if (error.response?.status === 422) {
      errorMessage = 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.'
    } else if (error.response?.status === 404) {
      const responseData = error.response?.data
      if (responseData && responseData.detail && responseData.detail.includes('Collection') && responseData.detail.includes('not found')) {
        errorMessage = 'Bạn không có quyền thêm tài liệu vào collection này'
      } else {
        errorMessage = 'Không tìm thấy tài nguyên yêu cầu'
      }
    } else if (error.response?.status === 403) {
      errorMessage = 'Bạn không có quyền thêm tài liệu vào collection này'
    } else if (error.response?.data?.detail) {
      const detail = error.response.data.detail
      if (detail.includes('Collection') && detail.includes('not found')) {
        errorMessage = 'Bạn không có quyền thêm tài liệu vào collection này'
      } else {
        errorMessage = detail
      }
    }
    
    showUploadStatus(errorMessage, 'error')
    uploadStatus.value = {
      show: true,
      uploading: false,
      progress: 0,
      message: errorMessage,
      severity: 'error'
    }
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

// Initialize collections when component mounts
onMounted(() => {
  fetchCollections()
})

// Expose methods for parent component
defineExpose({
  openDialog
})
</script>
<style scoped>
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

.p-invalid {
  border-color: #ef4444 !important;
}

.p-error {
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.document-form-dialog {
  transition: all 0.3s ease-in-out;
}

:deep(.p-dialog) {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

:deep(.p-dialog-mask) {
  background-color: rgba(0, 0, 0, 0.1);
  pointer-events: none;
}

:deep(.p-dialog-header),
:deep(.p-dialog-content),
:deep(.p-dialog-footer) {
  background-color: white;
}

.minimized-view {
  opacity: 0.95;
}

.minimized-view:hover {
  opacity: 1;
}

/* Ensure dialog content is scrollable if needed */
:deep(.p-dialog-content) {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}
</style>