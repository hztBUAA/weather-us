import request from '@/utils/request'

export function getUserDigests() {
  return request({
    url: '/admin/user-digests',
    method: 'get'
  })
}

export function permission_change(username, isAdmin) {
  return request({
    url: '/admin/permission-change',
    method: 'post',
    params: {
      username: username,
      isAdmin: isAdmin
    }
  })
}

export function delete_user(username) {
  return request({
    url: '/admin/delete-user',
    method: 'post',
    params: {
      username: username
    }
  })
}
export function reset_password(username) {
  return request({
    url: '/admin/reset-password',
    method: 'post',
    params: {
      username: username
    }
  })
}
export function launch_varn(title, address, warningTime, type, content) {
  return request({
    url: '/admin/launch-warn',
    method: 'post',
    params: {
      title: title,
      address: address,
      warningTime: warningTime,
      type: type,
      content: content
    }
  })
}
export function fetch_feedback() {
  return request({
    url: '/admin/fetch-feedback',
    method: 'get'
  })
}
export function reply_feedback(id, reply) {
  return request({
    url: '/admin/reply-feedback',
    method: 'post',
    params: {
      id: id,
      reply: reply
    }
  })
}
