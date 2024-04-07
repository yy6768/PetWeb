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
      <el-form-item label="编号" prop="id" v-if="dialogTitleAdd === '添加病例'" >
        <el-input v-model="form.id"/>
      </el-form-item>
      <el-form-item label="病种" prop="category" v-if="dialogTitleAdd === '添加病例'">
        <el-input v-model="form.category" />
      </el-form-item>
      <el-form-item label="病名" prop="name" v-if="dialogTitleAdd === '添加病例'">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="创建时间" prop="create_time" v-if="dialogTitleAdd === '添加病例'" >
          <el-date-picker
              v-model="form.create_time"
              type="date"
              placeholder="Pick a date"
              style="width: 100%"
          />
      </el-form-item>
      <el-form-item label="就诊医师" prop="doctor_name" v-if="dialogTitleAdd === '添加病例'" >
        <el-input v-model="form.doctor_name" />
      </el-form-item>
      <el-form-item label="编号" prop="id" v-if="dialogTitleAdd === '病例详情'">
        <el-input v-model="form.id" readonly/>
      </el-form-item>
      <el-form-item label="病名" prop="name" v-if="dialogTitleAdd === '病例详情'">
        <el-input v-model="form.name" readonly/>
      </el-form-item>
        <el-form-item label="基本情况" prop="basic" v-if="dialogTitleAdd === '病例详情'">
        <el-input v-model="form.basic" type="textarea" style="width: 425px;" />
      </el-form-item>
      <el-form-item label="化验项目" prop="laboratory" v-if="dialogTitleAdd === '病例详情'">
        <el-input v-model="form.laboratory" type="textarea" style="width: 425px;" />
      </el-form-item>
      <el-form-item label="治疗药品" prop="medicine" v-if="dialogTitleAdd === '病例详情'">
        <el-select v-model="form.medicine" placeholder="请选择药品" style="width: 425px;">
          <el-option label="药品一" value="one" />
          <el-option label="药品二" value="two" />
        </el-select>
      </el-form-item>
      <el-form-item label="诊断结果" prop="result" v-if="dialogTitleAdd === '病例详情'">
        <el-input v-model="form.results" type="textarea" style="width: 425px;" />
      </el-form-item>
      <el-form-item label="治疗方案" prop="plan" v-if="dialogTitleAdd === '病例详情'">
        <el-input v-model="form.plan" type="textarea" style="width: 425px;" />
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
import  {defineEmits,ref,defineProps,watch} from 'vue'
import  {addCase,editCase} from '@/api/case'
import {ElMessage} from "element-plus";

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
  id:'',
  category:'',
  name:'',
  create_time:'',
  doctor_name:'',
  basic:'',
  laboratory:'',
  medicine:'',
  results:'',
  plan:''
})

//输入信息校验
const rules = ref({
  id:[
    {
      required:true,
      message:'Please enter id',
      trigger:'blur'
    }
  ],
  category:[
    {
      required:true,
      message:'Please enter the category of case',
      trigger:'blur'
    }
  ],
  name:[
    {
      required:true,
      message:'Please enter the name of case',
      trigger:'blur'
    }
  ],
  create_time:[
    {
      required:true,
      message:'Please enter the time you create',
      trigger:'blur'
    }
  ],
  doctor_name:[
    {
      required:true,
      message:'Please input the name of doctor',
      trigger:'blur'
    }
  ],
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
  formRef.value.validate(async (valid) => {
    if(valid){
      props.dialogTitleAdd === '添加病例'
          ? await addCase(form.value)
          : await editCase(form.value)
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

</style>
