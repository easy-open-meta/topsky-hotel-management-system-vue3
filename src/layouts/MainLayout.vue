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
          src="../assets/vue.svg"
          alt="Logo"
          style="height: 40px; margin-right: 10px"
        />
        <span style="font-size: 20px; font-weight: bold"
          >Top Sky 酒店管理系统-后台管理系统</span
        >
      </div>
      <div>
        <router-link to="/signin">
          <a-button type="link">Sign in</a-button>
        </router-link>
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
      © 2024 My System
    </a-layout-footer>
  </a-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { fetchMenus } from '../api/menuapi';

const route = useRoute();
const menuData = ref([]);

onMounted(async () => {
  try {
    const data = await fetchMenus();
    menuData.value = data;
  } catch (error) {
    console.error('Failed to fetch menu data:', error);
    window.$notification('error', '获取菜单失败', '请稍后重试');
  }
});
</script>
