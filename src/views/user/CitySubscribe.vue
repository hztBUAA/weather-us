<script>
import options from '@/assets/jsonData/cities.json'
import { getCitySubscribeService, addCitySubscribeService, deleteCitySubscribeService } from '@/api/user'
import { Message, MessageBox } from 'element-ui'

export default {
  data() {
    return {
      dialogVisible: false,
      cities: [],
      cascaderData: {},
      options: []
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
    this.loadCitySubscribe()
  },
  methods: {
    async loadCitySubscribe() {
      const result = await getCitySubscribeService()
      this.cities = result.data.cities
    },
    submit() {
      this.$refs.cascaderForm.validate(async(valid) => {
        if (valid) {
          const result = await addCitySubscribeService({ city: this.cascaderData.city.join('') })
          Message.success(result.msg)
          this.dialogVisible = false
          this.loadCitySubscribe()
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
          this.loadCitySubscribe()
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
    <template v-slot:header>
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <span> 城市订阅 </span>
        <el-button type="primary" @click="dialogVisible = true">新增订阅</el-button>
      </div>
    </template>
    <el-table :data="cities" stripe border>
      <el-table-column label="城市">
        <template slot-scope="{row}">
          {{ row }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
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
  </el-card>
</template>

<style scoped>

</style>
