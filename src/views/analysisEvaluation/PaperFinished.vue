<template>
    <el-card class="exam-review">
        <div class="navigation-bar">
            <el-button @click="goBack" :icon="ArrowLeft">返回</el-button>
        </div>
        <div class="exam-header">
            <h2>考试回顾</h2>
            <p>你的得分: {{ grade }}</p>
        </div>

        <div class="questions-container">
            <div v-for="question in questionAnswerList" :key="question.num" class="question-item">
                <div class="question-description">
                    {{ question.num }}. {{ question.description }} ({{ question.mark }} marks)
                </div>
                <el-radio-group v-model="answers[question.num]" disabled>
                    <el-radio v-for="index in 4" :key="index"
                        :label="question[`content${String.fromCharCode(64 + index)}`]" :value="index">
                        {{ question[`content${String.fromCharCode(64 + index)}`] }}
                    </el-radio>
                </el-radio-group>
                <div class="answer-indicator">
                    <p v-if="answers[question.num] === question.answer" style="color: green;">
                        你的答案正确
                    </p>
                    <p v-else style="color: red;">
                        正确答案: {{ question[`content${String.fromCharCode(64 + question.answer)}`] }}
                    </p>

                </div>
            </div>
        </div>
    </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getPastExamById } from '@/api/exam';
import { ElMessage } from 'element-plus';
import {
    ArrowLeft,

} from '@element-plus/icons-vue'
const router = useRouter();

const goBack = () => {
    router.back();
};
const route = useRoute();
const eu_id = route.params.eu_id;
const questionAnswerList = ref([]);
const grade = ref(0);
const answers = ref({});

onMounted(async () => {
    const token = sessionStorage.getItem('token');
    const response = await getPastExamById(eu_id, token);
    console.log("getPastExamById: ",response.data);
    if (response.status === 200) {
        if (response.data.error_message != 'success') {
            ElMessage.info(response.data.error_message);
            grade.value = '未参加考试';
            return;
        }
        questionAnswerList.value = response.data.question_answer_list;
        grade.value = response.data.grade;
        // Set selected answers for each question
        questionAnswerList.value.forEach(question => {
            answers.value[question.num] = question.option;
        });
    }
});
</script>

<style scoped>
.exam-review .questions-container .question-item {
    margin-bottom: 20px;
}

.exam-review .answer-indicator p {
    font-weight: bold;
}
</style>