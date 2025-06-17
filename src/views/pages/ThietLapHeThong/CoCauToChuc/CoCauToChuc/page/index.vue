<script setup>
import DeleteComps from "@/components/DeleteComps.vue";
import OrganizationalStructureService from "@/service/OrganizationalStructureService";
import { FilterMatchMode, FilterOperator } from "@primevue/core/api";
import Button from "primevue/button";
import Card from "primevue/card";
import Tag from "primevue/tag";
import { h, onBeforeMount, ref } from "vue";
import FormData from "../components/FormData.vue";

const filters = ref(null);
const dialogRef = ref();
const dataSelection = ref([]);
const modelDialogDelete = ref(false);
const TableBasic = ref();
const OrgStruc = ref([]);
const selectedKey = ref({ 1: true });
const expandedKeys = ref({ 1: true });
const DetailOrgStruc = ref([]);
const isLoading = ref(false);
const selectedNode = ref(null);
const columns = ref([
  {
    field: "orgStrCode",
    header: "Mã đơn vị",
    display: true,
    renderValue: (rowData) =>
      h(
        "button",
        {
          class: "text-blue-600 font-semibold cursor-pointer hover:underline",
          onClick: () => openAddDialog(rowData),
        },
        rowData?.orgStrCode ?? "-"
      ),
  },
  {
    field: "orgStrName",
    header: "Tên đơn vị",
    display: true,
    renderValue: (rowData) => h("span", {}, rowData.orgStrName || "-"),
  },
  {
    field: "organizationalLevel",
    header: "Cấp tổ chức",
    display: true,
    renderValue: (rowData) =>
      h("span", {}, rowData.organizationalLevel?.organizationLevelName || "-"),
  },
  {
    field: "parent",
    header: "Đơn vị cấp trên",
    display: true,
    showFilterMatchModes: false,
    renderValue: (rowData) => h("span", {}, rowData?.parent?.orgStrName || "-"),
  },

  {
    field: "isActive",
    header: "Trạng thái",
    display: true,
    showFilterMatchModes: false,
    renderValue: (rowData) => {
      const severityMap = {
        true: "success",
        false: "danger",
      };
      return h(Tag, {
        value: rowData.isActive === true ? "Đang hoạt động" : "Ngừng hoạt động",
        severity: severityMap[rowData.isActive] || null,
      });
    },
  },
]);

onBeforeMount(() => {
  fetchAllOrgStruc();
  initFilters();
});

const initFilters = () => {
  filters.value = {
    Search: { value: null, matchMode: FilterMatchMode.CONTAINS },

    preventiveMaintenanceCode: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },

    "asset.assetName": {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },

    "serial.assetSerial": {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },

    fromDate: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },

    status: { value: null, matchMode: FilterMatchMode.EQUALS },
  };
};

const openAddDialog = (data) => {
  dialogRef.value?.openDialog(data);
};

const delteItems = () => {
  modelDialogDelete.value = true;
};

const refreshData = () => {
  TableBasic.value?.refresh();
};

const fetchAllOrgStruc = async () => {
  isLoading.value = true;

  try {
    const res = await OrganizationalStructureService.getAll();
    OrgStruc.value = ConvertData(res.data);
    DetailOrgStruc.value = OrgStruc.value[0].children ?? [];
    selectedNode.value = OrgStruc.value[0];
  } catch (error) {
  } finally {
    isLoading.value = false;
  }
};

const ConvertData = (data) => {
  if (data?.length) {
    return data.map((el) => ({
      ...el,
      key: `${el.id}`,
      label: `${el.orgStrName}`,
      data: el,
      children: el.children?.length ? ConvertData(el.children) : [],
    }));
  }
  return [];
};

const detailItem = (data) => {
  selectedNode.value = data;
  if (!!data.children?.length) {
    DetailOrgStruc.value = data.children;
  } else {
    DetailOrgStruc.value = [];
  }
};
</script>

<template>
  <div class="grid grid-cols-12 gap-4">
    <div class="col-span-12">
      <Card>
        <template #title>
          <div class="flex justify-between items-center">
            <div class="font-semibold text-xl">Danh mục cơ cấu tổ chức</div>
            <div>
              <Button
                icon="pi pi-refresh"
                class="p-button-rounded p-button-text"
                @click="fetchAllOrgStruc"
              />
            </div>
          </div>
        </template>

        <template #content>
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-4 md:col-span-3">
              <Card class="h-full shadow-sm">
                <template #content>
                  <div class="tree-container max-h-[80vh] overflow-y-auto pr-2">
                    <Tree
                      :filter="true"
                      filterPlaceholder="Tìm kiếm danh mục..."
                      filterMode="lenient"
                      v-model:selectionKeys="selectedKey"
                      v-model:expanded-keys="expandedKeys"
                      :value="OrgStruc"
                      selectionMode="single"
                      class="w-full border border-gray-200 rounded-lg shadow-sm bg-white"
                    >
                      <template #default="slotProps">
                        <span
                          class="flex items-center gap-2 px-2 py-1 rounded-md transition-all duration-150 cursor-pointer font-medium text-gray-700 hover:text-primary hover:bg-gray-100"
                          @click="detailItem(slotProps.node)"
                          :title="slotProps.node.label"
                          v-tooltip="{
                            value: slotProps.node.label,
                            showDelay: 100,
                            hideDelay: 300,
                          }"
                        >
                          <span class="line-clamp-1">{{ slotProps.node.label }}</span>
                        </span>
                      </template>
                    </Tree>
                  </div>
                </template>
              </Card>
            </div>
            <div class="col-span-8 md:col-span-9">
              <div class="flex flex-col mb-4">
                <div
                  class="bg-white p-4 rounded-lg shadow-sm mb-4 border border-gray-100"
                >
                  <div class="mb-3 border-b pb-2 border-gray-100">
                    <h3 class="text-lg font-semibold text-primary">Thông tin đơn vị</h3>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div class="flex items-center">
                      <div class="w-32 flex-shrink-0">
                        <span class="text-gray-600 font-medium">Mã đơn vị:</span>
                      </div>
                      <div class="flex-grow">
                        <span class="font-semibold text-gray-800">{{
                          selectedNode?.orgStrCode ?? "--"
                        }}</span>
                      </div>
                    </div>
                    <div class="flex items-center">
                      <div class="w-32 flex-shrink-0">
                        <span class="text-gray-600 font-medium">Cấp tổ chức:</span>
                      </div>
                      <div class="flex-grow">
                        <span class="font-semibold text-gray-800">{{
                          selectedNode?.organizationalLevel?.organizationLevelName ?? "--"
                        }}</span>
                      </div>
                    </div>
                    <div class="flex items-center">
                      <div class="w-32 flex-shrink-0">
                        <span class="text-gray-600 font-medium">Tên đơn vị:</span>
                      </div>
                      <div class="flex-grow flex items-center gap-2">
                        <span class="font-semibold text-gray-800">{{
                          selectedNode?.orgStrName ?? "--"
                        }}</span>
                        <Button
                          @click="openAddDialog(selectedNode ?? null)"
                          icon="pi pi-pencil"
                          text
                          rounded
                          severity="primary"
                          size="small"
                          v-tooltip.top="'Chỉnh sửa đơn vị'"
                          :disabled="!selectedNode"
                        ></Button>
                      </div>
                    </div>
                    <div class="flex items-center">
                      <div class="w-32 flex-shrink-0">
                        <span class="text-gray-600 font-medium">Trạng thái:</span>
                      </div>
                      <div class="flex-grow">
                        <Tag
                          v-if="selectedNode"
                          :value="
                            selectedNode.isActive === true
                              ? 'Đang hoạt động'
                              : 'Ngừng hoạt động'
                          "
                          :severity="
                            selectedNode.isActive === true ? 'success' : 'danger'
                          "
                        />
                        <span v-else class="font-semibold text-gray-800">--</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Card class="h-auto shadow-sm">
                  <template #content>
                    <table-data-props
                      header="Chi tiết đơn vị"
                      v-model:selection="dataSelection"
                      :dataTable="DetailOrgStruc"
                      :columns="columns"
                      :filters="filters"
                      @resetFilter="initFilters"
                    >
                      <template #header>
                        <div class="flex gap-2">
                          <Button
                            :disabled="!dataSelection.length"
                            @click="delteItems()"
                            label="Xóa"
                            icon="pi pi-trash"
                            severity="danger"
                            size="small"
                          ></Button>
                          <Button
                            @click="openAddDialog"
                            type="button"
                            icon="pi pi-plus"
                            severity="primary"
                            label="Thêm mới"
                            size="small"
                          />
                        </div>
                      </template>
                    </table-data-props>
                  </template>
                </Card>
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
  <FormData ref="dialogRef" @load-data="fetchAllOrgStruc"></FormData>
  <DeleteComps
    v-model:isOpenDelete="modelDialogDelete"
    :ids="dataSelection.flatMap((e) => e.id)"
    :content="`Bạn có chắc chắn muốn xóa ${dataSelection.length} bản ghi ?`"
    api="OrganizationalStructure"
    :loadData="refreshData"
  ></DeleteComps>
  <Loading v-if="isLoading"></Loading>
</template>

<style scoped>
.tree-container :deep(.p-tree) {
  border: none;
  padding: 0;
}

.tree-container :deep(.p-treenode-content) {
  border-radius: 6px;
  transition: background-color 0.2s, box-shadow 0.2s;
}

.tree-container :deep(.p-treenode-content:hover) {
  background-color: #f8f9fa;
}

.tree-container :deep(.p-highlight) {
  background-color: #e7f2ff !important;
}

.tree-container :deep(.p-treenode-icon) {
  color: #4f46e5;
}

.p-card :deep(.p-card-body) {
  padding: 1rem;
}

.p-card :deep(.p-card-content) {
  padding: 0;
}
</style>
