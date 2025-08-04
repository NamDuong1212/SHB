<script setup>
import http from "@/service/http";
import debounce from "lodash/debounce";
import { onBeforeMount, ref } from "vue";

const loading = ref(false);
const treeData = ref([]);
const filters1 = ref(null);

const paginator = ref({
  page: 1,
  page_size: 20,
  total: 1000000,
  orderBy: { field: "id", asc: true },
});

const emits = defineEmits(["resetFilter"]);

const props = defineProps({
  header: String,
  columns: Array,
  apiEndpoint: String,
});

onBeforeMount(() => {
  filters1.value = { ...props.filters };
  getAllData(paginator.value);
});

const getAllData = async (params = {}) => {
  if (!props.apiEndpoint) return;
  try {
    loading.value = true;
    const response = await http.get(props.apiEndpoint, { params });
    treeData.value = response.data; // dạng tree structure
  } catch (e) {
  } finally {
    loading.value = false;
  }
};

const searchGlobal = debounce(() => {
  getAllData();
}, 500);

const refresh = () => {
  getAllData(query);
};

defineExpose({ refresh });
</script>

<template>
  <div class="header mb-3 flex justify-between">
    <div class="font-semibold text-xl">{{ header }}</div>
  </div>

  <TreeTable :value="treeData">
    <template #header>
      <div class="flex justify-between p-2">
        <div class="flex gap-4">
          <IconField>
            <InputIcon><i class="pi pi-search" /></InputIcon>
            <InputText
              placeholder="Tìm kiếm"
              @input="searchGlobal"
              class="w-[30rem]"
              size="small"
            />
          </IconField>
        </div>
        <div class="flex gap-3">
          <slot name="header"></slot>
          <customColumns :columns="columns" idTable="doctree"></customColumns>
        </div>
      </div>
    </template>
    <Column
      v-for="(col, index) of props.columns.filter((c) => c.display)"
      :field="col.field"
      :header="col.header"
      :expander="!index ? true : false"
    >
      <template #body="{ node }">
        <component :is="col.renderValue(node)" />
      </template>
    </Column>
    <template #empty> Không có bản ghi nào. </template>
    <template #loading> Đang tải dữ liệu... </template>
  </TreeTable>
</template>
