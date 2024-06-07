import { getData } from './api'
import centers from '../assets/jsonData/centers.json'

export async function getCityJson(adcode) {
  return getData('jsonData/citys/' + adcode + '.json', null)
}

export async function getCenter() {
  const map = new Map()
  await centers.forEach((center) => {
    map.set(center.name, center.centers)
  })
  return map
}