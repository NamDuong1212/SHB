<script setup>
import FactorySerivce from "@/service/FactoryService";
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
const expandedRows = ref(null);
const modelDialogDelete = ref(false);
const TableBasic = ref();
const OrgStruc = ref([]);
const selectedKey = ref(null);
const searchTerm = ref("");
const FactoryDetail = ref([]);
const isLoading = ref(false);
const selectedNode = ref(null);
const columns = ref([
  {
    field: "factoryCode",
    header: "Mã nhà xưởng",
    display: true,
    renderValue: (rowData) =>
      h(
        "button",
        {
          class: "text-blue-600 font-semibold cursor-pointer hover:underline",
          onClick: () => openAddDialog(rowData),
        },
        rowData.factoryCode
      ),
  },
  {
    field: "factoryName",
    header: "Tên nhà xưởng",
    display: true,
    renderValue: (rowData) => h("span", {}, rowData.factoryName || "-"),
  },
  {
    field: "groupFactory.groupFactoryName",
    header: "Phân nhóm",
    display: true,
    renderValue: (rowData) => h("span", {}, rowData.groupFactory.groupFactoryName || "-"),
  },
  {
    field: "organizationalStructure.orgStrtName",
    header: "Đơn vị quản lý",
    display: true,
    showFilterMatchModes: false,
    renderValue: (rowData) =>
      h("span", {}, rowData.organizationalStructure.orgStrtName || "-"),
  },

  {
    field: "isActive",
    header: "Trạng thái",
    display: true,
    showFilterMatchModes: false,
    renderValue: (rowData) => {
      const severityMap = {
        true: "primary",
        false: "danger",
      };
      return h(Tag, {
        value: rowData.isActive ? "Đang hoạt động" : "Ngừng hoạt động",
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
  } catch (error) {
  } finally {
    isLoading.value = false;
  }
};
const fetchFactoryByOrg = async (id) => {
  isLoading.value = true;
  try {
    const res = await FactorySerivce.getByOrgStruct(id);

    FactoryDetail.value = res.data;
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
      label: `${el.orgStrtName}`,
      data: "Documents Folder",
      icon: "pi pi-fw pi-building",
      children: el.children?.length ? ConvertData(el.children) : undefined,
    }));
  }
  return [];
};

const onNodeSelect = (node) => {
  selectedNode.value = node;
  fetchFactoryByOrg(node.id);
};

const onNodeUnselect = (node) => {};

const onNodeExpand = (node) => {};

const onNodeCollapse = (node) => {};
</script>

<template>
  <div class="grid grid-cols-12 gap-4">
    <div class="col-span-12">
      <Card>
        <template #title>
          <div class="flex justify-between items-center">
            <div class="font-bold text-2xl">Danh mục nhà xưởng</div>
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
            <div class="col-span-3 md:col-span-2">
              <Card class="h-full shadow-sm">
                <template #title>
                  <div class="text-lg font-semibold">Cấu trúc tổ chức</div>
                </template>
                <template #content>
                  <div class="tree-container max-h-[70vh] overflow-y-auto pr-2">
                    <Tree
                      v-model:selectionKeys="selectedKey"
                      :value="OrgStruc"
                      selectionMode="single"
                      :metaKeySelection="false"
                      @nodeSelect="onNodeSelect"
                      @nodeUnselect="onNodeUnselect"
                      @nodeExpand="onNodeExpand"
                      @nodeCollapse="onNodeCollapse"
                      class="w-full border-none"
                    ></Tree>
                  </div>
                </template>
              </Card>
            </div>
            <div class="col-span-9 md:col-span-10">
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
                          selectedNode ? selectedNode.orgStrtCode : "Chưa có"
                        }}</span>
                      </div>
                    </div>
                    <div class="flex items-center">
                      <div class="w-32 flex-shrink-0">
                        <span class="text-gray-600 font-medium">Cấp tổ chức:</span>
                      </div>
                      <div class="flex-grow">
                        <span class="font-semibold text-gray-800">{{
                          selectedNode ? selectedNode?.orgLevel?.orlName : "Chưa có"
                        }}</span>
                      </div>
                    </div>
                    <div class="flex items-center">
                      <div class="w-32 flex-shrink-0">
                        <span class="text-gray-600 font-medium">Tên đơn vị:</span>
                      </div>
                      <div class="flex-grow flex items-center gap-2">
                        <span class="font-semibold text-gray-800">{{
                          selectedNode ? selectedNode.orgStrtName : "Chưa có"
                        }}</span>
                        <Button
                          @click="openAddDialog(selectedNode ? selectedNode : null)"
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
                            selectedNode.isActive === 'Active'
                              ? 'Đang hoạt động'
                              : 'Ngừng hoạt động'
                          "
                          :severity="
                            selectedNode.isActive === 'Active' ? 'success' : 'danger'
                          "
                        />
                        <span v-else class="font-semibold text-gray-800">Chưa có</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Card class="h-auto shadow-sm">
                  <template #title>
                    <div class="flex justify-between items-center">
                      <span class="text-lg font-semibold text-primary"
                        >Chi tiết nhà xưởng</span
                      >
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
                    </div>
                  </template>
                  <template #content>
                    <table-data-props
                      v-model:selection="dataSelection"
                      :dataTable="FactoryDetail"
                      :columns="columns"
                      :filters="filters"
                      @resetFilter="initFilters"
                    >
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
  <DeleteComp
    v-model:isOpenDelete="modelDialogDelete"
    :id="dataSelection.flatMap((e) => e.id)[0]"
    :content="`Bạn có chắc chắn muốn xóa ${dataSelection.length} bản ghi ?`"
    api="OrganizationalStructure"
    :loadData="refreshData"
  ></DeleteComp>
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
