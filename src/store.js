import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    fullName: null
  },
  mutations: {
    // 定義 mutation 
    setFullName(state, fullName) {
      state.fullName = fullName;
    }
  }
});
