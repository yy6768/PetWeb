<template>
  <el-dialog
      :model-value="dialogVisibleAdd"
      :title="dialogTitleAdd"
      width="30%"
      draggable
      @close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px" >
      <el-col :span="22">
      <el-form-item label="病种" prop="category" v-if="dialogTitleAdd === '添加病例'">
        <el-select v-model="form.cateId" placeholder="请选择病种"
                   @click="fetchCategories">
          <el-option
              v-for="category in categoriesList"
              :key="category.cateId"
              :label="category.cateName"
              :value="category.cateId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="病名" prop="ill_name" v-if="dialogTitleAdd === '添加病例'">
        <el-select v-model="form.illId" placeholder="请选择病名"
                   @click="fetchIll">
          <el-option
              v-for="category in illList"
              :key="category.illId"
              :label="category.illName"
              :value="category.illId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="create_time" v-if="dialogTitleAdd === '添加病例'" >
          <el-date-picker
              v-model="form.date"
              type="date"
              placeholder="Pick a date"
              style="width: 100%"
          />
      </el-form-item>

      <el-form-item label="就诊医师" prop="doctor_name" v-if="dialogTitleAdd === '添加病例'">
        <el-select v-model="form.uid" placeholder="请选择医师"
                   @click="fetchName">
          <el-option
              v-for="category in nameList"
              :key="category.uid"
              :label="category.username"
              :value="category.uid"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-if="dialogTitleAdd === '病例详情'" class="form-item-inline">
        <el-text style="margin-right:13px">编号</el-text>
        <el-input v-model="form.cid" readonly class="inline-input"/>
        <el-text style="margin-right:13px">病名</el-text>
        <el-input v-model="form.ill_name" readonly class="inline-input"/>
      </el-form-item>

        <el-form-item label="基本情况" prop="basic_situation" v-if="dialogTitleAdd === '病例详情'">
        <el-input v-model="form.basic_situation" type="textarea" style="width: 425px;" />
      </el-form-item>

      <el-form-item label="化验项目" prop="laboratory" v-if="dialogTitleAdd === '病例详情'">
        <el-card class="lab-card">

          <el-select v-model="form.lab_name" placeholder="项目名称"
                     @click="fetchLab">
            <el-option
                v-for="category in labList"
                :key="category.labId"
                :label="category.labName"
                :value="category.labId"
            ></el-option>
          </el-select>
          <el-select v-model="form.lab_cost" placeholder="项目费用"
                     @click="fetchLab">
            <el-option
                v-for="category in labList"
                :key="category.labId"
                :label="category.labCost"
                :value="category.labId"
            ></el-option>
          </el-select>

          <el-input v-model="form.lab_result" placeholder="项目结果"></el-input>
          <!-- 项目图片 -->
          <el-upload
              v-model="form.lab_photo"
              action="http://localhost:3001/vid/case/upload"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
          <el-dialog v-model="dialogVisible">
            <img w-full :src="dialogImageUrl" alt="Preview Image" />
          </el-dialog>
        </el-card>
      </el-form-item>
        <el-form-item label="治疗药品" prop="medicine" v-if="dialogTitleAdd === '病例详情'" style="display: flex;">
          <el-select v-model="form.medicine_name" placeholder="请选择药品" style="width: 50%;" @click="fetchMed">
            <el-option
                v-for="category in medList"
                :key="category.medicineId"
                :label="category.medicineName"
                :value="category.medicineId"
            ></el-option>
          </el-select>
          <el-select v-model="form.medicine_cost" placeholder="药品价格" style="width: 50%;" @click="fetchMed">
            <el-option
                v-for="category in medList"
                :key="category.medicineId"
                :label="category.medicineCost"
                :value="category.medicineId"
            ></el-option>
          </el-select>
        </el-form-item>
      <el-form-item label="诊断结果" prop="result" v-if="dialogTitleAdd === '病例详情'">
        <el-input v-model="form.result" type="textarea" style="width: 425px;" />
      </el-form-item>
      <el-form-item label="治疗方案" prop="therapy" v-if="dialogTitleAdd === '病例详情'">
        <el-input v-model="form.therapy" type="textarea" style="width: 425px;" />
      </el-form-item>
        <!-- 项目视频 -->
      <el-form-item label="治疗视频" prop="video" v-if="dialogTitleAdd === '病例详情'">
        <el-upload
            class="upload-demo"
            drag
            action="http://localhost:3001/vid/case/upload"
            multiple
            :file-size-limit="100 * 1024 * 1024"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        </el-upload>
      </el-form-item>
      </el-col>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import axios from 'axios';
import  {defineEmits,ref,defineProps,watch,onMounted} from 'vue'
import {addCase, editCase, getCase, getCate, getIll, getMed, getName,getLab} from '@/api/case.js'
import { ElMessage, ElUpload, ElButton, ElInput,ElForm, ElFormItem, ElSelect, ElOption } from "element-plus";
import { Plus } from '@element-plus/icons-vue'
import type { UploadProps, UploadUserFile } from 'element-plus'
// import queryForm from "@/views/management/ManageCases.vue"

//图片
const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
}

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}


//顶部文字内容
const props = defineProps({
  dialogTitleAdd:{
    type:String,
    default:'',
    required:true
  },
  dialogTableValueAdd:{
    type:Object,
    default:() => {}
  }
})

//新增病例信息
const formRef = ref(null)
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
  lab_id:1,
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

//病种
interface Category {
  cateId: number;
  cateName: string;
}

const categoriesList = ref<Category[]>([]); // 存储病种列表
// 获取病种列表
const fetchCategories = async () => {
    const response = await getCate({}, sessionStorage.getItem('token'));
    console.log(response)
    categoriesList.value = response.data.cate_list; // 将获取到的病种列表存储到 categoriesList 中
};
// 获取病种列表
onMounted(fetchCategories);

//病名
interface Illgory {
  illId:number;
  illName: string;
}
const illList = ref<Illgory[]>([]);
const fetchIll = async () => {
  const response = await getIll({}, sessionStorage.getItem('token'),form.value.cateId);
  console.log(response)
  illList.value = response.data.ill_list;

};

onMounted(fetchIll);

//获取医师
interface Namegory {
  uid:number;
  username: string;
  authority:number;
  access:number;
}
const nameList = ref<Namegory[]>([]);
const fetchName = async () => {
  const response = await getName({}, sessionStorage.getItem('token'),12345,1,1,10);
  console.log(response)
  nameList.value = response.data.user_list;
};
onMounted(fetchName);

//获取药品
interface Medgory {
  medicineId:number;
  medicineName:string;
  medicineCost:number;
}
const medList = ref<Medgory[]>([]);
const fetchMed = async () => {
  const response = await getMed({}, sessionStorage.getItem('token'));
  console.log(response)
  medList.value = response.data.medicine_list;
};
onMounted(fetchMed);

//获取化验项目
interface Labgory {
  labId:number;
  labName:string;
  labCost:number;
}
const labList = ref<Labgory[]>([]);
const fetchLab = async () => {
  const response = await getLab({}, sessionStorage.getItem('token'));
  console.log(response)
  labList.value = response.data.lab_list;
};
onMounted(fetchLab);


//输入信息校验
const rules = ref({
  // id:[
  //   {
  //     required:true,
  //     message:'Please enter id',
  //     trigger:'blur'
  //   }
  // ],
  // category:[
  //   {
  //     // required:true,
  //     message:'Please enter the category of case',
  //     trigger:'blur'
  //   }
  // ],
  // name:[
  //   {
  //     // required:true,
  //     message:'Please enter the name of case',
  //     trigger:'blur'
  //   }
  // ],
  date:[
    {
      required:true,
      message:'Please enter the time you create',
      trigger:'blur'
    }
  ],
  // doctor_name:[
  //   {
  //     // required:true,
  //     message:'Please input the name of doctor',
  //     trigger:'blur'
  //   }
  // ],
})

//监听
watch(
    ()=>props.dialogTableValueAdd,
    ()=>{
      console.log(props.dialogTableValueAdd)
      form.value = props.dialogTableValueAdd
    },
{deep:true,immediate:true}
)

//弹窗关闭 更新病例列表
const emits = defineEmits(['update:modelValue','initCaseList'])

const handleClose = () => {
  emits('update:modelValue',false)
}
//点击确认 表单验证/把表单值传过去
const handleConfirm = () => {
  formRef.value.validate(async (valid:any) => {
    if(valid){
      props.dialogTitleAdd === '添加病例'
          ? await addCase(form.value,sessionStorage.getItem('token'),form.value.userame,form.value.ill_name,form.value.date)
          : await editCase(form.value,sessionStorage.getItem('token'))
      //消息提示
      ElMessage({
        message:'Add successfully',
        type:'success'
      })
      emits('initCaseList')
      handleClose()
    }else{
      console.log('error submit!!')
      return false
    }
  })
}


</script>

<style>
.form-item-inline {
  margin-left:-40px;
  width:380px;
  flex: 0 0 auto;
}

.inline-input{
  flex: 1; /* 让两个输入框平分父容器的宽度 */
  margin-right: 20px; /* 可以添加一些间距 */
}

</style>
