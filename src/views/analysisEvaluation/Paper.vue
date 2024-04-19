<template>
  <el-card>
    <div class="paper-header">
      <h2>{{ paperDetails.paperName }}</h2>
      <p>Total Marks: {{ paperDetails.totalMark }}</p>
    </div>

    <div class="question-list">
      <div v-for="question in paperDetails.question_list" :key="question.num" class="question-item">
        <div class="question-description">{{ question.num }}. {{ question.description }} ({{ question.mark }} marks)</div>
        <el-radio-group v-model="answers[question.num]" @change="handleRadioChange">
            <el-radio 
                v-for="(option, index) in getOptions(question)" 
                :key="index" 
                :value = "index+1"
                :label="option.content"
                >
                {{ option.content }}
            </el-radio>
        </el-radio-group>
      </div>
    </div>
    <div class="paper-header">

        <el-button  type="primary" @click="submit" >提交试卷</el-button>
        <!-- Add additional buttons or actions as needed -->
    </div>

  </el-card>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { getContentByPid } from '@/api/exam';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute()
const websocket = ref(null);
const eu_id = ref();
const paperDetails = ref({
  paperName: '',
  totalMark: 0,
  question_list: []
});

const answers = ref({});

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

const submit = () => {
  console.log("answers", answers.value);
  if (websocket.value && websocket.value.readyState === WebSocket.OPEN) {

    websocket.value.send("endExam")
  }
  // Add logic to submit answers to the server
};

watch(() => answers.value, (newAnswers, oldAnswers) => {
  if (websocket.value && websocket.value.readyState === websocket.value.OPEN) {
    websocket.value.send("answer " + answers.value);
  }
});
onMounted(async () => {
  const paperId = 10;
  const token = sessionStorage.getItem('token');
  const response = await getContentByPid(paperId, token);
  console.log("getContentByPid", response);
  if (response.data.error_msg === 'success') {
    paperDetails.value.paperName = response.data.paperName;
    paperDetails.value.totalMark = response.data.totalMark;
    paperDetails.value.question_list = response.data.question_list;
    
    // Initialize answers with null for each question
    response.data.question_list.forEach(question => {
      answers[question.num] = null;
    });
  } else {
    // Handle error
  }
  eu_id.value = route.params.eu_id;
  const wsUri = `ws://localhost:3000/ws/exam/${eu_id.value}`;
  
  websocket.value = new WebSocket(wsUri);
  websocket.value.onopen = () => {
    // Now that the connection is open, it's safe to send a message
    console.log("WebSocket connection opened.");
    websocket.value.send("startExam");
  };

});
onUnmounted(() => {
  if (websocket.value) {
    websocket.value.close();
  }
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
