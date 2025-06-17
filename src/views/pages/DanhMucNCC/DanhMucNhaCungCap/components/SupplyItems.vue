<template>
  <div class="grid grid-cols-12 gap-10 p-2">
    <div class="col-span-12">
      <DataTable :value="supplierItemLines" showGridlines size="small">
        <Column header="#" headerStyle="width:3rem">
          <template #body="{ index }">
            {{ index + 1 }}
          </template>
        </Column>
        <Column header="Mã nhóm hàng hóa">
          <template #body="{ data }">
            <SelectTreeCustome
              v-model="data.itemGroupId"
              placeholder="Chọn nhóm hàng hóa"
              url="ItemGroup"
              optionLabel="itemGroupCode"
              optionValue="id"
              class="w-[10rem]"
              @change="data.itemGroupName = $event.itemGroupName"
            ></SelectTreeCustome>
          </template>
        </Column>
        <Column header="Tên nhóm hàng hóa" field="itemGroupName"></Column>
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
</template>
<script setup>
import SelectTreeCustome from "@/components/SelectTree/SelectTreeCustome.vue";
const supplierItemLines = defineModel();

const addLine = () => {
  supplierItemLines.value.push({
    itemGroupId: null,
  });
};

const removeItem = (index) => {
  supplierItemLines.value.splice(index, 1);
};
</script>
