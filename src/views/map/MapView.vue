<template>
  <div>
    <div ref="charts" style="width: 100%; height: 100vh" />
    <el-menu default-active="0" style="top: 40%; right: 0%; width: 60px; background-color: rgba(0, 0, 0, 0); text-align: center;" class="float" @select="selectMode" :collapse="true">
      <div v-for="item in dataTypes.slice(0, 5)" :key="item.index">
        <el-menu-item :index="String(item.index)">
          <i class="el-icon-sunny"></i>
          <span slot="title">{{ item.type }}</span>
        </el-menu-item>
      </div>
      <el-submenu index="-1">
        <template slot="title">
          <i class="el-icon-menu"></i>
        </template>
        <el-menu-item-group>
          <span slot="title">更多选项</span>
          <div v-for="item in dataTypes.slice(5)" :key="item.index">
            <el-menu-item :index="String(item.index)">
              <i class="el-icon-sunny"></i>
              <span slot="title">{{ item.type }}</span>
            </el-menu-item>
          </div>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
    <div class="float" style="top: 3%; left: 3%; display: flex; align-items: center; justify-content: center; height: 42px">
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
      <el-date-picker
        style="margin-right: 25px"
        v-model="date"
        type="datetime"
        @change="chooseDate"
        placeholder="选择日期"
        value-format="yyyy-MM-dd-HH">
      </el-date-picker>
      <el-color-picker
        v-model="backgroundColor"
        show-alpha
        :predefine="predefineColors"
        @active-change="colorChange"
      />
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
      color: '#eee'
    }
  },
  itemStyle: {
    areaColor: '#rgb(147, 235, 248)'
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
    areaColor: '#rgb(147, 235, 248)'
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
  animation: false,
  animationDuration: 0,
  animationDurationUpdate: 0,
  backgroundColor: '#cccccc',
}
export default {
  data() {
    return {
      backgroundColor: '#cccccc',
      predefineColors: predefineColors,
      emphasis: emphasis,
      geoOption: geoOption,
      option: option,
      charts: null,
      layer: 0,
      glabalBounding: [],
      glabalBounding2: [],
      maps: [mapData, null, null],
      cities: [],
      chosenCity: [],
      dataTypes: [],
      typeIndex: 0,
      date: null,
      lastDate: null
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
    chooseDate() {
      if (this.date != this.lastDate) {
        this.showData(0);
        if (this.maps[1] != null && this.maps[1] != undefined) {
          this.showData(1);
        }
        if (this.maps[2] != null && this.maps[2] != undefined) {
          this.showData(2);
        }
      } 
    },
    getJson(json) {
      const stringData = JSON.stringify(json, null, 2)
      const blob = new Blob([stringData], {
        type: 'application/json'
      })
      const objectURL = URL.createObjectURL(blob)
      const aTag = document.createElement('a')
      aTag.href = objectURL
      aTag.download = 'centers.json'
      aTag.click()
      URL.revokeObjectURL(objectURL)
    },
    selectMode(index) {
      console.log(index)
      if (index == this.typeIndex || index == -1) {
        return
      } else {
        this.typeIndex = index
        const that = this
        const formatter = function(params, ticket, callback) {
          //console.log(params)
          var link = '';
          link = '<div>' + params.name + "<br/>" + that.dataTypes[that.typeIndex].type + ' : ' + params.value + '<br/>' +
            '<a href="#/city/index">查看详情</a>' +
            '</div>';
          return link;
        }
        var option = this.charts.getOption()
        option.tooltip.formatter = formatter
        this.charts.setOption(option, true)
        this.changeMode()
      }
    },
    changeMode() {
      this.showData(0)
      if (this.maps[1] != null && this.maps[1] != undefined) {
        this.showData(1)
      }
      if (this.maps[2] != null && this.maps[2] != undefined) {
        this.showData(2)
      }
    },
    initCities() {
      this.cities = citiesData
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
    async getAllData(type, geoIndex) {
      const data = []
      const adcodes = []
      this.maps[geoIndex].features.forEach(function(feature) {
        adcodes.push(feature.properties.adcode)
      })
      getCityData(adcodes, type, this.date).then((res) => {
        this.maps[geoIndex].features.forEach(function(feature) {
          data.push({ name: feature.properties.name, value: res.get(feature.properties.adcode) })
        })
      })
      return data
    },
    showData(geoIndex) {
      var option = this.charts.getOption()
      this.getAllData(this.dataTypes[this.typeIndex].type, geoIndex).then((res) => {
        const series = option.series
        series[geoIndex] = {
          type: 'map',
          geoIndex: geoIndex,
          data: res,
          select: {
            disabled: true
          }
        }
        option = { ...option, ...{
          visualMap: {
            type: 'continuous',
            min: this.dataTypes[this.typeIndex].valueRange[0],
            max: this.dataTypes[this.typeIndex].valueRange[1],
            left: '6%',
            bottom: '5%',
            itemWidth: 30,
            itemHeight: 180,
            inRange: {
              color: this.dataTypes[this.typeIndex].colorRange
            },
            text: [this.dataTypes[this.typeIndex].valueRange[1], this.dataTypes[this.typeIndex].valueRange[0]],
            zlevel: 3
          },
          series: series
        }}
        this.charts.setOption(option, true)
      })
    },
    chooseCity(city) {
      this.showCity(city[0], city[1])
    },
    showCity2(name) {
      const option = this.charts.getOption()
      this.maps[1].features.forEach((feature) => {
        if (feature.properties.name === name) {
          getCityJson(feature.properties.adcode).then((res) => {
            if (res.data.features.length <= 1) {
              // route
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
            this.charts.setOption(option)
            option.geo[0].boundingCoords = newBoundingCoords
            option.geo[1].boundingCoords = newBoundingCoords
            option.geo[2].boundingCoords = newBoundingCoords
            option.geo[1].silent = true
            option.geo[1].label.show = false
            this.charts.setOption(option)
            this.layer = 2
            this.maps[2] = res.data
            this.showData(2)
          })
        }
      })
    },
    showCity(name1, name2) {
      const option = this.charts.getOption()
      mapData.features.forEach((feature) => {
        if (feature.properties.name === name1) {
          getCityJson(feature.properties.adcode).then((res) => {
            if (res.data.features.length <= 1) {
              // route
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
              this.charts.setOption(option)
              option.geo[0].boundingCoords = newBoundingCoords
              option.geo[1].boundingCoords = newBoundingCoords
              option.geo[0].silent = true
              option.geo[0].label.show = false
              this.charts.setOption(option)
              this.glabalBounding2 = newBoundingCoords
              this.maps[1] = res.data
              this.maps[2] = null
              this.showData(1)
            }
            this.layer = 1
            if (name2 != null && name2 != undefined) {
              this.showCity2(name2)
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
        position: function (pos, params, dom, rect, size) {
          var obj = {top: pos[1] + 10, left: pos[0]};
          return obj;
        },
        formatter: function(params, ticket, callback) {
          //console.log(params)
          var link = '';
          link = '<div>' + params.name + "<br/>" + that.dataTypes[that.typeIndex].type + ' : ' + params.value + '<br/>' +
            '<a href="#/city/index">查看详情</a>' +
            '</div>';
          return link;
        }
      }
      this.option.tooltip = tooltip
      this.charts = echarts.init(this.$refs['charts'])
      const boundingCoords = this.calBounding(mapData)
      this.glabalBounding = [[boundingCoords[0][0] + 20, boundingCoords[0][1] - 2], [boundingCoords[1][0] - 20, boundingCoords[1][1] + 17]]
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
</style>
