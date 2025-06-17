<template>
  <div class="grid grid-cols-12 gap-10 p-2">
    <div class="col-span-12">
      <div class="flex gap-3 items-center mb-5">
        <span class="font-bold">Điều khoản thanh toán</span>
        <Select
          placeholder="Chọn điều khoản thanh toán"
          :options="PaymentTerm"
          v-model="supplierPaymentTerm.paymentTermId"
          optionLabel="paymentTermName"
          optionValue="id"
        >
          <template #footer>
            <div class="p-3">
              <Button
                label="Thêm mới"
                size="small"
                icon="pi pi-plus "
                @click="visible = true"
              ></Button>
            </div>
          </template>
        </Select>
      </div>
      <DataTable
        :value="supplierPaymentTerm?.supplierPaymentTermLine || []"
        showGridlines
        size="small"
      >
        <Column header="#" headerStyle="width:3rem">
          <template #body="{ index }">
            {{ index + 1 }}
          </template>
        </Column>
        <Column header="Tên chủ tài khoản">
          <template #body="{ data }">
            <InputText class="w-full" v-model="data.accountHolderName"></InputText>
          </template>
        </Column>
        <Column header="Số tài khoản">
          <template #body="{ data }">
            <InputText class="w-full" v-model="data.accountNumber"></InputText>
          </template>
        </Column>
        <Column header="Tên ngân hàng">
          <template #body="{ data }">
            <InputText class="w-full" v-model="data.accountName"></InputText>
          </template>
        </Column>
        <Column header="Chi nhánh">
          <template #body="{ data }">
            <InputText class="w-full" v-model="data.branchName"></InputText>
          </template>
        </Column>
        <Column header="Tỉnh/Thành phố của ngân hàng">
          <template #body="{ data }">
            <InputText class="w-full" v-model="data.addressBranch"></InputText>
          </template>
        </Column>
        <Column header="Hành động" headerStyle="width:7rem" style="text-align: center">
          <template #body="{ index }">
            <Button
              icon="pi pi-trash"
              text
              size="small"
              severity="danger"
              @click="removeItem(index)"
            ></Button>
          </template>
        </Column>

        <template #footer>
          <Button
            label="Thêm dòng"
            icon="pi pi-plus"
            size="small"
            outlined
            @click="addLine"
          ></Button>
        </template>
      </DataTable>
    </div>
  </div>
  <Dialog
    v-model:visible="visible"
    modal
    header="Thiết lập điều khoản thanh toán"
    :style="{ width: '60rem' }"
  >
    <div class="grid grid-cols-12 gap-5">
      <div class="col-span-12">
        <div class="flex justify-between items-center">
          <span class="font-bold">Tên điều khoản thanh toán</span>
          <InputText
            class="w-3/5"
            v-model="payload.paymentTermName"
            :invalid="!!messages.paymentTermName"
          ></InputText>
        </div>
        <small v-if="!!messages.paymentTermName" class="text-red-500">{{
          messages.paymentTermName
        }}</small>
      </div>
      <div class="col-span-12">
        <div class="flex justify-between items-center">
          <span class="font-bold">Ngày thanh toán dựa trên</span>
          <Select
            class="w-3/5"
            :options="[
              { code: 'DocDate', name: 'Ngày chứng từ' },
              { code: 'DeliveryDate', name: 'Ngày giao  hàng' },
            ]"
            v-model="payload.paymentBase"
            optionLabel="name"
            optionValue="code"
          ></Select>
        </div>
      </div>
      <div class="col-span-12">
        <div class="flex justify-between items-center">
          <span class="font-bold">Bắt đầu từ</span>
          <div class="w-3/5 flex gap-3">
            <Select
              class="w-3/5"
              v-model="payload.startBase"
              :options="[
                { code: 'StartMonth', name: 'Tháng bắt đầu' },
                { code: 'HalfMonth', name: 'Nửa tháng' },
                { code: 'EndMonth', name: 'Tháng kết thúc' },
              ]"
              optionLabel="name"
              optionValue="code"
            ></Select>
            <div class="flex gap-2 items-center w-1/5">
              <span>+</span>
              <InputNumber class="w-full" v-model="payload.addMonths"></InputNumber>
              <span>Tháng</span>
            </div>
            <div class="flex gap-2 items-center w-1/5">
              <span>+</span>
              <InputNumber class="w-full" v-model="payload.addDays"></InputNumber>
              <span>Ngày</span>
            </div>
          </div>
        </div>
      </div>
      <div class="col-span-12">
        <div class="flex justify-between items-center">
          <span class="font-bold">Số ngày chênh lệch</span>
          <InputNumber class="w-3/5" v-model="payload.diffDays"></InputNumber>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          size="small"
          label="Đóng"
          icon="pi pi-times"
          severity="secondary"
          @click="visible = false"
        ></Button>
        <Button
          type="button"
          size="small"
          label="Lưu"
          icon="pi pi-save"
          @click="saveData"
        ></Button></div
    ></template>
  </Dialog>
</template>
<script setup>
import PaymentTermService from "@/service/PaymentTermService";
import { useToast } from "primevue";
import { getCurrentInstance, onBeforeMount, ref } from "vue";

const { proxy } = getCurrentInstance();
const toast = useToast();
const messages = ref({});
const supplierPaymentTerm = defineModel();
const PaymentTerm = ref([]);
const payload = ref({
  paymentTermName: null,
  paymentBase: "DocDate",
  startBase: "HalfMonth",
  addMonths: 0,
  addDays: 0,
});
const visible = ref(false);

onBeforeMount(() => {
  getAllPay();
});

const saveData = async () => {
  try {
    await PaymentTermService.save(payload.value);
    proxy.$notify("S", "Thao tác thanh công", toast);
    visible.value = false;
  } catch (error) {
    if (error.isValidate) {
      messages.value = error;
    } else {
      proxy.$notify("S", error?.response?.data?.Message || error, toast);
    }
  }
};

const getAllPay = async () => {
  try {
    const res = await PaymentTermService.getAll();
    PaymentTerm.value = res.data.result;
  } catch (error) {}
};

const removeItem = (index) => {
  supplierPaymentTerm.value.supplierPaymentTermLine.splice(index, 1);
};

const addLine = () => {
  if (!supplierPaymentTerm.value?.supplierPaymentTermLine) {
    supplierPaymentTerm.value.supplierPaymentTermLine = [];
  }
  supplierPaymentTerm.value.supplierPaymentTermLine.push({
    accountHolderName: "",
    accountNumber: "",
    accountName: "",
    branchName: "",
    addressBranch: "",
  });
};
</script>
<style scoped>
:deep(.p-inputnumber-input) {
  width: 100%;
}
</style>
