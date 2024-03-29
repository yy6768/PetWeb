<template>
  <div class="role-selection">
    <a-radio-group v-model:value="selectedRole" @change="onRoleChange">
      <a-radio-button value="receptionist">前台</a-radio-button>
      <a-radio-button value="assistant">医助</a-radio-button>
      <a-radio-button value="doctor">医师</a-radio-button>
    </a-radio-group>
    <a-collapse v-model:value="activeKey" style="margin-top: 10px;" accordion>
      <a-collapse-panel key="receptionist" v-if="selectedRole === 'receptionist'" header="前台工作流程">
        <!-- 前台工作流程步骤 -->
        <a-steps direction="vertical" :current="1">
          <a-step title="接待访客" description="接待来访的客人并提供所需帮助。" />
          <!-- 更多步骤 -->
        </a-steps>
      </a-collapse-panel>
      <a-collapse-panel key="assistant" v-if="selectedRole === 'assistant'" header="医助工作流程">
        <!-- 医助工作流程步骤 -->
        <a-steps direction="vertical" :current="1">
          <a-step title="准备工具" description="为手术准备必需的医疗工具。" />
          <!-- 更多步骤 -->
        </a-steps>
      </a-collapse-panel>
      <a-collapse-panel key="doctor" v-if="selectedRole === 'doctor'" header="医师工作流程">
        <!-- 医师工作流程步骤 -->
        <a-steps direction="vertical" :current="1">
          <a-step title="诊断病情" description="对患者进行诊断并决定治疗方案。" />
          <!-- 更多步骤 -->
        </a-steps>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>


<script setup lang="ts">
import { ref } from 'vue';

const selectedRole = ref('');

const onRoleChange = (e) => {
  console.log(e.target.value);
  // 这里可以添加更多的逻辑来展示选择的职位的工作流程
};
</script>

<style>
.role-selection {
  /* 样式代码 */
}
.role-description {
  /* 样式代码 */
}
</style>
