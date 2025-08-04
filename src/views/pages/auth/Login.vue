<script setup>
import AuthService from "@/service/AuthService";
import { useAuthStore } from "@/stores/useAuth";
import { useToast } from "primevue";
import { getCurrentInstance, ref } from "vue";
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
  <div class="bg-white dark:bg-surface-950 flex items-center justify-center overflow-hidden">
    <div class="relative w-1/2 min-h-screen flex items-center">
      <div class="w-full flex mt-60 flex-col h-[75vh] max-w-[60%] mx-auto">
        <img class="w-52 absolute top-10" src="../../../assets/img/Logo_Original-1.png" alt="Logo" />

        <!-- Wrap trong form để xử lý submit đúng cách -->
        <form @submit.prevent="login" class="flex flex-col gap-4 md:gap-5 mt-6 md:mt-8">
          <div class="flex flex-col gap-2">
            <h2 class="m-0"><strong>Đăng nhập</strong></h2>
            <h5 class="text-zinc-900 font-medium text-base m-0">
              Xin chào bạn, đăng nhập để tiếp tục!
            </h5>
          </div>

          <div>
            <FloatLabel variant="in">
              <InputText id="text" v-model="account" class="h-14 w-full !text-lg" :invalid="submit && !account"
                @keypress="handleKeyPress" :disabled="isLoading" />
              <label class="text-normal" for="text">Email</label>
            </FloatLabel>
            <small class="text-red-500" v-if="!account && submit">Vui lòng nhập email</small>
          </div>

          <div>
            <FloatLabel variant="in" class="mt-1">
              <Password fluid id="password" v-model="password" :invalid="submit && !password" class="h-14 !text-lg"
                toggleMask @keypress="handleKeyPress" :disabled="isLoading">
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
              <label class="text-normal" for="password">Mật khẩu</label>
            </FloatLabel>
            <small class="text-red-500" v-if="!password && submit">Vui lòng nhập mật khẩu</small>
          </div>

          <!-- Hiển thị thông báo lỗi nếu có -->
          <div v-if="loginFail" class="text-red-500 text-sm bg-red-50 p-3 rounded">
            Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng thử lại.
          </div>

          <Button :loading="isLoading" label="Đăng nhập" class="w-full h-12 md:h-14 !text-base md:!text-lg mt-1"
            type="submit" :disabled="isLoading" />

          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <Checkbox v-model="checked" inputId="remember" name="remember" binary size="large" />
              <label for="remember" class="text-normal">Nhớ mật khẩu</label>
            </div>
            <router-link to="/" class="text-primary text-base font-light hover:underline">Quên mật khẩu?</router-link>
          </div>

          <!-- <div class="flex items-center gap-2">
            <hr class="w-full" />
            <span class="text-zinc-400 text-lg">Hoặc</span>
            <hr class="w-full" />
          </div>

          <div class="text-zinc-600 text-base text-center">
            Bạn chưa có tài khoản?
            <router-link to="/auth/signup" class="text-primary font-medium hover:underline">Đăng ký ngay</router-link>
          </div> -->
        </form>
      </div>
    </div>
    <div class="w-1/2 flex justify-center">
      <div class="bg-[#D9D9D9] rounded-3xl overflow-hidden w-[75%] h-[75vh]">
        <img src="../../../assets/img/FOXAI.jpg" alt="login-bg" class="w-full h-full object-cover"
          style="filter: contrast(90%)" />
      </div>
    </div>
  </div>
</template>

<style>
.custom_password input {
  width: 100% !important;
}
</style>