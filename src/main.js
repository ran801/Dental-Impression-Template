import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false
Vue.prototype.$accessToken = null;
Vue.prototype.$refreshToken = null;
Vue.prototype.$host = "https://dits.stavhaygn.tw:443";

Vue.prototype.$refresh = async function () {
  const refreshparams = new URLSearchParams();
  refreshparams.append('grant_type', 'refresh_token');
  refreshparams.append('refresh_token', Vue.prototype.$refreshToken);
  const response = await fetch(`${Vue.prototype.$host}/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': Vue.prototype.$refreshToken,
    },
    body: refreshparams.toString(),
  });
  const data = await response.json();
  const { access_token, refresh_token } = data;
  Vue.prototype.$accessToken = access_token;
  Vue.prototype.$refreshToken = refresh_token;

  console.log("New_access_token:" + access_token);
  console.log("New_refresh_token:" + refresh_token);
};

Vue.prototype.$refreshT = async function startTime(){
    let seconds = 100 ;
    const countdown = () =>{
      seconds--;
    if (seconds <= 0){
      Vue.prototype.$refresh();
      setTimeout(startTime ,1000);
      return;
    }
    setTimeout(countdown ,1000);
  };
  countdown();
}


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
