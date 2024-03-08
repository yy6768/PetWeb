<template>
    <div class="about">
      <h1>This is 病例学习</h1>
      <p> Post test</p>

      <p>{{ testData }}</p>
    </div>
  </template>
  
  <script setup lang="ts">
import axios from 'axios';
import { onMounted, ref } from 'vue';

const testData = ref<string>('');
onMounted(async () => {
  try {
      const response = await axios.post('/api/test2', {
        key: 'value' // 你要POST的数据
      });
      console.log(response.data); // 假设后端返回的是 { message: 'Test2 response' }
      testData.value = response.data.message;
    } catch (error) {
      console.error(error);
    }
})
</script>
<style>

</style>
  