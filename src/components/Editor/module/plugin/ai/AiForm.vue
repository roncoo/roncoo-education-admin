<template>
  <el-dialog :model-value="props.visible" width="1000px" align-center destroy-on-close @close="handleClose">
    <el-form class="ai" @submit.prevent>
      <el-form-item>
        <enum-radio v-model="formModel.writeType" :enum-name="'WriteTypeEnum'" />
        <div class="tip">AI助手，帮你完成你所想</div>
      </el-form-item>
      <div style="height: 10px"></div>
      <el-form-item>
        <el-input v-model="formModel.userPrompt" placeholder="告诉AI，你想写的内容">
          <template #suffix>
            <el-button link :loading="isBeginning" type="primary" @click="handleAi()"> 创作开始 </el-button>
          </template>
        </el-input>
      </el-form-item>
      <div style="height: 20px"></div>
      <div ref="contentRef" class="ai-write-content">
        <div class="content" v-html="messageList"></div>
      </div>
      <div class="tools" v-if="isComplete">
        <div class="cursor">
          <el-tooltip content="重新生成" effect="dark" placement="top">
            <el-icon @click="handleAi()"><Refresh /></el-icon>
          </el-tooltip>
          <el-tooltip content="复制" effect="dark" placement="top">
            <el-icon v-if="!isCopyComplete" @click="handleCopy()"><CopyDocument /></el-icon>
            <el-icon v-if="isCopyComplete" @click="handleCopy()"><Check /></el-icon>
          </el-tooltip>
        </div>
        <div class="cursor">
          <el-button size="small" type="primary" @click="handleSubmit()">插入下方</el-button>
        </div>
      </div>
    </el-form>
  </el-dialog>
</template>

<script setup>
  import { nextTick, reactive, ref } from 'vue'
  import { Check, CopyDocument, Refresh } from '@element-plus/icons-vue'
  import { systemApi } from '@/api/system.js'
  import { ElMessage } from 'element-plus'
  import { useEventStream } from '@/composables/useEventStream.js'
  import { preprocessMarkdown, safeMarkdownRender } from '@/utils/markdown.js'
  import EnumRadio from '@/components/Enum/Radio/index.vue'

  const props = defineProps({
    visible: {
      type: Boolean,
      default: false
    }
  })

  const formDefault = {
    writeType: 1,
    userPrompt: ''
  }
  const formModel = reactive({ ...formDefault })

  const contentRef = ref(null)
  const messageList = ref('')
  const isCopyComplete = ref(false)

  const {
    start,
    loading: isBeginning,
    isComplete
  } = useEventStream({
    onChunk: (text) => {
      if (text && text.trim()) {
        // 后端将换行符编码为 \n 字面量推送，此处还原为真正的换行符再渲染
        const decoded = text.replace(/\\n/g, '\n').replace(/\\r/g, '')
        messageList.value = safeMarkdownRender(preprocessMarkdown(decoded))
      }
      nextTick().then(() => {
        if (contentRef.value) {
          contentRef.value.scrollTop = contentRef.value.scrollHeight - 10
        }
      })
    },
    onError: () => {
      ElMessage.error('AI写作繁忙，请稍后重试')
    }
  })

  const handleAi = async () => {
    if (!formModel.userPrompt || !formModel.userPrompt.trim()) {
      ElMessage.warning('请输入创作内容')
      return
    }
    messageList.value = ''
    isCopyComplete.value = false
    const aiToken = await systemApi.aiWriteCreate(formModel)
    await start(() => systemApi.aiWriteCompletions({ aiToken }))
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(messageList.value)
    ElMessage.success('已复制到剪贴板')
    isCopyComplete.value = true
  }

  const emit = defineEmits(['close'])

  const handleClose = () => {
    emit('close')
  }

  const handleSubmit = () => {
    emit('close', messageList.value)
  }
</script>

<style lang="scss" scoped>
  .tip {
    margin-left: 12px;
    color: #999;
    font-size: 12px;
  }

  .ai-write-content {
    min-height: 200px;
    max-height: calc(80vh - 150px);
    background: linear-gradient(180deg, #f9f5ffff 0%, #fffdffff 45%);
    overflow-y: auto;
    border-radius: 10px;
    opacity: 1;
    border: 1px solid #f4f4f4ff;

    .content {
      padding: 10px;

      :deep(h1),
      :deep(h2),
      :deep(h3),
      :deep(h4),
      :deep(h5),
      :deep(h6) {
        margin: 16px 0 8px 0;
        font-weight: 600;
        line-height: 1.25;
      }

      :deep(h1) {
        font-size: 2em;
      }
      :deep(h2) {
        font-size: 1.5em;
      }
      :deep(h3) {
        font-size: 1.25em;
      }
      :deep(h4) {
        font-size: 1em;
      }
      :deep(h5) {
        font-size: 0.875em;
      }
      :deep(h6) {
        font-size: 0.85em;
      }

      :deep(p) {
        margin: 8px 0;
        line-height: 1.6;
      }

      :deep(code) {
        background-color: #f6f8fa;
        padding: 2px 4px;
        border-radius: 3px;
        font-family: 'Courier New', monospace;
        font-size: 0.9em;
      }

      :deep(pre) {
        background-color: #f6f8fa;
        padding: 16px;
        border-radius: 6px;
        overflow-x: auto;
        margin: 16px 0;

        code {
          background: none;
          padding: 0;
        }
      }

      :deep(blockquote) {
        border-left: 4px solid #dfe2e5;
        padding-left: 16px;
        margin: 16px 0;
        color: #6a737d;
      }

      :deep(ul),
      :deep(ol) {
        padding-left: 24px;
        margin: 8px 0;
      }

      :deep(li) {
        margin: 4px 0;
      }

      :deep(table) {
        border-collapse: collapse;
        width: 100%;
        margin: 16px 0;

        th,
        td {
          border: 1px solid #dfe2e5;
          padding: 8px 12px;
          text-align: left;
        }

        th {
          background-color: #f6f8fa;
          font-weight: 600;
        }
      }

      :deep(a) {
        color: #0366d6;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }

      :deep(strong) {
        font-weight: 600;
      }
      :deep(em) {
        font-style: italic;
      }
    }
  }

  .tools {
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 40px;

    .el-icon {
      margin-right: 10px;
      cursor: pointer;
    }
  }
</style>
