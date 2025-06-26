<template>
  <div
    class="col-span-2 bg-gradient-to-br h-[50vh] from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
    <!-- Header -->
    <div class="bg-gradient-to-r from-blue-600 to-indigo-700 p-4">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 class="text-lg m-0 font-semibold text-white">Lịch sử trò chuyện</h3>
      </div>
    </div>

    <!-- Content -->
    <ScrollPanel style="width: 100%; height: 440px" class="p-4">
      <!-- Loading State -->
      <div v-if="loading" class="space-y-4">
        <div v-for="i in 3" :key="i" class="animate-pulse">
          <div class="bg-gray-200 dark:bg-gray-700 rounded-xl p-4">
            <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
            <div class="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
          </div>
        </div>
      </div>

      <!-- Chat History -->
      <div v-else-if="false" class="space-y-3  overflow-y-auto custom-scrollbar">
        <div v-for="(item, index) in HistoryChat" :key="index"
          class="group bg-white dark:bg-gray-800 rounded-xl p-2 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-600 transition-all duration-300 cursor-pointer"
          @click="selectChat(item)">
          <div class="flex items-start gap-3">
            <!-- Avatar -->
            <div
              class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <p
                class="text-gray-800 dark:text-gray-200 text-sm font-medium line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {{ item.user_question }}
              </p>

              <!-- Metadata -->
              <div class="flex items-center gap-4 mt-2">
                <span class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ formatTime(item.created_at || new Date()) }}
                </span>

                <span v-if="item.response_count"
                  class="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-2 py-1 rounded-full">
                  {{ item.response_count }} phản hồi
                </span>
              </div>
            </div>

            <!-- Action Button -->
            <div class="opacity-0 group-hover:opacity-100 transition-opacity">
              <button class="w-6 h-6 text-gray-400 hover:text-blue-500 transition-colors">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <!-- <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Chưa có lịch sử trò chuyện</h3> -->
        <p class="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto">
          <!-- Hãy bắt đầu cuộc trò chuyện đầu tiên của bạn. Tất cả các cuộc hội thoại sẽ được lưu lại ở đây. -->
          Tính năng đang được phát triển
        </p>
        <button
          class="mt-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all text-sm font-medium">
          Bắt đầu trò chuyện
        </button>
      </div>

    </ScrollPanel>
  </div>
</template>

<script setup>
import http from '@/service/http';
import { useAuthStore } from '@/stores/useAuth';
import { onMounted, ref } from 'vue';

const store = useAuthStore()
const HistoryChat = ref([])
const loading = ref(false)

onMounted(() => {
  fetchChatHistory()
})

const fetchChatHistory = async () => {
  loading.value = true
  try {
    const res = await http.get(`/fastapi/history/?user_id=${store.getUser}&limit=20`)
    HistoryChat.value = res.data.history
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false
  }
}

const selectChat = (item) => {
  // Emit hoặc handle việc chọn chat
  console.log('Selected chat:', item);
}

const formatTime = (dateString) => {
  if (!dateString) return 'Vừa xong'

  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)

  if (diffInSeconds < 60) return 'Vừa xong'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} ngày trước`

  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}



.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

@media (prefers-color-scheme: dark) {
  .custom-scrollbar {
    scrollbar-color: #4b5563 transparent;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #4b5563;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #6b7280;
  }
}
</style>