<script setup>
import tableDoc from "@/components/table/tableBasic.vue";
import { FilterMatchMode, FilterOperator } from "@primevue/core/api";
import Button from "primevue/button";
import Tag from "primevue/tag";
import { h, onBeforeMount, ref } from "vue";
import FormData from "../components/FormData.vue";
const dialogRef = ref();
const filters = ref(null);
const TableBasic = ref();

const columns = ref([
  {
    field: "userName",
    header: "Tên đăng nhập",
    sortable: true,
    display: true,
    renderValue: (rowData) =>
      h(
        "button",
        {
          class: "text-blue-600 font-semibold cursor-pointer hover:underline",
          onClick: () => openAddDialog(rowData),
        },
        rowData.userName
      ),
  },
  {
    field: "fullName",
    header: "Tên người dùng",
    sortable: true,
    display: true,
    renderValue: (rowData) => h("span", {}, rowData.fullName),
  },
  {
    field: "role",
    header: "Vai trò",
    sortable: true,
    display: true,
    renderValue: (rowData) => h("span", {}, rowData.role),
  },
  {
    field: "phoneNumber",
    header: "Số điện thoại",
    sortable: true,
    display: true,
    renderValue: (rowData) => h("span", {}, rowData.phoneNumber),
  },
  {
    field: "email",
    header: "Email",
    sortable: true,
    display: true,
    renderValue: (rowData) => h("span", {}, rowData.email),
  },
  {
    field: "isActive",
    header: "Trạng thái",
    display: true,
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
  initFilters();
});

const initFilters = () => {
  filters.value = {
    Search: { value: null, matchMode: FilterMatchMode.CONTAINS },
    ItemCode: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    ItemName: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
  };
};
const openAddDialog = (data) => {
  dialogRef.value?.openDialog(data);
};
const refreshData = () => {
  TableBasic.value?.refresh();
};
</script>

<template>
  <tableDoc
    ref="TableBasic"
    header="Danh sách người dùng"
    :columns="columns"
    :filters="filters"
    apiEndpoint="User"
    @resetFilter="initFilters"
    :isExpanded="true"
  >
    <template #header>
      <Button
        @click="openAddDialog"
        type="button"
        icon="pi pi-plus"
        severity="primary"
        label="Thêm mới"
        size="small"
      />
    </template>
    <template #expansion="{ data }">
      <div class="card">
        <Tabs value="0">
          <TabList>
            <Tab value="0"> Thông tin chung</Tab>
          </TabList>
          <TabPanels>
            <TabPanel value="0">
              <div class="grid grid-cols-12">
                <div class="col-span-12 px-5 py-3">
                  <div class="grid grid-cols-12 gap-6">
                    <div class="col-span-6 border-b py-2">
                      <div class="flex gap-10">
                        <b>Tên đăng nhập:</b>
                        <span>{{ data.userName }}</span>
                      </div>
                    </div>
                    <div class="col-span-6 border-b py-2">
                      <div class="flex gap-10">
                        <b>Vai trò:</b>
                        <span>{{ data.role }}</span>
                      </div>
                    </div>
                    <div class="col-span-6 border-b py-2">
                      <div class="flex gap-10">
                        <b>Tên người dùng:</b>
                        <span>{{ data.fullName }}</span>
                      </div>
                    </div>
                    <div class="col-span-6 border-b py-2">
                      <div class="flex gap-10">
                        <b>Đơn vị:</b>
                        <span>{{ data.organizationalStructure?.orgStrName }}</span>
                      </div>
                    </div>
                    <div class="col-span-6 border-b py-2">
                      <div class="flex gap-10">
                        <b>Số điện thoại:</b>
                        <span>{{ data.phoneNumber }}</span>
                      </div>
                    </div>
                    <div class="col-span-6 border-b py-2">
                      <div class="flex gap-10">
                        <b>Chức vụ:</b>
                        <span>{{ data.position }}</span>
                      </div>
                    </div>
                    <div class="col-span-6 border-b py-2">
                      <div class="flex gap-10">
                        <b>Email:</b>
                        <span>{{ data.email }}</span>
                      </div>
                    </div>
                    <div class="col-span-6 border-b py-2">
                      <div class="flex gap-10">
                        <b>Trạng thái:</b>
                        <span>
                          <Tag
                            :value="data.isActive ? 'Đang hoạt động' : 'Không hoạt động'"
                            :severity="data.isActive ? 'success' : 'danger'"
                          ></Tag>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>
          </TabPanels>
          <Divider></Divider>
          <div class="flex justify-end gap-3">
            <Button label="Cập nhật" icon="pi pi-pencil" size="small"></Button>
            <Button
              label="Ngừng hoạt động"
              icon="pi pi-lock"
              size="small"
              severity="warn"
            ></Button>
            <Button
              label="Xóa"
              icon="pi pi-trash"
              severity="danger"
              size="small"
            ></Button>
          </div>
        </Tabs>
      </div>
    </template>
  </tableDoc>
  <FormData ref="dialogRef" :loadData="refreshData"></FormData>
  <!-- <loading></loading> -->
</template>
