import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

//vuesax
import Vuesax from "vuesax";
import "vuesax/dist/vuesax.css"; //Vuesax styles
Vue.use(Vuesax, {
  // options here
});

//material-icons
import "material-icons/iconfont/material-icons.css";
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
