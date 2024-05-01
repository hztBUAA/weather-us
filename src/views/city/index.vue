<template>

  <div class="forecast-table">
    <div style="display: flex; width: 100%;">
      <input v-model="location" type="text" class="search-input" style="flex: 1;">
      <button class="search-button" style="flex: 0 0 auto;" @click="submitLocation">搜索</button>
    </div>

    <!-- <div class="current-weather">
      <current-info />
    </div> -->
    <div class="current-weather center">
      <h1>当前天气</h1>
      <hr>
      <!-- <img src="./images/sunny.png" alt=""> -->
      <div class="current-panel mb-4">
        <h1 class="" style="font-size:48px;left:150px;position:absolute">
          {{ fixed_location }}
        </h1>
        <div class="mb-4">
          {{ cur.temp }}<sup>o</sup>C
        </div>
        <div class="mb-4">
          {{ cur.text }}
        </div>
        <div class="mb-4">
          <!-- <img src="./images/icon-compass.png" alt=""> -->
          <i class="qi-2208" style="font-size:16px;margin-right:4px" />{{ cur.windDir }}
        </div>
        <div class="mb-4">
          <i class="qi-2120" style="font-size:16px;margin-right:4px" />{{ cur.humidity }}%
        </div>
        <div />
      </div>

    </div>

  </div>

</template>

<script>
import Axios from 'axios'
import Chart from './components/Charts/LineMarker.vue'
// import CurrentInfo from './components/CurrentInfo.vue'
export default {
  name: 'City',
  components: {
    Chart
    // CurrentInfo
    // LineChart,
    // PanelGroup,
    // BoxCard
    // TodayWeather
  },
  data() {
    return {
      location: '北京',
      fixed_location: '北京',
      days_7: [1, 2, 3],
      hourly: [],
      cur: {},
      wt_data: [],
      events: {},
      warning_title: '',
      warning_type: '',
      show_days_7: false
      // 灾害分析部分
      // like: true,
      // value1: 4154.564,
      // value2: 1314,
      // title: '增长人数',
    }
  },
  watch: {
    hourly: {
      handler(newVal) {
        this.$forceUpdate()
      },
      deep: true // 深度监听hourly对象内部属性的变化
    },
    days_7: {
      handler(oldVal, newVal) {
        if (newVal !== oldVal) {
          this.show_days_7 = false
          // this.showdom = true
        } else {
          this.show_days_7 = true
        }
      },
      deep: true
    }

  },

  mounted() {
    this.requestForData().then(() => {
      console.log(this.days_7)
      console.log(this.hourly)
    })
  },
  methods: {
    async requestForData() {
      // 问题解决  需要把getApi的异步进行阻塞  否则 js会先执行后面的  导致location没有数组索引！！
      // 关于异步  js运行的单线程  需要进一步有时间了解一下！
      let locationId
      // !箭头函数的问题
      await this.getApi1().then(() => {
        locationId = this.wt_data.location[0].id
      }
      )
      console.log(locationId, 'locationId')

      // 当前实时天气
      const res = await Axios.get(
        `https://devapi.qweather.com/v7/weather/now?location=${locationId}&key=3ca6d5e357a5470abf168dbcd8fe0fd7`
      )
      this.cur = res.data.now
      // res => {
      //   this.cur = res.data.now
      // },
      this.$forceUpdate() // 强制更新组件

      // 七日天气
      console.log(locationId, 'locationID')
      // console.log(params)
      const res_location = await Axios.get(
        `https://devapi.qweather.com/v7/weather/7d?location=${locationId}&key=3ca6d5e357a5470abf168dbcd8fe0fd7`
      )
      // this.days_7 = res_location.data.daily
      this.days_7 = res_location.data.daily
      this.days_7.forEach(item => {
        const weekday = this.getWeekday(item.fxDate)
        this.$set(item, 'weekday', weekday)
        this.$forceUpdate()
      })
      // this.$forceUpdate()
      // 小时天气
      const res_hourly = await Axios.get(
        `https://devapi.qweather.com/v7/weather/24h?location=${locationId}&key=3ca6d5e357a5470abf168dbcd8fe0fd7`)
      this.hourly = res_hourly.data.hourly
      // 灾害预警
      const res_event = await Axios.get(
        `https://devapi.qweather.com/v7/warning/now?location=${locationId}&key=3ca6d5e357a5470abf168dbcd8fe0fd7`
      )
      this.events = res_event.data.warning
      console.log('events', this.events)
      this.warning_title = this.events.length > 0 ? '！有灾害' : '一切正常'
      this.warning_type = this.events.length > 0 ? 'warning' : 'success'
      console.log(this.warning_title, this.warning_type, 'warning')
      this.$forceUpdate()
    },
    async submitLocation() {
      this.requestForData()
      console.log(this.days_7)
    },

    getWeekday(dateString) {
      const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      const date = new Date(dateString)
      const weekday = days[date.getDay()]
      return weekday
    },
    async getApi1() {
      const url = 'https://geoapi.qweather.com/v2/city/lookup'
      const params = {
        location: this.location,
        key: '3ca6d5e357a5470abf168dbcd8fe0fd7'
      }
      const _this = this
      await Axios.get(url, { params })
        .then(res => {
          _this.wt_data = res.data
          // console.log(res.d)
        })
        .catch(err => {
          console.error(err)
        })
      this.fixed_location = this.wt_data.location[0].name
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
	background: #F6F5F2;
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
	background-color: #FEFBF6;
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
	// color: #5BBCFF;
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

i{
  font-size: 48px;
}
.center{
  text-align: center;
}
.mb-4{
  margin-bottom: 16px;
}
.current-weather {
  background-color: #f0f0f0;
  border-radius: 5px;
  text-align: center;
}

.current-panel {
  // background-color: #fff;
  background-image: url(./images/sunny.png);
  background-size: 100%;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(26, 12, 12, 0.1);
}

hr {
    border: 0;
    padding-top: 10px;
    color: #d0d0d5;
    border-top: 1px solid rgba(0,0,0,.1);
    box-shadow: inset 0 10px 10px -10px;
}

h1{
  text-align: left;
  font-size: 16px;
}

.forecast-table{
  padding: 20px;
}

.event-title{
  border-radius: 9px;
  background: #c3c6cb;
}
.event-text{
  border-radius: 9px;
  background: #FFE4CF;
  opacity: 50%;

}

.search-input {
  padding: 8px 12px; /* 内边距 */
  font-size: 16px; /* 字体大小 */
  border: 1px solid #ccc; /* 边框 */
  border-radius: 4px; /* 圆角 */
  outline: none; /* 去掉默认的焦点样式 */
}

/* 输入框聚焦样式 */
.search-input:focus {
  border-color: dodgerblue; /* 聚焦时的边框颜色 */
  box-shadow: 0 0 5px dodgerblue; /* 聚焦时的阴影效果 */
}

/* 按钮样式 */
.search-button {
  padding: 8px 16px; /* 内边距 */
  font-size: 16px; /* 字体大小 */
  background-color: dodgerblue; /* 背景色 */
  color: white; /* 文字颜色 */
  border: none; /* 去掉边框 */
  border-radius: 4px; /* 圆角 */
  cursor: pointer; /* 鼠标悬停时显示手型 */
}

/* 按钮悬停样式 */
.search-button:hover {
  background-color: #0077cc; /* 悬停时的背景色 */
}
</style>
