<script setup>
import { ref } from "vue";

import AppMenuItem from "./AppMenuItem.vue";

const model = ref([
  {
    items: [
      {
        label: "Trang chủ",
        icon: "pi pi-fw pi-home",
        to: "/",
      },
      {
        label: "Chatbot",
        icon: "pi pi-fw pi-comments",
        to: "/chat",
      },

      // {
      //   label: "Tài liệu",
      //   icon: "pi pi-fw pi-file",
      //   to: "/files",
      // },
      // {
      //   label: "Collections",
      //   icon: "pi pi-fw pi-database",
      //   to: "/collections",
      // },

      {
        label: "Cơ cấu tổ chức",
        icon: "pi pi-fw pi-users",
        items: [
          {
            label: "Cơ cấu tổ chức",
            to: "/co-cau-to-chuc",
          },
          {
            label: "Cấp tổ chức",
            to: "/danh-muc-cap-to-chuc",
          },
        ],
      },
      {
        label: "Thiết lập hệ thống",
        icon: "pi pi-sliders-h",
        items: [
          {
            label: "Quản lý Người dùng",
            to: "/users",
          },
          {
            label: "Quản lý vai trò",
            to: "/danh-muc-vai-tro",
          },
          {
            label: "Quản lý collection",
            to: "/collections",
          },
          {
            label: "Quản lý FAQ",
            to: "/images",
          },
          {
            label: "Quản lý kịch bản",
            to: "/script-manage"
          }
        ],
      },
    ],
  },
]);
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in model" :key="item">
      <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
      <li v-if="item.separator" class="menu-separator"></li>
    </template>
  </ul>
</template>

<style lang="scss" scoped></style>
