import request from '@/utils/request'

export async function getCityData(adcodes) {
  /*
  const params = { adcodes: adcodes }
  console.log(params)
  */
  const map = new Map()
  request({
    url: '/getCityData',
    method: 'get',
    params: {
      adcodes: adcodes
    }
  }).then ((res) => {
    /*
    adcodes.forEach((adcode) => {
      map.set(adcode, [100 * Math.random(), 100 * Math.random(), 100 * Math.random(), 100 * Math.random(), 100 * Math.random(), 100 * Math.random(), 100 * Math.random()])
    });
    */
    res.data.weather.foreach(function(w) {
      map.set(w.adcode, w.value)
    })
    return map
  })
}

export async function getDataTypes() {
  return {
    data: [
      {
        index: 0,
        name: '气压',
        type: 'pressure',
        dataType: 0,
        valueRange: [0, 100],
        colorRange: ['#50a3ba', '#d94e5d'],
        dw: '百帕'
      },
      {
        index: 1,
        name: '气温',
        type: 'temp',
        dataType: 0,
        valueRange: [0, 100],
        colorRange: ['rgb(2, 69, 255, 1)', 'rgb(255, 82, 2)'],
        dw: '摄氏度'
      },
      {
        index: 2,
        name: '相对湿度',
        type: 'humidity',
        dataType: 0,
        valueRange: [0, 100],
        colorRange: ['rgb(225, 97, 18)', 'rgb(74, 179, 245)'],
        dw: '%'
      },
      {
        index: 3,
        name: '降雨量',
        type: 'precip',
        dataType: 0,
        valueRange: [0, 100],
        colorRange: ['rgb(225, 97, 18)', 'rgb(74, 179, 245)'],
        dw: '毫米'
      },
      {
        index: 4,
        name: '风速',
        type: 'windSpeed',
        dataType: 0,
        valueRange: [0, 100],
        colorRange: ['rgb(228, 223, 222)', 'rgb(225, 97, 18)'],
        dw: '公里/小时'
      },
      {
        index: 5,
        name: '能见度',
        type: 'vis',
        dataType: 0,
        valueRange: [0, 100],
        colorRange: ['rgb(225, 97, 18)', 'rgb(228, 223, 222)'],
        dw: '公里'
      },
      {
        index: 6,
        name: '云量',
        type: 'cloud',
        dataType: 0,
        valueRange: [0, 100],
        colorRange: ['rgb(250, 250, 250)', 'rgb(185, 183, 183)'],
        dw: "%"
      },
    ]
  }
}
