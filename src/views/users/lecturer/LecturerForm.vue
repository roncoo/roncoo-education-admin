<template>
  <el-dialog :append-to-body="true" :model-value="visible" :title="formModel.id ? '修改' : '添加'" width="1000px" center align-center :destroy-on-close="true" @close="onClose">
    <el-form ref="formRef" :model="formModel" :rules="rules" label-width="60px" @submit.prevent>
      <el-row>
        <el-col :span="12">
          <el-form-item class="form-group" label="名称" prop="lecturerName">
            <el-input v-model="formModel.lecturerName" maxlength="20" show-word-limit></el-input>
          </el-form-item>
          <el-form-item class="form-group" label="职位" prop="lecturerPosition">
            <el-input v-model="formModel.lecturerPosition" maxlength="20" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input-number v-model="formModel.sort"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item class="form-group" prop="lecturerHead">
            <selector-image v-model="formModel.lecturerHead" :width="'120px'" :height="'120px'" :sug-img="'尺寸：120x120px，格式：JPG、PNG，大小：<2M'" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="简介" prop="introduce">
        <editor v-model="formModel.introduce" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose()">取消</el-button>
        <el-button type="primary" @click="onSubmit()">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
  import { ElMessage } from 'element-plus'
  import { reactive, ref } from 'vue'
  import Editor from '@/components/Editor/index.vue'
  import { usersApi } from '@/api/users'
  import SelectorImage from '@/components/Selector/Image/index.vue'

  // 规则
  const formRef = ref()
  const rules = {
    lecturerName: [{ required: true, message: '不能为空', trigger: 'blur' }],
    lecturerPosition: [{ required: true, message: '不能为空', trigger: 'blur' }],
    introduce: [{ required: true, message: '不能为空', trigger: 'blur' }]
  }

  // 表单
  const emit = defineEmits(['refresh'])
  const loading = ref(false)
  const formDefault = {
    id: undefined,
    lecturerName: undefined,
    lecturerPosition: undefined,
    lecturerHead: undefined,
    introduce: undefined,
    sort: 1
  }
  const formModel = reactive({ ...formDefault })
  const onSubmit = async () => {
    // 校验
    const valid = await formRef.value.validate()
    if (!valid) return
    if (loading.value === true) {
      ElMessage.warning('正在处理...')
      return
    }

    loading.value = true
    try {
      if (formModel.id) {
        await usersApi.lecturerEdit(formModel)
        ElMessage.success('修改成功')
      } else {
        await usersApi.lecturerSave(formModel)
        ElMessage.success('添加成功')
      }
      emit('refresh')
      onClose()
    } finally {
      loading.value = false
    }
  }

  // 打开和关闭
  const visible = ref(false)
  const onOpen = (item) => {
    if (item) {
      console.log(item)
      usersApi.lecturerView({ id: item.id }).then((res) => {
        Object.assign(formModel, res)
      })
    }
    visible.value = true
  }
  defineExpose({ onOpen })
  const onClose = () => {
    Object.assign(formModel, formDefault)
    visible.value = false
  }
</script>
