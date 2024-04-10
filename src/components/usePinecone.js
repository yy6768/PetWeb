import OpenAI from "openai";
import { Pinecone } from '@pinecone-database/pinecone'; // 命名导入

// 兼容设置，确保在浏览器环境中可以正常使用全局对象
if (typeof global === "undefined") {
    window.global = window;
}

// API keys
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const PINECONE_API_KEY = import.meta.env.VITE_PINECONE_API_KEY;

// OpenAI and Pinecone clients
const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
});
const pc = new Pinecone({ apiKey: PINECONE_API_KEY });

// Pinecone index
const index = pc.index('petweb');
// 函数用于生成嵌入向量
export const embedText = async (text) => {
    const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text,
        encoding_format: "float",
    });
    return response.data[0].embedding;
};

// 函数用于添加数据到 Pinecone
export const pineconeAdd = async (id, namespace, input_text, metadata) => {
    const embedding = await embedText(input_text);
    try {
        const insertResponse = await index.namespace(namespace).upsert([
            {
                id: `${namespace}${id}`,
                values: embedding,
                metadata: metadata
            }
        ]);
        return { success: true, message: 'Pinecone 添加成功', detail: insertResponse };
    } catch (error) {
        return { success: false, message: 'Pinecone 插入错误', error };
    }
};

export const pineconeUpdate = async (id, namespace, input_text, metadata) => {
    const embedding = await embedText(input_text);
    try {
        const insertResponse = await index.namespace(namespace).update(
            {
                id: `${namespace}${id}`,
                values: embedding,
                metadata: metadata
            }
        );
        return { success: true, message: 'Pinecone 更新成功', detail: insertResponse };
    } catch (error) {
        return { success: false, message: 'Pinecone 插入错误', error };
    }
};

export const medicineFormatForLLM = (queryResponse) => {

    return queryResponse.matches.map(match => ({
        id: match.id,
        name: match.metadata.medicine_name,
        cost: match.metadata.medicine_cost,
        score: match.score
    }));
};

export const getMedicineLLMQuery = (data, userInput) => {
    // 将数据转换为文本形式，用于作为查询上下文
    const context = data.map(item => `ID: ${item.id}, 药品名称: ${item.name}, 药品花费（单位rmb）: ${item.cost}`).join('\n');
    return `根据下列搜索到的药品信息:\n${context}\n用中文回答用户提问：\n${userInput}。如果没有相似的就回答没有找到，并列出相关的信息`;
};

export const labFormatForLLM = (queryResponse) => {
    return queryResponse.matches.map(match => ({
        id: match.id,
        name: match.metadata.lab_name,
        cost: match.metadata.lab_cost,
        score: match.score
    }));
};

export const getLabLLMQuery = (data, userInput) => {
    // 将数据转换为文本形式，用于作为查询上下文
    const context = data.map(item => `ID: ${item.id}, 化验名称: ${item.name}, 化验花费（单位rmb）: ${item.cost}`).join('\n');
    return `根据下列搜索到的化验信息:\n${context}\n用中文回答用户提问：\n${userInput}`;
};
export const pineconeDelete = async (id, namespace) => {
    const ns = index.namespace('medicine');
    await ns.deleteOne(`${namespace}${id}`);
}
