<template>
  <div class="header">
    <div style="margin-left: 10px; font-size: 32px;">🐶🐱🐯</div>
    <div class="profile">
      <a-dropdown>
        <a class="ant-dropdown-link" @click="e => e.preventDefault()">
          <a-avatar shape="square" :size="32" style="margin-right: 10px;">
            <template #icon>
              <UserOutlined />
            </template>
          </a-avatar>
        </a>
        <template #overlay>
          <a-menu style="margin-top: 10px;">
            <a-menu-item>
              <a-button @click="showChangePwd">修改密码</a-button>
            </a-menu-item>
            <a-menu-item>
              <a-button @click="logout">退出登录</a-button>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
    <a-modal v-model:open="open" title="修改密码" @ok="handleOk">
      <a-form :model="formState"  autocomplete="off"
        @finish="onFinish" @finishFailed="onFinishFailed">
        <a-form-item label="旧密码" name="oldPassword" :rules="[{ required: true, message: '输入旧密码' }]">
          <a-input v-model:value="formState.username" />
        </a-form-item>

        <a-form-item label="新密码" name="newPassword" :rules="[{ required: true, message: '输入新密码' }]">
          <a-input-password v-model:value="formState.password" />
        </a-form-item>

      </a-form>
    </a-modal>
  </div>

</template>

<script setup lang="ts">
import { Avatar, Dropdown, Menu } from 'ant-design-vue';
import { UserOutlined } from '@ant-design/icons-vue';
import router from '@/router';
import { ref, reactive } from 'vue';
const open = ref<boolean>(false);

interface FormState {
  username: string;
  password: string;
  remember: boolean;
}

const formState = reactive<FormState>({
  username: '',
  password: '',
  remember: true,
});
const onFinish = (values: any) => {
  console.log('Success:', values);
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};

const logout = () => {
  router.push('/login');
};

const showChangePwd = () => {
  open.value = true;

};

const handleOk = (e: MouseEvent) => {
  console.log(e);
  open.value = false;
};
</script>

<style scoped lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1890ff;
}
</style>
