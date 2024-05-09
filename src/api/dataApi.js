// import { request } from "./api";

export async function getCityData(adcodes, type, date) {
  const params = { adcodes: adcodes, type: type, date }
  // return request();
  console.log(params)
  const map = new Map()
  adcodes.forEach((adcode) => {
    map.set(adcode, 100 * Math.random())
  });
  return map
}

export async function getDataTypes() {
  return {
    data: [
      {
        index: 0,
        name: '气压',
        type: 'PRS',
        dataType: 0,
        valueRange: [0, 100],
        colorRange: ['#50a3ba', '#d94e5d']
      },
      {
        index: 1,
        name: '气温',
        type: 'TEM',
        dataType: 0,
        valueRange: [0, 100],
        colorRange: ['rgb(2, 69, 255, 1)', 'rgb(255, 82, 2)']
      },
      {
        index: 2,
        name: '空气湿度',
        type: 'RHU',
        dataType: 0,
        valueRange: [0, 100],
        colorRange: ['rgb(225, 97, 18)', 'rgb(74, 179, 245)']
      },
      {
        index: 3,
        name: '水汽压',
        type: 'VAP',
        dataType: 0,
        valueRange: [0, 100],
        colorRange: ['rgb(74, 179, 245)', 'rgb(229, 32, 6)']
      },
      {
        index: 4,
        name: '降雨量',
        type: 'PRE_3h',
        dataType: 0,
        valueRange: [0, 100],
        colorRange: ['rgb(225, 97, 18)', 'rgb(74, 179, 245)']
      },
      {
        index: 5,
        name: '平均风速',
        type: 'WIN_S_Avg_2mi',
        dataType: 0,
        valueRange: [0, 100],
        colorRange: ['rgb(228, 223, 222)', 'rgb(225, 97, 18)']
      },
      {
        index: 6,
        name: '水平能见度',
        type: 'VIS',
        dataType: 0,
        valueRange: [0, 100],
        colorRange: ['rgb(225, 97, 18)', 'rgb(228, 223, 222)']
      },
      {
        index: 7,
        name: '总云量',
        type: 'CLO_Cov',
        dataType: 0,
        valueRange: [0, 100],
        colorRange: ['rgb(250, 250, 250)', 'rgb(185, 183, 183)']
      },
      {
        index: 8,
        name: '低云量',
        type: 'CLO_Cov_Low',
        dataType:  0,
        valueRange: [0, 100],
        colorRange: ['rgb(250, 250, 250)', 'rgb(185, 183, 183)']
      },
      {
        index: 9,
        name: '最大风速',
        type: 'WIN_S_MAX',
        dataType:  0,
        valueRange: [0, 100],
        colorRange: ['rgb(228, 223, 222)', 'rgb(225, 97, 18)']
      },
      {
        index: 10,
        name: '最高气温',
        type: 'TEM_MAX',
        dataType:  0,
        valueRange: [0, 100],
        colorRange: ['rgb(2, 69, 255, 1)', 'rgb(255, 82, 2)']
      },
      {
        index: 11,
        name: '最低气温',
        type: 'TEM_MIN',
        dataType:  0,
        valueRange: [0, 100],
        colorRange: ['rgb(2, 69, 255, 1)', 'rgb(255, 82, 2)']
      },
    ]
  }
}
