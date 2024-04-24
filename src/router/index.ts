import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login/Login.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/login/Register.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/login/Register.vue')
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
          path:'/drug-study',
          name: 'drug-study',
          component: () => import('../views/caseStudy/DrugStudy.vue')
        },
        {
          path:'/lab-study',
          name: 'lab-study',
          component: () => import('../views/caseStudy/LabStudy.vue')
        },
        {
          path: '/case-detail/:cid',
          name: 'case-details',
          component: () => import('../views/caseStudy/CaseDetails.vue'),
          props: true  // Enable route params to be passed as props
        },
        {
          path: '/case-new',
          name: 'case-new',
          component: () => import('../views/caseStudy/CaseNew.vue'),
          props: true  // Enable route params to be passed as props
        },
        {
          path: '/paper/:eu_id/:paper_id',
          name: 'paper',
          component: () => import('../views/analysisEvaluation/Paper.vue'),
          props: true  // Enable route params to be passed as props
        },
        {
          path: '/paper-finished/:eu_id/:paper_id',
          name: 'paper-finished',
          component: () => import('../views/analysisEvaluation/PaperFinished.vue'),
          props: true  // Enable route params to be passed as props
        },
        {
          path: '/case-modify/:cid',
          name: 'case-modify',
          component: () => import('../views/caseStudy/CaseModify.vue'),
          props: true  // Enable route params to be passed as props
        },
        {
          path:'/drug-study',
          name: 'drug-study',
          component: () => import('../views/caseStudy/DrugStudy.vue')
        },
        {
          path:'/lab-study',
          name: 'lab-study',
          component: () => import('../views/caseStudy/LabStudy.vue')
        },
        {
          path: '/case-detail/:cid',
          name: 'case-details',
          component: () => import('../views/caseStudy/CaseDetails.vue'),
          props: true  // Enable route params to be passed as props
        },
        {
          path: '/case-new',
          name: 'case-new',
          component: () => import('../views/caseStudy/CaseNew.vue'),
          props: true  // Enable route params to be passed as props
        },
        {
          path: '/paper/:eu_id/:paper_id',
          name: 'paper',
          component: () => import('../views/analysisEvaluation/Paper.vue'),
          props: true  // Enable route params to be passed as props
        },
        {
          path: '/paper-finished/:eu_id/:paper_id',
          name: 'paper-finished',
          component: () => import('../views/analysisEvaluation/PaperFinished.vue'),
          props: true  // Enable route params to be passed as props
        },
        {
          path: '/case-modify/:cid',
          name: 'case-modify',
          component: () => import('../views/caseStudy/CaseModify.vue'),
          props: true  // Enable route params to be passed as props
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
        },
        {
          path: '/roomtour/:roomId/:roomName',
          name: 'PanoramaViewer',
          component: ()=> import('../views/panoramaTour/RoomTour.vue')
        },
        {
          path:'/ai-chat',
          name: 'ai-chat',
          component: () => import('../views/aiChat/AiChat.vue')
        },
        {
          path: '/manage-cases',
          name: 'manage-cases',
          component: () => import('../views/management/ManageCases.vue')
        },
        {
          path: '/manage-exams',
          name: 'manage-exams',
          component: () => import('../views/management/ManageExams.vue')
        },
        {
          path: '/manage-questions',
          name: 'manage-questions',
          component: () => import('../views/management/ManageQuestions.vue')
        },
        {
          path: '/manage-users',
          name: 'manage-users',
          component: () => import('../views/management/ManageUsers.vue')
        },
        {
          path: '/manage-assays',
          name: 'manage-assays',
          component: () => import('../views/management/ManageLabs.vue')
        },
        {
          path: '/manage-drugs',
          name: 'manage-drugs',
          component: () => import('../views/management/ManageDrugs.vue')
        },
        {
          path: '/manage-papers',
          name: 'manage-papers',
          component: () => import('../views/management/ManagePapers.vue')
        },
        {
          path:'/manage-panorama',
          name: 'manage-panorama',
          component: () => import('../views/management/ManagePanorama.vue')
        },
        {
          path:'/manage-roomtour/:roomId/:roomName',
          name:'manage-roomtour',
          component: () => import("../views/management/ManageRoomTour.vue")
        },
      ]
    },


  ]
})
router.beforeEach((to, from, next) => {
  if (!sessionStorage.getItem('token') && to.name !== 'login' && to.name !== 'register') {
    next({ name: 'login' });
  } else {
    next();
  }
});
router.beforeEach((to, from, next) => {
  if (!sessionStorage.getItem('token') && to.name !== 'login' && to.name !== 'register') {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router
