import { getData } from './api'

export async function getNoticeCont(id) {
    const url = 'https://mock.apifox.com/m1/4334156-3977343-default/notice/digests?apifoxApiId=167533893&apifoxToken=kBmcKryyUxBSwSWfUSCxu2AhVpYxNrwO'
    return getData(url, id)
}