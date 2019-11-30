import {config} from "../config/config";
import {promisic} from "../miniprogram_npm/lin-ui/utils/util";

class Http {
    // 参数外加上花括号，方便进行对象式传参
    static async request({url, data, method = 'GET'}) {
        const res = await promisic(wx.request)({
            data,
            method,
            url: `${config.apiBaseUrl}${url}`,
            header: {
                appkey: config.appkey
            }
            /*,
            success(res) {
                // 通过callback这个回调函数,将获取到的数据data传递出去
                // 然后在主页面js中实现this.setData()方法
                callback(res.data)
            }*/
        })
        return res.data
    }
}

export {
    Http
}