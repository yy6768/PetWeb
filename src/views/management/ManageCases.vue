<template>
  <el-card>
    <div>
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>后台管理</el-breadcrumb-item>
        <el-breadcrumb-item>病例管理</el-breadcrumb-item>
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
      </el-row>

      <div class="flex flex-wrap gap-4 items-center">
        <el-select
            v-model="sortValue"
            placeholder="按编号排序"
            size="default"
            style="width: 180px"
            clearable
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
          clearable
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
          clearable
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
          clearable
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
          placeholder="月份"
          size="default"
          style="width: 180px ; margin-left: 40px"
          clearable
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
    <el-table :data="displayedTableData" stripe style="width: 100%">
      <el-table-column
          :width="item.width"
          :prop="item.prop"
          :label="item.label"
          v-for="(item,index) in options "
          :key="index"
      >
<!--        <template v-slot="{ row }" v-if="item.prop === 'date'">-->
<!--          {{ $filters.filterTimes(row.date) }}-->
<!--        </template>-->
        <template #default="{ row }" v-if="item.prop === 'operation'">
          <el-button
              type="primary"
              size="small"
              :icon="Edit"
              @click="handleDialogValueAdd(row)"
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
import { message } from 'antd';
import {computed, onMounted, ref, watch} from 'vue';
import {ArrowRight, Delete, Edit, Search} from '@element-plus/icons-vue';
import {options} from '@/views/caseStudy/options';
import DialogAdd from '@/views/caseStudy/components/dialog_add.vue'
import {ElMessage, ElMessageBox} from "element-plus";
import {getCase,deleteCase} from "@/api/case.js";
import {isNull} from '@/views/caseStudy/filters.js';


//查询表
const queryForm = ref({
  query:'',
  key:'',
  pagenum: 1,
  pagesize: 10
})

//分页器
const total = ref(0)

//描述病例对象
interface Case {
  cid: string;
  cate_name: string;
  ill_name: string;
  date: string;
  username: string;
}

const tableData = ref<Case[]>([]);

// GET
const initGetCasesList = async () =>{
  const res = await getCase(queryForm.value,
      sessionStorage.getItem('token'),
      queryForm.value.pagenum,
      queryForm.value.pagesize
  );
  console.log(res);
  //拿页表信息 还没拿
  tableData.value = res.data.case_list
  //拿total页数信息 还未使用
  //total.value= res.data.total
}
initGetCasesList()

//页码改变方法
const handleSizeChange = (pageSize) => {
  queryForm.value.pagenum=1
  queryForm.value.pagesize=pageSize
  initGetCasesList()
}
const handleCurrentChange = (pageNum) =>{
  queryForm.value.pagenum=pageNum
  initGetCasesList()
}

//排序方式下拉框
const sortValue = ref('')
const sortOptions = [
  { value: 'Sort1', label: '按编号排序'},
  { value: 'Sort2', label: '按病名排序'},
  { value: 'Sort3', label: '按修改时间排序'},
]
// 监听sortValue的变化??
watch(sortValue, (newValue) => {
  if (newValue === 'Sort1') {
    // 按编号排序
    tableData.value.sort((a, b) => a.cid.toString().localeCompare(b.cid.toString()));
  } else if (newValue === 'Sort2') {
    // 按病名排序
    tableData.value.sort((a, b) => a.ill_name.localeCompare(b.ill_name));
  } else if (newValue === 'Sort3') {
    // 按修改时间排序
    tableData.value.sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      return timeA - timeB;
    });
  }
});

//病种选择
const cateValue = ref('')
const cateOptions = [
  { value: 'cate1', label: 'cate1'},
  { value: 'cate2', label: 'cate2'},
  { value: 'cate3', label: 'cate3'},
]

//病名选择
const illValue = ref('')
const illOptions = [
  { value: 'ill1', label: 'ill1'},
  { value: 'ill2', label: 'ill2'},
  { value: 'ill3', label: 'ill3'},
]

//年份选择
const yearValue = ref('')
const yearOptions = [
  { value: '2014', label: '2014'},
  { value: '2015', label: '2015'},
  { value: '2016', label: '2016'},
  { value: '2017', label: '2017'},
  { value: '2018', label: '2018'},
  { value: '2019', label: '2019'},
  { value: '2020', label: '2020'},
  { value: '2021', label: '2021'},
  { value: '2022', label: '2022'},
  { value: '2023', label: '2023'},
  { value: '2024', label: '2024'},
]

//月份选择
const monthValue = ref('')
const monthOptions = [
  { value: '01', label: '1月'},
  { value: '02', label: '2月'},
  { value: '03', label: '3月'},
  { value: '04', label: '4月'},
  { value: '05', label: '5月'},
  { value: '06', label: '6月'},
  { value: '07', label: '7月'},
  { value: '08', label: '8月'},
  { value: '09', label: '9月'},
  { value: '10', label: '10月'},
  { value: '11', label: '11月'},
  { value: '12', label: '12月'},
]

// 计算属性，根据cateValue和illValue的值动态过滤数据
const displayedTableData = computed(() => {
  let filteredData = tableData.value;
  if (cateValue.value) {
    filteredData = filteredData.filter(item => item.cate_name === cateValue.value);
  }
  if (illValue.value) {
    filteredData = filteredData.filter(item => item.ill_name === illValue.value);
  }
  if (yearValue.value) {
    filteredData = filteredData.filter(item => item.date.startsWith(yearValue.value));
  }
  if (monthValue.value) {
    const month = monthValue.value.slice(-2); // Extract the month number from the value
    filteredData = filteredData.filter(item => {
      const itemMonth = item.date.split('-')[1]; // Extract the month from the create_time
      return itemMonth === month;
    });
  }
  return filteredData;
});

//新增框
const dialogVisibleAdd = ref(false)
const dialogTitleAdd = ref('')
const dialogTableValueAdd= ref({})

//POST
const testData = ref<string>('');
onMounted(async () => {
  // try {
  //     const response = await axios.post('/api/test2', {
  //       key: 'value' // 你要POST的数据
  //     });
  //     console.log(response.data); // 假设后端返回的是 { message: 'Test2 response' }
  //     testData.value = response.data.message;
  //   } catch (error) {
  //     console.error(error);
  //   }
})

//详情
// const handleDialogValueDetail = () => {
//   dialogTitleDetail.value= '病例详情'
//   dialogVisibleDetail.value = true
// }

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
        await deleteCase(row.cid,sessionStorage.getItem('token'))
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
