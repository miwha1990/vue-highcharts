// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueHighcharts from 'vue-highcharts'
import Highcharts from 'highcharts/highstock.js';
import App from './App'

Vue.use(Vuetify)
Vue.use(VueHighcharts, {Highcharts})
Vue.config.productionTip = false

new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
