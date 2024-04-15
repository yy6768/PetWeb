<template>
  <div class="role-selection">
    <a-radio-group v-model:value="selectedRole" @change="onRoleChange">
      <a-radio-button value="receptionist">前台</a-radio-button>
      <a-radio-button value="assistant">医助</a-radio-button>
      <a-radio-button value="doctor">医师</a-radio-button>
    </a-radio-group>
    <div style="margin: 15px">
      <a-steps  v-if="selectedRole === 'receptionist'" v-model:current="current">
        <a-step title="客户接待" description="欢迎到访的客户，提供咨询服务。" />
        <a-step title="预约管理" description="安排和管理客户的预约时间。" />
        <a-step title="档案管理" description="维护客户和宠物的档案记录。" />
      </a-steps>
      <a-steps  v-if="selectedRole === 'assistant'" v-model:current="current">
        <a-step title="检查准备" description="准备检查室，确保所有设备就绪。" />
        <a-step title="辅助检查" description="在医师检查期间协助操作设备。" />
        <a-step title="采集样本" description="负责采集宠物的血液和其他生物样本。" />
      </a-steps>
      <a-steps  v-if="selectedRole === 'doctor'" v-model:current="current">
        <a-step title="诊疗宠物" description="根据宠物的症状进行诊断。" />
        <a-step title="处方药物" description="根据诊断结果开具药物。" />
        <a-step title="执行手术" description="在必要时为宠物进行手术治疗。" />
      </a-steps>
    </div>

    <div v-if="selectedRole === 'receptionist' && current === 0" class="consultation-form">
<!--      <h3>客户接待</h3>-->
      <h3>欢迎光临！</h3>
      <h3>我们宠物医院致力于为您的宠物提供最优质的医疗服务。请告诉我们您的需求，我们将竭诚为您服务。</h3>
      <p>前台：欢迎光临宠物医院！您好，有什么可以帮助您的吗？</p>
      <p>客户：你好，我的狗最近食欲不振，我想预约一个检查。</p>
      <p>前台：好的，让我为您安排一下。请问您的狗狗叫什么名字？</p>
      <p>客户：它叫巴克。</p>
      <p>前台：好的，请问它有什么特别的症状吗？</p>
      <p>客户：它最近不怎么吃东西，而且精神也不太好。</p>
      <p>前台：好的，我会记录下来。我们的医生会进行一些检查来确保它的健康。请问您方便今天下午还是明天？</p>
      <p>客户：今天下午可以吗？</p>
      <p>前台：让我查一下我们的医生日程表。稍等片刻。</p>
<!--      <el-form ref="consultationForm" :model="consultationForm" label-width="100px">-->
<!--        <p>请问您的姓名是？</p>-->
<!--        <el-form-item label="客户姓名">-->
<!--          <el-input v-model="consultationForm.customerName" ></el-input>-->
<!--        </el-form-item>-->
<!--        <p>请问您的爱宠种类是？</p>-->
<!--        <el-form-item label="宠物种类">-->
<!--          <el-input v-model="consultationForm.petType" readonly></el-input>-->
<!--        </el-form-item>-->
<!--        <p>请问您要咨询的问题是？</p>-->
<!--        <el-form-item label="咨询问题">-->
<!--          <el-input type="textarea" v-model="consultationForm.query" rows="3" readonly></el-input>-->
<!--        </el-form-item>-->
        <div class="button-container">
          <el-button type="primary" @click="submitConsultationForm">下一步</el-button>
        </div>
<!--      </el-form>-->
  </div>

    <div v-if="selectedRole === 'receptionist' && current === 1" class="appointment-form">
      <h3>请稍等，我们将会为您登记预约信息</h3>
      <p>请输入客户姓名：</p>
      <el-input v-model="appointmentForm.customerName" placeholder="请输入客户姓名"></el-input>
      <p>请输入预约医师姓名：</p>
      <el-input v-model="appointmentForm.doctorName" placeholder="请输入医师姓名"></el-input>
      <p>请选择预约时间：</p>
      <el-date-picker v-model="appointmentForm.appointmentTime" type="datetime"></el-date-picker>
      <div class="button-container">
        <el-button type="primary" @click="submitAppointmentForm">下一步</el-button>
      </div>
    </div>

    <div v-if="selectedRole === 'receptionist' && current === 2" class="record-management-form">
      <h3>档案管理</h3>
<!--      <el-form ref="recordManagementForm" :model="recordManagementForm" label-width="100px">-->
<!--        <el-form-item label="客户姓名">-->
<!--          <el-input v-model="recordManagementForm.customerName"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="宠物名称">-->
<!--          <el-input v-model="recordManagementForm.petName"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="病例描述">-->
<!--          <el-input type="textarea" v-model="recordManagementForm.caseDescription" rows="3"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item>-->
<!--          <el-button type="primary" @click="submitRecordManagementForm">保存档案</el-button>-->
<!--        </el-form-item>-->
<!--      </el-form>-->
      <div class="button-container">
        <el-button type="primary" @click="submitRecordManagementForm">完成</el-button>
      </div>
    </div>

    <div v-if="selectedRole === 'assistant' && current === 0" class="preparation-form">
      <h3>检查准备</h3>
<!--      <el-form ref="preparationForm" :model="preparationForm" label-width="100px">-->
<!--        <el-form-item label="检查室准备">-->
<!--          <el-input type="textarea" v-model="preparationForm.roomPreparation" rows="3"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="设备准备">-->
<!--          <el-input type="textarea" v-model="preparationForm.equipmentPreparation" rows="3"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item>-->
<!--          <el-button type="primary" @click="submitPreparationForm">提交准备</el-button>-->
<!--        </el-form-item>-->
<!--      </el-form>-->
      <div class="button-container">
        <el-button type="primary" @click="submitPreparationForm">下一步</el-button>
      </div>
    </div>

    <div v-if="selectedRole === 'assistant' && current === 1" class="assistance-form">
      <h3>辅助检查</h3>
<!--      <el-form ref="assistanceForm" :model="assistanceForm" label-width="100px">-->
<!--        <el-form-item label="操作设备">-->
<!--          <el-input type="textarea" v-model="assistanceForm.operationEquipment" rows="3"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="协助医师">-->
<!--          <el-input type="textarea" v-model="assistanceForm.assistDoctor" rows="3"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item>-->
<!--          <el-button type="primary" @click="submitAssistanceForm">提交辅助</el-button>-->
<!--        </el-form-item>-->
<!--      </el-form>-->
      <div class="button-container">
        <el-button type="primary" @click="submitAssistanceForm">下一步</el-button>
      </div>
    </div>

    <div v-if="selectedRole === 'assistant' && current === 2" class="sample-collection-form">
      <h3>采集样本</h3>
<!--      <el-form ref="sampleCollectionForm" :model="sampleCollectionForm" label-width="100px">-->
<!--        <el-form-item label="血液采集">-->
<!--          <el-input type="textarea" v-model="sampleCollectionForm.bloodCollection" rows="3"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="其他样本">-->
<!--          <el-input type="textarea" v-model="sampleCollectionForm.otherSamples" rows="3"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item>-->
<!--          <el-button type="primary" @click="submitSampleCollectionForm">提交采集</el-button>-->
<!--        </el-form-item>-->
<!--      </el-form>-->
    </div>

    <div v-if="selectedRole === 'doctor' && current === 0" class="consultation-form">
      <h3>诊疗宠物</h3>
      <div class="button-container">
        <el-button type="primary" @click="submitDiagnoseForm">下一步</el-button>
      </div>
    </div>
    <div v-if="selectedRole === 'doctor' && current === 1" class="consultation-form">
      <h3>处方药物</h3>
      <div class="button-container">
        <el-button type="primary" @click="submitMedicineForm">下一步</el-button>
      </div>
    </div>
    <div v-if="selectedRole === 'doctor' && current === 2" class="consultation-form">
      <h3>执行手术</h3>
      <div class="button-container">
        <el-button type="primary" @click="submitSurgeryForm">下一步</el-button>
      </div>
    </div>

    <div class="demo-basic--circle">
      <div class="block">
        <el-avatar :size="100" :src="roleAvatars[selectedRole as keyof typeof roleAvatars]" />
      </div>
    </div>

    <div v-if="showInstrumentBox && selectedRole !== 'receptionist'" class="corner-container" style="width: 200px;">
      <div class="corner-header">器具</div>
      <div class="corner-content">
        <el-button type="text" @click="dialogFormVisible = true">功能说明</el-button>
        <el-button type="text">操作视频</el-button>
      </div>
      <el-dialog v-model="dialogFormVisible" title="器具" width="500" draggable>
        <el-form :model="form">

          <el-form-item label="器具名" :label-width="formLabelWidth">
            <el-select v-model="form.name" placeholder="请选择器具" autocomplete="off">
              <el-option
                  v-for="(instrument, index) in instruments"
                  :key="index"
                  :label="instrument.name"
                  :value="instrument.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form :model="formData" :label-width="formLabelWidth">
            <el-form-item label="操作者身份">
              <el-input v-if="selectedRole === 'assistant'" v-model="formData.assistantIdentity" autocomplete="off" readonly>
              </el-input>
              <el-input v-else-if="selectedRole === 'doctor'" v-model="formData.doctorIdentity" autocomplete="off" readonly>
              </el-input>
            </el-form-item>
          </el-form>
          <el-form-item label="功能" :label-width="formLabelWidth">
            <el-input
                v-model="form.function"
                style="width: 240px"
                :rows="2"
                type="textarea"
            />
          </el-form-item>
          <el-form-item label="操作流程" :label-width="formLabelWidth">
            <el-input
                v-model="form.process"
                style="width: 240px"
                :rows="2"
                type="textarea"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="dialogFormVisible = false">Cancel</el-button>
            <el-button type="primary" @click="dialogFormVisible = false">
              Confirm
            </el-button>
          </div>
        </template>
      </el-dialog>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive,toRefs} from 'vue';
import { ElForm, ElFormItem, ElInput, ElButton,ElAvatar } from 'element-plus';

const showInstrumentBox = ref(false)
const dialogFormVisible = ref(false)
const formLabelWidth = '140px'

// 角色头像映射表
import receptionistAvatar from '@/photo/receptionist.jpg';
import assistantAvatar from '@/photo/assistant.jpg';
import doctorAvatar from '@/photo/doctor.jpg';

// //头像边下拉框
// const toggleInstrumentBox = () => {
//   showAvatarBox.value = !showAvatarBox.value;
// };

//角色头像映射表
const roleAvatars = {
  receptionist: receptionistAvatar,
  assistant: assistantAvatar,
  doctor: doctorAvatar,
};

//器具
const instruments = ref([
  { name: '血压计' },
  { name: '体温计' },
  { name: '心电图仪' },
]);

const formData = ref({
  assistantIdentity: '医助',
  doctorIdentity: '医生'
})

const form = reactive({
  name: '',
  function:'',
  process:''
})

//客户接待
const consultationForm = reactive({
  customerName: '',
  petType:'',
  query: ''
});
const submitConsultationForm = () => {
  current.value++;
  console.log('提交的咨询信息：', consultationForm);
  // 这里可以添加代码将表单数据发送到后端
};

//预约管理
const appointmentForm = reactive({
  customerName:'',
  appointmentTime:'',
  doctorName:''
});
const submitAppointmentForm = () => {
  current.value++;
  console.log('提交的预约信息：', appointmentForm);
};

//档案管理
const recordManagementForm = reactive({
  customerName:'',
  petName:'',
  caseDescription:''
});
const submitRecordManagementForm = () => {
  console.log('提交的档案信息：', recordManagementForm);
};

//检查准备
const preparationForm = reactive({
  roomPreparation:'',
  equipmentPreparation:'',
  submitPreparationForm:''
});
const submitPreparationForm = () => {
  current.value++;
  console.log('提交的检查信息：', preparationForm);
};

//辅助检查
const assistanceForm = reactive({
  operationEquipment:'',
  assistDoctor:'',
  submitAssistanceForm:''
});
const submitAssistanceForm = () => {
  current.value++;
  console.log('提交的辅助信息：', assistanceForm);
};

//采集样本
const sampleCollectionForm = reactive({
  bloodCollection:'',
  otherSamples:'',
});
const submitSampleCollectionForm = () => {
  console.log('提交的采集信息：', sampleCollectionForm);
};

//诊疗宠物
const submitDiagnoseForm = () => {
  current.value++;
  console.log('提交的诊疗信息：', sampleCollectionForm);
};

//处方药物
const submitMedicineForm = () => {
  current.value++;
  console.log('提交的处方信息：', sampleCollectionForm);
};

//执行手术
const submitSurgeryForm = () => {
  current.value++;
  console.log('提交的手术信息：', sampleCollectionForm);
};

const selectedRole = ref('receptionist');
const current = ref<number>(0);
watch(current, () => {
  console.log(current.value);
})

const onRoleChange = (e) => {
  console.log(e.target.value);
  // 这里可以添加更多的逻辑来展示选择的职位的工作流程
  if (e.target.value === 'receptionist') {
    showInstrumentBox.value = false; // 隐藏器具框
    current.value=0;
  } else {
    showInstrumentBox.value = true; // 显示器具框
    current.value=0;
  }
};
</script>

<style>

.corner-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.corner-header {
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
  margin-right: 100px;
}

.corner-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.corner-avatar{
  position: fixed;
  bottom: 80px;
  right: 860px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.demo-basic {
  text-align: center;
}
.demo-basic .sub-title {
  margin-bottom: 10px;
  font-size: 14px;
  color: var(--el-text-color-secondary);
}
.demo-basic .demo-basic--circle,
.demo-basic .demo-basic--square {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.demo-basic--circle {
  position: fixed;  /* 使用 fixed 或 absolute 根据需求选择 */
  bottom: 50px;
  padding: 10px; /* 根据需求调整边距 */
}

.button-container {
  text-align: center; /* 水平居中 */
}

.role-selection {
  /* 样式代码 */
}
.role-description {
  /* 样式代码 */
}
</style>
