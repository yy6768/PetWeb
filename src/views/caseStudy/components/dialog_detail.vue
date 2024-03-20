<template>
  <el-dialog
      :model-value="dialogVisibleDetail"
      :title="dialogTitleDetail"
      width="40%"
      @close="handleClose"
  >
    <el-form ref="formRef" :model="form" label-width="70px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="编号">
            <el-input v-model="form.id" style="width: 150px;" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="疾病名称">
            <el-input v-model="form.name" style="width: 150px;" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="基本情况">
        <el-input v-model="form.basic" type="textarea" style="width: 425px;" />
      </el-form-item>
      <el-form-item label="化验项目">
        <el-input v-model="form.laboratory" type="textarea" style="width: 425px;" />
      </el-form-item>
<!--      <div style="margin-left:440px; margin-bottom: 20px">-->
<!--        <el-button size="small"  type="primary" round >新增+</el-button>-->
<!--      </div>-->
      <el-form-item label="治疗药品">
        <el-select v-model="form.medicine" placeholder="请选择药品" style="width: 425px;">
          <el-option label="药品一" value="one" />
          <el-option label="药品二" value="two" />
        </el-select>
      </el-form-item>

      <el-form-item label="诊断结果">
        <el-input v-model="form.results" type="textarea" style="width: 425px;" />
      </el-form-item>
      <el-form-item label="治疗方案">
        <el-input v-model="form.plan" type="textarea" style="width: 425px;" />
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
import {defineEmits,ref,defineProps} from 'vue'
import {ElMessage, ElMessageBox} from "element-plus";
import {meds} from './meds'

//顶部文字内容
defineProps({
  dialogTitleDetail:{
    type:String,
    default:'',
    required:true
  }
})
//弹窗关闭
const emits = defineEmits(['update:modelValue'])
const handleClose = () =>{
  emits('update:modelValue',false)
}
//修改确认
const handleConfirm = () =>{
  ElMessageBox.confirm(
      'Modify details content. Continue?',
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
          message: 'Modification successful',
        })
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: 'Modification failed',
        })
      })
  handleClose()
}
// 详情页信息
const formRef = ref(null)
const form = ref({
  id:'',
  name:'',
  basic:'',
  laboratory:'',
  medicine:'',
  results:'',
  plan:''
})
// //药品信息
// const medsData = ref([
//   {
//     medicine_name: '药品一',
//     medicine_price:'价格一',
//   },
//   {
//     medicine_name: '药品二',
//     medicine_price:'价格二',
//   },
// ])
</script>

<style></style>
