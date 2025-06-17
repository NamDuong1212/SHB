<script setup>
import tableDoc from '@/components/table/tableBasic.vue';
import { renderDropdownFilter, renderInputFilter } from '@/composables/renderFilter';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { Button } from 'primevue';
import Tag from 'primevue/tag';
import { h, onBeforeMount, ref } from 'vue';
import format from '../../../../../helper/format';
import FormData from '../components/FormData.vue';
const dialogRef = ref();
const filters = ref(null);
const TableBasic = ref();
const columns = ref([
    {
        field: 'code',
        header: 'Mã thông số',
        sortable: true,
        display: true,
        renderFilter: renderInputFilter(),
        renderValue: (rowData) => h('span', {}, rowData.code)
    },
    {
        field: 'name',
        header: 'Tên thông số',
        sortable: true,
        display: true,
        renderFilter: renderInputFilter(),
        renderValue: (rowData) => h('span', {}, rowData.name)
    },
    {
        field: 'unit',
        header: 'Đơn vị',
        sortable: true,
        display: true,
        renderFilter: renderInputFilter(),
        renderValue: (rowData) => h('span', {}, rowData.unit)
    },

    {
        field: 'createDate',
        header: 'Ngày tạo',
        sortable: true,
        display: true,
        renderFilter: renderInputFilter(),
        renderValue: (rowData) => h('span', {}, format.dateTime(rowData.createDate))
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
        sortable: true,
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

onBeforeMount(() => {
    initFilters();
});

const initFilters = () => {
    filters.value = {
        Search: { value: null, matchMode: FilterMatchMode.CONTAINS },

        code: {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
        },
        name: {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
        },
        unit: {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
        },
        createDate: {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }]
        },
        isActive: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
        }
    };
};
const openAddDialog = (data) => {
    dialogRef.value?.openDialog(data);
};
const loadData = () => {
    TableBasic.value?.refresh();
};
</script>

<template>
    <tableDoc ref="TableBasic" header="Danh mục thông số hoạt động" :columns="columns" :filters="filters" apiEndpoint="DeviceConfig" @resetFilter="initFilters">
        <template #header>
            <Button @click="openAddDialog" type="button" icon="pi pi-plus" severity="primary" label="Thêm mới" size="small" />
        </template>
    </tableDoc>
    <FormData ref="dialogRef" :loadData="loadData" :dataTable="dataTable"></FormData>
</template>
