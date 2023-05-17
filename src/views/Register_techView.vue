<template>
  <div class="container">

    <div class="content">
      <template>
          <div class="user-details">
              <div class="title">使用者註冊</div>
            <form class = "form">
              <div class="input-box">
                <div class="details">單位：</div>
                <select placeholder="請選擇工作單位" v-model="facilityId" required>
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
                <select placeholder="請選擇工作單位" v-model="role" required>
                  <option value ='admin'>admin</option>
                  <option value ='dentist'>牙醫</option>
                  <option value ='dental_technician'>牙技師</option>
                  <option value ='dental_laboratory_technician'>技公所</option>
                </select>
              </div>
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
              <div class="button">
                <input type="submit" value="註冊" @click="register">
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
      facilityId:"1",
      role: "",
      username: "",
      personnelNumber: "",
      password: "",
    };
  },
  methods: {
    async register() {
      const username = this.username;
      const role = this.role;
      const personnelNumber = this.personnelNumber;
      const password = this.password;
      const facilityId = parseInt(this.facilityId);
    
      const token = "Bearer " + localStorage.getItem("token");
      const { value: confirmed } = await Swal.fire({
        title: `你的姓名是: ${username}\n人事號是: ${personnelNumber}`,
        showCancelButton: true,
      });
      
      if (confirmed) {
        const r = await fetch(this.$root.$host+"/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token,
          },
          body: JSON.stringify({
           "personnelNumber": personnelNumber,
            "username": username,
            "password": password,
            "role": role,
            "facilityId": facilityId
          }),
        });

        const text = await r.text();
        console.log(text);
        if (r.status == 201) {
          Swal.fire("註冊成功");
        } else if(r.status == 400){
          Swal.fire("人事號已存在");
        }else{
          Swal.fire("註冊失敗");
        }
      }
    },
  },
};

</script>

<style scoped>
    .user-details{
        height: 600px;
        
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
      position: relative; top:40px;left:160px;
      font-size:bold;
      width:80px;
    }
    .details{
      font-weight:bolder
    }
</style>

