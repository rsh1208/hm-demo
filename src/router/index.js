// 配置路由信息
import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入组件
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Vser from '../views/User.vue'
import Edit from '../views/Edit.vue'
import MyFollow from '../views/MyFollow.vue'
import MyComment from '../views/MyComment.vue'
import MyStar from '../views/MyStar.vue'
import Home from '../views/Home.vue'
import Detail from '../views/Detail.vue'
import TabsEdit from '../views/TabsEdit.vue'
// 注册 
Vue.use(VueRouter)
const router = new VueRouter({
  // 配置路由规则
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/user',
      name: 'user',
      component: Vser
    },
    {
      path: '/edit',
      name: 'edit',
      component: Edit
    },
    {
      path: '/my-follow',
      name: 'my-follow',
      component: MyFollow
    },
    {
      path: '/my-comment',
      name: 'my-comment',
      component: MyComment
    },
    {
      path: '/my-star',
      name: 'my-star',
      component: MyStar
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/detail/:id',
      name: 'detail',
      component: Detail
    },
    {
      path: '/tabsEdit',
      component: TabsEdit
    }
  ]
})
router.beforeEach((to, from, next) => {
  const authPath = ['/user', '/my-follow', '/my-comments', '/my-star', '/edit']
  if (authPath.includes(to.path)) {
    const token = localStorage.getItem('token')
    if (token) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
})
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
export default router