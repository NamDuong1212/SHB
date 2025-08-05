import { defineStore } from 'pinia';

export const useAuthStore = defineStore('useAuth', {
  state: () => ({
    isLoggedIn: false,
    user_id: null,
    access_token: null,
    refresh_token: null,
    token_type: 'bearer',
  }),

  getters: {
    getUserId: (state) => state.user_id,
    isAuthenticated: (state) => state.isLoggedIn,
    getToken: (state) => state.access_token, 
    getAuthorizationHeader: (state) => {
      return state.access_token ? `${state.token_type} ${state.access_token}` : null;
    },
  },

  actions: {
    login(authInfo) {
      this.isLoggedIn = true;
      this.user_id = authInfo.user_id;
      this.access_token = authInfo.access_token;
      this.refresh_token = authInfo.refresh_token;
      this.token_type = authInfo.token_type || 'bearer';

      this.saveToStorage();
    },
    logout() {
      this.isLoggedIn = false;
      this.user_id = null;
      this.access_token = null;
      this.refresh_token = null;

      localStorage.removeItem('auth_data');
    },
    updateTokens(tokenData) {
      this.access_token = tokenData.access_token;
      if (tokenData.refresh_token) {
        this.refresh_token = tokenData.refresh_token;
      }
      this.saveToStorage();
    },
    saveToStorage() {
      const authData = {
        user_id: this.user_id,
        access_token: this.access_token,
        refresh_token: this.refresh_token,
        token_type: this.token_type,
      };
      localStorage.setItem('auth_data', JSON.stringify(authData));
    },

    loadFromStorage() {
      const authDataString = localStorage.getItem('auth_data');

      if (authDataString) {
        try {
          const authData = JSON.parse(authDataString);

          if (authData.access_token) {
            this.isLoggedIn = true;
            this.user_id = authData.user_id;
            this.access_token = authData.access_token;
            this.refresh_token = authData.refresh_token;
            this.token_type = authData.token_type || 'bearer';
          }
        } catch (error) {
          console.error("Lỗi parse dữ liệu auth từ localStorage, đang dọn dẹp...", error);
          this.logout();
        }
      }
    },
  },
});