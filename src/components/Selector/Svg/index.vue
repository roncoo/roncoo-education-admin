<template>
  <el-dialog :append-to-body="true" :model-value="visible" title="图标选择" width="400px" center align-center @close="handleClose" :destroy-on-close="true">
    <div class="icon-content">
      <span v-for="item in iconArray" :key="item" @click="handleClick(item)" class="icon-name"> <icon :name="item" class="icon-item" /><br />{{ item }} </span>
    </div>
  </el-dialog>
</template>

<script setup>
  import { ref, toRefs } from 'vue'
  import Icon from '@/components/Icon/index.vue'

  const props = defineProps({
    visible: {
      type: Boolean,
      default: false
    }
  })

  const { visible } = toRefs(props)

  const emit = defineEmits(['update', 'close'])

  const iconArray = ref(['概况', '常用', '课程', '用户', '系统'])

  function handleClick(icon) {
    emit('update', icon)
  }

  const handleClose = () => {
    emit('close')
  }
</script>

<style lang="scss" scoped>
  .icon-content {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    .icon-name {
      cursor: pointer;
      margin: 10px;
      padding: 10px 10px 10px 20px;
      border: #cccccc 1px solid;
    }
    .icon-item {
      width: 30px;
      height: 30px;
      margin-right: 10px;
    }
  }
</style>
