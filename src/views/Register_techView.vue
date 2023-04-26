<template>
  <div class="container">
    <div class="title">使用者註冊</div>
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
          <div class="input-box">
            <span class="details">密碼</span>
            <input type="password" placeholder="輸入您的密碼" v-model="password" required>
          </div>
        </div>
        <div class="button">
          <input type="submit" value="註冊" @click="register">
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2'
export default {
  data() {
    return {
      name: "",
      username: "",
      password: "",
    };
  },
  methods: {
    async register() {
      const token = "Bearer " + localStorage.getItem("token");
      const { value: confirmed } = await Swal.fire({
        title: `你的姓名是: ${this.name}\n人事號是: ${this.username}`,
        showCancelButton: true,
      });


      if (confirmed) {
        const r = await fetch("http://43.206.222.65:8000/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            'personnelNumber': this.username,
            'username': this.name,
            'password': this.password,
            'role': "admin",
            'facilityId': 1 ,
          }),
        });
        const text = await r.json();
        console.log(text);
        if (r.status == 200) {
          Swal.fire("註冊成功");
        } else {
          Swal.fire("你的人事號已註冊");
        }
      }
    },
  },
};
</script>

<style scoped>
</style>