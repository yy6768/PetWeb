<template>
    <main class="registration-container" :style="{ backgroundImage: 'url(' + backgroundSvg + ')' }">
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
            <div style="font-size: 30px; text-align: center; padding: 50px; color: #333">用户注册🐒</div>

            <a-form name="basic" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" :model="formState" @finish="onFinish">
                <a-form-item label="电子邮箱" name="email" :rules="emailRules">
                    <a-input v-model:value="formState.email" />
                </a-form-item>
                <a-form-item label="用户名" name="username" :rules="usernameRules">
                    <a-input v-model:value="formState.username" />
                </a-form-item>
                <a-form-item label="密码" name="password" :rules="passwordRules">
                    <a-input-password v-model:value="formState.password" />
                </a-form-item>
                <a-form-item label="确认密码" name="confirmPassword" :rules="confirmPasswordRules">
                    <a-input-password v-model:value="formState.confirmPassword" />
                </a-form-item>

                <a-form-item :wrapper-col="{ span: 24 }" class="form-item-submit">
                    <div style="display: flex; justify-content: center;">

                        <a-button html-type="submit" @click="onReturn" style="margin-right: 30px;">返回</a-button>

                        <a-button type="primary" html-type="submit" @click="onRegister">注册</a-button>
                    </div>

                </a-form-item>
            </a-form>
        </div>
    </main>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import backgroundSvg from '../../assets/background.svg';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

interface FormState {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
}

// Replace the following rules with your actual validation logic
const emailRules = [{ required: true, message: '请输入您的电子邮箱', type: 'email' }];


// 添加额外的规则来验证用户名和密码
const usernameRules = [
  { required: true, message: '请输入您的用户名' },
  { min: 3, max: 16, message: '用户名长度应为3到16位' }
];

const passwordRules = [
  { required: true, message: '请输入您的密码' },
  { min: 6, message: '密码长度不能少于6位' } // 假设密码最小长度为6位
];

const confirmPasswordRules = [
  { required: true, message: '请确认您的密码' },
  // 使用validate方法来确保密码一致性
  { validator: (rule, value) => {
      if (value === formState.password) {
        return Promise.resolve();
      }
      return Promise.reject('两次输入的密码不一致');
    },
    trigger: 'blur' // 触发验证时机
  }
];

const formState = reactive<FormState>({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
});


const onReturn = () => {
    router.push('/login');
};

const onRegister = async () => {
    try {
        const response = await axios.post('/api/register', {
            email: formState.email,
            username: formState.username,
            password: formState.password,
            confirmPassword: formState.confirmPassword,
        });
        if (response.data && response.data.msg === '注册成功') {
            router.push('/login');
        } else {
            console.error('注册失败:', response.data.msg);
        }
    } catch (error) {
        console.error('注册错误:', error);
    }
};
const onFinish = async (values: FormState) => {
    // Here you would handle the form submission for registration.
    // This could involve an HTTP request to your backend to create the new user account.
    console.log('Received form values:', values);
    try {
        const response = await axios.post('/api/register', values);
        if (response.data.success) {
            // Registration was successful
            router.push('/login');
        } else {
            // Handle errors, e.g., show a message to the user
        }
    } catch (error) {
        console.error('Registration error:', error);
    }
};
</script>

<style scoped>
.registration-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-size: cover;
    background-position: center;
}


.registration-form {
    max-width: 300px;
    width: 100%;
}
</style>