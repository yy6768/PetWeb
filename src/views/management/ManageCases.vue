<template>
      <el-dialog
      title="为病例添加化验和药品"
      v-model="dialogVisible"
      width="500px"
      @close="dialogVisible = false"
    >
      <SelectDialog
        :labOptions="labOptions"
        :drugOptions="drugOptions"
        :currentCase="currentCase"
        @confirm="handleConfirm"
      />
    </el-dialog>
  <el-card>
    
    <div>
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>后台管理</el-breadcrumb-item>
        <el-breadcrumb-item>病例管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="margin"></div><!--    间距-->


    <div class="margin"></div><!--    间距-->
    <div class="input_box">
      <el-input v-model="queryForm.search" placeholder="请输入搜索内容" style="width: 340px" clearable @change="initGetCasesList"></el-input>



      <el-button type="primary" size="small" style="margin-left: 100px;" @click="newCase">新建+</el-button>

    </div>
    <div class="margin"></div><!--    间距-->
    <el-table :data="displayedTableData" :default-sort="{ prop: 'cid', order: 'descending' }" stripe style="width: 100%">
      <el-table-column
          :prop="item.prop"
          :label="item.label"
          v-for="(item,index) in options "
          :key="index"
      >

      </el-table-column>
      <el-table-column label="操作" width="300px">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="editCase(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="delCase(row)">删除</el-button>
          <el-button type="success" size="small" @click="openSelectDialog(row)">链接化验&药品</el-button>

        </template>

      </el-table-column>
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
</template>

<script setup lang="ts">
import axios from 'axios';
import {computed, onMounted, ref, watch} from 'vue';
import {ArrowRight, Delete, Edit, Search} from '@element-plus/icons-vue';
import {ElMessage, ElMessageBox} from "element-plus";
import {getCase, deleteCase, getCaseById, getCate, getCasesByCate, getIll, getCasesByIll, getLab, getMed} from "@/api/case.js";
import {isNull} from '@/views/caseStudy/filters.js';
import { useRouter } from 'vue-router';
import SelectDialog from '@/views/caseStudy/components/SelectDialog.vue';
const router = useRouter();
const dialogVisible = ref(false);

const handleConfirm = (selectedItems) => {
  console.log('Selected Items:', selectedItems);
  dialogVisible.value = false;
};
const currentCase = ref(null);
const labOptions = ref([]);
const drugOptions = ref([])

//查询表
const queryForm = ref({
  search:'',
  pagenum: 1,
  pagesize: 10,
})

//
const options =[
  {
    label:'编号',
    prop:'cid'
  },
  {
    label:'病种',
    prop:'cateName'
  },
  {
    label:'病名',
    prop:'illName'
  },
  {
    label:'时间',
    prop:'date'
  },
  {
    label:'就诊医师',
    prop:'username'
  },
]

//分页器
const total = ref(0)

//描述病例对象
interface Case {
  cid: number;
  cateName: string;
  illName: string;
  date: string;
  username: string;
}

const tableData = ref<Case[]>([]);
const editCase = (row) => {
  router.push({
    name: 'case-modify',
    params: { cid: row.cid },
  });
  console.log("editCase row", row.cid)
}
const openSelectDialog = async (c) => {
  // 链接病历的逻辑
  const labResponse = await getLab(sessionStorage.getItem('token'));
  labOptions.value = labResponse.data.lab_list; // Set the current lab
  const drugResponse = await getMed(sessionStorage.getItem('token'));
  drugOptions.value = drugResponse.data.medicine_list; // Set the current lab
  currentCase.value = c;

  dialogVisible.value = true
};

const delCase = async (row) => {
  sessionStorage.setItem('cid', row.cid);
  const res = await deleteCase(row.cid, sessionStorage.getItem('token'))
  console.log("del res", res);
  if (res.status == 200) {
    ElMessage.success('删除成功');
    await initGetCasesList();
  } else {
    ElMessage.error('删除失败');
  }

}
// GET
const initGetCasesList = async () => {
  const res = await getCase(
      sessionStorage.getItem('token'),
      queryForm.value.pagenum,
      queryForm.value.pagesize,
      queryForm.value.search
  );
  if (res.status === 200) {
    if (res.data && res.data.case_list) {
    tableData.value = res.data.case_list.map((item) => {
      return {
        ...item,
        date: new Date(item.date).toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      };
    });
    ElMessage.success('获取成功');
    total.value = res.data.total;
  }else{
    ElMessage.info(res.data.error_message);
    tableData.value = []
    total.value = 0
  }
  
  }else{
    ElMessage.error('获取失败');
  }

}


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
watch(sortValue, (newValue) => {
  if (newValue === 'Sort1') {
    // 按编号排序
    tableData.value.sort((a, b) => a.cid - b.cid);
  } else if (newValue === 'Sort2') {
    // 按病名排序
    tableData.value.sort((a, b) => a.illName.localeCompare(b.illName));
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
const selectedCateId = ref(null); // 存储当前选中的病种id
const illValue = ref('')

interface Category {
  cateId:number;
  cateName: string;
}
const cateOptions = ref<Category[]>([]); // 存储病种列表
const fetchCategories = async () => {
  const response = await getCate({}, sessionStorage.getItem('token'));
  console.log("oooooo",response)
  cateOptions.value = response.data.cate_list;
};
// 获取病种列表
onMounted(()=>{
      initGetCasesList()
      fetchIll()
    }
)

// 处理病种选择变化
const handleCateChange = async (id) => {
  selectedCateId.value = id; // 存储当前选中的病种id
  // 根据选中的病种id获取病种名称
  const selectedCate = cateOptions.value.find((item) => item.cateId === id);
  if (selectedCate) {
    cateValue.value = selectedCate.cateName; // 将选中的病种名称存储到cateValue中
    try {
      const response = await getCasesByCate(id, sessionStorage.getItem('token'), cateValue.value, queryForm.value.pagenum, queryForm.value.pagesize);
      console.log("iiiiii", response);
      // tableData.value = response.data.case_list;
    } catch (error) {
      console.error('Error fetching cases by category:', error);
    }
  } else {
    // 如果没有选中病种，则重新获取全部病例列表
    await initGetCasesList();
  }
};

//病名选择

interface Illgory {
  illId:number;
  illName: string;
}
const illOptions = ref<Illgory[]>([]); // 存储病种列表
const fetchIll = async () => {
  if (selectedCateId.value) { // 确保已选中病种id不为空
    const response = await getIll({}, sessionStorage.getItem('token'), selectedCateId.value);
    console.log('zzzzzzz', response);
    illOptions.value = response.data.ill_list;
  } else {
    // 如果没有选中病种id，则不执行获取病名列表的操作
    console.warn('No selected category to fetch illnesses');
  }
};
const handleIllChange = async (selectedIllId) => {
  const selectedIll = illOptions.value.find((item) => item.illId === selectedIllId);
  if (selectedIll) {
    illValue.value = selectedIll.illName;
    try {
      const response = await getCasesByIll(selectedIllId, sessionStorage.getItem('token'),illValue.value,queryForm.value.pagenum, queryForm.value.pagesize);
      console.log("xxxxxx", response);
    } catch (error) {
      console.error('Error fetching cases by category:', error);
    }
  } else {
    // 如果没有选中病种，则重新获取全部病例列表
    await initGetCasesList();
  }
};

//年份选择
const yearValue = ref('')
//月份选择
const monthValue = ref('')


// 计算属性，根据cateValue和illValue的值动态过滤数据
const displayedTableData = computed(() => {
  let filteredData = tableData.value;
  if (cateValue.value) {
    filteredData = filteredData.filter(item => item.cateName=== cateValue.value);
  }
  if (illValue.value) {
    filteredData = filteredData.filter(item => item.illName === illValue.value);
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


const newCase = () => {
  router.push('/case-new')
}
//传参数
const form = ref({
  cid:'',
  cateId:'',//
  cateName:'',
  illId:'',//
  illName:'',
  date:'',
  uid:'',//
  userame:'',
  basic_situation:'',
  photo:[],
  lab_name:'',
  lab_cost:1,
  lab_result:'',
  lab_photo:[],
  medicine:'',
  medicine_name:'',
  medicine_cost:'',
  result:'',
  therapy:'',
  cost:1,
  surgery_video:[],
})



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
