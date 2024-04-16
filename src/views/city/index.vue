<template>
  <el-container>
    <el-main>
      <div class="time-menu">
        <el-radio-group v-model="selectedTimeUnit" @change="changeTimeUnit">
          <el-radio label="月">月</el-radio>
          <el-radio label="季度">季度</el-radio>
          <el-radio label="年">年</el-radio>
        </el-radio-group>
      </div>
      <div class="figure-container">
        <div id="figure" class="chart" />
        <!-- 时间粒度切换菜单内容 -->
      </div>
    </el-main>
    <el-aside />
  </el-container>
</template>

<script>
// from 'echarts' import *  as echarts

export default {
  name: 'City',
  data() {
    return {
      // echart数据部分
      temperatureData: [],
      pressureData: [],
      rainData: [],
      windData: [],
      earthData: [],
      // displayAttributeList: [],  echart直接集成了点击不同图标的显示
      eventProbabilityList: [],
      // x轴的时间选项  希望可以切换时间粒度的展示
      timeOps: [],
      selectedTimeUnit: ' ',

      // 灾害分析部分
      like: true,
      value1: 4154.564,
      value2: 1314,
      title: '增长人数'
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
    changeTimeUnit() {
      this.updateXAxisData()
      this.genData() // 根据新的 x 轴长度生成新的随机数据
      this.$echarts.init(document.getElementById('figure')).setOption({
        xAxis: {
          data: this.timeOps
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
      })
    },
    updateXAxisData() {
      // 根据选中的时间粒度更新 x 轴数据
      switch (this.selectedTimeUnit) {
        case '月':
          this.timeOps = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
          break
        case '季度':
          this.timeOps = ['第一季度', '第二季度', '第三季度', '第四季度']
          break
        case '年':
          this.timeOps = ['2019年', '2020年', '2021年', '2022年', '2023年']
          break
        default:
          break
      }
    },
    genData() {
      // 生成与时间粒度相匹配的新随机数据
      const getRandomData = () => {
        return Array.from({ length: this.timeOps.length }, () => Math.floor(Math.random() * 100))
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
.el-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.time-menu {
  flex: 0 0 auto; /* 不要随着容器的大小改变而改变 */
  margin-right: 20px; /* 间距调整 */
}

.figure-container {
  flex: 1; /* 填充剩余空间 */
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
  background-color: #f0f0f0;
}

.el-aside {
  flex: 0 0 auto; /* 不要随着容器的大小改变而改变 */
  width: 200px;
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
  line-height: 200px;
}
</style>
