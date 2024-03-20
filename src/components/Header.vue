<template>
    <div class="header">
      <div class="logo">Pet System</div>
      <div class="profile">
        <a-dropdown>
          <a class="ant-dropdown-link" @click="e => e.preventDefault()">
            <a-avatar icon="<UserOutlined />" /> <a-icon type="down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item key="1">修改密码</a-menu-item>
            <a-menu-item key="2" @click="logout">登出</a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { Avatar, Dropdown, Menu } from 'ant-design-vue';
  import { UserOutlined } from '@ant-design/icons-vue';
  
  const logout = () => {
    // Your logout logic here
  };
  </script>
  
  <style scoped>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: aqua;
  }
  
  .logo {
    font-size: 20px;
    font-weight: bold;
  }
  
  .profile {
    cursor: pointer;
  }
  </style>
  