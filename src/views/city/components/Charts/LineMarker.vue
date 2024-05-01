<template>
  <div style="height: 85%">
    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        {{ text }}<i class="el-icon-arrow-down el-icon--right" style="font-size:12px" />
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="温度">温度</el-dropdown-item>
        <el-dropdown-item command="湿度">湿度</el-dropdown-item>
        <el-dropdown-item command="气压">气压</el-dropdown-item>
        <el-dropdown-item command="风速">风速</el-dropdown-item>
        <el-dropdown-item command="累计降水量">累计降水量</el-dropdown-item>
        <el-dropdown-item command="降水概率">降水概率</el-dropdown-item>
        <el-dropdown-item command="云量">云量</el-dropdown-item>
        <!-- <el-dropdown-item command="气压">气压</el-dropdown-item> -->
        <!-- <el-dropdown-item command="d" disabled>双皮奶</el-dropdown-item>
        <el-dropdown-item command="e" divided>蚵仔煎</el-dropdown-item> -->
      </el-dropdown-menu>
    </el-dropdown>

    <div :id="id" :class="className" :style="{height:height,width:width}" />
  </div>
</template>

<script>
// import echarts from 'echarts'
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    },
    hourly: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      chart: null,
      // temperatureData: [],
      // rainData: [],
      // airPressure: [],
      mp: {},
      x_times: [],
      text: '选择您想查看的数据',
      curAttribute: '温度'
    }
  },
  computed: {
    fix_hourly() {
      return this.hourly
    }
  },
  watch: {
    curAttribute: {
      handler() {
        this.chart.setOption({
          backgroundColor: '#394056',
          title: {
            top: 20,
            text: '24h趋势图',
            textStyle: {
              fontWeight: 'normal',
              fontSize: 16,
              color: '#F1F1F3'
            },
            left: '1%'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              lineStyle: {
                color: '#57617B'
              }
            }
          },
          legend: {
            top: 20,
            icon: 'rect',
            itemWidth: 14,
            itemHeight: 5,
            itemGap: 13,
            data: [this.curAttribute],
            right: '4%',
            textStyle: {
              fontSize: 12,
              color: '#F1F1F3'
            }
          },
          grid: {
            top: 100,
            left: '2%',
            right: '2%',
            bottom: '2%',
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                color: '#57617B'
              }
            },
            data: this.x_times
          }],
          yAxis: [{
            type: 'value',
            name: '',
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#57617B'
              }
            },
            axisLabel: {
              margin: 10,
              textStyle: {
                fontSize: 14
              }
            },
            splitLine: {
              lineStyle: {
                color: '#57617B'
              }
            }
          }],
          series: [{
            name: this.curAttribute,
            type: 'line',
            smooth: true,
            symbol: 'rectangle',
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            areaStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(137, 189, 27, 0.3)'
                }, {
                  offset: 0.8,
                  color: 'rgba(137, 189, 27, 0)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10
              }
            },
            itemStyle: {
              normal: {
                color: 'rgb(137,189,27)',
                borderColor: 'rgba(137,189,2,0.27)',
                borderWidth: 12

              }
            },
            data: this.mp[this.curAttribute]
          }]
        })
      },
      deep: true // Watch changes deeply in the array
    },
    hourly: {
      handler(newVal, oldVal) {
        // this.initChart()
        this.genData()
        this.chart.setOption({
          xAxis: {
            data: this.x_times
          },
          series: [
            {
              data: this.mp[this.curAttribute]
            }
          ]
        })
      },
      deep: true // Watch changes deeply in the array
    }
  },
  mounted() {
    setTimeout(() => {
      this.initChart()
    }, 1000)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    genData() {
      // this.temperatureData = this.hourly.map(data => data.temp)
      // this.rainData = this.hourly.map(data => data.humidity)
      // this.airPressure = this.hourly.map(data => data.pressure)

      this.mp['温度'] = this.hourly.map(data => data.temp)
      this.mp['湿度'] = this.hourly.map(data => data.humidity)
      this.mp['气压'] = this.hourly.map(data => data.pressure)
      this.mp['风速'] = this.hourly.map(data => data.windSpeed)
      this.mp['降水概率'] = this.hourly.map(data => data.pop)
      this.mp['云量'] = this.hourly.map(data => data.cloud)
      this.mp['累计降水量'] = this.hourly.map(data => data.precip)
      // this.mp['气压'] = this.hourly.map(data => data.pressure)
      this.x_times = this.hourly.map((item) => {
        const fxTime = new Date(item.fxTime)
        const hours = fxTime.getHours()
        const timeStr = `${hours}:00`
        return timeStr
      })
    },
    handleCommand(command) {
      // this.$message('click on item ' + command)
      this.curAttribute = command
      this.text = command
    },
    initChart() {
      this.chart = this.$echarts.init(document.getElementById(this.id))
      this.genData()
      this.chart.setOption({
        backgroundColor: '#394056',
        title: {
          top: 20,
          text: '24h趋势图',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 16,
            color: '#F1F1F3'
          },
          left: '1%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: '#57617B'
            }
          }
        },
        legend: {
          top: 20,
          icon: 'rect',
          itemWidth: 14,
          itemHeight: 5,
          itemGap: 13,
          data: [this.curAttribute],
          right: '4%',
          textStyle: {
            fontSize: 12,
            color: '#F1F1F3'
          }
        },
        grid: {
          top: 100,
          left: '2%',
          right: '2%',
          bottom: '2%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#57617B'
            }
          },
          data: this.x_times
        }],
        yAxis: [{
          type: 'value',
          name: '',
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#57617B'
            }
          },
          axisLabel: {
            margin: 10,
            textStyle: {
              fontSize: 14
            }
          },
          splitLine: {
            lineStyle: {
              color: '#57617B'
            }
          }
        }],
        series: [{
          name: this.curAttribute,
          type: 'line',
          smooth: true,
          symbol: 'rectangle',
          symbolSize: 5,
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 1
            }
          },
          areaStyle: {
            normal: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(137, 189, 27, 0.3)'
              }, {
                offset: 0.8,
                color: 'rgba(137, 189, 27, 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(137,189,27)',
              borderColor: 'rgba(137,189,2,0.27)',
              borderWidth: 12

            }
          },
          data: this.mp[this.curAttribute],
          animation: true, // 开启动画效果
          animationEasing: 'elasticOut', // 动画的缓动效果
          animationDuration: 2000 // 动画持续时间
        }]
      })
    }
  }
}
</script>
