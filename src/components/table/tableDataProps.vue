<script setup>
import buildGridifyQueryFromPrimeVueFilters from "@/composables/buildGridifyQueryFromPrimeVueFilters";
import http from "@/service/http";
import debounce from "lodash/debounce";
import { onBeforeMount, ref, watchEffect } from "vue";

const filters1 = ref(null);
const loading = ref(false);

const paginator = ref({
  page: 1,
  pageSize: 20,
  total: 0,
  orderBy: { field: "id", asc: true },
});

const modelSelect = defineModel("selection");
const modelExpandedRows = defineModel("expandedRows", {
  default: {},
});

const emits = defineEmits(["resetFilter"]);

const props = defineProps({
  header: String,
  columns: Array,
  filters: Object,
  globalFilterFields: Array,
  dataTable: Array,
  isExpanded: Boolean,
});

onBeforeMount(() => {
  filters1.value = { ...props.filters };
});

const changePaginator = (event) => {
  paginator.value.pageSize = event.rows;
  paginator.value.page = event.page + 1;
  const query = renderFilter(paginator.value, event.filters);
};

const changeFilter = (event) => {
  const query = renderFilter(paginator.value, event.filters);
};

const renderFilter = (paginator, filters) => {
  const query = buildGridifyQueryFromPrimeVueFilters(filters, {
    page: paginator.page,
    pageSize: paginator.pageSize,
    orderBy: paginator.orderBy,
  });
  return query;
};

const searchGlobal = debounce(() => {
  const query = renderFilter(paginator.value, filters1.value);
  query.Search = filters1?.value?.Search?.value;
}, 500);

const clearFilter = () => {
  emits("resetFilter");
  searchGlobal();
};

const refresh = () => {
  // Reset data and selections
  modelSelect.value = [];
  modelExpandedRows.value = {};

  // Reset pagination to first page
  paginator.value.page = 1;

  // Rebuild query and fetch data
  const query = renderFilter(paginator.value, filters1.value);
  query.Search = filters1?.value?.Search?.value;
};

const onRowClick = (e) => {
  if (!props.isExpanded) return;
  const id = e.data.id;
  const current = modelExpandedRows.value || {};
  modelExpandedRows.value = current[id] ? {} : { [id]: true };
};

watchEffect(() => {
  filters1.value = { ...props.filters };
});

defineExpose({
  refresh,
});
</script>

<template>
  <div class="header mb-3 flex justify-between">
    <div class="font-semibold text-xl">{{ header }}</div>
  </div>
  <DataTable
    :value="dataTable"
    @filter="changeFilter"
    @rowClick="onRowClick"
    size="small"
    dataKey="id"
    :rowHover="true"
    v-model:filters="filters1"
    :loading="loading"
    :filters="props.filters"
    showGridlines
    scrollable
    scrollHeight="400px"
    filterDisplay="menu"
    resizableColumns
    columnResizeMode="fit"
    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
    currentPageReportTemplate="{first} đến {last} của {totalRecords} bản ghi"
    :rowsPerPageOptions="[20, 30, 50]"
    lazy
    v-model:selection="modelSelect"
    v-model:expandedRows="modelExpandedRows"
  >
    <template #header>
      <div class="flex justify-end p-2">
        <div class="flex gap-3">
          <slot name="header"></slot>
          <customColumns :columns="columns" idTable="doctest"></customColumns>
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
    <Column
      v-for="col in props.columns.filter((e) => e.display)"
      :key="col.field"
      :field="col.field"
      :header="col.header"
      :showFilterMenu="true"
      :sortable="col.sortable"
      :frozen="col.frozen"
      alignFrozen="left"
      :style="col.style"
      :filterField="col.field"
      :dataType="col?.dataType"
      :showFilterMatchModes="col?.showFilterMatchModes"
    >
      <template #filterclear="{ filterCallback }">
        <Button
          type="button"
          icon="pi pi-times"
          @click="filterCallback()"
          severity="secondary"
        ></Button>
      </template>
      <template #filterapply="{ filterCallback }">
        <Button
          type="button"
          icon="pi pi-save"
          @click="filterCallback()"
          severity="success"
        ></Button>
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
