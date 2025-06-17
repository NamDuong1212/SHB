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
            <h2 class="font-bold text-2xl text-gray-800 mb-0">Images</h2>
            <p class="text-sm text-gray-500">Images Upload</p>
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
      <DataTable :value="Images" paginator rows="5" scrollable scrollHeight="600px" size="small" showGridlines>
        <template #header>
          <div class="flex justify-end p-2">
            <Button size="small" @click="openAddFile" icon="pi pi-plus" label="Thêm mới"></Button>
          </div>
        </template>
        <Column header="STT">
          <template #body="{ index }">
            {{ index + 1 }}
          </template>
        </Column>
        <Column header="Ảnh">
          <template #body="{ data }">
            <Image :src="data.image_url" alt="Image" width="70" />
          </template>
        </Column>
        <Column header="Tiêu đề">
          <template #body="{ data }">
            <span>{{ data.title }}</span>
          </template>
        </Column>
        <Column header="Loại"></Column>
        <Column header="Thao tác">
          <template #body="{ data }">
            <Button severity="danger" size="small" icon="pi pi-trash" rounded text @click="removeFile(data)"></Button>
          </template>
        </Column>
      </DataTable>
    </div>
    <Dialog v-model:visible="addFileModal" modal header="Upload Files" :style="{ width: '50rem' }"
      class="chatbot-upload-dialog">
      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-5">
          <div
            class="upload-preview-container relative bg-gray-100 rounded-lg h-64 flex items-center justify-center overflow-hidden">
            <img v-if="payload.imgPreview" :src="payload.imgPreview" alt="Preview"
              class="max-h-full max-w-full object-contain" />
            <div v-else class="flex flex-col items-center justify-center text-gray-400">
              <i class="pi pi-image !text-4xl mb-2"></i>
            </div>
            <div class="absolute bottom-0 right-0 m-3">
              <Button icon="pi pi-upload" @click="Openfile()" :label="payload.imgPreview ? 'Cập nhật' : 'Tải lên'"
                severity="info" rounded size="small" class="shadow-md" />
            </div>
          </div>
          <input type="file" accept="image/*" class="hidden click-file" @change="UploadFileLocal($event)" />
          <div class="mt-3 text-xs text-gray-500">
            <p>Hỗ trợ định dạng: JPG, PNG, GIF (tối đa 5MB)</p>
          </div>
        </div>
        <div class="col-span-7 flex flex-col gap-4">
          <div class="flex flex-col gap-2">
            <label for="media-title" class="font-medium text-gray-700">Tiêu đề <sup class="text-red-500">*</sup></label>
            <InputText size="small" id="media-title" v-model="payload.title" :invalid="!payload.title && submited"
              placeholder="Nhập tiêu đề cho media" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="font-medium text-gray-700" for="">Câu hỏi</label>
            <div v-for="(item, index) in payload.items" :key="index" class="flex flex-col gap-2">
              <div class="flex gap-1">
                <InputText placeholder="Nhập câu hỏi" fluid v-model="payload.items[index]" size="small"></InputText>
                <Button :disabled="payload.items?.length < 2" text severity="danger" size="small"
                  @click="removeLineItem(index)" icon="pi pi-trash"></Button>
              </div>
            </div>
            <Button label="Thêm câu hỏi" icon="pi pi-plus" size="small" text @click="() => {
              payload.items.push('')
            }"></Button>
          </div>
          <div class="flex flex-col gap-2">
            <label for="media-description" class="font-medium text-gray-700">Mô tả</label>
            <Textarea size="small" id="media-description" v-model="payload.description" placeholder="Thêm mô tả ngắn"
              rows="3" autoResize />
          </div>

        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <Button size="small" type="button" label="Hủy" severity="secondary" icon="pi pi-times"
            @click="addFileModal = false" text></Button>
          <Button size="small" type="button" label="Lưu" icon="pi pi-check" @click="saveMedia"></Button>
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
          Bạn có chắc chắn muốn xóa ảnh <span class="font-semibold">{{ selectedImage?.title }}</span>?
        </p>
        <p class="text-sm text-gray-500">
          Hành động này không thể hoàn tác. Ảnh này sẽ bị xóa vĩnh viễn khỏi hệ thống.
        </p>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <Button type="button" size="small" label="Hủy" severity="secondary" @click="confirmDeleteDialog = false"
            text></Button>
          <Button type="button" size="small" label="Xóa" icon="pi pi-trash" severity="danger"
            @click="confirmDelete"></Button>
        </div>
      </template>
    </Dialog>
    <loading v-if="isLoading"></loading>
  </div>
</template>
<script setup>
import http from '@/service/http';
import { useToast } from "primevue";
import { getCurrentInstance, onMounted, ref } from 'vue';

const toast = useToast();
const { proxy } = getCurrentInstance();


onMounted(() => {
  fetchAllImages()
})
const payload = ref({
  title: '',
  type: null,
  description: '',
  items: [''],
  file: null,
  imgPreview: null
})
const isLoading = ref(false)
const submited = ref(false)
const Images = ref([])
const addFileModal = ref(false)
const confirmDeleteDialog = ref(false)
const selectedImage = ref(null)

const fetchAllImages = async () => {
  isLoading.value = true
  try {

    const res = await http.get(`/fastapi/cards/`)
    Images.value = res.data.items
    console.log(res);
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false
  }
}
const removeFile = async (data) => {
  selectedImage.value = data
  confirmDeleteDialog.value = true
}
const openAddFile = () => {
  addFileModal.value = true
}
const Openfile = () => {
  document.querySelectorAll('.click-file')[0].click();
};
const UploadFileLocal = (event) => {
  const files = event.target.files;
  payload.value.file = files[0];
  payload.value.imgPreview = URL.createObjectURL(files[0]);
};
const validateData = () => {
  if (!payload.value.title) {
    proxy.$notify('E', 'Vui lòng nhập tiêu đề!', toast)
    return false
  }

  return true
}
const saveMedia = async () => {
  submited.value = true
  if (!validateData()) return
  try {
    const formData = new FormData();
    formData.append('image', payload.value.file);
    formData.append('data', JSON.stringify(payload.value));

    const res = await http.post('/fastapi/cards', formData);
    if (res.data) {
      fetchAllImages();
      addFileModal.value = false;
      resetPayload();
    }
    addFileModal.value = false;
    resetPayload();
  } catch (error) {
    console.log(error);
  }
}
const resetPayload = () => {
  payload.value = {
    title: '',
    type: null,
    description: '',
    items: [''],
    file: null,
    imgPreview: null
  };
}
const confirmDelete = async () => {
  try {
    const res = await http.delete(`/fastapi/cards/${selectedImage.value.id}`)
    if (res.data) {
      fetchAllImages()
      confirmDeleteDialog.value = false
      selectedImage.value = null
    }
  } catch (error) {
    console.log(error)
  }
};
const removeLineItem = (index) => {
  payload.value.items.splice(index, 1)
}
</script>
<style></style>