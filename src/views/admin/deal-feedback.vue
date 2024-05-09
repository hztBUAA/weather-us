<template>
    <div>
        <div style="margin-left: 20px;margin-top: 20px;">
            <el-table :data="tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)" style="width: 100%;"
                border>
                <el-table-column label="反馈时间" width="180" sortable column-key="updateTime" prop="updateTime">
                    <template slot-scope="scope">
                        <i class="el-icon-time"></i>
                        <span style="margin-left: 10px">{{ scope.row.updateTime }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="用户名" width="180">
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <el-tag size="medium">{{ scope.row.username }}</el-tag>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="反馈标题" width="360">
                    <template slot-scope="scope">
                        <span>{{ scope.row.title }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="status" label="标签" width="180"
                    :filters="[{ text: '已处理', value: '已处理' }, { text: '未处理', value: '未处理' }]" :filter-method="filterTag"
                    filter-placement="bottom-end">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.status === '已处理' ? 'primary' : 'success'" disable-transitions>{{
                            scope.row.status }}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" type="info" @click="handleEdit(scope.$index, scope.row)">详情</el-button>
                        <!-- <el-button size="mini" type="danger"
                            @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
                    </template>
                </el-table-column>
            </el-table>

            <el-dialog title="反馈详情" :visible.sync="dialogVisible" width="30%">
                <div>
                    <p><strong>用户名：</strong>{{ currentFeedback.username }}</p>
                    <p><strong>状态：</strong>{{ currentFeedback.status }}</p>
                    <p><strong>反馈标题：</strong>{{ currentFeedback.title }}</p>
                    <p><strong>反馈时间：</strong>{{ currentFeedback.updateTime }}</p>
                    <p><strong>反馈内容：</strong>{{ currentFeedback.content }}</p>
                </div>
                <el-divider />
                <div>
                    <p><strong>回复：</strong></p>
                    <div v-if="currentFeedback.status === '已处理'">
                        <!-- 如果状态为已处理，则显示回复内容 -->
                        <p>{{ currentFeedback.reply }}</p>
                    </div>
                    <div v-else>
                        <!-- 如果状态为未处理，则提供一个输入框供回复 -->
                        <el-input v-model="currentFeedback.reply" placeholder="请输入回复内容"></el-input>
                    </div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="submitReply"
                        :disabled="currentFeedback.status === '已处理'">回复</el-button>
                    <el-button @click="dialogVisible = false">关闭</el-button>
                </span>
            </el-dialog>

            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="currentPage" :page-sizes="[10, 20, 50]" :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper" :total="tableData.length">
            </el-pagination>

        </div>
    </div>
</template>

<script>
import { fetch_feedback, reply_feedback } from '@/api/admin';

export default {
    data() {
        return {
            tableData: [],
            currentPage: 1,
            pageSize: 10,
            dialogVisible: false, // 控制对话框显示隐藏的标志
            currentFeedback: {}, // 用于存储当前选中的反馈信息
        }
    },
    created() {
        this.fetchData()
    },
    methods: {
        async fetchData() {
            const res = await fetch_feedback()
            this.tableData = res.data
        },
        handleEdit(index, row) {
            this.currentFeedback = row; // 将当前行的反馈信息赋值给currentFeedback
            this.dialogVisible = true; // 显示对话框
        },
        handleClose() {
            this.dialogVisible = false;
        },
        submitReply() {
            reply_feedback(this.currentFeedback.id,
                this.currentFeedback.reply).then(() => {
                    this.$message.success('回复成功')
                    setTimeout(() => {
                        window.location.reload()
                    }, 1000); // 等待1秒后刷新页面
                }).catch((error) => {
                    this.$message.error('发生未知错误，请稍后再试');
                });
        },
        handleDelete(index, row) {
            console.log(index, row);
        },
        filterTag(value, row) {
            return row.status === value;
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
