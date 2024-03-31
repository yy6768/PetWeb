<script setup lang="ts">
import {ArrowRight, Edit, Delete} from "@element-plus/icons-vue";
import {computed, ref} from 'vue';
import axios from "axios";

const totalAccount = computed(() =>{
  return tableData.value.length;
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

const searchKey = ref("")
const searchOrder = ref("按编号排序")
const searchType = ref("题目")
const editData = ref(undefined)
const isEdit = ref(false)
const isCreate = ref(false)
const showDetail = ref(false)
const tableData = ref([
{
  id:0,
  content:"题目内容1234题目内容题目内容1234题目内容题目内容1234题目内容题目内容1234题目内容题目内容1234题目内容题目内容1234题目内容题目内容1234题目内容题目内容1234题目内容",
  type:1,
  typeName:"第一个病种",
  disease:2,
  diseaseName:"疾病123321",
  optionA:"选项A的内容",
  optionB:"选项B的内容",
  optionC:"选项C的内容",
  optionD:"选项D的内容",
  answer:1,
  point:2,
  spread:1
},
{
    id:1,
    content:"题目内容1234题目内容",
    type:2,
    typeName:"第二个病种",
    disease:1,
    diseaseName:"疾病222",
    optionA:"选项A的内容",
    optionB:"选项B的内容",
    optionC:"选项C的内容",
    optionD:"选项D的内容",
    answer:2,
    point:3,
    spread:1
},{
    id:3,
    content:"题目内容1234题目内容",
    type:3,
    typeName:"第三个病种",
    disease:3,
    diseaseName:"疾病333",
    optionA:"选项A的内容",
    optionB:"选项B的内容",
    optionC:"选项C的内容",
    optionD:"选项D的内容",
    answer:4,
    point:2,
    spread:1
  }
])

const queryForm = ref({
  type:undefined,
  name:undefined
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

const typeList = ref([{ //病种列表
  id:0,
  name:"第一个病种"
},{
  id:1,
  name:"第二个病种"
},{
  id:2,
  name:"第三个病种"
}])

const isSearchTypeSelected = computed(()=>{
  console.log(queryForm.value.type)
  return typeof queryForm.value.type !== "undefined";
})

const isTypeSelected = computed(()=>{
  console.log(editData.value.typeName)
  return typeof editData.value.typeName !== "undefined";
})
const diseaseList = computed(()=>{
  if(!isTypeSelected.value){
    editData.value.diseaseName = undefined
    editData.value.disease = undefined
    return []
  }
  else{
    let tmpData = [
      {
        id:0,
        name:"第一个疾病"
      },{
        id:1,
        name:"第二个疾病"
      },{
        id:2,
        name:"第三个疾病"
      }]
    /*根据editData.value.type获取disease的列表

    })*/
    return tmpData.values()
  }
})
const searchDiseaseList = computed(()=>{
  if(!isSearchTypeSelected.value){
    queryForm.value.name = undefined
    return []
  }
  else{
    let tmpData = [
      {
        id:0,
        name:"第一个疾病"
      },{
        id:1,
        name:"第二个疾病"
      },{
        id:2,
        name:"第三个疾病"
      }]
    /*let data = []
    let typeId = 0;
    console.log("值为"+queryForm.value.type)
    typeList.value.map((item) => {
      if(queryForm.value.type === item.name){
        typeId = item.id;
      }
    })
    axios.get("").then((response)=>{
      console.log(response.data);
      if(response.data.code === 200){
        data = response.data.data
      }
      else{
        this.$message.error("获取病名列表失败！")
      }
    })*/
    return tmpData.values()
  }
})

const search = () => {
  console.log("关键词为：" + searchKey.value + "，搜索类型" + searchType.value +
              "，搜索排序为" + searchOrder.value)
  console.log(queryForm.value)
  /*
  axios.get("").then((response) =>{
    console.log(response.data.data)
    if(response.data.code === 200){
      dataList.value = response.data.data
    }
    else{
      this.$message.error("搜索失败！")
    }
  }
  */
}
const spreadText = (data) =>{
  tableData.value.map((item)=>{
    if(item.id === data.id){
      item.spread = 1 - item.spread
      console.log("id为" + item.id + "的数据折叠/展开，spread变为" + item.spread)
    }
  })
}
const showDetailFunc = (row) =>{
  console.log("查看id为" + row.id + "的题目详情")
  isEdit.value = false
  isCreate.value = false
  showDetail.value = true
  editData.value = row
  editData.value.filterAnswer = filterAnswer.value
  console.log("showDetail的值变为" + showDetail.value)
}
const editFunc = () =>{
  console.log("编辑id为" + editData.value.id + "的题目")
  isEdit.value = true;
  isCreate.value = false;
}
const confirm = () =>{
  if(isEdit.value){//编辑
    axios.get("").then((response)=>{
      console.log(response.data)
      if(response.data.code === 200){
        console.log("成功编辑")
        tableData.value.map((item) =>{
          if(item.id === editData.value.id){
            item = editData.value
            editData.value = undefined
            isEdit.value = false
            showDetail.value = false
            //写一个message提示编辑成功
            showDetail.value=false
          }
        })
      }
      else{
        console.log("编辑失败")
      }
    })
  }
  else if(isCreate.value){//新建
    axios.get("").then((response)=>{
      console.log(response.data)
      if(response.data.code === 200){
        console.log("成功新建")
        tableData.value.push(response.data.data)
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
  editData.value = undefined
  console.log(showDetail.value)
}
const deleteFunc = (row) =>{
  console.log("删除id为" + row.id + "的题目")
  axios.post("").then((response)=>{
    console.log(response.data)
    if(response.data.code === 200){
      console.log("成功删除")
      let deleteIndex = tableData.value.map((item,index) =>{
        if(item.id === row.id)
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
    return "A"
  }
  else if(editData.value.answer === 2){
    console.log("此时filterAnswer=B")
    return "B"
  }
  else if(editData.value.answer === 3){
    console.log("此时filterAnswer=C")
    return "C"
  }
  else if(editData.value.answer === 4){
    console.log("此时filterAnswer=D1")
    return "D"
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
            <el-select v-model="queryForm.type"
                       clearable
                       filterable
                       placeholder="选择病种"
                       style="width: 8vw">
              <el-option v-for="item in typeList"
                         :key="item.id"
                         :value="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="病名" prop="disease" style="padding-left: 5vw">
            <el-select v-model="queryForm.name"
                       clearable
                       filterable
                       placeholder="选择病名"
                       style="width: 8vw"
                       :disabled="!isSearchTypeSelected">
              <el-option v-for="item in searchDiseaseList"
                         :key="item.id"
                         :value="item.name"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-button type="primary" size="small" class="newBtn" @click="newFunc">新建+</el-button>
      </el-container>
      <el-container>
        <el-table :data="tableData" stripe height="61vh">
          <el-table-column prop="id" label="编号" align="center" min-width="5%"></el-table-column>
          <el-table-column prop="content" label="题目内容" align="left" min-width="40%">
            <template #default="scope">
              <div class="spread-box" :style="{'-webkit-line-clamp':scope.row.spread == 1 ? 1 : ''}">
               <span style="white-space: pre-line;">{{scope.row.content}}<br>A: {{scope.row.optionA}}<br>B: {{scope.row.optionB}}
                <br>C: {{scope.row.optionC}}<br>D: {{scope.row.optionD}}</span>
              </div>
              <div v-show="scope.row.spread === 1"  @click="spreadText(scope.row)" class="spread-btn">
                <el-button type="text">展开<el-icon class="el-icon-arrow-down"></el-icon></el-button>
              </div>
              <div v-show="scope.row.spread === 0" @click="spreadText(scope.row)" class="spread-btn">
                <el-button type="text">收起<el-icon class="el-icon-arrow-up"></el-icon></el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="typeName" label="病种" align="center" min-width="10%"></el-table-column>
          <el-table-column prop="diseaseName" label="病名" align="center" min-width="10%"></el-table-column>
          <el-table-column prop="answer" label="答案" align="center" min-width="5%">
            <template #default="scope">
              <span v-if="scope.row.answer === 1">A</span>
              <span v-else-if="scope.row.answer === 2">B</span>
              <span v-else-if="scope.row.answer === 3">C</span>
              <span v-else-if="scope.row.answer === 4">D</span>
              <span v-else>error</span>
            </template>
          </el-table-column>
          <el-table-column prop="point" label="分数" align="center" min-width="5%"></el-table-column>
          <el-table-column label="操作" align="center" min-width="20%">
            <template #default="scope">
              <el-button type="success" size="small" :icon="Edit" @click="showDetailFunc(scope.row)">编辑</el-button>
              <el-button type="danger" size="small" :icon="Delete" @click="deleteFunc(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-container>
      <el-dialog v-model="showDetail" :title="isEdit ? '编辑题目' : isCreate ? '新建题目' : '题目详情'">
        <el-form :ref="form" :model="editData" label-width="12vh">
          <el-form-item v-if="!isCreate" label="题目id" prop="id">
            <el-input readonly v-model="editData.id"></el-input>
          </el-form-item>
          <el-form-item label="题干内容" prop="content">
            <el-input :readonly="!isEdit && !isCreate" v-model="editData.content"></el-input>
          </el-form-item>
          <el-form-item label="选项A" prop="optionA">
            <el-input :readonly="!isEdit && !isCreate" v-model="editData.optionA"></el-input>
          </el-form-item>
          <el-form-item label="选项B" prop="optionB">
            <el-input :readonly="!isEdit && !isCreate" v-model="editData.optionB"></el-input>
          </el-form-item>
          <el-form-item label="选项C" prop="optionC">
            <el-input :readonly="!isEdit && !isCreate" v-model="editData.optionC"></el-input>
          </el-form-item>
          <el-form-item label="选项D" prop="optionD">
            <el-input :readonly="!isEdit && !isCreate" v-model="editData.optionD"></el-input>
          </el-form-item>
          <el-form-item label="分数" prop="point">
            <el-input :readonly="!isEdit && !isCreate" v-model="editData.point"></el-input>
          </el-form-item>
          <el-form-item label="答案" prop="answer" placeholder="选择答案">
            <el-select v-model="editData.filterAnswer" :disabled="!isCreate && !isEdit">
              <el-option value="1" label="A"></el-option>
              <el-option value="2" label="B"></el-option>
              <el-option value="3" label="C"></el-option>
              <el-option value="4" label="D"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="病种" prop="type">
            <el-select v-model="editData.typeName"
                       clearable
                       filterabl
                       :disabled="!isCreate && !isEdit">
              <el-option v-for="item in typeList"
                         :key="item.id"
                         :value="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="病名" prop="disease">
            <el-select v-model="editData.diseaseName"
                       clearable
                       filterabl
                       :disabled="!isCreate && !isEdit">
              <el-option v-for="item in diseaseList"
                         :key="item.id"
                         :value="item.name"></el-option>
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
  