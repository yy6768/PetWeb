<template>
    <ElDialog v-model="dialogVisible" title="编辑锚点信息" width="40%">
      <ElForm ref="form" :model="formData" :rules="rules" label-width="100px">
        <ElFormItem label="锚点描述">
          <ElInput v-model="formData.anchorDesc" autocomplete="off"></ElInput>
        </ElFormItem>
        <ElFormItem label="操作图片">
          <ElUpload ref="uploadImageRef"
            class="upload-demo" action="/vid/case/upload" :auto-upload="false" :limit="1"
            :on-success="handleImageSuccess" :on-error="()=> loading.value.close()"
            accept="image/*">
            <template #trigger>
                <el-button type="primary">选择图片</el-button>
              </template>
              <el-button style="margin-left: 20px" type="success" @click="submitImageUpload">
                上传图片
              </el-button>
          </ElUpload>
        </ElFormItem>
        <ElFormItem label="教学视频">
          <ElUpload ref="uploadVideoRef"
            class="upload-demo"
            action="/vid/case/upload" 
            :auto-upload="false" :limit="1"
            :on-error="()=> loading.value.close()"
            :on-success="handleVideoSuccess" accept="video/*">
            <template #trigger>
                <el-button type="primary">选择视频</el-button>
            </template>
            <el-button style="margin-left: 20px" type="success" @click="submitVideoUpload">
                上传视频
            </el-button>
          </ElUpload>
        </ElFormItem>
      </ElForm>
      <span slot="footer" class="dialog-footer">
        <ElButton @click="cancel">取消</ElButton>
        <ElButton type="primary" @click="submitForm">提交</ElButton>
      </span> 
    </ElDialog>
</template>
  
<script setup lang="ts">
import { computed, ref, watch, defineProps, reactive } from 'vue';
import type { AnchorData } from '../assets/scripts/anchor';
import type { PropType } from 'vue';
import { addAnchor } from '@/api/anchor.js';
import {
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElUpload,
  ElLoading,
  ElMessage
} from 'element-plus';

const props = defineProps({
  anchor: {
    type: Object as PropType<AnchorData>,
    required: true
  },
  modelValue: {
    type: Boolean,
  }
});

const dialogVisible = computed({
      get: () => props.modelValue,
      set: (newValue) => emit('update:modelValue', newValue),
});

const emit = defineEmits(['update:modelValue']);
watch(dialogVisible, (newValue) => {
  emit('update:modelValue', newValue);
});

// 表单数据模型
const formData = reactive({
    anchorId: props.anchor.anchorId || -1,
    roomId: props.anchor.roomId || -1,
    anchorX: props.anchor.anchorX || 0.0,
    anchorY: props.anchor.anchorY || 0.0,
    anchorZ: props.anchor.anchorZ || 0.0,
    anchorDesc: props.anchor.anchorDesc || '',
    imageUrl: props.anchor.imageUrl || '',
    videoUrl: props.anchor.videoUrl || ''
});

watch(() => props.anchor, (newValue, oldValue) => {
  console.log(newValue);
  formData.anchorId = newValue.anchorId;
  formData.roomId = newValue.roomId;
  formData.anchorX = newValue.anchorX;
  formData.anchorY = newValue.anchorY;
  formData.anchorZ = newValue.anchorZ;
  formData.anchorDesc = newValue.anchorDesc;
  formData.imageUrl = newValue.imageUrl;
  formData.videoUrl = newValue.videoUrl;
}, { deep: true } );


const uploadImageRef = ref(null);
const uploadVideoRef = ref(null);
const loading = ref(null);

const handleImageSuccess = (response, file, fileList) => {
    console.log("Image upload successful:", response);
    formData.imageUrl = response.url; // Assuming `response.url` contains the image URL
    loading.value.close(); // This will stop the loading indicator
};

const handleVideoSuccess = (response, file, fileList) => {
    console.log("Video upload successful:", response);
    formData.videoUrl = response.url; // Assuming `response.url` contains the video URL
    loading.value.close(); // This will stop the loading indicator
};

const submitImageUpload = () => {
    console.log("uploadImageRef ", uploadImageRef.value)
    loading.value = ElLoading.service({
    lock: true,
    text: 'uploading...',
    background: 'rgba(0, 0, 0, 0.7)',
    });
    uploadImageRef.value.submit();
};

const submitVideoUpload = () => {
    loading.value = ElLoading.service({
    lock: true,
    text: 'uploading...',
    background: 'rgba(0, 0, 0, 0.7)',
    });
    uploadVideoRef.value.submit();
};


// 提交表单
async function submitForm() {
  if(formData.roomId === -1 ||
    formData.anchorZ === 0.0 || 
    formData.anchorDesc === '' ||
    formData.imageUrl === '' || formData.videoUrl === ''){
      console.log(formData);
      ElMessage.error('请填写完整信息');
      return;
  }
  const response = await addAnchor(sessionStorage.getItem('token'),formData);
    console.log("addAnchor response", response)
    if (response.data.error_message === "success") {
      ElMessage.success('锚点添加成功');
      cancel();
    } else {
      ElMessage.error(response.data.message);
    }
}

const rules = {
  anchorDesc:[{ required: true, message: '请输入锚点名', trigger: 'change' }],
}

function cancel() {
  formData.imageUrl = "";
  formData.videoUrl = "";
  formData.anchorDesc = "";
  // 从缓存中重新加载页面
  location.reload();

}

// 监听对话框可见性的改变，反馈给父组件
function updateVisibility(newValue) {
  if (newValue != dialogVisible.value) {
    dialogVisible.value = newValue;
    emit('update:modelValue', newValue);
  }
}



</script>
  
<style scoped>
.anchor-panel {
    position: absolute;
    min-width: 200px;
    min-height: 100px;
    background: white;
    border: 1px solid black;
    padding: 10px;
    top: 50px; 
    left: 50px; 
}

.upload-demo .el-upload-list {
    margin-top: 10px;
  }
  .dialog-footer {
    text-align: right;
  }
</style>