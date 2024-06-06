<template>
  <el-card>
    <template slot="header">
      <span style="font-weight: bold; font-size: 32px">公告</span>
    </template>
    <el-collapse accordion>
      <el-collapse-item v-for="notice in sortedData" :key="notice.id" :name="notice.id">
        <template slot="title">
          <div style="width: 95%; display: flex; align-items: center; justify-content: space-between">
            <span style="font-size: 24px; font-weight: 550">{{ notice.title }}</span>
            <span>
              <el-tag
                :type="notice.tag === 'BUG修复' ?
                  'warning' : (notice.tag === '新特性发布' ? 'info' : '')"
                disable-transitions
                effect="dark"
              >
                {{ notice.tag }}
              </el-tag>
              {{ notice.date }}
            </span>
          </div>
        </template>
        <div v-html="notice.content"> />
        </div></el-collapse-item>
    </el-collapse>
  </el-card>
<!--  <div>-->
<!--    <div style="margin-left: 20px;margin-top: 20px;">-->
<!--      <el-table-->
<!--        :data="sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)"-->
<!--        style="width: 100%;"-->
<!--        border-->
<!--        :row-class-name="tableRowClassName"-->
<!--        @row-click="handleRowClick"-->
<!--      >-->
<!--        <el-table-column label="发布时间" sortable column-key="date" prop="date">-->
<!--          <template slot-scope="scope">-->
<!--            <i class="el-icon-time" />-->
<!--            <span style="margin-left: 10px">{{ scope.row.date }}</span>-->
<!--          </template>-->
<!--        </el-table-column>-->

<!--        <el-table-column label="公告标题">-->
<!--          <template slot-scope="scope">-->
<!--            <span style="font-weight: bolder;">{{ scope.row.title }}</span>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column-->
<!--          prop="tag"-->
<!--          label="标签"-->
<!--          :filters="[{ text: 'BUG修复', value: 'BUG修复' }, { text: '新特性发布', value: '新特性发布' }, { text: '日常事务', value: '日常事务' }]"-->
<!--          :filter-method="filterTag"-->
<!--          filter-placement="bottom-end"-->
<!--        >-->
<!--          <template slot-scope="scope">-->
<!--            <el-tag-->
<!--              :type="scope.row.tag === 'BUG修复' ?-->
<!--                'warning' : (scope.row.tag === '新特性发布' ? 'info' : '')"-->
<!--              disable-transitions-->
<!--              effect="dark"-->
<!--            >-->
<!--              {{ scope.row.tag }}</el-tag>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        &lt;!&ndash;        <el-table-column label="操作">&ndash;&gt;-->
<!--        &lt;!&ndash;          <template slot-scope="scope">&ndash;&gt;-->
<!--        &lt;!&ndash;            <el-button&ndash;&gt;-->
<!--        &lt;!&ndash;              v-if="isAdmin"&ndash;&gt;-->
<!--        &lt;!&ndash;              size="mini"&ndash;&gt;-->
<!--        &lt;!&ndash;              @click.naive.stop="handleEdit(scope.$index, scope.row)"&ndash;&gt;-->
<!--        &lt;!&ndash;            >编辑</el-button>&ndash;&gt;-->
<!--        &lt;!&ndash;            <el-button&ndash;&gt;-->
<!--        &lt;!&ndash;              v-if="isAdmin"&ndash;&gt;-->
<!--        &lt;!&ndash;              size="mini"&ndash;&gt;-->
<!--        &lt;!&ndash;              type="danger"&ndash;&gt;-->
<!--        &lt;!&ndash;              @click.naive.stop="handleDelete(scope.$index, scope.row)"&ndash;&gt;-->
<!--        &lt;!&ndash;            >删除</el-button>&ndash;&gt;-->
<!--        &lt;!&ndash;            <el-button&ndash;&gt;-->
<!--        &lt;!&ndash;              size="mini"&ndash;&gt;-->
<!--        &lt;!&ndash;              type="info"&ndash;&gt;-->
<!--        &lt;!&ndash;              @click.naive.stop="handleUnread(scope.$index, scope.row)"&ndash;&gt;-->
<!--        &lt;!&ndash;            >未读</el-button>&ndash;&gt;-->
<!--        &lt;!&ndash;          </template>&ndash;&gt;-->
<!--        &lt;!&ndash;        </el-table-column>&ndash;&gt;-->
<!--      </el-table>-->
<!--      <el-pagination-->
<!--        :current-page="currentPage"-->
<!--        :page-sizes="[10, 20, 50]"-->
<!--        :page-size="pageSize"-->
<!--        layout="total, sizes, prev, pager, next, jumper"-->
<!--        :total="tableData.length"-->
<!--        @size-change="handleSizeChange"-->
<!--        @current-change="handleCurrentChange"-->
<!--      />-->
<!--    </div>-->
<!--    <el-dialog-->
<!--      :visible.sync="dialogVisible"-->
<!--      width="50%"-->
<!--      :before-close="handleDialogClose"-->
<!--      style="max-height: 700px;overflow:auto;"-->
<!--    >-->
<!--      <h1>{{ selectedRow.title }}</h1>-->
<!--      <el-divider />-->
<!--      <div class="dialog-content" v-html="content" />-->
<!--    </el-dialog>-->
<!--  </div>-->
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
  computed: {
    sortedData() {
      return this.tableData.slice().sort((a, b) => {
        return Date.parse(b.date) - Date.parse(a.date)
      })
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
      console.log(this.content)
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
.dialog-content img {
  max-width: 100%;
  height: auto;
}
</style>
