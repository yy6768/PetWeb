import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/login/Login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path:'/',
      name: 'main',
      redirect: '/login',
      component: () => import('../layout/DefaultLayout.vue'),
      children: [
        {
          path:'/home',
          name: 'home',
          component: () => import('../views/Home.vue')
        },
        {
          path:'/role-preview',
          name: 'role-preview',
          component: () => import('../views/rolePreview/RolePreview.vue')
        },
        {
          path:'/case-study',
          name: 'case-study',
          component: () => import('../views/caseStudy/CaseStudy.vue')
        },
        {
          path:'/analysis-evaluation',
          name: 'analysis-evaluation',
          component: () => import('../views/analysisEvaluation/AnalysisEvaluation.vue')
        },
        {
          path:'/panorama-tour',
          name: 'panorama-tour',
          component: () => import('../views/panoramaTour/PanoramaTour.vue')
        }
        ,
        {
          path:'/ai-chat',
          name: 'ai-chat',
          component: () => import('../views/aiChat/AiChat.vue')
        }
      ]
    },
    
  ]
})

export default router
