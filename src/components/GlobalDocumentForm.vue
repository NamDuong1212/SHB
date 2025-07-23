<template>
    <Dialog v-model:visible="documentFormStore.isVisible" :modal="false"
        :dismissableMask="!documentFormStore.uploadStatus.uploading"
        :closeOnEscape="!documentFormStore.uploadStatus.uploading" :draggable="!documentFormStore.isMinimized"
        :style="dialogStyle" class="global-document-form-dialog" :closable="!documentFormStore.uploadStatus.uploading"
        @hide="handleDialogHide" :breakpoints="{ '960px': '75vw', '641px': '90vw' }">
        <!-- Custom Header -->
        <template #header>
            <div class="flex justify-between items-center w-full">
                <span class="text-xl font-medium">Tạo document mới</span>
                <div class="flex gap-2">
                    <Button type="button"
                        :icon="documentFormStore.isMinimized ? 'pi pi-window-maximize' : 'pi pi-window-minimize'"
                        class="p-button-text p-button-sm" @click="documentFormStore.minimizeDialog()"
                        v-tooltip.left="documentFormStore.isMinimized ? 'Phóng to' : 'Thu nhỏ'" />
                </div>
            </div>
        </template>

        <!-- Main Content -->
        <div v-if="!documentFormStore.isMinimized" class="p-4">
            <!-- Form Fields -->
            <div class="space-y-4 mb-6">
                <!-- Document Title -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Tiêu đề tài liệu *
                    </label>
                    <InputText v-model="documentFormStore.formData.doc_title" placeholder="Nhập tiêu đề tài liệu"
                        class="w-full" :class="{ 'p-invalid': documentFormStore.errors.doc_title }" />
                    <small v-if="documentFormStore.errors.doc_title" class="p-error">
                        {{ documentFormStore.errors.doc_title }}
                    </small>
                </div>

                <!-- Collection -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Collection *
                    </label>
                    <div class="flex gap-2">
                        <Select v-model="documentFormStore.formData.collection_name"
                            :options="documentFormStore.collections" optionLabel="name" optionValue="name"
                            placeholder="Chọn collection..." class="flex-1"
                            :loading="documentFormStore.collectionsLoading"
                            :class="{ 'p-invalid': documentFormStore.errors.collection_name }">
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
                        <Button type="button" icon="pi pi-refresh" size="small" severity="secondary"
                            @click="fetchCollections" :loading="documentFormStore.collectionsLoading"
                            v-tooltip.top="'Làm mới danh sách collection'" outlined />
                    </div>
                    <small v-if="documentFormStore.errors.collection_name" class="p-error">
                        {{ documentFormStore.errors.collection_name }}
                    </small>
                </div>

                <!-- Description -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Mô tả
                    </label>
                    <Textarea v-model="documentFormStore.formData.description" placeholder="Nhập mô tả tài liệu"
                        rows="3" class="w-full" />
                </div>
            </div>

            <!-- Upload Area -->
            <div class="upload-area relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer"
                :class="{
                    'border-primary-500 bg-primary-50': isDropping,
                    'border-gray-300 hover:border-primary-500 hover:bg-gray-50': !isDropping
                }" @dragenter.prevent="isDropping = true" @dragleave.prevent="isDropping = false"
                @dragover.prevent="isDropping = true" @drop.prevent="handleFileDrop" @click="openFileDialog">
                <!-- Upload Prompt -->
                <div v-if="!documentFormStore.formData.imgPreview" class="text-center">
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
                        <button @click.stop="resetPreview"
                            class="remove-preview-btn absolute top-2 right-2 opacity-0 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-all duration-300">
                            <i class="pi pi-times"></i>
                        </button>
                    </div>

                    <!-- File Info -->
                    <div class="text-center mt-3">
                        <p class="text-sm font-medium text-gray-700">{{ documentFormStore.formData.file?.name }}</p>
                        <p class="text-xs text-gray-500">{{ formatFileSize(documentFormStore.formData.file?.size) }}</p>
                    </div>
                </div>

                <input type="file" ref="fileInput" class="hidden" @change="handleFileSelect"
                    accept=".pdf,.doc,.docx,.txt,.csv,.xlsx" />
            </div>

            <div v-if="documentFormStore.errors.file" class="mt-2">
                <small class="p-error">{{ documentFormStore.errors.file }}</small>
            </div>

            <!-- Upload Status -->
            <div v-if="documentFormStore.uploadStatus.show" class="mt-4">
                <ProgressBar v-if="documentFormStore.uploadStatus.uploading"
                    :value="documentFormStore.uploadStatus.progress" class="mb-2" />
                <Message :severity="documentFormStore.uploadStatus.severity" :closable="false">
                    {{ documentFormStore.uploadStatus.message }}
                </Message>
            </div>
        </div>

        <!-- Minimized View -->
        <div v-else class="p-4">
            <div class="text-center mb-3">
                <h3 class="text-lg font-medium mb-2">{{ documentFormStore.formData.doc_title }}</h3>
                <p class="text-sm text-gray-600 mb-2">
                    Collection: {{ documentFormStore.formData.collection_name }}
                </p>
                <p class="text-sm text-gray-500">
                    {{ documentFormStore.formData.file?.name }} ({{
                        formatFileSize(documentFormStore.formData.file?.size) }})
                </p>
            </div>
            <ProgressBar v-if="documentFormStore.uploadStatus.uploading"
                :value="documentFormStore.uploadStatus.progress" class="mb-2" />
            <Message v-if="documentFormStore.uploadStatus.show" :severity="documentFormStore.uploadStatus.severity"
                class="text-sm">
                {{ documentFormStore.uploadStatus.message }}
            </Message>
        </div>

        <!-- Footer -->
        <template #footer>
            <div class="flex justify-end gap-3">
                <Button size="small" type="button" label="Hủy" severity="secondary" icon="pi pi-times"
                    @click="handleCancel" outlined :disabled="documentFormStore.uploadStatus.uploading" />
                <Button size="small" type="button"
                    :label="documentFormStore.uploadStatus.uploading ? 'Đang tạo...' : 'Tạo document'"
                    icon="pi pi-check" @click="createDocument" :loading="documentFormStore.uploadStatus.uploading"
                    :disabled="!documentFormStore.isFormValid || documentFormStore.uploadStatus.uploading" />
            </div>
        </template>
    </Dialog>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { useDocumentFormStore } from '@/stores/useDocumentFormStore'
import http from '@/service/http'
import CollectionService from '@/service/CollectionService'
import { useRouter } from 'vue-router'

const router = useRouter()
const documentFormStore = useDocumentFormStore()
const emit = defineEmits(['refresh', 'created'])

const isDropping = ref(false)
const fileInput = ref(null)

const openDialog = () => {
    documentFormStore.openDialog()
}

const closeDialog = () => {
    documentFormStore.closeDialog()
}

defineExpose({
    openDialog,
    closeDialog
})

const dialogStyle = computed(() => ({
    width: documentFormStore.isMinimized ? '350px' : '50rem',
    margin: documentFormStore.isMinimized ? '0' : 'auto',
    position: 'fixed',
    bottom: documentFormStore.isMinimized ? '20px' : 'auto',
    right: documentFormStore.isMinimized ? '20px' : '50%',
    transform: documentFormStore.isMinimized ? 'none' : 'translateX(50%)',
    transition: 'all 0.3s ease-in-out',
    zIndex: 9999
}))

const fileType = computed(() => {
    if (!documentFormStore.formData.file) return ''

    const type = documentFormStore.formData.file.type
    const filename = documentFormStore.formData.file.name.toLowerCase()

    if (type.includes('pdf') || filename.endsWith('.pdf')) return 'pdf'
    if (type.includes('word') || type.includes('doc') || filename.endsWith('.doc') || filename.endsWith('.docx')) return 'doc'
    if (type.includes('csv') || filename.endsWith('.csv')) return 'csv'
    if (type.includes('text') || filename.endsWith('.txt')) return 'txt'
    if (type.includes('excel') || type.includes('sheet') || filename.endsWith('.xlsx')) return 'xlsx'

    return 'other'
})

const fileExtension = computed(() => {
    if (!documentFormStore.formData.file) return ''
    const filename = documentFormStore.formData.file.name
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

const fetchCollections = async () => {
    documentFormStore.collectionsLoading = true
    try {
        const response = await CollectionService.getByUser()
        documentFormStore.setCollections(response.data)

        // Tự động chọn collection đầu tiên nếu có và form chưa có collection
        if (response.data.length > 0 && !documentFormStore.formData.collection_name) {
            documentFormStore.setFormData({ collection_name: response.data[0].name })
        }

        showUploadStatus('Làm mới danh sách collection thành công', 'success')
    } catch (error) {
        console.error('Không thể tải collections:', error)
        showUploadStatus('Không thể tải danh sách collection', 'error')
    } finally {
        documentFormStore.collectionsLoading = false
    }
}

const handleDialogHide = () => {
    if (!documentFormStore.uploadStatus.uploading) {
        documentFormStore.closeDialog()
    }
}

const handleCancel = () => {
    if (documentFormStore.uploadStatus.uploading) {
        if (confirm('Đang có quá trình upload. Bạn có chắc chắn muốn hủy?')) {
            documentFormStore.closeDialog()
        }
    } else {
        documentFormStore.closeDialog()
    }
}

const validateForm = () => {
    const errors = {}

    if (!documentFormStore.formData.doc_title.trim()) {
        errors.doc_title = 'Tiêu đề tài liệu là bắt buộc'
    }

    if (!documentFormStore.formData.collection_name) {
        errors.collection_name = 'Vui lòng chọn collection'
    }

    if (!documentFormStore.formData.file) {
        errors.file = 'Vui lòng chọn file'
    }

    documentFormStore.setErrors(errors)
    return Object.keys(errors).length === 0
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

        const imgPreview = checkIsImageFile(file) ? URL.createObjectURL(file) : 'placeholder'
        documentFormStore.setFormData({
            file: file,
            imgPreview: imgPreview
        })

        const currentErrors = { ...documentFormStore.errors }
        delete currentErrors.file
        documentFormStore.setErrors(currentErrors)
    } else {
        showUploadStatus('File không được hỗ trợ. Chỉ chấp nhận PDF, DOCX, TXT, CSV, XLSX', 'error')
    }
}

const resetPreview = () => {
    documentFormStore.setFormData({
        file: null,
        imgPreview: null
    })
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
    if (!bytes) return '0 B'
    if (bytes < 1024) return bytes + ' B'
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
    else return (bytes / 1048576).toFixed(1) + ' MB'
}

const createDocument = async () => {
    if (!validateForm()) {
        return
    }

    documentFormStore.isMinimized = true
    let uploadInterval = null

    try {
        documentFormStore.setUploadStatus({
            show: true,
            uploading: true,
            progress: 0,
            message: 'Đang tải lên document...',
            severity: 'info'
        })

        uploadInterval = setInterval(() => {
            if (documentFormStore.uploadStatus.progress < 90) {
                documentFormStore.setUploadStatus({
                    progress: documentFormStore.uploadStatus.progress + 10
                })
            }
        }, 200)

        const formDataToSend = new FormData()
        formDataToSend.append('file', documentFormStore.formData.file)
        formDataToSend.append('doc_title', documentFormStore.formData.doc_title)
        formDataToSend.append('collection_name', documentFormStore.formData.collection_name)
        if (documentFormStore.formData.description) {
            formDataToSend.append('description', documentFormStore.formData.description)
        }

        const response = await http.post('/doc/', formDataToSend, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

        clearInterval(uploadInterval)
        documentFormStore.setUploadStatus({ progress: 100 })

        if (response.data) {
            showUploadStatus(`Document "${documentFormStore.formData.doc_title}" đã được tạo thành công!`, 'success')
            emit('created', response.data)
            emit('refresh')

            documentFormStore.setUploadStatus({
                show: true,
                uploading: false,
                progress: 100,
                message: `Document "${documentFormStore.formData.doc_title}" đã được tạo thành công!`,
                severity: 'success'
            })

            setTimeout(() => {
                documentFormStore.closeDialog()
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
        documentFormStore.setUploadStatus({
            show: true,
            uploading: false,
            progress: 0,
            message: errorMessage,
            severity: 'error'
        })
    }
}

const showUploadStatus = (message, severity = 'info') => {
    documentFormStore.setUploadStatus({
        show: true,
        uploading: false,
        progress: 100,
        message: message,
        severity: severity
    })

    setTimeout(() => {
        documentFormStore.setUploadStatus({ show: false })
    }, 3000)
}

onMounted(() => {
    fetchCollections()
})

watch(() => router.currentRoute.value, () => {
}, { immediate: true })
</script>

<style scoped>
.global-document-form-dialog {
    z-index: 9999 !important;
}

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

.p-invalid {
    border-color: #ef4444 !important;
}

.p-error {
    color: #ef4444;
    font-size: 0.75rem;
    margin-top: 0.25rem;
}

:deep(.p-dialog-content) {
    max-height: calc(100vh - 200px);
    overflow-y: auto;
}

:deep(.p-dialog) {
    z-index: 9999 !important;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

:deep(.p-dialog-mask) {
    background-color: rgba(0, 0, 0, 0.1);
    pointer-events: none;
    z-index: 9998 !important;
}
</style>