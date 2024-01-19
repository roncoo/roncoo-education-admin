<template>
  <div class="links">
    <el-dropdown>
      <el-icon style="font-size: 30px">
        <setting/>
      </el-icon>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>View</el-dropdown-item>
          <el-dropdown-item>Add</el-dropdown-item>
          <el-dropdown-item>Delete</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>
<script setup lang="ts">

</script>

<style lang="less" scoped>
.links {
  align-items: center;
  float: right;
  height: 100%;
  line-height: 50px;
}
</style>
