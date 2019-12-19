// components/sub-category/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    categories: Array,
    bannerImg: String
  },

  observers : {
    'categories' : function (categories) {
      console.log(categories)
    }
  },
  data: {

  },
  methods: {
    onTapGridItem:function (event) {
      const id = event.detail.key
      this.triggerEvent('itemtap',{
        cid:id
      })
    }
  }
})
