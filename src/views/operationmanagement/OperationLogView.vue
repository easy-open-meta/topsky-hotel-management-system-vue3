<template>
  <div>
    <h1>{{ translatedPageTitle }}</h1>
    <p>Welcome to the {{ translatedPageTitle }} page!</p>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import { getPageTitle } from '@/utils/pageTitle';
import { useI18n } from 'vue-i18n';

const route = useRoute();

const { t, locale } = useI18n();
const pageTitleKey = computed(() => getPageTitle(route.path));
const translatedPageTitle = computed(() => t(pageTitleKey.value));
</script>
