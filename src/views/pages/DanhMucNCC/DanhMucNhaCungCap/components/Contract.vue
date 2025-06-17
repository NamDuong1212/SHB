<template>
  <div class="grid grid-cols-12 gap-10 p-2">
    <div class="col-span-12">
      <DataTable :value="[]" showGridlines size="small">
        <Column header="#" headerStyle="width:3rem">
          <template #body="{ index }">
            {{ index + 1 }}
          </template>
        </Column>
        <Column header="Mã hợp đồng"> </Column>
        <Column header="Tên hợp đồng"> </Column>
        <Column header="Ngày bắt đầu"> </Column>
        <Column header="Ngày kết thúc"> </Column>
        <Column header="Giá trị hợp đồng"> </Column>
        <Column header="Sản lượng cam kết"> </Column>
        <Column header="Tệp đính kèm"> </Column>
        <Column header="Trạng thái"> </Column>
        <Column header="Hành động" headerStyle="width:7rem" style="text-align: center">
          <template #body="{ data }">
            <Button icon="pi pi-trash" text size="small" severity="danger"></Button>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>
<script setup></script>
