<template>
  <a-layout>
    <a-layout-header
      style="
        background: #fff;
        padding: 0 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      "
    >
      <div style="display: flex; align-items: center">
        <img
          src="../assets/logo.ico"
          alt="Logo"
          style="height: 40px; margin-right: 10px"
        />
        <span style="font-size: 20px; font-weight: bold"
          >{{ $t('message.systemName') }}</span
        >
      </div>
      <div style="display: flex; align-items: center;">
        <template v-if="isLoggedIn">
            <a-button type="link" style="margin-right: 10px;">{{ username }}</a-button>
            <a-button type="link" @click="logout" style="margin-right: 10px;">{{ $t('message.logout') }}</a-button>
        </template>
        <template v-else>
          <router-link to="/signin">
            <a-button type="link" style="margin-right: 10px;">{{ $t('message.signin') }}</a-button>
          </router-link>
        </template>
         <a-select v-model:value="currentLocale" style="width: 120px;" @change="handleLanguageChange">
              <a-select-option value="zh">中文</a-select-option>
              <a-select-option value="en">English</a-select-option>
         </a-select>
      </div>
    </a-layout-header>
    <a-layout>
      <a-layout-sider
        width="200"
        style="
          background: #fff;
          padding: 10px;
          max-height: 100vh;
          overflow-y: auto;
        "
      >
        <a-menu
          mode="inline"
          :selected-keys="[$route.path]"
          style="border-right: 0"
        >
          <template v-for="item in menuData" :key="item.key">
            <a-sub-menu v-if="item.children" :key="item.key" :title="item.title">
              <a-menu-item
                v-for="child in item.children"
                :key="child.path"
              >
                <router-link :to="child.path">{{
                  child.title
                }}</router-link>
              </a-menu-item>
            </a-sub-menu>
            <a-menu-item v-else :key="item.path">
              <router-link :to="item.path">{{ item.title }}</router-link>
            </a-menu-item>
          </template>
        </a-menu>
      </a-layout-sider>
      <a-layout-content
        style="padding: 24px; min-height: 280; background: #f0f2f5"
      >
        <router-view />
      </a-layout-content>
    </a-layout>
    <a-layout-footer style="text-align: center">
      © 2024 {{ $t('message.org') }} {{ $t('message.systemName') }}
    </a-layout-footer>
  </a-layout>
</template>

<script setup>
import { ref, onMounted, computed, watch, onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchMenusTree } from '../api/menuapi';
import { useI18n } from 'vue-i18n';

const route = useRoute();
const router = useRouter();
const menuData = ref([]);
const username = ref('');
const isLoggedIn = ref(false);
const { locale } = useI18n();
const currentLocale = ref(locale.value);

const handleLanguageChange = (value) =>{
  locale.value = value;
  currentLocale.value = value;
}

const checkLoginStatus = () => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
        isLoggedIn.value = true;
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            username.value = storedUsername;
        } else {
           username.value = 'User';
        }
    } else {
        isLoggedIn.value = false;
        username.value = '';
    }
};

const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    isLoggedIn.value = false;
    username.value = '';
    router.push('/signin');
};

onBeforeMount(() => {
    currentLocale.value = locale.value;
    checkLoginStatus();
})

onMounted(async () => {
  try {
    const data = await fetchMenusTree();
    menuData.value = data;
  } catch (error) {
    console.error('Failed to fetch menu data:', error);
     window.$notification('error', '获取菜单失败', '请稍后重试');
  }
});

watch(() => route.path, () => {
  checkLoginStatus();
});
</script>
