<template>
  <!--弹窗-->
  <el-dialog
     width="30%"
    :title="title"
    :visible.sync="visible"
    :before-close="handleClose">
     <el-form :inline="true">
      <el-form-item label="客户端名称:">
        <span >{{formData.clientName}}</span>
      </el-form-item>
      <el-form-item label="客户端ID:">
        <span >{{formData.clientId}}</span>
      </el-form-item>
      <el-form-item label="客户端密匙:">
        <span >{{formData.clientSecret}}</span>
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
      return {
      }
    },
     props: {
      // route object
      formData: {
        type: Object,
        default: () => {}
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
<style scoped>
