<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { Bar, Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

const router = useRouter()
const authStore = useAuthStore()
const drawer = ref(true)

const toggleDrawer = () => {
  drawer.value = !drawer.value
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}

const menuItems = [
  { title: 'Inicio', path: '/dashboard/inicio', icon: 'mdi-home' },
  { title: 'Institución', path: '/dashboard/institucion', icon: 'mdi-domain' },
  { title: 'Profesores', path: '/dashboard/profesores', icon: 'mdi-account-tie' },
  { title: 'Alumnos', path: '/dashboard/alumnos', icon: 'mdi-account-school' },
  { title: 'Cursos', path: '/dashboard/cursos', icon: 'mdi-book-open-variant' },
  { title: 'Grados', path: '/dashboard/grados', icon: 'mdi-school' },
  { title: 'Matrículas', path: '/dashboard/matriculas', icon: 'mdi-clipboard-text' },
  { title: 'Inscripciones', path: '/dashboard/inscripciones', icon: 'mdi-clipboard-plus' },
]

// Datos simulados para los widgets y gráficas
const totalStudents = ref(0)
const totalTeachers = ref(0)
const totalCourses = ref(0)
const upcomingEvents = ref([])
const studentsByGrade = ref({})
const courseDistribution = ref({})

// Función para simular la carga de datos
const loadDashboardData = () => {
  // Aquí normalmente harías una llamada a una API
  totalStudents.value = 1250
  totalTeachers.value = 75
  totalCourses.value = 40
  upcomingEvents.value = [
    { date: '2023-05-15', title: 'Reunión de padres' },
    { date: '2023-05-20', title: 'Exámenes finales' },
    { date: '2023-06-01', title: 'Inicio de vacaciones' },
  ]
  studentsByGrade.value = {
    '1º Grado': 150,
    '2º Grado': 140,
    '3º Grado': 135,
    '4º Grado': 130,
    '5º Grado': 125,
    '6º Grado': 120,
  }
  courseDistribution.value = {
    'Matemáticas': 8,
    'Lenguaje': 7,
    'Ciencias': 6,
    'Historia': 5,
    'Arte': 4,
    'Educación Física': 3,
    'Otros': 7,
  }
}

onMounted(() => {
  loadDashboardData()
})

// Configuración para la gráfica de barras (Estudiantes por Grado)
const barChartData = computed(() => ({
  labels: Object.keys(studentsByGrade.value),
  datasets: [
    {
      label: 'Estudiantes por Grado',
      data: Object.values(studentsByGrade.value),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    }
  ]
}))

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
}

// Configuración para la gráfica de dona (Distribución de Cursos)
const doughnutChartData = computed(() => ({
  labels: Object.keys(courseDistribution.value),
  datasets: [
    {
      data: Object.values(courseDistribution.value),
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40',
        '#C9CBCF'
      ],
    }
  ]
}))

const doughnutChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
}
</script>

<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app>
      <v-list-item>
        <v-list-item-title class="text-h6">
          Panel Admin
        </v-list-item-title>
      </v-list-item>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item v-for="item in menuItems" :key="item.title" :to="item.path" link>
          <template v-slot:prepend>
            <v-icon>{{ item.icon }}</v-icon>
          </template>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>
      <v-toolbar-title>{{ menuItems.find(item => item.path === router.currentRoute.value.path)?.title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="logout" color="error">
        Cerrar sesión
        <v-icon right>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <v-row v-if="router.currentRoute.value.path === '/dashboard/inicio'">
          <v-col cols="12" sm="6" md="3">
            <v-card>
              <v-card-title>Total Estudiantes</v-card-title>
              <v-card-text class="text-h4 text-center">{{ totalStudents }}</v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-card>
              <v-card-title>Total Profesores</v-card-title>
              <v-card-text class="text-h4 text-center">{{ totalTeachers }}</v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-card>
              <v-card-title>Total Cursos</v-card-title>
              <v-card-text class="text-h4 text-center">{{ totalCourses }}</v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-card>
              <v-card-title>Próximos Eventos</v-card-title>
              <v-list>
                <v-list-item v-for="event in upcomingEvents" :key="event.date">
                  <v-list-item-title>{{ event.title }}</v-list-item-title>
                  <v-list-item-subtitle>{{ event.date }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title>Estudiantes por Grado</v-card-title>
              <v-card-text>
                <Bar :data="barChartData" :options="barChartOptions" style="height: 300px;" />
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title>Distribución de Cursos</v-card-title>
              <v-card-text>
                <Doughnut :data="doughnutChartData" :options="doughnutChartOptions" style="height: 300px;" />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.v-card {
  transition: all 0.3s;
}

.v-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 25px 0 rgba(0,0,0,.1);
}
</style>