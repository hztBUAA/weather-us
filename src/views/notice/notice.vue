<template>
  <div>
    <div style="margin-left: 20px;margin-top: 20px;">
      <el-table
        :data="tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
        style="width: 100%;"
        border
        :row-class-name="tableRowClassName"
        @row-click="handleRowClick"
      >
        <el-table-column label="发布时间" width="180" sortable column-key="date" prop="date">
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span style="margin-left: 10px">{{ scope.row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="tag"
          label="状态"
          width="180"
          :filters="[{ text: '已读', value: '已读' }, { text: '未读', value: '未读' }]"
          :filter-method="filterState"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            <el-tag :type="scope.row.state === '已读' ? 'primary' : 'success'" disable-transitions>{{
              scope.row.state }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="公告标题" width="360">
          <template slot-scope="scope">
            <span style="font-weight: bolder;">{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="tag"
          label="标签"
          width="180"
          :filters="[{ text: 'BUG修复', value: 'BUG修复' }, { text: '新特性发布', value: '新特性发布' }, { text: '日常事务', value: '日常事务' }]"
          :filter-method="filterTag"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.tag === 'BUG修复' ?
                'warning' : (scope.row.tag === '新特性发布' ? 'info' : '')"
              disable-transitions
              effect="dark"
            >
              {{ scope.row.tag }}</el-tag>
          </template>
        </el-table-column>
        <!--        <el-table-column label="操作">-->
        <!--          <template slot-scope="scope">-->
        <!--            <el-button-->
        <!--              v-if="isAdmin"-->
        <!--              size="mini"-->
        <!--              @click.naive.stop="handleEdit(scope.$index, scope.row)"-->
        <!--            >编辑</el-button>-->
        <!--            <el-button-->
        <!--              v-if="isAdmin"-->
        <!--              size="mini"-->
        <!--              type="danger"-->
        <!--              @click.naive.stop="handleDelete(scope.$index, scope.row)"-->
        <!--            >删除</el-button>-->
        <!--            <el-button-->
        <!--              size="mini"-->
        <!--              type="info"-->
        <!--              @click.naive.stop="handleUnread(scope.$index, scope.row)"-->
        <!--            >未读</el-button>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
      </el-table>
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[10, 20, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleDialogClose"
      style="max-height: 700px;overflow:auto;"
    >
      <h1>{{ selectedRow.title }}</h1>
      <el-divider />
      <div class="dialog-content" v-html="content" />
    </el-dialog>
  </div>
</template>

<script>
import { getNoticeContent, getNoticeDigests, setNoticeState } from '@/api/notice'
export default {
  data() {
    return {
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      isAdmin: true,
      dialogVisible: false, // 控制对话框显示的变量
      content: null, // 用于存储被点击行的数据
      selectedRow: {}
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      const res = await getNoticeDigests()
      this.tableData = res.data
      this.tableData.forEach((item) => {
        item.state = item.state ? '已读' : '未读'
      })
    },
    handleEdit(index, row) {
      console.log(index, row)
    },
    handleDelete(index, row) {
      console.log(index, row)
    },
    filterTag(value, row) {
      return row.tag === value
    },
    filterState(value, row) {
      return row.state === value
    },
    filterHandler(value, row, column) {
      const property = column['property']
      return row[property] === value
    },
    handleSizeChange(newPageSize) {
      this.pageSize = newPageSize
      this.currentPage = 1 // 当改变每页显示数量时，重置为第一页
    },

    handleCurrentChange(newCurrentPage) {
      this.currentPage = newCurrentPage
    },
    async handleRowClick(row, event, column) {
      if (row.state !== '已读') {
        row.state = '已读'
        setNoticeState(row.id, row.state)
      }
      const response = await getNoticeContent(row.id)// 帖子id
      this.selectedRow = row
      this.content = response.data.content
      this.dialogVisible = true
    },
    handleDialogClose() {
      this.dialogVisible = false
      this.selectedRow = {}
      this.content = null
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.state === '已读') {
        return 'success-row'
      } else {
        return ''
      }
    },
    handleUnread(index, row) {
      // 更新点击行的状态为未读
      if (row.state !== '未读') {
        row.state = '未读'
        setNoticeState(row.id, row.state)
      }
    },
    readDetail() {
      alert('fuck')
    }
  }
}
</script>
<style>
.el-table .success-row {
    /* background: oldlace; */
    background: aliceblue;
}
</style>
