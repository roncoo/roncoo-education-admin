<template>
  <div class="app-container">
    <el-table
      :data="list"
      element-loading-text="Loading"
      fit
      highlight-current-row
      size="medium"
    >
      <el-table-column label="配置名称" prop="configName" width="250">
        <template v-slot="scope">
          <span>{{ scope.row.configName }}</span>
          <el-tooltip :content="scope.row.configKey" class="item" effect="light" placement="top-start"><span class="tips"><svg-icon class="svg-icon" icon-class="svg-icon-info" /></span></el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="参数/描述" prop="configValue">
        <template v-slot="scope">
          <span v-if="scope.row.contentType == 1">{{ scope.row.configValue }}</span>
          <span v-if="scope.row.contentType == 5">{{ publicEnums[scope.row.configValue] }}</span>
          <br> <span style="color:#999">{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220">
        <template v-slot="scope">
          <el-button v-if="scope.row.contentType == 1" plain size="mini" type="primary" @click="handleUpdateRow(scope.row)">编辑</el-button>
          <el-switch v-if="scope.row.contentType == 5" v-model="scope.row.configValue" active-color="#13ce66" active-text="开启" active-value="on" inactive-color="#ff4949" inactive-text="关闭" inactive-value="off" @change="changBooleanValue(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <config-edit
      v-if="configEditCtr.visible"
      :form-data="configEditCtr.info"
      :title="configEditCtr.title"
      :visible="configEditCtr.visible"
      @close-callback="closeCallback"
    />
  </div>
</template>

<script>
import {configEdit, configList} from '@/api/system'
import ConfigEdit from '../edit';

export default {
  components: {ConfigEdit},
  data() {
    return {
      list: [],
      configEditCtr: {
        title: undefined,
        visible: false,
        info: {}
      },
      listLoading: true
    }
  },
  mounted() {
    this.$store.dispatch('GetOpts', {enumName: 'PublicEnum', type: 'obj'}).then((res) => {
      this.publicEnums = res;
    });
    this.listForAll()
  },
  created() {

  },
  methods: {
    changBooleanValue(row) {
      this.loading.show();
      configEdit({configKey: row.configKey, configValue: row.configValue}).then(res => {
        this.loading.hide();
        this.tips(res.data, 'success');
        this.handleClose('close-callback')
      }).catch(() => {
        this.loading.hide()
      })
    },
    closeCallback(val) {
      this.configEditCtr.visible = false;
      this.listForAll()
    },
    handleUpdateRow(row) {
      this.configEditCtr.info = row;
      this.configEditCtr.title = row.configName;
      this.configEditCtr.visible = true;
    },
    listForAll() {
      // this.listLoading = true
      this.loading.start()
      configList(this.map).then(res => {
        this.list = res.data
      })
    }
  }
}
</script>
<style scoped>
.tips {
  padding: 5px;
}
</style>
