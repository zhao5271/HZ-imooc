import {Http} from "./http";

class Paging {
    /*
    * 存储分页数据的状态
    * 在调用时需要实例化
    * */
    start
    count
    url
    req
    moreData = true
    locker = false
    accumulator = []

    // 请求数据
    constructor(req,start,count) {
        this.start = start
        this.count = count
        this.req = req
        this.url = req.url
    }


    // 获取更多数据
    async getMoreData() {
        if (!this.moreData) {
            return
        }
        const data = await this._actualGetData()
        this._releaseLocker()
        return data
    }

    // 获取实际数据
    async _actualGetData() {
        const req = this._getCurrentReq()
        let paging = await Http.request(req)
        if (!paging) {
            return null
        }
        if (paging.total === 0) {
            return {
                empty: true,
                items: [],
                moreData: false,
                accumulator: []
            }
        }

        this.moreData = Paging._moreData(paging.total_page, paging.page)
        // 判断是否还有下一页，并对起始条数进行增加
        if (this.moreData) {
            this.start += this.count
            this.getAccumulator(paging.items)
        }
        return {
            empty: false,
            items: paging.items,
            moreData: this.moreData,
            accumulator: this.accumulator
        }
    }

    getAccumulator(items){
        this.accumulator = this.accumulator.concat(items)
    }

    // 判断是否还有下一页数据,pageNum当前页码
    static _moreData(totalPage, pageNum) {
        return pageNum < totalPage - 1
    }

    // 获取当前的请求对象
    _getCurrentReq() {
        let url = this.url
        const params = `start=${this.start}&count=${this.count}`
        // url = v1/spu/latest + "?" + params
        // url = v1/spu/latest?other/abc + '&' + params
        if (url.includes("?")) {
            url += '&' + params
        } else {
            url += '?' + params
        }
        this.req.url = url
        return this.req
    }

    // 获取锁的状态
    _getLocker() {
        if (this.locker) {
            return false
        }
        this.locker = true
        return true
    }

    // 重置锁
    _releaseLocker() {
        this.locker = false
    }
}

export {
    Paging
}