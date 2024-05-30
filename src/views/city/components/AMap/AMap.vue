<template>
  <div id="container" />
</template>
<script>
import AMapLoader from '@amap/amap-jsapi-loader'

export default {
  name: 'MapView',
  props: {
    center: {
      type: Array,
      required: true,
      default: () => [116.333926, 39.997245] // 默认值为北京的经纬度
    }
  },
  watch: {
    center: {
      handler(oldVal, newVal) {
        this.initAMap()
        console.log('center', 'Amap', this.center)
      }
    }
  },
  //   data() {
  //     return {
  //       center: []
  //     }
  //   },

  mounted() {
    this.initAMap()
    // console.log('center', 'Amap', this.center)
  },
  unmounted() {
    this.map?.destroy()
  },
  methods: {
    initAMap() {
      window._AMapSecurityConfig = {
        securityJsCode: 'd2b367ebb5025f50806e50a6f78d6cc1'
      }
      AMapLoader.load({
        key: '15ecec73d7f77479a26dc9340c4af18b', // 申请好的Web端开发者Key，首次调用 load 时必填
        version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ['AMap.Scale'] // 需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
      })
        .then((AMap) => {
          this.map = new AMap.Map('container', {
            pitch: 50, // 地图俯仰角度，有效范围 0 度- 83 度
            viewMode: '3D', // 地图模式
            rotateEnable: true, // 是否开启地图旋转交互 鼠标右键 + 鼠标画圈移动 或 键盘Ctrl + 鼠标左键画圈移动
            pitchEnable: true, // 是否开启地图倾斜交互 鼠标右键 + 鼠标上下移动或键盘Ctrl + 鼠标左键上下移动
            zoom: 17, // 初始化地图层级
            rotation: -15, // 初始地图顺时针旋转的角度
            zooms: [2, 20], // 地图显示的缩放级别范围
            center: this.center// 初始地图中心经纬度
          })
        })
        .catch((e) => {
          console.log(e)
        })
    }
  }
}
</script>
<style scoped>
#container {
  width: 90%;
  height: 90%;
}
</style>
