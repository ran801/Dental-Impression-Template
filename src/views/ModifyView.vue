<template>
    <div>
        <head>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/slick.css" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/slick-theme.css" />
            <link rel="shortcut icon" href="data:image/x-icon;," type="image/x-icon">
        </head>
        <div class="t2">
            修改寄送紀錄
            <span class="t5">牙模編號
                <span id="teeth_model_id">{{ $route.params.id}}
                </span>
            </span>
        </div>
        <table class="table">
            <colgroup></colgroup>
            <tr>
                <td>運送狀態</td>
                <td>{{status}}</td>
            </tr>
            <tr>
                <td>醫師</td>
                <td>
                    <select v-model="dentistName" @change="dentistChange"  style=" height:50px ; width: 300px;">
                        <option v-for="user in usernames" :key="user.id" :value="user">{{user.username}}</option>
                    </select>
                </td>
            </tr>
            <tr> 
                <td>病人姓名</td>
                <td>
                    <input type="text"  style="width: 300px;" v-model="patientName"/>
                </td>
            </tr>
            <tr>
                <td>病歷號</td>
                <td>
                    <input type="text" style ="width: 300px;" v-model="medicalRecordNumber"/>
                </td>   
            </tr>   
            <tr>
                <td>序號</td>
                <td>
                    <input type="text" style = "width: 200px;" v-model="workOrderNumber"/>
                </td>
            </tr>
            <tr> 
                <td>步驟</td>
                <td>{{stage}}</td>
            </tr>
            <tr>
                <td>送出日期</td>
                <td>{{ sentDate !== null ? sentDate : '' }}</td>
            </tr>
            <tr>
                <td>交件日期</td>
                <td>{{ receivedDate !== null ? receivedDate : '' }}</td>

                </tr>
            <tr>
                <td>回診日期</td>
                <td><input type="date" style="width: 300px;" v-model="appointmentDate"></td>
            </tr>
            <tr >
                <td>技工所</td>
                    <td>
                        <select class="select" id="laboratory" v-model="laboratory" @change="laboratoryChange">
                            <option v-for="item in list1" :key="item.id" :value="item" >{{item.name}}</option>
                        </select>
                    </td>
            </tr>
        </table>
        <div style="position: relative; top: 10px;">
          <button class="btn2" @click="save">儲存</button>
          <!-- <button class="btn4" @click="makePDF">匯出</button> -->
        </div>
         <img src="https://img.alicdn.com/imgextra/i2/78424090/TB2JqHbbaSWBuNjSsrbXXa0mVXa_!!78424090.jpg_400x400Q50s50.jpg_.webp" alt="image" class="BIG" id="BIG" >
         <div id="SMALL" class="slider">
         </div>
        <div style="position: absolute;left: 1300px;top:250px;">
            <table class="table2" id="table2">
                <thead>
                    <tr>
                        <td width="150px">進出口</td>
                        <td width="250px">日期</td>
                        <td width="180px">步驟</td>
                        <td width="180px">接收人</td>
                    </tr>
                </thead>
                <tbody class="tbody2">
                    <tr v-for="(transfer,index) in transfers" :key="index">
                        <td width="150px">{{transfer.type}}</td>
                        <td width="250px">{{formatData(transfer.transferDateTime)}}</td>
                        <td width="180px">{{transfer.stage||""}}</td>
                        <td width="180px">{{transfer.transactorName}}</td>
                    </tr>
                </tbody>
            </table>
        </div> 
    </div>
</template>

<script>
//import jsPDF from "jspdf";
import 'jspdf-autotable';
//import msjhFont from '@/../public/fonts/msjh-normal.js';
import Swal from 'sweetalert2'
// import {fromByteArray} from "base64-js";

export default {
    mounted(){
            this.$root.$refreshT();
            this.docterSelect();    
            this.laboratorySelect();
            this.id = this.$route.params.id;
            this.searchData();
                        
            console.log('資料ID:',this.id);
            console.log(this.laboratory)
            

    },
    data() {
        return{
            selectedLab:null,
            list1:[],
            transfers:[],
            doctor:'',
            token:`Bearer `+ this.$root.$accessToken,
            dentistName:null,
            dentistPersonnelNumber:'',
            patientName:'',
            medicalRecordNumber:'',
            workOrderNumber:'',
            stage:'',
            sentDate:'',
            receivedDate:'',
            appointmentDate:'',
            id: null,
            itemData:[],
            usernames: [],
            userIds:[],
            laboratory:null,
            status:'',
            
        }
    },
    
    methods:{
        formatData(dataTime){
            const data = new Date(dataTime);
            return data.toISOString().slice(0,10);
        },

        dentistChange(){
            console.log(this.dentistName.id)
        },
        laboratoryChange(){
            console.log(this.laboratory.name , this.laboratory.id)
        },
        async docterSelect(){
            try{
                const r = await fetch(`${this.$root.$host}/api/users?role=dentist`,{
                    headers:{
                        "Authorization":this.token
                    }
                });
                const data = await r.json();
                const usernames = data.map(item => ({id: item.id , username:item.username}));
                this.usernames = usernames;
                console.log("doctor names:",usernames)
            }catch(error){
                console.error(error);
            }
        },
        
        async laboratorySelect(){
            try{
                const r = await fetch(`${this.$root.$host}/api/facilities?facilityType=laboratory`,{
                    headers:{
                        "Authorization":this.token
                    }
                });
                const data = await r.json();
                const list1 = data.map(item => ({id:item.id , name:item.name}));
                this.list1 = list1;
                console.log("laboratory list:",list1)
            }catch(error){
                console.error(error)
            }
        },

        async searchData(){
            const r =  await fetch(`${this.$root.$host}/api/impressions/${this.id}`,{
                headers:{
                    "Authorization":this.token,
                }
            });
            const data = await r.json();
            const dentist = this.usernames.find(user=>user.username === data.dentistName);
            console.log("dentist",dentist)
            if(dentist){
                this.$nextTick(()=>{
                    this.dentistName = dentist;
                })
            }
            const laboratory = this.list1.find(item=>item.name === data.laboratoryName);
            console.log("laboratory:",laboratory)

            if(laboratory){
                this.$nextTick(()=>{
                    this.laboratory = laboratory
                })
            }
            this.status = data.status
            this.patientName = data.patientName;
            this.medicalRecordNumber = data.medicalRecordNumber;
            this.workOrderNumber = data.workOrderNumber;
            this.sentDate = data.sentDate;
            this.stage = data.stage;
            this.receivedDate = data.receivedDate;
            this.appointmentDate = data.appointmentDate;
            console.log(data)

            const r2 = await fetch (`${this.$root.$host}/api/impressions/${this.id}/transferRecords`,{
                headers:{
                    "Authorization":this.token
                }
            });
            const data2 = await r2.json()
            console.log(data2)
            this.transfers=data2;
        },

        async save(){
            const r_dentist = await fetch(`${this.$root.$host}/api/users/${this.dentistName.id}`,{
                headers:{
                    "Authorization":this.token
                }
            });
            const dentistData = await r_dentist.json();

            if(this.appointmentDate === '0001-01-01'){
                this.appointmentDate =null ;
            }

            const dentistPersonnelNumber = dentistData.personnelNumber
            const patientName = this.patientName
            const medicalRecordNumber = this.medicalRecordNumber
            const workOrderNumber = this.workOrderNumber
            const appointmentDate = this.appointmentDate
            const laboratoryId = this.laboratory.id
            
            const response = await fetch(`${this.$root.$host}/api/impressions/${this.id}`,{
                method: "PATCH",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization": this.token,
                },
                body: JSON.stringify({
                    "dentistPersonnelNumber":dentistPersonnelNumber,
                    "patientName": patientName,
                    "medicalRecordNumber": medicalRecordNumber,
                    "workOrderNumber": workOrderNumber,
                    "appointmentDate": appointmentDate, 
                    "laboratoryId": laboratoryId,
                })
            });
            console.log(response.status);
            if ( response.status == 204){
                Swal.fire("紀錄儲存成功")
            }else{
                Swal.fire("紀錄儲存失敗<br>資料格式或內容不正確")
            }
            
        },
        // async makePDF(){
        //     const doc = new jsPDF();

        //     // doc.addFileToVFS('msjh.ttf', msjhFont);
        //     // doc.addFont('msjh.ttf', 'msjh', 'normal');
        //     doc.setFont('msjh');

        //     const columns =[
        //         { header: 'aaaa', dataKey: 'action' },
        //         { header: '日期', dataKey: 'date' },
        //         { header: '步驟', dataKey: 'step' },
        //         { header: '接收人', dataKey: 'transactor' },
        //     ]
        //     const rows = this.transfers.map((transfer) => ({
        //         action: transfer.action,
        //         date: transfer.date,
        //         step: transfer.step || '',
        //         transactor: transfer.transactor,
        //     }));

        //     doc.autoTable({
        //         columns,
        //         body:rows,
        //         font:'msjh',
        //     });
        //     doc.save('運輸紀錄.pdf');
        // }

    }
}
</script>


<style scoped>
    .t2{
        font-size: 36px;
        position: relative;left: 50px;top: 25px;
        width: 800px;
      }
    .t4{
        font-size: 22px;
        width: 180px;
        height: 37px;
        position: absolute;left: 150px;top: 672px;
        margin: 20px;
        border: solid;
        border-color:#8d8d8d;
        padding: 0px 20px;
      }
    .t5{
        font-size: 26px;
        position: relative;left: 600px;top: -5px;
        margin: 20px;
        border: solid;
        border-color:#8d8d8d;
        padding: 0px 20px;
    }
    .select{
        width: 200px;
    }
    .table{
        position: absolute;left: 50px;top: 190px;
        width: 500px;
        font-size: 28px;
        margin:auto;
    }
    .table td{
        border: solid;
    }
    .table2{
        font-size: 32px; 
    }
    .table2 td{
        border: solid;
        height: 60px;
    }
    .btn2{
        width: 100px;
        height: 40px;
        background-color:#7dc49d;
        border: none;
        border-radius:15px;
        font-size: 18px;
        position: absolute;left: 50px;top: 690px;
    }
    .btn2:active{
        background-color:#6eb38d;
    }
    .btn3{
        width: 100px;
        height: 40px;
        background-color:#cf4b5d;
        border: none;
        border-radius:15px;
        font-size: 18px;
        position: absolute;left: 380px;top: 690px;
    }
    .btn3:active{
        background-color:#b12f41;
    }.btn4{
        width: 100px;
        height: 40px;
        background-color:#7dc49d;
        border: none;
        border-radius:15px;
        font-size: 18px;
        position: absolute;left: 500px;top: 690px;
    }
    .btn4:active{
        background-color:#6eb38d;
    }
    #BIG{
        position: absolute;left: 800px;top: 220px;
        width: 400px;
        height: 350px;
        border: solid;
    }
    #SMALL{
      position: absolute;left: 800px;top: 600px;
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
</style>
