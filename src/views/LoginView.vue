<template>
    <div class="Body">
        <div class ="login" id='login'>
            <!-- <template v-if ="isLogin ==='true'"> -->
            <template>
                <h1 align= "center" style="position: relative; top: 100px">{{fullname}} 您好!</h1>
                <!-- <input type="button" value="登出" class="btn2" @click="logout"> -->
            </template>    
            <!-- <template v-else> -->
            <template>
                <form style="position: relative; left: 70px; top:200px;">
                    <div>帳號</div>
                    <input type="text" v-model="username" style="width: 300px;">
                    <div>密碼</div>
                    <input type="text" v-model="password" style="width: 300px;">
                </form>
                <input type="button" value="登入" class="btn2" @click.prevent="login">
                <div v-if="isLogin">
                    <h1> {{fullname}} 您好!</h1>
                    <input type="button" value="登出" class="btn3" @click.prevent="logout">
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import Swal from 'sweetalert2'
export default({
    data(){
        return{
            fullname:'',
            username:'',
            password:'',
            isLogin: false,
        }
    },
    methods:{
       async login(){
        const params = new URLSearchParams();
        params.append('grant_type', 'password');
        params.append('username', this.username);
        params.append('password', this.password);
        params.append('scope', 'ntags:read');
        
        const response = await fetch('http://43.206.222.65:8000/oauth/token',{
            method: 'POST',
            headers:{
                'Content-Type':'application/x-www-form-urlencoded',
            },
            body: params.toString(),
            // body: JSON.stringify({
            //     grant_type: 'password',
            //     username: 'S123T9', //this.username,
            //     password: "4dm1nP@s2Wd",//this.password,
            //     scope: "ntags:read"
            // }),

        });
        if (response.status===200){
            const data = await response.json();
            const { token , fullname }= data;
            localStorage.setItem('token', token);
            document.cookie = "isLogin=true; max-age=86400 ; path=/";
            document.cookie = `fullname=${fullname}; max-age=86400 ; path=/`;
            this.fullname = fullname;
            this.isLogin = true;
            this.username= '' ;
            this.password= '' ;
        } else{
            Swal.fire('帳號或密碼錯誤');
        }
       },
       async logout(){
            document.cookie = 'isLogin=true ; max-age=0 ; path=/';
            document.cookie = 'fullname=0; max-age=0; path=/';
            localStorage.removeItem('token');
            this.fullname='';
            this.isLogin = false;
            window.location.reload(); 
        },
    },
        
})
</script>

<style scoped>
    .login{
        height: 500px;
        
        width: 450px;
        background-color: #efefef;
        margin:auto;
        position: relative;top: 200px;
        border-style:solid;
        border-color:#8d8d8d;      
      }
    .btn2{
        width: 70px;
        height: 40px;
        background-color:#7dc49d;
        border: none;
        position: relative;left: 190px;top: 220px;
        border-radius:15px;
        font-size: 18px;
        margin:auto;
        outline:none;
      }
      .btn2:active{
        background-color:#6eb38d;
      }

</style>