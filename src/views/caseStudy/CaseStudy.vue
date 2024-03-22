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
          <el-button type="primary" :icon="Search" @click="initGetCasesListTest">搜索</el-button>
<!--          @click="initGetCasesList"-->
        </el-row>
        <div class="input_box-1">
          <el-input
              placeholder="按编号排序"
              class="input-with-select"
          >
            <template #append>
              <el-select style="width: 40px">
                <el-option label="按编号排序" value="1" />
                <el-option label="按姓名排序" value="2" />
                <el-option label="按时间排序" value="3" />
              </el-select>
            </template>
          </el-input>
        </div>
      </div>
      <div class="margin"></div><!--    间距-->
      <div class="input_box">
          <div class="input_box-2">
            <el-input
                placeholder="病种"
                class="input-with-select"
            >
              <template #append>
                <el-select style="width: 40px">
                  <el-option label="病种1" value="1" />
                  <el-option label="病种2" value="2" />
                  <el-option label="病种3" value="3" />
                </el-select>
              </template>
            </el-input>
          </div>
          <div class="input_box-2">
            <el-input
                placeholder="病名"
                class="input-with-select"
            >
              <template #append>
                <el-select style="width: 40px">
                  <el-option label="病名1" value="1" />
                  <el-option label="病名2" value="2" />
                  <el-option label="病名3" value="3" />
                </el-select>
              </template>
            </el-input>
          </div>
          <div class="input_box-2">
            <el-input
                placeholder="年份"
                class="input-with-select"
            >
              <template #append>
                <el-select style="width: 40px">
                  <el-option label="2022" value="1" />
                  <el-option label="2023" value="2" />
                  <el-option label="2024" value="3" />
                </el-select>
              </template>
            </el-input>
          </div>
          <div class="input_box-2">
            <el-input
                placeholder="月份"
                class="input-with-select"
            >
              <template #append>
                <el-select style="width: 40px">
                  <el-option label="1" value="1" />
                  <el-option label="2" value="2" />
                  <el-option label="3" value="3" />
                </el-select>
              </template>
            </el-input>
          </div>
        </div>
      <div class="margin"></div><!--    间距-->
      <div style="margin-left:1000px">
        <el-button size="small"  type="primary" round @click="handleDialogValueAdd">新增+</el-button>
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
        <template #default v-if="item.prop === 'operation'">
          <el-button type="primary" @click="handleDialogValueDetail" size="small" :icon="Edit"></el-button>
          <el-button type="danger" @click="delCase(row)" size="small" :icon="Delete"></el-button>
        </template></el-table-column
        >
      </el-table>
      <div class="margin"></div><!--    间距-->
      <el-pagination
          v-model:current-page="currentPage4"
          v-model:page-size="pageSize4"
          :page-sizes="[5, 10, 15, 20]"
          :small="small"
          :disabled="disabled"
          :background="background"
          layout="total, sizes, prev, pager, next, jumper"
          :total="100"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      />
    </el-card>
  <DialogDetail v-model = "dialogVisibleDetail" :dialogTitleDetail="dialogTitleDetail"/>
  <DialogAdd v-model="dialogVisibleAdd" :dialogTitleAdd="dialogTitleAdd"/>
</template>

<script setup lang="ts">
import axios from 'axios';
import { onMounted, ref } from 'vue';
import {ArrowRight, Delete, Edit, Search} from '@element-plus/icons-vue';
import {options} from './options';
import DialogDetail from './components/dialog_detail.vue'
import DialogAdd from './components/dialog_add.vue'
import {ElMessage, ElMessageBox} from "element-plus";
import {getCase} from "@/api/case";

//查询表
const queryForm = ref({
  query:'',
  pagenum: 1,
  pagesize: 2
})
//表格内容
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

//测试搜索
const initGetCasesListTest = () =>{
  const searchTerm = queryForm.value.query.toLowerCase();
  const filteredData = tableData.value.filter(item => {
    return Object.values(item).some(val =>
        String(val).toLowerCase().includes(searchTerm)
    );
  });
  // 更新表格显示的内容
  tableData.value = filteredData;
}

//GET
// const initGetCasesList = async () =>{
//   const res = await getCase(queryForm.value)
//   // 打印返回内容
//   console.log(res)
//   tableData.value = res.case
// }
// initGetCasesList()


//详情框
const dialogVisibleDetail = ref(false)
const dialogTitleDetail = ref('')

//新增框
const dialogVisibleAdd = ref(false)
const dialogTitleAdd = ref('')

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

const handleDialogValueDetail = () => {
  dialogTitleDetail.value= '病例详情'
  dialogVisibleDetail.value = true
}
const handleDialogValueAdd = () =>{
  dialogTitleAdd.value = '添加病例'
  dialogVisibleAdd.value = true
}

//删除弹窗
const delCase = (row) => {
  ElMessageBox.confirm(
      'proxy will permanently delete the file. Continue?',
      'Warning',
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
  )
      .then(() => {
        ElMessage({
          type: 'success',
          message: 'Delete completed',
        })
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: 'Delete canceled',
        })
      })
}
</script>

<style scoped>
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
      width:180px;
      margin-right:80px;
    }

    ::v-deep .el-input_suffix{
      align-items : center;
    }

    ::v-deep .el-pagination{
      padding-top: 16px;
      box-sizing: border-box;
      text-alian: right
    }

</style>
  