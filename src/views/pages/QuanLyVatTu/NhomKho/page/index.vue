<script setup>
import tableDoc from '@/components/table/tableBasic.vue';
import { renderDropdownFilter } from '@/composables/renderFilter';
import { FilterMatchMode } from '@primevue/core/api';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import { h, onBeforeMount, ref } from 'vue';
import FormData from '../components/FormData.vue';
const dialogRef = ref();
const filters = ref(null);
const TableBasic = ref();

const columns = ref([
    {
        field: 'orlName',
        header: 'Cấp tổ chức',
        display: true,
        renderValue: (rowData) =>
            h(
                'span',
                {
                    class: 'text-blue-600 font-semibold cursor-pointer hover:underline',
                    onClick: () => openAddDialog(rowData)
                },
                rowData.orlName
            )
    },
    {
        field: 'orlDesc',
        header: 'Mô tả',
        display: true,
        renderValue: (rowData) => h('span', {}, rowData.orlDesc)
    },
    {
        field: 'isActive',
        header: 'Trạng thái',
        display: true,
        renderFilter: renderDropdownFilter({
            placeholder: 'Chọn...',
            options: ['Active', 'InActive']
        }),
        renderValue: (rowData) => {
            const severityMap = {
                Active: 'info',
                Inactive: 'danger'
            };
            return h(Tag, {
                value: rowData.isActive === 'Active' ? `Đang hoạt động` : `Ngừng hoạt động`,
                severity: severityMap[rowData.isActive] || null
            });
        }
    }
]);

onBeforeMount(() => {
    initFilters();
});

const initFilters = () => {
    filters.value = {
        Search: { value: null, matchMode: FilterMatchMode.CONTAINS },
        isActive: {
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
        }
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
    <tableDoc ref="TableBasic" header="Danh mục cấp tổ chức" :columns="columns" :filters="filters" apiEndpoint="Organizational" @resetFilter="initFilters">
        <template #header>
            <Button @click="openAddDialog" type="button" icon="pi pi-plus" severity="primary" label="Thêm mới" size="small" />
        </template>
    </tableDoc>
    <FormData ref="dialogRef" :loadData="refreshData"></FormData>
</template>
