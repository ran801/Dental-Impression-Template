<template>
    <div>
       <div class ="t2">
            院區
            <select class ="select" id="branch" v-model="branch">
                <option>永康</option>
                <option>柳營</option>
                <option>佳里</option>
            </select>
            <span>
            步驟
                <select class="select" style="width:180px;" id="stage" v-model="stage">
                    <option>修die</option>
                    <option>選配件</option>
                    <option>已完成</option>
                    <option>請改約</option>
                    <option>蠟型</option>
                    <option>素瓷</option>
                    <option>排牙</option>
                    <option>金屬支架</option>
                </select>
            </span>
        </div>
        <table class="table">
            <colgroup></colgroup>
            <tr>
                <td>運送狀態</td>
                <td id="status">{{status}}</td>
            </tr>
            <tr>
                <td>醫師</td>
                <td id="doctor">{{doctor}}</td>
            </tr>
            <tr>
                <td>病人姓名</td>
                <td id="patient_name">{{patient_name}}</td>
            </tr>
            <tr>
                <td>病歷號</td>
                <td id="medical_record_number">{{medical_record_number}}</td>
            </tr>
            <tr>
                <td>序號</td>
                <td id="work_order_number">{{work_order_number}}</td>
            </tr>
            <tr>
                <td>送出日期</td>
                <td id="send_date">{{send_date}}</td>
            </tr>
            <tr>
                <td>交件日期</td>
                <td id="receive_date">{{receive_date}}</td>
            </tr>
            <tr>
                <td>病人回診日</td>
                <td id="return_date">{{return_date}}</td>
            </tr>
        </table>
        <div class="div1">
            <form style="position: relative; left: 700px; top: 100px;">
                <input type="button" value="掃描" class="btn3" @click="receive_scan()">
                <div class="txt" id="ntag">{{ntag}}</div>
                <div class="txt" id="ntag2">{{ntag2}}</div>
            </form>
            <div style="position: absolute;left: 1000px;top: 250px;">
                <table class="table2">
                    <thead>
                        <tr>
                            <td width="150px">進出口</td>
                            <td width="250px">日期</td>
                            <td width="150px">院區</td>
                            <td width="180px">步驟</td>
                            <td width="180px">接收人</td>
                        </tr>
                    </thead>
                    <tbody class="tbody2">
                        <tr v-for="(item, index) in dataList" :key = "index">
                            <td>{{item.action}}</td>
                            <td>{{item.date}}</td>
                            <td>{{item.hospital_branch}}</td>
                            <td v-if= "item.step !== null "></td>
                            <td v-else>{{item.step}}</td>
                            <td>{{item.transactor}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
export default({
    data(){
        return{
            branch:'',
            stage:'',
            //step:'',
            uid:'',
            ntag:'尚未掃描',
            ntag2:'尚未掃描',
            status:'',
            doctor:'',
            patient_name:'',
            medical_record_number:'',
            work_order_number:'',
            send_date:'',
            receive_date:'',
            return_date:'',
            teeth_model_id:'',
            dataList:[],
        }
    },
    methods:{
        async recive_scan(){
            const r = await fetch("http://127.0.0.1:20000/uid");
            const text = await r.text();
            console.log (text)
            const token = "Bearer" + localStorage.getItem('token')
            this.ntag = text

            if (r.status == 404 ){
                this.ntag2 = "掃描失敗";
                this.status="";
                this.doctor="";
                this.patient_name="";
                this.medical_record_number="";
                this.work_order_number="";
                this.send_date="";
                this.receive_date="";
                this.return_date="";
            }else{
                const r2 = await fetch('/api/ntags/uid/'+text);
                const text2 = await r2.status;
                console.log(text2);

                if (r2.status ==404){
                this.ntag2 = "尚未建立的ntag";
                this.status="";
                this.doctor="";
                this.patient_name="";
                this.medical_record_number="";
                this.work_order_number="";
                this.send_date="";
                this.receive_date="";
                this.return_date="";
                }else{
                    const r3 = await fetch("/api/teeth_models/ntags/"+text);
                    const text3 = await r3.json()
                    console.log(r3.status)
                    console.log(text3)
                    if (r3.status ==404){
                        this.ntag2  ="尚未建立的牙模";
                        this.status="";
                        this.doctor="";
                        this.patient_name="";
                        this.medical_record_number="";
                        this.work_order_number="";
                        this.send_date="";
                        this.receive_date="";
                        this.return_date="";
                    }else{
                        this.ntag2 = "已建立的牙模";
                        this.status = text3[0].status
                        this.send_date = text3[0].send_date
                        this.doctor = text3[0].doctor
                        this.patient_name = text3[0].patient_name
                        this.medical_record_number = text3[0].medical_record_number
                        this.work_order_number = text3[0].work_order_number
                        this.receive_date = text3[0].receive_date
                        this.return_date = text3[0].return_date
                        this.teeth_model_id = text3[0].id
                        
                        if(text3[0].status == null){
                            this.status ='';
                        }else{
                            this.status = text3[0].status;
                        }
                        if(text3[0].send_date == null){
                            this.send_date ='';
                        }else{
                            this.send_date = text3[0].send_date;
                        }
                        if(text3[0].patient_name ==null ){
                            this.patient_name='';
                        }else{
                            this.patient_name = text3[0].patient_name;
                        }
                        if(text3[0].medical_record_number ==null){
                            this.medical_record_number='';
                        }else{
                            this.medical_record_number= text3[0].medical_record_number;
                        }
                        if(text3[0].work_order_number ==null){
                            this.work_order_number ='';
                        }else{
                            this.work_order_number = text3[0].work_order_number;
                        }
                        if(text3[0].send_date == null){
                            this.send_date='';
                        }else{
                            this.send_date = text3[0].send_date;
                        }
                        if(text3[0].receive_date ==null ){
                            this.receive_date ='';
                        }else{
                            this.receive_date = text[3].receive_date;
                        }
                        if(text3[0].return_date== null){
                            this.return_date='';
                        }else{
                            this.return_date= text[3].return_date;
                        }
                        
                        const r4 = await fetch("/api/teeth_models/" + this.teeth_model_id + "/receive",{
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": token
                            },
                            body: JSON.stringify({
                                hospital_branch: this.branch,
                                stage: this.stage
                            })
                        });
                        const text4 = await r4.json();
                        console.log(text4);
                        this.ntag2 = "成功接收牙模";

                        const r5 = await fetch("/api/teeth_models/" + this.teeth_model_id + "transfer_records");
                        const text5 = await r5.json();
                        console.log(text5);
                        this.dataList=text5;
                        }
                    }
       
            }
    }
    }
    

})

</script>

<style scoped>
    .t2{
        font-size: 36px;
        position: relative;left: 50px;top: 50px;
        width: 1000px;
      }
    .select{
        width: 150px;
        margin-right: 30px;
    }
    .table{
        position: absolute;left: 100px;top: 250px;
        width: 500px;
        font-size: 32px;
        table-layout:fixed;word-break:break-all;
    }
    .table td{
        border: solid;
    }
    .btn3{
        width: 120px;
        height: 40px;
        background-color:#7dc49d;
        border: none;
        border-radius:15px;
        font-size: 18px;
        outline:none;
      }
    .btn3:active{
        background-color:#6eb38d;
      }
    .txt{
        width: 250px;
        font-size: 18px;
        margin: 10px;
        margin-left: 0px;
        border-style:solid;
      }
    .div1{
        width: 600px;
      }
    .table2{
        font-size: 32px; 
    }
    .table2 td{
        border: solid;
        height: 60px;
    }
</style>
