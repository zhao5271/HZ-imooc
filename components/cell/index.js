// components/cell/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        cell: Object
    },

    /**
     * 组件的初始数据
     */
    data: {},

    /**
     * 组件的方法列表
     */
    methods: {
        onTap(event) {
            // 抛出事件，方便父子组件间的传值
            // 利用冒泡机制，可以直接将cell组件中的数据越过fence组件，直接传到Realm组件中去
            this.triggerEvent('celltap',{
               cell: this.properties.cell
            },{
                // bubbles开启冒泡，composed开启组件边界，这样就可以越级传递数据
                bubbles:true,
                composed:true
            })
        }
    }
})
