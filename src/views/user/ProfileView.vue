<script>
import { getInfo } from '@/api/user'
import { Message } from 'element-ui'

export default {
  data() {
    return {
      user: {
        username: '蒋世祺',
        avatar:
          'https://jsq-big-event.oss-cn-beijing.aliyuncs.com/4dadcc17-c0da-4efc-975d-13dfc2a1cad8.jpg',
        phone: 10000,
        email: ''
      },
      usernameReadOnly: true
    }
  },
  async mounted() {
    const result = await getInfo()
    this.user = result.data
    Message.success(result.msg)
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
        <!-- todo: 调用上传文件接口, 对文件的校验 -->
        <el-upload class="avatar-uploader" :show-file-list="false" action="">
          <img :src="user.avatar" class="avatar" title="更换头像" alt="头像">
        </el-upload>
      </el-form-item>
      <el-form-item label="手机号">
        {{ user.phone }}
      </el-form-item>
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
