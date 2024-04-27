<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
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
      temperatureData: [],
      rainData: [],
      airPressure: [],
      x_times: []
    }
  },
  mounted() {
    this.initChart()
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
      // const new_t = [12, 13, 23, 34, 23, 25, 19, 20, 17, 14, 16, 11]
      // const new_p = [2, 3, 3, 4, 2, 5, 9, 2, 7, 4, 6, 1]
      // const new_r = [12, 13, 23, 34, 23, 25, 19, 20, 17, 14, 16, 11]
      this.temperatureData = this.hourly.map(data => data.temp)
      this.rainData = this.hourly.map(data => data.humidity)
      this.airPressure = this.hourly.map(data => data.pressure)
      this.x_times = this.hourly.map((item) => {
        const fxTime = new Date(item.fxTime)
        const hours = fxTime.getHours()
        const timeStr = `${hours}:00`
        return timeStr
      })
      // const formattedData = hourlyData.map( => {
      //   const fxTime = new Date(item.fxTime)
      //   const hours = fxTime.getHours()
      //   const minutes = fxTime.getMinutes()
      //   const timeStr = `${hours}:${minutes < 10 ? '0' + minutes : minutes}`
      //   return {
      //     ...item,
      //     fxTime: timeStr
      //   }
      // })
    },
    initChart() {
      this.chart = this.$echarts.init(document.getElementById(this.id))
      this.genData()
      this.chart.setOption({
        backgroundColor: '#394056',
        title: {
          top: 20,
          text: '城市数据图',
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
          data: ['气温', '湿度', '气压'],
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
          name: '气温',
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
          data: this.temperatureData
        }, {
          name: '湿度',
          type: 'line',
          smooth: true,
          symbol: 'circle',
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
                color: 'rgba(0, 136, 212, 0.3)'
              }, {
                offset: 0.8,
                color: 'rgba(0, 136, 212, 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(0,136,212)',
              borderColor: 'rgba(0,136,212,0.2)',
              borderWidth: 12

            }
          },
          data: this.rainData
          // [220, 182, 191, 134, 150, 120, 110, 125, 145, 122, 165, 122]   12个
        }, {
          name: '气压',
          type: 'line',
          smooth: true,
          symbol: 'triangle',
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
                color: 'rgba(219, 50, 51, 0.3)'
              }, {
                offset: 0.8,
                color: 'rgba(219, 50, 51, 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(219,50,51)',
              borderColor: 'rgba(219,50,51,0.2)',
              borderWidth: 12
            }
          },
          data: this.airPressure
          // [220, 182, 191, 134, 150, 120, 110, 125, 145, 122, 165, 122]
        }]
      })
    }
  }
}
</script>
