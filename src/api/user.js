import request from '@/utils/request'
import qs from 'qs'

export function login(data) {
  return request.post('/user/login', qs.stringify({ uid: data.username, password: data.password }))
}

export function getInfo() {
  return request.get('/user/info')
}

export function changePasswordService(data) {
  return request.post('/user/changePassword', qs.stringify(data))
}

export function registerService(data, CSRFToken) {
  console.log(data)
  return request.post('/user/register', qs.stringify(data), {
    headers: {
      'X-CSRFToken': CSRFToken
    }
  })
}

export function logout() {
  return request.post('/user/logout')
}

export function getCitySubscribeService() {
  return request.get('/user/citySubscribe')
}

export function addCitySubscribeService(data) {
  return request.post('/user/citySubscribe', qs.stringify(data))
}

export function deleteCitySubscribeService(city) {
  return request.delete('/user/citySubscribe', { params: { city }})
}

export function getUserFeedbackService() {
  return request.get('/user/feedback')
}

export function addFeedbackService(data) {
  return request.post('/user/feedback', qs.stringify(data))
}

export function getWarningsService() {
  return request.get('/user/warnings')
}

export function updateAvatarService(avatar) {
  return request.post('/user/avatar', avatar, {
    headers: {
      'content-type': 'form-data'
    }
  })
}

export function getCSRFTokenService() {
  return request.get('/get_csrf')
}
