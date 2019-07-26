import usuarios from './components/usuarios.vue'
import departamentos from './components/departamentos.vue'

export const routes = [
    { path: '/usuarios', name:"usuarios", component: usuarios},
    { path: '/departamentos', name:"departamentos", component: departamentos}
]
