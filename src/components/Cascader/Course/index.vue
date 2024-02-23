<template>
  <el-cascader :options="options" :props="props" @change="handleChange" style="width: 100%" />
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { courseApi } from '@/api/course'

const emit = defineEmits(['update:modelValue'])
const handleChange = (item) => {
  // 获取最后一个分类ID
  emit('update:modelValue', item.pop())
}

const options = ref([])
onMounted(() => {
  courseApi.categoryList({}).then((res) => {
    options.value = res
  })
})

const props = {
  value: 'id',
  label: 'categoryName',
  children: 'childrenList',
  expandTrigger: 'hover'
}
</script>
