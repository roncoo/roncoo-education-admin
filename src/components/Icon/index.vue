<template>
  <svg :class="svgClass">
    <use :href="iconName"></use>
  </svg>
</template>

<script setup>
  import { computed } from 'vue'

  const props = defineProps({
    name: {
      type: String,
      required: true
    }
  })

  const svgClass = computed(() => {
    if (props.name) {
      return `svg-icon icon-${props.name}`
    }
    return 'svg-icon'
  })

  const iconName = computed(() => {
    return `#icon-${props.name}`
  })
</script>

<style lang="scss" scoped>
  .svg-icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
    cursor: pointer;
  }
</style>
