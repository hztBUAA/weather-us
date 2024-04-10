import { getData } from './api'

export async function getCityJson(adcode) {
  return getData('jsonData/citys/' + adcode + '.json', null)
}
