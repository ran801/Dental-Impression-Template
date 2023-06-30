<template>
  <div class="container">

    <div class="content">
      <template>
          <div class="user-details">
              <div class="title">使用者註冊</div>
            <form class = "form" @submit.prevent="register">
              <div v-show="showButton">
                <div class="input-box">
                  <div class="details">單位：</div>
                  <select v-model="facilityId" required>
                    <option value='' disabled selected>請選擇工作單位</option>
                    <option value='1'>永康</option>
                    <option value='2'>柳營</option>
                    <option value='3'>佳里</option>
                    <option value='4'>顏氏</option>
                    <option value='5'>鴻冠</option>
                    <option value='6'>良曄</option>
                  </select>
                </div>

                <div class="input-box">
                  <div class="details">職業：</div>
                  <select  v-model="role" required>
                    <option value= '' disabled selected>請選擇工作職位</option>
                    <option value ='dentist'>牙醫</option>
                    <option value ='dental_technician'>牙技師</option>
                    <option value ='dental_laboratory_technician'>技公所</option>
                  </select>
                </div>

                <div class ="input-box">
                  <div class="details">數量：</div>
                    <select   v-model="signNumber" required>
                      <option value ='' disabled selected >請選擇要註冊的數量</option>
                      <option value ='1'>1</option>
                      <option value ='2'>2</option>
                      <option value ='3'>3</option>
                      <option value ='4'>4</option>
                      <option value ='5'>5</option>
                      <option value ='6'>6</option>
                      <option value ='7'>7</option>
                      <option value ='8'>8</option>
                      <option value ='9'>9</option>
                      <option value ='10'>10</option>
                    </select>
                </div>
              </div> 
                <div v-if="!showButton">
                  <div class="input-box">
                    <div class="details">姓名：</div>
                    <input type="text" class="input" placeholder="輸入您的姓名" v-model="username" required>
                  </div>
                  <div class="input-box">
                    <div class="details">人事號：</div>
                    <input type="text" placeholder="輸入您的人事號" v-model="personnelNumber" required>
                  </div>
                  <div class="input-box">
                    <div class="details">密碼：</div>
                    <input type="password" placeholder="輸入您的密碼" v-model="password" required>
                  </div>
                  <div class="button1">
                    <input type="submit" value="註冊" @click="register">
                  </div>
                  <div class="button2">
                    <input type="submit" value="上一步" @click="back">
                  </div>                  
                </div>
              <div class="button">
                <button type="button" value="確認" v-show="showButton" @click="next">確認</button>
              </div>
            </form>          
          </div>
      </template>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2'
export default {
  data() {
    return {
      facilityId:"",
      signNumber:"",
      role: "",
      username: "",
      personnelNumber: "",
      password: "",
      selectedOption:"",
      showButton: true,
      token:`Bearer `+ this.$root.$accessToken,
      inviteCode:""
    };
  },

  methods: {  
    async back(){
      this.showButton=true;
    },
    async next(){
      console.log(this.signNumber)
      const facilityId = parseInt(this.facilityId)
      const userAllowed = parseInt(this.signNumber)
      console.log(userAllowed)
      if(!this.facilityId || !this.role || !this.signNumber){
        Swal.fire("需填寫完畢")
      }else if (isNaN(facilityId) || isNaN(userAllowed)) {
        Swal.fire("輸入無效的數字");
      }else{
        const r = await fetch (`${this.$root.$host}/api/users/invite`,{
          method:"POST",
          headers:{
            "Content-Type": "application/json",
            "Authorization": this.token
          },
          body: JSON.stringify({
            "role":this.role,
            "facilityId":facilityId,
            "usesAllowed":userAllowed
          })
        });
        const data = await r.json();
        this.inviteCode = data.inviteCode
        console.log(r.status)
        console.log(this.inviteCode)
        console.log(data)
        console.log(data.inviteCode)
        this.showButton=false;  
        this.$refs.form.submit();
      }
    },



    async register() {
        console.log("personnelNumber:",this.personnelNumber, ",", typeof this.personnelNumber)
        console.log("username:",this.username ,",", typeof this.username)
        console.log("password:",this.password ,",", typeof this.password)
        if (!this.username || !this.personnelNumber || !this.password) {
        Swal.fire("需填寫資訊");
        }else{
        if (!/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/.test(this.password)) {
        Swal.fire("密碼格式不對<br>密碼需有英文字母和數字,且位數至少為6");
        return;
        }
        const { value: confirmed } = await Swal.fire({
          title: `你的姓名是: ${this.username}\n人事號是: ${this.personnelNumber}`,
          showCancelButton: true,
        });
          if (confirmed) {
            const r = await fetch(`${this.$root.$host}/api/users/register/${this.inviteCode}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": this.token,
              },
              body: JSON.stringify({
              "personnelNumber": this.personnelNumber,
              "username": this.username,
              "password": this.password,
              }),
            });

            const text = await r.text();
            console.log(text);
            if (r.status == 201) {
              Swal.fire("註冊成功");
            } else if(r.status == 400){
              Swal.fire("人事號已存在");
            }else if(r.status ==500){
              Swal.fire("註冊數量耗盡，請回上一步新增")
            }else{
              Swal.fire("註冊失敗");
            }
          } 
        }
    },
  },
};

</script>

<style scoped>
    .user-details{
        height: 480px;
        width: 450px;
        background-color: #efefef;
        margin:auto;
        position: relative;top: 200px;
        border-style:solid;
        border-color:#8d8d8d;      
      }
    .title{
      position:relative;left:100px;
      font-weight: bolder;
      font-size: 50px;
      margin-top:5px;
    }
    .form{
      font-size:20px;
      position:relative; left:40px; top:10px;
      margin-top:10px;
      background-color: #fdfdfd;
      width:360px;
      border-style:solid;
      border-color:#8d8d8d;

    }
    .input-box{
      margin-top:20px;
      margin-left:20px;
      
    }
    .button{
      position: relative; top:40px;left:150px;
      font-size:bold;
      width:80px;
    }
    .button1{
      position: relative; top:75px;left:200px;
      font-size:bold;
      width:80px;
    }
    .button2{
      position: relative; top:40px;left:80px;
      font-size:bold;
      width:80px;
    }
    .details{
      font-weight:bolder
    }
</style>

