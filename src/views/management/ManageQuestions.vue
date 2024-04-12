<script setup lang="ts">
import {ArrowRight, Edit, Delete} from "@element-plus/icons-vue";
import {computed, ref} from 'vue';
import axios from "axios";
import { message } from 'ant-design-vue';

const token = sessionStorage.getItem("token")
const authority = sessionStorage.getItem("authority")
const uid = sessionStorage.getItem("uid")

const totalAccount = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);

const handleSizeChange = (newSize) =>{
  pageSize.value = newSize;
  currentPage.value = 1;  // 重置为第一页
  search()
}
const handlePageChange = (newPage) =>{
  currentPage.value = newPage;
  search()
}

const searchKey = ref("")
const searchOrder = ref("按编号排序")
const searchType = ref("题目")
const editData = ref({
  qid:0,
  cateId:0,
  illId:0,
  cateName:"",
  illName:"",
  description:"",
  contentA:"",
  contentB:"",
  contentC:"",
  contentD:"",
  mark:0,
  answer:0,
  filterAnswer:"error",
  spread:1
})
const isEdit = ref(false)
const isCreate = ref(false)
const showDetail = ref(false)
const tableData = ref([])

const queryForm = ref({
  cateName:undefined,
  /*cateId:computed(()=>{
    if(typeof queryForm.value.cateName !== "undefined"){
      cateList.value.map((item)=> {
        if (queryForm.value.cateName === item.cateName)
          return item.cateId
      })
    }
    else
      return undefined
  }),*/
  illName:undefined,
  /*illId:computed(()=>{
    if(typeof queryForm.value.illName !== "undefined"){
      searchDiseaseList.value.map((item)=>{
        if(queryForm.value.illName === item.illName)
          return item.illId
      })
    }
    else
      return undefined
  })*/
})

const orders = ref([{ //搜索结果排序
  id:0,
  value:"按编号排序"
},{
  id:1,
  value:"按病名排序"
}])

const types = ref([{ //搜索类型
  id:0,
  value:"题目"
},
{
  id:1,
  value:"病名"
}]);

const cateList = ref([])
axios.get("/api/cate/get_all",{
  headers:{
    'Authorization':`Bearer ${token}`
  }
}).then((response)=>{
  console.log(response)
  if(response.data.error_message === "success"){
    cateList.value = response.data.cate_list
    console.log("成功获取病种列表")
  }
  else{
    message.error("获取病种列表失败")
    console.log("获取病种列表失败")
  }
})
const getDisease = (cateId:Number)=>{

}
const isSearchCateSelected = computed(()=>{
  if(typeof queryForm.value.cateName === "undefined"){
    console.log("搜索类型选择为空")
    return false
  }else{
    console.log("选择cate: "+ queryForm.value.cateName)
    let cateId = 0
    cateList.value.map((item) =>{
      if(item.cateName === queryForm.value.cateName)
        cateId = item.cateId
    })
    axios.get(`/api/ill/get_all_in_cate?cate_id=${cateId}`,{
      headers:{
        'Authorization':`Bearer ${token}`
      }
    }).then((response)=>{
      console.log(response.data)
      if(response.data.error_message === "success"){
        console.log(`成功获取病种${cateId}的疾病列表`)
        searchDiseaseList.value = response.data.ill_list
        searchDiseaseList.value.push([])
        searchDiseaseList.value.pop()
      }
      else{
        console.log(`获取病种${cateId}的疾病列表失败`)
      }
    })
      return true
    }
})
const isCateSelected = computed(()=>{
  if(typeof editData.value.cateName === "undefined"){
    console.log("类型选择为空")
    return false
  }else{
    console.log("选择cate: "+ editData.value.cateName)
    let cateId = 0
    cateList.value.map((item) =>{
      if(item.cateName === editData.value.cateName)
        cateId = item.cateId
    })
    axios.get(`/api/ill/get_all_in_cate?cate_id=${cateId}`,{
      headers:{
        'Authorization':`Bearer ${token}`
      }
    }).then((response)=>{
      console.log(response.data)
      if(response.data.error_message === "success"){
        console.log(`成功获取病种${cateId}的疾病列表`)
        diseaseList.value = response.data.ill_list
        diseaseList.value.push([])
        diseaseList.value.pop()
      }
      else{
        console.log(`获取病种${cateId}的疾病列表失败`)
      }
    })
    return true
  }
})
const diseaseList = ref([])
const searchDiseaseList = ref([])

const search = () => {
  console.log("关键词为：" + searchKey.value + "，搜索类型" + searchType.value +
              "，搜索排序为" + searchOrder.value)
  console.log(queryForm.value)
  if(searchType.value === "题目"){
    let myParam = ref({
      page:currentPage.value.toString(),
      pageSize:pageSize.value.toString(),
      key:searchKey.value,
      sort:computed(() =>{
        if(searchOrder.value === "按编号排序")
          return "0";
        else
          return "1";
      })
    })
    if(typeof queryForm.value.cateName !== "undefined"){
      cateList.value.map((item) =>{
        if(item.cateName === queryForm.value.cateName)
          Reflect.set(myParam.value,'cate_id',item.cateId)
          return
      })
    }
    if(isSearchCateSelected.value && typeof queryForm.value.illName !== "undefined"){
      searchDiseaseList.value.map((item) =>{
        if(item.illName === queryForm.value.illName){
          Reflect.set(myParam.value,'ill_id',item.illId)
          return
        }
      })
    }
    let params = new URLSearchParams(myParam.value).toString();
    axios.get(`/api/getAllQuestionByDescription?${params}`,{
      headers:{
        'Authorization':`Bearer ${token}`
      }}).then((response)=>{
      console.log(response.data)
      if(response.data.error_message === "success"){
        console.log("成功搜索")
        totalAccount.value = response.data.total
        tableData.value = response.data.question_list
        tableData.value.map((item)=>{
          Reflect.set(item, "spread", 1)
        })
      }
      else if(response.data.error_message === "未找到对应题目"){
        tableData.value = []
      }
    })
  }
  else if(searchType.value === "病名"){
    let myParam = ref({
      page:currentPage.value.toString(),
      pageSize:pageSize.value.toString(),
      key:searchKey.value,
      sort:computed(() =>{
        if(searchOrder.value === "按编号排序")
          return "0";
        else
          return "1";
      })
    })
    let params = new URLSearchParams(myParam.value).toString();
    axios.get(`/api/getAllQuestionByIll?${params}`,{
      headers:{
        'Authorization':`Bearer ${token}`
      }}).then((response)=>{
      console.log(response.data)
      if(response.data.error_message === "success"){
        console.log("成功搜索")
        totalAccount.value = response.data.total
        tableData.value = response.data.question_list
        tableData.value.map((item)=>{
          Reflect.set(item, "spread", 1)
        })
      }
    })
  }
}
search()
const spreadText = (data) =>{
  tableData.value.map((item)=>{
    if(item.qid === data.qid){
      item.spread = 1 - item.spread
      console.log("id为" + item.qid + "的数据折叠/展开，spread变为" + item.spread)
    }
  })
}
const showDetailFunc = (id) =>{
  console.log("查看id为" + id + "的题目详情")
  axios.get(`/api/getQuestionByQid?qid=${id}`,{
    headers:{
        'Authorization':`Bearer ${token}`
    }}).then((response) =>{
    console.log(response.data)
    if(response.data.error_message === "success"){
      editData.value = response.data.question
      var cateName = ref("")
      cateList.value.map((item) =>{
        if(item.cateId === editData.value.cateId) {
          cateName.value = item.cateName
        }
      })
      var illName = ref("")
      diseaseList.value.map((item) =>{
        if(item.illId === editData.value.illId) {
          illName.value = item.illName
        }
      })
      Reflect.set(editData.value, "illName",  illName.value)
      Reflect.set(editData.value, "cateName",  cateName.value)
      Reflect.set(editData.value, "spread",  1)
      Reflect.set(editData.value,  "filterAnswer", filterAnswer.value)
      isEdit.value = false
      isCreate.value = false
      showDetail.value = true
      console.log(editData.value)
      console.log("showDetail的值变为" + showDetail.value)
    }
    else{
      message.error("获取失败")
    }
  })
}
const editFunc = () =>{
  console.log("编辑id为" + editData.value.qid + "的题目")
  console.log(editData.value)
  isEdit.value = true;
  isCreate.value = false;
}
const confirm = () =>{
  console.log(editData.value)
  let myParam = ref({
    cate_id:computed(() =>{
      let id = 0
      cateList.value.map((item)=>{
        if(item.cateName === editData.value.cateName)
          id = item.cateId
      })
      return id.toString()
    }),
    ill_id:computed(() =>{
      let id = 0
      diseaseList.value.map((item)=>{
        if(item.illName === editData.value.illName)
          id = item.illId
      })
      console.log(id)
      return id.toString()
    }),
    description:editData.value.description,
    answer:computed(() =>{
      console.log(editData.value.filterAnswer)
      if(editData.value.filterAnswer === 'A')
        return "1"
      else if(editData.value.filterAnswer === 'B')
        return "2"
      else if(editData.value.filterAnswer === 'C')
        return "3"
      else if(editData.value.filterAnswer === 'D')
        return "4"
      else
        return editData.value.filterAnswer
    }),
    mark:editData.value.mark.toString(),
    content_a:editData.value.contentA,
    content_b:editData.value.contentB,
    content_c:editData.value.contentC,
    content_d:editData.value.contentD
  })
  console.log(editData.value)
  if(isEdit.value){//编辑
    console.log(editData.value)
    Reflect.set(myParam.value, "qid", editData.value.qid)
    console.log(editData.value)
    let params = new URLSearchParams(myParam.value).toString()
    axios.post(`/api/updateQuestion?${params}`,{},{
      headers:{
        'Authorization':`Bearer ${token}`
      }
    }).then((response)=>{
      console.log(editData.value)
      console.log(response)
      if(response.data.error_message === "success"){
        console.log("成功编辑")
        console.log(editData.value)
        try{
          tableData.value.forEach((item) =>{
            console.log("item:" + item.qid)
            console.log(editData.value)
            console.log("edit:" + editData.value.qid)
            if(item.qid === editData.value.qid){
              item.value = editData.value
              editData.value = {
                qid:0,
                cateId:0,
                illId:0,
                cateName:"",
                illName:"",
                description:"",
                contentA:"",
                contentB:"",
                contentC:"",
                contentD:"",
                mark:0,
                answer:0,
                filterAnswer:"error",
                spread:1
              }
              isEdit.value = false
              showDetail.value = false
              message.success("编辑成功")
              showDetail.value=false
              throw new Error('StopIteration');
            }
          })
        } catch (e){
          if(e.message !== "StopIteration")
            throw e
        }
      }
      else{
        console.log("编辑失败")
      }
    })
  }
  else if(isCreate.value){//新建
    let params = new URLSearchParams(myParam.value).toString()
    axios.post( `/api/createQuestion?${params}`,{},{
      headers:{
        'Authorization':`Bearer ${token}`
      }
    }).then((response)=>{
      console.log(response.data)
      if(response.data.error_message === "success"){
        console.log("成功新建")
        let newData = response.data.question
        Reflect.set(newData, "spread", 1)
        tableData.value.push(newData)
        showDetail.value=false
      }
      else{
        console.log("新建失败")
      }
    })
  }
  else{
    editFunc()
  }
}
const cancel = () =>{
  console.log("取消")
  isEdit.value = false
  isCreate.value = false
  showDetail.value = false
  editData.value = {
    qid:0,
    cateId:0,
    illId:0,
    cateName:"",
    illName:"",
    description:"",
    contentA:"",
    contentB:"",
    contentC:"",
    contentD:"",
    mark:0,
    answer:0,
    filterAnswer:"error",
    spread:1
  }
  console.log(showDetail.value)
}
const deleteFunc = (row) =>{
  console.log("删除id为" + row.qid + "的题目")
  axios.delete(`/api/deleteQuestion?qid=${row.qid}`,{
    headers:{
      'Authorization':`Bearer ${token}`
    }
  }).then((response)=>{
    console.log(response.data)
    if(response.data.error_message === "success"){
      console.log("成功删除")
      let deleteIndex = 0
      tableData.value.map((item,index) =>{
        if(item.qid === row.qid)
          return index
      })
      tableData.value.splice(deleteIndex, 1)
    }
    else{
      console.log("删除失败")
    }
  })
}
const filterAnswer = computed(() =>{
  if(editData.value === undefined)
    return "error"
  else if(editData.value.answer === 0)
    return "no answer"
  else if(editData.value.answer === 1){
    console.log("此时filterAnswer=A")
    return 'A'
  }
  else if(editData.value.answer === 2){
    console.log("此时filterAnswer=B")
    return 'B'
  }
  else if(editData.value.answer === 3){
    console.log("此时filterAnswer=C")
    return 'C'
  }
  else if(editData.value.answer === 4){
    console.log("此时filterAnswer=D1")
    return 'D'
  }
  else
    return "answer is wrong"
})
const newFunc = () =>{
  console.log("新建")
  isCreate.value = true;
  isEdit.value = false;
  showDetail.value = true;
  editData.value = {
    id:-1,
    content:"",
    type:undefined,
    typeName:"",
    disease:undefined,
    diseaseName:"",
    optionA:"",
    optionB:"",
    optionC:"",
    optionD:"",
    answer:0,
    point:undefined,
    spread:1
  }
}
</script>
<template>
  <div class="about">
    <el-card>
      <div>
        <el-breadcrumb :separator-icon="ArrowRight" class="breadcrumb">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>后台管理</el-breadcrumb-item>
          <el-breadcrumb-item>题目管理</el-breadcrumb-item>
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
        <el-select class="search-order" v-model="searchOrder" placeholder="请选择">
          <el-option
              v-for="item in orders"
              :key="item.id"
              :label="item.value"
              :value="item.value"
          ></el-option>
        </el-select>
        <el-button class="search-btn" @click="search">搜索</el-button>
      </el-container>
      <el-container >
        <el-form ref="myQueryForm"
                 :model="queryForm"
                 label-width="3vw"
                 style="display:flex;position: relative">
          <el-form-item label="病种" prop="diseaseType">
            <el-select v-model="queryForm.cateName"
                       clearable
                       filterable
                       placeholder="选择病种"
                       :disabled="searchType === '病名'"
                       style="width: 8vw">
              <el-option v-for="item in cateList"
                         :key="item.cateId"
                         :value="item.cateName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="病名" prop="disease" style="padding-left: 5vw">
            <el-select v-model="queryForm.illName"
                       clearable
                       filterable
                       placeholder="选择病名"
                       style="width: 8vw"
                       :disabled="searchType === '病名' || !isSearchCateSelected">
              <el-option v-for="item in searchDiseaseList"
                         :key="item.illName"
                         :value="item.illName"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-button type="primary" size="small" class="newBtn" @click="newFunc">新建+</el-button>
      </el-container>
      <el-container>
        <el-table :data="tableData" stripe height="61vh">
          <el-table-column prop="qid" label="编号" align="center" min-width="5%"></el-table-column>
          <el-table-column prop="description" label="题目内容" align="left" min-width="40%">
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
          <el-table-column prop="cateName" label="病种" align="center" min-width="10%"></el-table-column>
          <el-table-column prop="illName" label="病名" align="center" min-width="10%"></el-table-column>
          <el-table-column prop="answer" label="答案" align="center" min-width="5%">
            <template #default="scope">
              <span v-if="scope.row.answer === 1">A</span>
              <span v-else-if="scope.row.answer === 2">B</span>
              <span v-else-if="scope.row.answer === 3">C</span>
              <span v-else-if="scope.row.answer === 4">D</span>
              <span v-else>error</span>
            </template>
          </el-table-column>
          <el-table-column prop="mark" label="分数" align="center" min-width="5%"></el-table-column>
          <el-table-column label="操作" align="center" min-width="20%">
            <template #default="scope">
              <el-button type="success" size="small" :icon="Edit" @click="showDetailFunc(scope.row.qid)">编辑</el-button>
              <el-button type="danger" size="small" :icon="Delete" @click="deleteFunc(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-container>
      <el-dialog v-model="showDetail" :title="isEdit ? '编辑题目' : isCreate ? '新建题目' : '题目详情'">
        <el-form :ref="form" :model="editData" label-width="12vh">
          <el-form-item v-if="!isCreate" label="题目id" prop="qid">
            <el-input readonly v-model="editData.qid"></el-input>
          </el-form-item>
          <el-form-item label="题干内容" prop="content">
            <el-input :readonly="!isEdit && !isCreate" v-model="editData.description"></el-input>
          </el-form-item>
          <el-form-item label="选项A" prop="optionA">
            <el-input :readonly="!isEdit && !isCreate" v-model="editData.contentA"></el-input>
          </el-form-item>
          <el-form-item label="选项B" prop="optionB">
            <el-input :readonly="!isEdit && !isCreate" v-model="editData.contentB"></el-input>
          </el-form-item>
          <el-form-item label="选项C" prop="optionC">
            <el-input :readonly="!isEdit && !isCreate" v-model="editData.contentC"></el-input>
          </el-form-item>
          <el-form-item label="选项D" prop="optionD">
            <el-input :readonly="!isEdit && !isCreate" v-model="editData.contentD"></el-input>
          </el-form-item>
          <el-form-item label="分数" prop="point">
            <el-input :readonly="!isEdit && !isCreate" v-model="editData.mark"></el-input>
          </el-form-item>
          <el-form-item label="答案" prop="answer" placeholder="选择答案">
            <el-select v-model="editData.filterAnswer" :disabled="!isCreate && !isEdit">
              <el-option value="A" label="A"></el-option>
              <el-option value="B" label="B"></el-option>
              <el-option value="C" label="C"></el-option>
              <el-option value="D" label="D"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="病种" prop="cate">
            <el-select v-model="editData.cateName"
                       clearable
                       filterabl
                       :disabled="!isCreate && !isEdit">
              <el-option v-for="item in cateList"
                         :key="item.cateName"
                         :value="item.cateName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="病名" prop="disease">
            <el-select v-model="editData.illName"
                       clearable
                       filterabl
                       :disabled="!isCreate && !isEdit || !isCateSelected">
              <el-option v-for="item in diseaseList"
                         :key="item.illName"
                         :value="item.illName"></el-option>
            </el-select>
          </el-form-item>

        </el-form>
        <el-button class="dialogBtn" @click="confirm">{{isCreate || isEdit ? "确认" : "编辑"}}</el-button>
        <el-button class="cancelBtn" @click="cancel">取消</el-button>
      </el-dialog>
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
.search-btn{
  position: relative;
  left: 4vw;
  border:0.1vw solid #57a3e3;
}
.search-type{
  width: 6vw;
  position: relative;
  left: 1vw;
}
.search-order{
  width: 8vw;
  position: relative;
  left: 2vw;
}
.newBtn{
  position: relative;
  left: 47vw;
}
.spread-box{
  overflow: hidden;
  text-overflow: ellipsis;
  display:-webkit-box;
  -webkit-box-orient: vertical;
}
.spread-btn{
  top:0;
  height: 3.5vh;
  bottom: 0;
  position: relative;
  color:#5995ef;
  font-size: 3vh;
}
.dialogBtn{
  border:solid 0.1vw #5995ef;
  color:#5995ef;
  position:relative;
  left:43vw;
}
.cancelBtn{
  border:solid 0.1vw #5995ef;
  color:#5995ef;
  position:relative;
  left:33vw;
}
.pagination{
  position: relative;
  top: 1vh;
}
</style>
  