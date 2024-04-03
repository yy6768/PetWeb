<template>
  <div class="role-selection">
    <a-radio-group v-model:value="selectedRole" @change="onRoleChange">
      <a-radio-button value="receptionist">前台</a-radio-button>
      <a-radio-button value="assistant">医助</a-radio-button>
      <a-radio-button value="doctor">医师</a-radio-button>
    </a-radio-group>
    <div style="margin: 15px">
      <a-steps  v-if="selectedRole === 'receptionist'" v-model:current="current">
        <a-step title="客户接待" description="欢迎到访的客户，提供咨询服务。" />

        <a-step title="预约管理" description="安排和管理客户的预约时间。" />
        <a-step title="档案管理" description="维护客户和宠物的档案记录。" />
      </a-steps>
      <a-steps  v-if="selectedRole === 'assistant'" v-model:current="current">
        <a-step title="检查准备" description="准备检查室，确保所有设备就绪。" />
        <a-step title="辅助检查" description="在医师检查期间协助操作设备。" />
        <a-step title="采集样本" description="负责采集宠物的血液和其他生物样本。" />
      </a-steps>
      <a-steps  v-if="selectedRole === 'doctor'" v-model:current="current">
        <a-step title="诊疗宠物" description="根据宠物的症状进行诊断。" />
        <a-step title="处方药物" description="根据诊断结果开具药物。" />
        <a-step title="执行手术" description="在必要时为宠物进行手术治疗。" />
      </a-steps>
    </div>

  </div>
</template>


<script setup lang="ts">
import { ref, watch } from 'vue';

const selectedRole = ref('receptionist');
const current = ref<number>(0);
watch(current, () => {
  console.log(current.value);
})
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
