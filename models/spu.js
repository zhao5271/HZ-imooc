import {Http} from "../utils/http";

class Spu {

    // 判断spu是否是无规格的
    static isNoSpec (spu) {
        return spu.sku_list.length === 1
          && spu.sku_list[0].specs.length === 0;
    }

    static getDetail(pid) {
        return Http.request({
            url: `/spu/id/${pid}/detail`
        })
    }
}
export {
    Spu
}
