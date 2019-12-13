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
    // 遍历每一个cell属性，然后将每一个cell和行号列号通过回调函数返回
    eachCell(cb) {
        for (let i = 0; i < this.fences.length; i++) {
            for (let j = 0; j <this.fences[i].cells.length ; j++) {
                const cell = this.fences[i].cells[j]
                cb(cell,i,j)
            }
        }
    }
    // 将传递的 skucode 与 sku_list 下面的 code进行对比
    // 完整的 skuCode 包括 spu的id
    getSku (skuCode) {
        const fullSkuCode = this.spu.id + '$' + skuCode
        const sku = this.spu.sku_list.find(s => s.code === fullSkuCode)
        return sku ? sku : null
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

    // 将商品的默认sku属性配置从sku_list中读取出来，默认sku就是sku_list下的一个对象
    getDefaultSku () {
        const defaultSkuId = this.spu.default_sku_id
        if (!defaultSkuId) {
            return
        }
        return this.skuList.find(s => s.id === defaultSkuId)
    }

    // 通过cell所在的行列号改变status
    setCellStatusByXY (x, y, status) {
        this.fences[x].cells[y].status = status
    }

    // 通过cell对应的id改变status
    setCellStatusByID (cellId,status) {
        this.eachCell(cell => {
            if (cell.id === cellId) {
                cell.status = status
            }
        })
    }
}

export {
    FenceGroup
}
