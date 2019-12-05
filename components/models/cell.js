import {CellStatus} from "../../core/enum";

class Cell {
    title
    id
    spec  // spec 表示单个产品的规格，包括规格名和规格值
    status = CellStatus.WAITING

    constructor(spec) {
        this.title = spec.value
        this.id = spec.value_id
        this.spec = spec
    }

    getCellCode () {
        return this.spec.key_id + '-' + this.spec.value_id
    }
}

export {
    Cell
}
