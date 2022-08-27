<template>
  <!--弹窗-->
  <el-dialog
    width="1000px"
    :title="title"
    :visible.sync="visible"
    :before-close="handleClose">
    <el-form ref="formData" :model="formData" label-width="100px">
      <div>
        <el-row>
          <el-col :span="12">
            <el-form-item label="讲师名称：">
              <el-input v-model="formData.lecturerName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱：">
              <el-input v-model="formData.lecturerEmail"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="讲师简介：">
          <div id="introduce"></div>
        </el-form-item>
      </div>
    </el-form>
    <div slot="footer">
      <el-button size="mini" type="danger" @click="handleClose">取 消</el-button>
      <el-button size="mini" type="primary" @click="submitForm('formData')">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import * as api from '@/api/lecturer'
import * as commonalityApi from '@/api/commonality'

export default {
  name: 'Edit',
  data() {
    return {
      editor: {}
    }
  },
  props: {
    // route object
    formData: {
      type: Object,
      default: () => {
      }
    },
    lecturerExt: {
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
  watch: {
    visible: function(val) {
      if (val) {
        setTimeout(() => {
          this.editor.create();
          this.editor.customConfig.customUploadImg = this.editorUpload
          if (this.formData.introduce !== undefined && this.formData.introduce !== '' && this.formData.introduce !== null) {
            this.editor.txt.html(this.formData.introduce)
          } else {
            this.editor.txt.html('')
          }
        }, 200)
      }
    }
  },
  mounted() {
    this.createEdit();
  },
  methods: {
    createEdit() {
      const E = require('wangeditor')
      this.editor = new E('#introduce')
    },
    handleClose(done) {
      this.editor.txt.clear()
      this.$emit('close-callback')
    },
    handleChange(value) {
      this.formData.sort = value
    },
    submitForm(formData) {
      this.$refs[formData].validate((valid) => {
        if (valid) {
          if (this.formData.id === undefined) {
            this.$message({
              type: 'error',
              message: "提交失败"
            });
          } else {
            this.formData.introduce = this.editor.txt.html()
            this.loading.show()
            api.lecturerUpdate(this.formData).then(res => {
              this.loading.hide()
              if (res.code === 200 && res.data > 0) {
                // 提交成功, 关闭窗口, 刷新列表
                this.tips('操作成功', 'success')
                this.handleClose()
              } else {
                this.$message({
                  type: 'error',
                  message: "提交失败"
                });
              }
            }).catch(() => {
              this.loading.hide()
            })
          }
        } else {
          this.loading.hide()
          this.$message({
            type: 'error',
            message: "提交失败"
          });
        }
      })
    },
    // 编辑器上传图片
    editorUpload(files, insert) {
      const file = files[0];
      const param = new FormData();
      param.append('picFile', file, file.name);
      commonalityApi.uploadPic(param).then(res => {
        if (res.code === 200) {
          const imgUrl = res.data
          insert(imgUrl)
        }
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '上传图片出错，请稍后重试'
        })
      })
    }
  }
}
</script>
