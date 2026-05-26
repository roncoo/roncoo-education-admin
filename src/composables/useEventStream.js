import { onUnmounted, ref } from 'vue'
import { ElMessage } from 'element-plus'

/**
 * SSE 流式请求 composable
 */
export function useEventStream({ onChunk, onDone, onError, throttleMs = 80 } = {}) {
  let es = null
  let rawText = ''
  let renderTimeout = null
  let lastRenderTime = 0

  const loading = ref(false)
  const isComplete = ref(false)

  const flush = () => {
    clearTimeout(renderTimeout)
    onChunk?.(rawText)
  }

  const debouncedFlush = () => {
    const now = Date.now()
    const elapsed = now - lastRenderTime
    clearTimeout(renderTimeout)
    if (elapsed >= throttleMs) {
      lastRenderTime = now
      onChunk?.(rawText)
    } else {
      renderTimeout = setTimeout(() => {
        lastRenderTime = Date.now()
        onChunk?.(rawText)
      }, throttleMs - elapsed)
    }
  }

  const stop = () => {
    clearTimeout(renderTimeout)
    if (es) {
      es.close()
      es = null
    }
  }

  const handleError = (err, defaultMsg) => {
    loading.value = false
    stop()
    if (onError) {
      onError(err)
    } else {
      ElMessage.error(defaultMsg)
    }
  }

  const start = async (apiCall) => {
    if (loading.value) {
      ElMessage.warning('正在处理···')
      return
    }
    try {
      stop()
      rawText = ''
      lastRenderTime = 0
      loading.value = true
      isComplete.value = false

      es = await apiCall()

      if (!es) {
        handleError(new Error('EventSource 为空'), 'SSE 连接创建失败，请稍后重试')
        return
      }

      es.onmessage = (message) => {
        if (message.data.includes('[DONE]')) {
          flush()
          loading.value = false
          isComplete.value = true
          onDone?.(rawText)
          stop()
          return
        }
        if (message.data.includes('[ERROR]')) {
          handleError(new Error(message.data), '请求失败，请稍后重试')
          return
        }
        rawText += message.data
        debouncedFlush()
      }

      es.onerror = (e) => {
        console.error('SSE 连接错误:', e)
        handleError(e, '连接中断，请稍后重试')
      }
    } catch (error) {
      console.error('SSE 请求异常:', error)
      handleError(error, '请求失败，请稍后重试')
    }
  }

  onUnmounted(() => stop())

  return { start, stop, loading, isComplete }
}
