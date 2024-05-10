<template>
  <div>
    <div style="margin-left: 20px;margin-top: 20px;">
      <!-- 添加用户名搜索框 -->
      <span>用户名</span>
      <el-input
        v-model="searchUsername"
        placeholder="搜索用户名"
        clearable
        style="width: 300px;margin-left: 20px;"
      />
      <!-- 添加账号搜索框 -->
      <span style="margin-left: 20px;">手机号</span>
      <el-input v-model="searchPhone" placeholder="搜索手机号" clearable style="width: 300px;margin-left: 20px;" />
      <el-divider />
      <el-table :data="pagedTableData" style="width: 100%;margin-top: 30px;" border>
        <el-table-column label="用户名" width="180">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.username }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="手机号" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column label="邮箱" width="360">
          <template slot-scope="scope">
            <span>{{ scope.row.email }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="tag"
          label="标签"
          width="180"
          :filters="[{ text: '管理员', value: true }, { text: '用户', value: false }]"
          :filter-method="filterTag"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            <el-tag :type="scope.row.isAdmin === true ? 'primary' : 'success'" disable-transitions>{{
              (scope.row.isAdmin === true) ? '管理员' : '用户' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!--            <el-button size="mini" type="info" @click="handleEdit(scope.$index, scope.row)">权限改变</el-button>-->
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除账号</el-button>
            <el-button size="mini" type="primary" @click="handleReset(scope.$index, scope.row)">重置密码</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[10, 20, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="filteredTableData.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { delete_user, getUserDigests, permission_change, reset_password } from '@/api/admin'
import { Message } from 'element-ui'
export default {
  data() {
    return {
      tableData: [
      ],
      currentPage: 1,
      pageSize: 10,
      searchUsername: '', // 新增用户名搜索关键词状态
      searchPhone: '' // 新增账号搜索关键词状态
    }
  },
  computed: {
    filteredTableData() {
      // 根据搜索关键词过滤表格数据
      return this.tableData.filter((row) => {
        return (
          (!this.searchUsername || row.username.toLowerCase().includes(this.searchUsername.trim().toLowerCase())) && // 搜索用户名（可选）
          (!this.searchPhone || row.phone.toLowerCase().includes(this.searchPhone.trim().toLowerCase())) // 搜索账号（可选）
        )
      })
    },
    pagedTableData() {
      const startIndex = (this.currentPage - 1) * this.pageSize
      const endIndex = startIndex + this.pageSize

      return this.filteredTableData.slice(startIndex, endIndex)
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async handleEdit(index, row) {
      row.isAdmin = !row.isAdmin
      const result = await permission_change(row.username, row.isAdmin)
      Message.success(result.msg)
    },
    async handleDelete(index, row) {
      const result = await delete_user(row.username)
      Message.success(result.msg)
      const deleteRowIndex = this.tableData.findIndex((item) => item === row)
      if (deleteRowIndex !== -1) {
        this.tableData.splice(deleteRowIndex, 1) // 删除对应行
        // 更新 filteredTableData，使其重新计算过滤结果
        this.$set(this, 'searchUsername', this.searchUsername)
        this.$set(this, 'searchPhone', this.searchPhone)
      }
    },
    async handleReset(index, row) {
      const result = await reset_password(row.username)
      Message.success(result.msg)
    },
    filterTag(value, row) {
      return row.isAdmin === value
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

    async fetchData() {
      const res = await getUserDigests()
      this.tableData = res.data.tableData
    }
  }
}
</script>
