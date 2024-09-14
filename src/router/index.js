import { createRouter, createWebHistory } from 'vue-router';
import LoginForm from '@/components/login-Form.vue';
import UserRegister from '@/components/UserRegister.vue';
import AuthorDashboard from '@/components/AuthorDashboard.vue';
import ReaderDashboard from '@/components/ReaderDashboard.vue';
import ModeratorDashboard from '@/components/ModeratorDashboard.vue';

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
  },
  {
    path: '/author-dashboard',
    name: 'AuthorDashboard',
    component: AuthorDashboard,
  },
  {
    path: '/reader-dashboard',
    name: 'ReaderDashboard',
    component: ReaderDashboard,
  },
  {
    path: '/moderator-dashboard',
    name: 'ModeratorDashboard',
    component: ModeratorDashboard,
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;



