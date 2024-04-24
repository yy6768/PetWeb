<template>
  <el-card >
  <div class="search-head">
    <el-input
        type="text"
        prefix-icon="search"
        v-model="queryForm.search"
        placeholder="请输入关键字"
        style="margin-right: 20px; width: 340px;"
        @change="fetchMedications">
    </el-input>
    <!-- <el-button type="primary" size="small" class="newBtn" @click="newFunc">新建+</el-button> -->

  </div>
  <div class="medication-management">
    <el-table :data="medications" style="width: 100%">
      <el-table-column prop="medicineId" label="药品ID"></el-table-column>
      <el-table-column prop="medicineName" label="药品名"></el-table-column>
      <el-table-column prop="medicineCost" label="价格(rmb)"></el-table-column>
      <el-table-column prop="description" label="药品描述" width="400px"></el-table-column>

    </el-table>

    <el-pagination
        :current-page="page"
        :page-size="pageSize"
        :total="totalMedications"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
        style="margin-top: 20px;"
        layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
    </el-card >

</template>
<script setup lang="ts">
import axios from 'axios';
import { ElMessage } from 'element-plus'
import { ref, onMounted } from 'vue';
import { ElTable, ElTableColumn, ElButton, ElPagination } from 'element-plus';
import { useRouter } from 'vue-router';
import OpenAI from "openai";
import { embedText, pineconeAdd,pineconeDelete, pineconeUpdate } from '@/components/usePinecone';

const queryForm = ref({
  search: '',
  pagenum: 1,
  pagesize: 10
})
const router = useRouter();
onMounted( () => {
  fetchMedications();
});
// 定义变量和方法
const medications = ref([]); // 药品列表数据
const totalMedications = ref<number>(0); // 总药品数量
const page = ref<number>(1); // 当前页码
const pageSize = ref<number>(10); // 每页显示数量
const changeVisible = ref(false)
const addVisible = ref(false)
const form = ref({
  medicine_id: '',
  medicine_name: '',
  medicine_cost: '',
  description: ''
})
const newMedicine = ref({
  medicine_name: '',
  medicine_cost: '',
  description:'',
  saveToPinecone: true
})

const handlePageChange = (newPage) => {
  // 处理页码变化的逻辑
  page.value = newPage;
  fetchMedications();
};

const handleSizeChange = (newSize) => {
  // 处理每页显示数量变化的逻辑
  pageSize.value = newSize;
  fetchMedications();
};
const fetchMedications = async () => {
  console.log('药品管理页面加载');
  try {
    const params = new URLSearchParams({
      search: queryForm.value.search,
      page: page.value.toString(),
      pageSize: pageSize.value.toString()
    }).toString();
    console.log('params:', params)
    const token = sessionStorage.getItem('token');
    const response = await axios.get(`/api/medications/getall?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.data && response.status === 200) {
      if (response.data.medicine_list) {
        medications.value = response.data.medicine_list;  // Assuming that medication list is returned under the 'medicine_list' key
        totalMedications.value = response.data.total;
        ElMessage({
        message: '获取药品组成功',
        type: 'success',
      });
      }else{
        ElMessage.info('没有药品数据');
      }

    } else {
      ElMessage.error(`获取药品组失败: ${response.data.error_message}`);
    }
  } catch (error) {
    console.error('获取药品组错误:', error);
    ElMessage.error('获取药品组错误');
  }
};

</script>
<style>

</style>
