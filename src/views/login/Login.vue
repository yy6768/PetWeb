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

        <a-form-item name="remember" :wrapper-col="{ offset: 8, span: 16 }">
          <a-checkbox v-model:checked="formState.remember">Remember me</a-checkbox>
        </a-form-item>


        <a-form-item :wrapper-col="{ span: 24 }" style="text-align: center;">
          <div style="display: flex; justify-content: center;">
            <a-button type="primary" html-type="submit" @click="onRegister" style="margin-right: 30px;">注册</a-button>
            <a-button type="default" html-type="button" @click="onLogin">登录</a-button>
          </div>
        </a-form-item>

      </a-form>
    </div>
  </main>
</template>

<script lang="ts" setup>
import backgroundSvg from '../../assets/background.svg';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { message } from 'ant-design-vue';

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


    
    if (response.data && response.data.error_message === 'success') {
      // Optionally store the user's authority level in sessionStorage
      message.success('登录成功');
      sessionStorage.setItem('authority', '1');
      //sessionStorage.setItem('authority', response.data.authority);
      router.push('/home');
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
