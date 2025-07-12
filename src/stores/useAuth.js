import { defineStore } from 'pinia';

export const useAuthStore = defineStore('useAuth', {
    state: () => ({
        isLoggedIn: false,
        user: null,
        access_token: null,
    }),

    getters: {
        getUser: (state) => state.user,
        isAuthenticated: (state) => state.isLoggedIn,
        getToken: (state) => state.access_token,
    },

    actions: {
        login(user, access_token) {
            this.user = user;
            this.access_token = access_token;
            this.isLoggedIn = true;
        },

        logout() {
            this.user = null;
            this.access_token = null;
            this.isLoggedIn = false;
            localStorage.removeItem('auth_token');
            // localStorage.removeItem('auth_user_id');
        },

        loadFromStorage() {
            const token = localStorage.getItem('auth_token');
            // const user = localStorage.getItem('auth_user_id');
            
            if (token) {
                this.access_token = token;
                this.isLoggedIn = true;
                
            }
        },

    },
});