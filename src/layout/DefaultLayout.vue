<template>
    <a-layout has-sider>
        <Sidebar />

      <a-layout :style="{ marginLeft: '200px' }">
        <a-layout-header :style="{ background: '#fff', padding: 0 }" />
        <a-layout-content :style="{ margin: '24px 16px 0', overflow: 'initial' }">
            <RouterView />
        </a-layout-content>

      </a-layout>
    </a-layout>
  </template>
  <script lang="ts" setup>
  import { ref } from 'vue';
  import { RouterView } from 'vue-router';
  import Sidebar from '../components/Sidebar.vue'; // 确保路径正确
  import {
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
    BarChartOutlined,
    CloudOutlined,
    AppstoreOutlined,
    TeamOutlined,
    ShopOutlined,
  } from '@ant-design/icons-vue';
  const selectedKeys = ref<string[]>(['4']);
  </script>
  <style scoped>

  .site-layout .site-layout-background {
    background: #fff;
  }
  
  [data-theme='dark'] .site-layout .site-layout-background {
    background: #141414;
  }
  </style>
  