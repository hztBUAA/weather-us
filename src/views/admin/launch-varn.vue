<template>
  <div>
    <div style="margin-left: 10px;">
      <h2>新建预警</h2>
      <el-divider />
    </div>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="预警标题" style="width: 500px;" :rules="rules.title" prop="title">
        <el-input v-model="form.title" />
      </el-form-item>

      <el-form-item :rules="rules.addr" prop="address" label="预警区域">
        <el-cascader
          v-model="form.address"
          :options="options"
          clearable
          filterable
          placeholder="选择城市"
          separator=""
        />
      </el-form-item>

      <el-form-item label="预警时间" :rules="rules.warningTime" prop="warningTime">
        <div class="block">
          <el-date-picker
            v-model="form.warningTime"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </div>
      </el-form-item>
      <el-form-item label="预警类型" :rules="rules.type" prop="type">
        <el-radio v-model="form.type" label="地震">地震</el-radio>
        <el-radio v-model="form.type" label="飓风">飓风</el-radio>
        <el-radio v-model="form.type" label="泥石流">泥石流</el-radio>
        <el-radio v-model="form.type" label="沙尘暴">沙尘暴</el-radio>
      </el-form-item>
      <!--      <el-form-item label="发件邮箱">-->
      <!--        <el-dropdown trigger="click" @command="handleDropdownCommand">-->
      <!--          <span class="el-dropdown-link">-->
      <!--            {{ selectedEmail || '邮箱选择' }}-->
      <!--            <i class="el-icon-setting el-icon&#45;&#45;right" />-->
      <!--          </span>-->
      <!--          <el-dropdown-menu slot="dropdown">-->
      <!--            <el-dropdown-item-->
      <!--              v-for="(email, index) in emailList"-->
      <!--              :key="index"-->
      <!--              :command="email"-->
      <!--              icon="el-icon-circle-check"-->
      <!--            >-->
      <!--              {{ email }}-->
      <!--            </el-dropdown-item>-->
      <!--          </el-dropdown-menu>-->
      <!--        </el-dropdown>-->
      <!--        <span style="margin-left: 40px;color: #409EFF;cursor: pointer;" @click="send_message">-->
      <!--          测试发送<i class="el-icon-search el-icon&#45;&#45;right" /></span>-->
      <!--      </el-form-item>-->
      <el-form-item label="预警信息" style="width: 500px;" :rules="rules.content" prop="content">
        <el-input v-model="form.content" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import options from '@/assets/jsonData/cities.json'
import { launch_varn } from '@/api/admin'
export default {
  data() {
    return {
      form: {
        title: '',
        address: '',
        warningTime: '',
        type: ''
      },
      options: [],
      selectedEmail: '',
      emailList: ['123@qq.com', '456@qq.com', '789@qq.com', '123@aa.com', '123@bb.com'],
      rules: {
        title: [{ required: true, trigger: 'blur', message: '请输入预警标题' }],
        addr: [{ required: true, trigger: 'blur', message: '请选择预警城市' }],
        warningTime: [{ required: true, trigger: ['blur', 'change'], message: '请选择预警时间' }],
        type: [{ required: true, trigger: ['blur', 'change'], message: '请选择预警类型' }],
        content: [{ required: true, trigger: 'blur', message: '请输入预警信息' }],
        selectedEmail: [{ required: true, trigger: 'blur', message: '请选择预警发送邮箱' }]
      }
    }
  },
  created() {
    this.options = options
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          launch_varn(this.form.title, this.form.address,
            this.form.warningTime, this.form.type, this.form.content).then(() => {
            this.$message.success('发布成功')
            setTimeout(() => {
              window.location.reload()
            }, 1000) // 等待1秒后刷新页面
          }).catch((error) => {
            this.$message.error('发生未知错误，请稍后再试')
          })
        }
      })
    },
    handleDropdownCommand(email) {
      this.selectedEmail = email
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
