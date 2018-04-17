// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import { Api } from './includes/Api'
import { Helper } from './includes/Helper'

Vue.config.productionTip = false


const _Api = new Api('https://api.cryptotrafficrank.com/v1/', router);

router.beforeEach((to, from, next) => {
  if (!_Api.isLoggedIn && to.name != 'Login') {
    next('/login');
  }
  else {
    next();
  }
})



new Vue({
  el: '#app',
  data() {
    return { Api: _Api, Helper: new Helper() }
  },
  router,
  components: { App },
  template: '<App/>'
})
