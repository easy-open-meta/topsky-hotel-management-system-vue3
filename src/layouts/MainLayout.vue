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
              <a-select-option value="zh-CN">简体中文</a-select-option>
              <a-select-option value="en-US">English</a-select-option>
         </a-select>
      </div>
    </a-layout-header>
    <a-layout>
        <a-layout-sider
          width="280"
          style="background: #fff; padding: 10px; max-height: 100vh; overflow-y: auto;"
        >
          <a-menu 
          mode="inline" 
          :selected-keys="[currentRouteKey]"
          :open-keys="openKeys"
          @openChange="handleOpenChange"
        >
          <template v-for="item in menuData" :key="item.key">
            <RecursiveMenu :item="item" />
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
import { ref, onMounted, watchEffect, onBeforeMount, onUnmounted, watch, nextTick } from 'vue';
import { useStorage } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router';
import { showErrorNotification } from '@/utils/index';
import { fetchMenusTree } from '../api/menuapi';
import { 
  BaseFields
} from '@/entities/common.entity';

import { useI18n } from 'vue-i18n';
import RecursiveMenu from './Menu/RecursiveMenu.vue';
import { emitter } from '@/utils/eventBus';

const findActiveKeys = (items, targetPath, parents = []) => {
    const exactMatch = items.find(item => item.path === targetPath);
      if (exactMatch) {
      currentRouteKey.value = exactMatch.key;
      return parents;
    }

    const dynamicMatch = items.find(item => {
      if (!item.path) return false;
      const regex = new RegExp(`^${item.path.replace(/:\w+/g, '\\w+')}$`);
      return regex.test(targetPath);
    });
    if (dynamicMatch) {
      currentRouteKey.value = dynamicMatch.key;
      return [...parents, dynamicMatch.key];
    }

    for (const item of items) {
      if (item.path && route.path.startsWith(item.path)) {
        currentRouteKey.value = item.key;
        return parents;
      }
      if (item.children) {
        const found = findActiveKeys(item.children, targetPath, [...parents, item.key]);
        if (found) return found;
      }
    }
    return null;
  };

const route = useRoute();
const router = useRouter();
const menuData = ref([]);
const username = ref('');
const isLoggedIn = ref(false);
const { locale,t } = useI18n();
const currentLocale = ref(locale.value);
const openKeys = useStorage('menu-open-keys', [])
const currentRouteKey = ref('');

const refreshMenu = async () => {
  try {
    const rawData = await fetchMenusTree({
      [BaseFields.USER_TOKEN]: localStorage.getItem('token')
    });
    const currentOpenKeys = [...openKeys.value];
    const processMenuItems = (items) => {
      return items.map(item => ({
        key: item.Key,
        title: `message.${item.Key}`,
        path: item.Path?.replace(/\/$/, '') || '',
        icon: item.Icon,
        children: item.Children ? processMenuItems(item.Children) : undefined
      }));
    };
    menuData.value = processMenuItems(rawData);
    openKeys.value = currentOpenKeys;
  } catch (error) {
    console.error('菜单刷新失败:', error);
  }
};

const eventHandler = () => {
  refreshMenu();
};

watchEffect(() => {
  const activeKeys = findActiveKeys(menuData.value, route.path) || [];
  openKeys.value = [
    ...([
      ...activeKeys,
      ...openKeys.value
    ])
  ];
});

const handleLanguageChange = (value) =>{
  localStorage.setItem('locale', value);
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
    await refreshMenu();
  } catch (error) {
    showErrorNotification(t('message.fetchMenuError'));
  }
  emitter.on('refresh-menu', eventHandler);
});

onUnmounted(() => {
  emitter.off('refresh-menu', eventHandler);
});

const handleOpenChange = (keys) => {
  openKeys.value = keys;
};

watch(() => route.path, async (newPath) => {
  await nextTick();
  const activeKeys = findActiveKeys(menuData.value, newPath) || [];
  openKeys.value = [...new Set([...openKeys.value, ...activeKeys])];
  checkLoginStatus();
},{ immediate: true });
</script>

<style>
.ant-menu-submenu > .ant-menu {
  background: #fafafa !important;
}

.ant-menu-submenu .ant-menu-submenu > .ant-menu {
  background: #fff !important;
}

.ant-menu-item {
  padding-left: 24px !important;
}

.ant-menu-submenu > .ant-menu-item {
  padding-left: 40px !important;
}

.ant-menu-submenu .ant-menu-submenu > .ant-menu-item {
  padding-left: 56px !important;
}
</style>