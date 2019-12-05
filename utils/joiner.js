
// 字符拼接器
class Joiner {
  _str = ''
  _symbol = '-' // symbol 表示拼接的符号
  _cutCharNum = 1 // 截取字符串，默认不截取

  constructor(symbol, cutCharNum) {
    if (symbol) {
      this._symbol = symbol
    }
    if (cutCharNum){
      this._cutCharNum = cutCharNum
    }
  }

  // 在传入的字符串后面加入拼接符号
  join(part) {
    if (part) {
      this._str += `${part}${this._symbol}`;
    }
  }

  // 得到最终拼接的字符串
  getStr() {
    return this._str.substring(0, this._str.length - this._cutCharNum)
  }
}

export {
  Joiner
}
