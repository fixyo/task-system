let base = 'http://zone.bz.cn/BzSystem'
// let base = 'http://47.101.211.217:8080/BzSystem'
// let phpBase = 'http://support.bz.cn'
// 如果是正式服地址
if (window.location.host === 'mg.bz.cn' || window.location.host === 'zone.bz.cn') {
  base = 'http://zone.bz.cn/BzSystem'
//   phpBase = 'http://support.bz.cn'
} else { // 非正式服环境
//   base = 'http://zone.bz.cn/BzSystem'// 因为测试服没有权限所以先用正式服的接口

  base = 'http://47.101.211.217:8080/BzSystem'// 测试服

  // base = 'http://192.168.4.93:8080/BzSystem' //庞颖

  // base = 'http://192.168.4.93:8080/BzSystem'
  // phpBase = 'http://test.support.bz.cn'
  // base = 'http://192.168.15.122:8080/BzSystem' // 施翼
  // base='http://192.168.1.122:8080/BzSystem'//庞颖
  // base='http://zone.bz.cn/BzSystem'//正式服
  // base = 'http://192.168.1.170:9999/BzSystem'// 匡祥干
  // base = 'https://bz.nnnnzs.cn/BzSystem'
}
// 默认图片上传等静态资源的域名路径
export const phpURL = 'http://support.bz.cn'
export const staticUrl = 'http://static.bz.cn/'
export const semUrl = 'http://sem.bz.cn'// 营销那边服务器，没有测试服只有正式服
export const baseUrl = base
