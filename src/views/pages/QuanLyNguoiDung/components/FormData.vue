<template>
  <Dialog
    v-model:visible="visibleModal"
    modal
    :header="payload.id ? 'Cập nhật người dùng' : 'Thêm mới người dùng'"
    :style="{ width: '50rem' }"
  >
    <div class="grid grid-cols-12 gap-5">
      <div class="col-span-12">
        <div class="grid grid-cols-12 gap-5">
          <div class="col-span-6">
            <div class="flex flex-col gap-2">
              <label class="font-medium text-gray-700"
                >Tên đăng nhập<sup class="text-red-500">*</sup></label
              >
              <InputText
                placeholder="Nhập nội dung"
                size="small"
                :disabled="payload.id"
                v-model="payload.userName"
                :invalid="!!messages.userName"
              />
            </div>
            <small v-if="!!messages.userName" class="text-red-500">{{
              messages.userName
            }}</small>
          </div>
          <div class="col-span-6">
            <div class="flex flex-col gap-2">
              <label class="font-medium text-gray-700"
                >Email <sup class="text-red-500">*</sup></label
              >
              <InputText
                placeholder="Nhập nội dung"
                size="small"
                type="email"
                v-model="payload.email"
                :invalid="!!messages.email"
              ></InputText>
            </div>
            <small v-if="!!messages.email" class="text-red-500">{{
              messages.userName
            }}</small>
          </div>
          <div class="col-span-6">
            <div class="flex flex-col gap-2">
              <label class="font-medium text-gray-700">Tên người dùng</label>
              <InputText
                v-model="payload.fullName"
                class="w-full"
                placeholder="Nhập nội dung"
                size="small"
              />
            </div>
          </div>
          <div class="col-span-6">
            <div class="flex flex-col gap-2">
              <label class="font-medium text-gray-700"
                >Thuộc đơn vị <sup class="text-red-500">*</sup></label
              >
              <SelectTreeCustome
                v-model="payload.organizationalStructureId"
                placeholder="Bộ phận"
                url="OrganizationalStructure"
                optionLabel="orgStrName"
                optionValue="id"
                :invalid="!!messages.organizationalStructureId"
              ></SelectTreeCustome>
            </div>
            <small v-if="!!messages.email" class="text-red-500">{{
              messages.organizationalStructureId
            }}</small>
          </div>
          <div class="col-span-12">
            <div class="flex flex-col gap-2">
              <label class="font-medium text-gray-700"
                >Vai trò <sup class="text-red-500">*</sup></label
              >
              <Select
                size="small"
                placeholder="Nhập nội dung"
                :options="Roles"
                v-model="payload.roleId"
                optionLabel="name"
                optionValue="id"
                :invalid="!!messages.roleId"
              ></Select>
            </div>
            <small v-if="!!messages.email" class="text-red-500">{{
              messages.roleId
            }}</small>
          </div>
          <div class="col-span-6">
            <div class="flex flex-col gap-2">
              <label class="font-medium text-gray-700">Số điện thoại </label>
              <InputText
                size="small"
                placeholder="Nhập nội dung"
                v-model="payload.phoneNumber"
              ></InputText>
            </div>
          </div>
          <div class="col-span-6">
            <div class="flex flex-col gap-2">
              <label class="font-medium text-gray-700">Chức vụ </label>
              <InputText
                size="small"
                placeholder="Nhập nội dung"
                v-model="payload.position"
              ></InputText>
            </div>
          </div>
          <div class="col-span-12">
            <div class="flex flex-col gap-2">
              <label class="font-medium text-gray-700">Trạng thái </label>
              <ToggleSwitch
                v-model="payload.isActive"
                size="small"
                :true-value="true"
                :false-value="false"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="flex justify-end w-full gap-2">
        <Button
          type="button"
          label="Đóng"
          icon="pi pi-times"
          severity="secondary"
          size="small"
          @click="visibleModal = false"
        ></Button>
        <Button
          type="button"
          icon="pi pi-save"
          label="Lưu"
          size="small"
          @click="saveData"
        ></Button>
      </div>
    </template>
  </Dialog>
  <Loading v-if="isLoading"></Loading>
</template>
<script setup>
import SelectTreeCustome from "@/components/SelectTree/SelectTreeCustome.vue";
import RoleService from "@/service/RoleService";
import UserSerivce from "@/service/UserService";
import { useToast } from "primevue/usetoast";
import { getCurrentInstance, ref } from "vue";

const { proxy } = getCurrentInstance();
const visibleModal = ref(false);
const messages = ref({});
const toast = useToast();
const Roles = ref([]);
const isLoading = ref(false);
const props = defineProps({
  dataTable: Array,
  loadData: {
    type: Function,
    default: () => {},
  },
});

const payload = ref({
  fullName: "",
  organizationalStructureId: null,
  userName: "",
  email: "",
  phoneNumber: "",
  password: "1234@Abcd",
  isActive: true,
  roleId: null,
  position: "",
});

const openDialog = async (data = null) => {
  if (!!data.id) {
    payload.value = { ...data };
  } else {
    payload.value = {
      fullName: "",
      organizationalStructureId: null,
      userName: "",
      email: "",
      phoneNumber: "",
      password: "1234@Abcd",
      isActive: true,
      roleId: null,
      position: "",
    };
  }
  await getAllRole();
  messages.value = {};
  visibleModal.value = true;
};

const getAllRole = async () => {
  try {
    const res = await RoleService.getAll();
    Roles.value = res.data.result;
  } catch (error) {}
};

const saveData = async () => {
  try {
    isLoading.value = true;
    await UserSerivce.save(payload.value);
    visibleModal.value = false;
    proxy.$notify("S", "Thao tác thành công!", toast);
    props.loadData();
  } catch (error) {
    if (error.isValidate) {
      messages.value = error;
    } else {
      proxy.$notify("E", error?.response?.data?.Message || error, toast);
    }
  } finally {
    isLoading.value = false;
  }
};

defineExpose({
  openDialog,
});
</script>
