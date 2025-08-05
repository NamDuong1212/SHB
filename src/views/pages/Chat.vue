<template>
  <Toast />

  <div class="grid bg-gradient-to-br gap-2 lg:gap-4 min-w-0 overflow-hidden">
    <div class="chat-container col-span-12 lg:col-span-10 relative flex flex-col h-screen min-w-0">
      <!-- Header -->
      <div
        class="chat-header rounded-xl p-3 md:p-4 mx-2 md:mx-0 col-span-2 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden max-w-full min-w-0">
        <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 max-w-6xl mx-auto min-w-0">
          <div class="flex items-center gap-3">
            <div
              class="w-12 h-12 rounded-full bg-gradient-to-r from-[#28548c] to-[#04c0f4] flex items-center justify-center shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z">
                </path>
              </svg>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h2 class="font-bold text-lg lg:text-2xl mb-0">FOXAI BOT</h2>
              </div>
              <p class="text-sm">Trợ lý thông minh của bạn</p>
            </div>
          </div>
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto min-w-0">
            <div class="relative flex-1 sm:flex-none min-w-[280px] collection-selector min-w-0">
              <div class="flex items-center gap-2 p-2 rounded-xl min-w-0">
                <i class="text-blue-500 text-sm"></i>
                <span class="text-sm font-medium">Collection:</span>
                <div class="flex-1 min-w-0 max-w-full overflow-hidden">
                  <Select v-model="selectedCollection" :options="Collections" optionLabel="collection_name"
                    optionValue="collection_name" placeholder="Chọn collection..." @change="onCollectionChange"
                    class="w-full custom-select min-w-0 max-w-full" :pt="{
                      root: {
                        class: 'bg-transparent border-none outline-none'
                      },
                      input: {
                        class: 'text-sm font-medium bg-transparent p-0 border-none outline-none'
                      },
                      trigger: {
                        class: 'text-blue-500 hover:text-blue-700'
                      }
                    }">
                    <template #value="slotProps">
                      <div v-if="slotProps.value" class="flex items-center gap-2">
                        <i class="pi pi-folder text-blue-500 text-sm"></i>
                        <span class="text-sm font-medium ">{{ slotProps.value }}</span>
                      </div>
                      <span v-else class="text-sm text-gray-500">Chọn collection...</span>
                    </template>
                    <template #option="slotProps">
                      <div class="flex items-center gap-2 p-2">
                        <i class="pi pi-folder text-blue-500 text-sm"></i>
                        <span class="text-sm">{{ slotProps.option.collection_name }}</span>
                      </div>
                    </template>
                  </Select>
                </div>
              </div>
            </div>

            <div class="flex gap-2 justify-end sm:justify-start">
              <Button icon="pi pi-trash" size="small" severity="danger" text rounded @click="showDeleteDialog"
                v-tooltip.top="'Xóa cuộc trò chuyện'" class="flex-shrink-0" />
            </div>
          </div>
        </div>
      </div>

      <div class="flex-1 relative p-2 md:p-4 lg:p-6 overflow-hidden">
        <div v-if="!selectedCollection" class="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div class="flex items-center gap-2">
            <i class="pi pi-exclamation-triangle text-yellow-500"></i>
            <span class="text-sm text-yellow-700">Vui lòng chọn một collection để bắt đầu trò chuyện</span>
          </div>
        </div>

        <div v-if="selectedCollection" class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div class="flex items-center gap-2">
            <i class="pi pi-check-circle text-blue-500"></i>
            <span class="text-sm font-medium text-blue-700">Đang sử dụng collection:</span>
            <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {{ selectedCollection }}
            </span>
          </div>
        </div>
        <!-- Messages -->
        <ScrollPanel style="height: calc(100vh - 180px); width: 100%; " :dt="{
          bar: {
            background: ''
          }
        }" class="max-w-6xl mx-auto min-w-0 overflow-hidden" ref="scrollPanel">
          <!-- Messages -->
          <div class="space-y-4 md:space-y-6 px-1 md:px-2 mb-60 lg:mb-40 min-w-0 overflow-hidden">
            <div v-for="(chat, index) in messages" :key="index">
              <!-- AI Message -->
              <div class="flex gap-2 md:gap-4 mb-4 md:mb-6 items-start" v-if="chat.role == 'assistant'">
                <div
                  class="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-[#28548c] to-[#04c0f4] flex-shrink-0 flex items-center justify-center shadow-md">
                  <svg stroke="white" fill="white" stroke-width="0" viewBox="0 0 24 24" height="14" width="14"
                    class="md:w-[18px] md:h-[18px]" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z">
                    </path>
                  </svg>
                </div>
                <div class="flex-1">
                  <div
                    class="rounded-2xl rounded-tl-none px-3 md:px-6 py-3 md:py-4 shadow-md border border-gray-100 max-w-[90%] md:max-w-[85%] col-span-2 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden min-w-0">
                    <div v-html="chat.content"
                      class="markdown-content text-sm md:text-md leading-relaxed break-words overflow-wrap-break-word">
                    </div>
                  </div>
                  <div class="p-4">
                    <div class="text-xs mt-1 ml-2" v-if="chat.timestamp">
                      {{ new Date(chat.timestamp).toLocaleString('vi-VN') }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex gap-2 md:gap-4 mb-4 md:mb-6 items-start justify-end min-w-0" v-if="chat.role == 'user'">
                <div class="flex-1 flex flex-col items-end min-w-0">
                  <div
                    class="bg-gradient-to-r from-[#28548c] to-[#04c0f4] text-white rounded-2xl rounded-tr-none px-3 md:px-6 py-3 md:py-4 shadow-md max-w-[90%] md:max-w-[85%] min-w-0">
                    <p class="text-sm md:text-md break-words overflow-wrap-break-word">{{ chat.content }}</p>
                  </div>
                  <div class="p-4">
                    <div class="text-xs mt-1 mr-2" v-if="chat.timestamp">
                      {{ new Date(chat.timestamp).toLocaleString('vi-VN') }}
                    </div>
                  </div>
                </div>
                <div
                  class="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center shadow-md">
                  <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="14"
                    width="14" class="md:w-[18px] md:h-[18px]" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z">
                    </path>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Loading Indicator -->
            <div class="flex justify-center py-4" v-if="loading">
              <SkeletonLoading></SkeletonLoading>
            </div>
          </div>
        </ScrollPanel>
      </div>


      <!-- Input Area -->
      <div class="chat-input fixed bottom-0 left-0 right-0 p-3 md:p-4 lg:p-5 z-40 max-w-full min-w-0 overflow-hidden">
        <form class="flex items-center gap-2 md:gap-3 w-full max-w-4xl mx-auto min-w-0" @submit="submitChat">
          <div class="relative flex-1 min-w-0">
            <input
              class="w-full shadow-xl pl-4 md:pl-5 pr-4 md:pr-5 py-3 md:py-4 rounded-full border border-gray-200 col-span-2 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden min-w-0"
              placeholder="Nhập câu hỏi..." v-model="user_question" @keydown="handleKeyDown"
              :disabled="!selectedCollection" />
          </div>
          <button type="submit"
            class="p-3 shadow-xl md:p-4 w-12 md:w-14 h-12 md:h-14 rounded-full bg-gradient-to-r from-[#28548c] to-[#04c0f4] hover:from-[#28548c] hover:to-[#04c0f4] text-white shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center flex-shrink-0"
            :disabled="!user_question.length || !selectedCollection || isStreaming"
            :class="{ 'opacity-50': !user_question.length || !selectedCollection || isStreaming }">
            <i class="pi pi-send text-sm md:text-lg"></i>
          </button>
        </form>
        <p class="text-center text-xs font-italic px-2 mt-2">
          <span class="hidden md:inline">Thông tin được tạo ra bằng AI. Hãy luôn cẩn trọng và sử dụng thông tin AI một
            cách có
            trách nhiệm.</span>
          <span class="md:hidden">Thông tin AI - Sử dụng có trách nhiệm</span>
        </p>

      </div>

    </div>
  </div>

  <!-- Dialog xác nhận xóa -->
  <Dialog v-model:visible="showDeleteConfirmDialog" modal :style="{ width: '30rem' }" :closable="false">
    <template #header>
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
          <i class="pi pi-exclamation-triangle text-red-500 text-xl"></i>
        </div>
        <span class="text-xl font-semibold">Xác nhận xóa</span>
      </div>
    </template>
    <div class="flex flex-col gap-4">
      <p class="text-gray-600">
        Bạn có chắc chắn muốn xóa <span class="font-semibold">cuộc trò chuyện này</span>?
      </p>
      <p class="text-sm text-gray-500">
        Hành động này không thể hoàn tác. Tất cả tin nhắn sẽ bị xóa vĩnh viễn khỏi hệ thống.
      </p>
    </div>
    <template #footer>
      <div class="flex justify-end gap-2">
        <Button type="button" size="small" label="Hủy" severity="secondary" @click="showDeleteConfirmDialog = false"
          text></Button>
        <Button type="button" size="small" label="Xóa" icon="pi pi-trash" severity="danger"
          @click="confirmDelete"></Button>
      </div>
    </template>
  </Dialog>

</template>

<script setup>
import SkeletonLoading from "@/components/SkeletonLoading.vue";
import CollectionService from "@/service/CollectionService";
import http from "@/service/http";
import { useAuthStore } from '@/stores/useAuth';
import { marked } from 'marked';
import { useToast } from "primevue";
import { nextTick, onBeforeMount, onBeforeUnmount, onMounted, ref, watch } from "vue";
// Cache constants
const CACHE_KEY = 'selected_collection_cache';
const CACHE_DURATION = 10 * 60 * 1000; // 10 phút tính bằng milliseconds

// Utility for localStorage cache
const cacheUtils = {
  setCache(value) {
    const cache = {
      value,
      timestamp: Date.now()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  },

  getCache() {
    const cache = localStorage.getItem(CACHE_KEY);
    if (!cache) return null;

    const { value, timestamp } = JSON.parse(cache);
    const now = Date.now();

    if (now - timestamp > CACHE_DURATION) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return value;
  },

  clearCache() {
    localStorage.removeItem(CACHE_KEY);
  }
};

// PrimeVue Toast
const toast = useToast();

// Reactive State Variables
const isStreaming = ref(false);
const scrollPanel = ref(null);
const loading = ref(false);
const selectedCollection = ref('');
const Collections = ref([]);
const messages = ref([]);
const user_question = ref("");
const showDeleteConfirmDialog = ref(false);

// Carousel responsive options (if CardBox is re-enabled)
const carouselResponsiveOptions = ref([
  { breakpoint: '1400px', numVisible: 3, numScroll: 1 },
  { breakpoint: '1199px', numVisible: 2, numScroll: 1 },
  { breakpoint: '767px', numVisible: 1, numScroll: 1 }
]);

// Watchers
watch(selectedCollection, (newValue) => {
  if (newValue) {
    cacheUtils.setCache(newValue);
    console.log('Collection changed and cached:', newValue);
  } else {
    cacheUtils.clearCache();
    console.log('Selected collection cleared, cache cleared.');
  }
});

onBeforeMount(() => {
  fetchCollections();
  fetchChatHistory();
});

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown);
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeyDown);
});

// Methods
const handleImageError = (event) => {
  event.target.src = '/path/to/fallback-image.png'; // Fallback image for carousel
};

function scrollToBottom() {
  nextTick(() => {
    if (scrollPanel.value) {
      const scrollableContent = scrollPanel.value.$el.querySelector('.p-scrollpanel-content');
      if (scrollableContent) {
        scrollableContent.scrollTop = scrollableContent.scrollHeight;
      }
    }
  });
}

const sendChatMessage = async (messageContent) => {
  if (!selectedCollection.value || isStreaming.value) {
    toast.add({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng đợi câu trả lời hiện tại hoàn thành hoặc chọn một Collection.', life: 3000 });
    return;
  }

  loading.value = true;
  isStreaming.value = true;
  user_question.value = "";

  messages.value.push({
    role: "user",
    content: messageContent,
    timestamp: new Date().toISOString()
  });

  const assistantMessagePlaceholder = {
    role: "assistant",
    content: "",
    timestamp: new Date().toISOString()
  };
  messages.value.push(assistantMessagePlaceholder);
  const assistantMessageIndex = messages.value.length - 1;

  scrollToBottom();

  const authStore = useAuthStore();
  const token = authStore.getToken;
  console.log("Token for chat API:", token);
  const apiUrl = import.meta.env.VITE_APP_API + "v1/agents/chat/stream";

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'text/event-stream'
      },
      body: JSON.stringify({
        message: messageContent,
        collection_name: selectedCollection.value
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Lỗi server: ${response.status}`);
    }

    loading.value = false;

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulatedRawContent = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data:')) {
          const jsonString = line.substring(5).trim();
          if (jsonString) {
            try {
              const parsedData = JSON.parse(jsonString);

              if (parsedData.type === 'message_chunk' && parsedData.content) {

                accumulatedRawContent += parsedData.content;

                messages.value[assistantMessageIndex].content = marked.parse(accumulatedRawContent);

                scrollToBottom();
              }

              if (parsedData.type === 'message_complete') {
                console.log('Streaming completed.', parsedData);
              }

            } catch (e) {
              console.error('Error parsing stream data chunk:', jsonString, e);
            }
          }
        }
      }
    }

  } catch (error) {
    console.error("Chat API Error:", error);
    loading.value = false;
    const errorMessage = "❌ Đã xảy ra lỗi khi gửi yêu cầu. Vui lòng thử lại. " + error.message;
    messages.value[assistantMessageIndex].content = marked.parse(errorMessage);
    toast.add({ severity: 'error', summary: 'Lỗi Chatbot', detail: error.message || 'Không thể gửi yêu cầu đến Chatbot.', life: 3000 });
  } finally {
    isStreaming.value = false;
    messages.value[assistantMessageIndex].timestamp = new Date().toISOString();
    scrollToBottom();
  }
};

const submitChat = async (e) => {
  e.preventDefault();
  if (!user_question.value.trim()) return;

  const question = user_question.value;
  await sendChatMessage(question);
};

const fetchCollections = async () => {
  try {
    const cachedCollection = cacheUtils.getCache();
    const response = await CollectionService.getAllForDropdown();
    Collections.value = response.data.info.data.collections;

    if (cachedCollection && Collections.value.some(c => c.collection_name === cachedCollection)) {
      selectedCollection.value = cachedCollection;
    } else if (Collections.value.length > 0) {
      selectedCollection.value = Collections.value[0].collection_name;
    }
  } catch (error) {
    console.error("Không thể tải collections:", error);
    toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải danh sách collection. Vui lòng thử lại.', life: 3000 });
    cacheUtils.clearCache(); // Clear cache if collection loading fails
  }
};

const onCollectionChange = () => {
  // Watcher will handle caching, this function can be used for other side effects if needed.
  console.log('Collection changed to:', selectedCollection.value);
};

const fetchChatHistory = async () => {
  loading.value = true;
  try {
    const res = await http.get(`v1/messages`);
    const historyMessages = res.data.messages || [];

    // 1. Map và xử lý dữ liệu như cũ
    const mappedMessages = historyMessages.map(el => ({
      ...el,
      content: el.role === 'assistant' ? marked.parse(el.content) : el.content,
      timestamp: el.timestamp || new Date().toISOString()
    }));

    mappedMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    messages.value = mappedMessages;

    console.log('Chat history loaded and sorted:', messages.value);

  } catch (error) {
    console.error('Error fetching chat history:', error);
    toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải lịch sử chat.', life: 3000 });
  } finally {
    loading.value = false;
    scrollToBottom();
  }
};

const showDeleteDialog = () => {
  showDeleteConfirmDialog.value = true;
};

const confirmDelete = async () => {
  showDeleteConfirmDialog.value = false;
  messages.value = []; // Clear UI immediately
  try {
    await http.delete(`/history/`);
    toast.add({ severity: 'success', summary: 'Thành công', detail: 'Xóa cuộc trò chuyện thành công!', life: 3000 });
  } catch (error) {
    console.error('Error clearing chat history:', error);
    toast.add({ severity: 'error', summary: 'Lỗi', detail: error.response?.data?.message || 'Không thể xóa lịch sử chat.', life: 3000 });
  }
};

const handleKeyDown = (event) => {
  // Handle any global key events if needed
};
</script>

<style scoped>
/* Markdown content styling */
.markdown-content {
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: break-word;
  max-width: 100%;
  overflow-x: hidden;
}

.markdown-content :deep(p) {
  margin-bottom: 1rem;
  line-height: 1.6;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.markdown-content :deep(ul) {
  list-style-type: disc;
  padding-left: 1.75rem;
  margin-bottom: 1rem;
}

.markdown-content :deep(ol) {
  list-style-type: decimal;
  padding-left: 1.75rem;
  margin-bottom: 1rem;
}

.markdown-content :deep(li) {
  margin-bottom: 0.5rem;
}

.markdown-content :deep(ul ul),
.markdown-content :deep(ol ol),
.markdown-content :deep(ul ol),
.markdown-content :deep(ol ul) {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.markdown-content :deep(pre) {
  background-color: #f3f4f6;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin-bottom: 1rem;
}

.markdown-content :deep(code) {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  background-color: #f3f4f6;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
}

.markdown-content :deep(a) {
  color: #3b82f6;
  text-decoration: underline;
  transition: color 0.2s;
}

.markdown-content :deep(a:hover) {
  color: #2563eb;
}

.markdown-content :deep(hr) {
  border: 0;
  border-top: 1px solid #e5e7eb;
  margin: 1.5rem 0;
}

.markdown-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.markdown-content :deep(thead) {
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
}

.markdown-content :deep(th) {
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #d1d5db;
  border-right: 1px solid #d1d5db;
}

.markdown-content :deep(th:last-child) {
  border-right: none;
}

.markdown-content :deep(td) {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  border-right: 1px solid #e5e7eb;
  vertical-align: top;
}

.markdown-content :deep(td:last-child) {
  border-right: none;
}

.markdown-content :deep(tbody tr:hover) {
  background-color: #f9fafb;
}

.markdown-content :deep(tbody tr:last-child td) {
  border-bottom: none;
}

/* Responsive table styling */
@media (max-width: 768px) {
  .markdown-content :deep(table) {
    font-size: 0.875rem;
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }

  .markdown-content :deep(th),
  .markdown-content :deep(td) {
    padding: 0.5rem 0.75rem;
    min-width: 120px;
  }
}

@media (max-width: 480px) {
  .markdown-content :deep(table) {
    font-size: 0.8125rem;
  }

  .markdown-content :deep(th),
  .markdown-content :deep(td) {
    padding: 0.375rem 0.5rem;
    min-width: 100px;
  }
}

/* Custom Carousel Styling (if re-enabled) */
/*
.custom-carousel :deep(.p-carousel-indicators) {
  margin-top: 0.75rem;
}

.custom-carousel :deep(.p-carousel-indicator button) {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s;
}

.custom-carousel :deep(.p-carousel-indicator.p-highlight button) {
  background: #3b82f6;
  transform: scale(1.2);
}

.custom-carousel :deep(.p-carousel-prev),
.custom-carousel :deep(.p-carousel-next) {
  background: white;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  transition: all 0.2s ease;
}

.custom-carousel :deep(.p-carousel-prev:hover),
.custom-carousel :deep(.p-carousel-next:hover) {
  background: #3b82f6;
  color: white;
}
*/

/* General gradient background */
.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

/* Custom styling for Collection Selector (PrimeVue Select component) */
.collection-selector :deep(.p-dropdown) {
  border-radius: 0.75rem;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 0.5rem;
  /* Adjust padding for visual alignment */
}

.collection-selector :deep(.p-dropdown:hover) {
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
}

.collection-selector :deep(.p-dropdown-label) {
  font-weight: 500;
  padding: 0;
  border: none;
  background: transparent;
}

.collection-selector :deep(.p-dropdown-trigger) {
  width: 2rem;
  /* Ensure trigger icon is not too wide */
}

/* Viewport constraints - Ensure no overflow */
.chat-container {
  max-width: 100vw;
  min-width: 0;
  overflow-x: hidden;
  position: relative;
  width: 100%;
  box-sizing: border-box;
}

/* Ensure all child elements respect container width */
.chat-container * {
  max-width: 100%;
  box-sizing: border-box;
}

/* Input area constraints */
.chat-input {
  max-width: 100vw;
  box-sizing: border-box;
  contain: layout style;
  padding: clamp(0.75rem, 2vw, 1.25rem) clamp(0.75rem, 3vw, 1.25rem);
}

.chat-input form {
  max-width: min(100%, 1024px);
  width: 100%;
  box-sizing: border-box;
}

.chat-input input {
  min-width: 0;
  flex: 1;
  font-size: clamp(0.875rem, 1.5vw, 1rem) !important;
  padding: clamp(0.75rem, 2vw, 1rem) clamp(1rem, 3vw, 1.25rem) !important;
  padding-left: clamp(1rem, 3vw, 1.25rem) !important;
  padding-right: clamp(1rem, 3vw, 1.25rem) !important;
}

.chat-input button[type="submit"] {
  width: clamp(3rem, 8vw, 3.5rem) !important;
  height: clamp(3rem, 8vw, 3.5rem) !important;
  padding: clamp(0.75rem, 2vw, 1rem) !important;
}

.chat-input button i {
  font-size: clamp(0.875rem, 1.5vw, 1rem) !important;
}

/* Ensure scroll panel does not overflow */
:deep(.p-scrollpanel) {
  max-width: 100%;
  box-sizing: border-box;
}

:deep(.p-scrollpanel-content) {
  max-width: 100%;
  overflow-wrap: break-word;
}

/* Responsive Design */
@media (max-width: 768px) {
  .chat-container {
    height: 100vh;
    max-width: 100vw;
  }

  .chat-header {
    border-radius: 0.75rem;
    margin: 0.5rem;
    max-width: calc(100vw - 1rem);
  }

  .chat-input {
    padding: 0.75rem;
    left: 0;
    right: 0;
  }

  .collection-selector .p-dropdown-label {
    font-size: 0.875rem;
  }

  .markdown-content {
    font-size: 0.875rem;
    line-height: 1.5;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }
}

@media (max-width: 640px) {
  .chat-header {
    padding: 0.75rem;
    margin: 0.25rem;
  }

  .space-y-4>*+* {
    margin-top: 0.75rem;
  }

  .chat-input {
    bottom: 1rem;
    padding: 0.5rem;
  }
}

@media (max-width: 480px) {
  .chat-header .flex-col {
    gap: 0.75rem;
  }

  .collection-selector {
    width: 100%;
  }

  .markdown-content {
    font-size: 0.8125rem;
  }
}

/* Tablet landscape */
@media (min-width: 769px) and (max-width: 1024px) {
  .chat-container {
    padding: 0 1rem;
  }

  .chat-header {
    padding: 1rem;
  }
}

/* Zoom handling - Optimize for different zoom levels */
@media (min-resolution: 2dppx) {
  .chat-input input {
    font-size: 16px !important;
  }
}

@media (min-width: 1200px) {
  .chat-input {
    padding: 1rem 1.5rem;
  }

  .chat-input input {
    font-size: 0.875rem;
    padding: 0.875rem 1rem;
  }

  .chat-input button[type="submit"] {
    width: 3rem;
    height: 3rem;
  }
}

@media (max-width: 600px) and (min-height: 600px) {
  .chat-input {
    padding: 0.5rem 0.75rem !important;
  }

  .chat-input input {
    font-size: 0.8rem !important;
    padding: 0.6rem 0.8rem !important;
    padding-left: 0.8rem !important;
    padding-right: 0.8rem !important;
  }

  .chat-input button[type="submit"] {
    width: 2.5rem !important;
    height: 2.5rem !important;
    padding: 0.5rem !important;
  }

  .chat-input button i {
    font-size: 0.75rem !important;
  }
}

@media (max-width: 400px) {
  .chat-input {
    padding: 0.375rem 0.5rem !important;
  }

  .chat-input input {
    font-size: 0.75rem !important;
    padding: 0.5rem 0.75rem !important;
    padding-left: 0.75rem !important;
    padding-right: 0.75rem !important;
  }

  .chat-input button[type="submit"] {
    width: 2.25rem !important;
    height: 2.25rem !important;
    padding: 0.375rem !important;
  }
}

@media (max-width: 320px),
(max-height: 480px) {
  .chat-input {
    padding: 0.5rem;
  }

  .chat-header {
    padding: 0.5rem;
    margin: 0.25rem;
  }
}

/* Animation for Select dropdown */
.collection-selector :deep(.p-dropdown-panel) {
  border-radius: 0.75rem;
  border: 2px solid #e5e7eb;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: slideDown 0.3s ease-out;
  max-width: min(90vw, 320px);
  max-height: min(60vh, 400px);
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
}

.collection-selector :deep(.p-dropdown-panel),
.collection-selector :deep(.p-dropdown-items),
.collection-selector :deep(.p-dropdown-items-wrapper) {
  overflow-x: hidden !important;
  word-wrap: break-word;
  word-break: break-word;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.collection-selector :deep(.p-dropdown-item) {
  padding: 0.75rem 1rem;
  transition: all 0.2s ease;
  border-radius: 0.5rem;
  margin: 0.25rem;
}

.collection-selector :deep(.p-dropdown-item:hover) {
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  transform: translateX(4px);
}

.collection-selector :deep(.p-dropdown-item.p-highlight) {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
}

/* Mobile responsive for Select dropdown - FIX OVERFLOW */
@media (max-width: 768px) {
  .collection-selector :deep(.p-dropdown-panel) {
    position: fixed !important;
    top: auto !important;
    left: 0.5rem !important;
    right: 0.5rem !important;
    width: calc(100vw - 1rem) !important;
    max-width: calc(100vw - 1rem) !important;
    min-width: unset !important;
    max-height: min(50vh, 300px) !important;
    z-index: 9999 !important;
    overflow-x: hidden !important;
    box-sizing: border-box !important;
  }

  .collection-selector :deep(.p-dropdown-items-wrapper) {
    overflow-x: hidden !important;
    max-width: 100% !important;
  }

  .collection-selector :deep(.p-dropdown-item) {
    padding: 0.875rem 0.75rem !important;
    font-size: 0.875rem !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    max-width: 100% !important;
    box-sizing: border-box !important;
  }

  .collection-selector :deep(.p-dropdown-item-text) {
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    max-width: calc(100vw - 4rem) !important;
    display: block !important;
  }

  .collection-selector :deep(.p-dropdown-filter-container) {
    padding: 0.5rem !important;
    max-width: 100% !important;
  }

  .collection-selector :deep(.p-dropdown-filter) {
    width: 100% !important;
    max-width: 100% !important;
    box-sizing: border-box !important;
  }
}

@media (max-width: 480px) {
  .collection-selector :deep(.p-dropdown-panel) {
    left: 0.25rem !important;
    right: 0.25rem !important;
    width: calc(100vw - 0.5rem) !important;
    max-width: calc(100vw - 0.5rem) !important;
    max-height: min(40vh, 250px) !important;
  }

  .collection-selector :deep(.p-dropdown-item) {
    padding: 0.75rem 0.5rem !important;
    font-size: 0.8125rem !important;
    margin: 0.125rem 0 !important;
  }

  .collection-selector :deep(.p-dropdown-item-text) {
    max-width: calc(100vw - 3rem) !important;
  }
}

/* Ultra small screens - ensure no overflow */
@media (max-width: 360px) {
  .collection-selector :deep(.p-dropdown-panel) {
    left: 0.125rem !important;
    right: 0.125rem !important;
    width: calc(100vw - 0.25rem) !important;
    max-width: calc(100vw - 0.25rem) !important;
    max-height: min(35vh, 200px) !important;
  }

  .collection-selector :deep(.p-dropdown-item) {
    padding: 0.625rem 0.375rem !important;
    font-size: 0.75rem !important;
  }

  .collection-selector :deep(.p-dropdown-item-text) {
    max-width: calc(100vw - 2rem) !important;
  }
}

/* Force viewport containment for dropdown */
@media (max-width: 768px) {
  body:has(.collection-selector .p-dropdown-panel:not(.p-hidden)) {
    overflow-x: hidden !important;
  }

  .collection-selector :deep(.p-dropdown-panel) * {
    max-width: 100% !important;
    box-sizing: border-box !important;
  }

  .collection-selector :deep(.p-dropdown-panel .p-dropdown-item),
  .collection-selector :deep(.p-dropdown-panel .p-dropdown-header),
  .collection-selector :deep(.p-dropdown-panel .p-dropdown-filter-container) {
    contain: layout !important;
    overflow: hidden !important;
  }
}
</style>