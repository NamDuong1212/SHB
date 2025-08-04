<script setup>
import buildGridifyQueryFromPrimeVueFilters from "@/composables/buildGridifyQueryFromPrimeVueFilters";
import http from "@/service/http";
import debounce from "lodash/debounce";
import { onBeforeMount, ref, watchEffect } from "vue";
import { useToast } from "primevue";
const toast = useToast();
const filters1 = ref(null);
const loading = ref(false);
const dataTable = ref([]);

const paginator = ref({
  page: 1,
  page_size: 10,
  total: 0,
  orderBy: { field: "id", asc: true },
});

const modelSelect = defineModel("selection");
const modelExpandedRows = defineModel("expandedRows", {
  default: {},
});

const emits = defineEmits(["resetFilter"]);

const props = defineProps({
  apiFunction: Function,
  header: String,
  columns: Array,
  filters: Object,
  globalFilterFields: Array,
  isExpanded: Boolean,
});

onBeforeMount(() => {
  filters1.value = { ...props.filters };

  const initialQuery = renderFilter(paginator.value, filters1.value);
  getAllData(initialQuery);
});

const getAllData = async (params = {}) => {
  if (!props.apiFunction) return;
  try {
    loading.value = true;

    const result = await props.apiFunction(params);

    dataTable.value = result.data || [];

    paginator.value.total = result.total || 0;

  } catch (error) {
    dataTable.value = [];
    paginator.value.total = 0;
    toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải dữ liệu', life: 3000 });
  } finally {
    loading.value = false;
  }
};

const changePaginator = (event) => {
  paginator.value.page_size = event.rows;
  paginator.value.page = event.page + 1;
  const query = renderFilter(paginator.value, filters1.value);
  getAllData(query);
};

const changeFilter = (event) => {
  const query = renderFilter(paginator.value, event.filters);
  getAllData(query);
};

const renderFilter = (paginator, filters) => {
  const query = buildGridifyQueryFromPrimeVueFilters(filters, {
    page: paginator.page,
    page_size: paginator.page_size,
    orderBy: paginator.orderBy,
  });
  return query;
};

const searchGlobal = debounce(() => {
  const query = renderFilter(paginator.value, filters1.value);
  query.Search = filters1?.value?.Search?.value;
  getAllData(query);
}, 500);

const clearFilter = () => {
  emits("resetFilter");
  searchGlobal();
};

const refresh = () => {
  // Reset data and selections
  modelSelect.value = [];
  modelExpandedRows.value = {};

  paginator.value.page = 1;

  const query = renderFilter(paginator.value, filters1.value);
  query.Search = filters1?.value?.Search?.value;
  getAllData(query);
};

const onRowClick = async (e) => {
  if (!props.isExpanded) return;
  const id = e.data.id;
  const current = modelExpandedRows.value || {};
  modelExpandedRows.value = current[id] ? {} : { [id]: true };
  const index = dataTable.value.findIndex((e) => e.id == id);
  dataTable.value[index] = await getById(id);
};

const getById = async (id) => {
  try {
    const res = await http.get(`${props.apiEndpoint}/${id}`);
    return res.data;
  } catch (error) {
    return {};
  }
};

watchEffect(() => {
  filters1.value = { ...props.filters };
});

defineExpose({
  refresh,
});
</script>

<template>
  <Toast />
  <div class="header mb-3 flex justify-between">
    <div class="font-semibold text-xl">{{ header }}</div>
  </div>
  <DataTable :value="dataTable" :paginator="true" :rows="paginator.page_size" :page="paginator.page"
    :totalRecords="paginator.total" @page="changePaginator" @filter="changeFilter" @rowClick="onRowClick" dataKey="id"
    :rowHover="true" v-model:filters="filters1" :loading="loading" :filters="props.filters" scrollable
    filterDisplay="menu" resizableColumns columnResizeMode="fit"
    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
    currentPageReportTemplate="{first} đến {last} của {totalRecords} bản ghi" :rowsPerPageOptions="[10, 20, 30, 50]" lazy
    v-model:selection="modelSelect" v-model:expandedRows="modelExpandedRows">
    <template #header>
      <div class="flex justify-between p-3">
        <div class="flex gap-4">
          <IconField>
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText class="w-[30rem]" v-model="filters1['Search'].value" @input="searchGlobal" placeholder="Tìm kiếm"
              size="small" />
          </IconField>
          <Button type="button" icon="pi pi-filter-slash" severity="danger" label="Xóa bộ lọc" size="small" outlined
            @click="clearFilter()" />
        </div>
        <div class="flex gap-3">
          <slot name="header"></slot>
          <customColumns :columns="columns" :idTable="props.apiEndpoint || 'IDTEST'"></customColumns>
        </div>
      </div>
    </template>
    <template #empty>
      <div class="text-center">Không có bản ghi nào.</div>
    </template>
    <template #loading> Đang lấy dữ liệu. </template>
    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
    <Column header="#" class="w-[3rem]">
      <template #body="{ index }">
        <span class="text-center">{{ index + 1 }}</span>
      </template>
    </Column>
    <Column v-for="col in props.columns.filter((e) => e.display)" :key="col.field" :field="col.field"
      :header="col.header" :showFilterMenu="true" :sortable="col.sortable" :frozen="col.frozen" alignFrozen="left"
      :style="col.style" :filterField="col.field" :dataType="col?.dataType"
      :showFilterMatchModes="col?.showFilterMatchModes">
      <template #filter="slotProps" v-if="col?.renderFilter">
        <component :is="col?.renderFilter(slotProps)" />
      </template>
      <template #filterclear="{ filterCallback }">
        <Button type="button" icon="pi pi-times" @click="filterCallback()" severity="secondary"></Button>
      </template>
      <template #filterapply="{ filterCallback }">
        <Button type="button" icon="pi pi-save" @click="filterCallback()" severity="success"></Button>
      </template>
      <template #body="{ data }">
        <component :is="col?.renderValue(data)" />
      </template>
    </Column>
    <template #expansion="slotProps">
      <slot name="expansion" v-bind="slotProps" />
    </template>
  </DataTable>
</template>
