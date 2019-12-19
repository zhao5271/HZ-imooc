// 存放cell的状态，使用枚举
const CellStatus = {
    FORBIDDEN :"forbidden",
    SELECTED: "selected",
    WAITING: "waiting"
}

const shoppingWay = {
    CART: 'cart',
    BUY: 'buy'
}

const SpuListType = {
    THEME: 'theme',
    ROOT_CATEGORY: 'root_category',
    SUB_CATEGORY: 'sub_category',
    LATEST:'latest'
}

export {
    CellStatus,
    shoppingWay,
    SpuListType
}
