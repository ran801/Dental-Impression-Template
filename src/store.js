import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    fullName: null,
    token: null
  },
  mutations: {
    // 定義 mutation 
    setFullName(state, fullName) {
      state.fullName = fullName;
    },
    
    setToken(state, {access_token, refresh_token}){
      state.token = access_token;
      state.refreshToken = refresh_token;
    },
  },
  getters:{
    bearerToken(state){
      return `Bearer ${state.token}`;
    }
  }
});
