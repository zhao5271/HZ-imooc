// components/tab-bar/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onGoHome (e) {
      this.triggerEvent('gohome',{

      })
    },
    onGoCart (e) {
      this.triggerEvent('gocart',{

      })
    },
    onAddToCart (e) {
      this.triggerEvent('addtocart', {

      })
    },
    onBuy (e) {
      this.triggerEvent('buy',{

      })
    }
  }
})
