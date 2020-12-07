import Vue from 'vue'
import Bootstrap from "bootstrap-vue";
import Antd from "ant-design-vue";
import 'ant-design-vue/dist/antd.css'
import "./styles/index.css";

import router from "./router";
import store from "./store/index";
import App from './App.vue'

Vue.config.productionTip = false
Vue.use(Bootstrap);
Vue.use(Antd);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
