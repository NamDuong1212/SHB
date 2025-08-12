<template>
  <div class="flex gap-4 w-full items-start">
    <div
      class="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-amber-200 flex-shrink-0 flex items-center justify-center shadow-md">
      <svg stroke="white" fill="white" stroke-width="0" viewBox="0 0 24 24" height="18" width="18"
        xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z">
        </path>
      </svg>
    </div>
    <div class="bg-white rounded-2xl rounded-tl-none px-6 py-4 shadow-md border border-gray-100 max-w-[350px]">
      <div class="skeleton-loading">
        <div class="skeleton-line skeleton-line-1"></div>
        <div class="skeleton-line skeleton-line-2"></div>
        <div class="skeleton-line skeleton-line-3"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No script needed
</script>

<style scoped>
.skeleton-loading {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 24px;
  min-width: 200px;
}

.skeleton-line {
  height: 12px;
  border-radius: 6px;
  background: linear-gradient(90deg, #f0f4f9 25%, #e6eef7 50%, #f0f4f9 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

.skeleton-line-1 {
  width: 100%;
}

.skeleton-line-2 {
  width: 75%;
}

.skeleton-line-3 {
  width: 50%;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}
</style>