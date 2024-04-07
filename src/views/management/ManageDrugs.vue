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

      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="editMedication(row)">编辑</el-button>
        </template>

      </el-table-column>
    </el-table>
    <el-dialog v-model="dialogFormVisible" title="修改药品信息" width="500">
      <el-form :model="form">
        <el-form-item label="medicineId" >
          <el-input v-model="form.medication_id" autocomplete="off" />
        </el-form-item>
        <el-form-item label="价格" >
          <el-input v-model="form.medication_cost" autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码" >
          <el-input v-model="form.password" autocomplete="off" placeholder="(可选)" />
        </el-form-item>


      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">Cancel</el-button>
          <el-button type="primary" @click="medicationChangeSubmit">
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
import { ElMessage } from 'element-plus'
import { ref, onMounted } from 'vue';
import { ElTable, ElTableColumn, ElButton, ElPagination } from 'element-plus';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
  fetchMedications();
});
// 定义变量和方法
const medications = ref([]); // 药品列表数据
const totalMedications = ref<number>(0); // 总药品数量
const page = ref<number>(1); // 当前页码
const pageSize = ref<number>(10); // 每页显示数量
const dialogFormVisible = ref(false)
const form = ref({
})

const medicationChangeSubmit = async () => {
  // 提交药品修改的逻辑
  console.log('提交药品修改', form.value);
  try {
    // 创建 URLSearchParams 对象，先不包括 password
    const params = new URLSearchParams({
      medicineId: form.value.medicineId.toString(),
      medicineName: form.value.medicineName.toString(),
      authority: form.value.authority.toString(),
    });

    if (form.value.password.toString() !== '') {
      params.append('password', form.value.password.toString());
    }

    const paramString = params.toString();

    const token = sessionStorage.getItem('token');
    const response = await axios.post(`/api/medication/edit?${paramString}`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('修改res:', response.data);
    if (response.data && response.data.error_message === 'success') {
      medications.value = response.data.medicine_list;  // Assuming that medication list is returned under the 'medicine_list' key
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
  dialogFormVisible.value = false;
};
const editMedication = (medication) => {
  // 编辑药品的逻辑
  dialogFormVisible.value = true;
  form.value = { ...medication, password: '' }; // Use spread operator to copy medication properties

  console.log('编辑药品', medication);
};

const deletemedication = async (medication) => {
  // 禁用药品的逻辑
  console.log('禁用药品', medications);
  try {
    const params = new URLSearchParams({
      medication_Id: medication.medicineId.toString(),
      authority: '1',
    }).toString();
    const token = sessionStorage.getItem('token');
    const response = await axios.post(`/api/medication/ban?${params}`,{}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('禁用res:', response.data);
    if (response.data && response.data.error_message === 'success') {
      medications.value = response.data.medicine_list;  // Assuming that medication list is returned under the 'medicine_list' key
      console.log('药品组:', medications.value);
      ElMessage({
        message: '禁用成功',
        type: 'success',
      });
      fetchMedications();

    } else {
      ElMessage.error(`禁用失败: ${response.data.error_message}`);
    }
  } catch (error) {
    console.error('禁用错误:', error);
    ElMessage.error('禁用错误');
  }
};
const addMedication = async (medication) => {
  // 启用药品的逻辑
  console.log('启用药品', medications);
  try {
    const params = new URLSearchParams({
      medicineId: medication.medicineId.toString(),
      authority: '1',
    }).toString();
    const token = sessionStorage.getItem('token');
    const response = await axios.post(`/api/medication/unban?${params}`,{}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('获取药品组:', response.data);
    if (response.data && response.data.error_message === 'success') {
      medications.value = response.data.medicine_list;  // Assuming that medication list is returned under the 'medicine_list' key
      console.log('药品组:', medications.value);
      ElMessage({
        message: '启用成功',
        type: 'success',
      });
    } else {
      ElMessage.error(`启用失败: ${response.data.error_message}`);
    }
  } catch (error) {
    console.error('启用错误:', error);
    ElMessage.error('启用错误');
  }
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
    totalMedications.value = response.data.medicine_list.length;
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
