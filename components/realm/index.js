import {FenceGroup} from "../models/fence-group";
import {Judger} from "../models/judger";

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        spu: Object,
        judge: Object
    },

    observers: {
        'spu': function (spu) {
            if (!spu) {
                return
            }
            const fenceGroup = new FenceGroup(spu)
            fenceGroup.initFences()
            this.data.judger = new Judger(fenceGroup)
            this.bindInitData(fenceGroup)
        }
    },
    /**
     * 组件的初始数据
     */
    data: {},

    /**
     * 组件的方法列表
     */
    methods: {
        bindInitData(fenceGroup) {
            this.setData({
                fences: fenceGroup.fences
            })
        },
        onCellTap(event) {
            // cell中包含属性值，status；x表示行号，y表示列号
            // 因为此处获取到的cell对象是经过小程序渲染包装过的，和原来的cell引用对象是不同的
            // 所以需要获取cell的行列号，重新进入Fences下的cell中改变它的status
            const cell = event.detail.cell
            const x = event.detail.x
            const y = event.detail.y
            const judger = this.data.judger
            // 每次点击规格，都会触发judger中的judge方法，对规格进行判断
            judger.judge(cell,x,y)
            this.setData({
                fences: judger.fenceGroup.fences
            })
        }
    }
})

/*
* SKU算法是为了提高前端页面的用户体验
* 核心问题：确定规格的状态—— 选中/可选/禁选
* 本质：确定禁用状态
* 规律：每当用户进行一次规格值的选择，所有的规格值都需要重新去确认状态
*
* 1. 待确定的SKU路径（关键） == 潜在路径
* 2. 已存在的SKU路径
*
* 字典（）中存放所有存在的规格路径
* 单个属性/两个属性/三个属性
* */
