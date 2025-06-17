<script setup>
import { useLayout } from '@/layout/composables/layout';
import AppMenu from './AppMenu.vue';
const { layoutState, setActiveMenuItem, toggleMenu } = useLayout();
</script>

<template>
    <div class="layout-sidebar" @mouseenter="toggleMenu(true)" :class="{ 'hovered': isHovered }">
        <app-menu></app-menu>
    </div>
</template>

<style lang="scss" scoped></style>
