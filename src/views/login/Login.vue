<template>
  <main class="login-container" :style="{ backgroundImage: 'url(' + backgroundSvg + ')' }">
    <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
      <div style="font-size: 50px; text-align: center; padding: 50px; color: #333">虚拟宠物医院系统🐒</div>
      <a-form class="login-form" :model="formState" name="basic" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }"
        autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed">
        <a-form-item label="用户名" name="username"
          :rules="[{ required: true, message: 'Please input your username!' }]">
          <a-input v-model:value="formState.username" />
        </a-form-item>

        <a-form-item label="密码" name="password"
          :rules="[{ required: true, message: 'Please input your password!' }]">
          <a-input-password v-model:value="formState.password" />
        </a-form-item>


        <a-form-item :wrapper-col="{ span: 24 }" style="text-align: center;">
          <div style="display: flex; justify-content: center;">
            <a-button type="default" html-type="button" @click="onLogin" style="margin-right: 30px;">登录</a-button>
            <a-button type="primary" html-type="submit" @click="onRegister" >注册</a-button>
          </div>
        </a-form-item>

      </a-form>
    </div>
  </main>
</template>

<script lang="ts" setup>
import backgroundSvg from '/background.svg';
import { reactive, ref } from 'vue';
import axios from 'axios';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const onRegister = () => {
  router.push('/register');
};

const onLogin = async () => {

  try {
    const params = new URLSearchParams({
            username: formState.username,
            password: formState.password,
        }).toString();

    const response = await axios.post(`/api/user/login?${params}`);

    if (response.data && response.status === 200) {
      // Optionally store the user's authority level in sessionStorage
      message.success('登录成功');
      sessionStorage.setItem('authority', response.data.authority);
      sessionStorage.setItem('token', response.data.token);
      sessionStorage.setItem('uid', response.data.uid);
      sessionStorage.setItem('username', response.data.username);

      router.push('/role-preview');
    } else {
      // Handle login failure
      message.error(`登录失败: ${response.data.error_message}`);

      console.error('Login failed:', response.data.msg);
    }
  } catch (error) {
    message.error(`登录错误`);

    console.error('Login error:', error);
  }
};


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
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-size: cover;
  background-position: center;
}

.login-form {
  max-width: 300px;
  width: 100%;
}
</style>
