<template>
  <a-layout class="chatbox-layout">
    <a-layout-content class="chat-display">
      <!-- Display the response -->
      <p>{{ responseText }}</p>
    </a-layout-content>
    <div style="display: flex; flex-direction: row; justify-content: center; align-items: center;">
      <el-select v-model="queryType" placeholder="Select" style="width: 200px">
        <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        />
      </el-select>

      <a-input-group compact class="chat-input-group">
        <a-input v-model:value="userInput" placeholder="Type your question here..."/>
        <a-button type="primary" @click="submitQuery">Submit</a-button>
      </a-input-group>

    </div>
  </a-layout>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue';
import {ElMessage, ElLoading} from 'element-plus';
import {Button, Input, Layout, InputGroup} from 'ant-design-vue';
import {Pinecone} from "@pinecone-database/pinecone";
import { DocxLoader } from "langchain/document_loaders/fs/docx";
import {HumanMessage} from "@langchain/core/messages";
import {OpenAIEmbeddings, ChatOpenAI,} from "@langchain/openai";
import axios from 'axios';
import {embedText, getMedicineLLMQuery, medicineFormatForLLM, getLabLLMQuery, labFormatForLLM} from '@/components/usePinecone';

const loading = ref(null); // This ref will store the loading instance

// Assuming you have an environment variable for OpenAI API Key
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY as string;
const PINECONE_API_KEY = import.meta.env.VITE_PINECONE_API_KEY as string;
const docs = ref(''); // Initialize docs as a reactive reference
const value = ref('')
const queryType = ref('system');
const userInput = ref('');
const responseText = ref('');
console.log("pineconeIndex");

const pinecone = new Pinecone({apiKey: PINECONE_API_KEY});

const pineconeIndex = pinecone.index('petweb');

console.log(pineconeIndex);
let vectorStore;
const chat = new ChatOpenAI({modelName: "gpt-3.5-turbo", temperature: 0, openAIApiKey: OPENAI_API_KEY,});

const options = [
  {
    value: 'system',
    label: '询问系统信息',
  },
  {
    value: 'medicine',
    label: '询问药品信息',
  },
  // {
  //   value: 'lab',
  //   label: '询问化验信息',
  // },
  // {
  //   value: 'case',
  //   label: '询问病例信息',
  // },
]

onMounted(async () => {
  const response = await axios.get('/knowledge/system.txt');
  docs.value = response.data; // Update the reactive reference with the loaded data
});

const submitQuery = async () => {
  loading.value = ElLoading.service({
    lock: true,
    text: 'Loading...',
    background: 'rgba(0, 0, 0, 0.7)',
  });

  if (queryType.value === 'system') {
    // Initialize ChatGPT with your OpenAI API key
    const chat = new ChatOpenAI({modelName: "gpt-3.5-turbo", temperature: 0.5, openAIApiKey: OPENAI_API_KEY});

    console.log(userInput.value);
    // Send the query to ChatGPT
     const llmQuery = `${docs.value}\n 根据上面的虚拟宠物医院系统信息，回答下面的用户提问：${userInput.value} `;
    const response = await chat.invoke([

      new HumanMessage(
          llmQuery
      ),

    ]);
    console.log(response);
    responseText.value = response.content as string;
  } else if (queryType.value === 'medicine') {

    const queryResponse = await pineconeIndex.namespace('medicine').query({
      topK: 5,
      vector: await embedText(userInput.value),
      includeMetadata: true,
    })
    console.log("Query Response:", queryResponse);
    responseText.value = "正在查询中...";
    // if (queryResponse?.data?.length === 0) {
    //   responseText.value = "没找到相关信息";
    //   return;
    // }

    const formattedData = medicineFormatForLLM(queryResponse);
    console.log("Formatted Data for LLM:", formattedData);

    const llmQuery = getMedicineLLMQuery(formattedData, userInput.value);
    console.log("LLM Query:", llmQuery);
    responseText.value = llmQuery;


    console.log(userInput.value);

    const response = await chat.invoke([
      new HumanMessage(
          llmQuery
      ),
    ]);
    console.log(response);
    responseText.value = response.content as string;
  }else if (queryType.value === 'lab') {

    const queryResponse = await pineconeIndex.namespace('lab').query({
      topK: 5,
      vector: await embedText(userInput.value),
      includeMetadata: true,
    })
    console.log("Query Response:", queryResponse);

    // if (queryResponse?.data?.length === 0) {
    //   responseText.value = "没找到相关信息";
    //   return;
    // }

    const formattedData = labFormatForLLM(queryResponse);
    console.log("Formatted Data for LLM:", formattedData);


    const llmQuery = getLabLLMQuery(formattedData, userInput.value);
    console.log("LLM Query:", llmQuery);
// 这里你可以将 llmQuery 发送到你的 LLM 服务进行查询

    const chat = new ChatOpenAI({modelName: "gpt-3.5-turbo", temperature: 0, openAIApiKey: OPENAI_API_KEY,});

    console.log(userInput.value);
    // Send the query to ChatGPT

    const response = await chat.invoke([
      new HumanMessage(
          llmQuery
      ),
    ]);
    console.log(response);
    responseText.value = response.content as string;
  }
  loading.value.close(); // This will stop the loading indicator
};

</script>


<style scoped>
.chatbox-layout {
  margin: 20px;
  height: 300px;
}

.chat-display {
  height: 80%;
  overflow-y: auto;
  margin-bottom: 20px;
  border: 1px solid #d9d9d9;
  padding: 20px;
}

.chat-input-group {
  margin-left: 10px;
  display: flex;
  justify-content: space-between;
}
</style>
