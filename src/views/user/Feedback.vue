<script >

import { addFeedbackService, getUserFeedbackService } from '@/api/user'
import { Message } from 'element-ui'

export default {
  data() {
    return {
      pageSize: 10,
      pageNum: 1,
      feedbacks: [],
      filterFeedbacks: [],
      dialogVisible: false,
      formVisible: false,
      feedback: {}
    }
  },
  computed: {
    pageFeedbacks() {
      return this.filterFeedbacks.slice((this.pageNum - 1) * this.pageSize, this.pageNum * this.pageSize)
    },
    total() {
      return this.filterFeedbacks.length
    }
  },
  mounted() {
    this.loadFeedbacks()
  },
  methods: {
    async loadFeedbacks() {
      const result = await getUserFeedbackService()
      this.filterFeedbacks = this.feedbacks = result.data
    },
    handleFilter(column) {
      const filters = column.status
      this.filterFeedbacks = this.feedbacks.filter((feedback) => filters.length === 0 ? true : filters.indexOf(feedback.status) !== -1)
    },
    showFeedback(row) {
      this.dialogVisible = true
      this.feedback = {
        title: row.title,
        content: row.content,
        reply: row.reply,
        status: row.status,
        updateTime: row.updateTime
      }
    },
    showForm() {
      this.formVisible = true
      this.feedback = {}
      this.$nextTick(() => {
        this.$refs.feedbackForm.clearValidate()
      })
    },
    submit() {
      this.$refs.feedbackForm.validate(async valid => {
        if (valid) {
          const result = await addFeedbackService(this.feedback)
          this.formVisible = false
          Message.success(result.msg)
          this.$refs.feedbackTable.clearFilter()
          this.loadFeedbacks()
        }
      })
    }
  }
}

</script>

<template>
  <el-card>
    <template v-slot:header>
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <span> 反馈</span>
        <el-button type="primary" @click="showForm">新增订阅</el-button>
      </div>
    </template>
    <el-table
      ref="feedbackTable"
      :data="pageFeedbacks"
      style="width: 100%;"
      border
      stripe
      @filter-change="handleFilter"
    >
      <el-table-column label="反馈时间" sortable column-key="updateTime" prop="updateTime">
        <template slot-scope="{row}">
          <i class="el-icon-time" />
          <span style="margin-left: 10px">{{ row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="反馈标题">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        width="180"
        column-key="status"
        :filters="[{ text: '已处理', value: '已处理' }, { text: '未处理', value: '未处理' }]"
      >
        <template slot-scope="{row}">
          <el-tag :type="row.status === '已处理' ? 'primary' : 'success'" disable-transitions>{{
            row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button size="mini" @click="showFeedback(row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="pageNum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="(val) => pageSize = val"
      @current-change="(val) => pageNum = val"
    />
    <el-dialog :visible.sync="formVisible" title="新增反馈" width="40%">
      <el-form ref="feedbackForm" :model="feedback" label-position="left" label-width="50px">
        <el-form-item label="标题" prop="title" :rules="[{required:true, message: '请输入标题', trigger: 'blur'}]">
          <el-input v-model="feedback.title" />
        </el-form-item>
        <el-form-item label="内容" prop="content" :rules="[{required:true, message: '请输入内容', trigger: 'blur'}]">
          <el-input v-model="feedback.content" type="textarea" :autosize="{minRows: 2}" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">
            提交反馈
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible" width="40%">
      <template slot="title">
        <div style="display: flex;justify-content: space-between">
          <h3 style="align-self: center;">
            {{ feedback.title }}
          </h3>
          <el-tag :type="feedback.status === '已处理' ? 'primary' : 'success'" disable-transitions style="margin-right: 20px;align-self: center">{{
            feedback.status }}</el-tag>
        </div>
        <hr style="margin: 0">
      </template>
      <template slot="default">
        <p style="font-size: 17px;color: #606266;text-indent: 2em">
          {{ feedback.content }}
        </p>

        <hr>
        <h4>回复</h4>
        <p style="font-size: 17px;color: #606266;text-indent: 2em">
          {{ feedback.reply }}
        </p>
      </template>

      <template slot="footer">
        <span style="color: #606266;font-size: 14px">
          {{ feedback.updateTime }}
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<style scoped>

</style>
