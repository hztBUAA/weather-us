<template>
  <div :class="{'has-logo': showLogo}" class="top-bar">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper-horizontal">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="horizontal"
      >
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
import { getToken } from '@/utils/auth'

export default {
  components: { SidebarItem, Logo },
  data() {
    return {
      role: getToken() === 'true' ? 'admin' : 'user'
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      return this.$router.options.routes.filter((route) => {
        if (route.meta && route.meta.roles) {
          return route.meta.roles.includes(this.role)
        }
        return true
      })
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>

<style scoped>
.top-bar {
  display: flex;
  align-items: center;
  height: 60px; /* 根据需要调整高度 */
  background-color: #fff; /* 根据需要调整背景色 */
}

.scrollbar-wrapper-horizontal {
  flex: 1;
  overflow: auto;
}

.el-scrollbar__wrap {
  overflow-x: auto !important;
  overflow-y: hidden !important;
  white-space: nowrap;
}

.el-menu--horizontal {
  line-height: 60px; /* 确保菜单项垂直居中 */
}
</style>
