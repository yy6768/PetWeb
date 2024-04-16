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


    <div class="margin"></div><!--    间距-->
    <div class="input_box">
      <el-select
          v-model="cateValue"
          placeholder="病种"
          size="default"
          style="width: 180px"
          clearable
          @click="fetchCategories"
          @change="handleCateChange"
      >
        <el-option
            v-for="item in cateOptions "
            :key="item.cateId"
            :label="item.cateName"
            :value="item.cateId"
        />
      </el-select>
      <el-select
          v-model="illValue"
          placeholder="病名"
          size="default"
          style="width: 180px ; margin-left: 40px"
          clearable
          @click="fetchIll"
          @change="handleIllChange"
      >
        <el-option
            v-for="item in illOptions "
            :key="item.illId"
            :label="item.illName"
            :value="item.illId"
        />
      </el-select>

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
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="editCase(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="delCase(row)">删除</el-button>

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
import {getCase, deleteCase, getCaseById, getCate, getCasesByCate, getIll, getCasesByIll} from "@/api/case.js";
import {isNull} from '@/views/caseStudy/filters.js';
import { useRouter } from 'vue-router';

const router = useRouter();

//查询表
const queryForm = ref({
  query:'',
  key:'',
  pagenum: 1,
  pagesize: 10,
  // cate_name:''
})

//
const options =[
  {
    label:'编号',
    prop:'cid'
  },
  {
    label:'病种',
    prop:'cate_name'
  },
  {
    label:'病名',
    prop:'ill_name'
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
  cate_name: string;
  ill_name: string;
  date: string;
  username: string;
}

const tableData = ref<Case[]>([]);
const editCase = (row) => {
  sessionStorage.setItem('cid', row.cid);
  getCaseById('', sessionStorage.getItem('token'), row.cid).then((res) => {
    const detail = res.data;
    console.log("detail", detail);
    // sessionStorage.setItem('case', JSON.stringify(res.data));
    // router.push('/case-study/study');
  });
}

const delCase = (row) => {
  sessionStorage.setItem('cid', row.cid);
  console.log("del row", row.cid)
  deleteCase(row.cid, sessionStorage.getItem('token')).then((res) => {
    console.log("del res", res);
    // sessionStorage.setItem('case', JSON.stringify(res.data));
    // router.push('/case-study/study');

  });

}
// GET
const initGetCasesList = async () => {
  const res = await getCase(
      queryForm.value,
      sessionStorage.getItem('token'),
      queryForm.value.pagenum,
      queryForm.value.pagesize,
      queryForm.value.query
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
    filteredData = filteredData.filter(item => item.cate_name=== cateValue.value);
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


const newCase = () => {
  router.push('/case-new')
}
//传参数
const form = ref({
  cid:'',
  cateId:'',//
  cate_name:'',
  illId:'',//
  ill_name:'',
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
