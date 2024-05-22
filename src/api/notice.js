import request from '@/utils/request'
import qs from 'qs'

export function getNoticeContent(id) {
  return request({
    url: '/notice/content',
    method: 'get',
    params: {
      id
    }
  })
}

export function launchNotice(title, tag, content) {
  return request.post('/admin/launch-notice', qs.stringify({ title, tag, content }))
}

export function getNoticeDigests() {
  return request({
    url: '/notice/digests',
    method: 'get'
  })
}

export function setNoticeState(id, state) {
  return request.post('/notice/change-state', qs.stringify({ id: id, state: state }))
}
