<template>
  <div>
    <div style="width: 100%; height: 100vh">
      <div ref="charts" style="width: 100%; height: 100%"></div>
    </div>
    <div class="float" style="width: 100%; height: 100vh; top: 0%; left: 0%" v-if="dataType == '地质'"> 
      <GeoView></GeoView>
    </div>
    <el-menu default-active="0" style="top: 40%; right: 0%; width: 60px; background-color: rgba(0, 0, 0, 0); text-align: center;" class="float" :collapse="true" @select="selectMode">
      <el-radio-group v-model="dataType" size="mini" @input="changeType">
        <el-radio-button label="气象"></el-radio-button>
        <el-radio-button label="地质"></el-radio-button>
      </el-radio-group>
      <div v-for="item in dataTypes" :key="item.index" v-if="dataType == '气象'">
        <el-menu-item :index="String(item.index)">
          <img :src="item.img" style="object-fit: contain; width: 23px;">
          <span slot="title">{{ item.name }}</span>
        </el-menu-item>
      </div>
    </el-menu>
    <div class="float" style="top: 3%; left: 3%; display: flex; align-items: center; justify-content: center; height: 42px" v-if="dataType == '气象'">
      <el-button
        plain
        size="medium"
        style="margin-right: 25px"
        @click="back"
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
      />
      <el-color-picker
        v-model="backgroundColor"
        show-alpha
        :predefine="predefineColors"
        @active-change="colorChange"
      />
      <div id="geoView"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import mapData from '../../assets/jsonData/china.json'
// import cityData from '../../assets/jsonData/city.json'
import citiesData from '../../assets/jsonData/cities.json'
import { getCityJson } from '../../api/staticApi'
import { getCityData, getDataTypes } from '../../api/dataApi'
import Tooltip from '../../views/map/tooltip.vue'
import GeoView from '../../views/map/GeoView.vue'
import Vue from 'vue'
import resize from './mixins/resize'
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
    }
  },
  created() {
    this.$nextTick(() => {
      getDataTypes().then((res) => {
        this.dataTypes = res.data
        this.initMap()
        this.initCities()
      })
    })
  },
  methods: {
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
        type: 'text/plain;charset=utf-8'
      })
      const objectURL = URL.createObjectURL(blob)
      const aTag = document.createElement('a')
      aTag.href = objectURL
      aTag.download = 'centers.txt'
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
      var string = ""
      mapData.features.forEach((feature1) => {
        if (feature1.properties.adcode != 100000) {
          string += "adcode-" + feature1.properties.adcode +
          "-center-" + feature1.properties.center[0] + "-" +
          feature1.properties.center[1] + "\n"
          getCityJson(feature1.properties.adcode).then((res) => {
            res.data.features.forEach((feature2) => {
              string += "adcode-" + feature2.properties.adcode +
              "-center-" + feature2.properties.center[0] + "-" +
              feature2.properties.center[1] + "\n"
              getCityJson(feature2.properties.adcode).then((res1) => {
                res1.data.features.forEach((feature3) => {
                  string += "adcode-" + feature3.properties.adcode +
                  "-center-" + feature3.properties.center[0] + "-" +
                  feature3.properties.center[1] + "\n"
                })
              })
            })
          })
        }
      })
      const that = this
      setTimeout(() => {
        that.getJson(string)
        console.log('start')
      }, 120000)
      */
    },
    colorChange(color) {
      const option = this.charts.getOption()
      option.backgroundColor = color
      this.charts.setOption(option)
    },
    back() {
      const option = this.charts.getOption()
      if (this.layer == 1) {
        this.layer = 0
        this.maps[1] = null
        option.series[1] = null
        option.dataset[1] = null
        option.geo[1] = null
        option.geo[0].boundingCoords = this.glabalBounding
        option.geo[0].silent = false
        option.geo[0].label.show = true
        this.charts.setOption(option, true)
        this.chosenCity = []
      } else if (this.layer == 2) {
        this.layer = 1
        this.maps[2] = null
        option.series[2] = null
        option.dataset[2] = null
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
              setTimeout(() => {
                that.charts.setOption(option,{lazyUpdate: true})
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
      this.option.dataset = [null, null, null]
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
</style>
