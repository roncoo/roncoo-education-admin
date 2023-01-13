<template>
  <el-dialog :model-value="visible" :before-close="handleClose" :title="title" width="800px">
    <el-form ref="form" :model="newFormData" :rules="rules">
      <el-form-item prop="configValue">
        <!-- 文本类型 -->
        <el-input v-if="newFormData.contentType === 1" v-model="newFormData.configValue" :rows="6" placeholder="请输入内容" type="textarea"/>
        <!-- 富文本类型 -->
        <wangeditor v-if="newFormData.contentType === 2" v-model="newFormData.configValue" :value="newFormData.configValue" @input="(val) => { newFormData.configValue = val; }"/>
        <!-- 图片类型 -->
        <upload-image v-if="newFormData.contentType === 3" :image-url="newFormData.configValue" class="avatar" @success=" (val) => {   newFormData.configValue = val.url;  }"/>
        <!-- 枚举类型 -->
        <el-radio-group v-if="newFormData.contentType === 5 && newFormData.configKey === 'storagePlatform'" v-model="newFormData.configValue">
          <template v-for="(item,index) in storagePlatformEnum" :key="item.code">
            <el-radio :label="'' + item.code">{{ item.desc }}</el-radio>
          </template>
        </el-radio-group>
        <el-radio-group v-if="newFormData.contentType === 5 && newFormData.configKey === 'smsPlatform'" v-model="newFormData.configValue">
          <template v-for="(item,index) in smsPlatformEnum" :key="item.code">
            <el-radio :label="'' + item.code">{{ item.desc }}</el-radio>
          </template>
        </el-radio-group>
        <el-radio-group v-if="newFormData.contentType === 5 && newFormData.configKey === 'vodPlatform'" v-model="newFormData.configValue">
          <template v-for="(item,index) in vodPlatformEnum" :key="item.code">
            <el-radio :label="'' + item.code">{{ item.desc }}</el-radio>
          </template>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submitForm('formData')">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script>
import {sysConfigEdit} from '@/api/system';
import Wangeditor from '@/components/Wangeditor/index.vue';
import UploadImage from '@/components/Upload/image.vue';

export default {
  name: 'EditSysConfig',
  components: {Wangeditor, UploadImage},
  props: {
    // route object
    formData: {
      type: Object,
      default: () => {
      }
    },
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      storagePlatformEnum: {},
      vodPlatformEnum: {},
      smsPlatformEnum: {},
      livePlatformEnum: {},
      newFormData: {},
      rules: {
        configValue: [
          {required: true, message: '请输入参数键值', trigger: 'blur'}
        ]
      }
    };
  },
  mounted() {
    this.newFormData = {...this.formData};
    // 枚举类型
    this.$store.dispatch('GetOpts', {enumName: 'StoragePlatformEnum', type: 'arr'}).then((res) => {
      this.storagePlatformEnum = res;
    });
    this.$store.dispatch('GetOpts', {enumName: 'VodPlatformEnum', type: 'arr'}).then((res) => {
      this.vodPlatformEnum = res;
    });
    this.$store.dispatch('GetOpts', {enumName: 'SmsPlatformEnum', type: 'arr'}).then((res) => {
      this.smsPlatformEnum = res;
    });
  },
  emits: ['close-callback'],
  methods: {
    handleClose() {
      this.$emit('close-callback');
    },
    submitForm(formName) {
      if (!this.newFormData.configValue) {
        this.$message({
          type: 'error',
          message: '值不能为空'
        });
        return false;
      }
      this.onSubmit();
    },
    onSubmit() {
      this.loading = true;
      // 编辑
      sysConfigEdit(this.newFormData
      ).then((res) => {
        this.loading = false;
        this.$message.success(res);
        this.$emit('close-callback', 'success');
      }).catch(() => {
        this.loading = false;
      });
    }
  }
};
</script>
