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
            <h2 class="font-bold text-2xl text-gray-800 mb-0">Người dùng</h2>
            <p class="text-sm text-gray-500">Quản lý người dùng</p>
          </div>
        </div>
      </div>
    </div>
    <div class="card">
      <DataTable :value="Users" paginator rows="5" scrollable scrollHeight="600px" size="small" showGridlines>
        <Column header="#">
          <template #body="{ index }">
            {{ index + 1 }}
          </template>
        </Column>
        <Column header="Tên người dùng">
          <template #body="{ data }">

            {{ data.username }}
          </template>
        </Column>
        <Column field="email" header="Thao tác">
        </Column>
        <Column field="role" header="Vai trò">
          <template #body="{ data }">
            <Dropdown v-model="data.role" @change="onRoleChange($event, data)" :options="RoleOpts" optionValue="role"
              optionLabel="role" fluid></Dropdown>
          </template>
        </Column>
        <Column header="Trạng thái">
          <template #body="{ data }">
            {{ data.is_online ? `Hoạt động` : `Dừng hoạt động` }}
          </template>
        </Column>
        <Column header="Thao tác">
          <template #body="{ data }">
            <div class="flex gap-2">
              <!-- <Button @click="openDetail(data)" size="small" icon="pi pi-pencil" text severity="info"></Button> -->
              <Button @click="removeUser(data)" size="small" icon="pi pi-trash" text severity="danger"></Button>
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog v-model:visible="editModal" modal header="Cập nhật người dùng" :style="{ width: '50rem' }">

      <template #footer>
        <div class="flex justify-content-end gap-2">
          <Button type="button" label="Hủy" severity="secondary" @click="editModal = false"></Button>
          <Button type="button" label="Lưu" @click="UpdateUser()"></Button>
        </div>
      </template>
    </Dialog>
    <Loading v-if="isLoading"></Loading>
  </div>
</template>
<script setup>
import http from '@/service/http';
import { getCurrentInstance, onMounted, ref } from 'vue';

import { useToast } from "primevue";

const toast = useToast();
const { proxy } = getCurrentInstance();

onMounted(() => {
  fetchAllUsers()
  fetchAllPermissions()
})
const isLoading = ref(false)
const editModal = ref(false)
const RoleOpts = ref([])
const payload = ref({
  title: '',
  type: null,
  description: '',
  items: [''],
  file: null,
  imgPreview: null
})
const Users = ref([])


const openDetail = () => {
  editModal.value = true
}



const fetchAllUsers = async () => {
  isLoading.value = true
  try {
    const res = await http.get(`users`)
    Users.value = res.data
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false
  }
}
const fetchAllPermissions = async () => {
  try {
    const res = await http.get(`permissions`)
    RoleOpts.value = res.data.roles
    console.log(res.data.roles);
  } catch (error) {
    console.log(error);
  }
}
const onRoleChange = async (e, data) => {
  let payload = {
    role: e.value
  }
  try {
    const res = await http.put(`users/${data.id}/update-role`, payload)
    if (res.data) {
      proxy.$notify('S', 'Cập nhật vai trò thành công!', toast)

    }
  } catch (error) {
    proxy.$notify('E', error, toast)
  } finally {
    fetchAllUsers()
  }
}











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