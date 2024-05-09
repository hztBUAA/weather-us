<script>
import { getInfo, updateAvatarService } from '@/api/user'
import { Message } from 'element-ui'

export default {
  data() {
    return {
      user: {
        username: '蒋世祺',
        avatar:
          'https://jsq-big-event.oss-cn-beijing.aliyuncs.com/4dadcc17-c0da-4efc-975d-13dfc2a1cad8.jpg'
      },
      usernameReadOnly: true
    }
  },
  mounted() {
    console.log(process.env.NODE_ENV)
    this.loadInfo()
    // Message.success(result.msg)
  },
  methods: {
    async loadInfo() {
      const result = await getInfo()
      this.user = result.data
    },
    checkAvatar(file) {
      if (!/^image\/.+/.test(file.type)) {
        Message.error('只接受图片')
        return false
      } else if (file.size / 1024 / 1024 > 2) {
        Message.error('图片大小不应超过2MB')
        return false
      }
      console.log(file.type)
      return true
    },
    async uploadAvatar(upload) {
      const avatar = upload.file
      console.log(upload)
      const result = await updateAvatarService(avatar)
      Message.success(result.msg)
      this.loadInfo()
    }
  }
}
</script>

<template>
  <el-card>
    <el-form>
      <el-form-item label="用户名">
        {{ user.username }}
      </el-form-item>
      <el-form-item label="头像">
        <!-- todo: 调用上传文件接口, 成功后更新 store 内容 -->
        <!--        <el-upload-->
        <!--          class="avatar-uploader"-->
        <!--          action=""-->
        <!--          :show-file-list="false"-->
        <!--          :http-request="uploadAvatar"-->
        <!--          :before-upload="checkAvatar"-->
        <!--          accept="image/*"-->
        <!--        >-->
        <img :src="defaultAvatar" class="avatar" title="更换头像" alt="头像">
        <!--        </el-upload>-->
      </el-form-item>
    </el-form>
  </el-card>
</template>

<style lang="scss" scoped>
::v-deep {
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
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
  }
}
</style>
