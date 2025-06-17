<script setup>
import { useLayout } from "@/layout/composables/layout";
import { ref } from "vue";
import { useRouter } from "vue-router";
import AppConfigurator from "./AppConfigurator.vue";

const { toggleMenu, toggleDarkMode, isDarkTheme } = useLayout();

const router = useRouter()
const items = ref([
  {
    label: 'Đăng xuất', icon: 'pi pi-sign-out', command: () => {
      funSignOut()
    }
  },

]);
const menu = ref();
const toggle = (event) => {
  menu.value.toggle(event);
};
const funSignOut = async () => {
  localStorage.removeItem('auth_token')
  router.push('/auth/login')
};
</script>

<template>
  <div class="layout-topbar bg-gradient-to-r from-blue-600 to-indigo-700">
    <div class="layout-topbar-logo-container">
      <router-link to="/" class="layout-topbar-logo">
        <div class="flex items-center gap-2 w-full">
          <img class="w-28 h-auto" src="https://fox.ai.vn/wp-content/uploads/2016/08/logowhite-1536x645.png" alt="" />
        </div>
      </router-link>
    </div>

    <div class="layout-topbar-actions">
      <div class="layout-config-menu">
        <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
          <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
        </button>
        <div class="relative">
          <button v-styleclass="{
            selector: '@next',
            enterFromClass: 'hidden',
            enterActiveClass: 'animate-scalein',
            leaveToClass: 'hidden',
            leaveActiveClass: 'animate-fadeout',
            hideOnOutsideClick: true,
          }" type="button" class="layout-topbar-action">
            <i class="pi pi-palette"></i>
          </button>
          <AppConfigurator />
        </div>
      </div>

      <button class="layout-topbar-menu-button layout-topbar-action layout-topbar-action-highlight" v-styleclass="{
        selector: '@next',
        enterFromClass: 'hidden',
        enterActiveClass: 'animate-scalein',
        leaveToClass: 'hidden',
        leaveActiveClass: 'animate-fadeout',
        hideOnOutsideClick: true,
      }">
        <i class="pi pi-ellipsis-v"></i>
      </button>

      <div class="layout-topbar-menu hidden lg:block">
        <div class="layout-topbar-menu-content">
          <button type="button" class="layout-topbar-action">
            <i class="pi pi-calendar"></i>
            <span>Calendar</span>
          </button>
          <button type="button" class="layout-topbar-action">
            <i class="pi pi-inbox"></i>
            <span>Messages</span>
          </button>
          <button @click="toggle" type="button" aria-haspopup="true" aria-controls="overlay_menu"
            class="layout-topbar-action">
            <i class="pi pi-user"></i>
            <span>Profile</span>
          </button>
          <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
        </div>
      </div>
    </div>
  </div>

</template>
