<template>
  <ElDialog :visible.sync="visible" title="详细信息" width="30%">
    <ElCard class="box-card">
      <div slot="header" class="clearfix">
        <span>当前操作：{{ anchor.anchorDesc }}</span>
      </div>
      <div>
        <h2>操作图片</h2>
        <img :src="anchor.imageUrl" alt="Image" style="width: 100%;" />
      </div>
      <div>
        <h2>教学视频</h2>
        <video :src="anchor.videoUrl" controls style="width: 100%;"></video>
      </div>
    </ElCard>
    <span slot="footer" class="dialog-footer">
      <ElButton @click="hide">关闭</ElButton>
    </span>
  </ElDialog>
</template>
  
<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { defineProps, defineEmits } from 'vue';
import { ElDialog, ElCard, ElButton } from 'element-plus';
import type { AnchorData } from '@/assets/scripts/anchor';

const props = defineProps<{
  anchor: AnchorData;
  visible: boolean;
}>();

const emit = defineEmits<{
  (event: 'update:visible', value: boolean): void;
}>();

const visible = ref(props.visible);

// 同步内部状态与外部属性变化
watchEffect(() => {
  visible.value = props.visible;
});

function hide() {
  visible.value = false;
  emit('update:visible', false);
}
</script>
  
<style scoped>
.box-card {
  margin-bottom: 20px;
}
.dialog-footer {
  text-align: right;
}
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
</style>
  