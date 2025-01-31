<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <h1>404</h1>
      <p>{{ t('message.pageNotFound') }}</p>
      <img src="../../assets/404 NotFound.png" />
      <p>
        Picture design from the
        <a href="https://github.com/SAWARATSUKI/KawaiiLogos" target="_blank">KawaiiLogos</a>
        project, by
        <a href="https://github.com/SAWARATSUKI" target="_blank">SAWARATSUKI</a>.
      </p>

    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();

</script>
<style scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
}

.not-found-content {
  text-align: center;
}
</style>
