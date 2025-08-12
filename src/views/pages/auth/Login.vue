<script setup>
import AuthService from "@/service/AuthService";
import { useAuthStore } from "@/stores/useAuth";
import { useToast } from "primevue";
import { computed, getCurrentInstance, onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";

const toast = useToast();
const { proxy } = getCurrentInstance();
const account = ref("");
const password = ref("");
const isLoading = ref(false);
const submit = ref(false);
const loginFail = ref(false);
const checked = ref(false);

const router = useRouter();
const authStore = useAuthStore();

// Responsive state
const windowWidth = ref(0);

const isMobile = computed(() => windowWidth.value < 768);
const isTablet = computed(() => windowWidth.value >= 768 && windowWidth.value < 1024);
const isDesktop = computed(() => windowWidth.value >= 1024);

const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth;
};

onMounted(() => {
  updateWindowWidth();
  window.addEventListener('resize', updateWindowWidth);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateWindowWidth);
});

const login = async (event) => {
  if (event) {
    event.preventDefault();
  }

  submit.value = true;
  if (!account.value || !password.value) return;

  isLoading.value = true;
  loginFail.value = false;

  try {
    const authInfo = await AuthService.login(account.value, password.value);

    if (authInfo?.access_token) {
      authStore.login(authInfo);

      toast.add({
        severity: 'success',
        summary: 'Thành công',
        detail: 'Đăng nhập thành công',
        life: 2000
      });

      setTimeout(() => {
        router.push("/");
      }, 1000);

    } else {
      throw new Error("Không nhận được access token từ server");
    }

  } catch (error) {
    loginFail.value = true;

    let errorMessage = "Tên đăng nhập hoặc mật khẩu không đúng.";
    if (error.response?.data?.detail) {
      errorMessage = error.response.data.detail;
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    toast.add({
      severity: 'error',
      summary: 'Đăng nhập thất bại',
      detail: errorMessage,
      life: 3000
    });

    console.error('Login error:', error);
  } finally {
    isLoading.value = false;
  }
};

const handleKeyPress = (event) => {
  if (event.key === 'Enter') {
    login(event);
  }
};

</script>

<template>
  <Toast />
  <Loading v-if="isLoading" />
  <div
    class="login-container bg-white dark:bg-surface-950 flex items-center justify-center overflow-hidden min-h-screen">
    <!-- Mobile Layout -->
    <div v-if="isMobile" class="w-full px-4 py-8 flex flex-col justify-center min-h-screen">
      <div class="w-full max-w-md mx-auto">
        <!-- Logo for mobile -->
        <div class="text-center mb-8">
          <img class="w-32 sm:w-40 mx-auto" src="/img/logo-shb-vn-sl.png" alt="Logo SHB" />
        </div>

        <!-- Login Form -->
        <form @submit.prevent="login" class="flex flex-col gap-4">
          <div class="flex flex-col gap-2 text-center">
            <h2 class="m-0 text-xl"><strong>Đăng nhập</strong></h2>
            <h5 class=" font-medium text-sm m-0">
              Xin chào bạn, đăng nhập để tiếp tục!
            </h5>
          </div>

          <div>
            <FloatLabel variant="in">
              <InputText id="text" v-model="account" class="h-12 w-full !text-base" :invalid="submit && !account"
                @keypress="handleKeyPress" :disabled="isLoading" />
              <label class="text-sm" for="text">Email</label>
            </FloatLabel>
            <small class="text-red-500" v-if="!account && submit">Vui lòng nhập email</small>
          </div>

          <div>
            <FloatLabel variant="in" class="mt-1">
              <Password fluid id="password" v-model="password" :invalid="submit && !password" class="h-12 !text-base"
                toggleMask @keypress="handleKeyPress" :disabled="isLoading">
                <template #footer>
                  <p class="mt-2 text-sm">Yêu cầu mật khẩu</p>
                  <ul class="pl-2 ml-2 mt-0 list-disc list-inside text-sm" style="line-height: 1.4">
                    <li>Có ít nhất 8 ký tự</li>
                    <li>Có ít nhất một chữ hoa và một chữ thường</li>
                    <li>Có ít nhất một chữ số</li>
                    <li>Có ít nhất một ký tự đặc biệt</li>
                  </ul>
                </template>
              </Password>
              <label class="text-sm" for="password">Mật khẩu</label>
            </FloatLabel>
            <small class="text-red-500" v-if="!password && submit">Vui lòng nhập mật khẩu</small>
          </div>

          <!-- Error message -->
          <div v-if="loginFail" class="text-red-500 text-sm bg-red-50 p-3 rounded">
            Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng thử lại.
          </div>

          <Button :loading="isLoading" label="Đăng nhập" class="w-full h-12 !text-base mt-2" type="submit"
            :disabled="isLoading" />

          <div class="flex flex-col gap-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Checkbox v-model="checked" inputId="remember" name="remember" binary />
                <label for="remember" class="text-sm">Nhớ mật khẩu</label>
              </div>
              <router-link to="/" class="text-primary text-sm font-light hover:underline">Quên mật khẩu?</router-link>
            </div>
          </div>
        </form>

        <!-- Background image for mobile -->
        <div class="mt-8 rounded-2xl overflow-hidden">
          <img src="../../../assets/img/FOXAI.jpg" alt="login-bg" class="w-full h-40 object-cover"
            style="filter: contrast(90%)" />
        </div>
      </div>
    </div>

    <!-- Desktop/Tablet Layout -->
    <template v-else>
      <div class="relative w-full lg:w-1/2 min-h-screen flex items-center px-4 lg:px-0">
        <div class="w-full flex flex-col h-auto max-w-lg lg:max-w-[60%] mx-auto">
          <img class="w-40 lg:w-52 absolute top-6 lg:top-10" src="/img/logo-shb-vn-sl.png" alt="Logo SHB" />

          <!-- Desktop Form -->
          <form @submit.prevent="login" class="flex flex-col gap-4 lg:gap-5 mt-32 lg:mt-60">
            <div class="flex flex-col gap-2">
              <h2 class="m-0 text-xl lg:text-2xl"><strong>Đăng nhập</strong></h2>
              <h5 class=" font-medium text-sm lg:text-base m-0">
                Xin chào bạn, đăng nhập để tiếp tục!
              </h5>
            </div>

            <div>
              <FloatLabel variant="in">
                <InputText id="text" v-model="account" class="h-12 lg:h-14 w-full !text-base lg:!text-lg"
                  :invalid="submit && !account" @keypress="handleKeyPress" :disabled="isLoading" />
                <label class="text-sm lg:text-normal" for="text">Email</label>
              </FloatLabel>
              <small class="text-red-500" v-if="!account && submit">Vui lòng nhập email</small>
            </div>

            <div>
              <FloatLabel variant="in" class="mt-1">
                <Password fluid id="password" v-model="password" :invalid="submit && !password"
                  class="h-12 lg:h-14 !text-base lg:!text-lg" toggleMask @keypress="handleKeyPress"
                  :disabled="isLoading">
                  <template #footer>
                    <p class="mt-2">Yêu cầu mật khẩu</p>
                    <ul class="pl-2 ml-2 mt-0 list-disc list-inside" style="line-height: 1.5">
                      <li>Có ít nhất 8 ký tự</li>
                      <li>Có ít nhất một chữ hoa và một chữ thường</li>
                      <li>Có ít nhất một chữ số</li>
                      <li>Có ít nhất một ký tự đặc biệt</li>
                    </ul>
                  </template>
                </Password>
                <label class="text-sm lg:text-normal" for="password">Mật khẩu</label>
              </FloatLabel>
              <small class="text-red-500" v-if="!password && submit">Vui lòng nhập mật khẩu</small>
            </div>

            <!-- Error message -->
            <div v-if="loginFail" class="text-red-500 text-sm bg-red-50 p-3 rounded">
              Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng thử lại.
            </div>

            <Button :loading="isLoading" label="Đăng nhập" class="w-full h-12 lg:h-14 !text-base lg:!text-lg mt-1"
              type="submit" :disabled="isLoading" />

            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <Checkbox v-model="checked" inputId="remember" name="remember" binary size="large" />
                <label for="remember" class="text-sm lg:text-normal">Nhớ mật khẩu</label>
              </div>
              <router-link to="/" class="text-primary text-sm lg:text-base font-light hover:underline">Quên mật
                khẩu?</router-link>
            </div>
          </form>
        </div>
      </div>

      <!-- Right side image - Hidden on mobile and small tablets -->
      <div v-if="!isMobile" class="hidden lg:flex w-1/2 justify-center">
        <div class="bg-[#D9D9D9] rounded-3xl overflow-hidden w-[75%] h-[75vh]">
          <img src="../../../assets/img/FOXAI.jpg" alt="login-bg" class="w-full h-full object-cover"
            style="filter: contrast(90%)" />
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.custom_password input {
  width: 100% !important;
}

.login-container {
  min-height: 100vh;
  min-height: 100dvh;
  /* Dynamic viewport height for mobile */
}

/* Mobile optimizations */
@media (max-width: 767px) {
  .login-container {
    padding: 1rem;
  }

  /* Adjust input styling for mobile */
  :deep(.p-inputtext) {
    font-size: 16px !important;
    /* Prevent zoom on iOS */
  }

  :deep(.p-password input) {
    font-size: 16px !important;
    /* Prevent zoom on iOS */
  }

  /* Mobile-friendly button */
  :deep(.p-button) {
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }

  /* Improve touch targets */
  :deep(.p-checkbox) {
    transform: scale(1.2);
  }

  /* Better spacing for mobile */
  .flex.flex-col.gap-4>* {
    margin-bottom: 0.5rem;
  }
}

/* Tablet optimizations */
@media (min-width: 768px) and (max-width: 1023px) {
  .login-container {
    padding: 2rem;
  }
}

/* Desktop optimizations */
@media (min-width: 1024px) {
  .login-container {
    height: 100vh;
  }
}

/* Landscape mobile optimization */
@media (max-width: 767px) and (orientation: landscape) {
  .login-container {
    padding: 0.5rem;
  }

  .w-full.max-w-md.mx-auto {
    max-width: 90%;
  }

  .text-center.mb-8 {
    margin-bottom: 1rem;
  }

  .mt-8.rounded-2xl {
    margin-top: 1rem;
  }

  .h-40 {
    height: 8rem;
  }
}

/* High DPI displays */
@media (-webkit-min-device-pixel-ratio: 2),
(min-resolution: 192dpi) {
  img {
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
  }
}

/* Focus styles for accessibility */
:deep(.p-inputtext:focus),
:deep(.p-password input:focus) {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

:deep(.p-button:focus) {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

/* Loading state improvements */
:deep(.p-button[data-pc-section="loadingicon"]) {
  margin-right: 0.5rem;
}

/* Improve password visibility toggle */
:deep(.p-password-toggle-mask) {
  padding: 0.5rem;
  touch-action: manipulation;
}

/* Dark mode adjustments */
@media (prefers-color-scheme: dark) {
  .bg-red-50 {
    background-color: rgba(239, 68, 68, 0.1);
  }

  .text-zinc-900 {
    color: #f4f4f5;
  }
}

/* Reduce motion for users who prefer it */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Improve contrast for better accessibility */
.text-primary {
  color: var(--primary-600);
}

.text-primary:hover {
  color: var(--primary-700);
}

/* Loading overlay improvements */
:deep(.p-component-overlay) {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
}

/* Form validation improvements */
.text-red-500 {
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}

/* Safe area for notched devices */
@supports (padding: max(0px)) {
  .login-container {
    padding-left: max(1rem, env(safe-area-inset-left));
    padding-right: max(1rem, env(safe-area-inset-right));
    padding-top: max(1rem, env(safe-area-inset-top));
    padding-bottom: max(1rem, env(safe-area-inset-bottom));
  }
}
</style>