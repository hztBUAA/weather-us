import { getData } from './api'

export async function getNoticeCont(id) {
    const url = 'https://mock.apifox.com/m1/4334156-0-default/notice/content?content=%27%3Cp%3Eaaaa%3C/p%3E%27'
    return getData(url,id)
}