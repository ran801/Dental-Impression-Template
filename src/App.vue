<template>
  <div id="app">
    <slot name="content"></slot>
    <nav>    
      <router-link to="/send">出口</router-link> |
      <router-link to="/receive">進口</router-link> |
      <router-link to="/search">查詢</router-link> |
      <router-link to="/closed">結案</router-link> |
      <!-- <router-link to="/register_tech">註冊</router-link> | -->
      <router-link to="/">登入</router-link> |
      <router-link v-if="inviteView" to="/invite">註冊</router-link>
      <!-- <router-link to="/">回饋</router-link> | -->

      <div class="animation"></div>
      <a class="t1">牙模系統</a>
      <a class="user" v-if ="!isLogin">未登入</a>
      <a class="user" v-else>已登入</a>
    </nav>
    <router-view/>  
    <div class="Body"></div>
  </div>
</template>

<script>


export default {
  name: 'App',
  data(){
    return{
      isLogin:false,
      role:"",
      inviteView:false,
    };
  },

  mounted() {
    const isLogin = localStorage.getItem('isLogin');
    const role = localStorage.getItem('role'); 
    console.log(role)
    if(isLogin){
      this.isLogin=true;
    }else{
      this.isLogin=false;
    }
    if(role === "admin"|| role === "dental_technician"){
      this.inviteView =true;
    }else{
      this.inviteView = false;
    }
  },


};
</script>

<style >
@import url('https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css'); 
@import url('https://unpkg.com/sweetalert2@9/dist/sweetalert2.min.css');
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
 
  color: #2c3e50;
}

nav {
        position: relative;
        width: 100%;
        height: 100px;
        background-image: linear-gradient(15deg, #13547a 0%, #80d0c7 100%);
        font-size: 0;
        box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.1);
}

nav a {
        font-size: 30px;
        text-transform: uppercase;
        color: white;
        text-decoration: none;
        line-height: 100px;
        position: relative;
        z-index: 1;
        display: inline-block;
        text-align: center;
        font-weight: bold;
}
nav a:hover{
  color:white
}
nav .animation{
  position: absolute;
  height: 100%;
  top:0;
  z-index: 0;
  background: #64a8a0;
  border-radius:8px;
  transition: all 0.5s ease 0s;
}
nav a:nth-child(1){
  width:110px;
}
nav a:nth-child(1):hover ~ .animation {
        width: 110px;
        left: 0;
}
nav a:nth-child(2) {
  width: 110px;
}
nav a:nth-child(2):hover ~ .animation {
  width: 110px;
  left: 110px;
}
nav a:nth-child(3) {
  width: 110px;
}
nav a:nth-child(3):hover ~ .animation {
  width: 110px;
  left: 220px;
}
nav a:nth-child(4) {
  width: 110px;
}
nav a:nth-child(4):hover ~ .animation {
  width: 110px;
  left: 330px;
}
nav a:nth-child(5) {
  width: 110px; 
}
nav a:nth-child(5):hover ~ .animation {
  width: 110px;
  left: 440px;
}
nav a:nth-child(6) {
  width: 110px;
}
nav a:nth-child(6):hover ~ .animation {
  width: 110px;
  left: 550px;
}
/* nav a:nth-child(7) {
  width: 110px;
} */
/* nav a:nth-child(7):hover ~ .animation {
  width: 110px;
  left: 660px;
} */
.t1{
  font-size: 45px;
  text-transform: none;
  position: absolute;right: 15px;
}
.user{
  font-size: 45px;
  text-transform: none;
  position: absolute;right: 250px;
}
nav a.router-link-exact-active {
  color: #42b983;
}
</style>

<head>
  <link rel="shorcut icon" href="#">
</head>
