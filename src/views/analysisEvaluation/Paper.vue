<template>
  <el-card>
    <div class="navigation-bar">
            <el-button @click="goBack" :icon="ArrowLeft">返回</el-button>
        </div>
    <div class="paper-header">
      <h2>{{ paperDetails.paperName }}</h2>
      <div class="countdown-timer">剩余时间: {{ countdown }}</div>

      <p>总分: {{ paperDetails.totalMark }}</p>
      
    </div>

    <div class="question-list">
      <div v-for="question in paperDetails.question_list" :key="question.num" class="question-item">
        <div class="question-description">{{ question.num }}. {{ question.description }} ({{ question.mark }} marks)</div>
        <el-radio-group v-model="answers[question.num]" @change="handleRadioChange">
            <el-radio 
                v-for="(option, index) in getOptions(question)" 
                :key="index+1" 
                :value = "index+1"
                :label="option.content"
                >
                {{ option.content }}
            </el-radio>
        </el-radio-group>
      </div>
    </div>
    <div class="paper-header">

        <el-button  type="primary" @click="confirmSubmit" >提交试卷</el-button>
        <!-- Add additional buttons or actions as needed -->
    </div>

  </el-card>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { getContentByPid } from '@/api/exam';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox,ElLoading } from 'element-plus';
import {
    ArrowLeft,

} from '@element-plus/icons-vue'

const loading = ref(null); // This ref will store the loading instance

const router = useRouter();
const route = useRoute()
const websocket = ref(null);
const eu_id = ref();
const paperDetails = ref({
  paperName: '',
  totalMark: 0,
  question_list: []
});
const goBack = () => {
    router.back();
};
const answers = ref({});
const endTime = ref(null); // This will hold the exam end time
const countdown = ref('');

// Function to extract options from a question object
const getOptions = (question) => {
  return ['A', 'B', 'C', 'D'].map((letter, index) => {
    return { index: index + 1, content: question[`content${letter}`] };
  });
};

const handleRadioChange = (newValue) => {
  console.log('handleRadioChange:', answers.value);
  if (websocket.value && websocket.value.readyState === WebSocket.OPEN) {
    for (const [questionNum, answer] of Object.entries(answers.value)) {
      if (answer !== null) {
        websocket.value.send(`answer ${questionNum} ${answer}`);
      }
    }
  }
};

watch(() => route.params.eu_id, (newEuid, oldEuid) => {
 console.log("change")
}, { immediate: true });

const submitExam = async () => {
  console.log("answers", answers.value);
  if (websocket.value && websocket.value.readyState === WebSocket.OPEN) {
    await websocket.value.send("endExam")
    ElMessage.success('试卷提交成功');
    cleanup();
    router.push('/analysis-evaluation')
  }
  // Add logic to submit answers to the server
};

watch(() => answers.value, (newAnswers, oldAnswers) => {
  if (websocket.value && websocket.value.readyState === websocket.value.OPEN) {
    websocket.value.send("answer " + answers.value);
  }
});

// Function to calculate and update the countdown timer
const updateCountdown = () => {
  const now = new Date().getTime();
  const distance = endTime.value - now;

  if (distance <= 0) {
    clearInterval(timerInterval);
    countdown.value = 'Exam time is over';
    // You can also trigger any additional actions here, like auto-submitting the exam
    submitExam();
    
  } else {
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    countdown.value = `${hours}h ${minutes}m ${seconds}s`;
  }
};

let timerInterval; // This will hold the interval ID

onMounted(async () => {
  loading.value = ElLoading.service({
    lock: true,
    text: 'Loading...',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  const token = sessionStorage.getItem('token');
  const paperId = route.params.paper_id;
  eu_id.value = route.params.eu_id;
  const wsUri = `ws://localhost:3000/ws/exam/${eu_id.value}`;
  
  websocket.value = new WebSocket(wsUri);
  websocket.value.onopen = () => {
    // Now that the connection is open, it's safe to send a message
    console.log("WebSocket connection opened.");
    websocket.value.send("startExam");
  };

  websocket.value.onmessage = (event) => {
  // Parse the event data to JSON if the server sends a stringified JSON
  const data = JSON.parse(event.data);
  console.log("Message from server:", data);
  if(data.answerMap) {
    for (const [questionNum, selectedOption] of Object.entries(data.answerMap)) {
        answers.value[questionNum] = Number(selectedOption);
    }
    console.log("answers.value", answers.value)
  }
  if (data.time) {
      endTime.value = data.time; // Assume the server sends the end time in the correct format
      updateCountdown(); // Run once immediately to set the initial value
      timerInterval = setInterval(updateCountdown, 1000); // Update every second
    }
  // Now you can check if the message type is the expected one
  if(data.type === 'startExamResponse') {
    console.log("startExam response:", data.payload);
  }
};
  const response = await getContentByPid(paperId, token);
  console.log("getContentByPid", response);
  if (response.status === 200) {
    ElMessage.success('试卷加载成功');
    paperDetails.value.paperName = response.data.paperName;
    paperDetails.value.totalMark = response.data.totalMark;
    paperDetails.value.question_list = response.data.question_list;
    
    // Initialize answers with null for each question
    response.data.question_list.forEach(question => {
      answers[question.num] = null;
    });
  } 
  loading.value.close(); // This will stop the loading indicator



});

const confirmSubmit = () => {
  ElMessageBox.confirm(
    '确认要提交吗？提交后不可更改，考试将结束。',
    '提交确认',
    {
      confirmButtonText: '提交',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    submitExam(); // Proceed with submitting the exam
  }).catch(() => {
    ElMessage.info('提交已取消');
  });
};

const cleanup = () => {
  if (websocket.value) {
    websocket.value.close();
  }
  clearInterval(timerInterval);
};

onUnmounted(() => {
  cleanup();
});

</script>

<style scoped>
.paper-header {
  text-align: center;
  margin-bottom: 20px;
}

.question-item {
  margin-bottom: 15px;
}

.question-description {
  font-weight: bold;
  margin-bottom: 5px;
}
</style>
