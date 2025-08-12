<script setup>
import { useLayout } from "@/layout/composables/layout";
import { updatePreset } from "@primeuix/themes";
import { onMounted } from "vue";
import GlobalDocumentForm from '@/components/GlobalDocumentForm.vue';

const { layoutConfig } = useLayout();

onMounted(() => {
  // Đặt data-primary cho body
  document.body.setAttribute('data-primary', layoutConfig.primary);

  // Palette cho gradient từ amber-500 đến orange-600
  const gradientPalette = {
    50: "#fffbeb",  // amber-50
    100: "#fef3c7", // amber-100
    200: "#fde68a", // amber-200
    300: "#fcd34d", // amber-300
    400: "#fbbf24", // amber-400
    500: "#f59e0b", // amber-500
    600: "#ea580c", // orange-600
    700: "#c2410c", // orange-700
    800: "#9a3412", // orange-800
    900: "#78350f", // orange-900
    950: "#451a03", // amber-950
  };

  // Cập nhật preset với màu gradient
  updatePreset({
    semantic: {
      primary: gradientPalette,
      colorScheme: {
        light: {
          primary: {
            color: "linear-gradient(to right, #f59e0b, #ea580c)", // gradient từ amber-500 đến orange-600
            contrastColor: "#ffffff",
            hoverColor: "{primary.700}",
            activeColor: "{primary.800}",
          },
          highlight: {
            background: "{primary.50}",
            focusBackground: "{primary.100}",
            color: "{primary.700}",
            focusColor: "{primary.800}",
          },
        },
        dark: {
          primary: {
            color: "linear-gradient(to right, #f59e0b, #ea580c)", // gradient từ amber-500 đến orange-600
            contrastColor: "{surface.900}",
            hoverColor: "{primary.300}",
            activeColor: "{primary.200}",
          },
          highlight: {
            background: "color-mix(in srgb, {primary.400}, transparent 84%)",
            focusBackground: "color-mix(in srgb, {primary.400}, transparent 76%)",
            color: "rgba(255,255,255,.87)",
            focusColor: "rgba(255,255,255,.87)",
          },
        },
      },
    },
  });
});
</script>

<template>
  <router-view />
  <GlobalDocumentForm />
</template>

<style scoped></style>
