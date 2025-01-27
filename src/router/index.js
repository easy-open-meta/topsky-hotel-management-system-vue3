import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import AboutView from '../views/AboutView.vue';
import NotFound from '../views/NotFound.vue';
import MainLayout from '../layouts/MainLayout.vue';

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', component: HomeView },
      { path: 'about', component: AboutView },
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
