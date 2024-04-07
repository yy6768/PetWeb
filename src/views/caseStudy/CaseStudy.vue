<template>
    <el-card>
      <div>
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>病例学习</el-breadcrumb-item>
      </el-breadcrumb>
      </div>
      <div class="margin"></div><!--    间距-->
      <div class="input_box">
        <el-row gutter="20">
          <el-col :span="15">
            <el-input
                placeholder="请输入搜索内容"
                clearable
                v-model="queryForm.query"
            >
            </el-input>
          </el-col>
          <el-button type="primary" :icon="Search" @click="initGetCasesList">搜索</el-button>
<!--          @click="initGetCasesListTest"-->
        </el-row>

        <div class="flex flex-wrap gap-4 items-center">
          <el-select
              v-model="sortValue"
              placeholder="按编号排序"
              size="default"
              style="width: 180px"
          >
            <el-option
                v-for="item in sortOptions "
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </div>
      </div>

      <div class="margin"></div><!--    间距-->
      <div class="input_box">
        <el-select
            v-model="cateValue"
            placeholder="病种"
            size="default"
            style="width: 180px"
        >
          <el-option
              v-for="item in cateOptions "
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
        <el-select
            v-model="illValue"
            placeholder="病名"
            size="default"
            style="width: 180px ; margin-left: 40px"
        >
          <el-option
              v-for="item in illOptions "
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
        <el-select
            v-model="yearValue"
            placeholder="年份"
            size="default"
            style="width: 180px ; margin-left: 40px"
        >
          <el-option
              v-for="item in yearOptions "
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
        <el-select
            v-model="monthValue"
            placeholder="年份"
            size="default"
            style="width: 180px ; margin-left: 40px"
        >
          <el-option
              v-for="item in monthOptions "
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </div>
      <div style="margin-left:1000px">
        <el-button size="small"  type="primary" round @click="handleDialogValueAdd()">新增+</el-button>
      </div>
      <div class="margin"></div><!--    间距-->
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column
            :width="item.width"
            :prop="item.prop"
            :label="item.label"
            v-for="(item,index) in options "
            :key="index"
        >
<!--          <template v-slot="{row}" v-if="item.prop ==='create_time'">-->
<!--            {{$filters.filterTimes(row.create_time)}}-->
<!--          </template>-->
<!--          到时候要改成v-else-if-->
        <template #default="{ row }" v-if="item.prop === 'operation'">
<!--         编辑原来是 @click="handleDialogValueDetail-->
          <el-button
              type="primary"
              size="small"
              :icon="Edit"
              @click="handleDialogValueAdd(row)"gi
          ></el-button>
          <el-button
              type="danger"
              size="small"
              :icon="Delete"
              @click="delCase(row)"
          ></el-button>
        </template></el-table-column
        >
      </el-table>
      <div class="margin"></div><!--    间距-->
      <div class="page">
        <el-pagination
            v-model:currentPage="queryForm.pagenum"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="queryForm.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
<!--  <DialogDetail-->
<!--      v-model = "dialogVisibleDetail"-->
<!--      :dialogTitleDetail="dialogTitleDetail"-->
<!--      v-if="dialogVisibleDetail"-->
<!--  />-->
  <DialogAdd
      v-model="dialogVisibleAdd"
      :dialogTitleAdd="dialogTitleAdd"
      v-if="dialogVisibleAdd"
      @initCaseList = "initGetCasesList"
      :dialogTableValueAdd="dialogTableValueAdd"
  />
</template>

<script setup lang="ts">
import axios from 'axios';
import { onMounted, ref } from 'vue';
import {ArrowRight, Delete, Edit, Search} from '@element-plus/icons-vue';
import {options} from './options';
import DialogAdd from './components/dialog_add.vue'
import {ElMessage, ElMessageBox} from "element-plus";
import {getCase,deleteCase} from "@/api/case";
import {isNull} from '@/views/caseStudy/filters';


//查询表
const queryForm = ref({
  query:'',
  pagenum: 1,
  pagesize: 2
})

//分页器
const total = ref(0)

//表格内容(连上数据后清空表格)
const tableData = ref([
  {
    cid: '1',
    cate_name:'病种一',
    ill_name:'病名一',
    create_time:'2023-01-11',
    username:'医师一',
  },
  {
    cid: '2',
    cate_name:'病种二',
    ill_name:'病名二',
    create_time:'2024-02-23',
    username:'医师二',
  },
])

//下拉框
const sortValue = ref('')

const sortOptions = [
  { value: 'Option1', label: '按编号排序'},
  { value: 'Option2', label: '按病名排序'},
  { value: 'Option3', label: '按修改时间排序'},
]

const cateValue = ref('')

const cateOptions = [
  { value: 'Option1', label: '病种一'},
  { value: 'Option2', label: '病种二'},
  { value: 'Option3', label: '病种三'},
]

const illValue = ref('')

const illOptions = [
  {
    value: 'Option1',
    label: '病名一',
  },
  {
    value: 'Option2',
    label: '病名二',
  },
  {
    value: 'Option3',
    label: '病名三',
  },
]

const yearValue = ref('')

const yearOptions = [
  {
    value: 'Option1',
    label: '2022',
  },
  {
    value: 'Option2',
    label: '2023',
  },
  {
    value: 'Option3',
    label: '2024',
  },
]

const monthValue = ref('')

const monthOptions = [
  {
    value: 'Option1',
    label: '1月',
  },
  {
    value: 'Option2',
    label: '2月',
  },
  {
    value: 'Option3',
    label: '3月',
  },
  {
    value: 'Option3',
    label: '4月',
  },
  {
    value: 'Option3',
    label: '5月',
  },
  {
    value: 'Option3',
    label: '6月',
  },
  {
    value: 'Option3',
    label: '7月',
  },
  {
    value: 'Option3',
    label: '8月',
  },  {
    value: 'Option3',
    label: '9月',
  },  {
    value: 'Option3',
    label: '10月',
  },
  {
    value: 'Option3',
    label: '11月',
  },
  {
    value: 'Option3',
    label: '12月',
  },



]



//测试搜索
// const initGetCasesListTest = () =>{
//   const searchTerm = queryForm.value.query.toLowerCase();
//   const filteredData = tableData.value.filter(item => {
//     return Object.values(item).some(val =>
//         String(val).toLowerCase().includes(searchTerm)
//     );
//   });
//   // 更新表格显示的内容
//   tableData.value = filteredData;
// }

// GET
const initGetCasesList = async () =>{
  const res = await getCase(queryForm.value)
  // 打印返回内容
  console.log(res)
  //拿total页数信息 还未使用
  //total.value= res.total
  //拿页表信息 还未使用
  //tableData.value = res.case
}
initGetCasesList()

//页码改变方法
const handleSizeChange = (pageSize:any) => {
  queryForm.value.pagenum=1
  queryForm.value.pagesize=pageSize
  initGetCasesList()
}
const handleCurrentChange = (pageNum:any) =>{
  queryForm.value.pagenum=pageNum
  initGetCasesList()
}

//详情框
const dialogVisibleDetail = ref(false)
const dialogTitleDetail = ref('')

//新增框
const dialogVisibleAdd = ref(false)
const dialogTitleAdd = ref('')
const dialogTableValueAdd= ref({})

//POST
const testData = ref<string>('');
onMounted(async () => {
  try {
      const response = await axios.post('/api/test2', {
        key: 'value' // 你要POST的数据
      });
      console.log(response.data); // 假设后端返回的是 { message: 'Test2 response' }
      testData.value = response.data.message;
    } catch (error) {
      console.error(error);
    }
})

//详情
const handleDialogValueDetail = () => {
  dialogTitleDetail.value= '病例详情'
  dialogVisibleDetail.value = true
}

//新增标题
const handleDialogValueAdd = (row:any) =>{
  if(isNull(row)){
    dialogTitleAdd.value = '添加病例'
    dialogTableValueAdd.value={}
  }else{
    dialogTitleAdd.value = '病例详情'
    dialogTableValueAdd.value=JSON.parse(JSON.stringify(row))
  }
  dialogVisibleAdd.value = true
}

//删除弹窗
const delCase = (row:any) => {
  ElMessageBox.confirm(
      '确定删除病例?',
      'Warning',
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
  )
      .then(async () => {
        await deleteCase(row.id)
        ElMessage({
          type: 'success',
          message: '删除成功',
        })
        //删除成功后还要重新获取数据
        initGetCasesList()
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '删除失败',
        })
      })
}
</script>

<style lang="scss" scoped>
    .margin{
      margin-bottom: 20px;
    }
    .input_box{
      display: flex; /* 使用 Flexbox 布局 */
    }
    .input_box-1{
      width:200px;
      margin-left:240px;
    }
    .input_box-2 {
      width: 180px;
      margin-right: 80px;
    }
</style>
  