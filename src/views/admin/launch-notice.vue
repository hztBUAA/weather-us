<template>
    <div class="app-container">
        <tinymce :height="300" v-model="content" />
        <el-button @click="handle_submit">上传</el-button>
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
            content: ""
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