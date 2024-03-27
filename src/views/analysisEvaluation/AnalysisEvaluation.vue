<script setup lang="ts">
import axios from 'axios';
import {computed, onMounted, ref} from 'vue';
import {ArrowRight, Search} from "@element-plus/icons-vue";

const searchKey = ref("");
const searchType = ref("试卷名");
const tmpRow = ref();//当前处理行

const totalAccount = computed(() =>{
  return testData.value.length;
});
const currentPage = ref(1);
const pageSize = ref(10);

const handleSizeChange = (newSize) =>{
  pageSize.value = newSize;
  currentPage.value = 1;  // 重置为第一页
}
const handlePageChange = (newPage) =>{
  currentPage.value = newPage;
}

const types = ref([{
  id:0,
  value:"试卷名"
},
{
  id:1,
  value:"试卷id"
},{
  id:2,
  value:"出卷人"
}]);
const testData = ref([
{
  id:0,
  name:"第一场考试",
  maker:"user1",
  startTime:"2023-03-15 09:00:00",
  finishTime:"2023-04-15 09:00:00",
  limitTime:"90分钟",
  total:100,
  isFinished:false,
  grade:0,
  paper:"http://www.baidu.com"
},
{
  id:1,
  name:"第2场考试",
  maker:"user2",
  startTime:"2023-03-15 09:00:00",
  finishTime:"2023-04-15 09:00:00",
  limitTime:"90分钟",
  total:100,
  isFinished:true,
  grade:90,
  paper:"http://www.baidu.com"
}

]);
const showModal = (row) =>{
  if(row.isFinished){
    openFinishedExam(row.paper)
    console.log("用户查看考试结果，考试id为：" + row.id);
  }
  else {
    const confirmed = window.confirm('确认要开始考试吗？');
    if (confirmed) {
      // 用户确认后跳转到考试页面
      openExam(row.paper)
      console.log("用户开始考试，考试id为：" + row.id);
    }
  }
}
const openFinishedExam = (url) =>{
  //打开已完成考试页面，查看考试结果
  console.log(url)
  window.open(url, '_blank');
}
const openExam = (url) =>{
  //打开考试页面
  console.log(url)
  window.open(url, '_blank');
}
const search = () =>{
  console.log("搜索关键词:" + searchKey.value)
  console.log("搜索类型:" + searchType.value)
}
/*onMounted(async () => {
  try {
      const response = await axios.get('/api/test1');
      console.log(response.data); // 假设后端返回的是 { message: 'Test1 response' }
      testData.value = response.data.message;
    } catch (error) {
      console.error(error);
    }
})*/
</script>

<template>
  <div class="about">
    <el-card>
      <div>
        <el-breadcrumb :separator-icon="ArrowRight" class="breadcrumb">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>病例学习</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-container class="search-head">
        <el-input
            type="text"
            prefix-icon="search"
            v-model="searchKey"
            placeholder="请输入关键字"
            class="search-box"
        >
        </el-input>
        <el-select class="search-type" v-model="searchType" placeholder="请选择">
          <el-option
              v-for="item in types"
              :key="item.id"
              :label="item.value"
              :value="item.value"
          ></el-option>
        </el-select>
        <el-button class="search-btn" @click="search">搜索</el-button>
      </el-container>
      <el-container>
        <el-table :data="testData" stripe height="67vh">
          <el-table-column prop="id" label="编号" align="center" min-width="10%"></el-table-column>
          <el-table-column prop="name" label="考试名" align="center" min-width="10%">
            <template #default="scope">
              <span @click="showModal(scope.row)">{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="startTime" label="开始时间" align="center" min-width="10%"></el-table-column>
          <el-table-column prop="finishTime" label="结束时间" align="center" min-width="10%"></el-table-column>
          <el-table-column prop="total" label="总分" align="center" min-width="10%"></el-table-column>
          <el-table-column prop="total" label="总分" align="center" min-width="10%"></el-table-column>
          <el-table-column prop="grade" label="成绩" align="center" min-width="10%">
            <template #default="scope">
              <span v-if="scope.row.isFinished">{{scope.row.grade}}</span>
              <span v-else>未完成</span>
            </template>
          </el-table-column>
        </el-table>
      </el-container>
      <el-container style="width: 100%; display: flex; justify-content: center;">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handlePageChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            :total="totalAccount"
            class="pagination">
        </el-pagination>
      </el-container>
    </el-card>
      <!--<h1>This is 分析测评</h1>
      <p> Get test</p>
      <p>{{ testData }}</p>-->
  </div>

</template>

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
  