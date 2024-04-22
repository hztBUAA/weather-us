<template>
    <div>
        <div style="margin-left: 20px;margin-top: 20px;">
            <el-table :data="tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)" style="width: 100%;"
                border>
                <el-table-column label="反馈时间" width="180" sortable column-key="date" prop="date">
                    <template slot-scope="scope">
                        <i class="el-icon-time"></i>
                        <span style="margin-left: 10px">{{ scope.row.date }}</span>
                    </template>
                </el-table-column>
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
                <el-table-column label="反馈标题" width="360">
                    <template slot-scope="scope">
                        <span>{{ scope.row.title }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="tag" label="标签" width="180"
                    :filters="[{ text: '已处理', value: '已处理' }, { text: '未处理', value: '未处理' }]" :filter-method="filterTag"
                    filter-placement="bottom-end">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.tag === '已处理' ? 'primary' : 'success'" disable-transitions>{{
                            scope.row.tag }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="mini" type="danger"
                            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="currentPage" :page-sizes="[1, 10, 20, 50]" :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper" :total="tableData.length">
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
                title: '页面显示Bug',
                tag: '已处理',
            }, {
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1517 弄',
                title: '页面显示Bug',
                tag: '未处理',
            }, {
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1519 弄',
                title: '页面显示Bug',
                tag: '已处理',
            }, {
                date: '2016-05-03',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1516 弄',
                title: '页面显示Bug',
                tag: '已处理',
            }],
            currentPage: 1,
            pageSize: 10,
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
    }
}
</script>
