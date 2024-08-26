import { createRouter, createWebHistory } from 'vue-router';
import LoginForm from '@/components/login-Form.vue';
import UserRegister from '@/components/UserRegister.vue';

const routes = [
  {
    path: '/',
    name: 'LoginForm',
    component: LoginForm
  },
  {
    path: '/register',
    name: 'UserRegister',
    component: UserRegister
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;



