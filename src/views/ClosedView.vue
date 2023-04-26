<template>
    <div>
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
                <td id="return_date">{{receive_date}}</td>
            </tr>        
        </table>
        <div class="div1">
            <form style="position: relative;left: 800px;top: 100px;">
                <input type="button" value="掃描" class="btn3" @click="scan()">
                <span><input type="button" value="清除" class="btn4" @click="remove()"></span>
                <div class="txt" id="ntag">{{ntag}}</div>
                <div class="txt" id="ntag2">{{ntag2}}</div>
            </form>        
        </div>
    </div>    
</template>

<script>
export default{
    data(){
        return{
            ntag:"尚未掃描",
            ntag2:"尚未掃描",
            status:"",
            doctor:"",
            patient_name:"",
            medical_record_number:"",
            work_order_number:"",
            send_date:"",
            receive_date:"",
            return_date:"",
        }
    },
    methods:{
        async scan(){
            const r = await fetch("http://127.0.0.1:20000/uid");
            const text = await r.text();
            console.log(text);

            this.ntag = text;

            if(r.status == 404){
                this.ntag2 = "掃描失敗";
                this.status = "";
                this.doctor = "";
                this.patient_name="";
                this.medical_record_number = "";
                this.work_order_number= "";
                this.send_date="";
                this.receive_date="";
                this.return_date="";
            }else{
                //const r2 = await fetch(":8001/api/ntags/uid"+text);
                const r2 = await fetch(":8001/api/ntags/"+text);
                const text2 = await r2.status;
                console.log(text2);

              if (r2.status==200){
                    const r3 = await fetch(":8004/api/dentalImpressions/"+text);
                    const text4 = await r3.status;
                    console.log(text4);
                    
                    if (r3.status==200){
                        this.ntag2 = "以建立的牙模"

                        const text3 =await r3.json();
                        console.log(text3);
                        const {status} = text3[0];
                        const {doctor} = text3[0];
                        const {patient_name} = text3[0];
                        const {medical_record_number} = text3[0];
                        const {work_order_number} = text3[0];
                        const {receive_date} = text3[0];
                        const {send_date} = text3[0];
                        const {return_date} = text3[0];
                    
                        if (status ==null ){
                            this.status = "" ;
                        }else{
                            this.status = status;
                        }
                        if (doctor ==null){
                            this.doctor = "";
                        }else{
                            this.doctor = doctor;
                        }
                        if(patient_name == null){
                            this.patient_name ="";
                        }else{
                            this.patient_name = patient_name;
                        }
                        if(medical_record_number ==null){
                            this.medical_record_number ="";
                        }else{
                            this.medical_record_number= medical_record_number;
                        }
                        if(work_order_number ==null){
                            this.work_order_number = "";
                        }else{
                            this.work_order_number = work_order_number;
                        }
                        if(receive_date==null){
                            this.receive_date = "";
                        }else{
                            this.receive_date = receive_date;
                        }
                        if(send_date == null){
                            this.send_date ="";
                        }else{
                            this.send_date = send_date;
                        }
                        if(return_date == null){
                            this.return_date ="";
                        }else{
                            this.return_date = return_date;
                        }  
                    }else{
                        this.ntag2 = "尚未建立的牙模";
                        this.status = "";
                        this.doctor = "";
                        this.patient_name="";
                        this.medical_record_number = "";
                        this.work_order_number= "";
                        this.send_date="";
                        this.receive_date="";
                        this.return_date="";
                    }
                }
            else{
                this.ntag2 = "尚未建立ntag";
                this.status = "";
                this.doctor = "";
                this.patient_name="";
                this.medical_record_number = "";
                this.work_order_number= "";
                this.send_date="";
                this.receive_date="";
                this.return_date="";
            }
            }
        }
    },
    async remove(){
        const r = await fetch("http://127.0.0.1:20000/uid");
        const text = await r.text();
        console.log(text);

        const r3 = await fetch(":8004/api/dentalImpressions/NtagUID="+text);
        const text3 = await r3.json();
        console.log(text3);
        const {id} = text3[0]
        console.log(id);
        const teeth_model_id = id;
        const token = 'Bearer' + localStorage.getItem('token');
        const r4 = await fetch ("/api/dentalImpressions/"+ teeth_model_id + '/close',{
            method: "PATCH",
            headers:{
                "Content-Type": "application/json",
                "Authorization": token
            }
        });
        const text4 = await r4.json();
        console.log(text4);
        this.ntag2 ="已清除牙模資料"
        this.status = "";
        this.doctor = "";
        this.patient_name="";
        this.medical_record_number = "";
        this.work_order_number= "";
        this.send_date="";
        this.receive_date="";
        this.return_date="";
    }
}

</script>

<style scoped>
    .table{
        position: absolute;left: 100px;top: 200px;
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
    .btn4{
        width: 120px;
        height: 40px;
        background-color:#7dc49d;
        border: none;
        border-radius:15px;
        font-size: 18px;
        outline:none;
        margin-left: 30px;
      }
    .btn4:active{
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
</style>
