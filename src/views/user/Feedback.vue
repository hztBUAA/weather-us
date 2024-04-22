<script >

import { getUserFeedbackService } from '@/api/user'

export default {
  data() {
    return {
      pageSize: 10,
      pageNum: 1,
      feedbacks: [],
      filterFeedbacks: [],
      dialogVisible: false,
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
        status: row.status,
        updateTime: row.updateTime
      }
    }
  }
}

</script>

<template>
  <el-card>
    <el-table
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
      <p style="font-size: 17px;color: #606266;text-indent: 2em">
        {{ feedback.content }}
      </p>

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
