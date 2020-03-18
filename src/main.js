// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import querystring from 'querystring';
import './assets/js/vee-validate/validate.js';
import apiAddress from "./assets/js/apiAddress.js"
import common from './assets/js/common.js'
import Vuex from 'vuex'
import TIM from 'tim-js-sdk'
//import tim from './assets/js/tim/tim'

Vue.config.productionTip = false
//window.tim = tim
window.TIM = TIM
//Vue.prototype.tim = tim
Vue.prototype.TIM = TIM
Vue.prototype.$querystring = querystring
Vue.prototype.$apiAddress = apiAddress
Vue.prototype.$commonjs = common
Vue.use(ElementUI);
Vue.use(Vuex)

//如果是开发环境则不跳转https
var redirectHttps = (process.env.NODE_ENV=='development' || process.env.BUILD_ENV=="development") ? () => { } : function () {
  var targetProtocol = "https:";
  if (window.location.protocol != targetProtocol)
    window.location.href =
      targetProtocol +
      window.location.href.substring(window.location.protocol.length);
}

Vue.prototype.$redirectHttps = redirectHttps

axios.interceptors.request.use(config => {
  return new Promise(resolve => {
    config.headers.Pragma = "no-cache"
    return resolve(config)
  })
}, error => {
  Promise.reject(error);
})

axios.interceptors.response.use(
  response => {
    if (response.data.result == -10001) {

      router.push({
        path: '/login',
      })
    }
    return response;
  },
  error => {
    console.log(error)
    // vueobj.$message.error('系统通讯时发生异常，如果持续发生，请联系管理员');
  });

Vue.prototype.$http = axios

Date.prototype.dateAdd = function (interval, number) {
  switch (interval) {
    case "y": {
      this.setFullYear(this.getFullYear() + number);
      return this;
      break;
    }
    case "q": {
      this.setMonth(this.getMonth() + number * 3);
      return this;
      break;
    }
    case "m": {
      this.setMonth(this.getMonth() + number);
      return this;
      break;
    }
    case "w": {
      this.setDate(this.getDate() + number * 7);
      return this;
      break;
    }
    case "d": {
      this.setDate(this.getDate() + number);
      return this;
      break;
    }
    case "h": {
      this.setHours(this.getHours() + number);
      return this;
      break;
    }
    case "m": {
      this.setMinutes(this.getMinutes() + number);
      return this;
      break;
    }
    case "s": {
      this.setSeconds(this.getSeconds() + number);
      return this;
      break;
    }
    default: {
      this.setDate(d.getDate() + number);
      return this;
      break;
    }
  }
}

Date.prototype.format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1,                 //月份 
    "d+": this.getDate(),                    //日 
    "h+": this.getHours(),                   //小时 
    "m+": this.getMinutes(),                 //分 
    "s+": this.getSeconds(),                 //秒 
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
    "S": this.getMilliseconds()             //毫秒 
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}

// 全局钩子，实现更改title
router.beforeEach((to, from, next) => {
  // to and from are both route objects
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})
/* eslint-disable no-new */
var vueobj = new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

export default Vue;