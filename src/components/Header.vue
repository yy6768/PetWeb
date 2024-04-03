<template>
  <div class="header">
    <div style="margin-left: 10px; font-size: 32px;">🐶🐱🐯</div>
    <div class="profile">
      <a-dropdown>
        <a @click="e => e.preventDefault()" style="display: flex; align-items: center;">
            <div style="color: aliceblue;">
              {{ username }}
            </div>
            <a-avatar shape="square" :size="32" style="margin-right: 10px; margin-left: 10px;">
              <template #icon>
                <UserOutlined />
              </template>
            </a-avatar>
        </a>
        <template #overlay>
          <a-menu style="margin-top: 10px;">
            <a-menu-item>
              <a-button @click="showChangeUsername">改用户名</a-button>
            </a-menu-item>
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
    <a-modal v-model:open="openPwdChange" title="修改密码" @ok="onPwdFinish">
      <a-form :model="formState"  autocomplete="off" @finishFailed="onFinishFailed">
        <a-form-item label="旧密码" name="oldPassword" :rules="[{ required: true, message: '输入旧密码' }]">
          <a-input v-model:value="formState.oldPassword" />
        </a-form-item>

        <a-form-item label="新密码" name="newPassword" :rules="[{ required: true, message: '输入新密码' }]">
          <a-input-password v-model:value="formState.newPassword" />
        </a-form-item>

      </a-form>
    </a-modal>

    <a-modal v-model:open="openUsernameChange" title="修改用户名" @ok="handleOk">
      <a-form :model="formState"  autocomplete="off"
              @finish="onUsernameFinish" @finishFailed="onFinishFailed">
        <a-form-item label="新用户名" name="newUsername" >
          <a-input v-model:value="newUsername" />
        </a-form-item>

      </a-form>
    </a-modal>

  </div>

</template>

<script setup lang="ts">
import {Avatar, Dropdown, Menu, message} from 'ant-design-vue';
import { UserOutlined } from '@ant-design/icons-vue';
import { ref, reactive } from 'vue';
import axios from "axios";
import { useRouter } from 'vue-router';

const router = useRouter();

const username = ref<string>(sessionStorage.getItem('username') || 'Null');
const openPwdChange = ref<boolean>(false);
const openUsernameChange = ref<boolean>(false);
const newUsername = ref<string>('');

interface FormState {
  username: string;
  oldPassword: string;
  newPassword: string;
}

const formState = reactive<FormState>({
  username: '',
  oldPassword: '',
  newPassword: ''
});

const onPwdFinish = async (values: any) => {
  try {
    const token = sessionStorage.getItem('token');
    const uid = sessionStorage.getItem('uid');
    const params = new URLSearchParams({
      uid: uid,
      old_password: formState.oldPassword,
      new_password: formState.newPassword
    }).toString();

    const response = await axios.post(`/api/user/update_password?${params}`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.data && response.data.error_message === 'success') {
      // Optionally store the user's authority level in sessionStorage
      message.success('修改成功');
      logout();
    } else {
      // Handle login failure
      message.error(`修改失败: ${response.data.error_message}`);
      console.error('change failed:', response.data.msg);
    }
  } catch (error) {
    message.error(`修改错误`);
  }
  console.log('Success:', values);
};
const onUsernameFinish = async (values: any) => {
  try {
    const token = sessionStorage.getItem('token');
    const uid = sessionStorage.getItem('uid');
    const params = new URLSearchParams({
      uid: uid,
      username: newUsername.value
    }).toString();

    const response = await axios.post(`/api/user/update_username?${params}`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.data && response.data.error_message === 'success') {
      // Optionally store the user's authority level in sessionStorage
      message.success('修改成功');
      logout();
    } else {
      // Handle login failure
      message.error(`修改失败: ${response.data.error_message}`);
      console.error('change failed:', response.data.msg);
    }
  } catch (error) {
    message.error(`修改错误`);
  }
  console.log('Success:', values);
};


const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};

const logout = () => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('uid');
  sessionStorage.removeItem('authority');
  sessionStorage.setItem('username', newUsername.value);
  router.push('/login');
};

const showChangePwd = () => {
  openPwdChange.value = true;

};
const showChangeUsername = () => {
  openUsernameChange.value = true;
};

const handleOk = (e: MouseEvent) => {
  console.log(e);
  openPwdChange.value = false;
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
