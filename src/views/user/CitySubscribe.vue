<script>
import mapData from '../../assets/jsonData/china.json'
import cityData from '../../assets/jsonData/city.json'
import { getCityJson } from '@/api/staticApi'
import { getCitySubscribeService, addCitySubscribeService, deleteCitySubscribeService } from '@/api/user'
import { Message, MessageBox } from 'element-ui'

export default {
  data() {
    return {
      dialogVisible: false,
      cities: [],
      cascaderData: {},
      options: [],
      adcode2city: {}
    }
  },
  mounted() {
    const map1 = Object.fromEntries(mapData.features.filter((feature) => feature.properties.adcode !== '100000')
      .map((feature) => [feature.properties.adcode, { name: feature.properties.name, parent: feature.properties.parent ? feature.properties.parent.adcode : 100000 }]))
    const map2 = Object.fromEntries(cityData.features.filter((feature) => feature.properties.adcode !== '100000')
      .map((feature) => [feature.properties.adcode, { name: feature.properties.name, parent: feature.properties.parent ? feature.properties.parent.adcode : 100000 }]))
    this.adcode2city = { ...map1, ...map2 }
    console.log(this.adcode2city)

    const that = this
    mapData.features.forEach(function(feature) {
      if (feature.properties.adcode !== '100000') {
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
    submit() {
      this.$refs.cascaderForm.validate(async(valid) => {
        if (valid) {
          const result = await addCitySubscribeService(...this.cascaderData.id.slice(-1))
          Message.success(result.msg)
          this.cascaderData = {}
          this.dialogVisible = false
          this.loadCitySubscribe()
        }
      })
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
      <el-table-column prop="province" label="城市">
        <template slot-scope="{row}">
          {{ (adcode2city[row.adcode].parent !== 100000 ? adcode2city[adcode2city[row.adcode].parent].name : "") + adcode2city[row.adcode].name }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="danger" icon="el-icon-delete" circle @click="deleteSubscribe(scope.row.adcode)" />
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogVisible" title="增加订阅" width="40%">
      <el-form ref="cascaderForm" :model="cascaderData">
        <el-form-item :rules="[{required:true, trigger: 'blur', message: '请选择订阅城市'}]" prop="id">
          <el-cascader v-model="cascaderData.id" :options="options" clearable filterable placeholder="选择城市" separator="" />
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
