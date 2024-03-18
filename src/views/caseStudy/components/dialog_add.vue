<template>
  <el-dialog
      :model-value="dialogVisibleAdd"
      :title="dialogTitleAdd"
      width="40%"
      @close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px" >
      <el-form-item label="编号" prop="id">
        <el-input v-model="form.id" />
      </el-form-item>
      <el-form-item label="病种" prop="category">
        <el-input v-model="form.category" />
      </el-form-item>
      <el-form-item label="病名" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="创建时间" prop="create_time">
        <el-input v-model="form.create_time" />
      </el-form-item>
      <el-form-item label="就诊医师" prop="doctor_name">
        <el-input v-model="form.doctor_name" />
      </el-form-item>
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
import  {defineEmits,ref,defineProps} from 'vue'

//标签内容
defineProps({
  dialogTitleAdd:{
    type:String,
    default:'',
    required:true
  }
})
//标签关闭
const emits = defineEmits(['update:modelValue'])
const handleClose = () => {
  emits('update:modelValue',false)
}
const handleConfirm = () => {
  handleClose()
}
//新增病例信息
const formRef = ref(null)
const form = ref({
  id:'',
  category:'',
  name:'',
  create_time:'',
  doctor_name:'',
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

</script>

<style>

</style>
