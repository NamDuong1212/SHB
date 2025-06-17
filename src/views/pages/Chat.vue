<template>

  <!-- Heading -->
  <!-- <div style="box-shadow: 0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0 0 0 / 0.05)"></div> -->
  <div class="grid grid-cols-12 gap-2">
    <div class="chat-container col-span-10 relative flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <!-- Header -->
      <div class="chat-header col-span-9 rounded-xl bg-white  p-4">
        <div class="flex justify-between items-center max-w-6xl mx-auto">
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
              <h2 class="font-bold text-2xl text-gray-800 mb-0">FOXAI BOT</h2>
              <p class="text-sm text-gray-500">Trợ lý thông minh của bạn</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <MultiSelect v-model="selectedCollection" :options="Collections" filter placeholder="Chọn Collections"
              size="small" :maxSelectedLabels="3" class="w-full md:w-80" />
            <Button label="Xác nhận" size="small" @click="onselect"></Button>
          </div>
        </div>
      </div>

      <!-- Chat Content -->
      <div class="flex-1 relative p-4 md:p-6 overflow-auto pb-24 max-h-[76vh]">
        <ScrollPanel style="height: 70vh; width: 100%; " :dt="{
          bar: {
            background: ''
          }
        }" class="max-w-6xl mx-auto" ref="scrollPanel">
          <!-- Suggestion Cards -->
          <div class="mb-8 mt-2" v-if="CardBox.length > 0">
            <h3 class="text-lg font-medium text-gray-700 mb-3">Gợi ý cho bạn</h3>
            <Carousel :value="CardBox" :numVisible="3" :numScroll="1" :responsiveOptions="carouselResponsiveOptions"
              class="custom-carousel">
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
          <div class="space-y-6 px-2">
            <div v-for="(chat, index) in messages" :key="index">
              <!-- AI Message -->
              <div class="flex gap-4 mb-6 items-start" v-if="chat.role == 'assistant'">
                <div
                  class="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex-shrink-0 flex items-center justify-center shadow-md">
                  <svg stroke="white" fill="white" stroke-width="0" viewBox="0 0 24 24" height="18" width="18"
                    xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z">
                    </path>
                  </svg>
                </div>
                <div
                  class="bg-white rounded-2xl rounded-tl-none px-6 py-4 shadow-md border border-gray-100 max-w-[85%]">
                  <div v-html="chat.content" class="markdown-content text-gray-700 text-md leading-relaxed"></div>
                </div>
              </div>

              <!-- User Message -->
              <div class="flex gap-4 mb-6 items-start justify-end" v-if="chat.role == 'user'">
                <div
                  class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl rounded-tr-none px-6 py-4 shadow-md max-w-[85%]">
                  <p class="text-md">{{ chat.content }}</p>
                </div>
                <div
                  class="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center shadow-md">
                  <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="18"
                    width="18" xmlns="http://www.w3.org/2000/svg">
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
      <div class="chat-input z-50 fixed bottom-5 left-0 right-0  p-4 md:p-5">
        <form class="flex items-center gap-3 max-w-4xl mx-auto" @submit="submitChat">
          <div class="relative flex-1">
            <input
              class="w-full pl-5 pr-12 py-4 bg-gray-50 hover:bg-white focus:bg-white rounded-full border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all duration-200 text-base"
              placeholder="Nhập câu hỏi của bạn tại đây..." v-model="user_question" />
            <button type="button" @click=""
              class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
              <i class="pi pi-paperclip text-lg"></i>
            </button>
          </div>
          <button type="submit"
            class="p-4 w-1/12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
            :disabled="!user_question.length" :class="{ 'opacity-50': !user_question.length }">
            <i class="pi pi-send text-lg"></i>
          </button>
        </form>
        <p class="text-center text-xs font-italic">
          Thông tin được tạo ra bằng AI. Hãy luôn cẩn trọng và sử dụng thông tin AI một cách có trách nhiệm.

        </p>
      </div>

    </div>
    <HistoryChat></HistoryChat>
  </div>

</template>

<script setup>
import { useToast } from "primevue";
import { computed, getCurrentInstance } from "vue";

const toast = useToast();
const { proxy } = getCurrentInstance();
import SkeletonLoading from "@/components/SkeletonLoading.vue";
import HistoryChat from "@/components/HistoryChat.vue";
import axios from "axios";
import { marked } from 'marked';
import { nextTick, onBeforeMount, onMounted, ref } from "vue";
import http from "@/service/http";
import { useAuthStore } from "@/stores/useAuth";
const CardBox = ref([]);
const scrollPanel = ref(null);
const loading = ref(false);
const loadingType = ref("chat");
const store = useAuthStore()
onMounted(() => {
  console.log();
})
const carouselResponsiveOptions = [
  {
    breakpoint: '1024px',
    numVisible: 3,
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

const messages = ref([]);
const user_question = ref("");

onBeforeMount(() => {
  getCard()
  fetchCollections()
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
  try {
    const res = await http.post(`/fastapi/select/`, data)
    if (res.data) {
      proxy.$notify('S', 'Cập nhật Collections thành công!', toast)
    }
  } catch (error) {
    console.log(error);
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
</style>
