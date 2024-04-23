<template>
  <el-card class="lab-management">
    <div class="search-head">
      <el-input
          type="text"
          prefix-icon="search"
          v-model="queryForm.search"
          placeholder="请输入关键字"
          style="width: 340px; margin-right: 20px;"
          @change="fetchLabs"
      >
      </el-input>

      <!-- <el-button type="primary" size="small" class="newBtn" @click="newFunc">新建+</el-button> -->

    </div>
    <el-container>
    <el-table :data="labs" style="width: 100%">
      <el-table-column prop="labId" label="化验ID"></el-table-column>
      <el-table-column prop="labName" label="化验名"></el-table-column>
      <el-table-column prop="labCost" label="价格(rmb)"></el-table-column>
      <el-table-column prop="description" label="药品描述"  width="400px"></el-table-column>

      <!-- <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="editLab(row)">学习</el-button>

        </template>

      </el-table-column> -->
    </el-table>
    </el-container>

    <el-pagination
        :current-page="page.value"
        :page-size="pageSize.value"
        :total="totalLabs"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
        style="margin-top: 20px;"
        layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </el-card>
</template>
<script setup lang="ts">
import axios from 'axios';
import { ElMessage } from 'element-plus'
import { ref, onMounted } from 'vue';
import { ElTable, ElTableColumn, ElButton, ElPagination } from 'element-plus';
import { useRouter } from 'vue-router';
import {getCase, deleteCase, getCaseById, getCate, getCasesByCate, getIll, getCasesByIll} from "@/api/case.js";
import { embedText, pineconeAdd, pineconeDelete } from '@/components/usePinecone';


const router = useRouter();
const queryForm = ref({
  search: '',
  pagenum: 1,
  pagesize: 10
});
onMounted(() => {
  fetchLabs();
});
// 定义变量和方法
const labs = ref([]); // 化验列表数据
// {
//   "labId": 2,
//     "labName": "name",
//     "labCost": 10.0
// },
const totalLabs = ref<number>(0); // 总化验数量
const page = ref<number>(1); // 当前页码
const pageSize = ref<number>(10); // 每页显示数量
const changeVisible = ref(false);
const addVisible = ref(false)

const form = ref({
  labId: 0,
  labCost: 0,
  labName: '',
  description: ''
})
const newLab = ref({
  saveToPinecone: false,
  lab_name: '',
  lab_cost: '',
  description: ''
})

const newFunc = () => {
  addVisible.value = true;
}

const handlePageChange = (newPage) => {
  // 处理页码变化的逻辑
  page.value = newPage;
  fetchLabs();
};

const handleSizeChange = (newSize) => {
  // 处理每页显示数量变化的逻辑
  pageSize.value = newSize;
  fetchLabs();
};

const fetchLabs = async () => {
  console.log('化验管理页面加载');
  try {
    const params = new URLSearchParams({
      search: queryForm.value.search.toString(),
      page: page.value.toString(),
      pageSize: pageSize.value.toString()
    }).toString();
    console.log('params:', params)
    const token = sessionStorage.getItem('token');
    const response = await axios.get(`/api/lab/getall?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('获取化验组:', response.data);
    if (response.data && response.status === 200) {
      if (response.data.lab_list) {
        labs.value = response.data.lab_list;
        totalLabs.value = response.data.lab_list.length;

        ElMessage({
        message: '获取化验组成功',
        type: 'success',
      });
      }else{
        ElMessage.info(response.data.error_message)
      }
      
    } else {
      ElMessage.error(`获取化验组失败: ${response.data.error_message}`);
    }
  } catch (error) {
    console.error('获取化验组错误:', error);
    ElMessage.error('获取化验组错误');
  }
};

</script>
<style>

</style>
