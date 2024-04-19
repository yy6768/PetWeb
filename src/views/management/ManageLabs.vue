<template>
  <el-card class="lab-management">
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
    <el-container>
    <el-table :data="labs" style="width: 100%">
      <el-table-column prop="labId" label="化验ID"></el-table-column>
      <el-table-column prop="labName" label="化验名"></el-table-column>
      <el-table-column prop="labCost" label="价格(rmb)"></el-table-column>
      <el-table-column prop="description" label="化验描述"></el-table-column>

      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="editLab(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="deleteLab(row)">删除</el-button>

        </template>

      </el-table-column>
    </el-table>
    </el-container>
    <el-dialog v-model="changeVisible" title="修改化验信息" width="500">
      <el-form :model="form">
<!--        <el-form-item label="labId" >-->
<!--          <el-input v-model="form.labId" autocomplete="off" />-->
<!--        </el-form-item>-->
        <el-form-item label="价格" >
          <el-input v-model="form.labCost" autocomplete="off" />
        </el-form-item>
        <el-form-item label="描述" >
          <el-input v-model="form.description" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="changeVisible = false">Cancel</el-button>
          <el-button type="primary" @click="labChangeSubmit">
            Confirm
          </el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="addVisible" title="新建化验信息" width="500">
      <el-form :model="newLab">
        <el-form-item label="化验名称" >
          <el-input v-model="newLab.lab_name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="化验价格" >
          <el-input v-model="newLab.lab_cost" autocomplete="off" />
        </el-form-item>
        <el-form-item label="化验描述" >
          <el-input v-model="newLab.description" autocomplete="off" />
        </el-form-item>
        <el-form-item label="存入Pinecone">
          <!-- 切换开关 -->
          <el-switch
              v-model="newLab.saveToPinecone"
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
          <el-button type="primary" @click="addLab">
            Confirm
          </el-button>
        </div>
      </template>
    </el-dialog>

    <el-pagination
        :current-page="page.value"
        :page-size="pageSize.value"
        :total="totalLabs"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
        style="margin-top: 20px;"
        layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </el-card>
</template>
<script setup lang="ts">
import axios from 'axios';
import { ElMessage } from 'element-plus'
import { ref, onMounted } from 'vue';
import { ElTable, ElTableColumn, ElButton, ElPagination } from 'element-plus';
import { useRouter } from 'vue-router';
import { embedText, pineconeAdd, pineconeDelete } from '@/components/usePinecone';

const router = useRouter();

onMounted(() => {
  fetchLabs();
});
// 定义变量和方法
const labs = ref([]); // 化验列表数据
// {
//   "labId": 2,
//     "labName": "name",
//     "labCost": 10.0
// },
const totalLabs = ref<number>(0); // 总化验数量
const page = ref<number>(1); // 当前页码
const pageSize = ref<number>(10); // 每页显示数量
const changeVisible = ref(false);
const addVisible = ref(false)

const form = ref({
  labId: 0,
  labCost: 0,
  description: ''
})
const newLab = ref({
  saveToPinecone: false,
  lab_name: '',
  lab_cost: '',
  description: ''
})

const newFunc = () => {
  addVisible.value = true;
}

const labChangeSubmit = async () => {
  // 提交化验修改的逻辑
  console.log('提交化验修改', form.value);
  try {
    // 创建 URLSearchParams 对象，先不包括 password
    const params = new URLSearchParams({
      lab_id: form.value.labId.toString(),
      lab_cost: form.value.labCost.toString(),
      description: form.value.description.toString()
    });

    const paramString = params.toString();

    const token = sessionStorage.getItem('token');
    const response = await axios.post(`/api/lab/update?${paramString}`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('修改res:', response.data);
    if (response.data && response.data.error_message === 'success') {
      labs.value = response.data.lab_list;  // Assuming that lab list is returned under the 'lab_list' key
      console.log('化验组:', labs.value);
      ElMessage({
        message: '修改成功',
        type: 'success',
      });
      fetchLabs();

    } else {
      ElMessage.error(`修改失败: ${response.data.error_message}`);
    }

  } catch (error) {
    console.error('修改错误:', error);
    ElMessage.error('修改错误');
  }
  changeVisible.value = false;
};
const editLab = (lab) => {
  // 编辑化验的逻辑
  changeVisible.value = true;
  form.value = { ...lab }; // Use spread operator to copy lab properties

  console.log('编辑化验', lab);
};

const deleteLab = async (lab) => {
  // 禁用化验的逻辑
  console.log('删除化验', labs);
  try {
    const params = new URLSearchParams({
      lab_id: lab.labId.toString(),
    }).toString();
    const token = sessionStorage.getItem('token');
    const response = await axios.delete(`/api/lab/delete?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('禁用res:', response.data);
    if (response.data && response.data.error_message === 'success') {
      pineconeDelete(lab.labId, 'lab')
      labs.value = response.data.lab_list;  // Assuming that lab list is returned under the 'lab_list' key
      console.log('化验组:', labs.value);
      ElMessage({
        message: '删除成功',
        type: 'success',
      });
      fetchLabs();

    } else {
      ElMessage.error(`删除失败: ${response.data.error_message}`);
    }
  } catch (error) {
    console.error('禁用错误:', error);
    ElMessage.error('禁用错误');
  }
};
const addLab = async () => {
  // 添加化验的逻辑
  console.log('添加化验', labs);
  try {
    const params = new URLSearchParams({
      lab_name: newLab.value.lab_name.toString(),
      lab_cost: newLab.value.lab_cost.toString(),
      description: newLab.value.description.toString()
    }).toString();
    const token = sessionStorage.getItem('token');
    const response = await axios.post(`/api/lab/add?${params}`,{}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('获取化验组:', response.data);
    if (response.data && response.data.error_message === 'success') {
      console.log('化验组:', labs.value);
      const lab_id = response.data.lab_id
      if (newLab.value.saveToPinecone) {
        const input_text = "化验名称：" + newLab.value.lab_name + "，化验价格："+ newLab.value.lab_cost.toString() + "，疗效和用途：" + newLab.value.description

        const insert_pinecone = await pineconeAdd(
            lab_id,
            `lab`, input_text,
            {lab_name: newLab.value.lab_name, lab_cost: newLab.value.lab_cost, description: newLab.value.description}
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
      ElMessage({
        message: '添加成功',
        type: 'success',
      });
      addVisible.value = false;
    } else {
      ElMessage.error(`添加失败: ${response.data.error_message}`);
    }
  } catch (error) {
    console.error('添加错误:', error);
    ElMessage.error('添加错误');
  }
  fetchLabs();
};
const handlePageChange = (newPage) => {
  // 处理页码变化的逻辑
  page.value = newPage;
  fetchLabs();
};

const handleSizeChange = (newSize) => {
  // 处理每页显示数量变化的逻辑
  pageSize.value = newSize;
  fetchLabs();
};
const fetchLabs = async () => {
  console.log('化验管理页面加载');
  try {
    const params = new URLSearchParams({
      search: '',
      page: page.value.toString(),
      pageSize: pageSize.value.toString()
    }).toString();
    console.log('params:', params)
    const token = sessionStorage.getItem('token');
    const response = await axios.get(`/api/lab/getall?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('获取化验组:', response.data);
    totalLabs.value = response.data.lab_list.length;
    if (response.data && response.data.error_message === 'success') {
      labs.value = response.data.lab_list;  // Assuming that lab list is returned under the 'lab_list' key
      console.log('化验组:', labs.value);
      // ElMessage({
      //   message: '获取化验组成功',
      //   type: 'success',
      // });
    } else {
      ElMessage.error(`获取化验组失败: ${response.data.error_message}`);
    }
  } catch (error) {
    console.error('获取化验组错误:', error);
    ElMessage.error('获取化验组错误');
  }
};

</script>
<style>

</style>
