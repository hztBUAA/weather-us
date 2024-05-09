<template>
  <div>

    <el-row class="login-page">
      <el-col :span="12" :offset="9" class="form" style="height: 100%">
        <el-form v-show="isRegister" ref="registerForm" status-icon :model="userData" :rules="rules" style="width: 50%">
          <el-form-item>
            <h1>注册</h1>
          </el-form-item>
          <el-form-item prop="username">
            <el-input
              v-model="userData.username"
              placeholder="请输入用户名"
              name="username"
              prefix-icon="el-icon-user"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="userData.password"
              placeholder="请输入密码"
              prefix-icon="el-icon-lock"
              show-password
            />
          </el-form-item>
          <el-form-item prop="rePassword">
            <el-input
              v-model="userData.rePassword"
              placeholder="请重复密码"
              prefix-icon="el-icon-lock"
              show-password
              @keyup.enter.native="handleRegister"
            />
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading" class="button" type="primary" @click="handleRegister">
              注册
            </el-button>
          </el-form-item>
          <el-form-item class="flex">
            <el-link type="info" :underline="false" @click="isRegister = false">
              ← 返回
            </el-link>
          </el-form-item>
        </el-form>
        <el-form v-show="!isRegister" ref="loginForm" status-icon :model="userData" :rules="rules" style="width: 50%">
          <el-form-item>
            <h1>登录</h1>
          </el-form-item>
          <el-form-item prop="username">
            <el-input
              v-model="userData.username"
              placeholder="请输入用户名"
              name="username"
              prefix-icon="el-icon-user"
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="userData.password"
              placeholder="请输入密码"
              prefix-icon="el-icon-lock"
              show-password
              @keyup.enter.native="handleLogin"
            />
          </el-form-item>

          <el-form-item>
            <el-button :loading="loading" class="button" type="primary" @click="handleLogin">
              登录
            </el-button>
          </el-form-item>

          <el-form-item class="flex">
            <el-link type="info" :underline="false" @click="isRegister = true">
              注册 →
            </el-link>
          </el-form-item>

        </el-form>

      </el-col>

    </el-row>
    <el-row />
  </div>
</template>

<script>
import { getCSRFTokenService, registerService } from '@/api/user'
import { Message } from 'element-ui'

export default {
  name: 'Login',
  data() {
    const checkRePassword = (rule, value, callback) => { // 必须用箭头函数
      if (!value) {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.userData.password) {
        callback(new Error('请确保两次输入密码一致'))
      } else {
        callback()
      }
    }
    return {
      isRegister: false,
      userData: { },
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            pattern: '^\\S{3,15}$',
            message: '用户名长度为 3 到 15 个非空字符',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            pattern: '^\\S{6,15}$',
            message: '密码长度为 6 到 15 个非空字符',
            trigger: 'blur'
          }
        ],
        rePassword: [
          {
            validator: checkRePassword,
            trigger: 'blur'
          }
        ]
      },
      loading: false,
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    },
    isRegister(newValue) {
      this.userData = {}
      if (newValue) {
        this.$refs.registerForm.clearValidate()
      } else {
        this.$refs.loginForm.clearValidate()
      }
    }
  },
  mounted() {
    console.log(process.env['VUE_APP_TARGET_API'])
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.userData).then(async() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleRegister() {
      this.$refs.registerForm.validate(async(valid) => {
        if (valid) {
          this.loading = true
          const result = await getCSRFTokenService()
          console.log(result)
          registerService(this.userData, result.csrf_token).then((result) => {
            Message.success(result.msg)
            this.$store.dispatch('user/login', this.userData).then(async() => {
              this.$router.push({ path: this.redirect || '/' })
              this.loading = false
            }).catch(() => {
              this.loading = false
              this.isRegister = false
            })
          }).catch(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */
/* reset element-ui css */
<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background-color: #2d3a4b;

  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;

    .title {
      margin: 0 auto;
    }

    .button {
      width: 100%;
    }

    .flex {
      width: 100%;
      display: flex;
      justify-content: flex-start;
    }
  }
}
</style>
