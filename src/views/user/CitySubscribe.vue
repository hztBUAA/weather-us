<script>
import mapData from '../../assets/jsonData/china.json'
import { getCityJson } from '@/api/staticApi'
import { getCitySubscribeService, addCitySubscribeService, deleteCitySubscribeService } from '@/api/user'
import { Message, MessageBox } from 'element-ui'

export default {
  data() {
    return {
      dialogVisible: false,
      cities: [],
      city: {

      },
      options: []
    }
  },
  mounted() {
    const that = this
    mapData.features.forEach(function(feature) {
      if (feature.properties.adcode !== 100000) {
        const pro = { value: feature.properties.adcode, label: feature.properties.name, children: [] }
        getCityJson(feature.properties.adcode).then((res) => {
          res.data.features.forEach(function(childFeature) {
            const city = { value: childFeature.properties.adcode, label: childFeature.properties.name }
            pro.children.push(city)
          })
        })
        that.options.push(pro)
      }
    })
    this.loadCitySubscribe()
  },
  methods: {
    async loadCitySubscribe() {
      const result = await getCitySubscribeService()
      this.cities = result.data.cities
    },
    async submit() {
      const result = await addCitySubscribeService(this.city)
      Message.success(result.msg)
      this.dialogVisible = false
      await this.loadCitySubscribe()
    },
    deleteSubscribe(id) {
      MessageBox.confirm('确认删除订阅吗？', '温馨提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const result = await deleteCitySubscribeService(id)
          Message.success(result.msg || '删除成功')
          await this.loadCitySubscribe()
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
      <el-table-column prop="province" label="城市" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="danger" icon="el-icon-delete" circle @click="deleteSubscribe(scope.row.id)" />
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogVisible" title="增加订阅" width="40%">
      <el-form :model="city">
        <el-form-item>
          <el-cascader v-model="city.id" :options="options" filterable placeholder="选择城市" separator="" />
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
