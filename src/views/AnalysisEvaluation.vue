<template>
    <div class="about">
      <h1>This is 分析测评</h1>
      <p> Get test</p>
      <p>{{ testData }}</p>
    </div>
  </template>
  
<script setup lang="ts">
import axios from 'axios';
import { onMounted, ref } from 'vue';

const testData = ref<string>('');
onMounted(async () => {
  try {
      const response = await axios.get('/api/test1');
      console.log(response.data); // 假设后端返回的是 { message: 'Test1 response' }
      testData.value = response.data.message;
    } catch (error) {
      console.error(error);
    }
})
</script>

  <style>
  
  </style>
  