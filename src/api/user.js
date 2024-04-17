import request from '@/utils/request'

const formUrlEncoded = {
  contentType: 'application/x-www-form-urlencoded'
}

export function login(data) {
  return request.post('/user/login', data,
    {
      headers: {
        formUrlEncoded
      }
    })
}

export function getInfo() {
  return request.get('/user/info')
}

export function changePasswordService(form) {
  return request.patch(
    '/user/changePassword',
    form,
    {
      headers: {
        formUrlEncoded
      }
    }
  )
}

export function registerService(form) {
  return request.post('/user/register', form)
}

export function logout() {
  return request.post('/user/logout')
}
