<template>
    <el-dialog
            :title="title"
            v-model="visible"
            width="600px"
            center
            :before-close="handleClose"
    >
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
            <el-form-item label="用户昵称" prop="nickname">
                <el-input v-model="form.nickname" class="form-group" maxlength="50" show-word-limit/>
            </el-form-item>
            <el-form-item label="登录账号" prop="loginName">
                <el-input v-model="form.loginName" class="form-group" maxlength="50" show-word-limit/>
            </el-form-item>
            <el-form-item label="登录密码" prop="loginPwd">
                <el-input v-model="form.loginPwd" type="password" class="form-group"/>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
                <el-input v-model="form.confirmPassword" type="password" class="form-group"/>
            </el-form-item>
            <el-form-item label="过期时间" prop="expiredTime">
              <el-date-picker v-model="form.expiredTime" placeholder="请选择过期时间" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"/>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input v-model="form.remark" type="textarea" class="form-group" maxlength="500" show-word-limit/>
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
    import {sysUserSave} from '@/api/system'

    export default {
        name: 'AddSysUser',
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
                opts: {},
                rules: {
                    nickname: [
                        {required: true, message: '请输入昵称', trigger: 'blur'}
                    ],
                    loginName: [
                        {required: true, message: '请输入登录账号', trigger: 'blur'}
                    ],
                    loginPwd: [
                        {required: true, message: '请输入登录密码', trigger: 'blur'}
                    ],
                    confirmPassword: [
                        {required: true,validator: validateConfirmPassword, trigger: 'blur'}
                    ],
                    expiredTime: [
                        {required:true, message: '请选择过期时间', trigger: 'blur'}
                    ]
                }
            }
        },
        emits: ['closes'],
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
                // 新增
                sysUserSave(this.form).then(res => {
                    this.$message.success(res, 'success');
                    this.$emit('closes', 'success')
                }).catch(() => {
                })
            }
        }
    }
</script>

