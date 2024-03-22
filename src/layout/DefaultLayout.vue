<template>
  <a-layout>
    <a-layout-header>
      <Header />    
    </a-layout-header>
    <a-layout :style="{ marginTop: '64px'}" >
      <Sidebar :style="{ marginTop: '64px' ,background:'white' }"/>
      <a-layout :style="{ marginLeft: '220px'}">
        <a-layout-content >
          <RouterView />
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { RouterView } from 'vue-router';
import Sidebar from '../components/Sidebar.vue';
import Header from '../components/Header.vue';

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
</script>
<style lang="scss" scoped>
.ant-layout-header {
  position: fixed;
  top: 0;
  z-index: 1;
  width: 100%;
  background: #0082f0;
  border: 0;
  padding: 0;
  margin-left: -8px;
}
</style>