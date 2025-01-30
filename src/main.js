import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import i18n from './i18n';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

const app = createApp(App);

app.use(Antd);
app.use(router);
app.use(i18n);


app.mount('#app');

window.i18n = i18n;
