<template>
  <router-link :to="props.to">
    <slot/>
  </router-link>
</template>

<script setup lang="ts">
const props = defineProps({
  to: {
    type: String,
    required: true
  }
})
</script>
