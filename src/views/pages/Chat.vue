<template>

  <!-- Heading -->
  <!-- <div style="box-shadow: 0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0 0 0 / 0.05)"></div> -->
  <div class="grid bg-gradient-to-br from-blue-50 to-indigo-50 grid-cols-12 gap-2 lg:gap-4">
    <div class="chat-container col-span-12 lg:col-span-10 relative flex flex-col h-screen ">
      <!-- Header -->
      <div class="chat-header rounded-xl bg-white p-3 md:p-4 mx-2 md:mx-0 shadow-xl">
        <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 max-w-6xl mx-auto">
          <div class="flex items-center gap-3">
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
              <h2 class="font-bold text-lg lg:text-2xl text-gray-800 mb-0">FOXAI BOT</h2>
              <p class="text-sm text-gray-500">Trợ lý thông minh của bạn</p>
            </div>
          </div>
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <!-- Collection Selector với styling đẹp hơn -->
            <div class="relative flex-1 sm:flex-none">
              <MultiSelect v-model="selectedCollection" :options="Collections" filter placeholder="🗂️ Chọn Collections"
                size="small" :maxSelectedLabels="1" selectedItemsLabel="{0} collections đã chọn"
                class="w-full sm:w-64 md:w-80 collection-selector" :pt="{
                  root: { class: 'border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 rounded-xl shadow-sm transition-all duration-200' },
                  label: { class: 'text-gray-700 font-medium text-sm truncate' },
                  trigger: { class: 'text-blue-500' }
                }" />
            </div>

            <div class="flex gap-2 justify-end sm:justify-start">
              <!-- Confirm Button với styling gradient -->
              <Button :disabled="selectedCollection?.length < 1" label="Xác nhận" icon="pi pi-check" size="small"
                @click="onselect"
                class=" bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-0 text-white font-medium px-3 md:px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 text-sm" />

              <Button icon="pi pi-trash" size="small" severity="danger" text rounded @click="showDeleteDialog"
                v-tooltip.top="'Xóa cuộc trò chuyện'" class="flex-shrink-0" />
            </div>
          </div>
        </div>
      </div>

      <!-- Chat Content -->
      <div class="flex-1 relative p-2 md:p-4 lg:p-6 overflow-hidden">
        <ScrollPanel style="height: calc(100vh - 180px); width: 100%; " :dt="{
          bar: {
            background: ''
          }
        }" class="max-w-6xl mx-auto" ref="scrollPanel">
          <!-- Suggestion Cards -->
          <div class="mb-6 md:mb-8 mt-2" v-if="CardBox.length > 0">
            <h3 class="text-base md:text-lg font-medium text-gray-700 mb-3 px-2 md:px-0">Gợi ý cho bạn</h3>
            <Carousel :value="CardBox" :numVisible="3" :numScroll="1" :responsiveOptions="carouselResponsiveOptions"
              class="custom-carousel" :showIndicators="true" :showNavigators="true">
              <template #item="{ data }">
                <div class="card-item p-2">
                  <Card
                    class="border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 h-full rounded-xl overflow-hidden">
                    <template #header>
                      <div class="relative">
                        <img :alt="data.title" :src="data.image_url" class="w-full h-36 object-cover" />
                        <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        <div class="absolute bottom-3 left-4 text-white font-bold text-xl">{{ data.title }}</div>
                      </div>
                    </template>
                    <template #content>
                      <div class="suggestion-items">
                        <div @click="getValueMessage(item)" v-for="item in data.items"
                          class="py-2 px-3 my-1 rounded-lg bg-gray-50 hover:bg-blue-50 cursor-pointer transition-colors duration-200 flex items-center group">
                          <i
                            class="pi pi-chevron-right text-blue-500 mr-2 text-xs group-hover:translate-x-1 transition-transform"></i>
                          <p class="text-gray-700 text-sm">{{ item }}</p>
                        </div>
                      </div>
                    </template>
                  </Card>
                </div>
              </template>
            </Carousel>
          </div>
          <!-- Messages -->
          <div class="space-y-4 md:space-y-6 px-1 md:px-2 mb-44 lg:mb-28">
            <div v-for="(chat, index) in messages" :key="index">
              <!-- AI Message -->
              <div class="flex gap-2 md:gap-4 mb-4 md:mb-6 items-start" v-if="chat.role == 'assistant'">
                <div
                  class="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex-shrink-0 flex items-center justify-center shadow-md">
                  <svg stroke="white" fill="white" stroke-width="0" viewBox="0 0 24 24" height="14" width="14"
                    class="md:w-[18px] md:h-[18px]" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z">
                    </path>
                  </svg>
                </div>
                <div
                  class="bg-white rounded-2xl rounded-tl-none px-3 md:px-6 py-3 md:py-4 shadow-md border border-gray-100 max-w-[90%] md:max-w-[85%]">
                  <div v-html="chat.content" class="markdown-content text-gray-700 text-sm md:text-md leading-relaxed">
                  </div>
                </div>
              </div>

              <!-- User Message -->
              <div class="flex gap-2 md:gap-4 mb-4 md:mb-6 items-start justify-end" v-if="chat.role == 'user'">
                <div
                  class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl rounded-tr-none px-3 md:px-6 py-3 md:py-4 shadow-md max-w-[90%] md:max-w-[85%]">
                  <p class="text-sm md:text-md">{{ chat.content }}</p>
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
      <div class="chat-input fixed bottom-0 left-0 right-0  p-3 md:p-4 lg:p-5 z-40">
        <form class="flex items-center gap-2 md:gap-3 w-full max-w-4xl mx-auto" @submit="submitChat">
          <div class="relative flex-1">
            <input
              class="w-full shadow-xl pl-4 md:pl-5 pr-10 md:pr-12 py-3 md:py-4 bg-gray-50 hover:bg-white focus:bg-white rounded-full border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all duration-200 text-sm md:text-base"
              placeholder="Nhập câu hỏi..." v-model="user_question" @focus="handleInputFocus"
              @keydown="handleKeyDown" />
            <button type="button" @click="showSuggestions = !showSuggestions"
              class="absolute  right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
              v-tooltip.top="'Hiển thị gợi ý câu hỏi'">
              <i class="pi pi-lightbulb text-base md:text-lg" :class="{ 'text-blue-500': showSuggestions }"></i>
            </button>
          </div>
          <button type="submit"
            class="p-3 shadow-xl md:p-4 w-12 md:w-14 h-12 md:h-14 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center flex-shrink-0"
            :disabled="!user_question.length" :class="{ 'opacity-50': !user_question.length }">
            <i class="pi pi-send text-sm md:text-lg"></i>
          </button>
          <!-- Suggestions Popup -->
          <div v-if="showSuggestions && suggestedPrompts.length > 0"
            class="suggestions-popup absolute bottom-full left-0 right-0 mb-2 mx-2 md:mx-0 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden backdrop-blur-lg bg-white/95 max-w-4xl md:mx-auto">
            <div class="p-3 md:p-4 border-b border-gray-50 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <i class="pi pi-lightbulb text-blue-500 text-base md:text-lg"></i>
                  <h6 class="font-semibold text-gray-800 m-0 text-sm md:text-base">Gợi ý câu hỏi</h6>
                </div>
                <button @click="showSuggestions = false"
                  class="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-white/50">
                  <i class="pi pi-times text-xs md:text-sm"></i>
                </button>
              </div>
            </div>
            <ScrollPanel style="width: 100%; height: clamp(200px, 40vh, 300px)" class="max-h-80 p-1 md:p-2">
              <div class="grid grid-cols-1 gap-1">
                <div v-for="(prompt, index) in suggestedPrompts" :key="index" @click="selectSuggestion(prompt)"
                  class="suggestion-item flex items-center gap-2 md:gap-3 p-2 md:p-3 mx-1 md:mx-2 rounded-xl hover:bg-blue-50 cursor-pointer transition-all duration-200 group">
                  <div
                    class="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center flex-shrink-0 group-hover:from-blue-200 group-hover:to-indigo-200 transition-all">
                    <i
                      class="pi pi-arrow-right text-blue-500 text-xs md:text-sm group-hover:translate-x-0.5 transition-transform"></i>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p
                      class="text-gray-700 text-xs md:text-sm font-medium group-hover:text-blue-700 transition-colors truncate">
                      {{
                        prompt.title
                      }}</p>
                    <p class="text-gray-500 text-xs mt-0.5 group-hover:text-blue-500 transition-colors line-clamp-2">
                      {{
                        prompt.description
                      }}</p>
                  </div>
                  <div class="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <i class="pi pi-chevron-right text-blue-400 text-xs"></i>
                  </div>
                </div>
              </div>
            </ScrollPanel>
            <div class="p-2 md:p-3 bg-gray-50 border-t border-gray-100">
              <p class="text-xs text-gray-500 text-center">
                <i class="pi pi-info-circle mr-1"></i>
                <span class="hidden md:inline">Nhấn ESC để đóng hoặc nhấp vào gợi ý để sử dụng</span>
                <span class="md:hidden">Nhấp để sử dụng gợi ý</span>
              </p>
            </div>
          </div>
        </form>
        <p class="text-center text-xs font-italic px-2 mt-2">
          <span class="hidden md:inline">Thông tin được tạo ra bằng AI. Hãy luôn cẩn trọng và sử dụng thông tin AI một
            cách có
            trách nhiệm.</span>
          <span class="md:hidden">Thông tin AI - Sử dụng có trách nhiệm</span>
        </p>

      </div>

    </div>
    <div class="hidden lg:block lg:col-span-2">
      <HistoryChat></HistoryChat>
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
import HistoryChat from "@/components/HistoryChat.vue";
import SkeletonLoading from "@/components/SkeletonLoading.vue";
import http from "@/service/http";
import { useAuthStore } from "@/stores/useAuth";
import { marked } from 'marked';
import { useToast } from "primevue";
import { getCurrentInstance, nextTick, onBeforeMount, onBeforeUnmount, onMounted, ref } from "vue";

const toast = useToast();
const { proxy } = getCurrentInstance();
const CardBox = ref([]);
const scrollPanel = ref(null);
const loading = ref(false);
const loadingType = ref("chat");
const store = useAuthStore()
onMounted(() => {
  // Thêm event listener cho việc click bên ngoài
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('keydown', handleKeyDown);
});

// Cleanup khi component bị destroy
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('keydown', handleKeyDown);
});
const carouselResponsiveOptions = [
  {
    breakpoint: '1400px',
    numVisible: 3,
    numScroll: 1
  },
  {
    breakpoint: '1024px',
    numVisible: 1,
    numScroll: 1
  },
  {
    breakpoint: '768px',
    numVisible: 2,
    numScroll: 1
  },
  {
    breakpoint: '560px',
    numVisible: 1,
    numScroll: 1
  }
];
const selectedCollection = ref([])
const Collections = ref([])
const HistoryMessChat = ref([])
const messages = ref([]);
const user_question = ref("");
const showDeleteConfirmDialog = ref(false);
const showSuggestions = ref(false);
const suggestedPrompts = ref([
  {
    title: "/help",
    description: "Tìm hiểu các quy trình và quy định công ty",
  },
  {
    title: "Thông tin nhân sự",
    description: "Câu hỏi về chính sách nhân sự, lương thưởng",
  },
  {
    title: "Tài liệu kỹ thuật",
    description: "Hướng dẫn kỹ thuật và tài liệu hệ thống",
  },
  {
    title: "Báo cáo và thống kê",
    description: "Cách tạo báo cáo và xem thống kê",
  },
  {
    title: "Hỗ trợ kỹ thuật",
    description: "Giải quyết các vấn đề kỹ thuật",
  }
]);

onBeforeMount(() => {
  getCard()
  fetchCollections()
  fetchChatHistory()
})



const submitChat = async (e) => {
  e.preventDefault();
  if (!user_question.value.trim()) return;

  loading.value = true;
  // Hiển thị loading ngay lập tức
  loadingType.value = "chat"; // Hoặc bạn có thể sử dụng: "pulse", "skeleton"

  // Push user message
  messages.value.push({
    role: "user",
    content: user_question.value,
  });

  const data = {
    user_id: store.getUser,
    user_question: user_question.value,
    messages: messages.value,
  };

  user_question.value = "";
  scrollToBottom();

  try {
    const response = await http.post("/fastapi/chat/", data);
    const answerRaw = response.data.final_answer || "Xin lỗi, tôi không hiểu câu hỏi của bạn.";

    // Khi có dữ liệu trả về, tắt loading
    loading.value = false;

    // Thêm tin nhắn trợ lý với nội dung rỗng
    const assistantMessage = {
      role: "assistant",
      content: "",
    };
    messages.value.push(assistantMessage);

    // Typing effect từng ký tự
    let currentText = "";
    for (let i = 0; i < answerRaw.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 10)); // tốc độ typing
      currentText += answerRaw[i];
      messages.value[messages.value.length - 1].content = marked.parse(currentText); // parse từng phần
      scrollToBottom();
    }

  } catch (error) {
    loading.value = false;
    messages.value.push({
      role: "assistant",
      content: marked.parse("❌ Đã xảy ra lỗi khi gửi yêu cầu. Vui lòng thử lại."),
    });
  } finally {
    scrollToBottom();
    loading.value = false;
  }
};

const getCard = async () => {
  try {
    const res = await http.get('/fastapi/cards/');
    CardBox.value = res.data.items;
  } catch (error) {
    console.error("Không thể tải cards:", error);
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (scrollPanel.value) {
      const scrollableContent = scrollPanel.value.$el.querySelector('.p-scrollpanel-content');
      if (scrollableContent) {
        scrollableContent.scrollTop = scrollableContent.scrollHeight;
      }
    }
  })
}
const getValueMessage = async (item) => {
  messages.value.push({
    role: "user",
    content: item,
  });

  const data = {
    user_id: store.getUser,
    user_question: item,
    messages: messages.value,
  };

  user_question.value = "";
  scrollToBottom();
  loading.value = true;
  // Chọn kiểu loading khác nhau
  loadingType.value = "skeleton"; // Có thể là: "typing", "chat", "pulse", "skeleton"

  try {
    const response = await http.post("/fastapi/chat/", data);
    const answerRaw = response.data.final_answer || "Xin lỗi, tôi không hiểu câu hỏi của bạn.";

    // Khi có dữ liệu trả về, tắt loading
    loading.value = false;

    // Thêm tin nhắn trợ lý với nội dung rỗng
    const assistantMessage = {
      role: "assistant",
      content: "",
    };
    messages.value.push(assistantMessage);

    // Typing effect từng ký tự
    let currentText = "";
    for (let i = 0; i < answerRaw.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 10)); // tốc độ typing
      currentText += answerRaw[i];
      messages.value[messages.value.length - 1].content = marked.parse(currentText); // parse từng phần
      scrollToBottom();
    }

  } catch (error) {
    loading.value = false;
    messages.value.push({
      role: "assistant",
      content: marked.parse("❌ Đã xảy ra lỗi khi gửi yêu cầu. Vui lòng thử lại."),
    });
  } finally {
    scrollToBottom();
    loading.value = false;
  }
};
const fetchCollections = async () => {
  try {
    const res = await http.get(`/fastapi/col/?user_id=${store.getUser}`)
    Collections.value = res.data.collections
  } catch (error) {
    console.log(error);
  }
};
const onselect = async () => {
  let data = {
    user_id: store.getUser,
    selected_names: selectedCollection.value,
  }
  loading.value = true
  try {
    const res = await http.post(`/fastapi/select/`, data)
    if (res.data) {
      proxy.$notify('S', 'Cập nhật Collections thành công!', toast)
    }
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false
  }
};
const fetchChatHistory = async () => {
  loading.value = true
  try {
    const res = await http.get(`/fastapi/history/?user_id=${store.getUser}&limit=100`)
    HistoryMessChat.value = res.data.history.map(el => ({
      ...el,
      content: marked.parse(el.content)
    }))
    console.log(HistoryMessChat.value);
    messages.value = [...HistoryMessChat.value, ...messages.value]
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false
  }
}

const showDeleteDialog = () => {
  showDeleteConfirmDialog.value = true;
};

const confirmDelete = async () => {
  showDeleteConfirmDialog.value = false;
  await clearChat();
};

const clearChat = async () => {
  messages.value = []
  try {
    const res = await http.delete(`/fastapi/delete/history/`)
    proxy.$notify('S', 'Xóa thành công!', toast)
  } catch (error) {
    proxy.$notify('E', error, toast)
  }
};

// Xử lý popup gợi ý
const selectSuggestion = (prompt) => {
  showSuggestions.value = false;
  // Tự động focus vào input
  nextTick(() => {
    const input = document.querySelector('input[placeholder*="Nhập câu hỏi"]');
    if (input) input.focus();
  });
};

// Xử lý sự kiện bàn phím
const handleKeyDown = (event) => {
  if (event.key === 'Escape') {
    showSuggestions.value = false;
  }
  if (event.key === 'Tab' && !showSuggestions.value && user_question.value.trim() === '') {
    event.preventDefault();
    showSuggestions.value = true;
  }
};

// Xử lý focus vào input
const handleInputFocus = () => {
  if (user_question.value.trim() === '') {
    showSuggestions.value = true;
  }
};

// Xử lý click bên ngoài để đóng popup
const handleClickOutside = (event) => {
  const popup = document.querySelector('.suggestions-popup');
  const input = document.querySelector('input[placeholder*="Nhập câu hỏi"]');

  if (popup && input && !popup.contains(event.target) && !input.contains(event.target)) {
    showSuggestions.value = false;
  }
};
</script>

<style scoped>
.markdown-content :deep(p) {
  margin-bottom: 1rem;
  line-height: 1.6;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  padding-left: 1.75rem;
  margin-bottom: 1rem;
}

.markdown-content :deep(li) {
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

.custom-spinner :deep(.p-progress-spinner-circle) {
  stroke: #3b82f6;
  stroke-width: 4;
}

/* Thay đổi background từ hình ảnh sang gradient */
.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

/* Custom styling cho Collection Selector */
.collection-selector :deep(.p-multiselect) {
  border-radius: 0.75rem;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.collection-selector :deep(.p-multiselect:hover) {
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
}

.collection-selector :deep(.p-multiselect-label) {

  font-weight: 500;
}

.collection-selector :deep(.p-multiselect-token) {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.25rem 0.75rem;
  margin: 0.125rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.collection-selector :deep(.p-multiselect-token-icon) {
  color: rgba(255, 255, 255, 0.8);
  margin-left: 0.5rem;
}

.collection-selector :deep(.p-multiselect-token-icon:hover) {
  color: white;
}



/* Custom styling cho Clear Button */
.clear-btn {
  position: relative;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}

.clear-btn::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0;
  height: 0;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 50%;
  transition: all 0.3s ease;
  z-index: -1;
}

.clear-btn:hover::after {
  width: 120%;
  height: 120%;
}

/* Suggestions Popup Styles */
.suggestions-popup {
  animation: fadeInUp 0.3s ease-out;
  transform-origin: bottom center;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.95);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.suggestion-item {
  position: relative;
  overflow: hidden;
}

.suggestion-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
  transition: left 0.5s;
}

.suggestion-item:hover::before {
  left: 100%;
}

/* Viewport constraints - Đảm bảo không overflow */
.chat-container {
  max-width: 100vw;
  overflow-x: hidden;
  position: relative;
}

.suggestions-popup {
  max-width: calc(100vw - 2rem);
  max-height: min(60vh, 400px);
  overflow: hidden;
  box-sizing: border-box;
}

/* Input area constraints */
.chat-input {
  max-width: 100vw;
  box-sizing: border-box;
  contain: layout style;
  /* Giới hạn padding khi zoom */
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
  /* Giới hạn font size và padding khi zoom */
  font-size: clamp(0.875rem, 1.5vw, 1rem) !important;
  padding: clamp(0.75rem, 2vw, 1rem) clamp(1rem, 3vw, 1.25rem) !important;
  /* Override Tailwind classes */
  padding-left: clamp(1rem, 3vw, 1.25rem) !important;
  padding-right: clamp(2.5rem, 6vw, 3rem) !important;
}

.chat-input button[type="submit"] {
  /* Giới hạn size của send button */
  width: clamp(3rem, 8vw, 3.5rem) !important;
  height: clamp(3rem, 8vw, 3.5rem) !important;
  padding: clamp(0.75rem, 2vw, 1rem) !important;
}

/* Lightbulb button inside input */
.chat-input .absolute button {
  padding: clamp(0.5rem, 1.5vw, 0.75rem) !important;
  right: clamp(0.75rem, 2vw, 1rem) !important;
}

.chat-input .absolute button i {
  font-size: clamp(0.875rem, 1.5vw, 1rem) !important;
}

.chat-input button i {
  font-size: clamp(0.875rem, 1.5vw, 1rem) !important;
}

/* Đảm bảo scroll panel không overflow */
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
  .suggestions-popup {
    left: 0.5rem;
    right: 0.5rem;
    margin-left: 0;
    margin-right: 0;
    border-radius: 1rem;
    max-height: 50vh;
  }

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

  /* Ẩn text dài trên mobile */
  .collection-selector .p-multiselect-label {
    font-size: 0.875rem;
  }

  /* Tối ưu message layout cho mobile */
  .markdown-content {
    font-size: 0.875rem;
    line-height: 1.5;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }

  /* Tối ưu carousel cho mobile */
  .custom-carousel .p-carousel-item {
    padding: 0.25rem;
  }
}

@media (max-width: 640px) {
  .chat-header {
    padding: 0.75rem;
    margin: 0.25rem;
  }

  .suggestion-item {
    padding: 0.5rem;
  }

  .suggestion-item .w-6 {
    width: 1.25rem;
    height: 1.25rem;
  }

  /* Giảm khoảng cách giữa messages */
  .space-y-4>*+* {
    margin-top: 0.75rem;
  }

  /* Tối ưu input area */
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

  .confirm-btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }

  /* Ultra compact cho màn hình rất nhỏ */
  .markdown-content {
    font-size: 0.8125rem;
  }

  .suggestions-popup {
    left: 0.25rem;
    right: 0.25rem;
    max-height: 40vh;
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

/* Zoom handling - Tối ưu cho các tỷ lệ zoom khác nhau */
@media (min-resolution: 2dppx) {
  .chat-input input {
    font-size: 16px !important;
    /* Prevent zoom on iOS */
  }
}

/* Zoom levels - Điều chỉnh cho các mức zoom */
@media (min-width: 1200px) {
  .chat-input {
    /* Giảm padding trên màn hình lớn */
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

/* High zoom detection via viewport width */
@media (max-width: 600px) and (min-height: 600px) {
  .chat-input {
    padding: 0.5rem 0.75rem !important;
  }

  .chat-input input {
    font-size: 0.8rem !important;
    padding: 0.6rem 0.8rem !important;
    padding-left: 0.8rem !important;
    padding-right: 2rem !important;
  }

  .chat-input button[type="submit"] {
    width: 2.5rem !important;
    height: 2.5rem !important;
    padding: 0.5rem !important;
  }

  .chat-input .absolute button {
    padding: 0.25rem !important;
    right: 0.5rem !important;
  }

  .chat-input button i {
    font-size: 0.75rem !important;
  }
}

/* Ultra high zoom - khi viewport rất nhỏ */
@media (max-width: 400px) {
  .chat-input {
    padding: 0.375rem 0.5rem !important;
  }

  .chat-input input {
    font-size: 0.75rem !important;
    padding: 0.5rem 0.75rem !important;
    padding-left: 0.75rem !important;
    padding-right: 1.75rem !important;
  }

  .chat-input button[type="submit"] {
    width: 2.25rem !important;
    height: 2.25rem !important;
    padding: 0.375rem !important;
  }
}

/* Very large screens */
@media (min-width: 1440px) {
  .suggestions-popup {
    max-width: 1200px;
  }
}

/* Very small screens và zoom cao */
@media (max-width: 320px),
(max-height: 480px) {
  .suggestions-popup {
    position: fixed;
    top: 10vh;
    bottom: 120px;
    left: 0.5rem;
    right: 0.5rem;
    height: auto;
    max-height: none;
  }

  .chat-input {
    padding: 0.5rem;
  }

  .chat-header {
    padding: 0.5rem;
    margin: 0.25rem;
  }
}

/* Animation cho MultiSelect dropdown */
.collection-selector :deep(.p-multiselect-panel) {
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

/* Đảm bảo không có horizontal scroll */
.collection-selector :deep(.p-multiselect-panel),
.collection-selector :deep(.p-multiselect-items),
.collection-selector :deep(.p-multiselect-items-wrapper) {
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

.collection-selector :deep(.p-multiselect-item) {
  padding: 0.75rem 1rem;
  transition: all 0.2s ease;
  border-radius: 0.5rem;
  margin: 0.25rem;
}

.collection-selector :deep(.p-multiselect-item:hover) {
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  transform: translateX(4px);
}

.collection-selector :deep(.p-multiselect-item.p-highlight) {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
}

/* Mobile responsive cho MultiSelect dropdown - FIX OVERFLOW */
@media (max-width: 768px) {
  .collection-selector :deep(.p-multiselect-panel) {
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

  .collection-selector :deep(.p-multiselect-items-wrapper) {
    overflow-x: hidden !important;
    max-width: 100% !important;
  }

  .collection-selector :deep(.p-multiselect-item) {
    padding: 0.875rem 0.75rem !important;
    font-size: 0.875rem !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    max-width: 100% !important;
    box-sizing: border-box !important;
  }

  .collection-selector :deep(.p-multiselect-item-text),
  .collection-selector :deep(.p-multiselect-item .p-checkbox-label) {
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    max-width: calc(100vw - 4rem) !important;
    display: block !important;
  }

  .collection-selector :deep(.p-multiselect-filter-container) {
    padding: 0.5rem !important;
    max-width: 100% !important;
  }

  .collection-selector :deep(.p-multiselect-filter) {
    width: 100% !important;
    max-width: 100% !important;
    box-sizing: border-box !important;
  }
}

@media (max-width: 480px) {
  .collection-selector :deep(.p-multiselect-panel) {
    left: 0.25rem !important;
    right: 0.25rem !important;
    width: calc(100vw - 0.5rem) !important;
    max-width: calc(100vw - 0.5rem) !important;
    max-height: min(40vh, 250px) !important;
  }

  .collection-selector :deep(.p-multiselect-item) {
    padding: 0.75rem 0.5rem !important;
    font-size: 0.8125rem !important;
    margin: 0.125rem 0 !important;
  }

  .collection-selector :deep(.p-multiselect-item-text),
  .collection-selector :deep(.p-multiselect-item .p-checkbox-label) {
    max-width: calc(100vw - 3rem) !important;
  }
}

/* Ultra small screens - đảm bảo không overflow */
@media (max-width: 360px) {
  .collection-selector :deep(.p-multiselect-panel) {
    left: 0.125rem !important;
    right: 0.125rem !important;
    width: calc(100vw - 0.25rem) !important;
    max-width: calc(100vw - 0.25rem) !important;
    max-height: min(35vh, 200px) !important;
  }

  .collection-selector :deep(.p-multiselect-item) {
    padding: 0.625rem 0.375rem !important;
    font-size: 0.75rem !important;
  }

  .collection-selector :deep(.p-multiselect-item-text),
  .collection-selector :deep(.p-multiselect-item .p-checkbox-label) {
    max-width: calc(100vw - 2rem) !important;
  }
}

/* Force viewport containment for dropdown */
@media (max-width: 768px) {
  body:has(.collection-selector .p-multiselect-panel:not(.p-hidden)) {
    overflow-x: hidden !important;
  }

  .collection-selector :deep(.p-multiselect-panel) * {
    max-width: 100% !important;
    box-sizing: border-box !important;
  }

  /* Đảm bảo không có element nào vượt quá viewport */
  .collection-selector :deep(.p-multiselect-panel .p-multiselect-item),
  .collection-selector :deep(.p-multiselect-panel .p-multiselect-header),
  .collection-selector :deep(.p-multiselect-panel .p-multiselect-filter-container) {
    contain: layout !important;
    overflow: hidden !important;
  }
}
</style>
