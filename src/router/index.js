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
// 注册 
Vue.use(VueRouter)
const router = new VueRouter({
  // 配置路由规则
  routes: [
    {
      path: '/',
      redirect: '/login'
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
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.path === '/user') {
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