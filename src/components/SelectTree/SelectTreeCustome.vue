<template>
  <TreeSelect
    v-model="valueTree"
    :options="dataOrg"
    @node-select="changeTree($event)"
    @node-unselect="changeTree($event, false)"
    :optionLabel="optionLabel"
    :optionValue="optionValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :invalid="invalid"
    size="small"
  />
</template>
<script setup>
import { ref, onBeforeMount } from "vue";
import http from "@/service/http";

const dataOrg = ref([]);
const props = defineProps({
  label: String,
  error: String,
  errorMessage: String,
  url: String,
  optionLabel: String,
  optionValue: String,
  disabled: Boolean,
  placeholder: String,
  invalid: Boolean,
});
const valueTree = ref();

const modelValue = defineModel();

const emits = defineEmits(["change"]);

onBeforeMount(async () => {
  await getAllOrg();
  if (modelValue.value?.id) {
    valueTree.value = { [modelValue.value.id]: true };
  } else {
    if (!!modelValue.value) {
      valueTree.value = { [modelValue.value]: true };
      console.log({ [modelValue.value]: true });
    }
  }
});

const getAllOrg = async () => {
  try {
    const res = await http.get(props.url);
    dataOrg.value = res.data;
    convertDataToTreeSelect(dataOrg.value);
  } catch (error) {}
};

const changeTree = (e, select = true) => {
  if (select) {
    modelValue.value = !!props.optionValue ? e[props.optionValue] : e;
    emits("change", e);
  } else {
    modelValue.value = null;
  }
};

const convertDataToTreeSelect = (data) => {
  data.forEach((e) => {
    e.label = e[props.optionLabel];
    e.key = e.id;
    e.value = e.id;
    if (e.children && Array.isArray(e.children)) {
      convertDataToTreeSelect(e.children);
    }
  });
};
</script>
