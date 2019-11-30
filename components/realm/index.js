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
            const cell = event.detail.cell
            const judger = this.data.judger
            // 每次点击规格，都会触发judger中的judge方法，对规格进行判断
            judger.judge(cell)
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
* 1. 待确定的SKU路径（关键）
* 2. 已存在的SKU路径
*
* 字典（）
* */
