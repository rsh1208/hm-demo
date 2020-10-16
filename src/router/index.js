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
      component: Login
    },
    {
      path: '/register',
      component: Register
    },
    {
      path: '/user',
      component: Vser
    },
    {
      path: '/edit',
      component: Edit
    },
    {
      path: '/my-follow',
      component: MyFollow
    },
    {
      path: '/my-comment',
      component: MyComment
    },
    {
      path: '/my-star',
      component: MyStar
    },
    {
      path: '/home',
      component: Home
    }
  ]
})
router.beforeEach((to, from, next) => {
  const authPath = ['/user', '/my-follow', 'my-comments', '/my-star', '/edit']
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
export default router