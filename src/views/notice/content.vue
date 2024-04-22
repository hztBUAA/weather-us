<template>
    <div v-html="content"></div>
</template>

<script>
import { getData } from "@/api/api";
export default {
    data() {
        return {
            content: ''
        };
    },
    created() {
        this.fetchData();
    },
    methods: {
        async fetchData() {
            try {
                const url = 'https://mock.apifox.com/m1/4334156-0-default/notice/content?content=%27%3Cp%3Eaaaa%3C/p%3E%27'
                // 使用封装的getData函数发送GET请求
                const response = await getData(url);
                // 处理响应
                this.content = response.data.data.content;
                console.log('Data fetched successfully:', this.responseData);
            } catch (error) {
                // 处理错误
                console.error('Failed to fetch data:', error);
                alert('Failed to fetch data, please try again.');
            }
        },
    }
};
</script>