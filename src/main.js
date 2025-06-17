import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import '@/assets/styles.scss';
import Aura from '@primevue/themes/aura';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import Notification from './service/Notification';

import Loading from './components/Loading.vue';
import locale from './service/primevueLocale';

const app = createApp(App);

const pinia = createPinia();

app.use(router);
app.use(pinia);
app.use(Notification);

app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.app-dark'
        }
    }, locale: locale,
});
app.component('Loading', Loading)

app.use(ToastService);
app.use(ConfirmationService);

app.mount('#app');
