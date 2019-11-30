import {Paging} from "../utils/paging";

class SpuPaging{
    static  getLatestPaging(){
        return new Paging({
            url:`spu/latest`
        },0,5)
    }

    //
    /*
    * 1.一条数据都没有, 空
    * 2.最后一页数据，没有更多数据
    * 3.累加 10-20 ， 21-40 。。。 setData重新渲染页面
    * 4.非分页数据：a. 正在加载  loading b.空
    *   分页数据： a. 正在加载  b.加载完成  c.没有更多数据
    * 5.上滑页面触底  加载  避免用户重复发请求 redis可以用来防止服务器穿透
    * 6.按钮 button  防抖   截流。 禁用button，button倒计时， 模态，全屏loading
    * start count, 10, 0, 10, 20
    * */
}

export {
    SpuPaging
}