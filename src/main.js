import { createApp } from 'vue';
import { onAuthStateChanged } from 'firebase/auth';
import App from './App.vue';
import router from './router';
import store from './store';
import { projectAuth } from './firebase/config';

// import global style
import './assets/main.scss';

// Mencegah terjadinya redirect ke halaman login
let app = null;
onAuthStateChanged(projectAuth, () => {
    if (!app) {
        app = createApp(App).use(store).use(router).mount('#app');
    }
});
