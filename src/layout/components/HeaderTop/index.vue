<template>
  <el-header>
    <div class="header-content">
      <el-dropdown>
        <el-icon>
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
      <span>Tom</span>
    </div>
  </el-header>
</template>
<script setup>

</script>

<style lang="less" scoped>
.header-content {
  height: 50px;
}
</style>
