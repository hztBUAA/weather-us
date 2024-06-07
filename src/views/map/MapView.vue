<template>
  <div>
    <div style="width: 100%; height: 100vh">
      <div ref="charts" style="width: 100%; height: 100%"></div>
    </div>
    <div class="float" style="width: 100%; height: 100vh; top: 0%; left: 0%" v-if="dataType == '地质'"> 
      <GeoView></GeoView>
    </div>
    <el-menu default-active="0" style="top: 40%; right: 0%; width: 60px; background-color: rgba(0, 0, 0, 0); text-align: center;" class="float" :collapse="true" @select="selectMode">
      <div v-for="item in dataTypes" :key="item.index" v-if="dataType == '气象'">
        <el-menu-item :index="String(item.index)">
          <img :src="item.img" style="object-fit: contain; width: 23px;">
          <span slot="title">{{ item.name }}</span>
        </el-menu-item>
      </div>
    </el-menu>
    <div class="float" style="top: 3%; left: 3%; display: flex; align-items: center; justify-content: center; height: 42px">
      <el-button
        plain
        size="medium"
        style="margin-right: 25px"
        @click="back"
        v-if="dataType == '气象'"
      >
        <i class="el-icon-caret-left" />&nbsp;回退
      </el-button>
      <el-cascader
        v-model="chosenCity"
        style="margin-right: 25px"
        placeholder="搜索城市"
        :options="cities"
        filterable
        :props="{ expandTrigger: 'hover', checkStrictly: true }"
        @change="chooseCity"
        v-if="dataType == '气象'"
      />
      <el-switch
        style="margin-right: 25px"
        v-model="showWarning"
        active-text="显示灾害预警"
        @change="showWarningChange"
        v-if="dataType == '气象'">
      </el-switch>
      <div v-else style="margin-right: 25px"></div>
      <el-color-picker
        v-model="backgroundColor"
        show-alpha
        style="margin-right: 25px"
        :predefine="predefineColors"
        @active-change="colorChange"
      />
      <el-radio-group v-model="dataType" size="small" @input="changeType" style="background-color: rgba(0, 0, 0, 0)">
        <el-radio-button label="气象"></el-radio-button>
        <el-radio-button label="地质"></el-radio-button>
      </el-radio-group>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import mapData from '../../assets/jsonData/china.json'
// import cityData from '../../assets/jsonData/city.json'
import citiesData from '../../assets/jsonData/cities.json'
import { getCityJson, getCenter } from '../../api/staticApi'
import { getCityData, getDataTypes } from '../../api/dataApi'
import Tooltip from '../../views/map/tooltip.vue'
import GeoView from '../../views/map/GeoView.vue'
import Vue from 'vue'
import resize from './mixins/resize'
import {
  getWarningsService
} from '@/api/user'
const predefineColors = ['#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585']
const emphasis = {
  label: {
    fontSize: 14,
    textStyle: {
      color: '#1e1e1e'
    }
  },
  itemStyle: {
    areaColor: 'rgb(255, 250, 250)'
    // opacity: 0.2,
    // borderWidth: 0
  }
}
const geoOption = {
  zoom: 1,
  emphasis: emphasis,
  label: {
    show: true,
    fontSize: 14,
    textStyle: {
      color: '#1e1e1e'
    }
  },
  itemStyle: {
    // borderWidth: 0,
    areaColor: 'rgb(204, 204, 204)'
    // opacity: 0.1,
    /*
    areaColor: {
      type: 'radial',
      x: 0.5,
      y: 0.5,
      r: 0.8,

      colorStops: [
        {
          offset: 0,
          color: 'rgba(147, 235, 248, 0)'
        },
        {
          offset: 1,
          color: 'rgba(147, 235, 248, 0.2)'
        }
      ],

      globalCoord: false
    }
    /*
        shadowColor: "rgba(128, 217, 248, 1)",
        shadowOffsetX: -2,
        shadowOffsetY: 2,
        shadowBlur: 10,
        */
  }
}
const option = {
  animation: true,
  animationThreshold: 100000,
  animationDuration: 2000,
  animationDelay: 100,
  animationDurationUpdate: 2000,
  animationDelayUpdate: 100,
  backgroundColor: '#cccccc'
}
const virsualSet = {
  type: 'continuous',
  left: '6%',
  bottom: '5%',
  itemWidth: 30,
  itemHeight: 180,
  zlevel: 3
}
const testWarning = [
  {
    title: "林它立约和",
    address: [
      "广东省",
      "深圳市"
    ],
    type: "地震",
    content: "身状精总已候达为身影特义任这气计里。管流些为次石说于人机而先号进西。业物织切风这米相越况织直江内两状就每。参去手三然等入率真同业第育般头精合。",
    warningTime: "1984-07-23 23:39:42"
  },
  {
    title: "林它立约和",
    address: [
      "广东省",
      "深圳市"
    ],
    type: "台风",
    content: "身状精总已候达为身影特义任这气计里。管流些为次石说于人机而先号进西。业物织切风这米相越况织直江内两状就每。参去手三然等入率真同业第育般头精合。",
    warningTime: "1984-07-23 23:39:42"
  },
  {
    title: "林它立约和",
    address: [
      "北京市",
      "东城区"
    ],
    type: "地震",
    content: "身状精总已候达为身影特义任这气计里。管流些为次石说于人机而先号进西。业物织切风这米相越况织直江内两状就每。参去手三然等入率真同业第育般头精合。",
    warningTime: "1984-07-23 23:39:42"
  }
]
export default {
  mixins: [resize],
  components: {
    Tooltip,
    GeoView
  },
  data() {
    return {
      backgroundColor: '#cccccc',
      predefineColors: predefineColors,
      emphasis: emphasis,
      geoOption: geoOption,
      option: option,
      virsualSet: virsualSet,
      charts: null,
      layer: 0,
      glabalBounding: [],
      glabalBounding2: [],
      maps: [mapData, null, null],
      cities: [],
      chosenCity: [],
      dataTypes: [],
      dataType: '气象',
      typeIndex: 0,
      warningList: testWarning,
      warningSeries: [null, null, null],
      centers: null,
      showWarning: true
    }
  },
  created() {
    this.$nextTick(() => {
      getDataTypes().then((res) => {
        this.dataTypes = res.data
        this.getWarnings()
        this.initMap()
        this.initCities()
      })
    })
  },
  methods: {
    async getWarnings() {
      //const result = await getWarningsService()
      //this.warningList = result.data
      const ds1 = []
      const ds2 = []
      const ds3 = []
      const st = {
        type: 'effectScatter',
        coordinateSystem: 'geo',
        z: 4,
        zlevel: 4,
        symbolSize: 16,
        showEffectOn: 'render',
        rippleEffect: { // 坐标点动画
          period: 2,
          scale: 4,
          brushType: 'fill'
        },
        label: {
          show: false
        },
        itemStyle: { // 坐标点颜色
          show: true,
          color: '#333',
          shadowBlur: 30,
          shadowColor: 'rgba(122, 233, 86, 1)'
        },
        emphasis: {
          scale: true
        },
        encode: {
          value: 2
        },
        tooltip: {
            position: function (point, params, dom, rect, size) {
                // 鼠标坐标和提示框位置的参考坐标系
                let x = 0; // x坐标位置
                let y = 0; // y坐标位置
                const pointX = point[0];
                const pointY = point[1];
                const boxHeight = size.contentSize[1];
                if (size.contentSize[0] > pointX) {
                    x = 5
                } else {
                    x = pointX - 40
                }
                if (boxHeight > pointY) {
                    y = 5
                } else {
                    y = pointY - boxHeight - 10
                }
                return [x, y]
            },
            extraCssText: 'box-shadow: 0 0 3px transparent;', // 额外附加到浮层的 css 样式
            borderColor: "transparent",
            trigger: 'item',
            backgroundColor: "transparent",
            enterable: true,
            alwaysShowContent: true,
            formatter: function (params) {
                var str = "";
                if (params.value) {
                  //console.log(params)
                    str = `<div class="map-tip"><div class="map-text">`;
                    params.data.list.forEach(function(i) {
                      str += `<div><span class="time">${i.type}</span><span class="time">${i.time}</span></div>`
                    })
                    str += `</div></div>`
                }
                return str
            }
        }
      }
      const map1 = new Map()
      const map2 = new Map()
      const map3 = new Map()
      await this.warningList.forEach((warning) => {
        if (warning.address.length > 0) {
          if (map1.has(warning.address[0])) {
            const item = map1.get(warning.address[0])
            const value = item.value
            const list = item.list
            map1.set(warning.address[0], { value: value + 1, list: [...list, ...[{type: warning.type, time: warning.warningTime}]]})
          } else {
            map1.set(warning.address[0], { value: 1, list: [{type: warning.type, time: warning.warningTime}]})
          }
        }
        if (warning.address.length > 1) {
          if (map2.has(warning.address[1])) {
            const item = map2.get(warning.address[1])
            const value = item.value
            const list = item.list
            map2.set(warning.address[1], { value: value + 1, list: [...list, ...[{type: warning.type, time: warning.warningTime}]]})
          } else {
            map2.set(warning.address[1], { value: 1, list: [{type: warning.type, time: warning.warningTime}]})
          }
        }
        if (warning.address.length > 2) {
          if (map3.has(warning.address[2])) {
            const item = map3.get(warning.address[2])
            const value = item.value
            const list = item.list
            map3.set(warning.address[1], { value: value + 1, list: [...list, ...[{type: warning.type, time: warning.warningTime}]]})
          } else {
            map3.set(warning.address[1], { value: 1, list: [{type: warning.type, time: warning.warningTime}]})
          }
        }
      })
      this.centers = await getCenter()
      //console.log(this.centers)
      const that = this
      map1.forEach(function(item, key) {
        ds1.push({name: key, value: [...that.centers.get(key), ...[item.value]], list: item.list})
      })
      //console.log(ds1)
      map2.forEach(function(item, key) {
        ds2.push({name: key, value: [...that.centers.get(key), ...[item.value]], list: item.list})
      })
      map3.forEach(function(item, key) {
        ds3.push({name: key, value: [...that.centers.get(key), ...[item.value]], list: item.list})
      })
      this.warningSeries[0] = {...st, ...{ data: ds1, geoIndex: 0 }}
      this.warningSeries[1] = {...st, ...{ data: ds2, geoIndex: 1 }}
      this.warningSeries[2] = {...st, ...{ data: ds3, geoIndex: 2 }}
    },
    goCity() {
      console.log(1)
    },
    changeType(label) {
      const option = this.charts.getOption()
      option.geo.forEach((geo) => {
        geo.show = label == '气象'
      })
      option.visualMap[0].show = label == '气象'
      //console.log(option)
      this.charts.setOption(option)
    },
    getJson(json) {
    //  const stringData = JSON.stringify(json, null, 2)
      const blob = new Blob([json], {
        type: 'text/json'
      })
      const objectURL = URL.createObjectURL(blob)
      const aTag = document.createElement('a')
      aTag.href = objectURL
      aTag.download = 'centers.json'
      aTag.click()
      URL.revokeObjectURL(objectURL)
    },
    selectMode(index) {
      //console.log(index)
      if (index == this.typeIndex || index == -1) {
        return
      } else {
        this.typeIndex = index
        const visualMap = {...this.virsualSet, ...{
          min: this.dataTypes[this.typeIndex].valueRange[0],
          max: this.dataTypes[this.typeIndex].valueRange[1],
          dimension: Number(this.typeIndex) + 1,
          inRange: {
              color: this.dataTypes[this.typeIndex].colorRange
          },
          controller: {
            inRange: {
              color: this.dataTypes[this.typeIndex].colorRange
            },
          },
          text: [this.dataTypes[this.typeIndex].valueRange[1] + this.dataTypes[this.typeIndex].dw, this.dataTypes[this.typeIndex].valueRange[0] + this.dataTypes[this.typeIndex].dw],
        }}
        var option = this.charts.getOption()
        option.visualMap = visualMap
        //console.log(option)
        this.charts.setOption(option, true)
      }
    },
    initCities() {
      this.cities = citiesData
      /*
      var string = []
      mapData.features.forEach((feature1) => {
        if (feature1.properties.adcode != 100000) {
          string.push({name: feature1.properties.name, centers: feature1.properties.center})
          getCityJson(feature1.properties.adcode).then((res) => {
            res.data.features.forEach((feature2) => {
              string.push({name: feature2.properties.name, centers: feature2.properties.center})
              getCityJson(feature2.properties.adcode).then((res1) => {
                res1.data.features.forEach((feature3) => {
                  string.push({name: feature3.properties.name, centers: feature3.properties.center})
                })
              })
            })
          })
        }
      })
      const that = this
      setTimeout(() => {
        that.getJson(JSON.stringify(string))
        console.log('start')
      }, 120000)
      */
    },
    colorChange(color) {
      const option = this.charts.getOption()
      option.backgroundColor = color
      this.charts.setOption(option)
    },
    showWarningChange(show) {
      const option = this.charts.getOption()
      if (show) {
        option.series[this.layer + 1] = this.warningSeries[this.layer]
      } else {
        option.series[this.layer + 1] = null
      }
      this.charts.setOption(option, true)
    },
    back() {
      const option = this.charts.getOption()
      if (this.layer == 1) {
        this.layer = 0
        this.maps[1] = null
        option.series[1] = this.showWarning ? this.warningSeries[0] : null
        option.dataset[1] = null
        option.series[2] = null
        option.geo[1] = null
        option.geo[0].boundingCoords = this.glabalBounding
        option.geo[0].silent = false
        option.geo[0].label.show = true
        this.charts.setOption(option, true)
        this.chosenCity = []
      } else if (this.layer == 2) {
        this.layer = 1
        this.maps[2] = null
        option.series[2] = this.showWarning ? this.warningSeries[1] : null
        option.dataset[2] = null
        option.series[3] = null
        option.geo[2] = null
        option.geo[0].boundingCoords = this.glabalBounding2
        option.geo[1].boundingCoords = this.glabalBounding2
        option.geo[1].silent = false
        option.geo[1].label.show = true
        this.charts.setOption(option, true)
        this.chosenCity = [this.chosenCity[0]]
      }
    },
    calBounding(geoJsonData) {
      const boundingCoords = [
        [Infinity, -Infinity],
        [-Infinity, Infinity]
      ]
      geoJsonData.features.forEach(function(feature) {
        const coordinates = feature.geometry.coordinates
        coordinates.forEach(function([coords]) {
          coords.forEach(function(coord) {
            boundingCoords[0][0] = Math.min(boundingCoords[0][0], coord[0])
            boundingCoords[0][1] = Math.max(boundingCoords[0][1], coord[1])
            boundingCoords[1][0] = Math.max(boundingCoords[1][0], coord[0])
            boundingCoords[1][1] = Math.min(boundingCoords[1][1], coord[1])
          })
        })
      })
      return boundingCoords
    },
    async getAllData(geoIndex) {
      const adcodes = []
      this.maps[geoIndex].features.forEach(function(feature) {
        if (feature.properties.adcode != 100000) {
          adcodes.push(String(feature.properties.adcode))
        }
      })
      const data = []
      const dimension = ['name']
      this.dataTypes.forEach(function(dataType) {
        dimension.push(dataType.type)
      })
      data.push(dimension)
      await getCityData(adcodes).then((res) => {
        //console.log(res)
        this.maps[geoIndex].features.forEach(function(feature) {
          if (feature.properties.adcode != 100000) {
            const value = [ feature.properties.name ]
            value.push.apply(value, res.get(String(feature.properties.adcode)))
            data.push(value)
          }
        })
        //console.log(data)
      })
      return data
    },
    showData(geoIndex) {
      var option = this.charts.getOption()
      this.getAllData(geoIndex).then((res) => {
        //console.log(res)
        const series = option.series
        const dataset = option.dataset
        dataset[geoIndex] = { source: res }
        //console.log(dataset)
        series[geoIndex] = {
          type: 'map',
          geoIndex: geoIndex,
          datasetIndex: geoIndex,
          select: {
            disabled: true
          }
        }
        if (this.showWarning) {
          series[geoIndex + 1] = this.warningSeries[geoIndex]
        }
        option = { ...option, ...{
          visualMap: {...this.virsualSet, ...{
            min: this.dataTypes[this.typeIndex].valueRange[0],
            max: this.dataTypes[this.typeIndex].valueRange[1],
            dimension: Number(this.typeIndex) + 1,
            inRange: {
                color: this.dataTypes[this.typeIndex].colorRange
            },
            controller: {
              inRange: {
                color: this.dataTypes[this.typeIndex].colorRange
              },
            },
            text: [this.dataTypes[this.typeIndex].valueRange[1] + this.dataTypes[this.typeIndex].dw, this.dataTypes[this.typeIndex].valueRange[0] + this.dataTypes[this.typeIndex].dw],
          }},
          dataset: dataset,
          series: series
        }}
        //console.log(option)
        this.charts.setOption(option, true)
      })
    },
    chooseCity(city) {
      if (city.length < 3) {
        this.showCity(city[0], city[1])
      } else {
        this.$router.push({ name: 'City', params: { c1: city[2] }})
        // console.log('city', city[2])
      }
    },
    showCity2(name) {
      const option = this.charts.getOption()
      this.maps[1].features.forEach((feature) => {
        if (feature.properties.name === name) {
          getCityJson(feature.properties.adcode).then((res) => {
            if (res.data.features.length <= 1) {
              this.$router.push({ name: 'City', params: { c1: name }})
              return
            }
            const newBoundingCoords = this.calBounding(res.data)
            const newGeo = {
              ...{ map: feature.properties.name, boundingCoords: this.glabalBounding, zlevel: 2 },
              ...this.geoOption
            }
            // newGeo.itemStyle.borderWidth = 3
            option.geo[2] = newGeo
            echarts.registerMap(feature.properties.name, res.data)
            //this.charts.setOption(option)
            option.geo[0].boundingCoords = newBoundingCoords
            option.geo[1].boundingCoords = newBoundingCoords
            option.geo[2].boundingCoords = newBoundingCoords
            option.geo[1].silent = true
            option.geo[1].label.show = false
            this.layer = 2
            this.maps[2] = res.data
            const that = this
            setTimeout(() => {
              that.charts.setOption(option)
              that.showData(2)
            }, 500)
          })
        }
      })
    },
    showCity(name1, name2) {
      const option = this.charts.getOption()
      mapData.features.forEach((feature) => {
        if (feature.properties.name === name1) {
          getCityJson(feature.properties.adcode).then((res) => {
            const that = this
            if (res.data.features.length <= 1) {
              this.$router.push({ name: 'City', params: { c1: name1 }})
              return
            }
            const newBoundingCoords = this.calBounding(res.data)
            const newGeo = {
              ...{ map: feature.properties.name, boundingCoords: this.glabalBounding, zlevel: 1 },
              ...this.geoOption
            }
            if (option.geo[1] == null || option.geo[1].map != newGeo.map) {
              option.geo[1] = newGeo
              echarts.registerMap(feature.properties.name, res.data)
              //this.charts.setOption(option)
              option.geo[0].boundingCoords = newBoundingCoords
              option.geo[1].boundingCoords = newBoundingCoords
              option.geo[0].silent = true
              option.geo[0].label.show = false
              this.glabalBounding2 = newBoundingCoords
              this.maps[1] = res.data
              this.maps[2] = null
              option.series[2] = null
              option.dataset[2] = null
              option.series[3] = null
              option.geo[2] = null
              setTimeout(() => {
                that.charts.setOption(option, true)
                that.showData(1)
              }, 500)
            }
            this.layer = 1
            if (name2 != null && name2 != undefined) {
              setTimeout(() => {
                that.showCity2(name2)
              }, 1000)
            }
          })
        }
      })
    },
    initMap() {
      const that = this
      const tooltip = {
        show: true,
        enterable: true,
        position: function(pos, params, dom, rect, size) {
          var obj = { top: pos[1] + 10, left: pos[0] }
          return obj
        },
        formatter: function(params, ticket, callback) {
          //console.log(params)
          const app = new Vue({
            el: document.createElement('div'),
            render: h => h(Tooltip, { props:
                { name: params.name,
                  value: params.data }
            })
          })
          return app.$el
        }
      }
      this.option.tooltip = tooltip
      this.charts = echarts.init(this.$refs['charts'])
      const boundingCoords = this.calBounding(mapData)
      this.glabalBounding = [[boundingCoords[0][0] + 20, boundingCoords[0][1] - 2], [boundingCoords[1][0] - 20, boundingCoords[1][1] + 17]]
      this.option.dataset = [null, null, null, null, null, null]
      this.option.series = [null, null, null, null, null, null]
      this.option.geo = [
        { ...{ map: 'china',
          boundingCoords: this.glabalBounding,
          zlevel: 0,
          roam: false,
          show: true,
          scaleLimit: {
            min: 1,
            max: 13
          }}, ...this.geoOption }, null, null]
      echarts.registerMap('china', mapData)
      this.charts.setOption(this.option)
      this.showData(0)
      this.charts.on('click', function(param) {
        if (that.layer == 0) {
          that.chosenCity = [param.name]
          that.showCity(param.name, null)
        } else if (that.layer == 1) {
          that.chosenCity = [that.chosenCity[0], param.name]
          that.showCity2(param.name)
        } else {
          // route
          that.$router.push({ name: 'City', params: { c1: that.chosenCity[0], c2: that.chosenCity[1], c3: param.name }})
        }
      })
    }
  }
}
</script>

<style>
*{
    margin:0;
    padding:0;
}
.move_button,
.float {
    position: absolute;
    z-index: 5;
}

.move_button {
    opacity: 0.5;
}

.move_button:hover {
    opacity: 0.8;
}
.el-dropdown-menu__item, .el-menu-item {
  padding-left: 0;
}
.map-tip {
    border: none;
    width: 260px;
    height: 160px;
    padding: 22px 8px 36px 22px;
    background-size: 100% 100%;
}
.map-text {
    overflow: auto;
    height: 100px;
}
.map-text .state-wrap {
    margin-bottom: 6px;
    display: flex;
}
.map-text .time {
    margin-left: 10px;
    margin-right: 10px;
}
</style>
