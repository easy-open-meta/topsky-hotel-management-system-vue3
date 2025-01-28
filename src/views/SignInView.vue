<template>
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh;">
      <a-card title="Sign In" style="width: 400px">
        <a-form :model="form" @finish="onFinish" @finish-failed="onFinishFailed">
          <a-form-item label="Username" name="username" :rules="[{ required: true, message: 'Please input your username!' }]">
            <a-input v-model:value="form.username" />
          </a-form-item>
          <a-form-item label="Password" name="password" :rules="[{ required: true, message: 'Please input your password!' }]">
            <a-input-password v-model:value="form.password" />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" html-type="submit" :loading="loading">Sign In</a-button>
          </a-form-item>
          <p style="text-align: right;">
            <router-link to="/signup">Don't have an account? Sign Up</router-link>
          </p>
        </a-form>
      </a-card>
    </div>
  </template>
  
  <script setup>
  import { reactive, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { signIn } from '../api/basicapi';
  
  const router = useRouter();
  const loading = ref(false);
  const form = reactive({
    username: '',
    password: '',
  });
  
  const onFinish = async () => {
    loading.value = true;
    try {
      const response = await signIn(form);
      if (response && response.token) {
        localStorage.setItem('token', response.token);
        router.push('/');
         window.$notification('success', '登录成功', '欢迎回来');
      } else {
        window.$notification('error', '登录失败', '请检查用户名和密码');
      }
    } catch (error) {
        console.error('SignIn error:', error);
        window.$notification('error', '登录失败', '请稍后重试');
    } finally {
      loading.value = false;
    }
  };
  
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  </script>
  