import { promisic, px2rpx } from '../miniprogram_npm/lin-ui/utils/util'

const getSystemSize = async function () {
  const res = await promisic(wx.getSystemInfo)()
  return {
    windowHeight: res.windowHeight,
    windowWidth: res.windowWidth,
    screenWidth: res.screenWidth,
    screenHeight: res.screenHeight
  }
}

const getWindowHeightRpx = async function () {
  const res = await getSystemSize()
  // 此处获取到的 windowHeight 的单位是 px，需要转化成rpx
  return px2rpx(res.windowHeight)
}

export {
  getSystemSize,
  getWindowHeightRpx
}
