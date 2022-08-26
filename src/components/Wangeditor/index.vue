<style lang="scss" rel="stylesheet/scss">
</style>
<template>
  <div :id="ids" :style="{ height: height + 'px' }" class="wangeditor-box" />
</template>
<script>
import { uploadPic } from '@/api/system.js';
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    height: {
      type: Number,
      default: 300
    },
    disabled: {
      type: Boolean,
      default: false
    },
    imgExt: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      ids: '',
      hasInit: false,
      currentValue: ''
    };
  },
  watch: {
    disabled(val) {
      if (val) {
        this.Vditor.disabled();
      } else {
        this.Vditor.enable();
      }
    },
    value: {
      handler(val) {
        this.setContent(val);
      },
      immediate: true
    }
  },
  unmounted() {
    this.vditor = null;
  },
  mounted() {},
  methods: {
    isdisabled(val) {
      if (this.disabled) {
        this.vditor.disabled();
      } else {
        this.vditor.enable();
      }
    },
    setContent(val) {
      const setValueFunc = () => {
        console.log(val, this.currentValue);
        if (val !== this.currentValue) {
          console.log(1);
          this.vditor && this.vditor.setValue(val);
        }
      };
      // 编辑器赋值
      if (!this.hasInit) {
        this.hasInit = true;
        this.$nextTick(() => {
          this.ids = 'e_' + parseInt(Math.random() * 1000, 10);
          this.$nextTick(() => {
            this.renderEditor(val);
          });
        });
      } else {
        setTimeout(setValueFunc, 20);
      }
    },
    renderEditor(val) {
      var that = this;
      this.vditor = new window.Vditor(this.ids, {
        height: '524px',
        placeholder: '请输入内容..',
        lang: 'zh_CN',
        value: val,
        mode: 'sv',
        icon: 'material',
        theme: 'classic',
        ctrlEnter() {
          // that.openSave();
        },
        input(val) {
          that.currentValue = val;
          that.$emit('input', val);
        },
        upload: {
          async handler(files, fn) {
            const file = files[0];
            const param = new FormData();
            param.append('file', file, file.name);
            const res = await uploadPic(param, function(int) {});
            console.log(res)
            if (res.code === 200) {
              that.vditor.insertValue('![' + file.name + '](' + res.data + ')');
            } else {
              this.$message.error('上传图片出错，请稍后重试');
            }
          }
        }
      });
      this.isdisabled();
    }
  }
};
</script>
