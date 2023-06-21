<template>
    <div class="Body">
        <div class ="login" id='login'>
            <div v-if="isLogin&&!updatePassword">
                <h1 align="center" style="position: relative; top: 100px"><br>{{name}}<br>您好!</h1>
                <button value="登出" class="btn2" @click.prevent="logout">登出</button>
                <button value="修改密碼" class="btn3" @click="check">修改密碼</button>
            </div>
            <div v-else-if="!isLogin&&!updatePassword">
                <h1 align="center" style="position: relative; top: 100px">您好!</h1>
                <form style="position: relative; left: 70px; top:200px;">
                    <div>帳號</div>
                    <input type="text" v-model="username" style="width: 300px;">
                    <div>密碼</div>
                    <input type="text" v-model="password" style="width: 300px;">
                </form>
                <button value="登入" class="btn" @click.prevent="login">登入</button>
            </div>
            <div v-else-if="isLogin && updatePassword">
                <h1 align="center" style="position: relative; top:100px">更新密碼</h1>
                <form style="position: relative; left:70px; top:200px;">
                    <div>舊密碼</div>
                    <input type="text" v-model="oldPassword" style="width:300px;">
                    <div>新密碼</div>
                    <input type="text" v-model="newPassword" style="width:300px;">
                    <button value="確認更改" class="btn5" @click="update">確認更改</button>
                    <button value="取消" class="btn4" @click="cancel">取消</button>
                </form>
            </div>

        </div>
    </div>
</template>

<script>
import Swal from 'sweetalert2'
import Vue from 'vue'

export default({

    mounted(){
        const isLogin= localStorage.getItem('isLogin');
        this.name = localStorage.getItem('name');
        
        if(isLogin){
            this.isLogin = true;
            this.name = localStorage.getItem('name');
            
        }else{
            this.isLogin = false;
            
        }
    },
    data(){
        return{
            username:'',
            password:'',
            scope:'',
            isLogin: false,
            name:'',
            updatePassword:false,
            oldPassword:'',
            newPassword:'',
            access_token:'',
        }
    },
    methods:{

        async check(){
            this.updatePassword = true    
        },

        async cancel(){
            this.updatePassword = false
        },
        

       async login(){
        const params = new URLSearchParams();
        params.append('grant_type', "password");
        params.append('username', this.username);
        params.append('password', this.password);
        params.append('scope', "");
        
        const r1 = await fetch(this.$root.$host+'/oauth/token',{
            method: 'POST',
            headers:{
                'Content-Type':'application/x-www-form-urlencoded',
            },
            body: params.toString(),
        });

        if (r1.status===200){
            const data = await r1.json();
            const access_token= data.access_token;

            //確認userrole
            const r2  = await fetch(this.$root.$host+'/api/users/me',{
                headers:{
                    "Authorization":"Bearer "+ access_token
                }
            });
            const data2 = await r2.json();
            const role = data2.role;        
            console.log(data2.username)
            

            
            //根據UserRole取得對應的scope(權限)
            switch(role){
                case 'admin':
                    this.scope = "users:read users:create users:delete ntags:read ntags:create ntags:delete facilities:read facilities:create facilities:delete stages:read stages:create stages:delete impressions:read impressions:create impressions:update impressions:delete transferRecords:read transferRecords:create notifications:register  notifications:send users:invite feedbacks:create feedbacks:read feedbacks:update feedbacks:delete user:facility:update";
                    break;
                case 'dentist':
                    this.scope = "impressions:read transferRecords:read notifications:register  feedbacks:read feedbacks:update user:facility:update";
                    break;
                case 'dental_technician':
                    this.scope = "users:read users:create users:delete ntags:read ntags:create facilities:read facilities:create facilities:delete stages:read stages:create stages:delete impressions:read impressions:create impressions:update transferRecords:read transferRecords:create notifications:register notifications:send users:invite feedbacks:create feedbacks:read feedbacks:update feedbacks:delete user:facility:update";
                    break;
                case 'dental_laboratory_technician':
                    this.scope = "stages:read impressions:read transferRecords:read transferRecords:create";
                    break;
            }            
            //加入scope後重新申請token以取得對應的功能
            const params2= new URLSearchParams();
            params2.append('grant_type', 'password');
            params2.append('username', this.username);
            params2.append('password', this.password);
            params2.append('scope', this.scope);
            const r4 = await fetch(this.$root.$host+'/oauth/token',{
                method: 'POST',
                headers:{
                    'Content-Type':'application/x-www-form-urlencoded',
                },
                body: params2.toString(),
            });
            
            if (r4.status===200){
                const data4 = await r4.json();
                const {access_token, refresh_token}=data4;
                localStorage.setItem('token', access_token);
                localStorage.setItem('refresh_token', refresh_token);
                
                const r5 = await fetch(`${this.$root.$host}/api/users/me`,{
                    headers:{
                        "Authorization":`Bearer ${access_token}`
                    }
                });
                const data5 = await r5.json();
                const isNotifyConnected = data5.isNotifyConnected;
                console.log(isNotifyConnected)

                // 如果false，改為登入line notify，true就繼續功能
                if (isNotifyConnected == false){
                    await Swal.fire({
                        title:'尚未連結line notify',
                        text: '請連結line notify 已收到牙模進出口通知',
                        icon:'question',
                        showCancelButton: true,
                        confirmButtonText:'連結',
                        cancelButtonText:'先不用'
                    }).then(async(result)=>{
                        if(result.isConfirmed){
                            const r6 = await fetch(`${this.$root.$host}/api/notifications/register`,{
                                method:"POST",
                                headers:{
                                    "Content-Type": "application/json",
                                    "Authorization": `Bearer ${access_token}`
                                }
                            });
                            const data3 = await r6.json();
                            const url = data3.url
                            window.location.replace(url)
                            console.log(url)
                            return
                        }else if (result.dismiss === Swal.DismissReason.cancel){
                            localStorage.setItem('isLogin', true);
                            localStorage.setItem('name',data2.username);
                            localStorage.setItem('role',role)
                            this.name = localStorage.getItem('name');
                            document.cookie = `name=${name};max-age=86400 ; path=/`;
                            document.cookie = "isLogin=true; max-age=86400 ; path=/";
                            console.log(data)
                            this.isLogin = true;                                        
                            await Swal.fire('登入成功');
                            this.$parent.isLogin=true;
                            this.access_token=access_token
                            Vue.prototype.$accessToken= access_token
                            Vue.prototype.$refreshToken = refresh_token
                            console.log(localStorage.getItem("isLogin"))
                            console.log("role:",localStorage.getItem("role")) 
                            console.log("accessToken:"+Vue.prototype.$accessToken)
                            console.log("refreshToken:"+Vue.prototype.$refreshToken)
                            if(role =="admin" || role =="dental_technician"){
                                this.$parent.inviteView =true;
                            }else{
                                this.$parent.inviteView = false;
                            }
                        }
                    })
                }else{
                    localStorage.setItem('isLogin', true);
                    localStorage.setItem('name',data2.username);
                    localStorage.setItem('role',role);
                    this.name = localStorage.getItem('name');
                    document.cookie = `name=${name};max-age=86400 ; path=/`;
                    document.cookie = "isLogin=true; max-age=86400 ; path=/";
                    console.log(data)
                    this.isLogin = true;                                        
                    await Swal.fire('登入成功');
                    this.$parent.isLogin=true;
                    this.access_token=access_token
                    Vue.prototype.$accessToken= access_token
                    Vue.prototype.$refreshToken = refresh_token
                    if(role =="admin" || role =="dental_technician"){
                        this.$parent.inviteView =true;
                    }else{
                        this.$parent.inviteView = false;
                    }
                    console.log("role:",localStorage.getItem("role")) 
                    console.log("accessToken:"+Vue.prototype.$accessToken)
                    console.log("refreshToken:"+Vue.prototype.$refreshToken)
                    
                }
            }else{
                Swal.fire('401 unauthorized');
            }
        }else{
            Swal.fire('帳號密碼錯誤');
            console.log(this.access_token)
        }
       },
       
       async logout(){
            document.cookie = 'isLogin=true ; max-age=0 ; path=/';
            document.cookie = 'name=0; max-age=0; path=/';
            localStorage.removeItem('token');
            localStorage.removeItem('isLogin');
            localStorage.removeItem('name');
            localStorage.removeItem('role');
            this.fullname='';
            this.isLogin = false;
            await Swal.fire('登出成功');
            this.$parent.isLogin=false;
            window.location.reload(); 
        },
        async update(){
            await Swal.fire({
                title:'更新密碼資訊',
                text:`舊密碼為：${this.oldPassword} \n 新密碼為：${this.newPassword}`,
                icon:"question",
                showCancelButton:true,
                confirmButtonText:'確認',
                concelButtonText:'取消'
            }).then(async (result)=>{
                if(result.isConfirmed){
                    console.log(this.access_token)
                    const r  =  await fetch(`${this.$root.$host}/api/users/me/password`,{
                        method:"PUT",
                        headers:{
                            "Content-Type":"application/json",
                            "Authorization":`Bearer ${this.access_token}`
                        },
                        body:JSON.stringify({
                            oldPassword: this.oldPassword,
                            newPassword: this.newPassword
                        })
                    });
                    console.log(r.status)
                    if(r.status==204){
                        await Swal.fire("更新成功"),
                        await this.cancel();
                    }else{
                        await Swal.fire("更新失敗")
                    }
                    return                    
                }else{
                    Swal.fire('取消刪除')
                }
            })
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
    .btn{
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
      .btn:active{
        background-color:#6eb38d;
      }
    .btn2{
        width: 70px;
        height: 40px;
        background-color:#7dc49d;
        border: none;
        position: relative;left: 100px;top: 220px;
        border-radius:15px;
        font-size: 18px;
        margin:auto;
        outline:none;
      }
      .btn2:active{
        background-color:#6eb38d;
      }
    .btn3{
        width: 90px;
        height: 40px;
        background-color:#76a1d3;
        border: none;
        position: relative;left: 200px;top: 220px;
        border-radius:15px;
        font-size: 18px;
        margin:auto;
        outline:none;
      }
      .btn3:active{
        background-color:#6a84b3;
      }
    .btn4{
        width: 90px;
        height: 40px;
        background-color:#7dc49d;
        border: none;
        position: relative;left: 35px;top: 40px;
        border-radius:15px;
        font-size: 18px;
        margin:auto;
        outline:none;
      }
      .btn4:active{
        background-color:#6eb38d;
      }
    .btn5{
        width: 90px;
        height: 40px;
        background-color:#76a1d3;
        border: none;
        position: relative;
        right: 100px; top: 80px;
        border-radius:15px;
        font-size: 18px;
        margin:auto;
        outline:none;
      }
      .btn5:active{
        background-color:#6a84b3;
      }


</style>