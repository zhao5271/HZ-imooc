// pages/detail/detail.js
import {Spu} from "../../models/spu";
import { shoppingWay } from '../../core/enum'
import { SaleExplain } from '../../models/sale-explain'
import { getSystemSize, getWindowHeightRpx } from '../../utils/system'
import { px2rpx } from '../../miniprogram_npm/lin-ui/utils/util'

Page({

  data: {
    showRealm: false,
    specs: Object
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const pid = options.pid
    const spu = await Spu.getDetail(pid);
    const explain = await SaleExplain.getFixed()

    const scrollHeight = await getWindowHeightRpx() - 100
    this.setData({
      spu,
      explain,
      scrollHeight
    })
  },
  // 页面的跳转
  onGoHome (e) {
    wx.switchTab({
      url: '/pages/home/home'
    })
  },
  onGoCart (e) {
    wx.switchTab({
      url: '/pages/cart/cart'
    })
  },
  onAddToCart (e) {
    this.setData({
      showRealm: true,
      orderWay: shoppingWay.CART
    })
  },
  onBuy (e) {
    this.setData({
      showRealm: true,
      orderWay: shoppingWay.BUY
    })
  },
  // 接收从 子组件realm 中传递来的数据
  onSpecChange (e) {
    this.setData({
      specs: e.detail
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})
