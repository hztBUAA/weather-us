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
  data() {
    return {
      map: null,
      markers: [],
      AMap: null
    }
  },
  watch: {
    center: {
      handler(newVal) {
        if (this.map) {
          this.map.setCenter(newVal) // 更新地图中心点
        } else {
          this.initAMap() // 地图未初始化时进行初始化
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.initAMap()
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
        plugins: ['AMap.Scale', 'AMap.Geocoder'] // 需要使用的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
      })
        .then((AMap) => {
          this.AMap = AMap // 保存 AMap 对象
          this.map = new AMap.Map('container', {
            pitch: 50, // 地图俯仰角度，有效范围 0 度- 83 度
            viewMode: '3D', // 地图模式
            rotateEnable: true, // 是否开启地图旋转交互 鼠标右键 + 鼠标画圈移动 或 键盘Ctrl + 鼠标左键画圈移动
            pitchEnable: true, // 是否开启地图倾斜交互 鼠标右键 + 鼠标上下移动或键盘Ctrl + 鼠标左键上下移动
            zoom: 17, // 初始化地图层级
            rotation: -15, // 初始地图顺时针旋转的角度
            zooms: [2, 20], // 地图显示的缩放级别范围
            center: this.center // 初始地图中心经纬度
          })

          // 添加点击事件监听器，用于添加标记点
          this.map.on('click', (e) => {
            this.addMarker(e.lnglat)
          })
        })
        .catch((e) => {
          console.log(e)
        })
    },
    addMarker(position) {
      const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}` // 生成随机颜色
      const markerContent = `<div style="background-color: ${randomColor}; width: 20px; height: 20px; border-radius: 30%;"></div>`

      const marker = new this.AMap.Marker({
        position,
        content: markerContent,
        offset: new this.AMap.Pixel(-10, -10)
      })

      this.map.add(marker)
      this.markers.push(marker)

      // 添加点击事件，用于显示文字信息
      marker.on('click', () => {
        this.showInfoWindow(marker, position)
      })
    },
    showInfoWindow(marker, position) {
      const geocoder = new this.AMap.Geocoder({
        city: '全国', // 城市设为北京，默认：“全国”
        radius: 500 // 范围，默认：500
      })
      geocoder.getAddress(position, (status, result) => {
        if (status === 'complete' && result.regeocode) {
          const address = result.regeocode.formattedAddress

          const infoWindow = new this.AMap.InfoWindow({
            content: `
            <div class="el-card">
              <div class="el-card__header">
                <h3>${address}</h3>
              </div>
              <div class="el-card__body">
                <p>经度: ${position.lng}</p>
                <p>纬度: ${position.lat}</p>
              </div>
            </div>
          `,
            offset: new this.AMap.Pixel(0, -30)
          })

          infoWindow.open(this.map, marker.getPosition())
        } else {
          console.error('Geocoder failed:', status, result)
        }
      })
    }

  }
}
</script>

<style scoped>
#container {
  width: 100%;
  height: 90%;
}
</style>
