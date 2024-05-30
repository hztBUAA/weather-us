<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: '2-chart'
    },
    id: {
      type: String,
      default: '2-chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '200px'
    },
    city: {
      type: String,
      default: '北京'
    }
  },
  data() {
    return {
      chart: null,
      mp: {}
    }
  },
  watch: {
    city(newValue, oldValue) {
    // 当城市数据发生变化时，调用 genData 方法重新生成数据
      this.genData()
      // console.log('change value')
      this.initChart()
      // this.$forceUpdate()
      // this.chart.setOption({
      //   series: [
      //     {
      //       name: '降水量',
      //       data: this.mp['降水量']
      //     },

      //     {
      //       name: '灾害频率',
      //       data: this.mp['灾害频率']
      //     }, {
      //       name: '温度',
      //       data: this.mp['温度']
      //     }
      //   ]
      // }, true)
    }
    // mp: {
    //   handler(newValue, oldValue) {
    //   // 当 this.mp 发生变化时，调用 genData 方法重新生成数据
    //     // this.genData()
    //     this.$forceUpdate()
    //   },
    //   deep: true
    // }
  },
  mounted() {
    this.genData()
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
      const temperature = []
      const disasterFrequency = []
      const precipitation = []

      for (let i = 0; i < 12; i++) {
        // 生成温度数据
        let temp = 0
        if (i >= 5 && i <= 8) { // 夏季温度较高
          temp = Math.round(Math.random() * 10 + 25) // 夏季平均气温在25-35摄氏度之间
        } else { // 冬春温度较低
          temp = Math.round(Math.random() * 10 + 5) // 冬春平均气温在5-15摄氏度之间
        }
        temperature.push(temp)

        // 生成灾害频率数据
        let frequency = 0
        if (i <= 3 || i >= 11) { // 冬春季节灾害频率较高
          frequency = Math.round(Math.random() * 3 + 1) // 冬春平均灾害次数在1-4之间
        } else {
          frequency = Math.round(Math.random() * 2) // 其他季节平均灾害次数在0-2之间
        }
        disasterFrequency.push(frequency)

        // 生成降水量数据
        let rain = 0
        if (i >= 5 && i <= 8) { // 夏季降水量较多
          rain = Math.round(Math.random() * 200 + 100) // 夏季降水量在100-300毫米之间
        } else { // 冬春降水量较少
          rain = Math.round(Math.random() * 50) // 冬春降水量在0-50毫米之间
        }
        precipitation.push(rain)
      }
      // 12个月的平均气温
      this.mp['温度'] = temperature
      this.mp['灾害频率'] = disasterFrequency
      this.mp['降水量'] = precipitation
    },
    initChart() {
      this.chart = this.$echarts.init(document.getElementById(this.id))
      const xData = (function() {
        const data = []
        for (let i = 1; i < 13; i++) {
          data.push(i + '月')
        }
        return data
      }())
      this.chart.setOption({
        backgroundColor: '#344b58',
        title: {
          text: '历史数据(2023年)',
          x: '20',
          top: '20',
          textStyle: {
            color: '#fff',
            fontSize: '22'
          },
          subtextStyle: {
            color: '#90979c',
            fontSize: '16'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            textStyle: {
              color: '#fff'
            }
          },
          formatter(params) {
            let text = params[0].name + '<br/>'
            params.forEach(param => {
              if (param.seriesName === '降水量') {
                text += param.marker + param.seriesName + ' : ' + param.value + ' mm<br/>'
              } else if (param.seriesName === '灾害频率') {
                text += param.marker + param.seriesName + ' : ' + param.value + ' 次<br/>'
              } else if (param.seriesName === '温度') {
                text += param.marker + param.seriesName + ' : ' + param.value + ' ℃<br/>'
              }
            })
            return text
          }
        },
        grid: {
          left: '5%',
          right: '5%',
          borderWidth: 0,
          top: 150,
          bottom: 95,
          textStyle: {
            color: '#fff'
          }
        },
        legend: {
          x: '5%',
          top: '10%',
          textStyle: {
            color: '#90979c'
          },
          data: ['降水量', '灾害频率', '温度']
        },
        calculable: true,
        xAxis: [{
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitArea: {
            show: false
          },
          axisLabel: {
            interval: 0

          },
          data: xData
        }],
        yAxis: [{
          type: 'value',
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0
          },
          splitArea: {
            show: true
          }
        }],
        dataZoom: [{
          show: true,
          height: 30,
          xAxisIndex: [
            0
          ],
          bottom: 30,
          start: 10,
          end: 80,
          handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
          handleSize: '110%',
          handleStyle: {
            color: '#d3dee5'

          },
          textStyle: {
            color: '#fff' },
          borderColor: '#90979c'

        }, {
          type: 'inside',
          show: true,
          height: 15,
          start: 1,
          end: 35
        }],
        series: [
          {
            name: '降水量',
            type: 'bar',
            // stack: 'total',
            barMaxWidth: 35,
            barGap: '10%',
            itemStyle: {
              normal: {
                color: 'rgba(255,144,128,1)',
                label: {
                  show: true,
                  textStyle: {
                    color: '#fff'
                  },
                  position: 'insideTop',
                  formatter(p) {
                    return p.value > 0 ? p.value : ''
                  }
                }
              }
            },
            data: this.mp['降水量']
          },

          {
            name: '灾害频率',
            type: 'bar',
            stack: 'total',
            itemStyle: {
              normal: {
                color: 'rgba(0,191,183,1)',
                barBorderRadius: 0,
                label: {
                  show: true,
                  position: 'top',
                  formatter(p) {
                    return p.value > 0 ? p.value : ''
                  }
                }
              }
            },
            data: this.mp['灾害频率']
          }, {
            name: '温度',
            type: 'line',
            stack: 'total',
            symbolSize: 10,
            symbol: 'circle',
            itemStyle: {
              normal: {
                color: 'rgba(252,230,48,1)',
                barBorderRadius: 0,
                label: {
                  show: true,
                  position: 'top',
                  formatter(p) {
                    return p.value > 0 ? p.value : ''
                  }
                }
              }
            },
            data: this.mp['温度']
          }
        ]
      })
    }
  }
}
</script>
