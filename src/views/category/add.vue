<template>
  <el-dialog
    :append-to-body="true"
    :before-close="handleClose"
    :close-on-press-escape="false"
    :custom-class="form.parentId == 0 ? 'categoryParentEdit' : 'categoryAdd'"
    :title="title"
    :visible.sync="visible"
    :width="form.parentId == 0 ? '500px' : '1200px'"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-row v-if="form.parentId == 0">
        <el-form-item class="form-group" label="名称" prop="categoryName">
          <el-input v-model="form.categoryName"/>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="1" controls-position="right"/>
        </el-form-item>
      </el-row>
      <el-row v-if="form.parentId != 0">
        <el-col :span="12">
          <el-form-item class="form-group" label="名称" prop="categoryName">
            <el-input v-model="form.categoryName"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排序" prop="sort">
            <el-input-number v-model="form.sort" :min="1" controls-position="right"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item v-if="form.parentId !=0" label="内容" prop="content">
        <wangeditor v-model="form.content"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="handleClose">取 消</el-button>
      <el-button size="mini" type="primary" @click="submitForm('form')">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {categorySave} from '@/api/category'
import Wangeditor from '@/components/Wangeditor/index.vue';

export default {
  name: 'AddCategory',
  components: {Wangeditor},
  props: {
    title: {
      type: String,
      default: null
    },
    visible: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: () => {
      }
    }
  },
  data() {
    return {
      form: {},
      opts: {},
      rules: {
        categoryName: [{required: true, message: '请输入名称', trigger: 'blur'}]
      }
    }
  },
  watch: {
    visible: function (val) {
      if (val) {
        this.form.parentId = this.info.parentId;
        this.form.examCategoryType = this.info.examCategoryType
        this.form.categoryType = this.info.categoryType;
        this.form.sort = this.info.sort;
      }
    }
  },
  mounted() {
  },
  methods: {
    handleClose() {
      this.$emit('close-callback');
      setTimeout(() => {
        this.form = {};
      }, 1000)
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.onSubmit()
        } else {
          return false;
        }
      })
    },
    onSubmit() {
      this.loading.show()
      // 新增
      categorySave(this.form).then(res => {
        this.loading.hide()
        this.tips(res.data, 'success');
        this.handleClose();
      }).catch(() => {
        this.loading.hide()
      })
    }
  }
}
</script>
<style>
.categoryAdd {
  transform: none !important;
  margin: -300px 0 0 -600px !important;
}
</style>
