<template>
  <el-card>
    <div>
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/manage-cases' }">病例管理</el-breadcrumb-item>
        <el-breadcrumb-item>修改</el-breadcrumb-item>

      </el-breadcrumb>
    </div>
    <div style="margin-left: 100px; margin-top:20px">
      <!-- <img :src="form.photo" alt="描述信息"> -->
      <el-switch v-model="uploadToggle" active-text="上传更新文件"></el-switch>

      <div v-if="uploadToggle">
        <el-upload ref="uploadImageRef" class="upload-demo" action="http://localhost:3001/vid/case/upload" :auto-upload="false" :limit="1"
          :on-success="handleImageSuccess" accept="image/*">
          <template #trigger>
            <el-button type="primary">选择图片</el-button>
          </template>
          <el-button style="margin-left: 20px" type="success" @click="submitImageUpload">
            上传图片
          </el-button>
        </el-upload>
        <el-upload ref="uploadVideoRef" class="upload-demo" action="http://localhost:3001/vid/case/upload" :auto-upload="false" :limit="1"
          :on-success="handleVideoSuccess" accept="video/*">
          <template #trigger>
            <el-button type="primary">选择视频</el-button>
          </template>
          <el-button style="margin-left: 20px" type="success" @click="submitVideoUpload">
            上传视频
          </el-button>
        </el-upload>
      </div>

    </div>


    <el-form ref="formRef" :model="form" label-width="100px" style="margin-top: 10px">
      <!-- <el-form-item label="病种" prop="cate_id">
        <el-select v-model="form.cate_id" placeholder="请选择病种" @change="fetchIll">
          <el-option v-for="category in categoriesList" :key="category.cateId" :label="category.cateName"
            :value="category.cateId"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="病名" prop="illId">
        <el-select v-model="form.ill_name" placeholder="请选择病名">
          <el-option v-for="illness in illList" :key="illness.illName" :label="illness.illName"
            :value="illness.illName"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="就诊医师" prop="uid">
        <el-select v-model="form.username" placeholder="请选择医师">
          <el-option v-for="doctor in nameList" :key="doctor.username" :label="doctor.username"
            :value="doctor.username"></el-option>
        </el-select>
      </el-form-item> -->

      <el-form-item label="基本情况" prop="basicSituation">
        <el-input v-model="form.basicSituation" type="textarea"></el-input>
      </el-form-item>

      <el-form-item label="治疗方案" prop="therapy">
        <el-input v-model="form.therapy" type="textarea"></el-input>
      </el-form-item>

      <el-form-item label="治疗结果" prop="result">
        <el-input v-model="form.result" type="textarea"></el-input>
      </el-form-item>
      <div style="margin-left: 100px;">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认更新</el-button>
      </div>
    </el-form>

  </el-card>

</template>

<script setup lang="ts">
import { ref, onMounted, watch} from 'vue';
import { ElMessage, ElDialog, ElForm, ElFormItem, ElInput, ElSelect, ElUpload, ElOption, ElSwitch, ElLoading } from 'element-plus';
import { addCase, getCate, getIll, getName, getCaseById, updateCase } from '@/api/case.js';
import type { UploadInstance } from 'element-plus'
import { useRoute } from 'vue-router'

const route = useRoute()
const uploadImageRef = ref(null);
const uploadVideoRef = ref(null);
const uploadToggle = ref(false);
const loading = ref(null);
const cid = ref()
const handleImageSuccess = (response, file, fileList) => {

  console.log("Image upload successful:", response);
  form.value.photo = response.url; // Assuming `response.url` contains the image URL
  loading.value.close(); // This will stop the loading indicator

};

const handleVideoSuccess = (response, file, fileList) => {

  console.log("Video upload successful:", response);
  form.value.surgery_video = response.url; // Assuming `response.url` contains the video URL
  loading.value.close(); // This will stop the loading indicator

};

const submitImageUpload = () => {

  loading.value = ElLoading.service({
    lock: true,
    text: 'uploading...',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  uploadImageRef.value.submit();
};

const submitVideoUpload = () => {

  loading.value = ElLoading.service({
    lock: true,
    text: 'uploading...',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  uploadVideoRef.value.submit();
};



const dialogVisible = ref(false);
const form = ref({
  cate_id:'',
  username: '',
  ill_name: '',
  basic_situation: '',
  therapy: '',
  photo:'',
  result:'',
  surgery_video:'',

});

const categoriesList = ref([]);
const illList = ref([]);
const nameList = ref([]);


const fetchCategories = async () => {
  const response = await getCate({}, sessionStorage.getItem('token'));
  console.log("fetchCategories:", response)

  categoriesList.value = response.data.cate_list;
};

const fetchIll = async () => {
  const response = await getIll({}, sessionStorage.getItem('token'), form.value.cate_id);
  illList.value = response.data.ill_list;
  console.log("illList:",illList.value)

};

const fetchName = async () => {
  const response = await getName({}, sessionStorage.getItem('token'), null, 1, 1, 10);
  console.log(response)
  nameList.value = response.data.user_list;
};

const handleConfirm = async () => {
  if(uploadToggle.value){
    if(form.value.photo === 'none' && form.value.surgery_video === 'none'){
      ElMessage.error('请上传图片和视频');
      return;
    }
  }
  
  console.log("add", form.value)
  console.log("categoriesList", categoriesList.value)
  console.log("illList", illList.value)
  console.log("nameList", nameList.value)
    form.value.basic_situation = form.value.basicSituation;
    const response = await updateCase(sessionStorage.getItem('token'),form.value);
    console.log("updateCase response", response)
    if (response.data.error_message === "success") {
      ElMessage.success('病例更新成功');
      dialogVisible.value = false;
    } else {
      ElMessage.error(response.data.message);
    }
};

const handleClose = () => {
  dialogVisible.value = false;
};

const fetchCaseData = async (cid) => {
  if (!cid) return;
  loading.value = true;
  try {
    const response = await getCaseById('', sessionStorage.getItem('token'), cid);
    form.value = response.data.case;

    form.value.photo = '';
    form.value.surgery_video = '';
    console.log("Loaded case data:", form.value);
  } catch (error) {
    console.error("Failed to load case data:", error);
  } finally {
    loading.value = false;
  }
};

watch(() => route.params.cid, (newCid, oldCid) => {
  fetchCaseData(newCid);
}, { immediate: true });

onMounted(() => {
  fetchCaseData(route.params.cid);
  // Other initializations if needed
});

</script>
