<template>
  <Dialog
    v-model:visible="visibleModal"
    modal
    header="Nhóm đơn vị tính"
    :style="{ width: '65rem' }"
  >
    <div class="flex flex-col gap-3">
      <div class="flex gap-2">
        <div class="flex w-full flex-col gap-2">
          <label class="font-medium text-gray-700" for=""
            >Tên nhóm đơn vị tính <sup class="text-red-500">*</sup></label
          >
          <InputText
            placeholder="Nhập tên nhóm"
            v-model="payload.unitGroupName"
            fluid
            size="small"
            :invalid="!!messages.unitGroupName"
          ></InputText>
          <small class="text-red-500" v-if="!!messages.unitGroupName">{{
            messages.unitGroupName
          }}</small>
        </div>
        <div class="flex w-full flex-col gap-2">
          <label class="font-medium text-gray-700" for=""
            >Đơn vị tính cơ sở <sup class="text-red-500">*</sup></label
          >
          <Select
            v-model="payload.unitOfMeasureBaseId"
            placeholder="Chọn đơn vị tính cơ sở"
            option-label="unitName"
            option-value="id"
            @change="selectedUnit"
            :options="
              UnitOpts.filter((item) => {
                return UnitsUnique(payload.unitOfMeasureBaseId, item);
              })
            "
            :invalid="!!messages.unitOfMeasureBaseId"
            fluid
            size="small"
          ></Select>
          <small class="text-red-500" v-if="!!messages.unitGroupName">{{
            messages.unitOfMeasureBaseId
          }}</small>
        </div>
      </div>
      <DataTable showGridlines :value="payload.unitOfMeasureGroupLines" size="small">
        <template #empty>
          <div class="text-center p-2">Danh sách trống</div>
        </template>

        <Column field="replacementQuantity" header="Số lượng thay thế">
          <template #body="sp">
            <InputNumber
              v-model="sp.data.replacementQuantity"
              :disabled="sp.index === 0"
              fluid
              size="small"
            ></InputNumber>
          </template>
        </Column>
        <Column header="Đơn vị tính thay thế">
          <template #body="sp">
            <Select
              class="w-full"
              size="small"
              v-model="sp.data.replacementUnitOfMeasureId"
              option-label="unitName"
              option-value="id"
              :disabled="sp.index === 0"
              :options="
                UnitOpts.filter((item) => {
                  return UnitsUnique(sp.data.replacementUnitOfMeasureId, item);
                })
              "
            ></Select>
          </template>
        </Column>
        <Column header-class="text-center" header="=">
          <template #body>
            <span>=</span>
          </template>
        </Column>
        <Column header="Số lượng cơ sở">
          <template #body="sp">
            <InputNumber
              v-model="sp.data.quantityBase"
              :disabled="sp.index === 0"
              fluid
              size="small"
            ></InputNumber>
          </template>
        </Column>
        <Column header="Đơn vị tính cơ sở">
          <template #body="sp">
            <Select
              size="small"
              v-model="payload.unitOfMeasureBaseId"
              disabled
              option-value="id"
              option-label="unitName"
              class="w-full"
              :options="
                UnitOpts.filter((item) => {
                  return item.id == payload.unitOfMeasureBaseId;
                })
              "
            ></Select>
          </template>
        </Column>
        <Column header="Thao tác">
          <template #body="sp">
            <Button
              text
              size="small"
              severity="danger"
              icon="pi pi-trash"
              v-if="sp.index != 0"
              @click="
                () => {
                  payload.unitOfMeasureGroupLines.splice(sp.index, 1);
                }
              "
            ></Button>
          </template>
        </Column>
      </DataTable>
      <div>
        <Button
          label="Thêm đơn vị quy đổi"
          icon="pi pi-plus"
          outlined
          @click="addUnitLine"
          size="small"
        ></Button>
      </div>
      <div class="flex flex-col gap-2">
        <label class="font-medium text-gray-700 text-sm" for="">Mô tả</label>
        <Textarea
          v-model="payload.unitGroupDescription"
          rows="3"
          class="w-full"
          placeholder="Nhập mô tả..."
        ></Textarea>
      </div>
      <div class="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
        <ToggleSwitch v-model="payload.isActive" />
        <label class="font-medium text-gray-700">{{
          payload.isActive ? "Đang hoạt động" : "Không hoạt động"
        }}</label>
      </div>
    </div>
    <template #footer>
      <div class="flex gap-2">
        <Button
          type="button"
          label="Đóng"
          icon="pi pi-times"
          severity="secondary"
          size="small"
          @click="visibleModal = false"
        ></Button>
        <Button
          type="button"
          icon="pi pi-save"
          label="Lưu"
          size="small"
          @click="saveData"
        ></Button>
      </div>
    </template>
  </Dialog>
  <DeleteComp
    v-model:isOpenDelete="DeleteModal"
    :id="payload.id"
    @loadData="onDelete()"
    :content="'Bạn có chắc chắn muốn xóa?'"
    api="UnitGroup"
  ></DeleteComp>
</template>
<script setup>
import UnitOfMeasureSerivce from "@/service/UnitGroupService";
import UnitOfMeasureGroupSerivce from "@/service/UnitOfMeasureGroupSerivce";
import { useToast } from "primevue/usetoast";
import { getCurrentInstance, onMounted, ref } from "vue";
const { proxy } = getCurrentInstance();
const toast = useToast();

const visibleModal = ref(false);
const DeleteModal = ref(false);

const messages = ref({});
const props = defineProps({
  dataTable: Array,
});
const emits = defineEmits(["loadData"]);

const UnitOpts = ref([]);
const payload = ref({
  unitGroupName: "",
  unitGroupDescription: null,
  unitOfMeasureBaseId: null,
  isActive: true,
  unitOfMeasureGroupLines: [
    {
      replacementUnitOfMeasureId: null,
      replacementQuantity: 1,
      quantityBase: 1,
    },
  ],
});
onMounted(() => {
  fetchAllUnits();
});
const openDialog = async (data = null) => {
  if (data.id) {
    try {
      const res = await UnitOfMeasureGroupSerivce.getUnitGrpById(data.id);
      payload.value = {
        ...res.data,
        unitOfMeasureGroupLines: [
          {
            replacementUnitOfMeasureId: res.data.unitOfMeasureBaseId,
            replacementQuantity: 1,
            quantityBase: 1,
          },
          ...(res.data?.unitOfMeasureGroupLines || []),
        ],
      };
    } catch (error) {}
  } else {
    payload.value = {
      unitGroupName: "",
      unitGroupDescription: null,
      unitOfMeasureBaseId: null,
      isActive: true,
      unitOfMeasureGroupLines: [
        {
          replacementUnitOfMeasureId: null,
          replacementQuantity: 1,
          quantityBase: 1,
        },
      ],
    };
  }
  messages.value = {};
  visibleModal.value = true;
};

const saveData = async () => {
  let data = {
    ...payload.value,
    unitOfMeasureGroupLines: payload.value.unitOfMeasureGroupLines.slice(1),
  };
  try {
    const res = await UnitOfMeasureGroupSerivce.save(data);
    if (res) {
      proxy.$notify("S", "Thao tác thành công!", toast);
      emits("loadData");
      visibleModal.value = false;
    }
  } catch (error) {
    if (error.isValidate) {
      messages.value = error;
    } else {
      proxy.$notify("S", error?.response?.data?.Message || error, toast);
    }
  }
};

const fetchAllUnits = async () => {
  try {
    const res = await UnitOfMeasureSerivce.getAllUnit();
    UnitOpts.value = res.data.result;
  } catch (error) {}
};
const UnitsUnique = (id, data) => {
  if (id == data.id) return true;
  const arrCheck = payload.value.unitOfMeasureGroupLines;
  const check = arrCheck.filter((val) => {
    return val.replacementUnitOfMeasureId == data.id;
  });
  if (check.length) {
    return false;
  } else {
    return true;
  }
};
const selectedUnit = (e) => {
  payload.value.unitOfMeasureGroupLines[0].replacementUnitOfMeasureId = e.value;
};
const onDelete = () => {
  proxy.$notify("S", "Xóa thành công!", toast);
  emits("loadData");
  visibleModal.value = false;
  DeleteModal.value = false;
};
const openDeleteDialog = () => {
  DeleteModal.value = true;
};

const addUnitLine = () => {
  payload.value.unitOfMeasureGroupLines.push({
    replacementUnitOfMeasureId: null,
    replacementQuantity: 0,
    quantityBase: 0,
  });
};
defineExpose({
  openDialog,
});
</script>
<style></style>
