<template>
  <div class="flex gap-4 items-start">
    <div
      class="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex-shrink-0 flex items-center justify-center shadow-md">
      <svg stroke="white" fill="white" stroke-width="0" viewBox="0 0 24 24" height="18" width="18"
        xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z">
        </path>
      </svg>
    </div>
    <div class="bg-white rounded-2xl rounded-tl-none px-6 py-4 shadow-md border border-gray-100">
      <div class="chat-bubble-loading">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </div>
</template>

<script setup>
// No script needed
</script>

<style scoped>
.chat-bubble-loading {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 24px;
  min-width: 60px;
}

.chat-bubble-loading span {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #3b82f6;
  opacity: 0.6;
  animation: bubble-typing 1.4s infinite ease-in-out both;
}

.chat-bubble-loading span:nth-child(1) {
  animation-delay: 0s;
}

.chat-bubble-loading span:nth-child(2) {
  animation-delay: 0.2s;
}

.chat-bubble-loading span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes bubble-typing {

  0%,
  100% {
    transform: translateY(0);
    opacity: 0.6;
  }

  50% {
    transform: translateY(-6px);
    opacity: 1;
  }
}
</style>