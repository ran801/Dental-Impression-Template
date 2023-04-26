<template>
  <div>
    <div class="t2">
        院區
            <select class="select" id="branch"  v-model="branch" required>
            <option value="柳營">柳營</option>
            <option value="永康">永康</option>
            <option value="佳里">佳里</option>
        </select>
    </div>
    
    <div id="SMALL" class="slider"></div>

    <div>
        <form style="position: absolute; left: 600px; top:250px;">
            <input type="button" value="掃描" class="btn1" @click="nTag_scan()">
            <input type="button" value="拍照" class="btn2" @click="get_image()">
            <input type="button" value="刪除" class="btn3" @click="remove(k)">
            <input type="button" value="確認" class="btn4" @click="upload_image()">
            <div class ="txt" id="ntag">{{ntag1}}</div>
            <div class ="txt" id="ntag2">{{ntag2}}</div>
        </form>
    </div>

    <img :src="bigImgSrc" alt="image" class="BIG"  id="BIG" @dblclick="dbclick()">
    <div id="SMALL" class="slider">
      <img v-for="(imgSrc, index) in smallImgSrcs" :key="index" :src="imgSrc" @click="select(imgSrc,index)">
    </div>

    <div style="position: absolute; left: 600px ; top: 450px ;">
        <table class="table">
            <thead>
                <tr>
                    <td width="150px">進出口</td>
                    <td width="250px">日期</td>
                    <td width="150px">院區</td>
                    <td width="180px">步驟</td>
                    <td width="180px">寄送人</td>
                </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in items" :key="index">
                <td width="150px">{{ item.action }}</td>
                <td width="250px">{{ item.date }}</td>
                <td width="150px">{{ item.hospital_branch }}</td>
                <td width="180px">{{ item.step || '' }}</td>
                <td width="180px">{{ item.transactor }}</td>
              </tr>
            </tbody>
        </table>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'

export default {
  
  data(){
    return{
      bigImgSrc:"https://img.alicdn.com/imgextra/i2/78424090/TB2JqHbbaSWBuNjSsrbXXa0mVXa_!!78424090.jpg_400x400Q50s50.jpg_.webp",
      smallImgSrcs:[],
      branch:"柳營",
      items:[],
      ntag1:'尚未掃描',
      ntag2:'尚未紀錄'
    };
  },
  mounted(){
    this.getTagScanData();
    $('.slider').slick({
      slidesToShow: 4,
      slidesToScroll: 4
    });

    this.get_image();
  },
  methods:{
    async nTag_scan(){
      const r = await fetch("http://127.0.0.1:20000/uid");
      const text = await r.text();
      console.log(text);
      const token = 'Bearer' + localStorage.getItem("token");
      this.ntag1=text

      //清空tbody表格數據
      this.items=[];

      if(r.status===404){
        this.ntag2="掃描失敗"
      }else{
        const r2 = await fetch("http://43.206.222.65:8001/api/ntags/"+text);
        const text2 = await r2.status;
        console.log(text2);
        if (r2.status===404){
          const r3 = await fetch("http://43.206.222.65:8001/api/ntags",{
            method:"POST",
            headers:{
              "Content-Type":"application/json",
              "Authorization":token
            },
            body: JSON.stringify({
              uid:text
            })
          });
          const text3 = await r3.text();
          console.log(text3);
          this.ntag2="建立新的ntag";
          
          const r5=await fetch("/api/teeth_models",{
            method:"POST",
            headers:{
              "Content-Type": "application/json",
              "Authorization": token
            },
            body:JSON.stringify({
              ntag:text
            })
          });
          const text5 = await r5.text();
          console.log(text5);
          this.ntag2="完成牙模建立";
        }
        else{
          const r4 = await fetch("/api/teeth_models?ntag=" + text);
          const text4 = await r4.status;
          console.log(text4);

          if(r4.status == 404){
            const r5 = await fetch("/api teeth_models",{
              method:"POST",
              headers:{
                "Content-Type": "application/json",
                "Authorization": token
              },
              body: JSON.stringify({
                ntag:text
              })
            });
            const text5 = await r5.text();
            console.log(text5);
            this.ntag2="完成牙模建立";
          }
          else{
            const text5 = await r4.json();
            console.log(text5);
            this.ntag2="已建立的牙模";
            const{ id }= text5[0];
            const r6 = await fetch("/api/teeth_models/" + id + "/transfer_records");
            const text6 = await r6.json();
            console.log(text6);
            this.items = [] ;
            const items =text6.map(item =>({
              action: item.action,
              date: item.date,
              hospital_branch: item.hospital_branch,
              step: item.step || '',
              transactor: item.transactor
            }));
            this.items = items;
            
            }
          }
        }
      },
      async get_image(){
        const r = await fetch ("http://127.0.0.1:30000/image");
        const text = await r.text();
        console.log(text);

        this.smallImgSrcs.push("httpL//127.0.0.1:30000"+text);
      },
      select(imgSrc, index) {
        const imgElement = document.getElementById("SS" + index);
        if (imgElement.style.color === "red") {
          imgElement.style.color = "black";
          document.getElementById("remove").onclick = null;
        } else {
          imgElement.style.color = "red";
          document.getElementById("remove").onclick = () => this.remove(index);
          document.getElementById("BIG").src = imgSrc;
          document.getElementById("BIG").ondblclick = () => this.dbclick(imgSrc);
        }
      },
      dbclick(imgSrc) {
        console.log(imgSrc);
        window.open(imgSrc, "_blank");
      },
      remove(index) {
        this.smallImgSrcs.splice(index, 1);
      },
      //今天要檢查
      async upload_image() {
        const branch = this.branch;
        const ntag = this.ntag;
        const response3 = await fetch(`/api/teeth_models?ntag=${ntag}`);
        const data3 = await response3.json();
        const teeth_model_id = data3[0].id;
        const token = "Bearer " + localStorage.getItem("token");
        
        const r4 = await fetch(`/api/teeth_models/${teeth_model_id}/send`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token
          },
          body: JSON.stringify({
            hospital_branch: branch
          })
        });
        const text4 = await r4.json();
        console.log(text4);
        this.ntag2 = "完成牙模送出";

        const image = this.$refs.SMALL;
        for (let i = 0; i < image.children.length; i++) {
          const img = image.children[i].src.substr(-26);
          const r5 = await fetch(`http://127.0.0.1:30000/uploadImage?teeth_model_id=${teeth_model_id}&image=${img}`);
          const text5 = await r5.text();
          console.log(text5);
        }
        window.location.reload();
      }

    }
    
  }

</script>

<style scoped>
/* @import url("https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/slick.css");
@import url("https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/slick-theme.css"); */

    .t2{
        font-size: 36px;
        position: relative;left: 50px;top: 50px;
        width: 700px;
      }
    .select{
        width: 150px;
    }
    .BIG{
        position: relative; left:80px; top:100px;
        width: 400px;
        height: 350px;
        border: solid;
        cursor:pointer;
    }
    #SMALL{
      position: absolute;left: 75px;top: 620px;
      width: 400px;
    }
    #SMALL img{
        border: solid;        
        width: 80px;
        height: 80px;
        cursor: pointer;
        max-width: 80px;
        margin: 10px;
    }
    .slick-prev:before,
      .slick-next:before {
        color: black;
      }
    .btn1{
        width: 120px;
        height: 40px;
        background-color:#7dc49d;
        border: none;
        border-radius:15px;
        font-size: 18px;
        outline:none;
      }
      .btn1:active{
        background-color:#6eb38d;
      }
      .btn2{
        width: 120px;
        height: 40px;
        background-color:#7dc49d;
        border: none;
        border-radius:15px;
        font-size: 18px;
        outline:none;
        margin-left: 30px;
      }
      .btn2:active{
        background-color:#6eb38d;
      }
      .btn3{
        width: 120px;
        height: 40px;
        background-color:#76a1d3;
        border: none;
        border-radius:15px;
        font-size: 18px;
        outline:none;
        margin-left: 30px;
      }
      .btn3:active{
        background-color:#6a84b3;
      }
      .btn4{
        width: 120px;
        height: 40px;
        background-color:#cf4b5d;
        border: none;
        border-radius:15px;
        font-size: 18px;
        outline:none;
        margin-left: 30px;
        margin-bottom: 10px;
      }
      .btn4:active{
        background-color:#b12f41;
      }
      .txt{
        width: 250px;
        font-size: 18px;
        margin: 10px;
        margin-left: 0px;
        border-style:solid;
      }
      .table{
        font-size: 32px; 
      }
      .table td{
        border: solid;
        height: 60px;
      }
      select{
       font-size:30px; 
      }

</style>