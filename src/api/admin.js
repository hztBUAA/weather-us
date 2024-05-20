import request from '@/utils/request'
import qs from 'qs'

export function getUserDigests() {
  return request({
    url: '/admin/user-digests',
    method: 'get'
  })
}

export function permission_change(username, isAdmin) {
  return request.post('/admin/permission-change', qs.stringify({ username, isAdmin }))
}

export function delete_user(username) {
  return request.post('/admin/delete-user', qs.stringify({ username }))
}

export function reset_password(username) {
  return request.post('/admin/reset-password', qs.stringify({ username }))
}

export function launch_varn(title, address, warningTime, type, content) {
  return request.post('/admin/launch-warn', qs.stringify({ title, address, warningTime, type, content }))
}

export function fetch_feedback() {
  return request({
    url: '/admin/fetch-feedback',
    method: 'get'
  })
}

export function reply_feedback(id, reply) {
  return request.post('/admin/reply-feedback', qs.stringify({ id, reply }))
}
