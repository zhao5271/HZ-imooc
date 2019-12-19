import { Http } from '../utils/http'

class Categories {

  roots = []
  subs = []
  // 获取所有一级和二级分类的数据
  async getAll () {
    const data = await Http.request({
      url: `category/all`
    })

    this.roots = data.roots
    this.subs = data.subs
  }
  // 返回一级分类数据
  getRoots () {
    return this.roots
  }

  getRoot (rootId) {
    return this.roots.find(r => r.id == rootId)
  }
  // 通过一级分类 的id ，获取 对应的二级分类的数据
  getSubs (parentId) {
    return this.subs.filter(sub => sub.parent_id == parentId)
  }
}

export {
  Categories
}
