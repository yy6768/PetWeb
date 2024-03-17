<template>
    <a-layout-sider
      :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0 }"
    >
      <div class="logo" />
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <a-menu-item v-for="item in menuItems" :key="item.key" @click="navigateTo(item.path)">
          <span class="nav-text">{{ item.title }}</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  const selectedKeys = ref([] as string[]);
  
  const menuItems = ref([
    { key: '1', title: '角色扮演', path: '/role-preview' },
    { key: '2', title: '病例学习', path: '/case-study' },
    { key: '3', title: '全景导览', path: '/panorama-tour' },
    { key: '4', title: '分析测评', path: '/analysis-evaluation' },
  ]);
  
  const navigateTo = (path: string) => {
    selectedKeys.value = [path];
    router.push(path);
  };
  </script>
  
  <style scoped>
  /* Your styles */
  </style>
  