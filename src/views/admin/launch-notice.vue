<template>
    <div class="app-container">
        <el-input v-model="title" placeholder="请输入标题" style="margin-top: 10px;margin-bottom: 10px;"></el-input>
        <div style="margin-bottom: 10px;">
            <el-radio-group v-model="tag">
                <el-radio-button label="BUG修复"></el-radio-button>
                <el-radio-button label="新特性发布"></el-radio-button>
                <el-radio-button label="日常事务"></el-radio-button>
            </el-radio-group>
        </div>
        <tinymce :height="300" v-model="content" />
        <el-button @click="handle_submit" style="margin-top: 10px;" type="primary">上传</el-button>
    </div>
</template>

<script>
import Tinymce from "@/components/Tinymce"
import { request } from "@/api/api";
export default {
    components: {
        Tinymce
    },
    data() {
        return {
            title: "",
            content: "",
            tag: '',
        }
    },
    methods: {
        async handle_submit() {
            try {
                const url = 'https://mock.apifox.com/m1/4334156-3977343-default/admin/launch-notice?apifoxToken=kBmcKryyUxBSwSWfUSCxu2AhVpYxNrwO'
                // 使用封装的request函数发送POST请求
                const response = await request(url, 'post', { content: this.content });
                // 处理响应
                this.responseData = response.data;
                alert('内容发送成功！');
            } catch (error) {
                // 处理错误
                console.error('发送内容失败:', error);
                alert('内容发送失败，请重试！');
            }
        },
    },
}
</script>