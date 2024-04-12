<template>
  <div>
    <div style="margin-left: 20px;margin-top: 20px;">
      <!-- 添加用户名搜索框 -->
      <span>用户名</span>
      <el-input placeholder="搜索用户名" v-model="searchUsername" clearable style="width: 300px;margin-left: 20px;"></el-input>
      <!-- 添加账号搜索框 -->
      <span style="margin-left: 20px;">账号</span>
      <el-input placeholder="搜索账号" v-model="searchCount" clearable style="width: 300px;margin-left: 20px;"></el-input>
      <el-divider></el-divider>
      <el-table :data="filteredTableData" style="width: 100%;margin-top: 30px;" border>
        <el-table-column label="用户名" width="180">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>姓名: {{ scope.row.name }}</p>
              <p>住址: {{ scope.row.address }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.name }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="账号" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.count }}</span>
          </template>
        </el-table-column>
        <el-table-column label="邮箱" width="360">
          <template slot-scope="scope">
            <span>{{ scope.row.email }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="tag" label="标签" width="180"
          :filters="[{ text: '管理员', value: '管理员' }, { text: '用户', value: '用户' }]" :filter-method="filterTag"
          filter-placement="bottom-end">
          <template slot-scope="scope">
            <el-tag :type="scope.row.tag === '管理员' ? 'primary' : 'success'" disable-transitions>{{
              scope.row.tag }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            <el-button size="mini" type="primary">重置</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
        :page-sizes="[1, 10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="filteredTableData.length">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        title: '页面显示Bug',
        count: '123456',
        tag: '管理员',
        email:'237@shanhe.com',
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄',
        title: '页面显示Bug',
        count: '1234567',
        tag: '管理员',
        email:'3112@heshan.com',
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄',
        title: '页面显示Bug',
        count: '1234568',
        tag: '用户',
        email:'2370994112@heshan.com',
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄',
        title: '页面显示Bug',
        count: '1234569',
        tag: '用户',
        email:'2370994112@heshan.com',
      }, {
        name: 'heshan',
        count: '1234569',
        email:'2370994112@heshan.com',
        tag: '用户',
      }],
      currentPage: 1,
      pageSize: 10,
      searchUsername: '', // 新增用户名搜索关键词状态
      searchCount: '', // 新增账号搜索关键词状态
    }
  },
  methods: {
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    handleSizeChange(newPageSize) {
      this.pageSize = newPageSize;
      this.currentPage = 1; // 当改变每页显示数量时，重置为第一页
    },

    handleCurrentChange(newCurrentPage) {
      this.currentPage = newCurrentPage;
    },
  },
  computed: {
    filteredTableData() {
      // 根据搜索关键词过滤表格数据
      return this.tableData.filter((row) => {
        return (
          (!this.searchUsername || row.name.toLowerCase().includes(this.searchUsername.trim().toLowerCase())) && // 搜索用户名（可选）
          (!this.searchCount || row.count.toLowerCase().includes(this.searchCount.trim().toLowerCase())) // 搜索账号（可选）
        );
      });
    },
  },
}
</script>
