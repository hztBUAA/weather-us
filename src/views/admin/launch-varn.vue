<template>
    <div>
        <div style="margin-left: 10px;">
            <h2>新建预警</h2>
            <el-divider></el-divider>
        </div>
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="预警名称" style="width: 500px;">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="预警区域">
                <el-select v-model="form.region" placeholder="请选择预警区域">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="预警时间">
                <el-row :gutter="8">
                    <el-col :span="4">
                        <el-date-picker type="date" placeholder="选择日期" v-model="form.date1"
                            style="width: 100%;"></el-date-picker>
                    </el-col>
                    <el-col :span="1" style="text-align: center;">
                        <span>-</span>
                    </el-col>
                    <el-col :span="4">
                        <el-time-picker placeholder="选择时间" v-model="form.date2" style="width: 100%;"></el-time-picker>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="预警性质">
                <el-checkbox-group v-model="form.type">
                    <el-checkbox label="地震" name="type"></el-checkbox>
                    <el-checkbox label="飓风" name="type"></el-checkbox>
                    <el-checkbox label="泥石流" name="type"></el-checkbox>
                    <el-checkbox label="沙尘暴" name="type"></el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="发件邮箱">
                <el-dropdown trigger="click" @command="handleDropdownCommand">
                    <span class="el-dropdown-link">
                        {{ selectedEmail || '邮箱选择' }}
                        <i class="el-icon-setting el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-for="(email, index) in emailList" :key="index" :command="email"
                            icon="el-icon-circle-check">
                            {{ email }}
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <span style="margin-left: 40px;color: #409EFF;cursor: pointer;" @click="send_message">
                    测试发送<i class="el-icon-search el-icon--right"></i></span>
            </el-form-item>
            <el-form-item label="预警信息" style="width: 500px;">
                <el-input type="textarea" v-model="form.desc"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">立即创建</el-button>
                <el-button>取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
    data() {
        return {
            form: {
                name: '',
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: '',
            },
            selectedEmail: '',
            emailList: ['123@qq.com', '456@qq.com', '789@qq.com', '123@aa.com', '123@bb.com'],
        }
    },
    methods: {
        onSubmit() {
            console.log('submit!');
        },
        handleDropdownCommand(email) {
            this.selectedEmail = email;
        },
        send_message() {
            alert('发送成功！')
        }
    }
}
</script>
<style>
.el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
}

.el-icon-arrow-down {
    font-size: 12px;
}

.demonstration {
    display: block;
    color: #8492a6;
    font-size: 14px;
    margin-bottom: 20px;
}
</style>