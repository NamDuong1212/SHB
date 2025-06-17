<template>
  <div class="grid grid-cols-12 gap-10 p-2">
    <div class="col-span-6 flex flex-col gap-3">
      <div class="flex items-center gap-2">
        <label class="font-medium text-gray-700 w-2/5">Loại đối tượng</label>
        <div class="w-3/5">
          <Select
            class="w-full"
            placeholder="Nhập nội dung"
            size="small"
            optionLabel="name"
            optionValue="code"
            v-model="supplierInfomationLine.memberType"
            :options="[
              { code: 'Domestic', name: 'Nội địa' },
              { code: 'Foreign', name: 'Nước ngoài' },
            ]"
          />
        </div>
      </div>
      <div class="flex items-center gap-2">
        <label class="font-medium text-gray-700 w-2/5">Số điện thoại 1 </label>
        <div class="w-3/5">
          <InputText
            class="w-full"
            placeholder="Nhập nội dung"
            size="small"
            v-model="supplierInfomationLine.phoneNumber1"
          />
        </div>
      </div>
      <div class="flex items-center gap-2">
        <label class="font-medium w-2/5 text-gray-700">Số điện thoại 2</label>
        <div class="w-3/5">
          <InputText
            class="w-full"
            placeholder="Nhập nội dung"
            size="small"
            v-model="supplierInfomationLine.phoneNumber2"
          />
        </div>
      </div>
      <div class="flex items-center gap-2">
        <label class="font-medium w-2/5 text-gray-700">Điện thoại di động</label>
        <div class="w-3/5">
          <InputText
            class="w-full"
            placeholder="Nhập nội dung"
            size="small"
            v-model="supplierInfomationLine.cellPhone"
          />
        </div>
      </div>
      <div class="flex items-center gap-2">
        <label class="font-medium text-gray-700 w-2/5">Email</label>
        <div class="w-3/5">
          <InputText
            class="w-full"
            placeholder="Nhập nội dung"
            size="small"
            v-model="supplierInfomationLine.email"
          />
        </div>
      </div>
      <div class="flex items-center gap-2">
        <label class="font-medium text-gray-700 w-2/5">Website</label>
        <div class="w-3/5">
          <InputText
            class="w-full"
            placeholder="Nhập nội dung"
            size="small"
            v-model="supplierInfomationLine.website"
          />
        </div>
      </div>
      <!-- <div class="flex items-center gap-2">
        <label class="font-medium text-gray-700 w-2/5">Người đại diện</label>
        <div class="w-3/5">
          <InputText
            class="w-full"
            placeholder="Nhập nội dung"
            size="small"
            v-model="supplierInfomationLine.presentative"
          />
        </div>
      </div> -->
    </div>
  </div>
</template>
<script setup>
const supplierInfomationLine = defineModel();
</script>
