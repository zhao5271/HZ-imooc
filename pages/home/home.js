import {Theme} from "../../models/theme";
import {Banner} from "../../models/banner";
import {Category} from "../../models/category";
import {Activity} from "../../models/activity";
import {SpuPaging} from "../../models/spu-paging";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        spuPaging: null,
        loadingType: 'loading'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        await this.initAllData()
        await this.initBottomSpuList()
    },

    /*
    * 类可以保存数据，但是不能保存状态
    * 类实例化的对象可以保存状态
    * 因为状态可能是多个的，但是类只能保存一个
    * */
    // 首页底部的瀑布流商品的数据
    async initBottomSpuList() {
        const paging = SpuPaging.getLatestPaging()
        this.data.spuPaging = paging
        const data = await paging.getMoreData()
        if (!data) {
            return
        }
        // 这个方式是用来传递数据到子组件中去，因为瀑布流组件，
        // 最外层传值是，单个spu商品的组件，所以我们无法通过主页面进行传递数据
        wx.lin.renderWaterFlow(data.items)
    },

    // 首页的banner以及活动主题数据
    async initAllData() {
        const theme = new Theme()
        await theme.getThemes()
        const themeA = theme.getHomeLocationA()
        const themeE = theme.getHomeLocationE()
        let themeESpu = []
        if (themeE.online) {
            const data = await Theme.getHomeLocationESpu()
            if (data) {
                themeESpu = data.spu_list.slice(0, 8)
            }
        }
        const themeF = theme.getHomeLocationF()
        const themeH = theme.getHomeLocationH()

        const bannerB = await Banner.getHomeLocationB()
        const bannerG = await Banner.getHomeLocationG()

        const grid = await Category.getHomeLocationC()
        const activityD = await Activity.getHomeLocationD()

        this.setData({
            themeA,
            bannerB,
            grid,
            activityD,
            themeE,
            themeESpu,
            themeF,
            bannerG,
            themeH
        })
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     * 主要加载商品瀑布流的下一页
     */
    onReachBottom: async function () {
        const data = await this.data.spuPaging.getMoreData()
        if (!data) {
            return
        }
        wx.lin.renderWaterFlow(data.items)
        // 改变loadmore状态
        if (!data.moreData) {
            this.setData({
                loadingType:"end"
            })
        }
    }
})