<template>
  <el-card >
  <div class="search-head">
    <el-input
        type="text"
        prefix-icon="search"
        v-model="searchKey"
        placeholder="请输入关键字"
        class="search-box"
    >
    </el-input>

    <el-button class="search-btn" @click="search">搜索</el-button>
    <el-button type="primary" size="small" class="newBtn" @click="newFunc">新建+</el-button>

  </div>
  <div class="medication-management">
    <el-table :data="medications" style="width: 100%">
      <el-table-column prop="medicineId" label="药品ID"></el-table-column>
      <el-table-column prop="medicineName" label="药品名"></el-table-column>
      <el-table-column prop="medicineCost" label="价格(rmb)"></el-table-column>
      <el-table-column prop="description" label="药品描述"></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="editMedicine(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="deleteMedicine(row)">删除</el-button>

        </template>

      </el-table-column>
    </el-table>
    <el-dialog v-model="changeVisible" title="修改药品信息" width="500">
      <el-form :model="form">
        <el-form-item label="药品名称" >
          <el-input v-model="form.medicine_name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="价格" >
          <el-input v-model="form.medicine_cost" autocomplete="off" />
        </el-form-item>
        <el-form-item label="描述" >
          <el-input v-model="form.description" autocomplete="off" />
        </el-form-item>

      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="changeVisible = false">Cancel</el-button>
          <el-button type="primary" @click="medicationChangeSubmit">
            Confirm
          </el-button>
        </div>
      </template>
    </el-dialog>


    <el-dialog v-model="addVisible" title="新建药品信息" width="500">
      <el-form :model="newMedicine">
        <el-form-item label="药品名称" >
          <el-input v-model="newMedicine.medicine_name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="药品价格" >
          <el-input v-model="newMedicine.medicine_cost" autocomplete="off" />
        </el-form-item>
        <el-form-item label="药品描述" >
          <el-input v-model="newMedicine.description" autocomplete="off" />
        </el-form-item>
        <el-form-item label="存入Pinecone">
          <!-- 切换开关 -->
          <el-switch
              v-model="newMedicine.saveToPinecone"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="是"
              inactive-text="否">
          </el-switch>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addVisible = false">Cancel</el-button>
          <el-button type="primary" @click="addMedicine">
            Confirm
          </el-button>
        </div>
      </template>
    </el-dialog>

    <el-pagination
        :current-page="page.value"
        :page-size="pageSize.value"
        :total="totalMedications"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
        style="margin-top: 20px;"
        layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
    </el-card >

</template>
<script setup lang="ts">
import axios from 'axios';
import { ElMessage, ElLoading } from 'element-plus'
import { ref, onMounted } from 'vue';
import { ElTable, ElTableColumn, ElButton, ElPagination } from 'element-plus';
import { useRouter } from 'vue-router';
import OpenAI from "openai";
import { embedText, pineconeAdd,pineconeDelete, pineconeUpdate } from '@/components/usePinecone';


const router = useRouter();
onMounted( () => {
  fetchMedications();
});
// 定义变量和方法
const medications = ref([]); // 药品列表数据
const totalMedications = ref<number>(0); // 总药品数量
const page = ref<number>(1); // 当前页码
const pageSize = ref<number>(10); // 每页显示数量
const changeVisible = ref(false)
const addVisible = ref(false)
const form = ref({
})
const loading = ref(null)
const newMedicine = ref({
  medicine_name: '',
  medicine_cost: '',
  description:'',
  saveToPinecone: true
})
const newFunc = () => {
  addVisible.value = true;
}
const medicationChangeSubmit = async () => {
  // 提交药品修改的逻辑
  console.log('提交药品修改', form.value);
  try {
    const params = new URLSearchParams({
      medicine_id: form.value.medicine_id.toString(),
      medicine_cost: form.value.medicine_cost,
      description: form.value.description
    });
    console.log("params: ", params)
    const paramString = params.toString();

    const token = sessionStorage.getItem('token');
    const response = await axios.post(`/api/medications/update?${paramString}`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('修改res:', response.data);
    if (response.data && response.data.error_message === 'success') {
      loading.value = ElLoading.service({
            lock: true,
            text: 'Adding...',
            background: 'rgba(0, 0, 0, 0.7)',
          });  
        const input_text = "药品名称：" + form.value.medicine_name + "，药品价格："+ form.value.medicine_cost.toString() + ",疗效与用途：" + form.value.description
        console.log('Vue input_text:', input_text); 
        const medicine_id = response.data.medicine_id
        const insert_pinecone = await pineconeUpdate(
            medicine_id,
            "medicine", input_text,
            {
              medicine_name: form.value.medicine_name,
              medicine_cost: form.value.medicine_cost,
              description: form.value.description
            }
        )
        loading.value.close();
        if (insert_pinecone?.success){
                  
          console.log('Pinecone 插入成功:', insert_pinecone);
          ElMessage({
            message: 'Pinecone 修改成功',
            type: 'success',
          });
        }else{
          ElMessage.error(`Pinecone 插入失败: ${insert_pinecone}`);

        }
      
      console.log('药品组:', medications.value);
      ElMessage({
        message: '修改成功',
        type: 'success',
      });

      fetchMedications();

    } else {
      ElMessage.error(`修改失败: ${response.data.error_message}`);
    }

  } catch (error) {
    console.error('修改错误:', error);
    ElMessage.error('修改错误');
  }
  changeVisible.value = false;
};
const editMedicine = (medication) => {
  // 编辑药品的逻辑
  form.value = {   
    medicine_id: medication.medicineId,
    medicine_name: medication.medicineName,
    medicine_cost: medication.medicineCost,
    description: medication.description
  }; // Use spread operator to copy medication properties

  console.log('编辑药品', medication);
  changeVisible.value = true;

};

const deleteMedicine = async (medication) => {
  // 禁用药品的逻辑
  console.log('删除药品', medications);
  try {
    const params = new URLSearchParams({
      medicine_id: medication.medicineId.toString(),
    }).toString();
    const token = sessionStorage.getItem('token');
    const response = await axios.delete(`/api/medications/delete?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('删除res:', response.data);
    if (response.data && response.data.error_message === 'success') {
      pineconeDelete(medication.medicineId, 'medicine')
      medications.value = response.data.medicine_list;  // Assuming that medication list is returned under the 'medicine_list' key
      console.log('药品组:', medications.value);
      ElMessage({
        message: '删除成功',
        type: 'success',
      });
      fetchMedications();

    } else {
      ElMessage.error(`删除失败: ${response.data.error_message}`);
    }
  } catch (error) {
    console.error('删除错误:', error);
    ElMessage.error('删除错误');
  }
};
const addMedicine = async () => {
  console.log('添加药品', medications);
  loading.value = ElLoading.service({
            lock: true,
            text: 'Adding...',
            background: 'rgba(0, 0, 0, 0.7)',
          }); 
  try {
    const params = new URLSearchParams({
      medicine_name: newMedicine.value.medicine_name,
      medicine_cost: newMedicine.value.medicine_cost.toString(),
      description: newMedicine.value.description.toString(),

    }).toString();
    const token = sessionStorage.getItem('token');
    const response = await axios.post(`/api/medications/add?${params}`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('添加药品组:', response.data);

    if (response.data && response.data.error_message === 'success') {
      const medicine_id = response.data.medicine_id;
       
      // 插入数据到 Pinecone
      if (newMedicine.value.saveToPinecone) {
        
        const input_text = "药品名称：" + newMedicine.value.medicine_name + "，药品价格："+ newMedicine.value.medicine_cost.toString() + ",疗效与用途：" + newMedicine.value.description

        const insert_pinecone = await pineconeAdd(
            medicine_id,
            `medicine`, input_text,
            {
              medicine_name: newMedicine.value.medicine_name,
              medicine_cost: newMedicine.value.medicine_cost,
              description: newMedicine.value.description
            }
        )
        if (insert_pinecone?.success){
          console.log('Pinecone 插入成功:', insert_pinecone);
          ElMessage({
            message: 'Pinecone 添加成功',
            type: 'success',
          });
        }else{
          ElMessage.error(`Pinecone 插入失败: ${insert_pinecone}`);

        }
      }
      addVisible.value = false;
    } else {
      ElMessage.error(`添加失败: ${response.data.error_message}`);
    }
  } catch (error) {
    console.error('添加错误:', error);
    ElMessage.error('添加错误');
  }
  loading.value.close();

  fetchMedications();
};
const handlePageChange = (newPage) => {
  // 处理页码变化的逻辑
  page.value = newPage;
  fetchMedications();
};

const handleSizeChange = (newSize) => {
  // 处理每页显示数量变化的逻辑
  pageSize.value = newSize;
  fetchMedications();
};
const fetchMedications = async () => {
  console.log('药品管理页面加载');
  try {
    const params = new URLSearchParams({
      search: '',
      page: page.value.toString(),
      pageSize: pageSize.value.toString()
    }).toString();
    console.log('params:', params)
    const token = sessionStorage.getItem('token');
    const response = await axios.get(`/api/medications/getall?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('获取药品组:', response.data);
    totalMedications.value = response.data.total;
    if (response.data && response.data.error_message === 'success') {
      medications.value = response.data.medicine_list;  // Assuming that medication list is returned under the 'medicine_list' key
      console.log('药品组:', medications.value);
      // ElMessage({
      //   message: '获取药品组成功',
      //   type: 'success',
      // });
    } else {
      ElMessage.error(`获取药品组失败: ${response.data.error_message}`);
    }
  } catch (error) {
    console.error('获取药品组错误:', error);
    ElMessage.error('获取药品组错误');
  }
};

</script>
<style>

</style>
