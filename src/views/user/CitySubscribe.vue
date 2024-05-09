<script>
import options from '@/assets/jsonData/cities.json'
import {
  getCitySubscribeService,
  addCitySubscribeService,
  deleteCitySubscribeService,
  getWarningsService
} from '@/api/user'
import { Message, MessageBox } from 'element-ui'

export default {
  data() {
    return {
      dialogVisible: false,
      cities: [],
      cascaderData: {},
      options: [],
      warnings: [],
      labelStyle: {
        'word-break': 'keep-all'
      }
    }
  },
  watch: {
    dialogVisible(val) {
      if (val) {
        this.cascaderData = {}
        this.$nextTick(function() {
          this.$refs.cascaderForm.clearValidate()
        })
      }
    }
  },
  mounted() {
    this.options = options
    this.loadData()
  },
  methods: {
    async loadData() {
      var result = await getCitySubscribeService()
      this.cities = result.data
      result = await getWarningsService()
      this.warnings = result.data
      this.warnings.sort((a, b) => {
        return Date.parse(b.warningTime) - Date.parse(a.warningTime)
      })
    },
    submit() {
      this.$refs.cascaderForm.validate(async(valid) => {
        if (valid) {
          const result = await addCitySubscribeService({ city: this.cascaderData.city.join('') })
          Message.success(result.msg)
          this.dialogVisible = false
          this.loadData()
        }
      })
    },
    deleteSubscribe(city) {
      MessageBox.confirm('确认删除订阅吗？', '温馨提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const result = await deleteCitySubscribeService(city)
          Message.success(result.msg || '删除成功')
          this.loadData()
        })
        .catch(() => {
          Message.info('删除取消')
        })
    }
  }
}
</script>

<template>
  <el-card>
    <div style="display: flex; align-items: center; justify-content: space-between;">
      <h3> 城市订阅 </h3>
      <el-button type="primary" @click="dialogVisible = true">新增订阅</el-button>
    </div>
    <el-table :data="cities" stripe border style="margin-top: 10px; width: 251px">
      <el-table-column label="城市" width="150px">
        <template slot-scope="{row}">
          {{ row }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100px">
        <template slot-scope="{row}">
          <el-button type="danger" icon="el-icon-delete" circle @click="deleteSubscribe(row)" />
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogVisible" title="增加订阅" width="40%">
      <el-form ref="cascaderForm" :model="cascaderData">
        <el-form-item :rules="[{required:true, trigger: 'blur', message: '请选择订阅城市'}]" prop="city">
          <el-cascader v-model="cascaderData.city" :options="options" clearable filterable placeholder="选择城市" separator="" />
        </el-form-item>
        <el-button type="primary" @click="submit">
          提交
        </el-button>
      </el-form>
    </el-dialog>

    <hr>

    <h3>预警</h3>
    <el-card v-for="(warning, key) in warnings" :key="key" style="margin-top: 5px">
      <el-descriptions :title="warning.title" border :label-style="labelStyle">
        <el-descriptions-item label="类型">{{ warning.type }}</el-descriptions-item>
        <el-descriptions-item label="地点">{{ warning.address }}</el-descriptions-item>
        <el-descriptions-item label="时间">{{ warning.warningTime }}</el-descriptions-item>
        <el-descriptions-item label="内容">{{ warning.content }}</el-descriptions-item>
      </el-descriptions>
    </el-card>

  </el-card>
</template>

<style scoped>

</style>