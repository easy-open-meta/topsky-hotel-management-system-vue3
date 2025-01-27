<template></template>
<script setup>
import { onMounted } from 'vue';
import { showNotification } from '../utils/index.js';

onMounted(() => {
    window.$notification = showNotification;
});
</script>
