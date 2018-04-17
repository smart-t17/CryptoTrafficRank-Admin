import Vue from 'vue'
import Router from 'vue-router'
import Root from '@/components/Root'
import Login from '@/components/Login'
import Sites from '@/components/Sites'
import Upload from '@/components/Upload'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Root',
      component: Root
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/sites',
      name: 'Sites',
      component: Sites
    },
    {
      path: '/upload',
      name: 'Upload',
      component: Upload
    }
  ]
})
