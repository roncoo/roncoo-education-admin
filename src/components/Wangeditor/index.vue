<style lang="scss" rel="stylesheet/scss">
.wangeditor-box {
  box-sizing: content-box;
  position: relative;
  z-index: 1;

  .w-e-toolbar {
    line-height: 1.15;
  }

  .w-e-text-container {
    height: 100% !important;
  }
}
</style>
<template>
  <div :id="ids" :style="{ height: height + 'px' }" class="wangeditor-box"/>
</template>
<script>
import {uploadPic} from '@/api/upload.js';
import E from 'wangeditor'

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
      this.editor.$textElem.attr('contenteditable', !val);
    },
    value: {
      handler(val) {
        this.setContent(val);
      },
      immediate: true
    }
  },
  unmounted() {
    this.editor = null;
  },
  mounted() {
  },
  methods: {
    isdisabled(val) {
      this.editor.$textElem.attr('contenteditable', !this.disabled);
    },
    setContent(val) {
      const setValueFunc = () => {
        if (val !== this.currentValue) {
          //console.log(val);
          this.editor && this.editor.txt && this.editor.txt.html(val);
        }
      };
      // 编辑器赋值
      if (!this.hasInit) {
        this.hasInit = true;
        this.$nextTick(() => {
          this.ids = 'e_' + parseInt(Math.random() * 1000, 10);
          this.$nextTick(() => {
            this.renderEditor();
            setTimeout(setValueFunc, 20);
          });
        });
      } else {
        setTimeout(setValueFunc, 20);
      }
    },
    // 编辑器上传图片
    editorUpload(files, insert) {
      // console.log(files)
      const file = files[0];
      uploadPic({file: file}, function(int) {
      })
        .then(insert)
        .catch(() => {
          this.$msgBox({content: '上传图片出错，请稍后重试'});
        });
    },
    renderEditor() {
      function removeWordXml(text) {
        var html = text;
        html = html.replace(/<\/?SPANYES[^>]*>/gi, ''); //  Remove  all  SPAN  tags
        // html = html.replace(/<(\w[^>]*)  class=([^|>]*)([^>]*)/gi, "<$1$3");  //  Remove  Class  attributes
        // html = html.replace(/<(\w[^>]*)  style="([^"]*)"([^>]*)/gi, "<$1$3");  //  Remove  Style  attributes
        html = html.replace(/<(\w[^>]*) {2}lang=([^|>]*)([^>]*)/gi, '<$1$3'); //  Remove  Lang  attributes
        html = html.replace(/<\\?\?xml[^>]*>/gi, ''); //  Remove  XML  elements  and  declarations
        html = html.replace(/<\/?\w+:[^>]*>/gi, ''); //  Remove  Tags  with  XML  namespace  declarations:  <o:p></o:p>
        html = html.replace(/&nbsp;/, ''); //  Replace  the  &nbsp;
        html = html.replace(/\n(\n)*( )*(\n)*\n/gi, '\n');
        //  Transform  <P>  to  <DIV>
        // var  re  =  new  RegExp("(<P)([^>]*>.*?)(<//P>)","gi")  ;            //  Different  because  of  a  IE  5.0  error
        //        html = html.replace(re, "<div$2</div>");

        return html;
      }

      // E.config.pasteFilterStyle = false
      this.editor = new E('#' + this.ids);
      this.editor.config.menus = [
        'head', // 标题
        'bold', // 粗体
        'fontSize', // 字号
        'fontName', // 字体
        // 'italic', // 斜体
        'underline', // 下划线
        // 'strikeThrough', // 删除线
        'foreColor', // 文字颜色
        'backColor', // 背景颜色
        'link', // 插入链接
        'list', // 列表
        'justify', // 对齐方式
        'quote', // 引用
        'emoticon', // 表情
        'image', // 插入图片
        // 'table', // 表格
        // 'video', // 插入视频
        // 'code', // 插入代码
        'undo', // 撤销
        'redo' // 重复
      ];
      this.editor.config.uploadImgMaxLength = 1;
      this.editor.config.customUploadImg = this.editorUpload;
      this.editor.config.zIndex = 1000;
      this.editor.config.onchange = (html) => {
        html = removeWordXml(html);
        this.currentValue = html;
        this.$emit('input', html);
      };
      this.editor.create();
      if (this.imgExt) {
        this.editor.config.pasteFilterStyle = false;
        this.editor.config.pasteTextHandle = function(str) {
          // 对粘贴的文本进行处理，然后返回处理后的结果
          /*if (str) {
            return  str.replace(/<!--(.|[\r\n])*?-->/g, '').trim(); // 去掉所有的html标签和&nbsp;之类的特殊符合
          } else {
            return '';
          }*/
        };
      }

      this.isdisabled();
    }
  }
};
</script>
