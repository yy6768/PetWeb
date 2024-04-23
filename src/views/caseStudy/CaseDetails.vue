<template>
  <el-card>
    <div>
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/case-study' }">病例学习</el-breadcrumb-item>
        <el-breadcrumb-item>病例编号{{caseDetails.cid}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-descriptions bordered title="病例详细信息" column="1" style="margin-top: 10px;">
      <el-descriptions-item label="病例编号：">{{ caseDetails.cid }}</el-descriptions-item>
      <el-descriptions-item label="病种：">{{ cate_name }}</el-descriptions-item>
      <el-descriptions-item label="疾病名称：">{{ ill_name }}</el-descriptions-item>
      <el-descriptions-item label="就诊医师：">{{ username }}</el-descriptions-item>
      <el-descriptions-item label="记录日期：">{{ formatDate(caseDetails.date) }}</el-descriptions-item>
      <el-descriptions-item label="基本情况：" v-if="caseDetails.basicSituation">{{ caseDetails.basicSituation }}</el-descriptions-item>
      <el-descriptions-item label="诊断结果：" v-if="caseDetails.result">{{ caseDetails.result }}</el-descriptions-item>
      <el-descriptions-item label="治疗方法：" v-if="caseDetails.therapy">{{ caseDetails.therapy }}</el-descriptions-item>
      <el-descriptions-item label="手术视频：" v-if="caseDetails.surgeryVideo">
        <video controls :src="caseDetails.surgeryVideo" style="max-width: 100%;"></video>
      </el-descriptions-item>
      <el-descriptions-item label="相关图片：" v-if="caseDetails.photo">
        <img :src="caseDetails.photo" alt="相关图片" style="max-width: 100%;">
      </el-descriptions-item>
      <el-descriptions-item label="相关化验: " v-if="labTableData">
      <el-tag size="large" v-for="lab in labTableData" :key="lab.labId" type="success" style="margin-left: 10px">
        {{ lab.lab_name }}
      </el-tag>
    </el-descriptions-item>
    <el-descriptions-item label="相关药品: " v-if="medTableData">
      <el-tag size="large" v-for="med in medTableData" :key="med.medicineId" type="info" style="margin-left: 10px">
        {{ med.medicineName }}
      </el-tag>
    </el-descriptions-item>


    </el-descriptions>




  </el-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import {getCase, deleteCase, getCaseById, getCate, getCasesByCate, getIll, getCasesByIll} from "@/api/case.js";

const route = useRoute();
const cate_name = ref('');
const ill_name = ref('');
const username = ref('');
const caseDetails = ref({});
const labTableData = ref([]);
const medTableData = ref([]);

const getCaseDetails = () => {
  const storedDetails = sessionStorage.getItem('caseDetails');
  return storedDetails ? JSON.parse(storedDetails) : null;
};

onMounted(async () => {
  const cid = route.params.cid;
  cate_name.value = getCaseDetails().cateName;
  ill_name.value = getCaseDetails().illName;
  username.value = getCaseDetails().username;
  getCaseById('', sessionStorage.getItem('token'), cid).then((res) => {
    caseDetails.value = res.data.case;
    labTableData.value = res.data.lab_item;
    medTableData.value = res.data.medicine_item;
  });
});

function formatDate(date) {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
}
</script>
