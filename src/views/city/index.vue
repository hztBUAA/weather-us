<template>

  <div class="forecast-table">
    <div>
      <input v-model="location" type="text">
      <button @click="submitLocation">搜索</button>
    </div>
    <!-- <div class="current-weather">
      <current-info />
    </div> -->
    <div class="current-weather center">
      <h1>当前天气</h1>
      <div class="current-panel mb-4">
        <h1 class="c">
          {{ location }}
        </h1>
        <div>
          {{ cur.temp }}
        </div>
        <div>
          {{ cur.text }}
        </div>
        <div>
          {{ cur.windDir }}
        </div>
        <div>
          {{ cur.humidity }}
        </div>
        <div />
      </div>
    </div>
    <div class="container">
      <h1>
        七日预报信息
      </h1>
      <div class="forecast-container">
        <div class="today forecast">
          <div class="forecast-header">
            <!-- 应该是模版渲染时 没有weekday！ -->
            <!-- 应该是模版渲染时 没有大小   现在还有有点疑惑关于  then  awit async的使用方法！ -->
            <div v-if="days_7.length>0" class="day"> {{ days_7[0].weekday }}</div>
            <div v-if="days_7.length>0" class="date">{{ days_7[0].fxDate }}</div>
          </div> <!-- .forecast-header -->
          <div class="forecast-content">
            <div class="location center mb-4">{{ location }}</div>
            <div class="center mb-4">{{ days_7[0].textDay }}</div>
            <div class="degree center">
              <div class="degree mb-4"> {{ days_7[0].tempMin }} ~{{ days_7[0].tempMax }}<sup>o</sup>C</div>
              <div class="forecast-icon">
                <i :class="'qi-' + days_7[0].iconDay" />
                <!-- <img src="./images/icons/icon-1.svg" alt="" width="90"> -->
              </div>
            </div>
            <dir class="center">
              <span v-if="days_7.length>0"><img src="./images/icon-umberella.png" alt="">{{ days_7[0].humidity }}%</span>
              <span v-if="days_7.length>0"><img src="./images/icon-wind.png" alt="">{{ days_7[0].windSpeedDay }}km/h</span>
              <span v-if="days_7.length>0"><img src="./images/icon-compass.png" alt="">{{ days_7[0].windDirDay }}</span>
            </dir>
          </div>
        </div>
        <div class="forecast">
          <div class="forecast-header">
            <div v-if="days_7.length>0" class="day">{{ days_7[1].weekday }}</div>
          </div> <!-- .forecast-header -->
          <div class="forecast-content">
            <div class="forecast-icon">
              <!-- <img src="./images/icons/icon-3.svg" alt="" width="48"> -->
              <i :class="'qi-' + days_7[1].iconDay" />
            </div>
            <div class="mb-4">{{ days_7[1].textDay }}</div>
            <div class="degree mb-4">{{ days_7[1].tempMax }}<sup>o</sup>C</div>
            <!-- <div class="degree mb-4">{{ days_7[1].tempMin }}<sup>o</sup>C</div> -->
            <small>{{ days_7[1].tempMin }}<sup>o</sup></small>
          </div>
        </div>
        <div class="forecast">
          <div class="forecast-header">
            <div v-if="days_7.length>0" class="day">{{ days_7[2].weekday }}</div>
          </div> <!-- .forecast-header -->
          <div class="forecast-content">
            <div class="forecast-icon">
              <i :class="'qi-' + days_7[2].iconDay" />
              <!-- <img src="./images/icons/icon-5.svg" alt="" width="48"> -->
            </div>
            <div class="mb-4">{{ days_7[2].textDay }}</div>
            <div class="degree mb-4">{{ days_7[2].tempMax }}<sup>o</sup>C</div>
            <small>{{ days_7[2].tempMin }}<sup>o</sup></small>
          </div>
        </div>
        <div class="forecast">
          <div class="forecast-header">
            <div v-if="days_7.length>0" class="day">{{ days_7[3].weekday }}</div>
          </div> <!-- .forecast-header -->
          <div class="forecast-content">
            <div class="forecast-icon">
              <!-- <img src="./images/icons/icon-7.svg" alt="" width="48"> -->
              <i :class="'qi-' + days_7[1].iconDay" />
            </div>
            <div class="mb-4">{{ days_7[3].textDay }}</div>
            <div class="degree mb-4">{{ days_7[3].tempMax }}<sup>o</sup>C</div>
            <small>{{ days_7[3].tempMin }}<sup>o</sup></small>
          </div>
        </div>
        <div class="forecast">
          <div class="forecast-header">
            <div v-if="days_7.length>0" class="day">{{ days_7[4].weekday }}</div>
          </div> <!-- .forecast-header -->
          <div class="forecast-content">
            <div class="forecast-icon">
              <!-- <img src="./images/icons/icon-12.svg" alt="" width="48"> -->
              <i :class="'qi-' + days_7[4].iconDay" />
            </div>
            <div class="mb-4">{{ days_7[4].textDay }}</div>
            <div class="degree mb-4">{{ days_7[4].tempMax }}<sup>o</sup>C</div>
            <small>{{ days_7[4].tempMin }}<sup>o</sup></small>
          </div>
        </div>
        <div class="forecast">
          <div class="forecast-header">
            <div v-if="days_7.length>0" class="day">{{ days_7[5].weekday }}</div>
          </div> <!-- .forecast-header -->
          <div class="forecast-content">
            <div class="forecast-icon">
              <i :class="'qi-' + days_7[5].iconDay" />
              <!-- <img src="./images/icons/icon-13.svg" alt="" width="48"> -->
            </div>
            <div class="mb-4">{{ days_7[5].textDay }}</div>
            <div class="degree mb-4">{{ days_7[5].tempMax }}<sup>o</sup>C</div>
            <small>{{ days_7[5].tempMin }}<sup>o</sup></small>
          </div>
        </div>
        <div class="forecast">
          <div class="forecast-header">
            <div v-if="days_7.length>0" class="day">{{ days_7[6].weekday }}</div>
          </div> <!-- .forecast-header -->
          <div class="forecast-content">
            <div class="forecast-icon">
              <i :class="'qi-' + days_7[6].iconDay" />
              <!-- <img src="./images/icons/icon-14.svg" alt="" width="48"> -->
            </div>
            <div class="mb-4">{{ days_7[6].textDay }}</div>
            <div class="degree mb-4">{{ days_7[6].tempMax }}<sup>o</sup>C</div>
            <small>{{ days_7[6].tempMin }}<sup>o</sup></small>
          </div>
        </div>
      </div>
    </div>
    <div class="hourly-info">
      <h1>
        逐三小时信息
      </h1>
      <div class="chart-container">
        <chart height="100%" width="100%" :hourly="hourly" />
      </div>
    </div>
    <div class="event-info">
      <h1>
        城市灾害预警通知
      </h1>
      <div>
        <h1>test for api:</h1>
        <h1>{{ location }}</h1>
        <p>
          {{ wt_data }}
        </p>
      </div>
      <!-- 可以放置进度图 表示可能性   以及饼状图 -->
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
      days_7: [1, 2, 3],
      hourly: [],
      cur: {},
      wt_data: []

      // 灾害分析部分
      // like: true,
      // value1: 4154.564,
      // value2: 1314,
      // title: '增长人数',
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

      await this.getApi1()
      const locationId = this.wt_data.location[0].id
      // 当前实时天气
      const res = await Axios.get(
        `https://devapi.qweather.com/v7/weather/now?location=${locationId}&key=3ca6d5e357a5470abf168dbcd8fe0fd7`
      )
      console.log('res', res)
      this.cur = res.data.now
      console.log('cur', this.cur)
      // res => {
      //   this.cur = res.data.now
      // },
      this.$forceUpdate() // 强制更新组件

      // 七日天气
      const url = 'https://devapi.qweather.com/v7/weather/7d'

      const key = '3ca6d5e357a5470abf168dbcd8fe0fd7'
      const params = { location: locationId, key: key }
      // console.log(params)
      Axios.get(url, { params })
        .then(res => {
          this.days_7 = res.data.daily
          this.days_7.forEach(item => {
            const weekday = this.getWeekday(item.fxDate)
            this.$set(item, 'weekday', weekday)
          })
        })
        .then(this.$forceUpdate())
        .catch(err => {
          console.error(err)
        })
      const url_h = 'https://devapi.qweather.com/v7/weather/24h'
      // 小时天气
      Axios.get(url_h, { params })
        .then(res => {
          this.hourly = res.data.hourly
        })
        .then(this.$forceUpdate())
        .catch(err => {
          console.error(err)
        })
      setTimeout(() => {
        console.log('hourly', this.hourly)
      }, 1000)
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
  padding: 20px;
  border-radius: 5px;
  text-align: center;
}

.current-panel {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
