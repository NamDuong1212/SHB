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
        to: "/co-cau-to-chuc",
      },
      {
        label: "Quản lý collections",
        icon: "pi pi-fw pi-folder",
        to: "/danh-sach-collection",
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
            label: "Quản lý collections",
            to: "/collections",
          },
          {
            label: "Quản lý documents",
            to: "/files",
          },
          {
            label: "Quản lý FAQ",
            to: "/images",
          },
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
