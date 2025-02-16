import { createRouter, createWebHistory } from 'vue-router';
import ProjectList from '../components/ProjectList.vue';
import EmployeeList from '../components/EmployeeList.vue';

const routes = [
    { path: '/', redirect: '/projects' },
    { path: '/projects', component: ProjectList },
    { path: '/employees', component: EmployeeList }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
