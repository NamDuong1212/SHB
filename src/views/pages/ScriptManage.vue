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
            <h2 class="font-bold text-2xl text-gray-800 mb-0">Kịch bản</h2>
            <p class="text-sm text-gray-500">Quản lý kịch bản</p>
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
      <DataTable :value="Array(10)" paginator rows="5" scrollable scrollHeight="600px" size="small" showGridlines>
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

        </Column>
        <Column header="Tiêu đề">

        </Column>
        <Column header="Loại"></Column>
        <Column header="Thao tác">
          <!-- <template #body="{ data }">
            <Button severity="danger" size="small" icon="pi pi-trash" rounded text @click="removeFile(data)"></Button>
          </template> -->
        </Column>
      </DataTable>
    </div>
    <Dialog v-model:visible="addFileModal" modal header="Thiết lập kịch bản" :style="{ width: '70rem' }"
      class="chatbot-upload-dialog">
      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-12">
          <!-- Customer Information Card -->
          <div
            class="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 mb-6">
            <div class="px-6 py-4 border-b border-gray-100">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="text-blue-600">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <h4 class="text-lg font-semibold text-gray-800 m-0">Thông tin khách hàng</h4>
              </div>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="group">
                  <div
                    class="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors duration-200">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                          class="text-emerald-600">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </div>
                      <label class="text-sm font-medium text-gray-700">Tên khách hàng</label>
                    </div>
                    <ToggleSwitch></ToggleSwitch>
                  </div>
                </div>

                <div class="group">
                  <div
                    class="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors duration-200">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                          class="text-purple-600">
                          <path
                            d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z">
                          </path>
                        </svg>
                      </div>
                      <label class="text-sm font-medium text-gray-700">Số điện thoại</label>
                    </div>
                    <ToggleSwitch></ToggleSwitch>
                  </div>
                </div>

                <div class="group">
                  <div
                    class="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors duration-200">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                          class="text-orange-600">
                          <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                          <path d="m7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                      </div>
                      <label class="text-sm font-medium text-gray-700">Số CCCD</label>
                    </div>
                    <ToggleSwitch></ToggleSwitch>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Card Information Card -->
          <div
            class="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div class="px-6 py-4 border-b border-gray-100">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="text-indigo-600">
                    <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                    <line x1="2" x2="22" y1="10" y2="10"></line>
                  </svg>
                </div>
                <h4 class="text-lg font-semibold text-gray-800 m-0">Thông tin xác thực thông tin thẻ</h4>
              </div>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div class="group">
                  <div
                    class="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors duration-200">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                          class="text-blue-600">
                          <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                          <line x1="2" x2="22" y1="10" y2="10"></line>
                        </svg>
                      </div>
                      <label class="text-sm font-medium text-gray-700">Số thẻ</label>
                    </div>
                    <ToggleSwitch></ToggleSwitch>
                  </div>
                </div>

                <div class="group">
                  <div
                    class="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors duration-200">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                          class="text-green-600">
                          <path d="M9 12l2 2 4-4"></path>
                          <circle cx="12" cy="12" r="9"></circle>
                        </svg>
                      </div>
                      <label class="text-sm font-medium text-gray-700">Trạng thái thẻ</label>
                    </div>
                    <ToggleSwitch></ToggleSwitch>
                  </div>
                </div>

                <div class="group">
                  <div
                    class="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors duration-200">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-cyan-50 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                          class="text-cyan-600">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12,6 12,12 16,14"></polyline>
                        </svg>
                      </div>
                      <label class="text-sm font-medium text-gray-700">Giao dịch gần nhất</label>
                    </div>
                    <ToggleSwitch></ToggleSwitch>
                  </div>
                </div>

                <div class="group">
                  <div
                    class="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors duration-200">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                          class="text-red-600">
                          <line x1="12" x2="12" y1="2" y2="22"></line>
                          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                        </svg>
                      </div>
                      <label class="text-sm font-medium text-gray-700">Dư nợ</label>
                    </div>
                    <ToggleSwitch></ToggleSwitch>
                  </div>
                </div>
              </div>
            </div>
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
      proxy.$notify('S', 'Xóa thành công!', toast)
    }
  } catch (error) {
    proxy.$notify('E', error, toast)
  }
};
const removeLineItem = (index) => {
  payload.value.items.splice(index, 1)
}
</script>
<style></style>