<template>
  <div class="app-container">
    <div class="page_head">
      <div class="search_bar clearfix">
        <el-form :model="seekForm" inline label-width="80px">
          <el-form-item>
            <el-button @click="seek()" type="primary"> 查询</el-button>
            <el-button @click="resetSeek()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-table v-loading="tableData.loading" :data="tableData.list" border>
      <el-table-column align="center" label="序号" type="index" width="60"/>
      <el-table-column label="手机号码" prop="moblie"/>
      <el-table-column label="登录IP" prop="loginIp"/>
      <el-table-column label="登录地址" prop="province">
        <template #default="scope">
          {{ scope.row.province }} {{ scope.row.city }}
        </template>
      </el-table-column>
      <el-table-column label="操作系统" prop="os"/>
      <el-table-column label="浏览器" prop="browser"/>
      <el-table-column label="登录时间" prop="gmtCreate"/>
      <el-table-column label="登录状态">
        <template #default="scope">
          <span :class="{ 'c-danger': scope.row.loginStatus === 0 }">{{ loginStatusEnums[scope.row.loginStatus] }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="page.pageCurrent" :layout="page.layout" :page-size="page.pageSize" :page-sizes="[20, 50, 100, 200]" :total="page.totalCount" background @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
  </div>
</template>
<script>
import UseTable from '@/composables/UseTable.js';
import {ElMessage} from 'element-plus';
import {defineComponent, onMounted, reactive, toRefs} from 'vue';
import {useStore} from 'vuex';
import {logLoginPage} from '@/api/user.js'

export default defineComponent({
  components: {},
  setup() {
    const apis = reactive({
      getList: logLoginPage
    })
    const state = reactive({
      ...UseTable(apis, {}),
      loginStatusEnums: {}
    });
    const store = useStore();
    onMounted(() => {
      store.dispatch('GetOpts', {enumName: 'LoginStatusEnum', type: 'obj'}).then((res) => {
        state.loginStatusEnums = res;
      });
    });

    return {
      ...toRefs(state)
    };
  }
});
</script>
