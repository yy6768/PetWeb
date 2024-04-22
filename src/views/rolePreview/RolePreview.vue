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
<!--      <h3>我们宠物医院致力于为您的宠物提供最优质的医疗服务。请告诉我们您的需求，我们将竭诚为您服务。</h3>-->
<!--      <p>前台：欢迎光临宠物医院！您好，有什么可以帮助您的吗？</p>-->
<!--      <p>客户：你好，我的狗最近食欲不振，我想预约一个检查。</p>-->
<!--      <p>前台：好的，让我为您安排一下。请问您的狗狗叫什么名字？</p>-->
<!--      <p>客户：它叫巴克。</p>-->
<!--      <p>前台：好的，请问它有什么特别的症状吗？</p>-->
<!--      <p>客户：它最近不怎么吃东西，而且精神也不太好。</p>-->
<!--      <p>前台：好的，我会记录下来。我们的医生会进行一些检查来确保它的健康。请问您方便今天下午还是明天？</p>-->
<!--      <p>客户：今天下午可以吗？</p>-->
<!--      <p>前台：让我查一下我们的医生日程表。稍等片刻。</p>-->
      <div >
        <p>你是今天的前台接待员，有宠物主人需要帮助，请选择你的回答：</p>
        <button @click="respond('您好，有什么可以帮您？')">宠主：我想预约看诊。</button><p></p>
        <button @click="respond('当然，请问您的宠物有什么症状？')">宠主：我家宠物不舒服。</button><p></p>
        <button @click="respond('请稍等，我马上为您查询空闲的医生')">宠主：我想带宠物看医生。</button><p></p>
        <button @click="respond('欢迎来到我们宠物医院，我可以为您提供什么帮助？')">其他</button>
        <p>{{ response }}</p>
      </div>
        <div class="button-container">
          <el-button type="primary" @click="submitConsultationForm">下一步</el-button>
        </div>
<!--      </el-form>-->
  </div>

    <div v-if="selectedRole === 'receptionist' && current === 1" class="appointment-form">
      <h3>请稍等，我们将会为您登记预约信息</h3>
<!--      <p>请输入客户姓名：</p>-->
<!--      <el-input v-model="appointmentForm.customerName" placeholder="登记客户姓名" class="small-input"></el-input>-->
<!--      <p>请输入宠物种类：</p>-->
<!--      <el-input v-model="appointmentForm.petName" placeholder="登记宠物种类" class="small-input"></el-input>-->
<!--      <p>请输入预约医师姓名：</p>-->
<!--      <el-input v-model="appointmentForm.doctorName" placeholder="登记医师姓名" class="small-input"></el-input>-->
<!--      <p>请选择预约时间：</p>-->
<!--      <el-date-picker v-model="appointmentForm.appointmentTime" type="datetime"></el-date-picker>-->
<!--      -->
      <p><strong>登记客户信息:</strong></p>
      <ul>
        <li>姓名、联系方式等</li>
      </ul>
      <p><strong>登记宠物信息:</strong></p>
      <ul>
        <li>种类、名字、年龄、疾病史等</li>
      </ul>
      <p><strong>登记医生信息:</strong></p>
      <ul>
        <li>医生姓名、可预约时间段、擅长领域等</li>
      </ul>
      <p><strong>登记预约信息:</strong></p>
      <ul>
        <li>预约日期、预约时间、预约目的（例如疫苗接种、体检、治疗等）</li>
      </ul>
      <div class="button-container">
        <el-button type="primary" @click="submitAppointmentForm">下一步</el-button>
      </div>
    </div>

    <div v-if="selectedRole === 'receptionist' && current === 2" class="record-management-form">
      <h3>作为宠物医院前台管理人员，维护客户和宠物的档案记录是你的主要责任之一</h3>
      <p><strong>建立客户档案:</strong></p>
        <ul>
          <li>当客户第一次到访时，创建一个客户档案，并记录客户的基本信息，包括姓名、联系方式、地址等。</li>
          <li>分配一个唯一的客户识别号或档案编号，以便将来查询和识别客户。</li>
        </ul>
      <p><strong>建立宠物档案:</strong></p>
      <ul>
        <li>对每只宠物都建立一个独立的档案，并与相应的客户档案关联。</li>
        <li>记录宠物的基本信息，如种类、性别、年龄、体重等。</li>
        <li>记录每次就诊的健康信息和诊断结果，包括疫苗接种记录、疾病诊断、治疗方案等。</li>
      </ul>
      <p><strong>管理预约和就诊安排:</strong></p>
      <ul>
        <li>根据客户的需求，安排宠物的预约和就诊时间，并记录在档案中。</li>
        <li>确保预约信息准确无误，并及时通知客户有关就诊时间和准备事项。</li>
      </ul>
      <p><strong>处理付款和账单:</strong></p>
      <ul>
        <li>记录每次就诊的费用，并为客户提供详细的账单和付款方式。</li>
        <li>确保账单准确无误，并根据客户的需求进行支付安排。</li>
      </ul>
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
<!--      </el-form>-->
      <div class="button-container">
        <el-button type="primary" @click="submitRecordManagementForm">完成</el-button>
      </div>
    </div>

    <div v-if="selectedRole === 'assistant' && current === 0" class="preparation-form">
      <h3>完成检查准备工作</h3>
      <p>准备检查室是确保宠物医院顺利运作的关键步骤之一</p>
      <p><strong>清洁和消毒：</strong></p>
      <ul>
        <li>检查室应该是清洁和消毒的，以确保宠物在安全的环境中接受治疗。</li>
        <li>使用合适的清洁剂清洁表面，特别是检查台、工作台和器械。</li>
      </ul>
      <p><strong>检查台和工作台：</strong></p>
      <ul>
        <li>确保检查台表面干净，放置干净的检查台纸或毛巾以保护宠物。</li>
        <li>工作台上准备好所需的器械和工具，如体温计、血压计、听诊器等。</li>
      </ul>
      <p><strong>器械和设备：</strong></p>
      <ul>
        <li>确保所有需要使用的器械和设备都处于工作状态，并进行必要的维护。</li>
        <li>包括但不限于注射器、钳子、剪刀、手术刀、灯具等。</li>
      </ul>
      <p><strong>药品和药物：</strong></p>
      <ul>
        <li>准备所需的药品和药物，根据医生的处方进行准备。</li>
        <li>确保药品储存合适，标签清晰。</li>
      </ul>
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
      <h3>协助宠物进入检查室时，提供安抚和舒适，确保它们不感到焦虑或紧张</h3>
      <p>根据需要协助宠物进行体位调整，使医生能够更好地进行检查</p>
      <p><strong>操作设备：</strong></p>
      <ul>
        <li>在医生的指导下，操作各种设备和器械，如血压计、体温计、听诊器等。</li>
        <li>确保设备使用正确，记录测量结果并向医生汇报。</li>
      </ul>
      <p><strong>提供支持：</strong></p>
      <ul>
        <li>在检查过程中，给予宠物和宠物主人足够的支持和关怀，以减轻他们的焦虑和担忧。</li>
        <li>对于需要进行治疗或采样的宠物，协助医生进行必要的操作，如抽血、采集样本等。</li>
      </ul>
      <p><strong>记录信息：</strong></p>
      <ul>
        <li>在检查过程中，记录医生的观察和诊断结果，包括体温、心率、呼吸等生理指标。</li>
        <li>记录医嘱和治疗方案，以便后续跟进和执行。</li>
      </ul>
      <p><strong>清理和整理：</strong></p>
      <ul>
        <li>在检查结束后，清理和整理检查室，包括清洁器械、处理废弃物、重置设备等。</li>
        <li>确保检查室恢复到整洁、有序的状态，为下一位宠物的检查做好准备。</li>
      </ul>
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
      <h3>完成样本采集工作</h3>
      <p>作为宠物医院的医助，负责采集宠物的样本是一项重要的任务。以下是你可能需要执行的步骤：</p>
      <p><strong>准备工作：</strong></p>
      <ul>
        <li>戴上一次性手套，确保采样区域和器具的清洁和消毒。</li>
        <li>准备好所需的采样器具，如采血针、采血管、尿液容器等。</li>
      </ul>
      <p><strong>准备宠物：</strong></p>
      <ul>
        <li>在采集样本之前，安抚宠物并与其主人交流，让宠物感到安心和舒适。</li>
        <li>根据需要，可能需要使用束带固定宠物的肢体，以便进行采样。</li>
      </ul>
      <p><strong>采集血液样本：</strong></p>
      <ul>
        <li>选择一个合适的静脉，并使用酒精消毒该部位。</li>
        <li>使用采血针穿刺静脉，将血液收集到采血管中。</li>
        <li>采血完成后，用棉球或绷带压迫采血点，以防止出血。</li>
      </ul>
      <p><strong>处理样本：</strong></p>
      <ul>
        <li>根据医生的要求，处理样本，如将血液送往实验室进行检测，或将其他生物样本保存起来以备后续分析。</li>
        <li>确保样本的储存和运输符合卫生和安全要求。</li>
      </ul>
      <div class="button-container">
        <el-button type="primary" @click="submitSampleCollectionForm">完成</el-button>
      </div>
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
      <h3>对宠物进行诊疗工作</h3>
      <p><strong>观察和收集病史：</strong></p>
      <ul>
        <li>仔细观察宠物的外表和行为，注意是否有异常迹象。</li>
        <li>询问宠物主人有关宠物的症状、生活习性、饮食情况等方面的信息，以收集病史资料。</li>
      </ul>
      <p><strong>体格检查：</strong></p>
      <ul>
        <li>对宠物进行全面的体格检查，包括测量体温、观察呼吸频率和心率、检查皮肤、查看口腔和牙齿等。</li>
      </ul>
      <p><strong>症状分析：</strong></p>
      <ul>
        <li>根据宠物的症状进行分析，例如是否有发热、呕吐、腹泻、咳嗽、活动减少等。</li>
        <li>这些症状可能与各种疾病或健康问题相关联，尝试根据症状组合进行初步的诊断。</li>
      </ul>
      <p><strong>制定诊断和治疗方案：</strong></p>
      <ul>
        <li>基于观察、体格检查和实验室检查的结果，制定诊断，并提出相应的治疗方案。</li>
        <li>治疗方案可能包括药物治疗、手术治疗、饮食调整等，取决于实际宠物的病情</li>
      </ul>
      <div class="button-container">
        <el-button type="primary" @click="submitDiagnoseForm">下一步</el-button>
      </div>
    </div>

    <div v-if="selectedRole === 'doctor' && current === 1" class="consultation-form">
      <h3>根据诊断结果可能会开具药物处方，以帮助宠物治疗疾病或缓解症状</h3>
      <p><strong>选择合适的药物：</strong></p>
      <ul>
        <li>根据诊断结果和宠物的病情，选择适当的药物进行治疗。</li>
        <li>药物可能是处方药、非处方药、抗生素、抗炎药、镇痛药等。</li>
      </ul>
      <p><strong>确定药物剂量和用法：</strong></p>
      <ul>
        <li>根据宠物的体重、年龄、病情严重程度等因素确定药物的剂量和用法。</li>
        <li>确保药物的剂量准确，以避免过量或剂量不足。</li>
      </ul>
      <p><strong>填写处方：</strong></p>
      <ul>
        <li>填写处方，包括药物名称、剂量、用法、疗程等信息。</li>
        <li>确保处方信息清晰明了，以便宠物主人能够正确使用药物。</li>
      </ul>
      <p><strong>提供说明和警示：</strong></p>
      <ul>
        <li>在处方上,应提供关于药物使用方法、注意事项和可能的副作用等信息。</li>
        <li>确保宠物主人了解如何正确使用药物，并注意可能的不良反应。</li>
      </ul>
      <div class="button-container">
        <el-button type="primary" @click="submitMedicineForm">下一步</el-button>
      </div>
    </div>

    <div v-if="selectedRole === 'doctor' && current === 2" class="consultation-form">
      <h3>执行手术</h3>
      <p><strong>手术准备：</strong></p>
      <ul>
        <li>在手术前，对宠物进行全面的评估，并与宠物主人讨论手术的目的、风险和后果。</li>
        <li>确保宠物处于良好的营养状态和整体健康，以提高手术成功率。</li>
      </ul>
      <p><strong>麻醉和监测：</strong></p>
      <ul>
        <li>在手术开始前，对宠物施以麻醉药物，使其处于无痛觉和无意识状态。</li>
        <li>使用监测设备，如心电图监测器、血氧饱和度监测器等，监测宠物的生命体征。</li>
      </ul>
      <p><strong>手术操作：</strong></p>
      <ul>
        <li>据手术的需要进行相应的操作，可能包括切开组织、修复损伤、移除肿块等。</li>
        <li>手术过程中，注意保护周围组织、控制出血，并尽量减少对宠物的创伤。</li>
      </ul>
      <p><strong>术后工作：</strong></p>
      <ul>
        <li>手术完成后，对手术部位进行缝合或包扎，以促进伤口愈合。</li>
        <li>在手术结束后，医生会逐渐停止麻醉药物，并监测宠物的醒醒过程。</li>
        <li>确保宠物恢复意识和正常生理功能后，可以移至恢复室继续监护。</li>
      </ul>
      <div class="button-container">
        <el-button type="primary" @click="submitSurgeryForm">完成</el-button>
      </div>
    </div>

    <div class="demo-basic--circle">
      <div class="block">
        <el-avatar :size="100" :src="roleAvatars[selectedRole as keyof typeof roleAvatars]" />
      </div>
    </div>

    <div v-if="showInstrumentBox && selectedRole !== 'receptionist'" class="corner-container" style="width: 200px;">
      <div class="corner-header">{{ form.name || '器具' }}</div>
      <div class="corner-content">
        <el-button type="text" @click="dialogFormVisible = true">功能说明</el-button>
        <el-button type="text" @click="openInstructionalVideo">操作视频</el-button>
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
                :rows="1"
                type="textarea"
            />
          </el-form-item>
          <el-form-item label="操作流程" :label-width="formLabelWidth">
            <el-input
                v-model="form.process"
                style="width: 240px"
                :rows="6"
                type="textarea"
                autosize
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button type="primary" @click="dialogFormVisible = false">
              确定
            </el-button>
          </div>
        </template>
      </el-dialog>

      <el-dialog v-model="videoDialogVisible" title="操作视频" width="700px">
        <video controls :src="videoSource" style="width: 100%;"></video>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="videoDialogVisible = false">关闭</el-button>
          </div>
        </template>
      </el-dialog>

    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive,toRefs} from 'vue';
import { ElForm, ElFormItem, ElInput, ElButton,ElAvatar } from 'element-plus';
// 角色头像映射表
import receptionistAvatar from '@/photo/receptionist.jpg';
import assistantAvatar from '@/photo/assistant.jpg';
import doctorAvatar from '@/photo/doctor.jpg';

const videoSource = ref({});


const showInstrumentBox = ref(false)
const dialogFormVisible = ref(false)
const formLabelWidth = '140px'
const response = ref('');
const videoDialogVisible = ref(false)


const respond = (message: string) => {
  response.value = `你的回答：${message}`;
};

//角色头像映射表
const roleAvatars = {
  receptionist: receptionistAvatar,
  assistant: assistantAvatar,
  doctor: doctorAvatar,
};


const form = reactive({
  name: '',
  function:'',
  process:''
})

//器具
const instruments = ref([
  { name: '宠物体温计', function: '测量宠物体温', process: '1. 准备好宠物体温计。\n2. 将宠物体温计放入宠物的直肠或口腔。\n3. 等待一段时间直到体温计发出提示声。\n4. 查看体温计上的数字显示宠物体温。' },
  { name: '宠物留置针', function: '在宠物体内留置导管，便于输液或药物注射', process: '1. 准备好宠物留置针及其相关器械和消毒液。\n2. 选择适当的留置针尺寸，根据宠物的大小和预计使用时间确定。\n3. 使用消毒液清洁并消毒留置针的周围皮肤，以预防感染。\n4. 缓慢而均匀地将留置针插入到宠物的皮下组织中，通常在颈部或背部。\n5. 确保留置针的稳固固定，并避免在插入过程中弄断或弯曲。\n6. 在需要时连接输液袋或注射器，并根据医嘱进行药物或液体的注入。\n7. 定期检查留置针的位置和状况，防止感染或脱出。\n8. 在使用完毕后，正确拆除留置针，并清洁周围皮肤，避免残留物和感染。' },
  { name: '宠物导尿管', function: '进行导尿', process: '1. 准备好宠物导尿管和所需的药物或液体。\n2. 使用消毒液清洁宠物的尿道口。\n3. 轻柔地将导尿管插入宠物的尿道，直至尿液开始流出。\n4. 将导尿管连接到收集容器，并控制导尿过程。' },
  { name: '宠物血氧仪', function: '监测宠物的血氧饱和度', process: '1. 准备好宠物血氧仪及其配件。\n2. 选择适当的探头，通常根据宠物的大小和皮毛密度选择。\n3. 将探头安装在宠物的耳垂、尾巴或其他较少毛发的部位。\n4. 开启血氧仪，等待设备稳定后读取血氧饱和度的值。' },
  { name: '宠物输液器', function: '静脉输液', process: '1. 准备好宠物输液器和所需的液体药物。\n2. 确保找到宠物的静脉注射点，通常在前腿或颈部。\n3. 将输液器连接到静脉注射点。\n4. 控制输液速度，并定期检查宠物的反应。' },
  { name: '宠物鼻饲管', function: '通过鼻腔进行喂养', process: '1. 准备好宠物鼻饲管和适当的喂养配方。\n2. 测量鼻饲管的长度，从鼻尖到胃部为止，以确保管子的正确长度。\n3. 轻轻将润滑过的鼻饲管通过宠物的鼻孔缓慢推进，直至达到预先测量的长度。\n4. 确认鼻饲管的位置，通常使用X光或听诊器检查是否到达胃部。\n5. 开始缓慢注入配方食物，注意观察宠物的反应和确保不造成窒息。\n6. 喂养结束后，清洁鼻饲管，并定期更换管道，以防感染或堵塞。' },
  { name: '宠物制氧机', function: '制造并提供纯净氧气给宠物', process: '1. 准备好宠物制氧机及其所有附件。\n2. 检查设备是否干净且连接完好，确保无泄漏。\n3. 根据宠物的需求，设置合适的氧气浓度和流量。\n4. 将输出管连接到合适的呼吸接口，如面罩或鼻插管。\n5. 轻轻地将呼吸接口放置在宠物的鼻子上，确保它舒适且密封良好。\n6. 开启制氧机，开始供氧。\n7. 在使用过程中持续监控宠物的反应和舒适度，必要时调整氧气设置。\n8. 使用完毕后，关闭设备并断开所有连接。\n9. 清洁和消毒呼吸接口及设备表面，以备下次使用。' },
  { name: '宠物心率仪', function: '给宠物测心率', process: '1. 准备好宠物心率仪。\n2. 将心率仪电极贴到特定位置，通常是宠物的胸部或前腿。\n3. 确保宠物平静，避免因紧张或活动而影响心率读数。\n4. 开启心率仪并记录数据，监测宠物的心率和心律。\n5. 测量完成后，记录结果，并根据需要进行健康评估或医疗干预。\n6. 清洁设备并妥善存放以备下次使用。' },
  { name: '宠物心电图仪', function: '记录宠物心电图', process: '1. 准备好宠物心电图仪。\n2. 清洁和剃光宠物的胸部。\n3. 将电极粘贴到特定的位置。\n4. 开始记录宠物的心电图。' },
  { name: '宠物食道饲管', function: '通过食道向宠物提供营养', process: '1. 准备好食道饲管及相关的营养液或食物。\n2. 对宠物进行轻度镇静，以减少安装过程中的不适。\n3. 仔细测量饲管长度，确保其从口腔延伸至适当的食道位置。\n4. 轻柔地通过宠物的口腔插入食道饲管，直到达到预计的位置。\n5. 确认饲管位置正确后，开始缓慢注入营养液或食物。\n6. 喂养结束后，清洁宠物的口腔和饲管，确保无食物残留。' },
  { name: '宠物气管插管', function: '为宠物提供呼吸支持', process: '1. 准备好气管插管及相关设备，如呼吸机和吸引装置。\n2. 对宠物进行全身麻醉，确保过程中宠物安静且无痛感。\n3. 打开宠物的口腔，轻柔地将气管镜插入，以视察气管开口。\n4. 在气管镜的指引下，将气管插管缓慢地插入到宠物的气管内。\n5. 确认插管位置正确，无气漏，并固定气管插管，防止移位。\n6. 连接呼吸机或其他辅助呼吸设备，开始为宠物提供必要的呼吸支持。\n7. 定期检查插管位置和功能，确保通气顺畅无阻碍。' },
  { name: '超声波洁牙机', function: '清洁宠物牙齿，去除牙石和菌斑', process: '1. 准备好超声波洁牙机及其附件。\n2. 安抚宠物，确保其处于舒适和可控的状态以便进行洁牙。\n3. 选择合适的洁牙头，根据宠物的牙齿大小和口腔状况调整。\n4. 轻轻地将洁牙机头放在宠物的牙齿上，使用超声波技术去除牙石和菌斑。\n5. 在整个过程中定期冲洗宠物的口腔，以清除松动的牙石和菌斑残留。\n6. 完成后，给宠物口腔冲洗清洁，确保没有洁牙材料残留。\n7. 对宠物进行奖励，以增强其对未来洁牙的积极态度。\n8. 清洁并消毒洁牙机头，准备下一次使用。' },
  { name: '宠物尿分析仪', function: '分析宠物尿液中的化学成分和指标', process: '1. 准备好宠物尿分析仪及其必要的试剂和耗材。\n2. 收集宠物的尿液样本，确保样本的新鲜性和完整性。\n3. 使用尿分析仪将尿液样本注入样本槽中。\n4. 启动分析仪，进行化学成分和指标的检测。\n5. 根据分析仪的结果，识别尿液中的蛋白质、葡萄糖、pH值等指标。\n6. 分析仪通常会提供打印或数字化的报告，记录并分析检测结果。\n7. 根据检测结果制定宠物的饮食和治疗计划。\n8. 清洁和维护尿分析仪，确保其准确性和可靠性。' },
]);

watch(() => form.name, (newVal) => {
  const selectedInstrument = instruments.value.find(instrument => instrument.name === newVal);
  if (selectedInstrument) {
    form.function = selectedInstrument.function;
    form.process = selectedInstrument.process;
  }
});


//操作视频
const openInstructionalVideo = () => {
  const selectedInstrumentName = form.name;
  console.log(`打开 ${selectedInstrumentName} 的操作视频`);
  if (selectedInstrumentName === '宠物体温计') {
    videoSource.value = "https://pethospital-1310941840.cos.ap-nanjing.myqcloud.com/video/18d330e5-70ea-4eba-a7f7-4646b2df9c1b_%E5%AE%A0%E7%89%A9%E5%8C%BB%E7%96%97%E6%95%99%E7%A8%8B%EF%BC%9A%E5%8A%A8%E7%89%A9%E4%BD%93%E6%B8%A9%E6%B5%8B%E9%87%8F.mp4";
    videoDialogVisible.value = true;
  }
  else if (selectedInstrumentName === '宠物血氧仪') {
    videoSource.value = "https://pethospital-1310941840.cos.ap-nanjing.myqcloud.com/video/73f8df0b-3cdc-41c6-ab24-e0264fbeffeb_%E5%AE%A0%E7%89%A9%E5%8C%BB%E7%96%97%E6%95%99%E7%A8%8B%EF%BC%9A%E8%A1%80%E6%B0%A7%E6%B5%8B%E9%87%8F.mp4";
    videoDialogVisible.value = true;
  }
  else if (selectedInstrumentName === '宠物输液器') {
    videoSource.value = "https://pethospital-1310941840.cos.ap-nanjing.myqcloud.com/video/cca8cf13-6f8c-4b21-aebf-1e6bd1b0609f_%E5%AE%A0%E7%89%A9%E5%8C%BB%E7%96%97%E6%95%99%E7%A8%8B%EF%BC%9A%E8%BE%93%E6%B6%B2%E6%93%8D%E4%BD%9C.mp4";
    videoDialogVisible.value = true;
  }
  else if (selectedInstrumentName === '宠物心率仪') {
    videoSource.value = "https://pethospital-1310941840.cos.ap-nanjing.myqcloud.com/video/4659733a-d1b9-4176-b71f-baff63e28e2a_%E5%AE%A0%E7%89%A9%E5%8C%BB%E7%96%97%E6%95%99%E7%A8%8B%EF%BC%9A%E5%BF%83%E7%8E%87%E6%B5%8B%E9%87%8F.mp4";
    videoDialogVisible.value = true;
  }
  else if (selectedInstrumentName === '宠物心电图仪') {
    videoSource.value = "https://pethospital-1310941840.cos.ap-nanjing.myqcloud.com/video/53f86187-2281-4dc0-9cb4-563096fbcbff_%E5%8A%A8%E7%89%A9%E5%8C%BB%E9%99%A2%20%20%E5%BF%83%E7%94%B5%E5%9B%BE%E4%B8%B4%E5%BA%8A%E6%93%8D%E4%BD%9C.mp4";
    videoDialogVisible.value = true;
  }
  else if (selectedInstrumentName === '宠物导尿管') {
    videoSource.value = "https://pethospital-1310941840.cos.ap-nanjing.myqcloud.com/video/3fe68900-c020-453e-95a9-7d2b18a85957_%E7%8C%AB%E5%AF%BC%E5%B0%BF%E6%93%8D%E4%BD%9C%E6%8A%80%E6%9C%AF.mp4";
    videoDialogVisible.value = true;
  }
  else if (selectedInstrumentName === '宠物食道饲管') {
    videoSource.value = "https://pethospital-1310941840.cos.ap-nanjing.myqcloud.com/video/686e1fed-419e-4995-b2c0-db1ff3b6366b_%E5%AE%A0%E7%89%A9%E9%A3%9F%E9%81%93%E9%A5%B2%E7%AE%A1%E6%94%BE%E7%BD%AE%E6%8A%80%E6%9C%AF%E5%8F%8A%E4%B8%B4%E5%BA%8A%E5%BA%94%E7%94%A8.mp4";
    videoDialogVisible.value = true;
  }
  else if (selectedInstrumentName === '宠物气管插管' ){
    videoSource.value = "https://pethospital-1310941840.cos.ap-nanjing.myqcloud.com/video/340d3561-6af7-43d5-b970-0881705161ed_%E7%8A%AC%E6%B0%94%E7%AE%A1%E6%8F%92%E7%AE%A1%E6%8A%80%E6%9C%AF%E6%93%8D%E4%BD%9C%E6%95%99%E5%AD%A6.mp4";
    videoDialogVisible.value = true;
  }
  else if(selectedInstrumentName === '宠物鼻饲管'){
    videoSource.value ="https://pethospital-1310941840.cos.ap-nanjing.myqcloud.com/video/fdd4fac9-2826-4307-a25a-ceb35111df89_%E5%AE%A0%E7%89%A9%E9%BC%BB%E9%A5%B2%E7%AE%A1%E7%9A%84%E6%94%BE%E7%BD%AE%E6%8A%80%E6%9C%AF%E5%92%8C%E5%BA%94%E7%94%A8.mp4";
    videoDialogVisible.value = true;
  }
  else if (selectedInstrumentName === '超声波洁牙机'){
    videoSource.value = "https://pethospital-1310941840.cos.ap-nanjing.myqcloud.com/video/57347156-d782-4fd0-8ab4-8bcf9752c74d_%E7%BB%B4%E6%B6%A6VRN-A8%E8%B6%85%E5%A3%B0%E6%B3%A2%E6%B4%81%E7%89%99%E6%9C%BA.mp4";
    videoDialogVisible.value = true;
  }
  else if (selectedInstrumentName === '宠物制氧机'){
    videoSource.value = "https://pethospital-1310941840.cos.ap-nanjing.myqcloud.com/video/6c01a371-112a-425f-a511-3006a7a025aa_%E5%88%B6%E6%B0%A7%E6%9C%BA%E6%97%A5%E5%B8%B8%E5%90%B8%E6%B0%A7%E5%92%8C%E9%9B%BE%E5%8C%96%E5%8A%9F%E8%83%BD%E4%BD%BF%E7%94%A8%E5%8F%8A%E7%BB%B4%E6%8A%A4%E8%AF%B4%E6%98%8E.mp4";
    videoDialogVisible.value = true;
  }
  else if (selectedInstrumentName === '宠物尿分析仪'){
    videoSource.value = "https://pethospital-1310941840.cos.ap-nanjing.myqcloud.com/video/a71dda4d-77f8-41bf-a726-8a785c51457e_%E4%BC%98%E5%88%A9%E7%89%B9%E5%AE%A0%E7%89%A9%E5%B0%BF%E5%88%86%E6%9E%90%E4%BB%AAURIT-31%E6%93%8D%E4%BD%9C%E8%A7%86%E9%A2%91.mp4";
    videoDialogVisible.value = true;
  }
  else if (selectedInstrumentName === '宠物留置针'){
    videoSource.value = "https://pethospital-1310941840.cos.ap-nanjing.myqcloud.com/video/f6045451-8a4a-411f-a38f-9f59a0260aee_%E8%B4%9D%E6%81%A9Y%E5%9E%8B%E7%95%99%E7%BD%AE%E9%92%88%E4%BD%BF%E7%94%A8%E6%95%99%E7%A8%8B.mp4";
    videoDialogVisible.value = true;
  }
};


const formData = ref({
  assistantIdentity: '医助',
  doctorIdentity: '医师'
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
  petName:'',
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
  current.value=0;
  console.log('提交的档案信息：', recordManagementForm);
  alert('前台角色扮演完成');
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
  current.value=0;
  console.log('提交的采集信息：', sampleCollectionForm);
  alert('医助角色扮演完成');

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
  current.value=0;
  console.log('提交的手术信息：', sampleCollectionForm);
  alert('医师角色扮演完成');

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
button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
}

.small-input {
  width: 200px;
}

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
  white-space: nowrap; /* 文字不换行 */
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
  margin-right: 100px;
  background-color: #f0f0f0; /* 轻灰色背景 */
  padding: 10px;
  border-top-left-radius: 10px; /* 左上角圆角 */
  border-top-right-radius: 10px; /* 右上角圆角 */
}

.corner-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(24, 143, 254, 0.84);
  padding: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 添加阴影 */
  border-radius: 15px; /* 四个角都是圆角 */
  border: 1px solid #ccc; /* 添加边框 */
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
