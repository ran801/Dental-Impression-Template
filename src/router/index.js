import Vue from 'vue'
import VueRouter from 'vue-router'
//import HomeView from '../views/HomeView.vue'
import SendView from '../views/SendView.vue'
import LoginView from '../views/LoginView.vue'
import ReceiveView from '../views/ReceiveView.vue'
import SearchView from '../views/SearchView.vue'
import ClosedView from '../views/ClosedView.vue'
import ModifyView from '../views/ModifyView.vue'
// import RegisterView from '../views/RegisterView.vue'
// import Register_techView from '../views/Register_techView.vue'
import FormView from '../views/FormView.vue'
import InviteView from '../views/InviteView.vue'
import FindNoPage from '../views/FindNoPage.vue'


Vue.use(VueRouter)

const routes = [
  {
    path:"/",
    name:"home",
    component: LoginView,
    meta:{title:'牙模登入頁'}
  },
  // {
  //   path: '/',
  //   name: 'home',
  //   component: HomeView
  // },
  {
    path:"/send",
    name:"SendView",
    component: SendView,
    meta:{title:'出口頁面'}
  },
  {
    path:"/receive",
    name:"ReceiveView",
    component: ReceiveView,
    meta:{title:'接收牙模'}
    
  },
  {
    path:"/search",
    name:"SearchView",
    component: SearchView,
    meta:{title:'搜尋頁面'}
  },
  {
    path:"/closed",
    name:"ClosedView",
    component: ClosedView,
    meta:{title:'結案頁面'}
  },
  {
    path:"/modify/:id",
    name:"ModifyView",
    component: ModifyView,
    meta:{title:'修改頁面'}
  },
  // {
  //   path:"/register",
  //   name:"RegisterView",
  //   component: RegisterView
  // },
  // {
  //   path:"/register_tech",
  //   name:"Register_techView",
  //   component: Register_techView
  // },
  {
    path:"/form",
    name:"FormView",
    component: FormView,
    meta:{title:'FormPage'}
  },
  {
    path:"/invite",
    name:"InviteView",
    component: InviteView,
    meta:{title:'註冊頁面'}
  },
  //FindNoPage要放在最後面
  {
    path:"/:pathMatch(.*)*",
    name:"FindNoPage",
    component:FindNoPage
  },

  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  // },
  
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title
    }
    next();
})

export default router
