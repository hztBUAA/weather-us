// import { request } from "./api";

export async function getCityData(adcodes, type) {
  const params = { adcodes: adcodes, type: type }
  // return request();
  console.log(params)
  const map = new Map()
  adcodes.forEach((adcode) => {
    map.set(adcode, 100 * Math.random())
  });
  return map
}

export async function getDataTypes() {
  console.log("1")
  return {
    data: [
      {
        index: 0,
        type: '降雨量',
        dataType: 0,
        valueRange: [0, 100],
        colorRange: ['#d94e5d', '#50a3ba']
      },
      {
        index: 1,
        type: '气温',
        dataType: 0,
        valueRange: [0, 100],
        colorRange: ['#d94e5d', '#50a3ba']
      },
      {
        index: 2,
        type: '空气湿度',
        dataType: 0,
        valueRange: [0, 100],
        colorRange: ['#d94e5d', '#50a3ba']
      },
      {
        index: 3,
        type: 't1',
        dataType: 0,
        valueRange: [0, 100],
        colorRange: ['#d94e5d', '#50a3ba']
      },
      {
        index: 4,
        type: 't2',
        dataType: 0,
        valueRange: [0, 100],
        colorRange: ['#d94e5d', '#50a3ba']
      },
      {
        index: 5,
        type: 't3',
        dataType: 0,
        valueRange: [0, 100],
        colorRange: ['#d94e5d', '#50a3ba']
      },
      {
        index: 6,
        type: 't4',
        dataType: 0,
        valueRange: [0, 100],
        colorRange: ['#d94e5d', '#50a3ba']
      },
      {
        index: 7,
        type: 't5',
        dataType: 0,
        valueRange: [0, 100],
        colorRange: ['#d94e5d', '#50a3ba']
      },
      {
        index: 8,
        type: 't6',
        dataType:  0,
        valueRange: [0, 100],
        colorRange: ['#d94e5d', '#50a3ba']
      },
    ]
  }
}
