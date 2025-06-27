<template>
  <div class="fixed bottom-6 right-6 z-50 font-inter">
    <!-- Chat Button với design hiện đại -->
    <button v-if="!isOpen" @click="toggleChat"
      class="group relative bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-700 hover:from-blue-700 hover:via-blue-700 hover:to-blue-800 text-white rounded-full p-4 shadow-2xl w-16 transition-all duration-500 hover:scale-110 hover:rotate-3 focus:outline-none focus:ring-4 focus:ring-blue-500/30 backdrop-blur-sm"
      aria-label="Open AI Assistant">
      <!-- Animated background glow -->
      <div
        class="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-500 animate-pulse">
      </div>

      <!-- Icon với animation -->
      <div class="relative">
        <i class="pi pi-sparkles text-2xl transform transition-transform duration-300 group-hover:scale-110"></i>

        <!-- Notification dot -->
        <div class="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-ping">
        </div>
        <div class="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
      </div>
    </button>

    <!-- Chat Popup với glass effect -->
    <div v-if="isOpen" :class="[
      'backdrop-blur-xl bg-white/90 border border-white/20 rounded-2xl shadow-2xl transition-all duration-500 ease-out flex flex-col overflow-hidden',
      'before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none',
      isMinimized ? 'w-80 h-16' : 'w-[420px] h-[600px]',
      'animate-slideUp'
    ]">
      <!-- Header với gradient -->
      <div
        class="relative flex items-center justify-between p-5 bg-gradient-to-r from-slate-700 via-blue-800 to-blue-900 text-white">
        <!-- Background pattern -->
        <div class="absolute inset-0 bg-dot-pattern opacity-40"></div>

        <div class="relative flex items-center gap-3">
          <div
            class="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z">
              </path>
            </svg>
          </div>
          <div>
            <h3 class="font-bold text-lg text-white tracking-tight m-0">FOXAI BOT</h3>
            <p class="text-xs text-slate-300 font-medium">Powered by multiple FOXAI</p>
          </div>
        </div>

        <div class="relative flex gap-2">
          <button @click="toggleMinimize"
            class="group w-9 h-9 hover:bg-white/10 rounded-lg transition-all duration-200 flex items-center justify-center"
            :aria-label="isMinimized ? 'Maximize Chat' : 'Minimize Chat'">
            <i :class="isMinimized ? 'pi pi-window-maximize' : 'pi pi-window-minimize'"
              class="text-sm group-hover:scale-110 transition-transform"></i>
          </button>
          <button @click="closeChat"
            class="group w-9 h-9 hover:bg-red-500/20 rounded-lg transition-all duration-200 flex items-center justify-center"
            aria-label="Close Chat">
            <i class="pi pi-times text-sm group-hover:scale-110 transition-transform"></i>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div v-if="!isMinimized" class="flex flex-col flex-1 bg-gradient-to-br from-slate-50/50 to-blue-50/30">

      </div>
    </div>


  </div>
</template>

<script setup>
import { ref } from 'vue';
// State variables
const isOpen = ref(false);
const isMinimized = ref(false);

// Methods
const toggleChat = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    isMinimized.value = false;
  }
};

const closeChat = () => {
  isOpen.value = false;
  isMinimized.value = false;
};

const toggleMinimize = () => {
  isMinimized.value = !isMinimized.value;
};

const setIframeUrl = (url) => {
  iframeUrl.value = url;
};
</script>

<style scoped>
/* Custom animations */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-slideUp {
  animation: slideUp 0.5s ease-out;
}

/* Glass effect enhancement */
.backdrop-blur-xl {
  backdrop-filter: blur(16px);
}

/* Dot pattern background */
.bg-dot-pattern {
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.05) 2px, transparent 2px);
  background-size: 20px 20px;
}

/* Improved focus states */
button:focus-visible {
  outline: 2px solid rgba(59, 130, 246, 0.5);
  outline-offset: 2px;
}

/* Custom scrollbar cho iframe nếu cần */
iframe::-webkit-scrollbar {
  width: 6px;
}

iframe::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

iframe::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 3px;
}

iframe::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.5);
}
</style>
