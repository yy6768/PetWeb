<script setup lang="ts">
import {ArrowRight, Delete, Edit} from "@element-plus/icons-vue";
import {computed, ref} from "vue";
import {message} from "ant-design-vue";
import axios from "axios";
import moment from 'moment';

const token = sessionStorage.getItem("token")
const authority = sessionStorage.getItem("authority")
const uid = sessionStorage.getItem("uid")

const showDetail = ref(false)
const isCreate = ref(false)

const searchType = ref("试卷名")
const searchQuestionType = ref("题目名")
const searchQuestionKey = ref("")
const searchKey = ref("")

const currentPage = ref(1)
const totalAccount = ref(0)
const pageSize = ref(10)
const currentPage_question = ref(1)
const totalAccount_question = ref(0)
const pageSize_question = ref(10)

const tableData = ref([])
const checkQuestionList = ref([])
const allQuestionList = ref([])
const editData = ref({
  paperId: 0,
  paperName: "",
  time: "",
  userName: "",
  date: "",
  questionList: [],
  totalMark: 0,
  hour: 0,
  minute: 0,
  second: 0
})
const typeList = ref([{
  id:0,
  value:"试卷名"
},{
  id:1,
  value:"出卷人"
}])
const questionTypeList = ref([{
  id:0,
  value:"题目名"
},{
  id:1,
  value:"病名"
}])
const search = () =>{
  console.log("搜索")
  if(searchType.value === "试卷名" || searchType.value === "出卷人"){
    console.log("根据试卷名搜索")
    var paramsList = ref({
      page: currentPage.value.toString(),
      pageSize: pageSize.value.toString(),
      type: (searchType.value === "试卷名" ? 0 : 1).toString()
    })
    if(searchKey.value !== ""){
      Reflect.set(paramsList.value, "key", searchKey.value)
    }
    var params = new URLSearchParams(paramsList.value).toString()
    axios.get(`/api/paper/getAll?${params}`,{
      headers:{
        'Authorization':`Bearer ${token}`
      }
    }).then((response) =>{
      console.log(response)
      if(response.status === 200){
        tableData.value = response.data.paper_list
        totalAccount.value = response.data.total
        tableData.value.map((item)=>{
          console.log(item.time)
          var date = new Date(item.date)
          item.date = moment(date).subtract(8,'hour').format('YYYY-MM-DD')
          var second = item.time % 60;
          var minute = (item.time / 60) % 60;
          var hour = item.time / 3600 ;
          if(hour < 10){
            item.time = `0${hour}:`
          }else{
            item.time = `${hour}:`
          }
          if(minute < 10){
            item.time += `0${minute}:`
          }else{
            item.time += `${minute}:`
          }
          if(second < 10){
            item.time += `0${second}`
          }else{
            item.time += `${second}`
          }
        })
      }
      else{
        console.log(response.data.error_message)
        message.error(response.data.error_message)
      }
    })
  }
  else {
    message.error("搜索类型错误")
  }
}
search()

const handleSizeChange = (newSize) =>{
  pageSize.value = newSize;
  currentPage.value = 1;  // 重置为第一页
  search()
}
const handlePageChange = (newPage) =>{
  currentPage.value = newPage;
  search()
}

const handleSizeChange_question = (newSize) =>{
  pageSize_question.value = newSize;
  currentPage_question.value = 1;  // 重置为第一页
  searchQuestion()
}
const handlePageChange_question = (newPage) =>{
  currentPage_question.value = newPage;
  searchQuestion()
}

const deleteFunc = (paperId) =>{
  console.log(`删除id为${paperId}的试卷`)
  axios.delete(`/api/paper/delete?paper_id=${paperId}`,{
    headers:{
      'Authorization':`Bearer ${token}`
    }
  }).then((response) =>{
    console.log(response.data)
    if(response.status === 200){
      console.log(`成功删除id为${paperId}的试卷`)
      message.success("删除成功")
      search()
    }
    else{
      console.log(response.data.error_message)
      message.error(response.data.error_message)
    }
  }).catch((e)=>{
    console.log(e)
  })
}
const showDetailFunc = (id) =>{
  console.log(`查看id为${id}的试卷详情`)
  axios.get(`/api/paper/getById?paper_id=${id}`,{
    headers:{
      'Authorization':`Bearer ${token}`
    }
  }).then((response) =>{
    console.log(response.data)
    if(response.status === 200){
      editData.value = response.data
      response.data.question_list.map((item) =>{
        checkQuestionList.value.push({
          qid:item.qid,
          mark:item.mark
        })
      })
      editData.value.second = editData.value.time % 60;
      editData.value.minute = (editData.value.time / 60) % 60;
      editData.value.hour = editData.value.time / 3600 ;
      console.log(checkQuestionList.value)
      searchQuestion()
      showDetail.value = true
      message.success("成功获取试卷")
      console.log(editData.value)
    }
    else{
      message.error(response.data.error_message)
      console.log(response.data.error_message)
    }
  })
}

const searchQuestion = () =>{
  console.log("在页面中搜索题库")
  var myparam = {
    page: currentPage_question.value.toString(),
    pageSize: pageSize_question.value.toString(),
    sort: "0"
  }
  if(searchQuestionType.value === "题目名"){
    if(searchQuestionKey.value !== ""){
      Reflect.set(myparam, "key", searchQuestionKey.value)
    }
  }
  else{
    Reflect.set(myparam, "key", searchQuestionKey.value)
  }
  var params = new URLSearchParams(myparam).toString()
  var myapi = searchQuestionType.value === "题目名" ? "/api/getAllQuestionByDescription" : "/api/getAllQuestionByIll"
  axios.get(`${myapi}?${params}`,{
    headers:{
      'Authorization':`Bearer ${token}`
    }
  }).then((response) =>{
    console.log(response.data)
    if(response.status === 200){
      console.log("成功搜索")
      totalAccount_question.value = response.data.total
      allQuestionList.value = response.data.question_list
      allQuestionList.value.map((item)=>{
        Reflect.set(item, "spread", 1)
        var isCheck = false
        checkQuestionList.value.map((checkItem) =>{
          if(checkItem.qid == item.qid)
            isCheck = true
        })
        Reflect.set(item, "isCheck", isCheck)
      })
      message.success("搜索成功")
    }
    else{
      console.log(response.data.error_message)
      message.error(response.data.error_message)
      allQuestionList.value = []
    }
  }).catch((err)=> console.log(err))
}

const spreadText = (data) =>{
  allQuestionList.value.map((item)=>{
    if(item.qid === data.qid){
      item.spread = 1 - item.spread
      console.log("id为" + item.qid + "的数据折叠/展开，spread变为" + item.spread)
    }
  })
}
const changeCheck = (qid, mark, isCheck) =>{
  console.log(`改变题目${qid}是否加入试卷的状态为${isCheck}`)
  if(isCheck){
    if(checkQuestionList.value.length === 0)
      checkQuestionList.value = [{
        qid:qid,
        mark:mark
      }]
    else
      checkQuestionList.value.push({
        qid:qid,
        mark:mark
      })
    editData.value.totalMark += mark
    console.log(checkQuestionList.value)
  }
  else{
    editData.value.totalMark -= mark
    checkQuestionList.value = checkQuestionList.value.filter(item => item.qid !== qid);
  }
}
const confirm = () =>{
  console.log(`确认修改/新建`)
  var list = checkQuestionList.value.map((item) =>{
    return item.qid
  })
  console.log(`题目列表为${list}`)
  var time = editData.value.hour * 3600 + editData.value.minute * 60 + editData.value.second
  console.log(time)
  var body = {
    uid: parseInt(uid),
    paper_name:editData.value.paperName,
    time:time,
    question_list: list
  }
  if(!isCreate.value){
    Reflect.set(body, 'paper_id', editData.value.paperId.toString())
  }
  var api = isCreate.value ? "/api/paper/add" : "/api/paper/update"
  axios.post(`${api}`, body, {
    headers:{
      'Authorization':`Bearer ${token}`
    }
  }).then((response) =>{
    console.log(response.data)
    if(response.status === 200){
      console.log("成功修改/新建")
      search()
      editData.value = {
        paperId: 0,
        paperName: "",
        time: "",
        userName: "",
        date: "",
        questionList: [],
        totalMark: 0,
        hour: 0,
        minute: 0,
        second: 0
      }
      if(isCreate.value){
        message.success("成功创建试卷")
        console.log("成功创建试卷")
        isCreate.value = false;
      }
      else{
        message.success("成功修改试卷")
        console.log("成功修改试卷")
      }
      showDetail.value = false
    }
    else{
      console.log(response.data.error_message)
      message.error(response.data.error_message)
      editData.value = {
        paperId: 0,
        paperName: "",
        time: "",
        userName: "",
        date: "",
        questionList: [],
        totalMark: 0,
        hour: 0,
        minute: 0,
        second: 0
      }
      showDetail.value = false
    }
  }).catch((e) => console.log(e))
}
const create = ()=>{
  isCreate.value = true
  editData.value = {
    paperId: 0,
    paperName: "",
    time: "",
    userName: "",
    date: "",
    questionList: [],
    totalMark: 0,
    hour: 0,
    minute: 0,
    second: 0
  }
  checkQuestionList.value = []
  showDetail.value = true
  searchQuestion()
}
const searchQuestionRules = {
  paperName:[{required: true, message:'请输入试卷名', trigger:'blur'}]
}
</script>

<template>
  <div class="about">
    <el-card>
      <div>
        <el-breadcrumb :separator-icon="ArrowRight" class="breadcrumb">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>后台管理</el-breadcrumb-item>
          <el-breadcrumb-item>试卷管理</el-breadcrumb-item>
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
              v-for="item in typeList"
              :key="item.id"
              :label="item.value"
              :value="item.value"
          ></el-option>
        </el-select>
        <el-button class="search-btn" @click="search">搜索</el-button>
        <el-button class="create-btn" @click="create" type="primary" size="small">新建+</el-button>
      </el-container>
      <el-container>
        <el-table :data="tableData" stripe height="67vh">
          <el-table-column prop="paperId" lable="编号" align="center" min-width="5%"></el-table-column>
          <el-table-column prop="paperName" label="试卷名" align="center" min-width="15%"></el-table-column>
          <el-table-column prop="username" label="出卷人" align="center" min-width="5%"></el-table-column>
          <el-table-column prop="date" label="创建日期" align="center" min-width="10%"></el-table-column>
          <el-table-column prop="totalMark" label="总分" align="center" min-width="10%"></el-table-column>
          <el-table-column prop="time" label="试卷时长" align="center" min-width="10%"></el-table-column>
          <el-table-column label="操作" align="center" min-width="10%">
            <template #default="scope">
              <el-button type="success" size="small" :icon="Edit" @click="showDetailFunc(scope.row.paperId)">编辑</el-button>
              <el-button type="danger" size="small" :icon="Delete" @click="deleteFunc(scope.row.paperId)">删除</el-button>
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
      <el-dialog v-model="showDetail" :title="isCreate ? '新建题目' : '编辑题目'">
        <el-form ref="myEditForm" :model="editData" :rules="searchQuestionRules" class="form-detail">
          <el-form-item label="试卷名" prop="paperName" style="margin-left: 1vw">
            <el-input v-model="editData.paperName" style="width: 15vw"></el-input>
          </el-form-item>
          <el-form-item label="试卷分值" prop="totalMark" style="position:absolute;right: 6vw">
            <el-input readonly v-model="editData.totalMark" style="width: 15vw"></el-input>
          </el-form-item>
          <el-form-item label="试卷时限" prop="time" style="margin-left: 1vw">
              <el-input-number
                  v-model="editData.hour"
                  :min="0"
                  :max="24"
                  size="small"
              ></el-input-number><span>&nbsp;时&nbsp;</span>
            <el-input-number
                v-model="editData.minute"
                :min="0"
                :max="60"
                size="small"
            ></el-input-number><span>&nbsp;分&nbsp;</span>
            <el-input-number
                v-model="editData.second"
                :min="0"
                :max="60"
                size="small"
            ></el-input-number><span>&nbsp;秒&nbsp;</span>
          </el-form-item>
        </el-form>
        <el-divider class="question-top-divider"></el-divider>
        <el-container class="search-question-container">
          <el-input class="search-question-box" v-model="searchQuestionKey"></el-input>
          <el-select v-model="searchQuestionType" class="question-selection">
            <el-option
                v-for="item in questionTypeList"
                :key="item.id"
                :label="item.value"
                :value="item.value"
            >
            </el-option>
          </el-select>
          <el-button class="search-question-btn" @click="searchQuestion">搜索</el-button>
      </el-container>
        <el-table :data="allQuestionList" stripe height="40vh">
          <el-table-column prop="check" label="选择" align="center" min-width="8%">
            <template #default="scope">
              <el-checkbox v-model="scope.row.isCheck" @change="changeCheck(scope.row.qid, scope.row.mark, scope.row.isCheck)"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column prop="qid" label="编号" align="center" min-width="8%"></el-table-column>
          <el-table-column prop="description" label="题目内容" align="left" min-width="48%">
            <template #default="scope">
              <div class="spread-box" :style="{'-webkit-line-clamp':scope.row.spread == 1 ? 1 : ''}">
               <span style="white-space: pre-line;">{{scope.row.description}}<br>A: {{scope.row.contentA}}<br>B: {{scope.row.contentB}}
                <br>C: {{scope.row.contentC}}<br>D: {{scope.row.contentD}}</span>
              </div>
              <div v-show="scope.row.spread === 1"  @click="spreadText(scope.row)" class="spread-btn">
                <el-button type="text">展开<el-icon class="el-icon-arrow-down"></el-icon></el-button>
              </div>
              <div v-show="scope.row.spread === 0" @click="spreadText(scope.row)" class="spread-btn">
                <el-button type="text">收起<el-icon class="el-icon-arrow-up"></el-icon></el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="illName" label="病名" align="center" min-width="16%">
            <template #default="scope">
              <span>{{scope.row.cateName}}/{{scope.row.illName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="answer" label="答案" align="center" min-width="10%">
            <template #default="scope">
              <span v-if="scope.row.answer === 1">A</span>
              <span v-else-if="scope.row.answer === 2">B</span>
              <span v-else-if="scope.row.answer === 3">C</span>
              <span v-else-if="scope.row.answer === 4">D</span>
              <span v-else>error</span>
            </template>
          </el-table-column>
          <el-table-column prop="mark" label="分数" align="center" min-width="10%"></el-table-column>
        </el-table>
        <el-container style="width: 100%; display: flex; justify-content: center;">
          <el-pagination
              @size-change="handleSizeChange_question"
              @current-change="handlePageChange_question"
              :current-page="currentPage_question"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="pageSize_question"
              :total="totalAccount_question"
              class="pagination">
          </el-pagination>
        </el-container>
        <el-container style="height: 3vh">
          <el-button @click="confirm" class="confirm-btn">确定</el-button>
        </el-container>
      </el-dialog>
    </el-card>
  </div>
</template>

<style>
.breadcrumb{
  height: 4.5vh;
  position: relative;
}
.search-head{
  position: relative;
  height: 8vh;
  display: flex;
}
.search-box{
  width: 20vw;
  height: 4vh;
  position: relative;
}
.search-type{
  width: 6vw;
  height: 4vh;
  position: relative;
  left: 1vw;
}
.search-btn{
  position: relative;
  left: 2vw;
  border:0.1vw solid #57a3e3;
}
.pagination{
  position: relative;
  top: 1vh;
}
.create-btn{
  position: relative;
  top: 1vh;
  left: 42vw;
}
.form-detail{
  position: relative;
  left: 1vw;
  width: 50vw;
  display: flex;
  flex-flow: row wrap;
}
.search-question-container{
  height: 5vh;
}
.search-question-box{
  width: 15vw;
  height: 4vh;
  position: relative;
  left: 2vw;
}
.question-top-divider{
  margin:0.3vh;
  top:-0.8vh;
  color:#444;
}
.search-question-btn{
  position:relative;
  left:4vw;
  border:0.2vh #1890ff solid;
}
.question-selection{
  width: 6vw;
  position: relative;
  left: 3vw;
}
.spread-box{
  overflow: hidden;
  text-overflow: ellipsis;
  display:-webkit-box;
  -webkit-box-orient: vertical;
}
.confirm-btn{
  position: absolute;
  right: 2vw;
}
.show-checked{
  position: absolute;
  right:2vw;
}
</style>
