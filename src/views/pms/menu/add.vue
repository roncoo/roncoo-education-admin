<template>
  <!--弹窗-->
  <el-dialog
    width="500px"
    :title="title"
    :visible.sync="visible"
    :before-close="handleClose"
  >
    <el-form ref="formData" :model="formData" :rules="rules" label-width="100px">
      <el-form-item label="类型：">
        <el-radio-group v-model="menuType">
          <el-radio :label="1">目录</el-radio>
          <el-radio :label="2">菜单</el-radio>
          <el-radio :label="3">按钮</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="菜单名称：" prop="menuName">
        <el-input v-model="formData.menuName" />
      </el-form-item>
      <el-form-item v-if="menuType != 3" label="路由地址：" prop="menuUrl">
        <el-input v-model="formData.menuUrl" />
      </el-form-item>
      <el-form-item v-if="menuType == 2 || menuType == 3" label="接口地址：">
        <el-input v-model="formData.apiUrl" />
      </el-form-item>
      <el-form-item label="菜单图标">
        <el-select v-model="formData.menuIcon" placeholder="请选择">
          <el-option
            v-for="item in svgIconList"
            :key="item.icon"
            :label="item.label"
            :value="item.icon"
          >
            <span style="float: left">{{ item.label }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">
              <svg-icon :icon-class="item.icon || ''" />
            </span>
          </el-option>
        </el-select>
        <span>&nbsp;&nbsp;<svg-icon :icon-class="formData.menuIcon || ''" /></span>
      </el-form-item>
      <el-form-item label="排序：">
        <el-input-number v-model="sort" style="width: 300px;" :min="1" :max="10000" @change="handleChange" />
      </el-form-item>
      <el-form-item label="备注：">
        <el-input v-model="formData.remark" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button size="mini" type="danger" @click="handleClose">取 消</el-button>
      <el-button size="mini" type="primary" @click="submitForm('formData')">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import * as api from '@/api/system'

export default {
  name: 'Add',
  props: {
    // route object
    // formData: {
    //   type: Object,
    //   default: () => {}
    // },
    parentId: {
      type: String,
      default: ''
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
      formData: {},
      sort: 1,
      menuType: 1,
      rules: {
        menuName: [
          {required: true, message: '请输入菜单名称', trigger: 'blur'}
        ]
      },
      svgIconList: []
    }
  },
  mounted() {
    this.svgIconList = this.$store.state.user.svgIconList
  },
  methods: {
    handleChange(value) {
      this.formData.sort = value
    },
    // 保存管理员信息
    submitForm(formData) {
      this.formData.menuType = this.menuType
      if (!this.formData.menuName) {
        this.$message({
          type: 'error',
          message: '请输入菜单名称'
        });
        return false
      }
      if (this.formData.menuType !== 3) {
        if (!this.formData.menuUrl) {
          this.$message({
            type: 'error',
            message: '请输入路由地址'
          });
          return false
        }
      }
      if (this.formData.menuType === 2 || this.formData.menuType === 3) {
        if (!this.formData.apiUrl) {
          this.$message({
            type: 'error',
            message: '请输入接口地址'
          });
          return false
        }
      }
      this.$refs[formData].validate((valid) => {
        if (valid) {
          this.loading.show()
          this.formData.parentId = this.parentId
          this.formData.sort = this.sort
          this.formData.hiddenType = this.hiddenType
          api.menuSave(this.formData).then(res => {
            this.loading.hide()
            if (res.code === 200 && res.data > 0) {
              // 提交成功, 关闭窗口, 刷新列表
              this.tips('操作成功', 'success')
              this.handleClose()
            } else {
              this.$message({
                type: 'error',
                message: '提交失败'
              });
            }
          }).catch(() => {
            this.loading.hide()
          })
        } else {
          this.$message({
            type: 'error',
            message: '提交失败'
          });
        }
      })
    },
    // 关闭弹窗
    handleClose(done) {
      this.$refs['formData'].resetFields()
      this.formData = {}
      this.$emit('close-callback')
    }
  }
}
</script>
