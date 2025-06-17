<script setup>
import tableDoc from '@/components/table/tableBasic.vue';
import { renderDropdownFilter, renderInputFilter } from '@/composables/renderFilter';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { Button, Image } from 'primevue';
import TabPanel from 'primevue/tabpanel';
import TabView from 'primevue/tabview';
import Tag from 'primevue/tag';
import { h, onBeforeMount, ref } from 'vue';
import FormData from '../components/FormData.vue';
import UpdateSerial from '../components/UpdateSerial.vue';
const dialogRef = ref();
const tableRef = ref();
const childTableRef = ref();
const filters = ref(null);
const filtersChild = ref(null);
const dataSelection = ref([]);
const expandedRows = ref([]);
const expandedRowsChild = ref([]);

const columns = ref([
    {
        field: 'assetCode',
        header: 'Mã tài sản',
        sortable: true,
        display: true,
        renderFilter: renderInputFilter(),
        renderValue: (rowData) => h('span', {}, rowData.assetCode)
    },
    {
        field: 'assetName',
        header: 'Tên tài sản',
        sortable: true,
        display: true,
        renderFilter: renderInputFilter(),
        renderValue: (rowData) => h('span', {}, rowData.assetName)
    },
    {
        field: 'assetGroup.name',
        header: 'Nhóm tài sản',
        sortable: true,
        display: true,
        renderFilter: renderInputFilter(),
        renderValue: (rowData) => h('span', {}, rowData.assetGroup.name)
    },
    {
        field: 'assetType.name',
        header: 'Loại tài sản',
        sortable: true,
        display: true,
        renderFilter: renderInputFilter(),
        renderValue: (rowData) => h('span', {}, rowData.assetType.name)
    },
    {
        field: 'assetImgs',
        header: 'Hình ảnh',
        display: true,
        style: 'width: 80px',
        renderValue: (rowData) =>
            h('div', { class: 'flex items-center justify-center gap-2' }, [
                h(Image, {
                    preview: true,
                    src: rowData.assetImgs?.[0]?.imgUrl || 'https://placehold.co/50',
                    alt: 'Asset Image',
                    class: 'overflow-hidden',
                    style: {
                        width: '50px',
                        height: '50px',
                        objectFit: 'cover',
                        borderRadius: '8px'
                    }
                })
            ])
    },
    {
        field: 'isActive',
        header: 'Trạng thái',
        sortable: true,
        display: true,
        renderFilter: renderDropdownFilter({
            placeholder: 'Chọn...',
            options: [true, false]
        }),
        renderValue: (rowData) => {
            const severityMap = {
                true: 'success',
                false: 'danger'
            };
            return h(Tag, {
                value: rowData.isActive ? `Hoạt động` : `Không hoạt động`,
                severity: severityMap[rowData.isActive] || null
            });
        }
    },
    {
        field: 'actions',
        header: 'Hành động',
        display: true,

        renderValue: (rowData) => {
            return h('div', { class: 'flex items-center justify-center gap-2' }, [
                h(Button, {
                    icon: 'pi pi-pencil',
                    severity: 'warning',
                    text: true,
                    size: 'small',
                    onClick: () => openAddDialog(rowData)
                }),
                h(Button, {
                    icon: 'pi pi-trash',
                    text: true,
                    severity: 'danger',
                    size: 'small',
                    onClick: () => {
                        console.warn('Delete action triggered for rowData:', rowData);
                    }
                })
            ]);
        }
    }
]);
const statusOptions = [
    { label: 'Chưa kích hoạt', value: 'O' },
    { label: 'Kích hoạt', value: 'CP' },
    { label: 'Dừng bảo trì', value: 'C' },
    { label: 'Thanh lý', value: 'TL' }
];

const columnsChild = ref([
    {
        field: 'assetSerial',
        header: 'Serial',
        sortable: true,
        display: true,
        renderValue: (rowData) => h('span', {}, rowData.assetSerial)
    },
    {
        field: 'isActive',
        header: 'Trạng thái',
        sortable: true,
        display: true,
        renderFilter: renderDropdownFilter({
            placeholder: 'Chọn...',
            options: [true, false]
        }),
        renderValue: (rowData) => {
            const severityMap = {
                CP: 'success',
                O: 'warning',
                C: 'info',
                TL: 'danger',
                false: 'danger'
            };
            return h(Tag, {
                value: statusOptions.find((el) => el.value == rowData.status)?.label,
                severity: severityMap[rowData.status] || null
            });
        }
    },
    {
        field: 'actions',
        header: 'Hành động',
        display: true,

        renderValue: (rowData) => {
            return h('div', { class: 'flex items-center justify-center gap-2' }, [
                h(UpdateSerial, {
                    editData: rowData,
                    typeId: rowData.assetTypeId,
                    loadData: () => {
                        // You might want to replace this with your actual data loading function
                        loadData();
                    }
                })
            ]);
        }
    }
]);
onBeforeMount(() => {
    initFilters();
    initFiltersChild();
});

const initFilters = () => {
    filters.value = {
        Search: { value: null, matchMode: FilterMatchMode.CONTAINS },

        assetCode: {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
        },

        assetName: {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
        },

        'assetGroup.name': {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
        },

        'assetType.name': {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
        },

        fatherName: {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
        },

        isActive: { value: null, matchMode: FilterMatchMode.EQUALS }
    };
};
const initFiltersChild = () => {
    filtersChild.value = {
        Search: { value: null, matchMode: FilterMatchMode.CONTAINS },

        isActive: { value: null, matchMode: FilterMatchMode.EQUALS }
    };
};
const openAddDialog = (data) => {
    dialogRef.value?.openDialog(data);
};

// Function to refresh data when a serial is updated
const refreshData = () => {
    if (expandedRows.value.length > 0) {
        // Re-fetch data for the expanded row's serials
        childTableRef.value?.fetchDataFromAPI();
    }
};

// Store the data for the main table
const dataTable = ref([]);

// Function to refresh all data
const fetchAllData = async () => {
    // Refresh the main table data
    await tableRef.value?.fetchDataFromAPI();

    // If we have expanded rows, also refresh the child tables
    if (expandedRows.value.length > 0) {
        childTableRef.value?.fetchDataFromAPI();
    }
};
const loadData = async () => {
    // Clear all selections and expanded rows
    dataSelection.value = [];
    expandedRows.value = {};
    expandedRowsChild.value = {};

    // Reload main table first
    if (tableRef.value) {
        await tableRef.value.refresh();
    }

    // Wait a moment before refreshing child table to ensure DOM updates
    setTimeout(() => {
        if (childTableRef.value) {
            childTableRef.value.refresh();
        }
    }, 100);
};
// Function to delete selected items
const delteItems = async () => {
    // Add confirmation logic if needed
    try {
        // Implement deletion logic here
        // For example:
        // await service.deleteMany(dataSelection.value.map(item => item.id));

        // Refresh data after deletion
        await fetchAllData();
        dataSelection.value = [];
    } catch (error) {
        console.error('Error deleting items:', error);
    }
};
</script>

<template>
    <tableDoc ref="tableRef" header="Danh mục tài sản" :columns="columns" :filters="filters" apiEndpoint="Asset" @resetFilter="initFilters" v-model:selection="dataSelection" v-model:expandedRows="expandedRows" :isExpanded="true">
        <!-- slot header -->
        <template #header>
            <Button label="Xóa" icon="pi pi-trash" severity="danger" size="small" :disabled="!dataSelection.length" @click="delteItems()" />
            <Button icon="pi pi-plus" label="Thêm mới" severity="primary" size="small" @click="openAddDialog" />
        </template>

        <!-- slot expansion -->
        <template #expansion="{ data }">
            <tableDoc
                header="Danh mục Serial"
                :columns="columnsChild"
                :filters="filters"
                :apiEndpoint="`Asset/get-serial-by-id-asset/${data.id}`"
                @resetFilter="initFilters"
                v-model:expandedRows="expandedRowsChild"
                :isExpanded="true"
                ref="childTableRef"
            >
                <!-- slot expansion -->
                <template #expansion="{ data }">
                    <div class="card">
                        <TabView>
                            <TabPanel header="Lịch sử thiết bị">
                                <p class="m-0">hello</p>
                            </TabPanel>
                            <TabPanel header="Hồ sơ đăng kiểm">
                                <p class="m-0">hello</p>
                            </TabPanel>
                            <TabPanel header="Bảo hiểm, bảo hành">
                                <p class="m-0">hello</p>
                            </TabPanel>
                            <TabPanel header="Lịch sử bảo trì">
                                <p class="m-0">hello</p>
                            </TabPanel>
                            <TabPanel header="Vận hành">
                                <p class="m-0">hello</p>
                            </TabPanel>
                        </TabView>
                    </div>
                </template>
            </tableDoc>
        </template>
    </tableDoc>
    <FormData ref="dialogRef" :loadData="loadData" :dataTable="dataTable"></FormData>
</template>
