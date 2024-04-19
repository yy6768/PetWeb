<template>
  <el-card>
    <el-dialog
      title="新建考试"
      v-model="dialogVisible"
      width="800px"
      height="800px"
      @close="dialogVisible = false"
    >
      <ExamNew/>
    </el-dialog>
    <el-dialog
      title="新建考试"
      v-model="dialogVisible2"
      width="800px"
      height="800px"
      @close="dialogVisible2 = false"
    >
      <ExamModify :eid="eid"/>
    </el-dialog>

    <div class="header">
      <el-button @click="fetchExams">刷新列表</el-button>
      <el-button type="primary" @click="dialogVisible = true">新建考试</el-button>

    </div>
    <el-table :data="exams" stripe>
      <el-table-column prop="examName" label="考试名称"></el-table-column>
      <el-table-column prop="beginTime" label="开始时间" :formatter="formatTime"></el-table-column>
      <el-table-column prop="endTime" label="结束时间" :formatter="formatTime"></el-table-column>
      <el-table-column prop="paperName" label="试卷名称"></el-table-column>
      <el-table-column label="参考人员">
        <template #default="{ row }">
          <el-popover placement="top" trigger="click" width="200">
            <template #reference>
              <el-button type="text">查看参与者</el-button>
            </template>
            <p v-for="(user, index) in row.userList" :key="index">{{ user }}</p>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="editExam(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="deleteExam(row)">删除</el-button>

        </template>

      </el-table-column>

    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalExams">
    </el-pagination>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAllExam, deleteExam } from '@/api/exam';
import ExamNew from './ExamNew.vue';
import ExamModify from './ExamModify.vue';

const exams = ref([]);
const totalExams = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const dialogVisible = ref(false);
const dialogVisible2 = ref(false);
const eid = ref('');
const fetchExams = async () => {
  const token = sessionStorage.getItem('token');
  const response = await getAllExam(token, currentPage.value, pageSize.value,'');
  if (response.data.error_msg === 'success') {
    exams.value = response.data.exam_list;
    totalExams.value = response.data.total;
  } else {
    console.error('Failed to fetch exams:', response.data.error_msg);
  }
};

const formatTime = (row, column, value) => {
  return new Date(value).toLocaleString();
};

const handleSizeChange = (newSize) => {
  pageSize.value = newSize;
  fetchExams();
};

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage;
  fetchExams();
};
const editExam = (row) => {
  dialogVisible2.value = true;
  eid.value = row.eid;
};
onMounted(fetchExams);
</script>
