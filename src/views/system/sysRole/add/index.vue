<template>
    <el-dialog
            :title="title"
            :model-value="visible"
            width="600px"
            center
            :before-close="handleClose"
    >
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
            <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="form.roleName" class="form-group" maxlength="50" show-word-limit/>
            </el-form-item>
            <!-- <el-form-item label="角色标识" prop="roleValue">
                <el-input v-model="form.roleValue" class="form-group" placeholder="创建后不允许编辑" maxlength="50" show-word-limit/>
            </el-form-item> -->
            <el-form-item label="备注">
                <el-input v-model="form.remark" class="form-group" type="textarea" maxlength="500" show-word-limit/>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
                <el-input-number v-model="form.sort" controls-position="right" :min="0"/>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button  @click="handleClose">取 消</el-button>
                <el-button  type="primary" @click="submitForm('form')">确 定</el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script>
    import {sysRoleSave} from '@/api/system'

    export default {
        name: 'AddSysRole',
        props: {
            title: {
                type: String,
                default: null
            },
            visible: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                form: {
                  sort:1
                },
                opts: {},
                rules: {
                    roleName: [
                        {required: true, message: '请输入角色名称', trigger: 'blur'}
                    ],
                    // roleValue: [
                    //     {required: true, message: '请输入角色标识', trigger: 'blur'}
                    // ]
                }
            }
        },
        emits: ['closes'],
        methods: {
            handleClose() {
                this.form = {
                  sort:1
                };
                this.$emit('closes');
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
                sysRoleSave(this.form).then(res => {
                    this.loading.hide()
                    this.$message.success(res, "success");
                    this.$emit('closes', 'success')
                }).catch(() => {
                    this.loading.hide()
                })
            }
        }
    }
</script>
