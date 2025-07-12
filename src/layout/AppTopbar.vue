<script setup>
import { useLayout } from "@/layout/composables/layout";
import { useAuthStore } from "@/stores/useAuth";
import Menu from 'primevue/menu';
import { onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import AppConfigurator from "./AppConfigurator.vue";

const { toggleMenu, toggleDarkMode, isDarkTheme, layoutState } = useLayout();
const authStore = useAuthStore(); // Use auth store

const router = useRouter();
const topbarMenuActive = ref(false);
const menu = ref();

const items = ref([
  {
    label: 'Kiểm tra Token',
    icon: 'pi pi-key',
    command: () => {
      checkAccessToken()
    }
  },
  {
    label: 'Đăng xuất',
    icon: 'pi pi-sign-out',
    command: () => {
      funSignOut()
    }
  },
]);

// Debug để kiểm tra items
console.log('Menu items:', items.value);

// Function to check access token
const checkAccessToken = () => {
  const token = localStorage.getItem('auth_token');
  
  if (!token) {
    alert('Không có token trong localStorage');
    return;
  }

  try {
    // Decode JWT token to get expiration time
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      alert('Token không hợp lệ (định dạng sai)');
      return;
    }

    const payload = JSON.parse(atob(tokenParts[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    
    let message = `Token Info:\n`;
    message += `- Token: ${token.substring(0, 50)}...\n`;
    message += `- Trạng thái store: ${authStore.isAuthenticated ? 'Đã đăng nhập' : 'Chưa đăng nhập'}\n`;
    
    if (payload.exp) {
      const expirationTime = new Date(payload.exp * 1000);
      message += `- Hết hạn: ${expirationTime.toLocaleString('vi-VN')}\n`;
      
      if (currentTime > payload.exp) {
        message += `- Trạng thái: Token đã hết hạn ❌`;
      } else {
        const remainingTime = payload.exp - currentTime;
        const hours = Math.floor(remainingTime / 3600);
        const minutes = Math.floor((remainingTime % 3600) / 60);
        message += `- Trạng thái: Token còn hiệu lực ✅\n`;
        message += `- Thời gian còn lại: ${hours}h ${minutes}m`;
      }
    } else {
      message += `- Trạng thái: Không thể xác định thời gian hết hạn`;
    }
    
    alert(message);
  } catch (error) {
    console.error('Lỗi khi kiểm tra token:', error);
    alert(`Lỗi khi giải mã token: ${error.message}`);
  }
};

// Tối ưu toggle menu với debounce
let toggleTimeout = null;
const optimizedToggleMenu = () => {
  if (toggleTimeout) {
    clearTimeout(toggleTimeout);
  }

  toggleTimeout = setTimeout(() => {
    toggleMenu();
  }, 10);
};

// Toggle dropdown menu với keyboard support
const toggle = (event) => {
  menu.value.toggle(event);
};

// Toggle topbar menu với animation
const onTopBarMenuButton = () => {
  topbarMenuActive.value = !topbarMenuActive.value;
};

// Đóng menu khi click outside
const handleClickOutside = (event) => {
  const topbarMenu = document.querySelector('.layout-topbar-menu');
  const menuButton = document.querySelector('.layout-topbar-menu-button');
  const userButton = document.querySelector('[aria-controls="overlay_menu"], [aria-controls="overlay_menu_mobile"]');

  if (topbarMenu && menuButton &&
    !topbarMenu.contains(event.target) &&
    !menuButton.contains(event.target) &&
    (!userButton || !userButton.contains(event.target))) {
    topbarMenuActive.value = false;
  }
};

// Đóng menu khi nhấn Escape
const handleEscapeKey = (event) => {
  if (event.key === 'Escape') {
    topbarMenuActive.value = false;
    if (menu.value) {
      menu.value.hide();
    }
  }
};

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('keydown', handleEscapeKey);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('keydown', handleEscapeKey);
  if (toggleTimeout) {
    clearTimeout(toggleTimeout);
  }
});

const funSignOut = async () => {
  try {
    localStorage.removeItem('auth_token');
    authStore.logout(); // Update store state
    await router.push('/auth/login');
  } catch (error) {
    console.error('Lỗi đăng xuất:', error);
  }
};
</script>

<template>
  <div class="layout-topbar bg-gradient-to-r from-[#006ca7] to-[#4db9ed]">
    <div class="layout-topbar-logo-container">
      <router-link to="/" class="layout-topbar-logo">
        <div class="flex items-center gap-2 w-full">
          <img class="w-20 lg:w-28 h-auto" src="https://fox.ai.vn/wp-content/uploads/2016/08/logowhite-1536x645.png"
            alt="" />
        </div>
      </router-link>
    </div>

    <button class="p-link layout-topbar-menu-button layout-topbar-button" @click="onTopBarMenuButton()"
      aria-label="Toggle topbar menu" :aria-expanded="topbarMenuActive.toString()">
      <!-- <i class="pi pi-ellipsis-v transition-transform duration-200" :class="{ 'rotate-90': topbarMenuActive }"></i> -->
    </button>
    
    <div class="layout-topbar-actions">
      <div class="layout-config-menu">
        <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
          <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
        </button>
        
        <!-- Add standalone token check button -->
        <button type="button" class="layout-topbar-action" @click="checkAccessToken" 
          title="Kiểm tra Access Token">
          <i class="pi pi-key"></i>
        </button>
        
        <div class="relative">
          <AppConfigurator />
        </div>
      </div> 

      <!-- Desktop Menu -->
      <div class="hidden lg:block">
        <div class="layout-topbar-menu"
          :class="{ 'animate-scalein': topbarMenuActive, 'animate-fadeout': !topbarMenuActive }"
          v-show="topbarMenuActive">
          <div class="layout-topbar-menu-content">
            <button @click="toggle" type="button" aria-haspopup="true" aria-controls="overlay_menu"
              class="layout-topbar-action">
              <i class="pi pi-user"></i>
              <span>Profile</span>
            </button>
            <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
          </div>
        </div>
      </div>

      <!-- Mobile Menu - Hiển thị trực tiếp menu items -->
      <div class="flex items-center gap-2">
        <button @click="toggle" type="button" aria-haspopup="true" aria-controls="overlay_menu_mobile"
          class="layout-topbar-action p-2 text-white hover:bg-white/10 rounded-lg transition-colors">
          <i class="pi pi-user text-lg"></i>
        </button>
        <button class="p-link layout-menu-button layout-topbar-button h-full" @click="optimizedToggleMenu()"
          aria-label="Toggle menu"
          :aria-expanded="(layoutState.staticMenuDesktopInactive || layoutState.staticMenuMobileActive || layoutState.overlayMenuActive).toString()"
          :class="{ 'menu-active': layoutState.staticMenuDesktopInactive || layoutState.staticMenuMobileActive || layoutState.overlayMenuActive }">
          <i class="pi pi-bars text-white"></i>
        </button>
        <Menu ref="menu" id="overlay_menu_mobile" :model="items" :popup="true" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Animation cho topbar menu button (không áp dụng cho hamburger) */
.layout-topbar-menu-button .pi-ellipsis-v {
  transition: all 0.3s ease-in-out;
}

.layout-topbar-menu-button:hover .pi-ellipsis-v {
  transform: scale(1.1);
}

.layout-menu-button.menu-active .pi-bars {
  color: #fbbf24 !important;
  /* Màu vàng khi menu active */
}

/* Animation cho topbar menu */
.layout-topbar-menu {
  transition: all 0.3s ease-in-out;
}

/* Cải thiện visual feedback */
.layout-topbar-button:active {
  transform: scale(0.95);
  transition: transform 0.1s ease-in-out;
}

/* Focus states cho accessibility */
.layout-topbar-button:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
  border-radius: 4px;
}

/* Styling cho token check button */
.layout-topbar-action .pi-key {
  color: #fbbf24;
  transition: all 0.3s ease;
}

.layout-topbar-action:hover .pi-key {
  color: #f59e0b;
  transform: scale(1.1);
}

/* Animation cho menu content */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }

  to {
    opacity: 0;
    transform: translateY(-10px);
  }
}

.animate-scalein {
  animation: slideIn 0.3s ease-out forwards;
}

.animate-fadeout {
  animation: slideOut 0.3s ease-in forwards;
}

/* Đảm bảo Menu component hiển thị đúng */
:deep(.p-menu) {
  z-index: 9999 !important;
}

:deep(.p-menu .p-menuitem-link) {
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #374151;
  transition: all 0.2s;
}

:deep(.p-menu .p-menuitem-link:hover) {
  background-color: #f3f4f6;
  color: #1f2937;
}

:deep(.p-menu .p-menuitem-icon) {
  font-size: 1rem;
}

/* Mobile menu adjustments */
@media (max-width: 1024px) {
  :deep(.p-menu) {
    margin-top: 0.5rem;
  }
}
</style>