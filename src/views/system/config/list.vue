<template>
  <div>
    <el-table :data="list" element-loading-text="Loading" fit highlight-current-row size="medium">
      <el-table-column label="配置名称" prop="configName" width="300">
        <template #default="scope">
          <span>{{ scope.row.configName }}</span>
          <el-tooltip :content="scope.row.configKey" class="item" effect="light" placement="top-start"><span class="tips"><svg-icon class="svg-icon" icon-class="svg-icon-info"/></span></el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="参数">
        <template #default="scope">
          <span v-if="(scope.row.contentType === 1 || scope.row.contentType === 2) && scope.row.configShow">{{ scope.row.configValue }}</span>
          <el-button v-if="(scope.row.contentType === 1 || scope.row.contentType === 2) && !scope.row.configShow" type="text" @click="openRow(scope.row)">【点击查看详情】</el-button>
          <img v-if="scope.row.contentType === 3" :alt="scope.row.configName" :src="scope.row.configValue" class="list_avatar"/>
          <span v-if="scope.row.contentType === 4">{{ scope.row.configValue == 1 ? '开启' : '关闭' }}</span>
          <span v-if="scope.row.contentType === 5 && scope.row.configKey === 'storagePlatform'">{{ storagePlatformEnum ? storagePlatformEnum[scope.row.configValue] : '' }}</span>
          <span v-if="scope.row.contentType === 5 && scope.row.configKey === 'vodPlatform'">{{ vodPlatformEnum ? vodPlatformEnum[scope.row.configValue] : '' }}</span>
          <span v-if="scope.row.contentType === 5 && scope.row.configKey === 'smsPlatform'">{{ smsPlatformEnum ? smsPlatformEnum[scope.row.configValue] : '' }}</span>
          <br>
          <span style="color: #999;font-size: 13px">{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220">
        <template v-if="checkPermission('system:admin:sys:config:edit')" #default="scope">
          <!-- 布尔类型 -->
          <el-switch v-if="scope.row.contentType === 4" v-model="scope.row.configValue" active-color="#13ce66" active-text="开启" active-value="1" inactive-color="#ff4949" inactive-text="关闭" inactive-value="0" @change="changBooleanValue(scope.row)"/>
          <!--  不为布尔类型 -->
          <el-button v-if="scope.row.contentType != 4" type="primary" @click="handleUpdateRow(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <sys-config-edit v-if="sysConfigEditCtr.visible" :form-data="sysConfigEditCtr.info" :title="sysConfigEditCtr.title" :visible="sysConfigEditCtr.visible" :width="sysConfigEditCtr.width" @close-callback="closeCallback"/>
    <sys-config-value v-if="sysConfigValueCtr.visible" :title="sysConfigValueCtr.title" :value="sysConfigValueCtr.value" :visible="sysConfigValueCtr.visible" @close-callback="closeCallback"/>
  </div>
</template>

<script>
import {sysConfigEdit} from '@/api/system';
import SysConfigEdit from './edit.vue';
import SysConfigValue from './value.vue';

export default {
  components: {SysConfigEdit, SysConfigValue},

  props: {
    list: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  watch: {
    list(val) {
      this.trigger = false;
      if (val) {
        setTimeout(() => {
          this.trigger = true;
        }, 500);
      }
    }
  },
  data() {
    return {
      sysConfigEditCtr: {
        width: '65%',
        trigger: false,
        title: undefined,
        visible: false,
        info: {}
      },
      sysConfigValueCtr: {
        title: '查看配置',
        value: undefined,
        visible: false
      }
    };
  },
  mounted() {
    this.$store.dispatch('GetOpts', {enumName: 'StoragePlatformEnum', type: 'obj'}).then((res) => {
      this.storagePlatformEnum = res;
    });
    this.$store.dispatch('GetOpts', {enumName: 'VodPlatformEnum', type: 'obj'}).then((res) => {
      this.vodPlatformEnum = res;
    });
    this.$store.dispatch('GetOpts', {enumName: 'SmsPlatformEnum', type: 'obj'}).then((res) => {
      this.smsPlatformEnum = res;
    });
  },
  methods: {
    changBooleanValue(row) {
      if (!this.trigger) {
        return;
      }
      this.loading = true;
      sysConfigEdit({
        ...row,
        id: row.id,
        configKey: row.configKey,
        configValue: row.configValue
      })
        .then((res) => {
          if (res) {
            this.$message.success(res);
            this.$emit('reset', 'success');
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    openRow(row) {
      this.sysConfigValueCtr.title = row.configName;
      this.sysConfigValueCtr.value = row.configValue;
      this.sysConfigValueCtr.visible = true;
    },
    handleUpdateRow(row) {
      // 配置类型(1:文本;2:富文本,3图片,4布尔,5枚举)
      this.sysConfigEditCtr.title = row.configName;
      this.sysConfigEditCtr.info = row;
      this.sysConfigEditCtr.visible = true;
      if (row.contentType === 1) {
        this.sysConfigEditCtr.width = '40%';
      } else if (row.contentType === 2) {
        this.sysConfigEditCtr.width = '80%';
      } else if (row.contentType === 3) {
        this.sysConfigEditCtr.width = '400px';
      } else {
        this.sysConfigEditCtr.width = '40%';
      }
    },
    closeCallback(val) {
      this.sysConfigEditCtr.visible = false;
      this.sysConfigValueCtr.visible = false;
      if (val) {
        this.$emit('reset');
      }
    }
  }
};
</script>

<style lang="scss" type="text/css">
.tips {
  padding: 5px;
}

.list_avatar {
  height: 50px;
}
</style>
