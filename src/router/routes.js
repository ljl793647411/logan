
export default [
  {
    path: '/',
    redirect: '/home',
    component: resolve => require(['../view/home.vue'], resolve)
  },
  {
    path: '/login',
    name: '登录页', 
    component: resolve => require(['../view/login.vue'], resolve)
    
  },
  {
    path: '/home',
    name: '首页',
    component: resolve => require(['../view/home.vue'], resolve)
  },
]