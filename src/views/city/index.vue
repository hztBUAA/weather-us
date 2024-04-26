<template>
  <div class="forecast-table">
    <div class="container">
      <h1>
        七日预报信息
      </h1>
      <div class="forecast-container">
        <div class="today forecast">
          <div class="forecast-header">
            <div class="day">Monday</div>
            <div class="date">6 Oct</div>
          </div> <!-- .forecast-header -->
          <div class="forecast-content">
            <div class="location">New York</div>
            <div class="degree">
              <div class="num">23<sup>o</sup>C</div>
              <div class="forecast-icon">
                <img src="./images/icons/icon-1.svg" alt="" width="90">
              </div>
            </div>
            <span><img src="./images/icon-umberella.png" alt="">20%</span>
            <span><img src="./images/icon-wind.png" alt="">18km/h</span>
            <span><img src="./images/icon-compass.png" alt="">East</span>
          </div>
        </div>
        <div class="forecast">
          <div class="forecast-header">
            <div class="day">Tuesday</div>
          </div> <!-- .forecast-header -->
          <div class="forecast-content">
            <div class="forecast-icon">
              <img src="./images/icons/icon-3.svg" alt="" width="48">
            </div>
            <div class="degree">23<sup>o</sup>C</div>
            <small>18<sup>o</sup></small>
          </div>
        </div>
        <div class="forecast">
          <div class="forecast-header">
            <div class="day">Wednesday</div>
          </div> <!-- .forecast-header -->
          <div class="forecast-content">
            <div class="forecast-icon">
              <img src="./images/icons/icon-5.svg" alt="" width="48">
            </div>
            <div class="degree">23<sup>o</sup>C</div>
            <small>18<sup>o</sup></small>
          </div>
        </div>
        <div class="forecast">
          <div class="forecast-header">
            <div class="day">Thursday</div>
          </div> <!-- .forecast-header -->
          <div class="forecast-content">
            <div class="forecast-icon">
              <img src="./images/icons/icon-7.svg" alt="" width="48">
            </div>
            <div class="degree">23<sup>o</sup>C</div>
            <small>18<sup>o</sup></small>
          </div>
        </div>
        <div class="forecast">
          <div class="forecast-header">
            <div class="day">Friday</div>
          </div> <!-- .forecast-header -->
          <div class="forecast-content">
            <div class="forecast-icon">
              <img src="./images/icons/icon-12.svg" alt="" width="48">
            </div>
            <div class="degree">23<sup>o</sup>C</div>
            <small>18<sup>o</sup></small>
          </div>
        </div>
        <div class="forecast">
          <div class="forecast-header">
            <div class="day">Saturday</div>
          </div> <!-- .forecast-header -->
          <div class="forecast-content">
            <div class="forecast-icon">
              <img src="./images/icons/icon-13.svg" alt="" width="48">
            </div>
            <div class="degree">23<sup>o</sup>C</div>
            <small>18<sup>o</sup></small>
          </div>
        </div>
        <div class="forecast">
          <div class="forecast-header">
            <div class="day">Sunday</div>
          </div> <!-- .forecast-header -->
          <div class="forecast-content">
            <div class="forecast-icon">
              <img src="./images/icons/icon-14.svg" alt="" width="48">
            </div>
            <div class="degree">23<sup>o</sup>C</div>
            <small>18<sup>o</sup></small>
          </div>
        </div>
      </div>
    </div>
    <div class="hourly-info">
      <h1>
        逐三小时信息
      </h1>
      <div class="chart-container">
        <chart height="100%" width="100%" />
      </div>
    </div>
    <div class="event-info">
      <h1>
        城市灾害预警通知
      </h1>
      <div>
        <h1>test for api:</h1>
        <p>
          {{ wt_data.code }}
        </p>
      </div>
      <!-- 可以放置进度图 表示可能性   以及饼状图 -->
    </div>

  </div>

</template>

<script>
import Axios from 'axios'
// import BoxCard from './components/BoxCard.vue'
// from 'echarts' import *  as echarts
// import LineChart from './components/LineChart'
// import PanelGroup from './components/PanelGroup'
// import TodayWeather from './components/todayWeather'
import Chart from './components/Charts/LineMarker.vue'
const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}
const we = {
  hourly: [
    { time: '00:00', temp: 20, img: 'sunny' },
    { time: '01:00', temp: 21, img: 'cloudy' }
    // 添加更多的小时数据...
  ],
  index: [
    { name: '舒适度', value: '舒适' },
    { name: '紫外线指数', value: '强' }
    // 添加更多的指数数据...
  ],
  daily: [
    { date: '2024-04-25', tempMax: 25, tempMin: 15, imgDay: 'sunny', imgNight: 'clear-night' },
    { date: '2024-04-26', tempMax: 28, tempMin: 18, imgDay: 'partly-cloudy-day', imgNight: 'partly-cloudy-night' }
    // 添加更多的未来天气数据...
  ]
}

// const mockData = {
//   temp: 25,
//   pm25: 35,
//   quality: '优',
//   level: '良',
//   weatherImg: 'sun',
//   weather: '晴',
//   winddirect: '东风',
//   humidity: 50
// }

export default {
  name: 'City',
  components: {
    Chart
    // LineChart,
    // PanelGroup,
    // BoxCard
    // TodayWeather
  },
  data() {
    return {
      wt_data: [],
      // echart数据部分
      temperatureData: [],
      pressureData: [],
      rainData: [],
      windData: [],
      earthData: [],
      lineChartData: lineChartData.newVisitis,
      // displayAttributeList: [],  echart直接集成了点击不同图标的显示
      eventProbabilityList: [],
      // x轴的时间选项  希望可以切换时间粒度的展示
      timeOps: [],
      selectedTimeUnit: ' ',

      // 灾害分析部分
      like: true,
      value1: 4154.564,
      value2: 1314,
      title: '增长人数',

      // weather api data
      we: we
    }
  },
  mounted() {
    // this.initChart()
    this.getApi1()
  },
  methods: {
    getApi1() {
      const url = 'https://geoapi.qweather.com/v2/city/lookup?location=beij&key=3ca6d5e357a5470abf168dbcd8fe0fd7'
      const object = {
        location: 'beij',
        key: '3ca6d5e357a5470abf168dbcd8fe0fd7'
      }
      var _this = this
      Axios.get(url, object).then(
        function(res) {
          var result = res.data
          _this.wt_data = result
          console.log(result)
        }
      )
    },

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
  background: #f0f0f0;
}

.chart {
  width: 80%;
  height: 500px;
}

.menu {
  width: 20%;
  background-color: #f0f0f0;
}

//.el-aside {
//  flex: 0 0 auto; /* 不要随着容器的大小改变而改变 */
//  width: 200px;
//  background-color: #f0f0f0;
//  color: #120f0f;
 // text-align: center;
 // line-height: 200px;
//}
.el-main{
    position: relative;
  padding: 32px;
  background-color: rgb(240, 242, 245);
}

#sun{

  height:calc(100vh - 95px);
  width: 100%;
  /* background: url('@/assets/阳光_51f84c3.png') no-repeat; */
  /* background: url('@/assets/阳光_51f84c3.png') no-repeat; */
}

// #box1 {
//     width: 799px;
//     height: 188px;
//     margin-left: auto;
//     margin-right: auto;
//     font-size: 15px;
//     font-family: '微软雅黑';
//     padding: 30px;
//     color:#ffffff;
//     // background-color: rgb(218, 82, 82);
// }

.forecast-container {
	width: 100%;
	background: #323544;
	display: table;
	table-layout: fixed;
	width: 100%;
	overflow: hidden;
	border-radius: 10px;
	// margin-top: -1px;
	margin-bottom: 50px;
}

.forecast-container .forecast {
	display: table-cell;
	vertical-align: top;
}

.forecast-container .forecast:nth-child(even) {
	background-color: #262936;
}

@media screen and (max-width: 990px) {
	.forecast-container .forecast {
		display: block;
		width: 16.6667%;
		float: left;
	}
}

.forecast-container .forecast.today {
	width: 420px;
}

.forecast-container .forecast.today .forecast-header:after {
	content: " ";
	clear: both;
	display: block;
	overflow: hidden;
	height: 0;
}

.forecast-container .forecast.today .forecast-header .day {
	float: left;
}

.forecast-container .forecast.today .forecast-header .date {
	float: right;
}

.forecast-container .forecast.today .forecast-content {
	text-align: left;
	padding-top: 30px;
	padding-bottom: 30px;
}

.forecast-container .forecast.today .location {
	font-size: 18px;
	font-size: 1.2857142857em;
	font-weight: 400;
}

.forecast-container .forecast.today .degree .num,
.forecast-container .forecast.today .degree .forecast-icon {
	display: inline-block;
	vertical-align: middle;
}

.forecast-container .forecast.today .degree .num {
	font-size: 90px;
	font-size: 6.4285714286rem;
	margin-right: 30px;
}

.forecast-container .forecast.today span {
	margin-right: 20px;
}

.forecast-container .forecast.today span img {
	margin-right: 5px;
	vertical-align: middle;
}

@media screen and (max-width: 990px) {
	.forecast-container .forecast.today {
		display: block;
		width: 100%;
	}
}

.forecast-container .forecast .forecast-header {
	background: rgba(0, 0, 0, 0.1);
	padding: 10px;
	text-align: center;
	font-weight: 400;
}

.forecast-container .forecast .forecast-icon {
	height: 50px;
}

.forecast-container .forecast .forecast-content {
	padding: 50px 20px 10px;
	text-align: center;
}

.forecast-container .forecast .forecast-content .forecast-icon {
	margin-bottom: 20px;
}

.forecast-container .forecast .forecast-content .degree {
	font-size: 24px;
	font-size: 1.7142857143em;
	color: white;
	font-weight: 700;
}

.forecast-container .forecast .forecast-content small {
	font-size: 16px;
	font-size: 1.1428571429em;
}

.chart-container{
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
}

</style>
