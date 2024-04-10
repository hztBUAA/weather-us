<template>
  <div class="dashboard-container">
    <div>
      <div id="myChart" :style="{width: '100%', height: '400px'}" />
    </div>
    <!-- <el-button icon="el-icon-edit" type="success" circle size="medium" @click="changeLoading" />
    <el-button type="success" round size="mini" @click="loading=!loading">
      click {{ !loading }}
    </el-button>
    <el-button type="success" circle size="big">
      click
    </el-button>
    <el-button type="success" circle size="larger">
      click
    </el-button> -->
    <!-- <p v-loading="loading">
      <el-alert
        title="menu 1"
        type="success"
        :closable="true"
        description="hello"
      />
    </p> -->
    <!-- <ul v-infinite-scroll="load" class="infinite-list" style="overflow:auto">
      <li v-for="i in count" :key="i" class="infinite-list-item">{{ i }}</li>
    </ul> -->
    <!-- <div class="dashboard-text">name: {{ name }}</div> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Dashboard',
  data() {
    return {
      count: 100,
      loading: false
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  mounted() {
    this.drawLine()
  },
  methods: {
    drawLine() {
      // console("2");
      console.log(myChart)
      const myChart = this.$echarts.init(document.getElementById('myChart'))
      myChart.setOption({
        title: { text: '在Vue中使用echarts' },
        tooltip: {},
        xAxis: {
          // 我希望data的标签名能够间隔宽一些
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'scatter',
          data: [5, 20, 36, 10, 10, 20]
        }]
      })
    },
    load() {
      if (this.count > 10) {
        // alert("sorry too much!");
        // console("sorry too much!");
        // return;
      }
      this.count += 1
    },
    changeLoading() {
      this.loading = !this.loading
    }

  }
}
</script>

<style lang="scss" scoped>

p::before {
    content: "➤";
    margin-right: 10px;
}

p::after {
    content: "➤@";
    margin-left: 51px;
}

.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
