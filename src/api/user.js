import request from '@/utils/request'

const formUrlEncoded = {
  headers: {
    'content-type': 'application/x-www-form-urlencoded'
  }
}

export function login(data) {
  return request.post('/user/login', data, formUrlEncoded)
}

export function getInfo() {
  return request.get('/user/info')
}

export function changePasswordService(data) {
  return request.patch('/user/changePassword', data, formUrlEncoded)
}

export function registerService(data) {
  return request.post('/user/register', data)
}

export function logout() {
  return request.post('/user/logout')
}

export function getCitySubscribeService() {
  return request.get('/user/citySubscribe')
}

export function addCitySubscribeService(data) {
  return request.post('/user/citySubscribe', data, formUrlEncoded)
}

export function deleteCitySubscribeService(city) {
  return request.delete('/user/citySubscribe', { params: { city }})
}

export function getUserFeedbackService() {
  return request.get('/user/feedback')
}

export function addFeedbackService(data) {
  return request.post('/user/feedback', data, formUrlEncoded)
}

export function getWarningsService() {
  return request.get('/user/warnings')
}

export function updateAvatarService(avatar) {
  return request.patch('/user/avatar', avatar, {
    headers: {
      'content-type': 'form-data'
    }
  })
}
