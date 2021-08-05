import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from './components/pages/dashboard/Dashboard';
import ApiDefs from './components/pages/api-defs/ApiDefs';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/dashboard',
      redirect: '/'
    },
    {
      path: '/apidefs/:source',
      name: 'apidefs',
      component: ApiDefs
    }
  ]
})
