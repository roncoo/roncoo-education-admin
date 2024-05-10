<template>
  <el-radio-group v-model="modelValue" @change="handleChange">
    <el-radio v-for="item in enums" :key="item.code" :value="item.code">{{ item.desc }}</el-radio>
  </el-radio-group>
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue'
  import { getEnumList } from '@/utils/base'

  const props = defineProps({
    modelValue: { type: Number, default: 0 },
    enumName: { type: String, default: '' }
  })

  const modelValue = computed(() => {
    return props.modelValue
  })

  const emit = defineEmits(['update:modelValue'])
  function handleChange(item) {
    emit('update:modelValue', item)
  }

  const enums = ref([])
  onMounted(async () => {
    enums.value = await getEnumList(props.enumName)
  })
</script>
