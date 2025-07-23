<template>
  <div class="min-h-screen p-6 bg-background text-foreground">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold">Upload check</h1>
      <p class="text-gray-500 dark:text-gray-400">
        Test
      </p>
    </div>

    <!-- Upload File Cards -->
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="file in files" :key="file.id"
        class="bg-card border border-border rounded-xl p-4 shadow-lg transition-all hover:border-blue-400">
        <!-- File Info -->
        <div class="flex justify-between items-center mb-2 shadow-sm">
          <div class="truncate font-semibold">{{ file.name }}</div>
          <div class="text-sm text-gray-400">
            <span v-if="file.progress < 100"><i class="pi pi-refresh animate-spin text-blue-500"></i>
            </span>
            <span v-else><i class="pi pi-check text-green-500"></i></span>
            {{ file.progress }}%
          </div>
        </div>
        <ProgressBar :value="file.progress" :showValue="false" />
        <p class="text-sm mt-2 text-gray-400 italic">
          {{ file.progress === 100 ? 'Hoàn tất' : 'Đang tải lên...' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const files = ref([
  { id: 1, name: 'Tài liệu 1.pdf', progress: 0 },
  { id: 2, name: 'Video.mp4', progress: 0 },
  { id: 3, name: 'Ảnh.jpg', progress: 0 },
  { id: 4, name: 'Báo cáo.docx', progress: 0 },
  { id: 5, name: 'Bảng tính.xlsx', progress: 0 },
  { id: 6, name: 'Thuyết trình.pptx', progress: 0 },
  { id: 7, name: 'Tài liệu hướng dẫn.pdf', progress: 0 },
  { id: 8, name: 'Hình ảnh sản phẩm.png', progress: 0 },
]);

onMounted(() => {
  const interval = setInterval(() => {
    let allDone = true;
    files.value = files.value.map(file => {
      if (file.progress < 100) {
        allDone = false;
        return {
          ...file,
          progress: Math.min(file.progress + Math.floor(Math.random() * 10) + 5, 100),
        };
      }
      return file;
    });

    if (allDone) clearInterval(interval);
  }, 1000);
});
</script>

<style scoped>
:deep(.p-progressbar) {
  height: 0.75rem;
  background-color: var(--surface-ground);
  border-radius: 9999px;
}

:deep(.p-progressbar-value) {
  border-radius: 9999px;
  transition: width 0.4s ease-in-out;
}
</style>
