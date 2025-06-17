<template>
  <div class="flex flex-col gap-2">
    <div class="font-bold">Địa chỉ xuất hóa đơn</div>
    <div class="grid grid-cols-12 gap-10 p-2">
      <div class="col-span-12">
        <DataTable
          :value="supplierAddressLines.filter((e) => e.addressType === 'Export')"
          showGridlines
          size="small"
        >
          <Column header="#" headerStyle="width:3rem">
            <template #body="{ index }">
              {{ index + 1 }}
            </template>
          </Column>
          <Column header="Tên">
            <template #body="{ data }">
              <InputText class="w-full" v-model="data.addressName"></InputText>
            </template>
          </Column>
          <Column header="Địa chỉ">
            <template #body="{ data }">
              <InputText class="w-full" v-model="data.address"></InputText>
            </template>
          </Column>
          <Column header="Số điện thoại 1">
            <template #body="{ data }">
              <InputText class="w-full" v-model="data.phoneNumber1"></InputText>
            </template>
          </Column>
          <Column header="Số điện thoại (khác)">
            <template #body="{ data }">
              <InputText class="w-full" v-model="data.phoneNumber2"></InputText>
            </template>
          </Column>
          <Column header="Ghi chú">
            <template #body="{ data }">
              <InputText class="w-full" v-model="data.note"></InputText>
            </template>
          </Column>
          <Column header="Hành động" headerStyle="width:7rem" style="text-align: center">
            <template #body="{ data }">
              <Button
                icon="pi pi-trash"
                text
                size="small"
                severity="danger"
                @click="removeItem(data.index)"
              ></Button>
            </template>
          </Column>
          <template #footer>
            <Button
              label="Thêm dòng"
              icon="pi pi-plus"
              size="small"
              outlined
              @click="addLine('Export')"
            ></Button>
          </template>
        </DataTable>
      </div>
    </div>
    <hr />
    <div class="font-bold">Địa chỉ nhận hàng</div>
    <div class="grid grid-cols-12 gap-10 p-2">
      <div class="col-span-12">
        <DataTable
          :value="supplierAddressLines.filter((e) => e.addressType === 'Import')"
          showGridlines
          size="small"
        >
          <Column header="#" headerStyle="width:3rem">
            <template #body="{ index }">
              {{ index + 1 }}
            </template>
          </Column>
          <Column header="Tên">
            <template #body="{ data }">
              <InputText class="w-full" v-model="data.addressName"></InputText>
            </template>
          </Column>
          <Column header="Địa chỉ">
            <template #body="{ data }">
              <InputText class="w-full" v-model="data.address"></InputText>
            </template>
          </Column>
          <Column header="Số điện thoại 1">
            <template #body="{ data }">
              <InputText class="w-full" v-model="data.phoneNumber1"></InputText>
            </template>
          </Column>
          <Column header="Số điện thoại (khác)">
            <template #body="{ data }">
              <InputText class="w-full" v-model="data.phoneNumber2"></InputText>
            </template>
          </Column>
          <Column header="Ghi chú">
            <template #body="{ data }">
              <InputText class="w-full" v-model="data.note"></InputText>
            </template>
          </Column>
          <Column header="Hành động" headerStyle="width:7rem" style="text-align: center">
            <template #body="{ data }">
              <Button
                icon="pi pi-trash"
                text
                size="small"
                severity="danger"
                @click="removeItem(data.index)"
              ></Button>
            </template>
          </Column>
          <template #footer>
            <Button
              label="Thêm dòng"
              icon="pi pi-plus"
              size="small"
              outlined
              @click="addLine('Import')"
            ></Button>
          </template>
        </DataTable>
      </div>
    </div>
  </div>
</template>
<script setup>
const supplierAddressLines = defineModel([]);

const addLine = (type) => {
  supplierAddressLines.value.push({
    index: supplierAddressLines.value.length + 1,
    addressType: type,
    addressName: null,
    address: null,
    phoneNumber1: null,
    phoneNumber2: null,
  });
};
const removeItem = (index) => {
  supplierAddressLines.value = supplierAddressLines.value.filter((e) => e.index != index);
};
</script>
