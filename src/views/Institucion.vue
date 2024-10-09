<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'

interface Institucion {
  id: number
  nombre: string
  direccion: string
  email: string
  telefono: string
}

const instituciones = ref<Institucion[]>([
  { id: 1, nombre: 'Colegio San Juan', direccion: 'Calle Principal 123', email: 'info@sanjuan.edu', telefono: '123-456-7890' },
  { id: 2, nombre: 'Escuela Nueva Era', direccion: 'Avenida Central 456', email: 'contacto@nuevaera.edu', telefono: '098-765-4321' },
])

const selectedInstitucion = ref<Institucion | null>(null)

const schema = yup.object({
  nombre: yup.string().required('El nombre es requerido'),
  direccion: yup.string().required('La dirección es requerida'),
  email: yup.string().required('El email es requerido').email('Ingrese un email válido'),
  telefono: yup.string(),
})

const { handleSubmit, errors } = useForm({
  validationSchema: schema,
})

const { value: nombre } = useField('nombre')
const { value: direccion } = useField('direccion')
const { value: email } = useField('email')
const { value: telefono } = useField('telefono')

const formMode = ref<'create' | 'edit'>('create')

const resetForm = () => {
  nombre.value = ''
  direccion.value = ''
  email.value = ''
  telefono.value = ''
  selectedInstitucion.value = null
  formMode.value = 'create'
}

const selectInstitucion = (institucion: Institucion) => {
  selectedInstitucion.value = institucion
  nombre.value = institucion.nombre
  direccion.value = institucion.direccion
  email.value = institucion.email
  telefono.value = institucion.telefono
  formMode.value = 'edit'
}

const onSubmit = handleSubmit((values) => {
  if (formMode.value === 'create') {
    const newInstitucion: Institucion = {
      id: Date.now(),
      ...values,
    }
    instituciones.value.push(newInstitucion)
  } else {
    const index = instituciones.value.findIndex(i => i.id === selectedInstitucion.value?.id)
    if (index !== -1) {
      instituciones.value[index] = { ...selectedInstitucion.value!, ...values }
    }
  }
  resetForm()
})

const deleteInstitucion = (id: number) => {
  instituciones.value = instituciones.value.filter(i => i.id !== id)
  if (selectedInstitucion.value?.id === id) {
    resetForm()
  }
}
</script>

<template>
  <v-container>
    <h2>Gestión de Instituciones</h2>
    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Lista de Instituciones</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="institucion in instituciones"
                :key="institucion.id"
                @click="selectInstitucion(institucion)"
              >
                <v-list-item-title>{{ institucion.nombre }}</v-list-item-title>
                <template v-slot:append>
                  <v-btn icon @click.stop="deleteInstitucion(institucion.id)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>{{ formMode === 'create' ? 'Crear' : 'Editar' }} Institución</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="onSubmit">
              <v-text-field
                v-model="nombre"
                label="Nombre"
                :error-messages="errors.nombre"
                required
              ></v-text-field>
              <v-text-field
                v-model="direccion"
                label="Dirección"
                :error-messages="errors.direccion"
                required
              ></v-text-field>
              <v-text-field
                v-model="email"
                label="Email"
                :error-messages="errors.email"
                required
              ></v-text-field>
              <v-text-field
                v-model="telefono"
                label="Teléfono"
                :error-messages="errors.telefono"
              ></v-text-field>
              <v-btn type="submit" color="primary" class="mr-4">
                {{ formMode === 'create' ? 'Crear' : 'Actualizar' }}
              </v-btn>
              <v-btn @click="resetForm" v-if="formMode === 'edit'">Cancelar</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>