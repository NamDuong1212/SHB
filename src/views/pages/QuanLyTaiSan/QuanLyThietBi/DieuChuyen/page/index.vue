<script setup>
import tableDoc from '@/components/table/tableBasic.vue';
import { renderDropdownFilter, renderInputFilter } from '@/composables/renderFilter';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import Tag from 'primevue/tag';
import { h, onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';
import format from '../../../../../../helper/format';
const filters = ref(null);
const tableRef = ref();
const tableRefChild = ref();
const expandedRows = ref();
const router = useRouter();
const columns = ref([
    {
        field: 'deviceCode',
        header: 'Mã phiếu',
        sortable: true,
        display: true,
        renderFilter: renderInputFilter(),
        renderValue: (rowData) => h('span', {}, rowData.deviceCode)
    },
    {
        field: 'quantity',
        header: 'Số lượng TS',
        sortable: true,
        display: true,
        renderFilter: renderInputFilter(),
        renderValue: (rowData) => h('span', {}, rowData.quantity)
    },
    {
        field: 'organizationalStructure.orgStrtName',
        header: 'Từ đơn vị quản lý',
        sortable: true,
        display: true,
        renderFilter: renderInputFilter(),
        renderValue: (rowData) => h('span', {}, rowData.organizationalStructure?.orgStrtName)
    },
    {
        field: 'toManagingUnitId',
        header: 'Đến đơn vị quản lý',
        sortable: true,
        display: true,
        renderFilter: renderInputFilter(),
        renderValue: (rowData) => h('span', {}, rowData.toManagingUnitId)
    },
    {
        field: 'locationId',
        header: 'Từ vị trí',
        sortable: true,
        display: true,
        renderFilter: renderInputFilter(),
        renderValue: (rowData) => h('span', {}, rowData.locationId)
    },
    {
        field: 'toLocationId',
        header: 'Đến vị trí',
        sortable: true,
        display: true,
        renderFilter: renderInputFilter(),
        renderValue: (rowData) => h('span', {}, rowData.toLocationId)
    },
    {
        field: 'note',
        header: 'Lý do',
        sortable: true,
        display: true,
        renderValue: (rowData) => h('span', {}, rowData.note)
    },
    {
        field: 'status',
        header: 'Trạng thái',
        sortable: true,
        display: true,
        renderFilter: renderDropdownFilter({
            placeholder: 'Chọn...',
            options: ['true', 'false']
        }),
        renderValue: (rowData) => {
            const severityMap = {
                O: 'warning',
                CP: 'success',
                C: 'danger'
            };
            const valueMap = {
                O: 'Chờ duyệt',
                CP: 'Đã duyệt',
                C: 'Đã huỷ'
            };
            return h(Tag, {
                value: valueMap[rowData.status] || null,
                severity: severityMap[rowData.status] || null
            });
        }
    },
    {
        field: 'creator',
        header: 'Người tạo',
        sortable: true,
        display: false,
        renderFilter: renderInputFilter(),
        renderValue: (rowData) => h('span', {}, rowData.creator)
    },
    {
        field: 'updater',
        header: 'Người duyệt',
        sortable: true,
        display: true,
        renderFilter: renderInputFilter(),
        renderValue: (rowData) => h('span', {}, rowData.updater)
    },
    {
        field: 'createDate',
        header: 'Ngày tạo',
        sortable: true,
        display: false,
        renderFilter: renderInputFilter(),
        renderValue: (rowData) => h('span', {}, format.date(rowData.createDate))
    },
    {
        field: 'updateDate',
        header: 'Ngày duyệt',
        sortable: true,
        display: false,
        renderFilter: renderInputFilter(),
        renderValue: (rowData) => h('span', {}, format.date(rowData.updateDate))
    },
    {
        field: 'recoveryEmployee',
        header: 'Nhân viên thu hồi',
        sortable: true,
        display: false,
        renderFilter: renderInputFilter(),
        renderValue: (rowData) => h('span', {}, rowData.recoveryEmployee)
    }
]);
onBeforeMount(() => {
    initFilters();
});

const initFilters = () => {
    filters.value = {
        Search: { value: null, matchMode: FilterMatchMode.CONTAINS },
        'organizationalStructure.orgStrtName': {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
        },
        deviceCode: {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
        },
        status: {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
        },
        updater: {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
        },
        quantity: {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
        },
        createDate: {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
        },
        decisionDate: {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
        },
        decisionNumber: {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
        },
        'factory.factoryName': {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
        }
    };
};

const openAddDialog = (data) => {
    dialogRef.value?.openDialog(data);
};
const openAddDialog2 = (data) => {
    dialogRef2.value?.openDialog(data);
};
const loadDataGroup = () => {
    if (tableRef.value) {
        tableRef.value?.refresh();
    }
    if (tableRefChild.value) {
        tableRefChild.value?.refresh();
    }
};
const items = ref([
    {
        label: 'Nghiệp vụ',
        items: [
            {
                label: 'Yêu cầu',
                icon: 'pi pi-file',
                command: () => {
                    router.push('/dieu-chuyen-thiet-bi/yeu-cau');
                }
            },
            {
                label: 'Phê duyệt',
                icon: 'pi pi-verified',
                command: async () => {
                    router.push('/dieu-chuyen-thiet-bi/phe-duyet');
                }
            }
        ]
    }
]);
const menu = ref();
const toggle = (event) => {
    menu.value.toggle(event);
};
</script>

<template>
    <tableDoc ref="tableRef" header="Danh mục điều chuyển thiết bị" :columns="columns" :filters="filters" apiEndpoint="DeviceTransfer" @resetFilter="initFilters" v-model:expandedRows="expandedRows" :isExpanded="true">
        <template #header>
            <Button size="small" type="button" icon="pi pi-chevron-down" iconPos="right" label="Điều chuyển" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu" />
            <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
        </template>

        <template #expansion="{ data }">
            <DataTable :value="data.deviceLines" class="p-datatable-sm" :rowHover="true" showGridlines stripedRows responsiveLayout="scroll">
                <template #empty> <div class="p-5 text-center">Không có bản ghi nào.</div> </template>
                <Column field="index" header="#" style="width: 3rem">
                    <template #body="{ index }">
                        <span class="flex items-center justify-center">
                            {{ index + 1 }}
                        </span>
                    </template>
                </Column>
                <Column field="assetCode" header="Mã tài sản">
                    <template #body="{ data }">
                        <div>{{ data.assetCode }}</div>
                    </template>
                </Column>
                <Column field="assetName" header="Tên tài sản">
                    <template #body="{ data }">
                        <div class="text-gray-700">{{ data.assetName }}</div>
                    </template>
                </Column>
                <Column field="serial" header="Serial">
                    <template #body="{ data }">
                        {{ data.serial }}
                    </template>
                </Column>
                <Column field="decisionNumber" header="Số quyết định">
                    <template #body="{ data }">
                        <div>{{ data.decisionNumber || '' }}</div>
                    </template>
                </Column>
                <Column field="decisionDate" header="Ngày quyết định">
                    <template #body="{ data }">
                        <div>{{ format.date(data.decisionDate) }}</div>
                    </template>
                </Column>
            </DataTable>
        </template>
    </tableDoc>
</template>
<style>
.menu-bar-custom ul {
    padding: 0;
}

.menu-bar-custom .p-menubar-submenu {
    z-index: 999;
}
</style>
