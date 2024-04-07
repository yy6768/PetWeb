<template>
  <div class="user-management">
    <el-table :data="users" style="width: 100%">
      <el-table-column prop="uid" label="用户ID"></el-table-column>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="authority" label="身份" :formatter="formatAuthority"></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="editUser(row)">编辑</el-button>
          <el-button type="danger" size="small" v-if="row.access === 1" @click="disableUser(row)">禁用</el-button>
          <el-button type="success" size="small" v-else @click="enableUser(row)">启用</el-button>
        </template>

      </el-table-column>
    </el-table>
    <el-dialog v-model="dialogFormVisible" title="修改用户信息" width="500">
      <el-form :model="form">
        <el-form-item label="uid" >
          <el-input v-model="form.uid" autocomplete="off" />
        </el-form-item>
        <el-form-item label="用户名" >
          <el-input v-model="form.username" autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码" >
          <el-input v-model="form.password" autocomplete="off" placeholder="(可选)" />
        </el-form-item>
        <el-form-item label="权限(0：普通用户, 1：管理员)" >
          <el-select v-model="form.authority" placeholder="调整权限（">
            <el-option label="0" value="0" />
            <el-option label="1" value="1" />
          </el-select>
        </el-form-item>

      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">Cancel</el-button>
          <el-button type="primary" @click="userChangeSubmit">
            Confirm
          </el-button>
        </div>
      </template>
    </el-dialog>

    <el-pagination
        :current-page="page.value"
        :page-size="pageSize.value"
        :total="totalUsers"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
        layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>
  <script setup lang="ts">
  import axios from 'axios';
  import { ElMessage } from 'element-plus'
  import { ref, onMounted } from 'vue';
  import { ElTable, ElTableColumn, ElButton, ElPagination } from 'element-plus';
  import { useRouter } from 'vue-router';

  const router = useRouter();

  onMounted(() => {
    fetchUsers();
  });
  // 定义变量和方法
  const users = ref([]); // 用户列表数据
  const totalUsers = ref<number>(0); // 总用户数量
  const page = ref<number>(1); // 当前页码
  const pageSize = ref<number>(10); // 每页显示数量
  const dialogFormVisible = ref(false)
  const form = ref({
  })
  const formatAuthority = (row, column, value) => {
    // 根据authority值返回对应的中文描述
    return value === 1 ? '管理员' : '普通用户';
  };
  const userChangeSubmit = async () => {
    // 提交用户修改的逻辑
    console.log('提交用户修改', form.value);
    try {
      // 创建 URLSearchParams 对象，先不包括 password
      const params = new URLSearchParams({
        uid: form.value.uid.toString(),
        username: form.value.username.toString(),
        authority: form.value.authority.toString(),
      });

      if (form.value.password.toString() !== '') {
        params.append('password', form.value.password.toString());
      }

      const paramString = params.toString();

      const token = sessionStorage.getItem('token');
      const response = await axios.post(`/api/user/edit?${paramString}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('修改res:', response.data);
      if (response.data && response.data.error_message === 'success') {
        users.value = response.data.user_list;  // Assuming that user list is returned under the 'user_list' key
        console.log('用户组:', users.value);
        ElMessage({
          message: '修改成功',
          type: 'success',
        });
        fetchUsers();

      } else {
        ElMessage.error(`修改失败: ${response.data.error_message}`);
      }

    } catch (error) {
      console.error('修改错误:', error);
      ElMessage.error('修改错误');
    }
    dialogFormVisible.value = false;
  };
  const editUser = (user) => {
    // 编辑用户的逻辑
    dialogFormVisible.value = true;
    form.value = { ...user, password: '' }; // Use spread operator to copy user properties

    console.log('编辑用户', user);
  };

  const disableUser = async (user) => {
    // 禁用用户的逻辑
    console.log('禁用用户', user);
    try {
      const params = new URLSearchParams({
        uid: user.uid.toString(),
        authority: '1',
      }).toString();
      const token = sessionStorage.getItem('token');
      const response = await axios.post(`/api/user/ban?${params}`,{}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('禁用res:', response.data);
      if (response.data && response.data.error_message === 'success') {
        users.value = response.data.user_list;  // Assuming that user list is returned under the 'user_list' key
        console.log('用户组:', users.value);
        ElMessage({
          message: '禁用成功',
          type: 'success',
        });
        fetchUsers();

      } else {
        ElMessage.error(`禁用失败: ${response.data.error_message}`);
      }
    } catch (error) {
      console.error('禁用错误:', error);
      ElMessage.error('禁用错误');
    }
  };
  const enableUser = async (user) => {
    // 启用用户的逻辑
    console.log('启用用户', user);
    try {
      const params = new URLSearchParams({
        uid: user.uid.toString(),
        authority: '1',
      }).toString();
      const token = sessionStorage.getItem('token');
      const response = await axios.post(`/api/user/unban?${params}`,{}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('获取用户组:', response.data);
      if (response.data && response.data.error_message === 'success') {
        users.value = response.data.user_list;  // Assuming that user list is returned under the 'user_list' key
        console.log('用户组:', users.value);
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
    fetchUsers();
  };
  const handlePageChange = (newPage) => {
    // 处理页码变化的逻辑
    page.value = newPage;
    fetchUsers();
  };

  const handleSizeChange = (newSize) => {
    // 处理每页显示数量变化的逻辑
    pageSize.value = newSize;
    fetchUsers();
  };
  const fetchUsers = async () => {
    console.log('用户管理页面加载');
    try {
      const params = new URLSearchParams({
        key: '',
        page: page.value.toString(),
        pageSize: pageSize.value.toString()
      }).toString();
      console.log('params:', params)
      const token = sessionStorage.getItem('token');
      const response = await axios.get(`/api/user/getall?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('获取用户组:', response.data);
      totalUsers.value = response.data.user_list.length;
      if (response.data && response.data.error_message === 'success') {
        users.value = response.data.user_list;  // Assuming that user list is returned under the 'user_list' key
        console.log('用户组:', users.value);
        // ElMessage({
        //   message: '获取用户组成功',
        //   type: 'success',
        // });
      } else {
        ElMessage.error(`获取用户组失败: ${response.data.error_message}`);
      }
    } catch (error) {
      console.error('获取用户组错误:', error);
      ElMessage.error('获取用户组错误');
    }
  };

  </script>
  <style>

  </style>
