<template>
  <span>{{ enumVal }}</span>
</template>

<script setup>
  import { onMounted, ref } from 'vue'
  import { getEnumObj } from '@/utils/base'

  const props = defineProps({
    enumName: { type: String, default: '' },
    enumValue: { type: Number, default: 0 }
  })

  const enumVal = ref()
  onMounted(() => {
    getEnumObj(props.enumName).then((res) => {
      enumVal.value = res[props.enumValue]
    })
  })
</script>
