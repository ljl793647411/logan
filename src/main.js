import Vue from 'vue'
import App from './App.vue'
import vuex from 'vuex'
import vueRouter from 'vue-router'
import createRouter from './router/router'
import ElementUI from 'element-ui'
import axios from 'axios'
import moment from 'moment'
import createStore from './store/store'
import config from './public/config'
import 'element-ui/lib/theme-chalk/index.css'
import Highcharts from 'highcharts/highstock';
import variwide from 'highcharts/modules/variwide';

Vue.use(vuex)
Vue.use(ElementUI, { size: 'small' });  
Vue.use(vueRouter)
Vue.use(Highcharts)
Vue.prototype.axios = axios
Vue.prototype.Highcharts = Highcharts
variwide(Highcharts)
Vue.prototype.moment = moment
Vue.config.productionTip = false
axios.defaults.timeout = 5000


Vue.filter('formatTime', function (value) {
	if (value) {
    if (value > 0) {
      return (Math.floor(value / 3600) ? config.time1To2(Math.floor(value / 3600)) + ':' : '') + config.time1To2(Math.floor(value % 3600 / 60)) + ':' + config.time1To2((value % 3600 % 60))
    } else {
      if (value > -300) {
        return moment(value * -1000).format('mm:ss')
      } else {
        return ''
      }
    }
	} else {
		return value
	}
})
Vue.filter('formatTime1', function (value) {
	if (value) {
		let valueArr = value.split(" ");
		let timeArr = valueArr[1].split(":");
		return timeArr[0] + ':' + timeArr[1]
	} else {
		return value
	}
})
Vue.filter('formatDayTime', function (value) {
	if (value) {
    let valueArr = value.split(" ");
    let dayArr = valueArr[0].split("-")
    let timeArr = valueArr[1].split(":");
		return parseInt(dayArr[2]) + '日' + timeArr[0] + ':' + timeArr[1]
	} else {
		return value
	}
})
const router = createRouter()
const store = createStore()
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
