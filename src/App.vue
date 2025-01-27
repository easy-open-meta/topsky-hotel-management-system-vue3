<template>
  <GlobalNotification />
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue';
import { showNotification } from './utils/index.js';
import GlobalNotification from './components/GlobalNotification.vue';

onMounted(() => {
  window.$notification = showNotification;
});
</script>