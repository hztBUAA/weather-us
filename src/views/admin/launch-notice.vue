<template>
  <div class="app-container">
    <el-input v-model="title" placeholder="请输入标题" style="margin-top: 10px;margin-bottom: 10px;" />
    <div style="margin-bottom: 10px;">
      <el-radio-group v-model="tag">
        <el-radio-button label="BUG修复" />
        <el-radio-button label="新特性发布" />
        <el-radio-button label="日常事务" />
      </el-radio-group>
    </div>
    <tinymce v-model="content" :height="300" />
    <el-button style="margin-top: 10px;" type="primary" @click="handle_submit">上传</el-button>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { launchNotice } from '@/api/notice'
import { title } from '@/settings'
export default {
  components: {
    Tinymce
  },
  data() {
    return {
      title: '',
      content: '',
      tag: ''
    }
  },
  methods: {
    handle_submit() {
      if (!this.title || !this.content || !this.tag) {
        this.$message.error('标题、内容和标签不能为空')
        return
      }
      launchNotice(this.title, this.tag, this.content).then(() => {
        this.$message.success('发布成功')
        setTimeout(() => {
          tinymce.activeEditor.isNotDirty = true
          window.location.reload()
        }, 1000) // 等待2秒后刷新页面
      }).catch((error) => {
        // 处理发布失败的情况（可选）
        console.error('发布公告失败:', error)
        this.$message.error('发布公告时发生错误，请稍后再试')
      })
    }
  }
}
</script>
