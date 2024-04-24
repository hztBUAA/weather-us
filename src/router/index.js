import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
// import LayoutView from "@/views/LayoutView.vue";
import ChangePassword from '@/views/user/ChangePassword.vue'
import CitySubscribe from '@/views/user/CitySubscribe.vue'
import ProfileView from '@/views/user/ProfileView.vue'
import Feedback from '@/views/user/Feedback.vue'

// 路由 和 sidebar这一块 以及显示的时候有关系   children？？？

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  // 此处对应面包屑的注释？  中文 改成dashboard
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: '仪表盘',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  // （何山）之后需要注意  不要和蒋世琪的用户个人信息的path重合混淆了
  {
    path: '/admin',
    component: Layout,
    meta: { title: '管理员功能', icon: 'el-icon-view' },
    children: [
      {
        path: 'user-con',
        component: () => import('@/views/admin/user-con'),
        name: '用户管理',
        meta: { title: '用户管理', icon: 'el-icon-user' }
      },
      {
        path: 'launch-varn',
        component: () => import('@/views/admin/launch-varn'),
        name: '发布预警',
        meta: { title: '发布预警', icon: 'el-icon-bell' }
      },
      {
        path: 'deal-feedback',
        component: () => import('@/views/admin/deal-feedback'),
        name: '处理反馈',
        meta: { title: '处理反馈', icon: 'el-icon-edit-outline' }
      },
      {
        path: 'launch-notice',
        component: () => import('@/views/admin/launch-notice'),
        name: '发布公告',
        meta: { title: '发布公告', icon: 'el-icon-s-opportunity' }
      }
    ]
  },
  {
    path: '/notice',
    component: Layout,
    children: [
      {
        path: 'digests',
        component: () => import('@/views/notice/notice'),
        name: '公告',
        meta: { title: '公告', icon: 'el-icon-chat-dot-square' },
      },
      // {
      //   path: 'content',
      //   component: () => import('@/views/notice/content'),
      //   hidden: 'true',
      //   name: '帖子详情',
      //   meta: { title: '帖子详情' },
      // }
    ]
  },
  // （蒋世祺）这里是用户端的个人信息界面  之后可能需要对应到 模版的个人信息界面（模版里面是没有的 但是可以对照admin的另外一个大的框架复制粘贴到本项目中）
  {
    path: '/user',
    component: Layout,
    meta: { title: '个人信息管理', icon: 'el-icon-s-check' },
    children: [
      {
        path: 'profile',
        component: ProfileView,
        alias: '',
        meta: { title: '用户信息', icon: 'el-icon-s-custom' }
      },
      {
        path: 'changePassword',
        component: ChangePassword,
        meta: { title: '修改密码', icon: 'el-icon-setting' }
      },
      {
        path: 'citySubscribe',
        component: CitySubscribe,
        meta: { title: '订阅城市', icon: 'el-icon-location-outline' }
      },
      {
        path: 'feedback',
        component: Feedback,
        meta: { title: '反馈', icon: 'el-icon-s-promotion' }
      }
    ]
  },
  {
    path: '/city',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/city/index'),
        name: 'City',
        meta: { title: '城市', icon: 'el-icon-location' }
      }
    ]
  },
  {
    path: '/example',
    component: Layout,
    // redirect: '/form/index',
    name: 'Example',
    meta: { title: '示例', icon: 'el-icon-s-help' }
    // children: [
    //   {
    //     path: 'table',
    //     name: 'Table',
    //     component: () => import('@/views/table/index'),
    //     meta: { title: 'Table', icon: 'table' }
    //   },
    //   {
    //     path: 'tree',
    //     name: 'Tree',
    //     component: () => import('@/views/tree/index'),
    //     meta: { title: 'Tree', icon: 'tree' }
    //   }
    // ]
  },
  {
    path: '/map',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/map/MapView'),
        name: 'Map',
        meta: { title: '地图', icon: 'el-icon-map-location' }
      }
    ]
  },

  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: '表格', icon: 'form' }
      }
    ]
  },

  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: 'Nested',
      icon: 'nested'
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: 'Menu1',
        meta: { title: 'Menu1' },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: { title: 'Menu1-1' }
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/nested/menu1/menu1-2'),
            name: 'Menu1-2',
            meta: { title: 'Menu1-2' },
            children: [
              {
                path: 'menu1-2-1',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                name: 'Menu1-2-1',
                meta: { title: 'Menu1-2-1' }
              },
              {
                path: 'menu1-2-2',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                name: 'Menu1-2-2',
                meta: { title: 'Menu1-2-2' }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3'),
            name: 'Menu1-3',
            meta: { title: 'Menu1-3' }
          }
        ]
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index'),
        name: 'Menu2',
        meta: { title: 'menu2' }
        // hidden: true
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
