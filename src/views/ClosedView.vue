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
                <td id="doctor">{{dentistName}}</td>
            </tr>
            <tr>
                <td>病人姓名</td>
                <td id="patient_name">{{patientName}}</td>
            </tr>
            <tr>
                <td>病歷號</td>
                <td id="medical_record_number">{{medicalRecordNumber}}</td>
            </tr>
            <tr>
                <td>序號</td>
                <td id="work_order_number">{{workOrderNumber}}</td>
            </tr>
            <tr>
                <td>送出日期</td>
                <td id="send_date">{{sentDate}}</td>
            </tr>
            <tr>
                <td>交件日期</td>
                <td id="receive_date">{{receivedDate}}</td>
            </tr>
            <tr>
                <td>病人回診日</td>
                <td id="return_date">{{appointmentDate}}</td>
            </tr>        
            <tr>
                <td>回饋表單</td>
                <td>
                    <template>
                        <router-link :to="{
                            name: 'FormView',
                            params:{id: this.feedbackId}
                        }" >
                            {{this.isClosed ? '填寫': ''}}
                        </router-link>
                    </template>
                </td>
            </tr>
        </table>
        <div class="div1">
            <form style="position: relative;left: 800px;top: 100px;">
                <input type="button" value="掃描" class="btn3" @click="scan()">
                <span><input type="button" value="結案" class="btn4" @click="close()"></span>
                <div class="txt" id="ntag">{{ntag}}</div>
                <div class="txt" id="ntag2">{{ntag2}}</div>
            </form>        
        </div>
    </div>    
</template>

<script>
import Swal from 'sweetalert2'
export default{
    data(){
        return{
            ntag:"尚未掃描",
            ntag2:"尚未掃描",
            status:"",
            dentistName:"",
            patientName:"",
            medicalRecordNumber:"",
            workOrderNumber:"",
            sentDate:"",
            receivedDate:"",
            appointmentDate:"",
            impressionsId:"",
            token: `Bearer `+ this.$root.$accessToken,
            id2:"",
            impressionId:"",
            isClosed:false,
            feedbackId:"",
        }
    },
    mounted(){
        this.$root.$refreshT();
    },
    methods:{
        async scan(){
            if(this.token == "Bearer null"){
                Swal.fire("尚未登入")
            }else{
                const r = await fetch("http://127.0.0.1:20000/uid");
                const text = await r.text();
                console.log(text);

                this.ntag = text;

                if(r.status == 404){
                    this.ntag2 = "掃描失敗";
                    this.status = "";
                    this.dentistName = "";
                    this.patientName="";
                    this.medicalRecordNumber = "";
                    this.workOrderNumber= "";
                    this.sentDate="";
                    this.receivedDate="";
                    this.appointmentDate="";
                }else{
                    const r2 = await fetch(`${this.$root.$host}/api/ntags/${text}`,{
                        headers:{
                            "Authorization": this.token
                        }
                    });
                    const text2 = await r2.status;
                    console.log(text2);

                if (r2.status==200){
                        const r3 = await fetch(`${this.$root.$host}/api/impressions?ntagUid=${text}`,{
                            headers:{
                                "Authorization":this.token
                            }
                        });
                        console.log("r3:",r3.status);
                            if (r3.status==200){
                                this.ntag2 = "已建立的牙模"

                                const text3 =await r3.json();
                                console.log(text3);

                                const {status} = text3[0];
                                const {dentistName} = text3[0];
                                const {patientName} = text3[0];
                                const {medicalRecordNumber} = text3[0];
                                const {workOrderNumber} = text3[0];
                                const {receivedDate} = text3[0];
                                const {sentDate} = text3[0];
                                const {appointmentDate} = text3[0];
                            
                                if (status ==null ){
                                    this.status = "" ;
                                }else{
                                    this.status = status;
                                }
                                this.dentistName = dentistName==null ? "" : dentistName;
                                this.patientName = patientName ==null ? "" : patientName;
                                this.medicalRecordNumber = medicalRecordNumber==null ? "" : medicalRecordNumber;
                                this.workOrderNumber = workOrderNumber==null ? "" : workOrderNumber;
                                this.receivedDate = receivedDate==null ? "" : receivedDate;
                                this.sentDate = sentDate==null ? "" : sentDate;
                                this.receivedDate = receivedDate==null ? "" : receivedDate;
                                this.sentDate = sentDate==null ? "":sentDate;
                                this.appointmentDate = appointmentDate==null ? "" : appointmentDate;
                            }else{
                                this.ntag2 = "尚未建立的牙模";
                                this.status = "";
                                this.dentistName = "";
                                this.patientName="";
                                this.medicalRecordNumber = "";
                                this.workOrderNumber= "";
                                this.sentDate="";
                                this.receivedDate="";
                                this.appointmentDate="";
                            }
                        
                    }
                else{
                    this.ntag2 = "尚未建立ntag";
                    this.status = "";
                    this.dentistName = "";
                    this.patientName="";
                    this.medicalRecordNumber = "";
                    this.workOrderNumber= "";
                    this.sentDate="";
                    this.receivedDate="";
                    this.appointmentDate="";
                }
                }
            }
        },
        async close(){
            if(this.token =="Bearer null"){
                Swal.fire("尚未登入")
            }else{
                const r = await fetch("http://127.0.0.1:20000/uid");
                const text = await r.text();
                console.log(text);
                const r3 = await fetch(`${this.$root.$host}/api/impressions?ntagUid=${text}`,{
                    headers:{
                        "Authorization":this.token
                    }
                });
                console.log("r:",r.status)
                const text3 = await r3.json();
                console.log(text3);
                const {id} = text3[0]
                console.log(id);
                this.impressionsId = id
                //id2用於填寫feedback
                this.id2 = this.impressionsId
                console.log(this.impressionsId)
                
                //尋找負責牙模的醫生
                const r5 = await fetch(`${this.$root.$host}/api/impressions/${this.impressionsId}`,{
                    headers:{
                        "Authorization":this.token
                    }
                })
                const data5 = await r5.json();
                this.isClosed = data5.isClosed
                const dentist = data5.dentistName
                
                //尋找負責牙模的牙技師
                const r6 = await fetch(`${this.$root.$host}/api/impressions/${this.impressionsId}/transferRecords`,{
                    headers:{
                        "Authorization":this.token
                    }
                })
                const data6 = await r6.json()
                const transactorName = data6[0].transactorName
                console.log(data6)

            
                // 結案
                const r4 = await fetch (`${this.$root.$host}/api/impressions/${this.impressionsId}/close`,{
                    method: "PUT",
                    headers:{
                        "Authorization": this.token
                    }
                });
                console.log("r4:",r4.status)

                this.ntag2 ="已清除牙模資料"
                this.status = "";
                this.dentistName = "";
                this.patientName="";
                this.medicalRecordNumber = "";
                this.workOrderNumber= "";
                this.sentDate="";
                this.receivedDate="";
                this.appointmentDate="";
                this.isClosed = true
                // 取得自己的id並發送表單
                console.log(this.id2 , this.isClosed)
                console.log("dentist:",dentist)
                console.log("transactorName:",transactorName)

                // const r7 = await fetch(`${this.$root.$host}/api/users/me`,{
                //     headers:{
                //         "Authorization": this.token
                //     }
                // })
                // const data7 = await r7.json();
                // const userId = data7.id;
                
                const r8 = await fetch(`${this.$root.$host}/api/users?role=dentist`,{
                    headers:{
                        "Authorization":this.token
                    }
                })
                const data8 = await r8.json();
                
                const matchDentist = data8.find(item => item.username === dentist);
                const dentistId = matchDentist? matchDentist.id:null;
                console.log(data8)                
                console.log(matchDentist)    
                console.log(dentistId)

                
                const r9 = await fetch(`${this.$root.$host}/api/users?role=dental_technician`,{
                    headers:{
                        "Authorization":this.token
                    }
                })
                const data9 = await r9.json()
                const matchDental_technician = data9.find(item=> item.username === transactorName)
                const dental_technicianId = matchDental_technician? matchDental_technician.id : null;
                console.log(data9)
                console.log(matchDental_technician)
                console.log(dental_technicianId)

                //發送表單連結給醫生
                // const r10 = await fetch(`${this.$root.$host}/api/notifications`,{
                //     method:"POST",
                //     headers:{
                //         "Content-Type":"application/json",
                //         "Authorization":this.token
                //     },
                //     body:JSON.stringify({
                //         "receiverId":dentistId,
                //         "message":`回饋表單網址:http://localhost:8080/#/form/${this.impressionsId}`
                //     })
                // })
                // console.log(r10.status)

                //發生表單給牙技師
                // const r11 = await fetch(`${this.$root.$host}/api/notifications`,{
                //     method:"POST",
                //     headers:{
                //         "Content-Type": "application/json",
                //         "Authorization":this.token
                //     },
                //     body: JSON.stringify({
                //         "receiverId":dental_technicianId,
                //         "message":`回饋表單網址:${this.$root.$host}/#/form/${this.impressionsId}`
                //     })
                // })
                // console.log(r11.status)

                //創建表單
                const r12 = await fetch(`${this.$root.$host}/api/feedbacks`,{
                    method: "POST",
                    headers:{
                        "Content-Type": "application/json",
                        "Authorization":this.token
                    },
                    body: JSON.stringify({
                        "impressionId":this.id2
                    })
                })
                console.log("create a feedback r12:",r12.status)
                console.log(this.id2)

                //取得feedbacks的id
                const r13 = await fetch(`${this.$root.$host}/api/feedbacks?impressionId=${this.id2}`,{
                    headers:{
                        "Authorization":this.token
                    }
                })
                const data13 = await r13.json();
                console.log(data13)
                this.feedbackId = data13[0].id
                console.log(this.feedbackId)
                }
    }
    },

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
        font-weight:bold

      }
    .btn3:active{
        background-color:#6eb38d;
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
        font-weight:bold
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
