<template>
  <Button
    icon="pi pi-list"
    severity="warn"
    size="small"
    @click="visibleRight = true"
  ></Button>
  <Drawer
    v-model:visible="visibleRight"
    header="Thiết lập cột"
    position="right"
    class="!w-full md:!w-80 lg:!w-[25rem]"
  >
    <div class="p-2">
      <DataTable :value="dataColumn">
        <Column header="Tên cột">
          <template #body="{ data }">
            <span>{{ data.header }}</span>
          </template>
        </Column>
        <Column header="Hiển thị">
          <template #body="{ data }">
            <Checkbox v-model="data.display" binary /> </template
        ></Column>
        <Column header="Khóa cột">
          <template #body="{ data }">
            <Checkbox v-model="data.frozen" binary />
          </template>
        </Column>
        <template #footer>
          <div class="flex gap-3 justify-end">
            <!-- <Button
              label="Khôi phục"
              size="small"
              icon="pi pi-save"
              outlined
              @click="saveSetting(idTable, columns)"
            ></Button> -->
            <Button
              label="Xác nhận"
              size="small"
              icon="pi pi-save"
              @click="saveSetting(idTable, dataColumn)"
            ></Button>
          </div>
        </template>
      </DataTable>
    </div>
  </Drawer>
</template>
<script setup>
import { onBeforeMount, ref } from "vue";

const visibleRight = ref(false);
const dataColumn = ref([]);

const props = defineProps({
  columns: {
    type: Array,
    required: true,
  },
  idTable: {
    type: String,
    required: true,
  },
});

onBeforeMount(() => {
  if (!!props.idTable) {
    const localData = getValueStorage(props.idTable);
    const mergedData = mappingData(localData, props.columns);
    saveSetting(props.idTable, mergedData);
  }

  dataColumn.value = getValueStorage(props.idTable);
});

const saveSetting = (key, value) => {
  if (!!key) {
    localStorage.setItem(key, JSON.stringify(value));
    props.columns.forEach((e) => {
      const item = !!value.find((item) => item.field == e.field)
        ? value.find((item) => item.field == e.field)
        : e;
      e.display = item.display;
      e.frozen = item.frozen;
    });
    visibleRight.value = false;
  }
};

const getValueStorage = (key) => {
  if (!!key) {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } else {
    return [];
  }
};

const mappingData = (dataLocal, dataNew) => {
  const newFieldSet = new Set(dataNew.map((item) => item.field));

  const updatedLocal = dataLocal.filter((item) => newFieldSet.has(item.field));

  const existingFieldSet = new Set(updatedLocal.map((item) => item.field));
  const newItems = dataNew.filter((item) => !existingFieldSet.has(item.field));

  return [...updatedLocal, ...newItems];
};
</script>
