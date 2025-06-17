import { defineStore } from 'pinia';

export const useAuthStore = defineStore('useAuth', {
    state: () => ({
        isLoggedIn: false,  // trạng thái đăng nhập
        user: null,         // thông tin người dùng, có thể là object hoặc null
        token: null,        // token khi người dùng đăng nhập
    }),

    getters: {
        getUser: (state) => state.user,
        isAuthenticated: (state) => state.isLoggedIn,
        getToken: (state) => state.token,
    },

    actions: {
        login(user, token) {
            this.user = user;
            this.token = token;
            this.isLoggedIn = true;
        },

        logout() {
            this.user = null;
            this.token = null;
            this.isLoggedIn = false;
            localStorage.removeItem('auth_token');

        },

        loadFromStorage() {
            const token = localStorage.getItem('auth_token');
            const user = localStorage.getItem('auth_user_id');
            if (token) {
                this.token = token;
                this.isLoggedIn = true;
                this.user = JSON.parse(user);
            }
        },

    },

})
