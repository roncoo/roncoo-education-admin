<template>
  <svg :class="svgClass" v-bind="$attrs">
    <use :xlink:href="iconName"></use>
  </svg>
</template>

<script setup lang="ts">
import {computed} from 'vue';

const props = defineProps({
  name: {
    type: String,
    required: true
  }
})

const iconName = computed(() => `#icon-${props.name}`)
const svgClass = computed(() => {
  if (props.name) return `svg-icon icon-${props.name}`
  return 'svg-icon'
})
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.svg-external-icon {
  background-color: currentColor;
  mask-size: cover !important;
  display: inline-block;
}
</style>
