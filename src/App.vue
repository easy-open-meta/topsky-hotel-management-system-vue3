<template>
  <ConfigProvider :locale="antdLocale">
    <GlobalNotification />
    <router-view />
  </ConfigProvider>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { showNotification } from './utils/index.js';
import GlobalNotification from './components/GlobalNotification.vue';
import { checkTokenValidity } from './utils/auth';
import { useI18n } from 'vue-i18n';
import { ConfigProvider } from 'ant-design-vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import enUS from 'ant-design-vue/es/locale/en_US';

const { locale } = useI18n();
const antdLocale = ref(zhCN);

const changeLanguage = (language) => {
    localStorage.setItem('locale', language);
    locale.value = language;
};

watch(
    () => locale.value,
    (newLocale) => {
        if (newLocale === 'zh-CN') {
            antdLocale.value = zhCN;
        } else {
            antdLocale.value = enUS;
        }
    },
    { immediate: true }
);

onMounted(() => {
  window.$notification = showNotification;
  checkTokenValidity();
});
</script>
