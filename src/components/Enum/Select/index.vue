<template>
  <el-select v-model="enumVal" :placeholder="title" :clearable="true" style="width: 200px" @change="handleChange">
    <el-option v-for="item in enums" :key="item.code" :label="item.desc" :value="item.code" />
  </el-select>
</template>

<script setup>
  import { onMounted, ref, toRefs, watch } from 'vue'
  import { getEnumList } from '@/utils/base'

  const props = defineProps({
    modelValue: { type: Number, default: undefined },
    enumName: { type: String, default: '' },
    title: { type: String, default: '请选择' }
  })

  const { modelValue, title } = toRefs(props)

  const enumVal = ref()
  watch(modelValue, (newValue) => {
    enumVal.value = newValue
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
