<script setup>
import RecentSalesWidget from '@/components/dashboard/RecentSalesWidget.vue';
import RevenueStreamWidget from '@/components/dashboard/RevenueStreamWidget.vue';
</script>

<template>
    <div class="grid grid-cols-12 gap-8 overflow-auto">
        <div class="col-span-12 xl:col-span-12">
            <RevenueStreamWidget />
            <RecentSalesWidget />
        </div>
    </div>
</template>
