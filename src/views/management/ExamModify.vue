<template>
    <el-form ref="formRef" :model="newExam" :rules="rules" label-width="100px" style="margin-top: 10px">
      <el-form-item label="考试名称">
        <el-input v-model="newExam.exam_name" />
      </el-form-item>


      <el-form-item label="参考人员">
        <el-select v-model="newExam.user_list"  multiple placeholder="请选择参考人员" @change="changeUserList">
          <!-- Options for users will go here -->
          <el-option
          v-for="item in userOptions"
          :key="item.uid"
          :label="item.username"
          :value="item.uid"
        />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"   @click="handleConfirm" >提交</el-button>
      </el-form-item>
    </el-form>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { UpdateExam, getAllUser, getExamDetailById } from '@/api/exam.js'; // Adjust the import path as necessary
interface userOption {
    uid: number;
    username: string;
}
const eid = ref(0);
const props = defineProps({
    eid: Number,
});
const userOptions = ref<userOption[]>([]);
const rules = {
    exam_name: [{ required: true, message: '请输入考试名称', trigger: 'blur' }],
    user_list: [{ required: true, message: '请选择参考人员', trigger: 'blur' }]
};
const newExam = ref({
    exam_id: props.eid,
    exam_name: '',
    user_list: []
});

const changeUserList = (value: number[]) => {
    console.log("changeUserList: ", value);
};
const handleConfirm = async () => {
    console.log("changeExam: ", newExam.value);
    try {
        //newExam.value.begin_time = new Date(newExam.value.begin_time).getTime();

        const res = await UpdateExam(newExam.value, sessionStorage.getItem('token'));
        console.log("respone: ", res.data)

        if (res.status === 200) {
            ElMessage.info(res.data.error_msg);
            // Reset the form
        } else {
            ElMessage.error("添加失败");
        }
    } catch (error) {
        console.log('error', error);
    }
};
onMounted(async () => {
    // Fetch all users
    const detail = await getExamDetailById(sessionStorage.getItem('token'), props.eid);
    const res = await getAllUser(sessionStorage.getItem('token'), 1, 100, '');
    console.log("detail: ", detail.data)
    console.log("getAllUser: ", res.data)
    
    newExam.value.exam_name = detail.data.examName;
    newExam.value.user_list = detail.data.userIds;
    console.log("newExam.value.user_list: ", newExam.value.user_list)
    if (res.status === 200) {
        // Set the options for the user list
        // The options should be an array of objects with the following structure:
        // { value: 'user_id', label: 'user_name' }
        userOptions.value = res.data.user_list
    } else {
        ElMessage.error(res.data.error_message);
    }
});
</script>