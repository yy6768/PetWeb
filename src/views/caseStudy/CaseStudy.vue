<template>
  <el-card>
    <div>
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>病例学习</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
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

    <div style="margin-top: 10px;">
        <el-input v-model="queryForm.search" placeholder="请输入搜索内容" style="width: 340px" clearable @change="initGetCasesList"></el-input>

      <el-button type="primary" size="small" style="margin-left: 100px;" @click="newCase">新建+</el-button>

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

      </el-table-column>
      <el-table-column label="操作" width="300">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="studyCase(row)">学习</el-button>
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
import DialogAdd from '@/views/caseStudy/components/dialog_add.vue'
import {ElMessage, ElMessageBox} from "element-plus";
import {getCase, deleteCase, getCaseById, getCate, getLab, getCasesByCate, getIll, getCasesByIll, getMed} from "@/api/case.js";
import {isNull} from '@/views/caseStudy/filters.js';
import { useRouter } from 'vue-router';
import SelectDialog from './components/SelectDialog.vue';

const dialogVisible = ref(false);

const handleConfirm = (selectedItems) => {
  console.log('Selected Items:', selectedItems);
  dialogVisible.value = false;
};
const currentCase = ref(null);
const labOptions = ref([]);
const drugOptions = ref([])

const router = useRouter();
const startDate = ref(null);
const endDate = ref(null);
const openSelectDialog = async (c) => {
  // 链接病历的逻辑
  const labResponse = await getLab(sessionStorage.getItem('token'));
  console.log('链接lab', labResponse);
  labOptions.value = labResponse.data.lab_list; // Set the current lab
  const drugResponse = await getMed(sessionStorage.getItem('token'));
  console.log('链接drug', drugResponse);
  drugOptions.value = drugResponse.data.medicine_list; // Set the current lab
  currentCase.value = c;
  console.log('c, ', c);

  dialogVisible.value = true
};
//查询表
const queryForm = ref({
  search:'',
  pagenum: 1,
  pagesize: 10,
  // cateName:''
})

//
const options =[
  {
    label:'编号',
    prop:'cid',
    width: 100
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
const newCase = () => {
  router.push('/case-new')
}
const tableData = ref<Case[]>([]);
const studyCase = (row) => {
  // Ensure you are passing the `cid` as part of the route parameters correctly
  console.log("row:",row)
  const caseDetails = {
    cateName: row.cateName,
    illName: row.illName,
    date: row.date,
    username: row.username
  };
  sessionStorage.setItem('caseDetails', JSON.stringify(caseDetails));
  router.push({
    name: 'case-details',
    params: { cid: row.cid },
  });
};
const initGetCasesList = async () => {
  const res = await getCase(
      sessionStorage.getItem('token'),
      queryForm.value.pagenum,
      queryForm.value.pagesize,
      queryForm.value.search
  );
  console.log("initGetCasesList:", res);

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
  }

  total.value = res.data.total;
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
  console.log("fetchCategories",response)
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
      console.log("handleCateChange", response);
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
  console.log("tableData.value",tableData.value)
  if (cateValue.value) {
    filteredData = filteredData.filter(item => item.cateName=== cateValue.value);
  }
  if (illValue.value) {
    filteredData = filteredData.filter(item => item.illName === illValue.value);
  }
  if (startDate.value && endDate.value) {
    const start = new Date(startDate.value).setHours(0, 0, 0, 0);
    const end = new Date(endDate.value).setHours(23, 59, 59, 999);

    filteredData = filteredData.filter(item => {
      // Parsing the date assuming the format "YYYY年MM月DD日"
      let parts = item.date.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
      if (parts) {
        let itemDate = new Date(parseInt(parts[1]), parseInt(parts[2]) - 1, parseInt(parts[3])).getTime();
        return itemDate >= start && itemDate <= end;
      }
      return false; // If date doesn't match format, it won't be included
    });
  }
  return filteredData;
});



//传参数
const form = ref({
  cid:'',
  cateId:'',//
  cateName:'',
  illId:'',//
  illName:'',
  date:'',
  uid:'',//
  username:'',
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
