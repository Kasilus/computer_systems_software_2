import Vue from 'vue'
import App from './App.vue'
import Router from 'vue-router'
import Hello from './components/Hello.vue'
import Upload from './components/Upload.vue'
import ManualGraph from './components/ManualGraph.vue'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Hello
    },
    {
      path: '/graph/upload',
      name: 'graph/upload',
      component: Upload
    },
    {
      path: '/graph/new/manual',
      name: 'graph/new/manual',
      component: ManualGraph
    }
  ]
})

new Vue({
  el: '#app',
  render: h => h(App),
  router
})
