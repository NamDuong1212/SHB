<template>
  <div class="header mb-3 flex justify-between">
    <div class="font-semibold text-xl">Danh mục tiền tệ</div>
  </div>
  <DataTable
    size="small"
    dataKey="id"
    :loading="loading"
    showGridlines
    scrollable
    scrollHeight="flex"
    resizableColumns
    columnResizeMode="fit"
    :value="payload"
    v-model:selection="selection"
    editMode="cell"
    @cell-edit-complete="onCellEditComplete"
  >
    <template #header>
      <div class="flex justify-between p-2">
        <div class="flex gap-4">
          <IconField>
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText class="w-[30rem]" placeholder="Tìm kiếm" size="small" />
          </IconField>
        </div>
        <div class="flex gap-3">
          <Button
            label="Xóa"
            size="small"
            severity="danger"
            icon="pi pi-trash"
            @click="DeleteItems"
          ></Button>
          <customColumns :columns="columnsData" idTable="tableMoney"></customColumns>
        </div>
      </div>
    </template>
    <template #empty><div class="text-center">Không có bản ghi nào.</div> </template>
    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
    <Column header="#" class="w-[3rem]">
      <template #body="{ index }">
        <span class="text-center">{{ index + 1 }}</span>
      </template>
    </Column>
    <Column
      v-for="col in columnsData.filter((e) => e.display)"
      :key="col.field"
      :field="col.field"
      :header="col.header"
      :sortable="col.sortable"
      :frozen="col.frozen"
      alignFrozen="left"
    >
      <template #body="{ data }">
        <component :is="col?.renderValue(data)" />
      </template>
      <template #editor="{ data, field }">
        <component :is="col?.renderEdit({ data, field })" />
      </template>
    </Column>
    <template #footer>
      <Button
        label="Thêm dòng"
        icon="pi pi-plus"
        @click="addLine"
        size="small"
        class="mt-3"
      ></Button>
    </template>
  </DataTable>
  <DeleteComps
    v-model:isOpenDelete="DeleteModal"
    :ids="selection.flatMap((e) => e.id)"
    :loadData="getAllData"
    :content="`Bạn có chắc chắn muốn xóa ${selection.length} không?`"
    api="Currency"
  ></DeleteComps>
</template>
<script setup>
import DeleteComps from "@/components/DeleteComps.vue";
import customColumns from "@/components/table/customColumns.vue";
import serviceCurrency from "@/service/serviceCurrency";
import { Dropdown, InputText, useToast } from "primevue";
import { getCurrentInstance, h, onBeforeMount, ref } from "vue";

const DeleteModal = ref(false);
const messages = ref({});
const loading = ref(false);
const { proxy } = getCurrentInstance();
const toast = useToast();
const selection = ref([]);
const columnsData = ref([
  {
    field: "currencyCode",
    header: "Mã",
    sortable: true,
    display: true,
    renderValue: (rowData) => h("span", rowData.currencyCode),
    renderEdit: ({ data, field }) =>
      h(InputText, {
        type: "text",
        size: "small",
        modelValue: data[field],
        "onUpdate:modelValue": (val) => {
          data[field] = val;
        },
        placeholder: "Nhập mã tiền",
        class: "w-full",
      }),
  },
  {
    field: "currencyName",
    header: "Tên tiền tệ",
    sortable: true,
    display: true,
    renderValue: (rowData) => h("span", rowData.currencyName),
    renderEdit: ({ data, field }) =>
      h(InputText, {
        type: "text",
        size: "small",
        modelValue: data[field],
        "onUpdate:modelValue": (val) => {
          data[field] = val;
        },
        placeholder: "Nhập tên tiền tệ",
        class: "w-full",
      }),
  },
  {
    field: "currencyInternaltionalCode",
    header: "Mã quốc tế",
    sortable: true,
    display: true,
    renderValue: (rowData) => h("span", rowData.currencyInternaltionalCode),
    renderEdit: ({ data, field }) =>
      h(InputText, {
        type: "text",
        size: "small",
        modelValue: data[field],
        "onUpdate:modelValue": (val) => {
          data[field] = val;
        },
        placeholder: "Nhập mã tiền quốc tế",
        class: "w-full",
      }),
  },
  {
    field: "unitName",
    header: "Tên tiền tệ",
    sortable: true,
    display: true,
    renderValue: (rowData) => h("span", rowData.unitName),
    renderEdit: ({ data, field }) =>
      h(InputText, {
        type: "text",
        size: "small",
        modelValue: data[field],
        "onUpdate:modelValue": (val) => {
          data[field] = val;
        },
        placeholder: "Nhập tên tiền tệ",
        class: "w-full",
      }),
  },
  {
    field: "smallDenomination",
    header: "Loại tiền lẻ",
    sortable: true,
    display: true,
    renderValue: (rowData) => h("span", rowData.smallDenomination),
    renderEdit: ({ data, field }) =>
      h(InputText, {
        type: "text",
        size: "small",
        modelValue: data[field],
        "onUpdate:modelValue": (val) => {
          data[field] = val;
        },
        placeholder: "Nhập loại tiền lẻ",
        class: "w-full",
      }),
  },
  {
    field: "currencyEnglishName",
    header: "Tên tiếng anh",
    sortable: true,
    display: true,
    renderValue: (rowData) => h("span", rowData.currencyEnglishName),
    renderEdit: ({ data, field }) =>
      h(InputText, {
        type: "text",
        size: "small",
        modelValue: data[field],
        "onUpdate:modelValue": (val) => {
          data[field] = val;
        },
        placeholder: "Nhập tên tiếng anh",
        class: "w-full",
      }),
  },
  {
    field: "smallDenominationEnglish",
    header: "Loại tiền lẻ (tiếng anh)",
    sortable: true,
    display: true,
    renderValue: (rowData) => h("span", rowData.smallDenominationEnglish),
    renderEdit: ({ data, field }) =>
      h(InputText, {
        type: "text",
        size: "small",
        modelValue: data[field],
        "onUpdate:modelValue": (val) => {
          data[field] = val;
        },
        placeholder: "Nhập loại tiền tiếng anh",
        class: "w-full",
      }),
  },
  {
    field: "currencyRound",
    header: "Làm tròn",
    sortable: true,
    display: true,
    renderValue: (rowData) => {
      const valueMap = {
        NoRounding: "Không làm tròn",
        RoundDown: "Làm tròn xuống",
        RoundUp: "Làm tròn lên",
      };
      return h("span", valueMap[rowData.currencyRound] || "--");
    },
    renderEdit: ({ data, field }) =>
      h(Dropdown, {
        size: "small",
        options: [
          { code: "NoRounding", name: "Không làm tròn" },
          { code: "RoundUp", name: "Làm tròn lên" },
          { code: "RoundDown", name: "Làm tròn xuống" },
        ],
        modelValue: data[field],
        "onUpdate:modelValue": (val) => {
          data[field] = val;
        },
        optionValue: "code",
        optionLabel: "name",
        showClear: true,
      }),
  },
  {
    field: "currencyDecimal",
    header: "Số thật phân",
    sortable: true,
    display: true,
    renderValue: (rowData) => {
      const valueMap = {
        Default: "Mặc định",
        NoDecimal: "Không thập phân",
        OneDecimal: "1 chữ số",
        TwoDecimal: "2 chữ số",
        ThreeDecimal: "3 chữ số",
        FourDecimal: "4 chữ số",
        FiveDecimal: "5 chữ số",
        SixDecimal: "6 chữ số",
      };
      return h("span", valueMap[rowData.currencyDecimal] || "--");
    },
    renderEdit: ({ data, field }) =>
      h(Dropdown, {
        size: "small",
        options: [
          { code: "Default", name: "Mặc định" },
          { code: "NoDecimal", name: "Không thập phân" },
          { code: "OneDecimal", name: "1 chữ số" },
          { code: "TwoDecimal", name: "2 chữ số" },
          { code: "ThreeDecimal", name: "3 chữ số" },
          { code: "FourDecimal", name: "4 chữ số" },
          { code: "FiveDecimal", name: "5 chữ số" },
          { code: "SixDecimal", name: "6 chữ số" },
        ],
        modelValue: data[field],
        "onUpdate:modelValue": (val) => {
          data[field] = val;
        },
        optionValue: "code",
        optionLabel: "name",
        showClear: true,
      }),
  },
]);
const payload = ref([]);

onBeforeMount(() => {
  getAllData();
});

const addLine = () => {
  payload.value.push({
    currencyCode: "",
    currencyName: "",
    currencyInternaltionalCode: "",
    smallDenomination: "",
    currencyEnglishName: "",
    smallDenominationEnglish: "",
    currencyRound: "NoRounding",
    currencyDecimal: "Default",
  });
};
const onCellEditComplete = async (event) => {
  let { data, newValue, field } = event;
  data[field] = newValue;
  const id = await saveData(data);
  if (!!id) data.id = id;
};

const getAllData = async () => {
  try {
    loading.value = true;
    const res = await serviceCurrency.getAll();
    payload.value = res.data.result;
  } catch (error) {
  } finally {
    loading.value = false;
    selection.value = [];
  }
};

const saveData = async (data) => {
  try {
    const res = await serviceCurrency.save(data);
    // proxy.$notify("S", "Thao tác thành công!", toast);
    return res.data.id;
  } catch (error) {
    if (error.isValidate) {
      messages.value = error;
    } else {
      proxy.$notify("S", error?.response?.data?.Message || error, toast);
    }
  }
};

const DeleteItems = () => {
  DeleteModal.value = true;
};
</script>
