<template>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0 20px; display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center;">
          <img src="../assets/vue.svg" alt="Logo" style="height: 40px; margin-right: 10px;" />
          <span style="font-size: 20px; font-weight: bold;">Top Sky 酒店管理系统-后台管理系统</span>
        </div>
        <div>
          <a-button type="link">Sign in</a-button>
          <a-button type="link">Sign up</a-button>
        </div>
      </a-layout-header>
      <a-layout>
        <a-layout-sider width="200" style="background: #fff; padding: 10px;">
          <a-menu mode="inline" :selected-keys="[$route.path]" style="border-right: 0;overflow-y: auto;">
            <a-menu-item key="/" >
                    <router-link to="/">首页</router-link>
            </a-menu-item>
            <a-sub-menu key="basicinfo" title="基础信息维护">
                <a-menu-item key="/about">
                    <router-link to="/about">About</router-link>
                </a-menu-item>
            </a-sub-menu>
          </a-menu>
        </a-layout-sider>
        <a-layout-content style="padding: 24px; background: #f0f2f5;">
          <router-view />
        </a-layout-content>
      </a-layout>
      <a-layout-footer style="text-align: center;">
        © 2024 My System
      </a-layout-footer>
    </a-layout>
  </template>
  
  <script setup>
  import { useRoute } from 'vue-router';
  const route = useRoute()
  </script>
  