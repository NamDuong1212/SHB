<script setup>
import tableDoc from '@/components/table/tableBasic.vue';
import { renderDropdownFilter, renderInputFilter } from '@/composables/renderFilter';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { Button } from 'primevue';
import Tag from 'primevue/tag';
import { h, onBeforeMount, ref, watch } from 'vue';
import UpdateGroup from '../components/UpdateGroup.vue';
import UpdateType from '../components/UpdateType.vue';
const dialogRef = ref();
const dialogRef2 = ref();
const filters = ref(null);
const filtersChild = ref(null);
const tableRef = ref();
const tableRefChild = ref();
const expandedRows = ref();
const columns = ref([
    {
        field: 'code',
        header: 'Mã',
        sortable: true,
        display: true,
        renderFilter: renderInputFilter(),
        renderValue: (rowData) => h('span', {}, rowData.code)
    },
    {
        field: 'name',
        header: 'Tên ',
        sortable: true,
        display: true,
        renderFilter: renderInputFilter(),
        renderValue: (rowData) => h('span', {}, rowData.name)
    },

    {
        field: 'note',
        header: 'Phân cấp',
        display: true,
        renderValue: (rowData) => h('span', {}, 'Nhóm tài sản')
    },
    {
        field: 'note',
        header: 'Mô tả',
        display: true,
        renderValue: (rowData) => h('span', {}, rowData.note)
    },
    {
        field: 'isActive',
        header: 'Trạng thái',
        sortable: true,
        display: true,
        renderFilter: renderDropdownFilter({
            placeholder: 'Chọn...',
            options: ['true', 'false']
        }),
        renderValue: (rowData) => {
            const severityMap = {
                true: 'success',
                false: 'danger'
            };
            return h(Tag, {
                value: rowData.isActive ? `Đang hoạt động` : `Ngừng hoạt động`,
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
const columnsChild = ref([
    {
        field: 'code',
        header: 'Mã',
        sortable: true,
        display: true,
        renderFilter: renderInputFilter(),
        renderValue: (rowData) => h('span', {}, rowData.code)
    },
    {
        field: 'name',
        header: 'Tên ',
        sortable: true,
        display: true,
        renderFilter: renderInputFilter(),
        renderValue: (rowData) => h('span', {}, rowData.name)
    },

    {
        field: 'note',
        header: 'Phân cấp',
        display: true,
        renderValue: (rowData) => h('span', {}, 'Loại tài sản')
    },
    {
        field: 'note',
        header: 'Mô tả',
        display: true,
        renderValue: (rowData) => h('span', {}, rowData.note)
    },
    {
        field: 'isActive',
        header: 'Trạng thái',
        sortable: true,
        display: true,
        renderFilter: renderDropdownFilter({
            placeholder: 'Chọn...',
            options: ['true', 'false']
        }),
        renderValue: (rowData) => {
            const severityMap = {
                true: 'success',
                false: 'danger'
            };
            return h(Tag, {
                value: rowData.isActive ? `Đang hoạt động` : `Ngừng hoạt động`,
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
                    onClick: () => openAddDialog2(rowData)
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
onBeforeMount(() => {
    initFilters();
    initFiltersChild();
});

const initFilters = () => {
    filters.value = {
        Search: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
        },
        code: {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
        },

        isActive: { value: null, matchMode: FilterMatchMode.EQUALS }
    };
};

const initFiltersChild = () => {
    filtersChild.value = {
        Search: { value: null, matchMode: FilterMatchMode.CONTAINS },
        assetGroupId: { value: null, matchMode: FilterMatchMode.EQUALS },
        name: {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
        },
        code: {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
        },

        isActive: { value: null, matchMode: FilterMatchMode.EQUALS }
    };
};
watch(expandedRows, (newValue) => {
    if (newValue && Object.keys(newValue).length > 0) {
        filtersChild.value.assetGroupId.value = Object.keys(newValue)[0];
        if (tableRefChild.value) {
            tableRefChild.value.refresh();
        }
    }
});
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
</script>

<template>
    <tableDoc ref="tableRef" header="Danh mục nhóm tài sản" :columns="columns" :filters="filters" apiEndpoint="AssetGroup" @resetFilter="initFilters" v-model:expandedRows="expandedRows" :isExpanded="true">
        <template #header>
            <Button @click="openAddDialog" type="button" icon="pi pi-plus" severity="primary" label="Thêm mới nhóm tài sản" size="small" />
            <Button @click="openAddDialog2" type="button" icon="pi pi-plus" severity="primary" label="Thêm mới loại tài sản" size="small" />
        </template>

        <template #expansion="{ data }">
            <tableDoc header="Danh mục loại tài sản" :columns="columnsChild" :filters="filtersChild" apiEndpoint="AssetType" @resetFilter="initFiltersChild" ref="tableRefChild"> </tableDoc>
        </template>
    </tableDoc>
    <UpdateGroup ref="dialogRef" :loadData="loadDataGroup" :dataTable="dataTable"></UpdateGroup>
    <UpdateType ref="dialogRef2" :loadData="fetchAllData" :dataTable="dataTable"></UpdateType>
</template>
