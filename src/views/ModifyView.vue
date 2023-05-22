<template>
    <div>
        <head>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/slick.css" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/slick-theme.css" />
            <link rel="shortcut icon" href="data:image/x-icon;," type="image/x-icon">
        </head>
        <div class="t2">
            修改寄送紀錄
            <span class="t5" v-if="teeth_model">牙模編號
                <span id="teeth_model_id">{{ $route.params.id}}
                </span>
            </span>
        </div>
        <table class="table">
            <colgroup></colgroup>
            <tr>
                <td>運送狀態</td>
                <!-- 尚未完成 -->
                <td v-if="teeth_model">{{teeth_model.status}}</td>
            </tr>
            <tr>
                <td>醫師</td>
                <td>
                    <input v-if="dentistName" type="text" v-model="dentistName" style="width: 300px;">
                    <select v-else v-model="teeth_model.doctor" id="doctor">
                        <option v-for="username in usernames" :key="username.id" :value="username.id">{{username}}</option>
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
                <!-- 尚未完成 -->
                <td>步驟</td>
                <td v-if="teeth_model.step">{{teeth_model.step}}</td>
                <td v-else></td>
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
                        <select class="select" id="laboratory" v-model="laboratoryName">
                            <option v-for="list in list1" :key="list" :value="list" :selected="list === laboratoryName">{{list}}</option>
                        </select>
                    </td>
            </tr>
        </table>
        <div style="position: relative; top: 10px;">
          <button class="btn2" @click="save">儲存</button>
          <span class="t4">{{savetext}}</span>
          <button class="btn4" @click="makePDF">匯出</button>
          <button class="btn4" @click='test'>測試</button>
        </div>
         <img src="https://img.alicdn.com/imgextra/i2/78424090/TB2JqHbbaSWBuNjSsrbXXa0mVXa_!!78424090.jpg_400x400Q50s50.jpg_.webp" alt="image" class="BIG" id="BIG" >
         <div id="SMALL" class="slider">
         <img v-for="image in images" :key="image" :src="'/static/uploads/' + image + '.jpg'" :alt="'image'" :id="'id' + image" @click="select('id' + image)">
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
                        <td width="150px">{{transfer.action}}</td>
                        <td width="250px">{{transfer.date}}</td>
                        <td width="180px">{{transfer.step||""}}</td>
                        <td width="180px">{{transfer.transactor}}</td>
                    </tr>
                </tbody>
            </table>
        </div> 
    </div>
</template>

<script>
import jsPDF from "jspdf";
import 'jspdf-autotable';
import msjhFont from '@/../public/fonts/msjh.ttf';
// import {fromByteArray} from "base64-js";

export default {
    mounted(){
            this.$root.$refreshT();

            this.docterselect();

            this.id = this.$route.params.id;
            this.itemData = this.$route.query

            this.dentistName = this.itemData.dentistName
            this.patientName = this.itemData.patientName
            this.medicalRecordNumber = this.itemData.medicalRecordNumber
            this.workOrderNumber = this.itemData.workOrderNumber
            //impressions的步驟尚未有
            this.sentDate = this.itemData.sentDate
            this.receivedDate = this.itemData.receivedDate
            this.appointmentDate = this.itemData.appointmentDate
            this.laboratoryName = this.itemData.laboratoryName

            console.log('資料ID:',this.id);
            console.log('傳遞的資料:', this.itemData )
            console.log(this.laboratoryName)
            

    },
    data() {
        return{
            teeth_model:{
                doctor:{fullname:''},
            },
            selectedLab:null,
            list1:['顏氏','鴻冠', '良曄'],
            images:[],
            transfers:[],
            doctor:'',
            savetext:'',
            token:`Bearer `+ this.$root.$accessToken,
            dentistName:'',
            patientName:'',
            medicalRecordNumber:'',
            workOrderNumber:'',
            sentDate:'',
            receivedDate:'',
            appointmentDate:'',
            id: null,
            itemData:[],
            usernames: [],
            laboratoryName:'',
        }
    },
    
    methods:{
        async docterselect(){
            try{
                const r = await fetch(`${this.$root.$host}/api/users?role=dentist`,{
                    headers:{
                        "Authorization":this.token
                    }
                });
                const data = await r.json();
                const usernames = data.map(item => item.username);
                this.usernames = usernames;
                console.log(usernames)
                console.log (data)
            }catch(error){
                console.error(error);
            }
        },
        async test(){
            const username = this.username;
            console.log(username)
        },
        async save(){
            //const dentistName = this.username;
            const patientName = this.patientName;
            const medicalRecordNumber = this.medicalRecordNumber;
            const workOrderNumber = this.workOrderNumber;
            const appointmentDate = this.appointmentDate;
            //const laboratoryName = this.laboratoryName;
 

            const response = await fetch(`${this.$root.$host}/api/impressions/${this.id}`,{
                method: "PATCH",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization": this.token,
                },
                body: JSON.stringify({ //dentistName 、laboratoryName 要改成 personnelNumber 、laboratoryId
                    "dentistPersonnelNumber":"RqOBZD",
                    "patientName": patientName,
                    "medicalRecordNumber": medicalRecordNumber,
                    "workOrderNumber": workOrderNumber,
                    "appointmentDate": appointmentDate, 
                    "laboratoryId": 2,
                })
            });
            console.log(response.status);
            this.savetext="記錄儲存成功"

        },
        async makePDF(){
            // const doc = new jspdf();
            // doc.addFileToVFS('msjh.ttf', msjh);
            // const fontData = await fetch('fonts/msjh.ttf').then(response => response.arrayBuffer());
            // const encodedFontData = fromByteArray(new Uint8Array(fontData));

            // doc.addFont(encodedFontData , 'msjh' , 'normal');
            // doc.setFont('msjh');

            // const tableElement = this.$refs.table;

            // doc.autoTable({
            //     html: tableElement,
            //     styles:{
            //         font: 'msjh',
            //         fontStyle: 'normal',
            //     },
            // });
            // doc.save('運送記錄.pdf');
            const doc = new jsPDF();
            console.log(msjhFont)
            // doc.addFileToVFS('msjh.ttf', msjhFont);
            // doc.addFont('msjh.ttf', 'msjh', 'normal');

            const columns =[
                { header: '進出口', dataKey: 'action' },
                { header: '日期', dataKey: 'date' },
                { header: '步驟', dataKey: 'step' },
                { header: '接收人', dataKey: 'transactor' },
            ]
                const rows = this.transfers.map((transfer) => ({
                    action: transfer.action,
                    date: transfer.date,
                    step: transfer.step || '',
                    transactor: transfer.transactor,
                }));

            doc.autoTable({
                columns,
                body:rows
            });
            doc.save('運輸紀錄.pdf');
        }

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
