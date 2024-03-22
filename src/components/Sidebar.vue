<template>
  <a-layout-sider :style="{ mode: 'horizontal', height: '100%', position: 'fixed', left: 0, top: 0, bottom: 0 }">
    <a-menu v-model:selectedKeys="selectedKeys" mode="inline">
      <a-menu-item v-for="item in menuItems" :key="item.key" @click="navigateTo(item.path)">
        <laptop-outlined />

        <span class="nav-text">{{ item.title }}</span>
      </a-menu-item>

      <a-sub-menu v-if="hasAuthority" key="sub1">
        <template #title>
          <span>
            <user-outlined />
            <span class="nav-text">后台管理</span>
          </span>
        </template>
        <a-menu-item v-for="manageItem in manageMenuItems" :key="manageItem.key" @click="navigateTo(manageItem.path)">
          <user-outlined />
          {{ manageItem.title }}
        </a-menu-item>
      </a-sub-menu>

    </a-menu>
  </a-layout-sider>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons-vue';

const router = useRouter();
const selectedKeys = ref([] as string[]);

const authority = sessionStorage.getItem('authority');
const hasAuthority = ref(authority === '1');

const menuItems = ref([
  { key: '1', title: '角色扮演', path: '/role-preview' },
  { key: '2', title: '病例学习', path: '/case-study' },
  { key: '3', title: '全景导览', path: '/panorama-tour' },
  { key: '4', title: '分析测评', path: '/analysis-evaluation' },
  { key: '5', title: 'AI对话', path: '/ai-chat' },

]);

const manageMenuItems = ref([
  { key: 'manage-cases', title: '案例管理', path: '/manage-cases' },
  { key: 'manage-exams', title: '考试管理', path: '/manage-exams' },
  { key: 'manage-questions', title: '题目管理', path: '/manage-questions' },
  { key: 'manage-users', title: '用户管理', path: '/manage-users' },
  { key: 'manage-drugs', title: '药品管理', path: '/manage-drugs' },
  { key: 'manage-assays', title: '化验管理', path: '/manage-assays' },

]);

const navigateTo = (path: string) => {
  selectedKeys.value = [path];
  router.push(path);
};
</script>

<style scoped>
/* Your styles */
</style>