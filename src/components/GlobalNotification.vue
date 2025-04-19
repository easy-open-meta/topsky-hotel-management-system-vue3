<template></template>
<script setup>
import { onMounted } from 'vue';
import { showErrorNotification,showInfoNotification,showSuccessNotification,showWarningNotification } from '../utils/index.js';

onMounted(() => {
    window.$notification = showInfoNotification;
});
</script>
