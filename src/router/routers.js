import Main from '@/components/main'
// import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 注意这里的菜单是角色   可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 *  actName:设置该字段，可以指定某个菜单名字高亮
 * }
 */
let route = [{
  path: '/login',
  name: 'login',
  meta: {
    title: 'Login - 登录',
    hideInMenu: true
  },
  component: () => import('@/view/login/login.vue')
},
{
  path: '/',
  name: '_home',
  redirect: '/home',
  component: Main,
  meta: {
    hideInMenu: false,
    notCache: true
  },
  children: [{
    path: '/home',
    name: 'home',
    meta: {
      hideInMenu: false,
      title: '个人主页',
      notCache: true,
      icon: 'ios-contact'
    },
    component: () => import('@/view/user/user')
  }]
},
{
  path: '/public',
  name: 'public',
  component: Main,
  meta: {
    title: '综合模块',
    icon: 'ios-list-box',
    hideInMenu: false,
    showAlways: true,
    access: ['public']
  },
  children: [{
    path: '/reward',
    name: 'reward',
    component: () => import('@/view/public/reward/reward'),
    meta: {
      hideInMenu: false,
      title: '日常奖惩',
      notCache: false,
      icon: 'md-home',
      access: ['reward']
    }
  },
  {
    path: '/task',
    name: 'taskAll',
    component: () => import('@/view/public/task/components/task-types.vue'),
    meta: {
      hideInMenu: false,
      title: '任务系统',
      notCache: false,
      icon: 'md-home',
      // access: ['taskTrack']
    },
    redirect: '/task/all',
    children: [
      {
        path: 'all',
        name: 'all',
        meta: {
          title: '全部任务',
          hideInMenu: true,
          actName: 'taskAll'
        },
        component: () => import('@/view/public/task/all.vue'),
      },
      {
        path: 'propose',
        name: 'taskPropose',
        component: () => import('@/view/public/task/propose-e'),
        meta: {
          hideInMenu: true,
          title: '我发起的任务',
          icon: 'md-home',
          actName: 'taskAll'
        }
      }
    ]
  }, 
  // {
  //   path: '/task/propose',
  //   name: 'taskPropose',
  //   component: () => import('@/view/public/task/propose-e'),
  //   meta: {
  //     hideInMenu: true,
  //     title: '我发起的任务',
  //     icon: 'md-home',
  //     actName: 'taskAll'
  //   }
  // }, 
  {
    path: '/task/accept',
    name: 'taskAccept',
    component: () => import('@/view/public/task/accept'),
    meta: {
      hideInMenu: true,
      title: '我接受的任务',
      notCache: false,
      icon: 'md-home'
    }
  },
  {
    path: '/task/excute',
    name: 'taskExcute',
    component: () => import('@/view/public/task/excute'),
    meta: {
      hideInMenu: true,
      title: '我执行的任务',
      notCache: false,
      icon: 'md-home'
    }
  }, {
    path: '/task/focus',
    name: 'taskFocus',
    component: () => import('@/view/public/task/focus'),
    meta: {
      hideInMenu: true,
      title: '我关注的任务',
      notCache: false,
      icon: 'md-home'
    }
  }, {
    path: '/task/pending',
    name: 'taskPending',
    component: () => import('@/view/public/task/pending'),
    meta: {
      hideInMenu: true,
      title: '待审任务',
      notCache: false,
      icon: 'md-home'
    }
  },
  {
    path: '/task/reward',
    name: 'taskReward',
    component: () => import('@/view/public/task/reward'),
    meta: {
      hideInMenu: true,
      title: '悬赏任务',
      notCache: false,
      icon: 'md-home'
    }
  }, {
    path: '/task/depart',
    name: 'taskDepart',
    component: () => import('@/view/public/task/depart'),
    meta: {
      hideInMenu: true,
      title: '部门任务',
      notCache: false,
      icon: 'md-home'
    }
  }, {
    path: '/task/monthly',
    name: 'taskMonthly',
    component: () => import('@/view/public/task/monthly'),
    meta: {
      hideInMenu: true,
      title: '月度评审',
      notCache: false,
      icon: 'md-home'
    }
  }, {
    path: '/task/detail',
    name: 'taskDetail',
    component: () => import('@/view/public/task/detail'),
    meta: {
      hideInMenu: true,
      title: '任务详情',
      notCache: false,
      icon: 'md-home'
    }
  }, {
    path: '/companyinfo',
    name: 'companyinfo',
    component: () => import('@/view/public/companyinfo/companyinfo'),
    meta: {
      hideInMenu: false,
      title: '公司信息',
      notCache: false,
      icon: 'md-home'
    //   access: ['companyinfo']
    }
  },

  {
    path: '/companyinfo/editCompany',
    name: 'editCompany',
    meta: {
      hideInMenu: true,
      title: '编辑公司信息',
      notCache: true,
      icon: 'md-home'
    },
    component: () => import('@/view/public/companyinfo/editCompany')
  },
  {
    path: '/companyinfo/showCompany',
    name: 'showCompany',
    meta: {
      hideInMenu: true,
      title: '查看公司详情',
      notCache: true,
      icon: 'md-home'
    },
    component: () => import('@/view/public/companyinfo/showCompany')
  }, {
    path: '/talk',
    name: 'talk',
    meta: {
      hideInMenu: true,
      title: '成员面谈',
      notCache: true,
      icon: 'md-home',
      access: ['talk']
    },
    component: () => import('@/view/public/talk/talk.vue')
  }, {
    path: '/station',
    name: 'station',
    meta: {
      hideInMenu: false,
      title: '站内信',
      notCache: true,
      icon: 'md-home',
      access: ['station']
    },
    component: () => import('@/view/public/station/station.vue')
  },
  {
    path: '/station/unreadList',
    name: 'unreadList',
    meta: {
      hideInMenu: true,
      title: '未读列表',
      notCache: true,
      icon: 'md-home'
    },
    component: () => import('@/view/public/station/unreadList.vue')
  }
  ]
},
{
  path: '/sem',
  name: 'sem',
  component: Main,
  meta: {
    title: '营销',
    icon: 'ios-list-box',
    hideInMenu: false,
    showAlways: true,
    access: ['sem']
  },
  children: [
    {
      path: '/sem/baseInfo',
      name: 'semBaseInfo',
      meta: {
        title: '基础信息',
        icon: 'md-home'
      },
      component: () => import('@/view/sem/baseInfo/baseInfo.vue')
    },
    {
      path: '/sem/sheet',
      name: 'semSheet',
      meta: {
        title: '成本表',
        icon: 'md-home',
        notCache: false
      },
      component: () => import('@/view/sem/sheet/sheetList.vue')
    },
    {
      path: '/sem/extension',
      name: 'semExtension',
      component: () => import('@/view/sem/group/group.vue'),
      meta: {
        title: '推广组/关键词',
        icon: 'md-home',
        hideInMenu: false,
        notCache: false
      }
    },
    {
      path: '/sem/softDetail',
      name: 'softDetail',
      component: () => import('@/view/sem/group/software/softwareDetail.vue'),
      meta: {
        title: '产品详情',
        icon: 'md-home',
        hideInMenu: true,
        notCache: false,
        actName: 'semExtension'
      }
    },
    {
      path: '/sem/KeywordDetail',
      name: 'semKeywordDetail',
      meta: {
        title: '关键词详情',
        icon: 'md-home',
        hideInMenu: true,
        notCache: true
      },
      component: () => import('@/view/sem/group/keywords/detail.vue')
    },
    {
      path: '/sem/editExtension',
      name: 'editExtension',
      meta: {
        title: route => `${route.query.title}推广组`,
        hideInMenu: true,
        notCache: true
      },
      component: () => import('@/view/sem/group/extension/editExtension.vue')
    },
    {
      path: '/sem/editExtension',
      name: 'editSimple',
      meta: {
        title: '编辑推广组',
        hideInMenu: true,
        notCache: true
      },
      component: () => import('@/view/sem/group/extension/editSimple.vue')
    },
    {
      path: '/sem/showExtension',
      name: 'showExtension',
      meta: {
        title: '查看推广组',
        hideInMenu: true,
        notCache: false
      },
      component: () => import('@/view/sem/group/extension/showExtension.vue')
    },
    {
      path: '/sem/config',
      name: 'semConfig',
      meta: {
        title: '营销配置',
        icon: 'md-home',
        notCache: true
      },
      component: () => import('@/view/sem/config/config.vue')
    },
    {
      path: '/sem/log',
      name: 'semLog',
      meta: {
        title: '日志',
        icon: 'md-home',
        notCache: false
      },
      component: () => import('@/view/sem/log/log.vue')
    }
  ]
},
{
  path: '/hr',
  name: 'hr',
  component: Main,
  meta: {
    title: '人力运营中心',
    icon: 'ios-list-box',
    hideInMenu: false,
    showAlways: true,
    access: ['hr']
  },
  children: [{
    path: '/userManage',
    name: 'userManage',
    component: () => import('@/view/public/organization/userManage.vue'),
    meta: {
      hideInMenu: false,
      title: '用户管理',
      notCache: false,
      icon: 'md-home',
      access: ['userManage']
    }
  },
  {
    path: '/organization/addUser',
    name: 'addUser',
    meta: {
      actName: 'userManage',
      hideInMenu: true,
      title: route => `${route.params.title || '新增'}用户信息`,
      notCache: true,
      icon: 'md-home'
    },
    component: () => import('@/view/public/organization/addUser')
  }, {
    path: '/organization/showUser',
    name: 'showUser',
    meta: {
      actName: 'userManage',
      hideInMenu: true,
      title: '查看用户信息',
      notCache: false,
      icon: 'md-home'
    },
    component: () => import('@/view/public/organization/showUser')
  },
  {
    path: '/hr/position',
    name: 'position',
    component: () => import('@/view/hr/position/position.vue'),
    meta: {
      hideInMenu: false,
      title: '职位管理',
      notCache: false,
      icon: 'md-home',
      access: ['position']
    }
  }, {
    path: '/hr/organization',
    name: 'organization',
    component: () => import('@/view/hr/organization/organization.vue'),
    meta: {
      hideInMenu: false,
      title: '组织规划',
      notCache: false,
      icon: 'md-home',
      access: ['organization']
    }
  }]
},
{
  path: '/cloud',
  name: 'cloud',
  component: Main,
  meta: {
    title: '业务运营中心',
    icon: 'ios-list-box',
    hideInMenu: false,
    showAlways: true,
    access: ['cloud']
  },
  children: [{
    path: '/partnership',
    name: 'partnership',
    component: () => import('@/view/public/cloud/partnership.vue'),
    meta: {
      hideInMenu: true,
      title: '合作关系1',
      notCache: true,
      icon: 'md-home'
    }
  },
  {
    path: '/productCompany',
    name: 'productCompany',
    component: () => import('@/view/public/cloud/parter/productCompany.vue'),
    meta: {
      hideInMenu: false,
      title: '合作关系',
      notCache: true,
      icon: 'md-home',
      actName: 'productCompany'
    //   access: ['partnership']
    }
  }, {
    path: '/channelCompany',
    name: 'channelCompany',
    component: () => import('@/view/public/cloud/parter/channelCompany.vue'),
    meta: {
      hideInMenu: true,
      title: '渠道公司',
      notCache: true,
      icon: 'md-home',
      actName: 'productCompany'
      // access: ['partnership']
    }
  }, {
    path: '/contractBank',
    name: 'contractBank',
    component: () => import('@/view/public/cloud/parter/contractBank.vue'),
    meta: {
      hideInMenu: true,
      title: '合同库',
      notCache: true,
      icon: 'md-home',
      actName: 'productCompany'
      // access: ['partnership']
    }
  }, {
    path: '/productBank',
    name: 'productBank',
    component: () => import('@/view/public/cloud/parter/productBank.vue'),
    meta: {
      hideInMenu: true,
      title: '产品库',
      notCache: true,
      icon: 'md-home',
      actName: 'productCompany'
      // access: ['partnership']
    }
  }, {
    path: '/productLink',
    name: 'productLink',
    component: () => import('@/view/public/cloud/parter/productLink.vue'),
    meta: {
      hideInMenu: true,
      title: '产品链接库',
      notCache: true,
      icon: 'md-home',
      actName: 'productCompany'
      // access: ['partnership']
    }
  }, {
    path: '/toAuditInform',
    name: 'toAuditInform',
    component: () => import('@/view/public/cloud/parter/toAuditInform.vue'),
    meta: {
      hideInMenu: true,
      title: '待审核上线',
      notCache: true,
      icon: 'md-home',
      actName: 'productCompany'
      // access: ['partnership']
    }
  }, {
    path: '/addProduct',
    name: 'addProduct',
    component: () => import('@/view/public/cloud/add/addProduct.vue'),
    meta: {
      hideInMenu: true,
      title: '新增产品公司',
      notCache: false,
      icon: 'md-home',
      actName: 'productCompany'
    }
  }, {
    path: '/editProduct',
    name: 'editProduct',
    component: () => import('@/view/public/cloud/edit/editProduct.vue'),
    meta: {
      hideInMenu: true,
      title: '编辑产品公司',
      notCache: false,
      icon: 'md-home',
      actName: 'productCompany'
    }
  }, {
    path: '/detailProduct',
    name: 'detailProduct',
    component: () => import('@/view/public/cloud/detail/detailProduct.vue'),
    meta: {
      hideInMenu: true,
      title: '产品公司详情',
      notCache: false,
      icon: 'md-home',
      actName: 'productCompany'
    }
  }, {
    path: '/addChannle',
    name: 'addChannle',
    component: () => import('@/view/public/cloud/add/addChannle.vue'),
    meta: {
      hideInMenu: true,
      title: '新增渠道公司',
      notCache: false,
      icon: 'md-home',
      actName: 'productCompany'
    }
  }, {
    path: '/editChannel',
    name: 'editChannel',
    component: () => import('@/view/public/cloud/edit/editChannel.vue'),
    meta: {
      hideInMenu: true,
      title: '编辑渠道公司',
      notCache: false,
      icon: 'md-home',
      actName: 'productCompany'
    }
  }, {
    path: '/detailChannel',
    name: 'detailChannel',
    component: () => import('@/view/public/cloud/detail/detailChannel.vue'),
    meta: {
      hideInMenu: true,
      title: '渠道公司详情',
      notCache: false,
      icon: 'md-home',
      actName: 'productCompany'
    }
  },
  {
    path: '/payDetailChannel',
    name: 'payDetailChannel',
    component: () => import('@/view/public/cloud/detail/payDetailChannel.vue'),
    meta: {
      hideInMenu: true,
      title: '渠道公司详情',
      notCache: false,
      icon: 'md-home',
      actName: 'productCompany'
    }
  },
  {
    path: '/addIncome',
    name: 'addIncome',
    component: () => import('@/view/public/cloud/add/addIncome.vue'),
    meta: {
      hideInMenu: true,
      title: '我方拟定新增收款合同', // 我方拟定
      notCache: false,
      icon: 'md-home',
      actName: 'productCompany'
    }
  }, {
    path: '/addPayment',
    name: 'addPayment',
    component: () => import('@/view/public/cloud/add/addPayment.vue'),
    meta: {
      hideInMenu: true,
      title: '我方拟定新增付款合同', // 我方拟定
      notCache: false,
      icon: 'md-home',
      actName: 'productCompany'
    }

  }, {
    path: '/otherAddIncome',
    name: 'otherAddIncome',
    component: () => import('@/view/public/cloud/add/otherAddIncome.vue'),
    meta: {
      hideInMenu: true,
      title: '对方拟定新增收款合同', // 对方拟定
      notCache: false,
      icon: 'md-home',
      actName: 'productCompany'
    }
  }, {
    path: '/supplement',
    name: 'supplement',
    component: () => import('@/view/public/cloud/detail/supplement.vue'),
    meta: {
      hideInMenu: true,
      title: '补充协议',
      notCache: false,
      icon: 'md-home',
      actName: 'productCompany'
    }

  },
  {
    path: '/paySupplement',
    name: 'paySupplement',
    component: () => import('@/view/public/cloud/detail/paySupplement.vue'),
    meta: {
      hideInMenu: true,
      title: '补充协议',
      notCache: false,
      icon: 'md-home',
      actName: 'productCompany'
    }

  },
  {
    path: '/editUnsign',
    name: 'editUnsign',
    component: () => import('@/view/public/cloud/edit/editUnsign.vue'),
    meta: {
      hideInMenu: true,
      title: '编辑待签订合同',
      notCache: false,
      icon: 'md-home',
      actName: 'productCompany'
    }

  },
  {
    path: '/payEditUnsign',
    name: 'payEditUnsign',
    component: () => import('@/view/public/cloud/edit/payEditUnsign.vue'),
    meta: {
      hideInMenu: true,
      title: '编辑待签订合同',
      notCache: false,
      icon: 'md-home',
      actName: 'productCompany'
    }

  },
  {
    path: '/detailContract',
    name: 'detailContract',
    component: () => import('@/view/public/cloud/detail/detailContract.vue'),
    meta: {
      hideInMenu: true,
      title: '合同详情',
      notCache: false,
      icon: 'md-home',
      actName: 'productCompany'
    }
  },
  {
    path: '/payDetailContract',
    name: 'payDetailContract',
    component: () => import('@/view/public/cloud/detail/payDetailContract.vue'),
    meta: {
      hideInMenu: true,
      title: '合同详情',
      notCache: false,
      icon: 'md-home',
      actName: 'productCompany'
    }
  },
  {
    path: '/otherAddPayment',
    name: 'otherAddPayment',
    component: () => import('@/view/public/cloud/add/otherAddPayment.vue'),
    meta: {
      hideInMenu: true,
      title: '对方拟定新增付款合同', // 对方拟定
      notCache: false,
      icon: 'md-home',
      actName: 'productCompany'
    }

  }, {
    path: '/dataSheet',
    name: 'dataSheet',
    component: () => import('@/view/public/cloud/dataSheet.vue'),
    meta: {
      hideInMenu: false,
      title: '数据表',
      notCache: false,
      icon: 'md-home',
      actName: 'productCompany'
      // access: ['dataSheet']
    }
  },
  // 安装
  {
    path: '/dataSheet/detailSet',
    name: 'detailSet',
    component: () => import('@/view/public/cloud/detailSheet/detailSet.vue'),
    meta: {
      hideInMenu: true,
      title: '数据表详情',
      notCache: false,
      icon: 'md-home',
      actName: 'productCompany'
      // access: ['dataSheet']
    }
  },
  // 分成
  {
    path: '/dataSheet/detailDevide',
    name: 'detailDevide',
    component: () => import('@/view/public/cloud/detailSheet/detailDevide.vue'),
    meta: {
      hideInMenu: true,
      title: '数据表详情',
      notCache: false,
      icon: 'md-home',
      actName: 'productCompany'
      // access: ['dataSheet']
    }
  },
    // 留存
  {
    path: '/dataSheet/detailKeep',
    name: 'detailKeep',
    component: () => import('@/view/public/cloud/detailSheet/detailKeep.vue'),
    meta: {
      hideInMenu: true,
      title: '数据表详情',
      notCache: false,
      icon: 'md-home',
      actName: 'productCompany'
      // access: ['dataSheet']
    }
  },
  // 充值
  {
    path: '/dataSheet/detailPay',
    name: 'detailPay',
    component: () => import('@/view/public/cloud/detailSheet/detailPay.vue'),
    meta: {
      hideInMenu: true,
      title: '数据表详情',
      notCache: false,
      icon: 'md-home',
      actName: 'productCompany'
      // access: ['dataSheet']
    }
  },
  //  {
  //   path: '/dataSheet/detailDataSheet',
  //   name: 'detailDataSheet',
  //   component: () => import('@/view/public/cloud/detailDataSheet.vue'),
  //   meta: {
  //     hideInMenu: true,
  //     title: '数据表详情',
  //     notCache: false,
  //     icon: 'md-home',
  //     actName: 'productCompany'
  //     // access: ['dataSheet']
  //   }
  // },
    // 合同预览
  {
    path: '/contractView',
    name: 'contractView',
    component: () => import('@/view/public/cloud/contractView.vue'),
    meta: {
      hideInMenu: true,
      title: '收款合同预览',
      notCache: false,
      icon: 'md-home',
      actName: 'productCompany'
      // access: ['dataSheet']
    }
  }, {
    path: '/payContractView',
    name: 'payContractView',
    component: () => import('@/view/public/cloud/payContractView.vue'),
    meta: {
      hideInMenu: true,
      title: '付款合同预览',
      notCache: false,
      icon: 'md-home',
      actName: 'productCompany'
      // access: ['dataSheet']
    }

  },
  {
    path: '/contractApprove',
    name: 'contractApprove',
    component: () => import('@/view/public/cloud/contractApprove.vue'),
    meta: {
      hideInMenu: true,
      title: '合同审批',
      notCache: false,
      icon: 'md-home',
      actName: 'productCompany'
      // access: ['dataSheet']
    }
  },
  {
    path: '/payContractApprove',
    name: 'payContractApprove',
    component: () => import('@/view/public/cloud/payContractApprove.vue'),
    meta: {
      hideInMenu: true,
      title: '合同审批',
      notCache: false,
      icon: 'md-home',
      actName: 'productCompany'
      // access: ['dataSheet']
    }
  },
  {
    path: '/toAuditDetail',
    name: 'toAuditDetail',
    component: () => import('@/view/public/cloud/toAuditDetail.vue'),
    meta: {
      hideInMenu: true,
      title: '待审核合同',
      notCache: false,
      icon: 'md-home',
      actName: 'productCompany'
      // access: ['dataSheet']
    }
  },
  {
    path: '/payToAuditDetail',
    name: 'payToAuditDetail',
    component: () => import('@/view/public/cloud/payToAuditDetail.vue'),
    meta: {
      hideInMenu: true,
      title: '待审核合同',
      notCache: false,
      icon: 'md-home',
      actName: 'productCompany'
      // access: ['dataSheet']
    }
  },
  {
    path: '/addProductBank',
    name: 'addProductBank',
    component: () => import('@/view/public/cloud/add/addProductBank.vue'),
    meta: {
      hideInMenu: true,
      title: '新增产品',
      notCache: false,
      icon: 'md-home',
      actName: 'productCompany'
    }
  }, {
    path: '/editProduckBank',
    name: 'editProduckBank',
    component: () => import('@/view/public/cloud/edit/editProduckBank.vue'),
    meta: {
      hideInMenu: true,
      title: '编辑产品',
      notCache: false,
      icon: 'md-home',
      actName: 'productCompany'
    }
  }]
},
{
  path: '/set',
  name: 'set',
  component: Main,
  meta: {
    title: '系统设置',
    icon: 'md-settings',
    hideInMenu: false,
    showAlways: true,
    access: ['set']
  },
  children: [{
    path: 'optionSet',
    name: 'optionSet',
    meta: {
      hideInMenu: false,
      title: '选项设置',
      notCache: false,
      icon: 'md-home',
      access: ['optionSet']

    },
    component: () => import('@/view/public/systemset/optionSet')
  },
  {
    path: '/set/holiday',
    name: 'holiday',
    meta: {
      hideInMenu: false,
      title: '节假日设置',
      notCache: false,
      icon: 'md-home',
      access: ['holiday']

    },
    component: () => import('@/view/systemset/holidaySet.vue')
  },
  {
    path: '/set/permissonSetting',
    name: 'permissonSetting',
    meta: {
      hideInMenu: false,
      title: '权限设置',
      notCache: false,
      icon: 'md-home',
      access: ['permissonSetting']// 单词拼错了。。。permission
    },
    component: () => import('@/view/systemset/permissionSetting.vue')
  },
    //   {
    //     path: '/set/talkRelationship',
    //     name: 'talkRelationship',
    //     meta: {
    //       hideInMenu: true,
    //       title: '面谈设置',
    //       notCache: true,
    //       icon: 'md-home',
    //       access: ['talkRelationship']

    //     },
    //     component: () => import('@/view/public/systemset/talkRelationship.vue')

    //   },
  {
    path: '/set/oplog',
    name: 'oplog',
    meta: {
      hideInMenu: false,
      title: '操作日志',
      notCache: true,
      icon: 'md-home',
      access: ['oplog']

    },
    component: () => import('@/view/public/systemset/oplog')
  },
  {
    path: '/set/doublepermissionSet',
    name: 'doublepermissionSet',
    meta: {
      hideInMenu: true,
      title: '两人两遍权限设置',
      notCache: true,
      icon: 'md-home',
      access: ['doublepermissionSet']

    },
    component: () => import('@/view/public/systemset/doublepermissionSet.vue')
  },
  {
    path: '/set/talkRelationship',
    name: 'talkRelationship',
    meta: {
      hideInMenu: true,
      title: '面谈设置',
      notCache: true,
      icon: 'md-home',
      access: ['talkRelationship']

    },
    component: () => import('@/view/public/systemset/talkRelationship.vue')
  },
  {
    path: '/set/cloudConfig',
    name: 'cloudConfig',
    meta: {
      hideInMenu: false,
      title: '云平台配置',
      notCache: true,
      icon: 'md-home',
      access: ['cloudConfig']

    },
    component: () => import('@/view/public/systemset/cloudConfig.vue')
  }
  ]
},
{
  path: '/401',
  name: 'error_401',
  meta: {
    hideInMenu: true
  },
  component: () => import('@/view/error-page/401.vue')
},
{
  path: '/500',
  name: 'error_500',
  meta: {
    hideInMenu: true
  },
  component: () => import('@/view/error-page/500.vue')
},
{
  path: '*',
  name: 'error_404',
  meta: {
    hideInMenu: true
  },
  component: () => import('@/view/error-page/404.vue')
}
]
export default route
