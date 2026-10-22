import Vue from 'vue'
import VueRouter from 'vue-router'
import UserView from '../views/UserView.vue'
import QuestionView from '../views/QuestionView.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/users' },
  {
    path: '/users',
    name: 'UserManage',
    component: UserView,
    meta: { title: '用户管理' }
  },
  {
    path: '/questions',
    name: 'QuestionManage',
    component: QuestionView,
    meta: { title: '题目管理' }
  },
  { path: '*', redirect: '/users' }
]

// hash 模式：dist/index.html 直接双击打开也能正常切换页面
const router = new VueRouter({
  mode: 'hash',
  routes
})

router.afterEach((to) => {
  document.title = `${(to.meta && to.meta.title) || '首页'} - Quiz 后台管理系统`
})

export default router
