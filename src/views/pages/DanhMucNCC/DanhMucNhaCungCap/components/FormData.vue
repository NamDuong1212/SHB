<template>
  <Dialog
    v-model:visible="SupplierModal"
    modal
    header="Thêm mới nhà cung cấp"
    :style="{ width: '95rem' }"
  >
    <div class="flex flex-col gap-3">
      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-6 flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <label class="font-medium text-gray-700 w-2/5"
              >Mã nhà cung cấp <sup class="text-red-500">&nbsp;</sup></label
            >
            <div class="flex gap-2 w-3/5">
              <Select class="w-2/5" placeholder="Tự động" size="small" />
              <InputText
                class="w-1/2"
                placeholder="Nhập nội dung"
                v-model="payload.supplierCode"
                size="small"
                :disabled="payload.id"
              />
              <Select
                class="w-2/5"
                size="small"
                v-model="payload.type"
                optionLabel="name"
                optionValue="code"
                :options="[
                  { code: 'Company', name: 'Công ty' },
                  { code: 'Individual', name: 'Cá nhân' },
                ]"
              />
            </div>
          </div>
          <div class="flex items-center gap-2">
            <label class="font-medium text-gray-700 w-2/5">Mã cũ</label>
            <div class="w-3/5">
              <InputText
                class="w-full"
                placeholder="Nhập nội dung"
                v-model="payload.supplierOrderCode"
                size="small"
              />
            </div>
          </div>
          <div class="flex items-center gap-2">
            <label class="font-medium text-gray-700 w-2/5"
              >Tên nhà cung cấp <sup class="text-red-500">*</sup></label
            >
            <div class="w-3/5">
              <InputText
                class="w-full"
                v-model="payload.supplierName"
                placeholder="Nhập nội dung"
                :invalid="messages.supplierName"
                size="small"
              />
              <small class="text-red-500">{{ messages.supplierName }}</small>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <label class="font-medium w-2/5 text-gray-700">Tên gọi khác </label>
            <div class="w-3/5">
              <InputText
                class="w-full"
                v-model="payload.supplierOrtherName"
                placeholder="Nhập nội dung"
                size="small"
              />
            </div>
          </div>
          <div class="flex items-center gap-2">
            <label class="font-medium w-2/5 text-gray-700">Mã số thuế</label>
            <div class="w-3/5">
              <InputText
                class="w-full"
                v-model="payload.tax"
                placeholder="Nhập nội dung"
                :invalid="messages.tax"
                size="small"
              />
              <small class="text-red-500">{{ messages.tax }}</small>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <label class="font-medium text-gray-700 w-2/5">Loại tiền tệ</label>
            <div class="w-3/5">
              <Select
                class="w-full"
                v-model="payload.currencyId"
                :options="Currency"
                optionValue="id"
                optionLabel="currencyName"
                placeholder="Nhập nội dung"
                size="small"
              />
            </div>
          </div>
        </div>
        <div class="col-span-6 flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <label class="font-medium w-2/5 text-blue-500">Số dư tài khoản</label>
            <div class="w-3/5">
              <InputText class="w-full" placeholder="Nhập nội dung" size="small" />
            </div>
          </div>
          <div class="flex items-center gap-2">
            <label class="font-medium w-2/5 text-blue-500">Hợp đồng</label>
            <div class="w-3/5">
              <InputText class="w-full" placeholder="Nhập nội dung" size="small" />
            </div>
          </div>
          <div class="flex items-center gap-2">
            <label class="font-medium w-2/5 text-blue-500">Phiếu nhập kho mua hàng</label>
            <div class="w-3/5">
              <InputText class="w-full" placeholder="Nhập nội dung" size="small" />
            </div>
          </div>
          <div class="flex items-center gap-2">
            <label class="font-medium text-blue-500 w-2/5">Đơn hàng mua</label>
            <div class="w-3/5">
              <InputText class="w-full" placeholder="Nhập nội dung" size="small" />
            </div>
          </div>
        </div>
        <div class="col-span-12">
          <Tabs value="0">
            <TabList>
              <Tab value="0">Thông tin chung</Tab>
              <Tab value="1">Người liên hệ</Tab>
              <Tab value="2">Địa chỉ</Tab>
              <Tab value="3">Điều khoản thanh toán</Tab>
              <Tab value="4">Mặt hàng cung ứng</Tab>
              <Tab value="5">Lịch sử chào thầu</Tab>
              <Tab value="6">Hợp đồng</Tab>
              <Tab value="8">Ghi chú</Tab>
              <Tab value="9">Đính kèm</Tab>
            </TabList>
            <TabPanels>
              <TabPanel value="0">
                <Info v-model="payload.supplierInfomationLine"></Info>
              </TabPanel>
              <TabPanel value="1">
                <ContactForm v-model="payload.supplierContactLines"></ContactForm>
              </TabPanel>
              <TabPanel value="2">
                <!-- Address -->
                <Address v-model="payload.supplierAddressLines"></Address>
              </TabPanel>
              <TabPanel value="3">
                <PaymentTerms v-model="payload.supplierPaymentTerm"></PaymentTerms>
              </TabPanel>
              <TabPanel value="4">
                <SupplyItems v-model="payload.supplierItemLines"></SupplyItems>
              </TabPanel>
              <TabPanel value="5">
                <BiddingHistory></BiddingHistory>
              </TabPanel>
              <TabPanel value="6">
                <Contract v-model="payload.Contract"></Contract>
              </TabPanel>
              <TabPanel value="8">
                <div class="grid grid-cols-12 gap-10 p-2">
                  <div class="col-span-12">
                    <Textarea
                      rows="10"
                      cols="100"
                      placeholder="Ghi chú"
                      v-model="payload.notes"
                    ></Textarea>
                  </div>
                </div>
              </TabPanel>
              <TabPanel value="9">
                <div class="grid grid-cols-12 gap-10 p-2">
                  <div class="col-span-12">
                    <UploadDocument v-model="payload.supplierFileLines"></UploadDocument>
                  </div>
                </div>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Đóng"
          icon="pi pi-times"
          severity="secondary"
          size="small"
          @click="SupplierModal = false"
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
  <Loading v-if="loading"></Loading>
</template>
<script setup>
import Loading from "@/components/Loading.vue";
import UploadDocument from "@/components/UploadDocument.vue";
import serviceCurrency from "@/service/serviceCurrency";
import SupplierService from "@/service/SupplierService";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import { useToast } from "primevue/usetoast";
import { getCurrentInstance, ref } from "vue";
import Address from "./Address.vue";
import BiddingHistory from "./BiddingHistory.vue";
import ContactForm from "./ContactForm.vue";
import Contract from "./Contract.vue";
import Info from "./Info.vue";
import PaymentTerms from "./PaymentTerms.vue";
import SupplyItems from "./SupplyItems.vue";

const { proxy } = getCurrentInstance();
const SupplierModal = ref(false);
const loading = ref(false);
const messages = ref({});
const toast = useToast();
const props = defineProps({
  dataTable: Array,
  loadData: {
    type: Function,
    default: () => {},
  },
});
const Currency = ref([]);

const payload = ref({
  type: "Company",
  supplierCode: "",
  supplierOrderCode: "",
  supplierName: "",
  supplierOrtherName: "",
  tax: "",
  currencyId: null,
  notes: "",
  isActive: true,
  supplierInfomationLine: {
    memberType: "",
    phoneNumber1: "",
    phoneNumber2: "",
    cellPhone: "",
    email: "",
    website: "",
    notes: "",
    presentative: "",
  },
  supplierContactLines: [],
  supplierAddressLines: [],
  supplierPaymentTerm: {
    paymentTermId: null,
    supplierPaymentTermLine: [],
  },
  supplierItemLines: [
    {
      itemGroupId: null,
    },
  ],
  supplierFileLines: [],
});
const clearPayload = JSON.stringify(payload.value);
const funClearPayload = () => {
  payload.value = JSON.parse(clearPayload);
};
const openDialog = async (data = null) => {
  loading.value = true;
  if (data.id) {
    payload.value = await getByIdItem(data.id);
  } else {
    funClearPayload();
  }
  await getCurrency();
  messages.value = {};
  SupplierModal.value = true;
  loading.value = false;
};

const getCurrency = async () => {
  try {
    const res = await serviceCurrency.getAll();
    Currency.value = res.data.result;
  } catch (error) {}
};

const saveData = async () => {
  try {
    loading.value = true;
    await SupplierService.save(payload.value);
    proxy.$notify("S", "Thao tác thành công!", toast);
    props.loadData();
    SupplierModal.value = false;
  } catch (error) {
    if (error.isValidate) {
      messages.value = error;
    } else {
      proxy.$notify("E", error?.response?.data?.Message || error, toast);
    }
  } finally {
    loading.value = false;
  }
};

const getByIdItem = async (id) => {
  try {
    const res = await SupplierService.getById(id);
    return res.data;
  } catch (error) {
    return {};
  }
};

defineExpose({
  openDialog,
});
</script>
