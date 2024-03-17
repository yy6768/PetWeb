<template>
    <el-card>
      <div>
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>病例学习</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
      <div class="margin"></div><!--    间距-->
      <div class="input_box">
            <div class="input_box-1">
              <el-input
                  placeholder="请输入关键字"
                  class="input-with-select"
              >
                <template #append>
                  <el-button ><el-icon><Search /></el-icon></el-button>
                </template>
              </el-input>
            </div>
            <div class="input_box-2">
              <el-input
                  placeholder="按编号排序"
                  class="input-with-select"
              >
                <template #append>
                  <el-select style="width: 40px">
                    <el-option label="按编号排序" value="1" />
                    <el-option label="按姓名排序" value="2" />
                    <el-option label="按时间排序" value="3" />
                  </el-select>
                </template>
              </el-input>
            </div>
          </div>
      <div class="margin"></div><!--    间距-->
      <div class="input_box">
          <div class="input_box-2">
            <el-input
                placeholder="病种"
                class="input-with-select"
            >
              <template #append>
                <el-select style="width: 40px">
                  <el-option label="病种1" value="1" />
                  <el-option label="病种2" value="2" />
                  <el-option label="病种3" value="3" />
                </el-select>
              </template>
            </el-input>
          </div>
          <div class="input_box-2">
            <el-input
                placeholder="病名"
                class="input-with-select"
            >
              <template #append>
                <el-select style="width: 40px">
                  <el-option label="病名1" value="1" />
                  <el-option label="病名2" value="2" />
                  <el-option label="病名3" value="3" />
                </el-select>
              </template>
            </el-input>
          </div>
          <div class="input_box-2">
            <el-input
                placeholder="年份"
                class="input-with-select"
            >
              <template #append>
                <el-select style="width: 40px">
                  <el-option label="2022" value="1" />
                  <el-option label="2023" value="2" />
                  <el-option label="2024" value="3" />
                </el-select>
              </template>
            </el-input>
          </div>
          <div class="input_box-2">
            <el-input
                placeholder="月份"
                class="input-with-select"
            >
              <template #append>
                <el-select style="width: 40px">
                  <el-option label="1" value="1" />
                  <el-option label="2" value="2" />
                  <el-option label="3" value="3" />
                </el-select>
              </template>
            </el-input>
          </div>
        </div>
      <div class="margin"></div>
      <div style="margin-left:1000px">
          <el-button size="small"  type="primary" round >新增</el-button>
      </div>
      <div class="margin"></div><!--    间距-->
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="id" label="编号" width="150" />
        <el-table-column prop="caseName" label="病种" width="150" />
        <el-table-column prop="caseCategory" label="病名" width="150" />
        <el-table-column prop="caseYear" label="年份" width="150" />
        <el-table-column prop="caseMonth" label="月份" width="150" />
        <el-table-column prop="doctorName" label="就诊医师" width="150"/>
        <el-table-column prop="operation" label="操作" width="160" />


        <template #default v-if="item.prop === 'operation'">
          <el-button size="small"  type="primary" >详情</el-button>
          <el-button size="small"  type="warning" >删除</el-button>
        </template>
      </el-table>
    </el-card>

<!--  <div class="about">-->
<!--      <h1>This is 病例学习</h1>-->
<!--      <p> Post test</p>-->
<!--      <p>{{ testData }}</p>-->
<!--  </div>-->
</template>

<script setup lang="ts">
import axios from 'axios';
import { onMounted, ref } from 'vue';
import {ArrowRight} from '@element-plus/icons-vue';
import {options} from './options';

const tableData = ref([
  {
    id: '1',
    caseName:'病种一',
    caseCategory:'病名一',
    caseYear:'2023',
    caseMonth:'1',
    doctorName:'医师一',
  },
  {
    id: '2',
    caseName:'病种二',
    caseCategory:'病名二',
    caseYear:'2024',
    caseMonth:'2',
    doctorName:'医师二',
  },
])

const testData = ref<string>('');
onMounted(async () => {
  try {
      const response = await axios.post('/api/test2', {
        key: 'value' // 你要POST的数据
      });
      console.log(response.data); // 假设后端返回的是 { message: 'Test2 response' }
      testData.value = response.data.message;
    } catch (error) {
      console.error(error);
    }
})
</script>

<style scoped>
    .margin{
      margin-bottom: 20px;
    }
    .input_box{
      display: flex; /* 使用 Flexbox 布局 */
    }
    .input_box-1{
      width:200px;
      margin-right:320px;
    }
    .input_box-2 {
      width:180px;
      margin-right:80px;
    }
    .page_content {
      background-color:white;
      height:100px;
    }
</style>
  