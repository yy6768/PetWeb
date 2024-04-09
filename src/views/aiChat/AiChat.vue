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
              :disabled="item.disabled"
          />
        </el-select>

        <a-input-group compact class="chat-input-group">
          <a-input v-model:value ="userInput" placeholder="Type your question here..." />
          <a-button type="primary" @click="submitQuery">Submit</a-button>
        </a-input-group>

      </div>
    </a-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Button, Input, Layout, InputGroup } from 'ant-design-vue';
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { HumanMessage } from "@langchain/core/messages";
import { OpenAIEmbeddings, ChatOpenAI, } from "@langchain/openai";
import axios from 'axios';
import { embedText, getMedicineLLMQuery, medicineFormatForLLM } from '@/components/usePinecone';

// Assuming you have an environment variable for OpenAI API Key
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY as string;
const PINECONE_API_KEY = import.meta.env.VITE_PINECONE_API_KEY as string;
const docs = ref(''); // Initialize docs as a reactive reference
const value = ref('')
const queryType = ref('medicine');
const userInput = ref('');
const responseText = ref('');
console.log("pineconeIndex");

const pinecone = new Pinecone({ apiKey: PINECONE_API_KEY });

const pineconeIndex = pinecone.index('petweb');

console.log(pineconeIndex);
let vectorStore;

const options = [
  {
    value: 'system',
    label: '询问系统信息',
  },
  {
    value: 'medicine',
    label: '询问药品信息',
  },
  {
    value: 'case',
    label: '询问病例信息',
  },
]

onMounted(async () => {
    const response = await axios.get('/knowledge/system.txt');
    docs.value =response.data; // Update the reactive reference with the loaded data
});

const submitQuery = async () => {

  if (queryType.value === 'system') {
    // Initialize ChatGPT with your OpenAI API key
    const chat = new ChatOpenAI({modelName: "gpt-3.5-turbo", temperature: 0, openAIApiKey: OPENAI_API_KEY});

    console.log(userInput.value);
    // Send the query to ChatGPT

    const response = await chat.invoke([
      new HumanMessage(
          userInput.value
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

    const formattedData = medicineFormatForLLM(queryResponse);
    console.log("Formatted Data for LLM:", formattedData);


    const llmQuery = getMedicineLLMQuery(formattedData);
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
