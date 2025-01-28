<template>
  <div>
    <h1>{{ pageTitle }} Page</h1>
    <p>Welcome to the {{ pageTitle }} page!</p>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import { getPageTitle } from '@/utils/pageTitle';

const route = useRoute();

const pageTitle = computed(() => {
    return getPageTitle(route.path);
});
</script>
