import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'main',
    component:()=>import('../views/Main.vue'),
    children:[
      {
        path:'/',
        name:'home',
        component:()=>import('../views/Home.vue')
      },
      {
        path:'/articles/:id',
        name:'article',
        component:()=>import('../views/Article.vue'),
        props:true
      }
    ]
  },
  {
    path:'/heroes/:id',
    name:'hero',
    component:()=>import ('../views/Hero.vue'),
    props:true
  }
]

const router = new VueRouter({
  routes
})

export default router
