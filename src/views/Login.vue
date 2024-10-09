<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const username = ref('')
const password = ref('')
const authStore = useAuthStore()
const router = useRouter()

const login = () => {
  if (authStore.login(username.value, password.value)) {
    router.push('/dashboard')
  } else {
    alert('Credenciales incorrectas')
  }
}
</script>

<template>
  <v-container fluid fill-height class="align-center justify-center">
    <v-card width="400" class="mx-auto">
      <v-card-title class="text-center">
        <h1 class="text-h5">Iniciar sesión</h1>
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="login">
          <v-text-field
            v-model="username"
            label="Usuario"
            required
            prepend-icon="mdi-account"
          ></v-text-field>
          <v-text-field
            v-model="password"
            label="Contraseña"
            type="password"
            required
            prepend-icon="mdi-lock"
          ></v-text-field>
          <v-btn
            type="submit"
            color="primary"
            block
            class="mt-2"
          >
            Entrar
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>