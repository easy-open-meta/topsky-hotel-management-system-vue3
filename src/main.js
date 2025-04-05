import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import i18n from './i18n';
import { registerAntdIcons } from '@/utils/icons';

const app = createApp(App);

app.use(router);
app.use(i18n);
registerAntdIcons(app);


app.mount('#app');

window.i18n = i18n;
