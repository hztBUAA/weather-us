<template>
  <div>
    <el-menu mode="horizontal" class="main-menu">
      <el-menu-item index="1">
        <router-link to="/dashboard">
          <el-icon class="el-icon-house" />
          <span>首页</span>
        </router-link>
      </el-menu-item>
      <el-menu-item index="2">
        <router-link to="/notice/digests">
          <el-icon class="el-icon-chat-dot-square" />
          <span>公告</span>
        </router-link>
      </el-menu-item>
      <el-submenu index="3">
        <template slot="title">
          <el-icon class="el-icon-s-check" />
          <span>个人</span>
        </template>
        <el-menu-item index="3-1">
          <router-link to="/user/profile">
            <el-icon class="el-icon-s-custom" />
            <span>用户信息</span>
          </router-link>
        </el-menu-item>
        <el-menu-item index="3-2">
          <router-link to="/user/changePassword">
            <el-icon class="el-icon-setting" />
            <span>修改密码</span>
          </router-link>
        </el-menu-item>
        <el-menu-item index="3-3">
          <router-link to="/user/citySubscribe">
            <el-icon class="el-icon-location-outline" />
            <span>灾害订阅</span>
          </router-link>
        </el-menu-item>
        <el-menu-item index="3-4">
          <router-link to="/user/feedback">
            <el-icon class="el-icon-s-promotion" />
            <span>反馈</span>
          </router-link>
        </el-menu-item>
      </el-submenu>
      <el-menu-item index="4">
        <router-link to="/city/index">
          <el-icon class="el-icon-school" />
          <span>城市</span>
        </router-link>
      </el-menu-item>
      <el-menu-item index="5">
        <router-link to="/map/index">
          <el-icon class="el-icon-map-location" />
          <span>地图</span>
        </router-link>
      </el-menu-item>
    </el-menu>
    <!-- <el-button class="burger-menu" icon="el-icon-menu" @click="toggleMenu"></el-button> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  methods: {
  }
}
</script>

<style>
.main-menu {
  /* display: flex; */
  /* flex-wrap: wrap; */
  justify-content: start;
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
  padding: 5px;
  min-width: 30px; /* Set a minimum width for each menu item */
}
}
</style>
