<template>
  <main class="login-container" :style="{ backgroundImage: 'url(' + backgroundSvg + ')' }">
    <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
      <div style="font-size: 50px; text-align: center; padding: 50px; color: #333">虚拟宠物医院系统🐒</div>
      <a-form class="login-form" :model="formState" name="basic" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }"
        autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed">
        <a-form-item label="Username" name="username"
          :rules="[{ required: true, message: 'Please input your username!' }]">
          <a-input v-model:value="formState.username" />
        </a-form-item>
  
        <a-form-item label="Password" name="password"
          :rules="[{ required: true, message: 'Please input your password!' }]">
          <a-input-password v-model:value="formState.password" />
        </a-form-item>
  
        <a-form-item name="remember" :wrapper-col="{ offset: 8, span: 16 }">
          <a-checkbox v-model:checked="formState.remember">Remember me</a-checkbox>
        </a-form-item>
  
        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
          <a-button type="primary" html-type="submit" @click="onSubmit">Submit</a-button>
        </a-form-item>
      </a-form>
    </div>
  </main>
</template>

<script lang="ts" setup>
import backgroundSvg from '../assets/background.svg';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

const onSubmit = () => {
  router.push('/home');
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
