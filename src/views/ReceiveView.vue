<template>
    <div>
       <div class ="t2">
            <span>
            步驟
                <select class="select" style="width:180px;" id="stageId" v-model="stageId">
                    <option value="1">修die</option>
                    <option value="2">選配件</option>
                    <option value="3">已完成</option>
                    <option value="4">請改約</option>
                    <option value="5">蠟型</option>
                    <option value="6">素瓷</option>
                    <option value="7">排牙</option>
                    <option value="8">金屬支架</option>
                </select>
            </span>
        </div>
          <table class="table">
            <colgroup></colgroup>
            <tr v-for="item in data" :key="item.id">
            <td>{{ item.label }}</td>
            <td :id="item.id">{{ item.value }}</td>
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
                            <td>{{item.type === 'sent' ? '出口' : '進口' }}</td>
                            <td>{{formatDate(item.transferDateTime)}}</td>
                            <td>{{item.facilityName}}</td>
                            <td>{{ item.stage !== null ? item.stage : '' }}</td>
                            <td>{{item.transactorName}}</td>
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
            data:[
                { id: 'laboratoryName', label: '運送狀態', value: '' },
                { id: 'dentistName', label: '醫師', value: '' },
                { id: 'patientName', label: '病人姓名', value: '' },
                { id: 'medicalRecordNumber', label: '病歷號', value: '' },
                { id: 'workOrderNumber', label: '序號', value: '' },
                { id: 'sentDate', label: '送出日期', value: '' },
                { id: 'receivedDate', label: '交件日期', value: '' },
                { id: 'appointmentDate', label: '病人回診日', value: '' },
                
            ],
            stageId:'1',
            uid:'',
            ntag:'尚未掃描',
            ntag2:'尚未掃描',
            laboratoryName:'',
            dentistName:'',
            patientName:'',
            medicalRecordNumber:'',
            workOrderNumber:'',
            sentDate:'',
            receivedDate:'',
            appointmentDate:'',
            dataList:[],
            token:`Bearer ${this.$root.$accessToken}` 
        }
    },
    mounted(){  
        this.$root.$refreshT();

    },
    methods:{
        formatDate(dataTime){
        const date = new Date(dataTime);
        return date.toISOString().slice(0,10);
        },
        async receive_scan(){
            const r = await fetch("http://127.0.0.1:20000/uid");
            const text = await r.text();
            console.log (text)
            this.ntag = text

            if (r.status == 404 ){
                this.ntag2 = "掃描失敗";
                this.laboratoryName="";
                this.dentistName="";
                this.patientName="";
                this.medicalRecordNumber="";
                this.workOrderNumber="";
                this.sentDate="";
                this.receivedDate="";
                this.appointmentDate="";
            }else{
                const r2 = await fetch(this.$root.$host+`/api/ntags/${text}`,{
                    headers:{
                        "Authorization":this.token
                    }
                });
                const text2 = await r2.status;
                console.log(text2);

                if (r2.status ==404){
                this.ntag2 = "尚未建立的ntag";
                this.laboratoryName="";
                this.dentistName="";
                this.patientName="";
                this.medicalRecordNumber="";
                this.workOrderNumber="";
                this.sentDate="";
                this.receivedDate="";
                this.appointmentDate="";
                }else{
                    const r3 = await fetch(`${this.$root.$host}/api/impressions?ntagUid=${text}`,{
                        headers:{
                            "Authorization":this.token
                        }
                    });
                    const text3 = await r3.json()
                    console.log(r3.status)  
                    console.log(text3)
                    if (r3.status ==404){
                        this.ntag2  ="尚未建立的牙模";
                        this.laboratoryName="";
                        this.dentistName="";
                        this.patientName="";
                        this.medicalRecordNumber="";
                        this.workOrderNumber="";
                        this.sentDate="";
                        this.receivedDate="";
                        this.appointmentDate="";
                    }else{
                        this.ntag2 = "已建立的牙模";
                        this.data.forEach(item => {
                        item.value = text3[0][item.id];
                        });
                        const id = text3[0].id
                        const stageId = parseInt(this.stageId)


                        const r4 = await fetch(this.$root.$host+`/api/impressions/${id}/transferRecords`,{
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": this.token
                            },
                            body: JSON.stringify({
                                "type":"received",
                                "stageId":stageId
                            })
                        });
                        const text4 = await r4.json();
                        console.log(text4);
                        this.ntag2 = "成功接收牙模";

                        const r5 = await fetch(this.$root.$host+`/api/impressions/${id} /transferRecords`,{
                            headers:{
                                "Authorization":this.token
                            }
                        });
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
