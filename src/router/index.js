import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SendView from '../views/SendView.vue'
import LoginView from '../views/LoginView.vue'
import ReceiveView from '../views/ReceiveView.vue'
import SearchView from '../views/SearchView.vue'
import ClosedView from '../views/ClosedView.vue'
import ModifyView from '../views/ModifyView.vue'
import RegisterView from '../views/RegisterView.vue'
import Register_techView from '../views/Register_techView.vue'
import FormView from '../views/FormView.vue'

import FindNoPage from '../views/FindNoPage.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  // },
  {
    path:"/send",
    name:"SendView",
    component: SendView,
  },
  {
    path:"/receive",
    name:"ReceiveView",
    component: ReceiveView
  },
  {
    path:"/login",
    name:"LoginView",
    component: LoginView,
  },
  {
    path:"/search",
    name:"SearchView",
    component: SearchView
  },
  {
    path:"/closed",
    name:"ClosedView",
    component: ClosedView
  },
  {
    path:"/modify",
    name:"ModifyView",
    component: ModifyView
  },
  {
    path:"/register",
    name:"RegisterView",
    component: RegisterView
  },
  {
    path:"/register_tech",
    name:"Register_techView",
    component: Register_techView
  },
  {
    path:"/form",
    name:"FormView",
    component: FormView
  },
  {
    path:"/:pathMatch(.*)*",
    name:"FindNoPage",
    component:FindNoPage
  }
  
]

const router = new VueRouter({
  routes
})

export default router
