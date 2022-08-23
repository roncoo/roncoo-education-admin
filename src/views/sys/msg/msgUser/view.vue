<template>
  <!--弹窗-->
  <el-dialog
    width="40%"
    :title="title"
    :visible.sync="visible"
    :before-close="handleClose">
    <el-form :inline="true">
      <el-alert class="title" :closable="false" title="内容" type="info"/>
      <br/><br/>
      <el-form-item v-html="formData.msgTitle">
      </el-form-item>
    </el-form>
    <br/>
    <div slot="footer">
      <el-button size="mini" type="danger" plain @click="handleClose">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {}
  },
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
  methods: {
    handleClose(done) {
      this.$emit('close-callback')
    }
  }
}
</script>
