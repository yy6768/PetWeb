<template>
    <a-layout class="chatbox-layout">
        <a-layout-content class="chat-display">
            <!-- Display the response -->
            <p>{{ responseText }}</p>
        </a-layout-content>
        <a-input-group compact class="chat-input-group">
            <a-input v-model="userInput" placeholder="Type your question here..." />
            <a-button type="primary" @click="submitQuery">Submit</a-button>
        </a-input-group>
    </a-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Button, Input, Layout, InputGroup } from 'ant-design-vue';
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { pull } from "langchain/hub";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
// Sample docs array for demonstration
import axios from 'axios';

const pTagSelector = "p";
const docs = ref(''); // Initialize docs as a reactive reference

onMounted(async () => {
    const response = await axios.get('/knowledge/system.txt');
    docs.value =response.data; // Update the reactive reference with the loaded data
});

const userInput = ref('');
const responseText = ref('');

const submitQuery = () => {
    responseText.value = docs.value;
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
    display: flex;
    justify-content: space-between;
}
</style>