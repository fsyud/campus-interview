import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import HomePage from '@/components/HomePage'
import Endpage from '@/components/Endpage'
import CheckDevice from '@/components/CheckDevice'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/interview',
      name: 'home',
      component: HomePage,
      meta: {
        title: "首页"
      }
    },
    {
      path: '/',
      name: 'login',
      component: Login,
      meta: {
        title: "登录"
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        title: "登录"
      }
    },
    {
      path: '/checkdevice',
      name: 'checkdevice',
      component: CheckDevice,
      meta: {
        title: "检测设备"
      }
    },
    {
      path: '/end',
      name: 'end',
      component: Endpage,
      meta: {
        title: "结束页"
      }
    },
  ]
})
