import {combination} from "../../miniprogram_npm/lin-ui/utils/util";

class SpuCode {
    code
    spuId
    // 存放所有组合过的规格值
    totalSegments = []

    constructor(code) {
        this.code = code
        this._splitToSegment()
    }

    _splitToSegment() {
        // 2$1-45#3-9#4-14
        const spuAndSpec = this.code.split("$");
        this.spuId = spuAndSpec[0];
        const specCodeArray = spuAndSpec[1].split("#");
        const length = specCodeArray.length;

        for (let i = 1; i <= length; i++) {
            const segments = combination(specCodeArray, i);
            // map映射处理segments这个二维数组，join用于数组元素的字符串拼接，形成新的字典路径
            // concat用于数组的拼接，可以将原来二维数组变成一维数组，但是该方法不会改变原数组，所以需要重新赋值
            const newSegments = segments.map(segs => {
                return segs.join("#")
            });
            this.totalSegments = this.totalSegments.concat(newSegments)
        }
    }
}

// 这个类的主要作用是分解出每个规格名和规格值所对应的id
// 以及将所有的sku路径都进行排列组合,存储到字典中
export {
    SpuCode
}
