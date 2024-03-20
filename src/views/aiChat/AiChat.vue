<template>
    <a-layout class="chatbox-layout">
        <a-layout-content class="chat-display">
            <!-- Display the response -->
            <p>{{ responseText }}</p>
        </a-layout-content>
        <a-input-group compact class="chat-input-group">
            <a-input v-model:value ="userInput" placeholder="Type your question here..." />
            <a-button type="primary" @click="submitQuery">Submit</a-button>
        </a-input-group>
    </a-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Button, Input, Layout, InputGroup } from 'ant-design-vue';
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { HumanMessage } from "@langchain/core/messages";
import { OpenAIEmbeddings, ChatOpenAI, } from "@langchain/openai";
import axios from 'axios';

// Assuming you have an environment variable for OpenAI API Key
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY as string;
const docs = ref(''); // Initialize docs as a reactive reference

const userInput = ref('');
const responseText = ref('');
onMounted(async () => {
    const response = await axios.get('/knowledge/system.txt');
    docs.value =response.data; // Update the reactive reference with the loaded data
});

const submitQuery = async () => {

    // Initialize ChatGPT with your OpenAI API key
    const chat = new ChatOpenAI({ modelName: "gpt-3.5-turbo", temperature: 0, openAIApiKey: OPENAI_API_KEY });

    console.log(userInput.value);
    // Send the query to ChatGPT

    const response = await chat.invoke([
    new HumanMessage(
        userInput.value
    ),
    ]);
    console.log(response);
    responseText.value = response.content as string;
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