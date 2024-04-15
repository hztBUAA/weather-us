<script>
import { changePasswordService } from '@/api/user'
import { Message } from 'element-ui'

export default {
  data() {
    const patterRule = {
      pattern: /^\S{6,15}/,
      trigger: 'blur',
      message: '请输入6到15为非空字符'
    }
    const checkRePassword = (rule, value, callback) => {
      if (value !== this.form.newPassword) {
        callback(new Error('请确保两次输入密码一致'))
      } else {
        callback()
      }
    }
    return {
      form: {
        oldPassword: '',
        newPassword: '',
        rePassword: ''
      },
      rules: {
        oldPassword: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入原始密码'
          },
          patterRule
        ],
        newPassword: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入新密码'
          },
          patterRule
        ],
        rePassword: [
          {
            required: true,
            trigger: 'blur',
            message: '请重复新密码'
          },
          patterRule,
          {
            validator: checkRePassword,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    submit() {
      console.log(this.$refs['form'])
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          const result = await changePasswordService(this.form)
          Message.success(result.msg)
        }
      })
    }
  }
}
</script>

<template>
  <el-card>
    <el-form
      ref="form"
      :model="form"
      label-position="right"
      label-width="100px"
      :rules="rules"
      size="medium"
      style="width: 400px"
    >
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input v-model="form.oldPassword" show-password placeholder="请输入旧密码" />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="form.newPassword" show-password placeholder="请输入新密码" />
      </el-form-item>
      <el-form-item label="确认新密码" prop="rePassword">
        <el-input v-model="form.rePassword" show-password placeholder="请重复新密码" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width: 100%" @click="submit">修改密码</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<style scoped></style>
