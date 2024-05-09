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

export function launchNotice(title, tag, content) {
    return request({
        url: '/admin/launch-notice',
        method: 'post',
        params: {
            title: title,
            tag: tag,
            content: content,
        }
    })
}

export function getNoticeDigests() {
    return request({
        url: '/notice/digests',
        method: 'get',
    })
}

export function setNoticeState(id, state) {
    return request({
        url: '/notice/change-state',
        method: 'post',
        params: {
            id: id,
            state: state,
        }
    })
}