<template>
    <div>
      <el-select
        v-model="selectedLabOptions"
        multiple
        placeholder="选择相关化验"
      >
        <el-option
          v-for="item in labOptions"
          :key="item.labId"
          :label="item.labName"
          :value="item.labId"
        />
      </el-select>

      <el-select
        v-model="selectedDrugOptions"
        multiple
        placeholder="选择相关药品"
        style="margin-top: 20px"  
      >
        <el-option
          v-for="item in drugOptions"
          :key="item.medicineId"
          :label="item.medicineName"
          :value="item.medicineId"
        />
      </el-select>
    </div>
    <el-button type="primary" style="margin-top: 20px" @click="confirmSelection">Confirm</el-button>

  </template>
  
  <script setup>
  import { defineProps, defineEmits, ref, watch } from 'vue';
  import { addLabToCase, addDrugToCase, getCaseById, deleteLabToCase, deleteDrugToCase } from "@/api/case.js";
  import { ElMessage } from 'element-plus';
  const props = defineProps({
    labOptions: Array,
    currentCase: Object, // Accept lab as a prop
    drugOptions: Array
  });
  
  watch(() => props.currentCase, async (newCase) => {
  if (newCase && newCase.cid) {
    const response = await getCaseById('', sessionStorage.getItem('token'), newCase.cid);
    console.log("response watch: ",response.data)
    if (response.data.lab_item) {
      selectedLabOptions.value = response.data.lab_item.map(lab => lab.labId);
      prevLabOptions.value = response.data.lab_item.map(lab => lab.labId);
    }
    if (response.data.medicine_item) {
      selectedDrugOptions.value = response.data.medicine_item.map(drug => drug.medicineId);
      prevDrugOptions.value = response.data.medicine_item.map(drug => drug.medicineId);
    }
  }
}, { immediate: true });

  const emit = defineEmits(['confirm']);
  
  const selectedLabOptions = ref([]);
  const selectedDrugOptions = ref([]);

  const prevLabOptions = ref([]);
  const prevDrugOptions = ref([]);

  const confirmSelection = async () => {
    console.log("currentCase: ", props.currentCase)
    for (let i = 0; i< prevLabOptions.value.length; i++) {
        const response = await deleteLabToCase(props.currentCase.cid, prevLabOptions.value[i],sessionStorage.getItem('token'));
        console.log("deleteLabToCase: ", response)
    }
    for (let i = 0; i< prevDrugOptions.value.length; i++) {
        const response = await deleteDrugToCase(props.currentCase.cid, prevDrugOptions.value[i],sessionStorage.getItem('token'));
        console.log("deleteDrugToCase: ", response)
    }
    for (let i = 0; i < selectedLabOptions.value.length; i++) {
      const response = await addLabToCase(props.currentCase.cid, selectedLabOptions.value[i],sessionStorage.getItem('token'));
      console.log("response: ", response)
      
    }
    for (let i = 0; i < selectedDrugOptions.value.length; i++) {
      const response = await addDrugToCase(props.currentCase.cid, selectedDrugOptions.value[i],sessionStorage.getItem('token'));
      console.log("response: ", response)
      
    }
    ElMessage.success('添加成功');
    emit('confirm', selectedLabOptions.value);

  };
  </script>
  