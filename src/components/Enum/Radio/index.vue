<template>
  <el-radio-group v-model="modelValue" @change="handleChange">
    <el-radio v-for="item in enums" :key="item.code" :label="item.code">{{ item.desc }}</el-radio>
  </el-radio-group>
</template>

<script setup>
  import { onMounted, ref } from 'vue'
  import { getEnumList } from '@/utils/base'

  const props = defineProps({
    modelValue: { type: Number, default: 0 },
    enumName: { type: String, default: '' }
  })

  const modelValue = ref(props.modelValue)

  const emit = defineEmits(['update:modelValue'])
  function handleChange(item) {
    emit('update:modelValue', item)
  }

  const enums = ref([])
  onMounted(() => {
    enums.value = getEnumList(props.enumName)
  })
</script>
