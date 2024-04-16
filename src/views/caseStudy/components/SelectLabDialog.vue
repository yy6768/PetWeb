<template>
    <div>
      <el-select
        v-model="selectedOptions"
        multiple
        placeholder="选择相关病历"
      >
        <el-option
          v-for="item in options"
          :key="item.labId"
          :label="item.labName"
          :value="item.labId"
        />
      </el-select>

    </div>
    <el-button type="primary" style="margin-top: 20px" @click="confirmSelection">Confirm</el-button>

  </template>
  
  <script setup>
  import { defineProps, defineEmits, ref } from 'vue';
  import { addLabToCase } from "@/api/case.js";
  import { ElMessage } from 'element-plus';
  const props = defineProps({
    options: Array,
    currentCase: Object // Accept lab as a prop
  });
  
  const emit = defineEmits(['confirm']);
  
  const selectedOptions = ref([]);
  
  const confirmSelection = async () => {
    console.log("currentCase: ", props.currentCase)
    for (let i = 0; i < selectedOptions.value.length; i++) {
      const response = await addLabToCase(props.currentCase.cid, selectedOptions.value[i],sessionStorage.getItem('token'));
      console.log("response: ", response)
      
    }
    ElMessage.success('添加成功');
    emit('confirm', selectedOptions.value);

  };
  </script>
  