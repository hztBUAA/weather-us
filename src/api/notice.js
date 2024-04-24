import request from '@/utils/request'

export function getNoticeContent(id) {
    return request({
        url: '/notice/content',
        method: 'get',
        params: {
            id
        }
    })
}