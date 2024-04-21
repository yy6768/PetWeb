<template>
  <div class="home-page">
    <el-container>
      <el-main>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>项目背景</span>
          </div>
          <div>
            <p>
              宠物医院近年来在国内逐步兴起，缺乏符合资质的宠物医生是一个瓶颈。虚拟宠物医院学习系统通过提供一个虚拟的教学平台，允许宠物医疗工作者在不前往实体医院的情况下学习和训练，包含200个真实病例，增强临床经验，为成为合格的宠物医生提供帮助。
            </p>

          </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>系统功能概述</span>
          </div>
          <div>
            <p>
              为配合软件开发实践课程的教学内容和教学目标，虚拟宠物医院学习系统被划分为前台和后台两个部分：</p>

            <p>
              前台功能模块：医院导览展示，职能学习，测试；</p>
            <p>
              后台功能模块：系统管理、病种管理、病例管理、测试管理、数据管理。</p>

          </div>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ElContainer, ElHeader, ElMain, ElFooter, ElCard, ElButton } from 'element-plus';

const goBack = () => {
  window.scrollTo(0, 0);
};
</script>

<style scoped>
.home-page .el-header {
  background-color: #A9A9A9;
  color: white;
  padding: 30px;
}

.home-page .el-footer {
  background-color: #A9A9A9;
  text-align: center;
  line-height: 60px;
}

.box-card {
  margin-bottom: 20px;
}
</style>
