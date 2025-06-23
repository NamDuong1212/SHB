<script setup>
import AuthService from '@/service/AuthService';
import { useToast } from "primevue";
import { getCurrentInstance, onBeforeMount, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const toast = useToast();
const { proxy } = getCurrentInstance();
const route = useRoute();
const router = useRouter()
const username = ref('')
const email = ref('');
const password = ref('');
const loading = ref(false);
const isLoading = ref(false);
const checked = ref(false);
const submit = ref(false);
const validateEmail = (value) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(value);
};

const validate = () => {
    if (!email.value || !password.value) {

        return false;
    }
    if (!validateEmail(email.value)) {
        return false; // Trả về true nếu có lỗi
    }

    return true;
};

const register = async () => {
    try {
        submit.value = true;
        isLoading.value = true;

        const { data } = await AuthService.register(username.value, email.value, password.value);
        console.log(data);
        if (data.user) {
            proxy.$notify('S', 'Tạo tài khoản thành công!', toast)
            setTimeout(() => {
                router.push("/auth/login");
            }, 200)
        }
    } catch (error) {
        proxy.$notify('E', error.response?.data?.error, toast)
    } finally {
        isLoading.value = false;
    }
};
onBeforeMount(async () => {
    isLoading.value = true;
    const token = route.query.token;
    if (token) {
        const res = await $api.get(`/auth/google/callback?token=${token}`);
        accountService.createAccount({ token }, false);
        navigateTo('/');
    }
    isLoading.value = false;
});
</script>

<template>
    <Loading v-if="isLoading" />
    <div class="bg-white dark:bg-surface-950 flex items-center justify-center overflow-hidden">
        <div class="w-1/2 flex justify-center">
            <div class="bg-[#D9D9D9] rounded-3xl overflow-hidden w-[75%] h-[75vh]">
                <img src="../../../assets/img/logo1.png" alt="login-bg" class="w-full h-full object-cover"
                    style="filter: contrast(90%)" />
            </div>
        </div>
        <div class="relative w-1/2 min-h-screen flex items-center">
            <div class="w-full flex mt-60 flex-col h-[75vh] max-w-[60%] mx-auto">
                <img class="w-52 absolute top-10 right-52" src="../../../assets/img/Logo_Original-1.png" alt="Logo" />
                <div class="flex flex-col gap-4 md:gap-5 mt-6 md:mt-8">
                    <div class="flex flex-col gap-2">
                        <h2 class="m-0 text-right"><strong>Đăng ký</strong></h2>
                        <h5 class="text-zinc-900 text-right font-medium text-base m-0">Đăng ký tài khoản ngay!</h5>
                    </div>
                    <div>
                        <FloatLabel variant="in">
                            <InputText id="username" v-model="username" :invalid="(submit && !username)"
                                class="h-14 w-full !text-lg" />
                            <label class="text-normal" for="username">Username</label>
                        </FloatLabel>
                        <small class="text-red-500" v-if="!username && submit">Vui lòng nhập tên người dùng
                        </small>
                    </div>
                    <div>
                        <FloatLabel variant="in">
                            <InputText id="email" v-model="email"
                                :invalid="(!validateEmail(email) && email) || (submit && !email)"
                                class="h-14 w-full !text-lg" />
                            <label class="text-normal" for="email">Email</label>
                        </FloatLabel>
                        <small class="text-red-500" v-if="!validateEmail(email) && email">Vui lòng nhập địa chỉ email
                            hợp lệ</small>
                        <small class="text-red-500" v-if="!email && submit">Vui lòng nhập địa chỉ email</small>
                    </div>
                    <div>
                        <FloatLabel variant="in" class="mt-1">
                            <Password fluid id="password" v-model="password" :invalid="submit && !password"
                                class="h-14 !text-lg" toggleMask>
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

                    <Button :loading="loading" label="Đăng ký" class="w-full h-12 md:h-14 !text-base md:!text-lg mt-1"
                        @click="register" />
                    <div class="flex items-center justify-between gap-2">
                        <div class="flex items-center gap-2">
                            <Checkbox v-model="checked" inputId="remember" name="remember" binary size="large" />
                            <label for="remember" class="text-normal">Nhớ mật khẩu</label>
                        </div>
                        <router-link to="/" class="text-primary text-base font-light hover:underline">Quên mật
                            khẩu?</router-link>
                    </div>
                    <div class="flex items-center gap-2">
                        <hr class="w-full" />
                        <span class="text-zinc-400 text-lg">Hoặc</span>
                        <hr class="w-full" />
                    </div>

                    <div class="text-zinc-600 text-base text-center">
                        Trở lại trang
                        <router-link to="/auth/login" class="text-primary font-medium hover:underline">Đăng
                            nhập</router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Toast></Toast>
</template>

<style>
.custom_password input {
    width: 100% !important;
}
</style>
