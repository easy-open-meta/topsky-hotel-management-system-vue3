<template>
  <div style="display: flex; justify-content: center; align-items: center; height: 100vh;">
    <a-card :title="signInLabel" style="width: 400px">
      <a-form :model="form" @finish="onFinish" @finish-failed="onFinishFailed">
        <a-form-item :label="usernameLabel" name="adminAccount" :rules="[{ required: true, message: 'Please input your username!' }]">
          <a-input v-model:value="form.adminAccount" />
        </a-form-item>
        <a-form-item :label="passwordLabel" name="adminPassword" :rules="[{ required: true, message: 'Please input your password!' }]">
          <a-input-password v-model:value="form.adminPassword" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" :loading="loading">{{ $t('message.signin') }}</a-button>
        </a-form-item>
        <p style="text-align: right;">{{ $t('message.selectYourLang') }}</p>
        <p style="text-align: right;">
          <a-select v-model:value="currentLocale" style="width: 100px;" @change="handleLanguageChange">
            <a-select-option value="zh-CN">简体中文</a-select-option>
            <a-select-option value="en-US">English</a-select-option>
         </a-select>
        </p>
      </a-form>
    </a-card>
  </div>
</template>

<script setup>
import { ref, reactive, onBeforeMount,computed } from 'vue';
import { useRouter } from 'vue-router';
import { showNotification } from '@/utils/index';
import { signIn } from '../api/basicapi';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();
const currentLocale = ref(locale.value);
const handleLanguageChange = (value) =>{
  localStorage.setItem('locale', value);
  locale.value = value;
  currentLocale.value = value;
}

const signInLabel = computed(() => t('message.signin'));
const usernameLabel = computed(() => t('message.username'));
const passwordLabel = computed(() => t('message.password'));

const router = useRouter();
const loading = ref(false);
const form = reactive({
  adminAccount: '',
  adminPassword: '',
});

const onFinish = async () => {
  loading.value = true;
  try {
    const response = await signIn(form);
    if (response && response.user_token) {
      localStorage.setItem('token', response.user_token);
      localStorage.setItem('username',response.AdminName);
      localStorage.setItem('account',response.AdminAccount);
      router.push('/');
       showNotification('success', '登录成功', '欢迎回来');
    } else {
      showNotification('error', '登录失败', '请检查用户名和密码');
    }
  } catch (error) {
      console.error('SignIn error:', error);
      showNotification('error', '登录失败', '请稍后重试');
  } finally {
    loading.value = false;
  }
};

const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

onBeforeMount(() => {
    currentLocale.value = locale.value;
})

</script>
