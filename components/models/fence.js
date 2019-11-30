import {Cell} from "./cell";

class Fence {
    // title表示规格名，id表示规格值所对应的唯一标识
    title
    id
    specs
    cells = []

    constructor(specs) {
        this.specs = specs
        this.title = specs[0].key
        this.id = specs[0].key_id
    }

    init() {
        this._initCells()
    }

    _initCells() {
        this.specs.forEach(s => {
            // some 和every都是遍历数组的方法，
            // some是数组中有一个元素满足条件则返回true，every则是每一个元素都满足条件才返回true
            // 如果数组中已存在相同的cell对象，则返回true
            const existed = this.cells.some( c => {
                return  s.value_id === c.id
            })
            if(existed){
                return
            }
            const cell = new Cell(s);
            this.cells.push(cell)
        });
    }
}

export {
    Fence
}
