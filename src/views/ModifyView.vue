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
                <td v-if="teeth_model">{{teeth_model.status}}</td>
            </tr>
            <tr>
                <td>醫師</td>
                <td>
                    <template v-if="teeth_model && teeth_model.doctor">
                        <input type="text" v-model="dentistName" style="width: 300px;">
                    </template>
                    <template v-else>
                        <select v-model="teeth_model.doctor" id="doctor">
                            <option v-for="doctor in doctors" :key="doctor.username" :value="doctor">{{doctor.fullname}}</option>
                        </select>
                    </template>
                </td>
            </tr>
            <tr>
                <td>病人姓名</td>
                <td>
                    <template v-if="teeth_model && teeth_model.patient" >
                        <input type="text" id="patient" style="width: 300px;" :value="teeth_model.patient"/>
                    </template>
                    <template v-else>
                        <input type="text" id="patient" style="width:300px;" value=""/>
                    </template>
                </td>
            </tr>
            <tr>
                <td>病歷號</td>
                <td>
                    <template v-if="teeth_model.medical_record_number">
                        <input type="text" id="medical_record_number" style="width: 300px;" :value="teeth_model.medical_record_number"/>
                    </template>
                    <template v-else>
                        <input type="text" id="medical_record_number" style="width: 300px;" value=""/>
                    </template>
                </td>
            </tr>   
            <tr>
                <td>序號</td>
                <td>
                    <template v-if="teeth_model.work_order_number">
                        <input type="text" id="work_order_number" style="width: 300px;" :value="teeth_model.work_order_number"/>
                    </template>
                    <template v-else>
                        <input type="text" id="work_order_number" style="width: 300px;" value="" />
                    </template>
                </td>
            </tr>
            <tr>
                <td>步驟</td>
                <td v-if="teeth_model.step">{{teeth_model.step}}</td>
                <td v-else></td>
            </tr>
            <tr>
                <td>送出日期</td>
                <td>{{ teeth_model.send_date }}</td>
            </tr>
            <tr>
                <td>交件日期</td>
                <td v-if="teeth_model.receive_date">{{ teeth_model.receive_date }}</td>
                <td v-else></td>
                </tr>
            <tr>
                <td>回診日期</td>
                <td><input type="date" id="return_date" style="width: 300px;" :value="teeth_model.return_date"></td>
            </tr>
            <tr >
                <td>技工所</td>
                <td>
                    <select class="select" id="laboratory" v-model="selectedLab">
                    <option v-for="list in list1" :key="list" :value="list" :selected="list === teeth_model.laboratory">{{list}}</option>
                    </select>
                </td>
            </tr>
        </table>
        <div style="position: relative; top: 10px;">
          <button class="btn2" @click="save">儲存</button>
          <span class="t4" id="savetext"  ></span>
          <button class="btn3" id="delete_image">刪除照片</button>
          <button class="btn4" @click="makePDF">匯出</button>
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
import jspdf from "jspdf";
import 'jspdf-autotable';
import msjh from '@/../public/fonts/msjh.ttf';

export default {
    data() {
        return{
            teeth_model:{
                doctor:{fullname:''},
            },
            selectedLab:null,
            list1:['lab1','lab2'],
            images:[],
            transfers:[],
            doctor:'',
            patient:'',
            savetext:'',
            token:`Bearer `+ this.$root.$accessToken,
            itemData:[],
            dentistName: "",
        }
    },
    mounted(){
            const callback = async() =>{
            await this.$refresh(110,callback);
            };
            this.$refresh(110,callback);
            const id = this.$route.params.id;
            this.itemData = this.$route.query
            this.dentistName = this.itemData.dentistName


            console.log('資料ID:',id);
            console.log('傳遞的資料:', this.itemData )
    },
    
    methods:{
        async save(){
            const doctor = this.doctor;
            const patient = this.patient;
            const medical_record_number = this. medical_record_number;
            const work_order_number = this.work_order_number;
            const return_date = this.return_date;
            const teeth_model_id = this.teeth.teeth_model_id;
            const laboratory = this. laboratory;
            const token = "Bearer" + localStorage.getItem("token");
            const response = await fetch("/api/teeth_models/"+teeth_model_id,{
                method: "PATCH",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization": token,
                },
                body: JSON.stringify({
                    doctor:doctor,
                    patient:patient,
                    medical_record_number: medical_record_number,
                    work_order_number : work_order_number,
                    return_date :return_date,
                    laboratory : laboratory,
                })
            });
            console.log(response.text());
            this.savetext="記錄儲存成功"

        },
        async makePDF(){
            const doc = new jspdf.jsPDF();
            doc.addFileToVFS('msjh.ttf', msjh);
            doc.addFont('msjh.ttf' , 'msjh' , 'normal');
            doc.setFont('msjh');
            doc.autoTable({
                html:'#table2',
                styles:{
                    font: 'msjh',
                    fontStyle: 'normal',
                },
            });
            doc.save('運送記錄.pdf');
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
