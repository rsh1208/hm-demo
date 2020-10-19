import Vue from 'vue'
import App from './App.vue'
Vue.config.productionTip = false
import './styles/base.less'
import './styles/iconfont.css'
import 'lib-flexible'
import 'vant/lib/icon/local.css'
import router from './router'
import HmHeader from './components/HmHeader.vue'
import HmLogo from './components/HmLogo.vue'
import HmButton from './components/HmButton.vue'
import HmPost from './components/HmPost.vue'
import moment from 'moment'
import { Sticky, PullRefresh, Tab, Tabs, List, Field, Toast, Cell, CellGroup, Dialog, Radio, RadioGroup, Uploader } from 'vant'
Vue.use(Sticky)
Vue.use(PullRefresh);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(List)
Vue.use(Field)
Vue.use(Toast)
Vue.use(Cell)
Vue.use(CellGroup)
Vue.use(Dialog)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Uploader)
Vue.filter('date', function (value, format = 'YYYY-MM-DD') {
  return moment(value).format(format)
})
Vue.component('hm-header', HmHeader)
Vue.component('hm-logo', HmLogo)
Vue.component('hm-button', HmButton)
Vue.component('hm-post', HmPost)
import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:3000'
Vue.prototype.$axios = axios
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = token
  }
  return config
})
axios.interceptors.response.use((res) => {
  const { statusCode, message } = res.data
  if (statusCode === 401 && message === '用户信息验证失败') {
    localStorage.removeItem('token')
    localStorage.removeItem('user_id')
    router.push('/login')
  }
  return res
})
new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')