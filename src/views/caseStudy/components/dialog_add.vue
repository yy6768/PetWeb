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

      <el-form-item v-if="dialogTitleAdd === '病例详情'" class="form-item-inline">
        <el-text style="margin-right:13px">编号</el-text>
        <el-input v-model="form.id" readonly class="inline-input"/>
        <el-text style="margin-right:13px">病名</el-text>
        <el-input v-model="form.name" readonly class="inline-input"/>
      </el-form-item>

        <el-form-item label="基本情况" prop="basic" v-if="dialogTitleAdd === '病例详情'">
        <el-input v-model="form.basic" type="textarea" style="width: 425px;" />
      </el-form-item>

      <el-form-item label="化验项目" prop="laboratory" v-if="dialogTitleAdd === '病例详情'">
        <el-card class="lab-card">
          <el-input v-model="form.lab_name" placeholder="项目名称"></el-input>
          <el-input v-model="form.lab_result" placeholder="项目结果"></el-input>
          <el-input v-model="form.lab_cost" placeholder="项目费用"></el-input>
          <!-- 项目图片 -->
          <el-upload
              action="#"
              list-type="picture-card"
              :file-list="form.lab_image"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
          >
          </el-upload>
        </el-card>
<!--        <el-button class="add-item-btn" size="small"  type="primary" round @click="storeItem">保存</el-button>-->
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
      <el-form-item label="治疗视频" prop="video" v-if="dialogTitleAdd === '病例详情'">
        <el-upload
            action="#"
            :file-list="form.video"
            class="video-upload"
            :show-file-list="false"
        >
          <el-button size="small" type="primary">添加视频</el-button>
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
import  {defineEmits,ref,defineProps,watch} from 'vue'
import  {addCase,editCase} from '@/api/case'
import { ElMessage, ElUpload, ElButton, ElInput } from "element-plus";

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
  lab_name:'',
  lab_result:'',
  lab_cost:'',
  lab_image:[],
  medicine:'',
  results:'',
  plan:'',
  video:[],
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

const storeItem = () => {
};

const handlePreview = (file: any) => {
  // 处理图片预览
};

const handleRemove = (file: any) => {
  // 处理删除图片
};


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
