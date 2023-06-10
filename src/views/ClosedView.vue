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
            token: `Bearer `+ this.$root.$accessToken,
        }
    },
    mounted(){
        this.$root.$refreshT();
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
                    const text4 = await r3.status;
                    console.log(text4);
                    
                    if (r3.status==200){
                        this.ntag2 = "以建立的牙模"

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
        },
        async close(){
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
            const impressionId = id;
            const r4 = await fetch (`${this.$root.$host}/api/impressions/${impressionId}/close`,{
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
            //取得自己的id
            const r5 = await fetch(`${this.$root.$host}/api/users/me`,{
                headers:{
                    "Authorization": this.token
                }
            })
            const data5 = r5.json();
            const userId = data5.id;
            //發送表單
            const r6 = await fetch(`${this.$root.$host}/api/notifications`,{
                headers:{
                    "Content-Type": "application/json",
                    "Authorization":this.token
                },
                body: JSON.stringify({
                    "receiverId":userId,
                    "message":"發送表單網址"
                })
            })
            console.log(r6.status)
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
