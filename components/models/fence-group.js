import {Matrix} from "./matrix";
import {Fence} from "./fence";

class FenceGroup {

    spu
    skuList = []
    fences = []

    constructor(spu){
        this.spu = spu
        this.skuList = spu.sku_list
    }

    initFences(){
        const matrix = this._createMatrix(this.skuList)
        // fence 表示矩阵数据中的一行元素，fences表示矩阵中的所有数据
        const fences = []
        const AT = matrix.transpose()
        // r 表示原矩阵数据中一行的数据
        AT.forEach(r => {
            let fence = new Fence(r)
            fence.init()
            fences.push(fence)
        });
        this.fences = fences
    }

    eachCell(cb) {
        for (let i = 0; i < this.fences.length; i++) {
            for (let j = 0; j <this.fences[i].cells.length ; j++) {
                const cell = this.fences[i].cells[j]
                cb(cell,i,j)
            }
        }
    }


    // 将skuList中的商品属性值遍历存入数组中，
    // 然后在Matrix类中对这个二维数组进行双重遍历
    _createMatrix(skuList){
        const m = []
        skuList.forEach(sku => {
            m.push(sku.specs)
        })
        // 当我们返回数据中既要有属性值，又需要方法时，推荐返回类
        return new Matrix(m)
    }
}

export {
    FenceGroup
}
