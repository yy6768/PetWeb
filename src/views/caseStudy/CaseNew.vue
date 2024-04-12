<template>
  <el-card>
    <div>
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/manage-cases' }">病例管理</el-breadcrumb-item>
        <el-breadcrumb-item>新增</el-breadcrumb-item>

      </el-breadcrumb>
    </div>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" style="margin-top: 10px">
      <el-form-item label="病种" prop="cateId">
        <el-select v-model="form.cateId" placeholder="请选择病种" @change="fetchIll">
          <el-option
              v-for="category in categoriesList"
              :key="category.cateId"
              :label="category.cateName"
              :value="category.cateId"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="病名" prop="illId">
        <el-select v-model="form.illId" placeholder="请选择病名">
          <el-option
              v-for="illness in illList"
              :key="illness.illId"
              :label="illness.illName"
              :value="illness.illId"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="就诊医师" prop="uid">
        <el-select v-model="form.uid" placeholder="请选择医师">
          <el-option
              v-for="doctor in nameList"
              :key="doctor.uid"
              :label="doctor.username"
              :value="doctor.uid"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="基本情况" prop="basicSituation">
        <el-input v-model="form.basicSituation" type="textarea"></el-input>
      </el-form-item>

      <el-form-item label="治疗方案" prop="therapy">
        <el-input v-model="form.therapy" type="textarea"></el-input>
      </el-form-item>

      <template #footer>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认添加</el-button>
      </template>
    </el-form>
    </el-card>

</template>

<script setup>
import { ref,onMounted } from 'vue';
import { ElMessage, ElDialog, ElForm, ElFormItem, ElInput, ElSelect, ElOption } from 'element-plus';
import { addCase, getCate, getIll, getName } from '@/api/case.js';

const dialogVisible = ref(false);
const form = ref({
  cateId: '',
  illId: '',
  uid: '',
  basicSituation: '',
  therapy: ''
});

const categoriesList = ref([]);
const illList = ref([]);
const nameList = ref([]);

const rules = {
  cateId: [{ required: true, message: '请选择病种', trigger: 'change' }],
  illId: [{ required: true, message: '请选择病名', trigger: 'change' }],
  uid: [{ required: true, message: '请选择医师', trigger: 'change' }],
  basicSituation: [{ required: true, message: '请输入基本情况', trigger: 'blur' }],
  therapy: [{ required: true, message: '请输入治疗方案', trigger: 'blur' }]
};

const fetchCategories = async () => {
  const response = await getCate({}, sessionStorage.getItem('token'));
  console.log("fetchCategories:", response)

  categoriesList.value = response.data.cate_list;
};

const fetchIll = async () => {
  const response = await getIll({}, sessionStorage.getItem('token'),form.value.cateId);
  console.log(response)
  illList.value = response.data.ill_list;

};

const fetchName = async () => {
  const response = await getName({}, sessionStorage.getItem('token'),null,1,1,10);
  console.log(response)
  nameList.value = response.data.user_list;
};

const handleConfirm = async () => {
  const { valid } = await formRef.value.validate();
  if (valid) {
    const response = await addCase(form.value);
    if (response.data.success) {
      ElMessage.success('病例添加成功');
      dialogVisible.value = false;
    } else {
      ElMessage.error(response.data.message);
    }
  }
};

const handleClose = () => {
  dialogVisible.value = false;
};

onMounted(() => {
  fetchCategories();
  fetchName();
});
</script>
