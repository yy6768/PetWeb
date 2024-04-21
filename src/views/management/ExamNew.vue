<template>
  <el-form ref="formRef" :model="newExam" :rules="rules" label-width="100px" style="margin-top: 10px">
    <el-form-item label="考试名称">
      <el-input v-model="newExam.exam_name" />
    </el-form-item>
    <el-form-item label="试卷编号">
      <el-select v-model="newExam.paper_id" placeholder="请选择试卷">
        <!-- Options for users will go here -->
        <el-option
          v-for="item in paperOptions"
          :key="item.paperId"
          :label="`编号${item.paperId}: ${item.paperName}- ${formatTime(item.time)}`"
          :value="item.paperId"
        />

      </el-select>
    </el-form-item>
    <el-form-item label="开始时间">
      <el-date-picker v-model="newExam.begin_time" type="datetime" placeholder="选择开始时间" format="YYYY/MM/DD hh:mm:ss">
      </el-date-picker>
    </el-form-item>

    <el-form-item label="参考人员">
      <el-select v-model="newExam.user_list" multiple placeholder="请选择参考人员">
        <!-- Options for users will go here -->
        <el-option v-for="item in userOptions" :key="item.uid" :label="item.username" :value="item.uid" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" native-type="submit" @click="handleConfirm">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { addExam, getAllUser, getAllPaper } from '@/api/exam.js'; // Adjust the import path as necessary
interface userOption {
  uid: number;
  username: string;
}
const paperOptions = ref([]);
const userOptions = ref<userOption[]>([]);
const rules = {
  exam_name: [{ required: true, message: '请输入考试名称', trigger: 'blur' }],
  paper_id: [{ required: true, message: '请输入试卷编号', trigger: 'blur' }],
  begin_time: [{ required: true, message: '请输入开始时间', trigger: 'blur' }],
  user_list: [{ required: true, message: '请选择参考人员', trigger: 'blur' }]
};
const newExam = ref({
  exam_name: '',
  paper_id: null,
  begin_time: '',
  user_list: []
});
function formatDateTime(date) {
  const y = date.getFullYear();
  const m = date.getMonth() + 1; // getMonth() is zero-based
  const d = date.getDate();
  const h = date.getHours();
  const min = date.getMinutes();
  const s = date.getSeconds();
  return `${y}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')} ${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const sec = seconds % 60;
  return `${hours > 0 ? `${hours}小时 ` : ''}${minutes > 0 ? `${minutes}分钟 ` : ''}${sec}秒`;
}
const handleConfirm = async () => {
  console.log("newExam: ", newExam.value);
  try {
    //newExam.value.begin_time = new Date(newExam.value.begin_time).getTime();
    const date = new Date(newExam.value.begin_time);
    newExam.value.begin_time = formatDateTime(date);

    const res = await addExam(newExam.value, sessionStorage.getItem('token'));
    if (res.status === 200) {
      ElMessage.success('添加成功');
      // Reset the form
      newExam.value = {
        exam_name: '',
        paper_id: 0,
        begin_time: '',
        user_list: []
      };
    } else {
      ElMessage.error("添加失败");
    }
  } catch (error) {
    console.log('error', error);
  }
};
onMounted(async () => {
  // Fetch all users
  const res = await getAllUser(sessionStorage.getItem('token'), 1, 100, '');
  if (res.status === 200) {

    console.log(res.data)
    userOptions.value = res.data.user_list
  } else {
    ElMessage.error(res.data.error_message);
  }
  const res2 = await getAllPaper(sessionStorage.getItem('token'), 1, 100, 0);
  if (res2.status === 200) {
    console.log(res2.data)
    paperOptions.value = res2.data.paper_list
  } else {
    ElMessage.error(res2.data.error_message);
  }
});
</script>