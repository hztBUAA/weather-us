<script>
import { updateAvatarService } from '@/api/user'
import { Message } from 'element-ui'

export default {
  data() {
    return {
      user: { },
      usernameReadOnly: true
    }
  },
  mounted() {
    this.loadInfo()
    // Message.success(result.msg)
  },
  methods: {
    async loadInfo() {
      this.user = await this.$store.dispatch('user/getInfo')
    },
    checkAvatar(file) {
      if (!/^image\/.+/.test(file.type)) {
        Message.error('只接受图片')
        return false
      } else if (file.size / 1024 / 1024 > 2) {
        Message.error('图片大小不应超过2MB')
        return false
      }
      return true
    },
    async uploadAvatar(upload) {
      const avatar = { avatar: upload.file }
      const result = await updateAvatarService(avatar)
      Message.success(result.msg)
      await this.loadInfo()
    }
  }
}
</script>

<template>
  <el-card>
    <el-form label-position="right" label-width="60px">
      <el-form-item label="用户名">
        {{ user.username }}
      </el-form-item>
      <el-form-item label="头像">
        <el-upload
          class="avatar-uploader"
          action=""
          :show-file-list="false"
          :http-request="uploadAvatar"
          :before-upload="checkAvatar"
          accept="image/*"
        >
          <img :src="user.avatar" class="avatar" title="更换头像" alt="头像">
        </el-upload>
      </el-form-item>
      <!-- todo: 等之后注册加入邮箱或者手机再进行显示 -->
      <!--      <el-form-item label="手机号">-->
      <!--        {{ user.phone || "无" }}-->
      <!--      </el-form-item>-->
      <el-form-item label="邮箱">
        {{ user.email }}
      </el-form-item>
    </el-form>
  </el-card>
</template>

<style lang="scss" scoped>
::v-deep {
  .avatar-uploader .el-upload {
    //border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
    border-radius: 50%;
  }
}
</style>
