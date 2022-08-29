<template>
    <el-dialog
            :title="title"
            v-model="visible"
            width="600px"
            center
            :before-close="handleClose"
    >
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
            <el-form-item label="登录密码" prop="loginPwd">
                <el-input v-model="form.loginPwd" type="password" class="form-group"/>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
                <el-input v-model="form.confirmPassword" type="password" class="form-group"/>
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
    import {sysUserUpdatePassword} from '@/api/system';

    export default {
        name: 'ResetPasswordSysUser',
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
            const validateConfirmPassword = (rule, value, callback) => {
                if (value === undefined || value === null || value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.form.loginPwd !== value) {
                        callback(new Error('登录密码和确认密码不一致'));
                    }
                    callback();
                }
            };
            return {
                form: {},
                rules: {
                    loginPwd: [
                        {required: true, message: '请输入登录密码', trigger: 'blur'}
                    ],
                    confirmPassword: [
                        {required: true, validator: validateConfirmPassword, trigger: 'blur'}
                    ]
                }
            }
        },
        emits: ['closes'],
        mounted() {
            this.form.id = this.info.id;
        },
        methods: {
            handleClose() {
                this.form = {};
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
                sysUserUpdatePassword(this.form).then(res => {
                    this.loading.hide()
                    this.$message.success(res, 'success')
                    this.$emit('closes', 'success')
                }).catch(() => {
                    this.loading.hide()
                })
            }
        }
    }
</script>

