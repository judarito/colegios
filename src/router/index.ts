import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import { useAuthStore } from '../stores/auth'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { 
    path: '/dashboard', 
    component: Dashboard,
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/dashboard/inicio' },
      { path: 'inicio', component: () => import('../views/Inicio.vue') },
      { path: 'institucion', component: () => import('../views/Institucion.vue') },
      { path: 'profesores', component: () => import('../views/Profesores.vue') },
      { path: 'alumnos', component: () => import('../views/Alumnos.vue') },
      { path: 'cursos', component: () => import('../views/Cursos.vue') },
      { path: 'grados', component: () => import('../views/Grados.vue') },
      { path: 'matriculas', component: () => import('../views/Matriculas.vue') },
      { path: 'inscripciones', component: () => import('../views/Inscripciones.vue') },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router