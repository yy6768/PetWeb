<template>
  <a-layout>
    <!-- <a-layout-header :style="{ position: 'fixed', zIndex: 1, width: '100%'}">    
    </a-layout-header> -->
    <a-layout :style="{ marginTop: '64px'}" >
      <Sidebar :style="{ marginTop: '64px'}"/>
      <a-layout :style="{ marginLeft: '200px' }">
        <a-layout-content :style="{ margin: '24px 16px 0', overflow: 'initial' }">
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
const selectedKeys = ref<string[]>(['4']);
</script>
<style scoped>

</style>