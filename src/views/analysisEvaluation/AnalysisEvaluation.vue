<template>
  <div class="about">
    <el-card>
      <div>
        <el-breadcrumb :separator-icon="ArrowRight" class="breadcrumb">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>分析测评</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-table :data="exams" stripe>
      <el-table-column prop="exam_name" label="考试名称"></el-table-column>
      <el-table-column prop="beginTime" label="开始时间" :formatter="formatTime"></el-table-column>
      <el-table-column prop="endTime" label="结束时间" :formatter="formatTime"></el-table-column>
      <el-table-column label="我的得分">
        <template #default="{ row }">
          <span v-if="row.grade === null">未参加</span>
          <span v-else>{{ row.grade }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="totalMark" label="试卷总分"></el-table-column>

      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button 
            type="primary" 
            size="small" 
            @click="handleExamAction(row)"
            v-if="row.grade !== null || new Date() > new Date(row.endTime)"
          >
          查看详情
          </el-button>
          <el-button 
            type="success" 
            size="small" 
            @click="handleExamAction(row)"
            v-else>
          开始考试
          </el-button>
        </template>
      </el-table-column>


    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      style="margin-top: 20px"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalExams">
    </el-pagination>
    </el-card>
  </div>

</template>

<script setup lang="ts">
import axios from 'axios';
import {computed, onMounted, ref} from 'vue';
import {ArrowRight, Search} from "@element-plus/icons-vue";
import { getUserExam, getAllUser } from '@/api/exam.js'; // Adjust the import path as necessary
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
const route = useRouter();
const searchKey = ref("");
const searchType = ref("试卷名");
const tmpRow = ref();//当前处理行

const exams = ref([]);
const totalExams = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const dialogVisible = ref(false);
const handleExamAction = (row) => {
  const now = new Date();
  const startTime = new Date(row.beginTime);
  const endTime = new Date(row.endTime);
  if(row.grade !== null){
    route.push({
        name: 'paper-finished',
        params: { eu_id: row.eu_id, paper_id: row.paper_id }
      });
  }else{
    
    if (now < startTime) {
      ElMessage.warning('考试还未开始，请耐心等待！');
    } else if (now > endTime) {
      // Redirect to view exam details if the exam has finished
      route.push({
        name: 'paper-finished',
        params: { eu_id: row.eu_id, paper_id: row.paper_id }
      });
    } else {
      // Confirm start exam if it's the correct time
      ElMessageBox.confirm(
        '考试即将开始，你准备好了吗？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        // User confirmed they want to start the exam
        route.push({
          name: 'paper',
          params: { eu_id: row.eu_id, paper_id: row.paper_id }
        });
      })
    }
  }
};

const fetchExams = async () => {
  const token = sessionStorage.getItem('token');
  const response = await getUserExam(token, currentPage.value, pageSize.value,sessionStorage.getItem('uid'));
  console.log(response)
  if (response.status === 200) {
    exams.value = response.data.exam_list;
    totalExams.value = response.data.total;
    ElMessage.success("获取考试列表成功");
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

onMounted(fetchExams);

const startExam = (row) => {
  const now = new Date();
  const startTime = new Date(row.beginTime);
  const endTime = new Date(row.endTime);

  if (now < startTime) {
    ElMessage.warning('考试还未开始，请耐心等待！');
    // route.push({
    //     name: 'paper',
    //     params: { eu_id: row.eu_id }
    //   });

  } else if (now > endTime) {
    ElMessage.error('考试已经结束！');
    // route.push({
    //     name: 'paper',
    //     params: { eu_id: row.eu_id }
    //   });
  } else {
    ElMessageBox.confirm(
      '考试即将开始，你准备好了吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(() => {
      // The user confirmed they want to start the exam
      console.log("开始考试", row);
      route.push({
        name: 'paper',
        params: { eu_id: row.eu_id, paper_id: row.paper_id }
      });
    }).catch(() => {
      // The user cancelled the exam start
      console.log("取消考试");
    });
  }
};

</script>


<style>
.search-head{
  position: relative;
  height: 8vh;
  display: flex;
}
.search-box{
  width: 20vw;
  height: 4.5vh;
  position: relative;
}
.search-btn{
  position: relative;
  left: 2vw;
  border:0.1vw solid #57a3e3;
}
.search-box:hover{
}
.search-type{
  width: 6vw;
  position: relative;
  left: 1vw;
}
.pagination{
  position: relative;
  top: 1vh;
}
.breadcrumb{
  height: 4.5vh;
  position: relative;
}
</style>
  