<template>
  <div>
    <div class="t2">
        步驟
            <select class="select" id="stageId"  v-model="stageId" required>
            <option value="1">修die</option>
            <option value="2">選配件</option>
            <option value="3">已完成</option>
            <option value="4">請改約</option>
            <option value="5">蠟型</option>
            <option value="6">素瓷</option>
            <option value="7">排牙</option>
            <option value="8">金屬支架</option>
            <option value="9">收模</option>
        </select>
    </div>
    
    <div id="SMALL" class="slider"></div>

    <div>
        <form style="position: absolute; left: 560px; top:250px;">``
            <input type="button" value="掃描" class="btn1" @click="nTag_scan()">
            <input type="button" value="確認" class="btn4" @click="upload()">
            <!-- <input type="button" value="確認" class="btn1" @click="record()"> -->
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
                <td width="150px">{{ item.type === 'sent' ? '出口' : '進口' }}</td>
                <td width="250px">{{ formatDate(item.transferDateTime) }}</td>
                <td width="150px">{{ item.facilityName }}</td>
                <td width="180px">{{ item.stage || '' }}</td>
                <td width="180px">{{ item.transactorName }}</td>
              </tr>
            </tbody>
        </table>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2'
export default {
  data(){
    return{
      bigImgSrc:"https://img.alicdn.com/imgextra/i2/78424090/TB2JqHbbaSWBuNjSsrbXXa0mVXa_!!78424090.jpg_400x400Q50s50.jpg_.webp",
      smallImgSrcs:[],
      stageId:"1",
      items:[],
      ntag1:'尚未掃描',
      ntag2:'尚未紀錄',
      token:`Bearer `+ this.$root.$accessToken       
    };
  },

  mounted(){
    this.$root.$refreshT();
},

  

  methods:{
    formatDate(dataTime){
      const date = new Date(dataTime);
      return date.toISOString().slice(0,10);
    },
    async nTag_scan(){
      if(this.token == "Bearer null"){
        Swal.fire("請先登入")
      }else{
      //使用ntag reader取得uid
      const r = await fetch("http://127.0.0.1:20000/uid");
      console.log("r:",r.status)

      if(r.status===404){
        this.ntag1="read failed"
        this.ntag2="掃描失敗"
        this.items=[]
      }else {
        const text = await r.text();
        this.ntag1=text
        console.log("找到uid:",text);
        this.items=[];
        //偵測api中是否有ntags
        const r2 = await fetch(`${this.$root.$host}/api/ntags/${this.ntag1}`,{
          headers:{
            "Authorization": this.token
        }
        });
        console.log("r2:",r2.status)

        if (r2.status === 404){
        //新增一筆ntag(id)
          const r3 = await fetch(`${this.$root.$host}/api/ntags`,{
            method:"POST",
            headers:{
              "Content-Type":"application/json",
              "Authorization":this.token
            },
            body: JSON.stringify({
              "uid":this.ntag1
            })
          });
          console.log("r3:",r3.status)
          this.ntag2 ="建立新的ntag";
        }
        //新增一筆牙模資料
        const r4 = await fetch(`${this.$root.$host}/api/impressions`,{
          method:"POST",
          headers:{
            "Content-Type":"application/json",
            "Authorization":this.token
          },
          body: JSON.stringify({
            "ntagUid":this.ntag1
          })
        });
        if(r4.status==400){
          this.ntag2="已建立的牙模"
        }
        console.log("r4:",r4.status) 
        //取得該uid的牙模資料，並取得牙模的id值  
        const r5 = await fetch(`${this.$root.$host}/api/impressions?ntagUid=${this.ntag1}`,{
          headers:{
            "Authorization":this.token
        },
        });
        const response = await r5.json();
        const id = response[0].id
        console.log("r5:",r5.status)
        console.log("第",id,"筆資料")
        //取得該id的transferRecords資料，並列進表格中
        const r6= await fetch(`${this.$root.$host}/api/impressions/${id}/transferRecords`,{
          headers:{
            "Authorization":this.token
          }
        });
        const response2 = await r6.json();
        console.log(response2)
        this.items=[];
        this.items=response2;
        }
      }
      },
      
      async upload() {
        const ntag = this.ntag1;
        const stageId = parseInt(this.stageId);
        console.log (ntag)
        
        if (this.ntag1 == "尚未掃描" || this.ntag1 == "Read failed"){
          Swal.fire("無資料")
        }else{
        const response3 = await fetch(`${this.$root.$host}/api/impressions?ntagUid=${ntag}`,{
          headers:{
            'Authorization':this.token,
          }
        });
        const data3 = await response3.json();
        const id = data3[0].id;
        console.log(id)
        const r4 = await fetch(`${this.$root.$host}/api/impressions/${id}/transferRecords`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": this.token
          },
          body: JSON.stringify({
            "type":"sent",
            "stageId":stageId
          })
        });
        console.log("r4:",r4.status)
        Swal.fire('送出成功')
        }
      },
      async record(){
        const r = await fetch("http://127.0.0.1:20000/uid");
        if (r.status ===404){
          this.ntag1 = "read failed"
        }else{
          const text = await r.text();
          const text2 = await text.substring(2,6)
          this.ntag1 = text2
          this.ntag2 = text
        }
      }

    }
    
  }

</script>

<style scoped>

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
        font-weight:bold
        
      }
      .btn1:active{
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
        margin-bottom: 10px;
        
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
        font-weight:bold
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