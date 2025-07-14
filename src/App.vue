<script setup>
import { useLayout } from "@/layout/composables/layout";
import { updatePreset } from "@primeuix/themes";
import { onMounted } from "vue";

const { layoutConfig } = useLayout();

// Palette tùy chỉnh cho gradient từ xanh nhạt đến #0082ca
const gradientPalette = {
  50: "#e0f3ff",
  100: "#b3e0f9",
  200: "#80cdf3",
  300: "#4db9ed",
  400: "#26a8e5",
  500: "#0082ca", // màu chính
  600: "#006ca7",
  700: "#005785",
  800: "#004163",
  900: "#002c42",
};

updatePreset({
  semantic: {
    primary: gradientPalette,
    colorScheme: {
      light: {
        primary: {
          color: "linear-gradient(to right, #04c0f4, #28548c)",
          contrastColor: "#ffffff",
          hoverColor: "{primary.600}",
          activeColor: "{primary.700}",
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
          color: "linear-gradient(to right, #04c0f4, #28548c)",
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

</script>

<template>
  <router-view />
</template>

<style scoped></style>
