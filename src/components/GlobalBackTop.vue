<script setup>
  import { computed, onBeforeUnmount, onMounted, shallowRef, watch } from 'vue'
  import { ArrowUp } from '@element-plus/icons-vue'

  const props = defineProps({
    scrollTarget: { type: Object, default: null }
  })

  const windowTop = shallowRef(0)
  const targetTop = shallowRef(0)
  const visible = computed(() => Math.max(windowTop.value, targetTop.value) > 240)

  const updateWindowTop = () => {
    windowTop.value = window.scrollY || document.documentElement.scrollTop || 0
  }
  const updateTargetTop = () => {
    targetTop.value = props.scrollTarget?.scrollTop || 0
  }

  watch(
    () => props.scrollTarget,
    (target, previousTarget) => {
      previousTarget?.removeEventListener('scroll', updateTargetTop)
      target?.addEventListener('scroll', updateTargetTop, { passive: true })
      updateTargetTop()
    },
    { immediate: true, flush: 'post' }
  )

  const scrollToTop = () => {
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
    props.scrollTarget?.scrollTo({ top: 0, behavior })
    window.scrollTo({ top: 0, behavior })
  }

  onMounted(() => {
    updateWindowTop()
    window.addEventListener('scroll', updateWindowTop, { passive: true })
  })

  onBeforeUnmount(() => {
    props.scrollTarget?.removeEventListener('scroll', updateTargetTop)
    window.removeEventListener('scroll', updateWindowTop)
  })
</script>

<template>
  <button v-show="visible" aria-label="返回页面顶部" class="global-backtop" title="返回页面顶部" type="button" @click="scrollToTop">
    <el-icon><ArrowUp /></el-icon>
  </button>
</template>

<style lang="scss" scoped>
  .global-backtop {
    position: fixed;
    right: 28px;
    bottom: 28px;
    z-index: 2001;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    padding: 0;
    border: 1px solid var(--el-color-primary-light-7);
    border-radius: 50%;
    color: var(--el-color-primary);
    background: var(--el-bg-color-overlay);
    cursor: pointer;
    box-shadow: 0 4px 14px rgb(31 45 61 / 14%);

    &:hover,
    &:focus-visible {
      background: var(--el-color-primary-light-9);
      box-shadow: 0 6px 18px rgb(64 158 255 / 18%);
    }

    .el-icon {
      font-size: 19px;
    }
  }
</style>
