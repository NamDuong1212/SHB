<template>
  <div class="grid grid-cols-12 gap-10 p-2">
    <div class="col-span-12">
      <DataTable
        :value="supplierContactLines"
        showGridlines
        size="small"
        resizableColumns
        columnResizeMode="fit"
        v-model:selection="selectedProduct"
        scrollable
      >
        <Column headerStyle="width: 3rem">
          <template #body="{ data }">
            <RadioButton
              :value="true"
              @change="changeItem(data)"
              name="isPresentive"
              v-model="data.isPresentive"
            ></RadioButton>
          </template>
        </Column>
        <Column header="#" headerStyle="width:3rem">
          <template #body="{ index }">
            {{ index + 1 }}
          </template>
        </Column>
        <Column header="Họ và tên" style="min-width: 15rem">
          <template #body="{ data }">
            <InputText size="small" class="w-full" v-model="data.fullName"></InputText>
          </template>
        </Column>
        <Column header="Chức vụ" style="min-width: 10rem">
          <template #body="{ data }">
            <InputText size="small" class="w-full" v-model="data.position"></InputText>
          </template>
        </Column>
        <Column header="Địa chỉ" style="min-width: 15rem">
          <template #body="{ data }">
            <InputText size="small" class="w-full" v-model="data.address"></InputText>
          </template>
        </Column>
        <Column header="Số điện thoại" style="min-width: 10rem">
          <template #body="{ data }">
            <InputText
              size="small"
              class="w-full"
              v-model="data.phoneNumber1"
            ></InputText>
          </template>
        </Column>
        <Column header="Số điện thoại (khác)" style="min-width: 10rem">
          <template #body="{ data }">
            <InputText
              size="small"
              class="w-full"
              v-model="data.phoneNumber2"
            ></InputText>
          </template>
        </Column>
        <Column header="Số điện thoại di động" style="min-width: 10rem">
          <template #body="{ data }">
            <InputText size="small" class="w-full" v-model="data.cellphone"></InputText>
          </template>
        </Column>
        <Column header="Email" style="min-width: 10rem">
          <template #body="{ data }">
            <InputText size="small" class="w-full" v-model="data.email"></InputText>
          </template>
        </Column>
        <Column header="Ngày sinh" style="min-width: 10rem">
          <template #body="{ data }">
            <DatePicker
              size="small"
              class="w-full"
              v-model="data.dateOfBirth"
            ></DatePicker>
          </template>
        </Column>
        <Column header="Giới tính" style="min-width: 5rem">
          <template #body="{ data }">
            <Select
              size="small"
              class="w-full"
              :options="['Male', 'Female']"
              v-model="data.gender"
            ></Select>
          </template>
        </Column>
        <Column header="Số CCCD/Hộ chiếu" style="min-width: 10rem">
          <template #body="{ data }">
            <InputText
              size="small"
              class="w-full"
              v-model="data.identityCardNumber"
            ></InputText>
          </template>
        </Column>
        <Column header="Ngày cấp" style="min-width: 10rem">
          <template #body="{ data }">
            <DatePicker
              size="small"
              class="w-full"
              v-model="data.dateOfIssue"
            ></DatePicker>
          </template>
        </Column>
        <Column header="Nơi cấp" style="min-width: 10rem">
          <template #body="{ data }">
            <InputText
              size="small"
              class="w-full"
              v-model="data.placeOfIssue"
            ></InputText>
          </template>
        </Column>
        <Column
          header="Hành động"
          headerStyle="width:7rem"
          style="text-align: center"
          alignFrozen="right"
          frozen
        >
          <template #body="{ data, index }">
            <Button
              icon="pi pi-trash"
              text
              size="small"
              severity="danger"
              @click="removeContact(index)"
            ></Button>
          </template>
        </Column>
        <template #footer>
          <Button
            label="Thêm dòng"
            icon="pi pi-plus"
            size="small"
            outlined
            @click="addLineContact"
          ></Button>
        </template>
      </DataTable>
    </div>
  </div>
</template>
<script setup>
const supplierContactLines = defineModel([]);
const addLineContact = () => {
  supplierContactLines.value.push({
    fullName: null,
    position: null,
    address: null,
    phoneNumber1: null,
    phoneNumber2: null,
    cellphone: null,
    email: null,
    dateOfBirth: null,
    gender: "Male",
    identityCardNumber: null,
    dateOfIssue: null,
    placeOfIssue: null,
    isPresentive: false,
  });
};

const removeContact = (index) => {
  supplierContactLines.value.splice(index, 1);
};

const changeItem = (e) => {
  supplierContactLines.value.forEach((item) => {
    item.isPresentive = false;
  });
  e.isPresentive = true;
};
</script>
