<template>
  <div class="navbar">
    <el-menu mode="horizontal" class="main-menu">
      <el-menu-item index="1" @click="navigateTo('/dashboard')">
        <el-icon class="el-icon-house" />
        <span>首页</span>
      </el-menu-item>
      <el-submenu v-if="isAdmin" index="cnm">
        <template slot="title">
          <el-icon class="el-icon-s-check" />
          <span>管理员功能</span>
        </template>
        <el-menu-item index="cnm-1" @click="navigateTo('/admin/user-con')">
          <el-icon class="el-icon-user" />
          <span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="cnm-2" @click="navigateTo('/admin/launch-varn')">
          <el-icon class="el-icon-bell" />
          <span>发布预警</span>
        </el-menu-item>
        <el-menu-item index="cnm-3" @click="navigateTo('/admin/deal-feedback')">
          <el-icon class="el-icon-edit-outline" />
          <span>处理反馈</span>
        </el-menu-item>
        <el-menu-item index="cnm-4" @click="navigateTo('/admin/launch-notice')">
          <el-icon class="el-icon-s-opportunity" />
          <span>发布公告</span>
        </el-menu-item>
      </el-submenu>
      <el-menu-item index="2" @click="navigateTo('/notice/digests')">
        <el-icon class="el-icon-chat-dot-square" />
        <span>公告</span>
      </el-menu-item>
      <el-submenu index="3">
        <template slot="title">
          <el-icon class="el-icon-s-check" />
          <span>个人</span>
        </template>
        <el-menu-item index="3-1" @click="navigateTo('/user/profile')">
          <el-icon class="el-icon-s-custom" />
          <span>用户信息</span>
        </el-menu-item>
        <el-menu-item index="3-2" @click="navigateTo('/user/changePassword')">
          <el-icon class="el-icon-setting" />
          <span>修改密码</span>
        </el-menu-item>
        <el-menu-item index="3-3" @click="navigateTo('/user/citySubscribe')">
          <el-icon class="el-icon-location-outline" />
          <span>灾害订阅</span>
        </el-menu-item>
        <el-menu-item index="3-4" @click="navigateTo('/user/feedback')">
          <el-icon class="el-icon-s-promotion" />
          <span>反馈</span>
        </el-menu-item>
      </el-submenu>
      <el-menu-item index="4" @click="navigateTo('/city/index')">
        <el-icon class="el-icon-school" />
        <span>城市</span>
      </el-menu-item>
      <el-menu-item index="5" @click="navigateTo('/map/index')">
        <el-icon class="el-icon-map-location" />
        <span>地图</span>
      </el-menu-item>
      <div class="right-menu">
        <el-dropdown class="avatar-container" trigger="click">
          <div class="avatar-wrapper">
            <el-avatar :src="avatar" />
            <i class="el-icon-caret-bottom" />
          </div>
          <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <el-dropdown-item @click.native="navigateTo('/dashboard')">
              家
            </el-dropdown-item>
            <el-dropdown-item @click.native="navigateTo('/user/profile')">
              个人信息管理
            </el-dropdown-item>
            <el-dropdown-item @click.native="navigateTo('/user/feedback')">
              反馈
            </el-dropdown-item>
            <a target="_blank" href="https://github.com/hztBUAA/weather-us">
              <el-dropdown-item>Github</el-dropdown-item>
            </a>
            <el-dropdown-item v-if="isLoggedIn" divided @click.native="logout">
              <span style="display:block;">Log Out</span>
            </el-dropdown-item>
            <el-dropdown-item v-else @click.native="login">
              <span style="display:block;">Log In</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-menu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'

export default {
  data() {
    return {
      isAdminFlag: false
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ]),
    isLoggedIn() {
      return this.$store.getters.token !== undefined
    },
    isAdmin() {
      return this.isAdminFlag
    }
  },
  async created() {
    const token = getToken()
    if (token) {
      const hasGetUserInfo = this.$store.getters.avatar
      if (!hasGetUserInfo) {
        await this.$store.dispatch('user/getInfo')
      }
      const role = token === 'true' ? 'admin' : 'user'
      if (role === 'admin') {
        this.isAdminFlag = true
      }
    }
  },
  methods: {
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    login() {
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      this.$message({
        message: '请登录您的账号',
        type: 'warning', // 消息类型，可以是 'success', 'info', 'warning', 'error'
        duration: 1000, // 消息显示的持续时间，单位是毫秒
        showClose: true // 是否显示关闭按钮
      })
    },
    navigateTo(path) {
      this.$router.push(path)
    },
    goToUserProfile() {
      this.navigateTo('/user/profile')
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    login() {
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      this.$message({
        message: '请登录您的账号',
        type: 'warning',
        duration: 1000,
        showClose: true
      })
    },
    goToFeedback() {
      this.navigateTo('/user/feedback')
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          // width: 40px;
          height: 10px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}

.main-menu {
  /* display: flex; */
  /* flex-wrap: wrap; */
  justify-content: start;
  padding: 0;
}

.main-menu .el-menu-item,
.main-menu .el-submenu {
  flex: 1;
  text-align: center;
  min-width: 120px; /* Set a minimum width for each menu item */
}

@media (max-width: 768px) {
  .main-menu {
    flex-direction: row;
    display: flex;
    flex-wrap: wrap;
  }
  .main-menu .el-menu-item,
.main-menu .el-submenu {
  flex: 1;
  text-align: center;
  padding: 0px;
  min-width: 30px; /* Set a minimum width for each menu item */
}
}
</style>
