import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ChatComp from '../components/ChatComp.vue'
import UserRegister from '../components/users/Register.vue'
import UserLogin from '../components/users/Login.vue'
import UserProfile from '../components/users/Profile.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/chat',
      name: 'chat',
      component: ChatComp,
    },
    {
      path: '/user-register',
      name: 'UserRegister',
      component: UserRegister,
    },
    {
      path: '/user-login',
      name: 'UserLogin',
      component: UserLogin,
    },
    {
      path: '/user-profile',
      name: 'UserProfile',
      component: UserProfile,
    },
  ],
})

export default router
