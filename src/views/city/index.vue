<template>
  <el-main>
    <div class="figure-container">
      <div id="figure" class="chart" />
      <div id="figure-kind-menu" class="menu">
        <!-- 图形类型切换菜单内容 -->
      </div>
      <div id="figure-kind-menu" class="menu">
        <!-- 图形类型切换菜单内容 -->
      </div>
      <div id="time-menu" class="menu">
        <!-- 时间粒度切换菜单内容 -->
      </div>
    </div>
  </el-main>
</template>

<script>
// from 'echarts' import *  as echarts

export default {
  name: 'City',
  data() {
    return {
      // 数据
      temperatureData: [],
      pressureData: [],
      rainData: [],
      windData: [],
      earthData: [],
      // displayAttributeList: [],  echart直接集成了点击不同图标的显示
      eventProbabilityList: [],
      // x轴的时间选项  希望可以切换时间粒度的展示
      timeOps: []
    }
  },
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      // 使用 echarts 初始化图表
      const chartDom = document.getElementById('figure')
      const myChart = this.$echarts.init(chartDom)
      // 使用 this.displayAttributeList 和 this.temperatureData 等数据设置图表
      this.genData()// 数据在option的键值对赋值时就已经挂载 所以需要提前准备数据
      const option = {
        title: {
          // text: '城市气象数据可视化',
          // subtext: '示例图表'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['气温', '压力', '降雨', '风速']
        },
        xAxis: {
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '气温',
            type: 'line',
            data: this.temperatureData
          },
          {
            name: '压力',
            type: 'line',
            data: this.pressureData
          },
          {
            name: '降雨',
            type: 'line',
            data: this.rainData
          },
          {
            name: '风速',
            type: 'line',
            data: this.windData
          }
        ]
      }

      myChart.setOption(option)
    },
    genData() {
    // 生成随机数据
      const getRandomData = () => {
        return Array.from({ length: 12 }, () => Math.floor(Math.random() * 100))
      }

      this.temperatureData = getRandomData()
      this.pressureData = getRandomData()
      this.rainData = getRandomData()
      this.windData = getRandomData()
      this.earthData = getRandomData()
    }
  }
}
</script>

<style lang="less" scoped>
.figure-container {
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
}

.chart {
  width: 60%;
  height: 500px;
}

.menu {
  width: 20%;
  height: 500px;
  background-color: #f0f0f0;
}
</style>
