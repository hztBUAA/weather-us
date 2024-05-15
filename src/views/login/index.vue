<template>
  <div class="login-container">
    <div class="login-card">
      <div v-show="isRegister">
        <div class="title">
          注册
        </div>
        <div class="content">
          <el-form ref="registerForm" status-icon :model="userData" :rules="rules">
            <el-form-item prop="username">
              <el-input
                v-model="userData.username"
                placeholder="请输入用户名"
                name="username"
                prefix-icon="el-icon-user"
              />
            </el-form-item>
            <el-form-item prop="email">
              <el-input v-model="userData.email" placeholder="请输入邮箱" prefix-icon="el-icon-message" />
            </el-form-item>
            <el-form-item prop="verifyCode">
              <el-row :gutter="20">
                <el-col :span="18">
                  <el-input v-model="userData.verifyCode" placeholder="请输入验证码" prefix-icon="el-icon-lock" />
                </el-col>
                <el-col :span="6">
                  <el-button
                    :disabled="isDisabled"
                    style="margin-top: 0; display: flex; justify-content: center"
                    @click="start('registerForm', 'email')"
                  >{{ text.length ? text : "发送验证码" }}</el-button>
                </el-col>
              </el-row>
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
        </div>
      </div>
      <div v-show="!isRegister">
        <div class="title">
          登录
        </div>
        <div class="content">
          <el-form ref="loginForm" status-icon :model="userData" :rules="rules">
            <el-form-item prop="username">
              <el-input
                v-model="userData.uid"
                placeholder="请输入用户名或邮箱"
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
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { getCSRFTokenService, registerService, sendVerifyCodeService } from '@/api/user'
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
            pattern: /^\w{3,15}$/,
            message: '用户名由3到15个字母, 数字或下划线组成',
            trigger: 'blur'
          }
        ],
        uid: [
          {
            required: true,
            message: '请输入用户名或邮箱',
            trigger: 'blur'
          },
          {
            // 邮箱部分可能有问题
            pattern: /^\w{3,15}$|^[a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
            message: '请输入正确格式的用户名或邮箱',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            type: 'email',
            message: '请输入邮箱',
            trigger: 'blur'
          }
        ],
        verifyCode: [
          {
            required: true,
            message: '请输入验证码',
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
      redirect: undefined,
      text: '',
      timer: null,
      isDisabled: false
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
        this.$nextTick(() => {
          this.$refs.registerForm.clearValidate()
        })
      } else {
        this.$nextTick(() => {
          this.$refs.loginForm.clearValidate()
        })
      }
    }
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
          return false
        }
      })
    },
    handleRegister() {
      this.$refs.registerForm.validate(async(valid) => {
        if (valid) {
          this.loading = true
          const result = await getCSRFTokenService()
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
    },
    async start(formEl, props, time = 60) {
      formEl = this.$refs[formEl]
      if (!formEl) {
        return
      }
      console.log(formEl, props)
      const initTime = time
      await formEl.validateField(props, async errorMessage => {
        console.log(errorMessage)
        if (!errorMessage) {
          await sendVerifyCodeService({ email: this.userData.email, sendType: 'register' })
          clearInterval(this.timer)
          this.isDisabled = true
          this.text = `${time}`
          this.timer = setInterval(() => {
            if (time > 0) {
              time -= 1
              this.text = `${time}`
            } else {
              this.text = ''
              this.isDisabled = false
              clearInterval(this.timer)
              time = initTime
            }
          }, 1000)
        }
      })
    },
    end() {
      this.text = ''
      this.isDisabled = false
      clearInterval(this.timer)
    }
  }
}
</script>

/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */
/* reset element-ui css */
<style lang="scss" scoped>
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100%;
  .login-card {
    width: 480px;
    max-width: 90%;
    border-radius: 20px;
    box-shadow: 0 0 10px #dcdfe6;
    background-color: var(--el-bg-color);
    overflow: hidden;
    .title {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 150px;
      font-size: 30px;
    }
    .content {
      padding: 20px 50px 50px 50px;
      ::v-deep .el-input-group__append {
        padding: 0;
        overflow: hidden;
        .el-image {
          width: 100px;
          height: 40px;
          border-left: 0;
          user-select: none;
          cursor: pointer;
          text-align: center;
        }
      }
      .el-button {
        width: 100%;
        margin-top: 10px;
      }
    }
  }
}
</style>
