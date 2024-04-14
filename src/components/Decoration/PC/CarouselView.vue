<template>
  <div class="carousel">轮播图</div>
</template>

<script setup>
  import { defineProps, onMounted } from 'vue'

  const props = defineProps({
    componentInfo: {
      type: Object,
      default: () => {
        return null
      }
    }
  })
  onMounted(() => {})
</script>

<style lang="scss" scoped></style>
