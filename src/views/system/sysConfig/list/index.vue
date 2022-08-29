<template>
  <div class="app-container">
    <el-form class="filter-container" inline label-width="100px">
      <el-form-item>
        <el-button v-if="checkPermission('base:boss:sys:config:save')" plain type="success" @click="handleAddRow">新增</el-button>
        <el-button v-if="checkPermission('base:boss:sys:config:remove:cache')" plain type="danger" @click="handleDeleteRedisRow">清空缓存</el-button>
        <el-button v-if="checkPermission('base:boss:sys:config:sync:video:cloud')" plain type="warning" @click="handleSyncVideoCloudConfig">视频云设置</el-button>
        <el-button v-if="checkPermission('base:boss:sys:config:set:bucket:cors')" plain type="primary" @click="handleSyncStorageConfig">存储设置</el-button>
      </el-form-item>
    </el-form>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-if="checkPermission('base:boss:sys:config:list')" label="站点设置" name="1">
        <Config :list="list" @reset="handleReset"></Config>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission('base:boss:sys:config:list')" label="系统设置" name="2">
        <Config :list="list" :livePlatformEnum="livePlatformEnum" :smsPlatformEnum="smsPlatformEnum" :storagePlatformEnum="storagePlatformEnum" :vodPlatformEnum="vodPlatformEnum" @reset="handleReset"></Config>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission('base:boss:sys:config:list')" label="视频设置" name="3">
        <Config :list="list" @reset="handleReset"></Config>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission('base:boss:sys:config:list')" label="存储设置" name="4">
        <Config :list="list" @reset="handleReset"></Config>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission('base:boss:sys:config:list')" label="短信设置" name="5">
        <Config :list="list" @reset="handleReset"></Config>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission('base:boss:sys:config:list')" label="默认设置" name="6">
        <Config :list="list" @reset="handleReset"></Config>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission('base:boss:sys:config:list')" label="支付设置" name="7">
        <Config :aliPaySignTypeEnum="aliPaySignTypeEnum" :list="list" @reset="handleReset"></Config>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission('base:boss:sys:config:list')" label="支付服务商设置" name="8">
        <Config :aliPaySignTypeEnum="aliPaySignTypeEnum" :list="list" @reset="handleReset"></Config>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission('base:boss:sys:config:list')" label="微信开放平台设置" name="9">
        <Config :list="list" @reset="handleReset"></Config>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission('base:boss:sys:config:list')" label="人脸识别" name="10">
        <Config :list="list" @reset="handleReset"></Config>
      </el-tab-pane>
    </el-tabs>
    <sys-config-add v-if="sysConfigAddCtr.visible" :title="sysConfigAddCtr.title" :visible="sysConfigAddCtr.visible" @close-callback="closeCallback"/>
  </div>
</template>
<script>
import {sysConfigDelete, sysConfigDeleteRedis, sysConfigList, sysSyncStorageConfig, sysSyncVideoCloudConfig} from "@/api/system";
import SysConfigAdd from "@/views/system/sysConfig/add/index.vue";
import SysConfigValue from "@/views/system/sysConfig/value/index.vue";
import Config from "./config.vue";

export default {
  name: 'SysConfig',
  components: {SysConfigValue, SysConfigAdd, Config},
  data() {
    return {
      activeName: "1",
      list: [],
      sysConfigAddCtr: {
        title: "",
        visible: false,
      },
      storagePlatformEnum: [],
      vodPlatformEnum: [],
      livePlatformEnum: [],
      smsPlatformEnum: [],
      aliPaySignTypeEnum: [],
      map: {
        configType: 1,
      },
    };
  },
  mounted() {
    this.$store
      .dispatch("GetOpts", {enumName: "StoragePlatformEnum", type: "obj"})
      .then((res) => {
        this.storagePlatformEnum = res;
      });
    this.$store
      .dispatch("GetOpts", {enumName: "VodPlatformEnum", type: "obj"})
      .then((res) => {
        this.vodPlatformEnum = res;
      });
    this.$store
      .dispatch("GetOpts", {enumName: "LivePlatformEnum", type: "obj"})
      .then((res) => {
        this.livePlatformEnum = res;
      });
    this.$store
      .dispatch("GetOpts", {enumName: "SmsPlatformEnum", type: "obj"})
      .then((res) => {
        this.smsPlatformEnum = res;
      });
    this.$store
      .dispatch("GetOpts", {enumName: "AliPaySignTypeEnum", type: "obj"})
      .then((res) => {
        this.aliPaySignTypeEnum = res;
      });
    this.listForList();
  },
  methods: {
    handleClick(tab, event) {
      this.map.configType = this.activeName;
      this.listForList();
    },
    handleAddRow() {
      this.sysConfigAddCtr.title = "新增参数配置";
      this.sysConfigAddCtr.visible = true;
    },
    handleDeleteRedisRow() {
      {
        const body = "确定要清空缓存？";
        this.$confirm(body, "清空确认", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
        }).then(() => {
          this.loading.start();
          sysConfigDeleteRedis({}).then((res) => {
            this.$message.success(res);
            this.listForList();
          });
        });
      }
    },
    handleSyncVideoCloudConfig() {
      {
        const body = "根据选择的视频云，进行参数设置(比如回调地址等)";
        this.$confirm(body, "视频云设置", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
        }).then(() => {
          this.loading.start();
          sysSyncVideoCloudConfig().then((res) => {
            this.$message.success(res);
          });
        });
      }
    },
    handleSyncStorageConfig() {
      const body = "根据选择的存储平台，进行参数设置(比如跨域处理等)";
      this.$confirm(body, "存储设置", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
      }).then(() => {
        this.loading.start();
        sysSyncStorageConfig().then((res) => {
          this.$message.success(res);
        });
      });
    },
    handleDeleteRow(row) {
      {
        const body = "确定要删除【" + row.configName + "】？";
        this.$confirm(body, "删除确认", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
        }).then(() => {
          this.loading.start();
          sysConfigDelete(row.id).then((res) => {
            this.$message.success(res.data);
            this.listForList();
          });
        });
      }
    },
    listForList() {
      this.loading.start();
      sysConfigList(this.map).then((res) => {
        this.list = res;
      });
    },
    handleReset() {
      console.log(1);
      this.map.configType = this.activeName;
      this.listForList();
    },
    closeCallback(val) {
      this.sysConfigAddCtr.visible = false;
      if (val) {
        this.handleReset();
      }
    },
  },
};
</script>
<style scoped>
img {
  height: 50px;
}

.config {
  border-bottom: 1px solid #eee;
}
</style>
