<template>
  <el-dialog
    v-model="visible"
    :before-close="handleClose"
    :title="title"
    width="800px"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="所属类别" prop="configType">
        <el-select
          v-model="form.configType"
          placeholder="请选择"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="配置类型" prop="contentType">
        <el-radio-group v-model="form.contentType">
          <el-radio :label="1">文本</el-radio>
          <el-radio :label="2">富文本</el-radio>
          <el-radio :label="3">图片</el-radio>
          <el-radio :label="4">开关</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="配置名称" prop="configName">
        <el-input
          v-model="form.configName"
          maxlength="30"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="配置说明" prop="remark">
        <el-input
          v-model="form.remark"
          :autosize="{ minRows: 2, maxRows: 4 }"
          maxlength="100"

          placeholder="请输入内容"
          show-word-limit
          type="textarea"
        />
      </el-form-item>
      <el-form-item label="Key" prop="configKey">
        <el-tooltip
          class="item"
          content="注意: 新增后，不能编辑"
          placement="bottom-start"
        >
          <el-input
            v-model="form.configKey"
            maxlength="50"
            show-word-limit
          />
        </el-tooltip>
      </el-form-item>
      <el-form-item label="Value">
        <!--      文本类型       -->
        <el-input
          v-if="form.contentType === 1"
          v-model="form.configValue"
          :autosize="{ minRows: 2, maxRows: 4 }"
          placeholder="请输入内容"

          type="textarea"
        />
        <!--      富文本类型       -->
        <wangeditor
          v-if="form.contentType === 2"
          v-model="form.configValue"
          @input="(val) => {form.configValue = val;}"
        />
        <!--      图片类型       -->
        <upload-image
          v-if="form.contentType === 3"
          :image-url="form.configValue"
          class="avatar"
          @success="(val) => { form.configValue = val.url;}"
        />
        <el-switch
          v-if="form.contentType === 4"
          v-model="form.configValue"
          :active-value="1"
          :inactive-value="0"
          active-text="开启"
          inactive-text="关闭"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')"
        >保存
        </el-button
        >
      </div>
    </template>
  </el-dialog>
</template>
<script>
import {sysConfigSave} from "@/api/system";
import Wangeditor from "@/components/Wangeditor/Wangeditor.vue";
import UploadImage from "@/components/Upload/UploadImage.vue";

export default {
  name: "AddSysConfig",
  components: {Wangeditor, UploadImage},
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      options: [
        {
          value: 1,
          label: "站点设置",
        },
        {
          value: 2,
          label: "系统设置",
        },
        {
          value: 3,
          label: "视频设置",
        },
        {
          value: 4,
          label: "存储设置",
        },
        {
          value: 5,
          label: "短信设置",
        },
        {
          value: 6,
          label: "默认设置",
        },
        {
          value: 7,
          label: "支付设置",
        },
        {
          value: 8,
          label: "支付服务商设置",
        },
        {
          value: 9,
          label: "微信开放平台设置",
        },
        {
          value: 10,
          label: "人脸识别",
        }

      ],
      form: {
        sort: 1,
        allowDelete: 1,
        configType: 1,
        contentType: 1,
        configValue: 0,
      },
      sysConfigTypeEnum: {},
      fileStorageTypeEnum: {},
      vodPlatformEnum: {},
      livePlatformEnum: {},
      opts: {},
      rules: {
        configName: [
          {required: true, message: "请输入参数名称", trigger: "blur"},
        ],
        configKey: [
          {required: true, message: "请输入参数键名", trigger: "blur"},
        ],
        allowDelete: [
          {required: true, message: "请选择是否允许删除", trigger: "blur"},
        ],
        configType: [
          {required: true, message: "请选择配置类型", trigger: "blur"},
        ],
        contentType: [
          {required: true, message: "请选择内容类型", trigger: "blur"},
        ],
        remark: [
          {required: true, message: "请输入描述", trigger: "blur"},
        ]
      },
      allowDeleteEnum: [],
      isEdit: false,
    };
  },
  mounted() {
    this.isEdit = true;
    // 枚举类型
    if (this.form.configType === 6) {
      this.$store
        .dispatch("GetOpts", {enumName: "FileStorageTypeEnum", type: "arr"})
        .then((res) => {
          this.fileStorageTypeEnum = res;
        });
      this.$store
        .dispatch("GetOpts", {enumName: "VodPlatformEnum", type: "arr"})
        .then((res) => {
          this.vodPlatformEnum = res;
        });
      this.$store
        .dispatch("GetOpts", {enumName: "LivePlatformEnum", type: "arr"})
        .then((res) => {
          this.livePlatformEnum = res;
        });
    }
    // this.$store.dispatch('GetOpts', {enumName: 'SysConfigTypeEnum', type: 'arr'}).then(res => {
    //     this.sysConfigTypeEnum = res;
    // });
  },
  emits: ["close-callback"],
  methods: {
    handleClose() {
      this.$emit("close-callback");
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.onSubmit();
        } else {
          return false;
        }
      });
    },
    onSubmit() {
      this.loading = true;
      // 新增
      // if (this.form.configType === 3) {
      //   this.form.isHidden = 1;
      // }
      sysConfigSave(this.form)
        .then((res) => {
          console.log(res);
          this.$message.success(res);
          this.$emit("close-callback", "success");
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
<style lang="scss">
</style>
