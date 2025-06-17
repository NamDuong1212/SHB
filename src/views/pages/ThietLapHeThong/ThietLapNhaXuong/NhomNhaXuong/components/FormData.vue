<template>
    <Dialog v-model:visible="visibleModal" modal header="Nhóm nhà xưởng" :style="{ width: '50rem' }">
        <div class="flex flex-col gap-4">
            <div class="flex gap-4">
                <div class="flex w-1/3 flex-col gap-2">
                    <label class="font-medium text-gray-700 text-sm" for="">Mã nhóm <sup class="text-red-500">*</sup></label>
                    <InputText v-model="payload.groupFactoryCode" class="w-full" placeholder="Nhập mã nhóm"></InputText>
                </div>
                <div class="flex w-2/3 flex-col gap-2">
                    <label class="font-medium text-gray-700 text-sm" for="">Tên nhóm xưởng <sup class="text-red-500">*</sup></label>
                    <InputText v-model="payload.groupFactoryName" class="w-full" placeholder="Nhập tên nhóm xưởng"></InputText>
                </div>
            </div>
            <div class="flex flex-col gap-2">
                <label class="font-medium text-gray-700 text-sm" for="">Tên nhóm cha <sup class="text-red-500">&nbsp;</sup></label>
                <TreeSelect v-model="payload.parentId" :options="GroupFactoryOpts" placeholder="Chọn nhóm cha" class="w-full" panelClass="border border-gray-200 rounded-lg shadow-sm" />
                <small class="text-gray-500 text-xs italic"> Nếu không chọn nhóm cha mặc định sẽ là nhóm cha <sup class="text-red-500">*</sup> </small>
            </div>
            <div class="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <ToggleSwitch v-model="payload.isActive" />
                <label class="font-medium text-gray-700">
                    {{ payload.isActive ? 'Đang hoạt động' : 'Không hoạt động' }}
                </label>
            </div>
        </div>
        <template #footer>
            <div class="flex justify-end gap-2">
                <Button type="button" label="Hủy" icon="pi pi-times" size="small" severity="secondary" @click="visibleModal = false"></Button>
                <Button type="button" label="Lưu" icon="pi pi-save" size="small" @click="confirmAddFactory()"></Button>
            </div>
        </template>
    </Dialog>
</template>
<script setup>
import { ref } from 'vue';
import FactoryGrpService from '../service';

const GroupFactoryOpts = ref([]);
const visibleModal = ref(false);
const payload = ref({ parentId: null, isActive: true });
const messages = ref({});
const props = defineProps({
    loadData: {
        type: Function,
        default: () => {}
    }
});

const openDialog = (data) => {
    fetchAllGroupFactory();
    onRSFacgrp();
    if (data.id) {
        payload.value = { ...data };
        payload.value.parentName = data.parent?.groupFactoryName;
    }
    visibleModal.value = true;
};
const fetchAllGroupFactory = async () => {
    try {
        const res = await FactoryGrpService.getAll();
        GroupFactoryOpts.value = ConvertData(res.data);
    } catch (error) {
         
    }
};
const ConvertData = (data) => {
    if (data) {
        return data.map((el) => ({
            key: `${el.id}`,
            label: `${el.groupFactoryName}`,
            children: ConvertData(el.children)
        }));
    }
};
const confirmAddFactory = async () => {
    let data = {
        ...payload.value,
        parentId: payload.value.parentId ? Number(Object.keys(payload.value.parentId)[0]) : null
    };
    try {
        const res = await FactoryGrpService.save(data);
        props.loadData();
        visibleModal.value = false;
    } catch (error) {
         
    }
};
const onRSFacgrp = () => {
    payload.value = { parentId: null, isActive: true };
};
defineExpose({
    openDialog
});
</script>
<style></style>
