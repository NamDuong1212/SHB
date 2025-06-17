<script setup>
import { ref, onBeforeMount, watch } from "vue";
// import API from "../api/api-main";
import http from "@/service/http";
import { cloneDeep } from "lodash";

const Privileges = ref([]);
const PrivilegesArr = ref([]);
const props = defineProps({
  Claims: {
    type: Array,
    required: true,
    default: [],
  },
});
const claim = defineModel("claim", {
  type: Array,
  default: [],
});

const dataRole = ref();

const setClaims = (claim) => {
  return {
    [claim.id]: {
      checked: claim.checked,
      partialChecked: claim.partialChecked,
    },
  };
};

const setRoleClaims = async () => {
  const dataClaims = cloneDeep(props.Claims);
  dataClaims.forEach((claim) => {
    dataRole.value = { ...dataRole.value, ...setClaims(claim) };
  });
};

onBeforeMount(async () => {
  await getPrivileges();
  await setRoleClaims();
  await nodeSelect();
});

const getPrivileges = async () => {
  const { data } = await http.get("Permission");
  Privileges.value = data;
  convertToTree(Privileges.value);
};

const convertToTree = (data) => {
  data.forEach((el) => {
    el.label = el.description;
    el.key = el.id;
    PrivilegesArr.value.push({
      id: el.id,
      code: el.key,
      name: el.description,
    });
    if (el.children?.length > 0) {
      convertToTree(el.children);
    }
  });
};
const nodeSelect = async () => {
  if (dataRole.value == undefined) return;
  const keys = Object.keys(dataRole.value);
  const data = [];
  keys.forEach((el) => {
    if (PrivilegesArr.value.find((e) => e.id == el)?.code) {
      data.push({
        id: el,
        checked: dataRole.value[el].checked,
        partialChecked: dataRole.value[el].partialChecked,
      });
    }
  });

  claim.value = data;
};

watch(
  () => props.Claims,
  () => {
    dataRole.value = null;
    setRoleClaims();
  }
);
</script>
<template>
  <div class="grid grid-cols-12 p-4 gap-5">
    <div class="col-span-4" v-for="(item, index) in Privileges" :key="index">
      <strong class="text-primary"> {{ item.moduleOrtherName }}</strong>
      <Tree
        :value="item.children"
        v-model:selectionKeys="dataRole"
        disabled
        selectionMode="checkbox"
        @node-select="nodeSelect"
        @node-unselect="nodeSelect"
        class="w-full md:w-30rem"
      >
      </Tree>
    </div>
  </div>
</template>
