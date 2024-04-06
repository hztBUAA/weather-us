//import { request } from "./api";

export async function getCityData(adcode, type) {
    const params = {adcode: adcode, type: type}
    //return request();
    console.log(params)
    return 100 * Math.random()
}