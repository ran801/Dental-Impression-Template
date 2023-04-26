<template>
  <div class="container">
    <div class="title">醫師註冊</div>
    <div class="content">
      <form>
        <div class="user-details">
          <div class="input-box">
            <span class="details">姓名</span>
            <input type="text" placeholder="輸入您的姓名" v-model="name" required>
          </div>
          <div class="input-box">
            <span class="details">人事號</span>
            <input type="text" placeholder="輸入您的人事號" v-model="username" required>
          </div>
        </div>
        <div class="button">
          <input type="button" value="註冊" @click="register">
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2'

export default {
  name: 'DoctorRegistration',
  data() {
    return {
      name: '',
      username: ''
    }
  },
methods: {
    async register() {
      try {
        const result = await Swal.fire({
          title: `你的姓名是: ${this.name}\n人事號是: ${this.username}`,
          showCancelButton: true
        });
        if (result.isConfirmed) {
          const response = await fetch('http://43.206.222.65:8000/api/users', {            
            method: 'POST',            
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              "personnelNumber": this.username,
              "username": this.name,
              'password': 'u$erP@ssWd',
              'role': 'dentist',
              'facilityId': 2,
            })
          });
          const data = await response.json();
          console.log(data);
          if (response.status === 200) {
            const { token } = data;
            const Authorization = `Bearer ${token}`;
            const response2 = await fetch('/api/notify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization
              }
            });
            const data2 = await response2.json();
            console.log(data2);
            const { url } = data2;
            window.location.replace(url);
          } else {
            Swal.fire('你的人事號已註冊');
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
}
</script>

<style scoped>
</style>