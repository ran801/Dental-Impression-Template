<template>
    <div>
        <div class="t2">
            查詢紀錄
            <select class="select"  id ="search" v-model="search">
                <option>送出日期</option>
                <option>交件日期</option>
                <option>病歷號</option>
                <option>填寫未完成</option>
                <option>回診日期</option>
                <option>已結案</option>
            </select> 
        <span>
            院區
            <select id="search2" style="width: 100px;">
                <option>永康</option>
                <option>柳營</option>
                <option>佳里</option>
            </select>
        </span>
        <span>
            病歷號<input type="text" id="record_number" v-model="record_number" class="text">
        </span>
        <span>
            起始日<input type="date" id="start_date" v-model="start_date" class="date" >
        </span>
        <span>
            結束日<input type="date" id="end_date" v-model="end_date" class="date" >
        </span>
        <span>
            <input type ="submit" value="查詢" class="btn2" @click="searchrecord()">
        </span>
        <span>
            <input type="submit" value="刪除" class="btn3" @click="delete_model()">
        </span>
        </div>
        <div>
            <table class="table">
                <thead>
                    <tr>
                    <td width="100px">選取</td>
                    <td width="250px">填寫狀態</td>
                    <td width="180px">運送狀態</td>
                    <td width="180px">病歷號</td>
                    <td width="180px">病人姓名</td>
                    <td width="160px">序號</td>
                    <td width="250px">送出日期</td>
                    <td width="250px">交件日期</td>
                    <td width="250px">回診日期</td> 
                    </tr>
                </thead>
                <tbody>
                    <tr v-for ="item in items" :key = "item.id">
                        <td>
                            <div>
                                <input type="checkbox" :id = "item.id">
                            </div>
                        </td>
                        
                        <td> 
                            <router-link :to="{ 
                                name: 'ModifyView', 
                                params: { id: item.id }, 
                                query: {  
                                    ...itemData,
                                    laboratoryName2: item.laboratoryName,
                                    dentistName: item.dentistName,
                                    medicalRecordNumber: item.medicalRecordNumber,
                                    patientName: item.patientName,
                                    workOrderNumber: item.workOrderNumber,
                                    sentDate: item.sentDate,
                                    receivedDate: item.receivedDate,
                                    appointmentDate: item.appointmentDate
                                     }}">
                            {{ item.allFieldsFilled ? '完成' : '未完成' }}
                            </router-link>
                        </td>
                        <td>{{ item.laboratoryName !== null ? item.laboratoryName : ""}}</td>
                        <td>{{ item.medicalRecordNumber !== null  ? item.medicalRecordNumber : "" }}</td>
                        <td>{{ item.patientName !== null ? item.patientName : "" }}</td>
                        <td>{{ item.workOrderNumber !== null ? item.workOrderNumber: "" }}</td>
                        <td>{{ item.sentDate  }}</td>                        
                        <td>{{ item.receivedDate !== null ? item.receivedDate : "" }}</td>
                        <td>{{ item.appointmentDate !== null ? item.appointmentDate : "" }}</td>
                        </tr>
                </tbody> 
            </table> 
        </div>                                     

    </div>
</template>

<script>
import Swal from 'sweetalert2'
export default{

    data(){
        return{
            currentDate:'',
            search:"送出日期",
            record_number:'',
            start_date:'',
            end_date:'',
            token:`Bearer `+ this.$root.$accessToken,
            items:[],
            itemData:[]
            
        }
    },
    mounted() {
    // 獲取當前日期
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    this.currentDate = `${year}-${month}-${day}`;

    // 設定初始選擇日期為當天日期
    this.start_date = this.currentDate;
    this.end_date = this.currentDate;

    const callback = async() =>{
        await this.$refresh(110,callback);
    };
    this.$refresh(110,callback);


  },
    methods:{
    async searchrecord(){
        const search = this.search;
        const record_number= this.record_number;
        const start_date = this.start_date;
        const end_date = this.end_date;
        console.log(this.token)
        switch (search){
            case "送出日期":{
                const r3 = await fetch(this.$root.$host+`/api/impressions?sentDateFrom=${start_date}&sentDateTo=${end_date}`,{
                    headers:{
                    "Authorization":this.token
                    }
                });
                const text3 = await r3.json();
                console.log(text3);
                this.items = text3;
            }
            break;
            case "交件日期":{
                const r4 = await fetch(this.$root.$host+`/api/impressions?receivedDateFrom=${start_date}&receivedDateTo=${end_date}`,{
                    headers:{
                        "Authorization":this.token
                    }
                });
                const text4 = await r4.json();
                console.log(text4);
                this.items = text4;
            }
            break;
            case "病歷號":{
                const r5 = await fetch(this.$root.$host+`/api/impressions?medicalRecordNumber=${record_number}`,{
                    headers:{
                        "Authorization":this.token
                    }
                });
                const text5 = await r5.json();
                console.log(text5);
                this.items = text5;
            }
            break;
            case "填寫未完成":{
                const r6 = await fetch(this.$root.$host+`/api/impressions?sentDateFrom=${start_date}&sentDateTo=${end_date}&allFieldsFilled=false`,{
                    headers:{
                        "Authorization":this.token
                    }
                });
                const text6 = await r6.json();
                console.log(text6);
                this.items = text6;
            }
            break;
            case "已結案":{  //status的Filter 還沒完成
                const r7 = await fetch(this.$root.$host+`/api/impressions?sentDateFrom=${start_date}&sentDateTo${end_date}&status=${status} `,{
                    headers:{
                        "Authorization":this.token
                    }
                });
                const text7 = await r7.json();
                console.log(text7);
                this.items = text7;
            }
            break;
            case "回診日期":{
                const r8 = await fetch(this.$root.$host+`/api/impressions?appointmentDateFrom=${start_date}&appointmentDateTo=${end_date}` ,{
                    headers:{
                        "Authorization": this.token
                    }
                });
                const text8 = await r8.json();
                console.log(text8);
                this.items = text8;
            }
            break;
        }
    },
    async delete_model(){
        const selectedInputs = this.$el.querySelectorAll('.wrapper input:checked');
        for (let i = 0; i < selectedInputs.length; i++) {
        const id = selectedInputs[i].id;
        const parentElement = selectedInputs[i].parentElement.parentElement.parentElement;
        Swal.fire({
            title: '確定要刪除紀錄?',
            text: "你將無法返回此操作!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: '確認, 刪除!',
            cancelButtonText: '取消'
        }).then(async (result) => {
            if (result.isConfirmed) {
            parentElement.innerHTML = '';
            const token = 'Bearer ' + localStorage.getItem('token');
            const r = await fetch(':8004/api/dentalImpressions/' + id, {
                method: 'DELETE',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': token
                }
            });
            const text = await r.json();
            console.log(text);
            Swal.fire(
                '刪除成功!',
                '你的紀錄已被刪除.',
                'success'
            );
            }
        });
        }
    }
  }
}
</script>

<style scoped>
    .t2{
        font-size: 36px;
        position: relative;left: 50px;top: 50px;
        width: 2000px;
    }
    .select{
        width: 200px;
        margin-right: 60px;
    }
    .table{
        align: center;
        position: absolute;left: 100px;top: 250px;
        width: 1800px;
        font-size: 32px; 
    }
    .table td{
        border: solid;
        height: 60px;
    }
    .td:hover{
        text-decoration:underline;
        cursor: pointer;
    }
    .date{
        position: relative;top: -5px;
        width: 200px;
        font-size: 24px;        
    }
    .text{
        position: relative;top: -5px;
        width: 200px;
        font-size: 24px;
    }
    .btn2{
        width: 100px;
        height: 40px;
        background-color:#7dc49d;
        border: none;
        position: relative;top: -7px;
        border-radius:15px;
        font-size: 18px;
        outline:none;
        margin-left: 10px;
    }
    .btn2:active{
        background-color:#6eb38d;
    }
    .btn3{
        width: 100px;
        height: 40px;
        background-color:#cf4b5d;
        border: none;
        position: relative;top: -7px;
        border-radius:15px;
        font-size: 18px;
        outline:none;
        margin-left: 10px;
    }
    .btn3:active{
        background-color:#b12f41;
    }
    .wrapper{
        position: relative;
        top: 4px;
    }
    input[type="checkbox"]{
        -webkit-appearance: none;
        height: 40px;
        width: 40px;
        background-color: #d5d5d5;
        border-radius: 5px;
        cursor: pointer;
        display: flex;
        justify-content: center;
    }
    input[type="checkbox"]:after{
        font-family: "Font Awesome 5 Free";
        font-weight: 900;
        content: "\f00c";
        font-size: 32px;
        display: none;
    }
    input[type="checkbox"]:hover{
        background-color: #a5a5a5;
    }
    input[type="checkbox"]:checked::after{
        display: block;
    }
</style>
