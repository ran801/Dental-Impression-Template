<template>
    <div>
        <div class="t2">
            查詢紀錄
            <select class="select"  id ="search" v-model="search">
                <option>送出日期</option>
                <option>交件日期</option>
                <option>序號</option>
                <option>填寫未完成</option>
                <option>回診日期</option>
                <option>已結案</option>
                <option>未結案</option>
                <option>序號查詢</option>
                <option>病歷號查詢</option> 
            </select> 
        <span>
            序號<input type="text" id="record_number" v-model="record_number" class="text">
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
                    <td width="150px">編號</td>
                    <td width="230px">填寫狀態</td>
                    <td width="230px">運送狀態</td>
                    <td width="180px">病歷號</td>
                    <td width="180px">病人姓名</td>
                    <td width="160px">序號</td>
                    <td width="250px">送出日期</td>
                    <td width="250px">交件日期</td>
                    <td width="250px">回診日期</td> 
                    <td width="230px">回饋表單</td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for ="item in items" :key = "item.id">
                        <td>
                            <div>
                                <input type="checkbox" :id = "item.id" :value="item.id" v-model="checkedItems" @change="handleCheckboxChange(item.id)" :checked="checkedItems.includes(item.id)">
                            </div>
                        </td>
                        <td>
                            {{ item.ntagUid ? item.ntagUid.substring(2,6) : '已結案' }}
                        </td>
                        <td> 
                            <template v-if="item.isClosed">
                                完成
                            </template>
                            <template v-else>
                                <router-link :to="{ 
                                    name: 'ModifyView', 
                                    params: { id: item.id }, 
                                }" :disabled="item.isClosed">
                                    {{ item.allFieldsFilled ? '完成' : '未完成' }}
                                </router-link>
                            </template>
                        </td>
                        <td>{{ item.status !== null ? item.status : ""}}</td>
                        <td>{{ item.medicalRecordNumber !== null  ? item.medicalRecordNumber : "" }}</td>
                        <td>{{ item.patientName !== null ? item.patientName : "" }}</td>
                        <td>{{ item.workOrderNumber !== null ? item.workOrderNumber : "" }}</td>
                        <td>{{ item.sentDate }}</td>                        
                        <td>{{ item.receivedDate !== null ? item.receivedDate : "" }}</td>
                        <td>{{ item.appointmentDate !== null ? item.appointmentDate : "" }}</td>
                        <td>
                            <template v-if ="item.isClosed">
                                <router-link :to="{
                                    name:'FormView',
                                    params:{id:formIdMap[item.id]},
                                }">
                                連結
                                </router-link>
                            </template>
                            <template v-else>
                                尚未結案
                            </template>
                        </td>
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
            itemData:[],
            checkedItems:[],
            selectedItemID:null,
            impressionId:"",
            selectedIds:[],
            item:{
                ntagUid:''
            },
            formId:"",
            formIdMap:{}
        };
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
    this.$root.$refreshT();
    },
    methods:{
        async handleCheckboxChange(id){
            if(this.checkedItems.includes(id)){
                for(const itemid of this.checkedItems){
                    console.log('id:',itemid)
                    const r = await fetch(`${this.$root.$host}/api/feedbacks?impressionId=${itemid}`,{
                        headers:{
                            "Authorization":this.token
                        }
                    });
                    const data = await r.json()
                    console.log(data)
                    console.log(r.status)
                    console.log(data[0].id)
                }
            }
        },
    async searchrecord(){
        if (this.token =="Bearer null"){
            Swal.fire("尚未登入")
            console.log(this.token)
        }else{
        const search = this.search;
        const record_number= this.record_number;
        const start_date = this.start_date;
        const end_date = this.end_date;
        console.log(this.token)
        switch (search){
            case "送出日期":{
                const r3 = await fetch(`${this.$root.$host}/api/impressions?sentDateFrom=${start_date}&sentDateTo=${end_date}&isClosed=false`,{
                    headers:{
                    "Authorization":this.token
                    }
                });
                const text3 = await r3.json();
                console.log(text3);
                if(text3 == null){
                    Swal.fire("查無資料")
                }
                this.items = text3;
            }
            break;
            case "交件日期":{
                const r3 = await fetch(`${this.$root.$host}/api/impressions`,{
                    headers:{
                        "Authorization":this.token
                    }
                });
                const text3 = await r3.json();
                console.log(text3);
                if(text3 == null){
                    Swal.fire("查無資料")
                }                
                this.items = text3;
            
            }
            break;
            case "序號":{
                
                const r3 = await fetch(`${this.$root.$host}/api/impressions?workOrderNumber=${record_number}&isClosed=false`,{
                    headers:{
                        "Authorization":this.token
                    }
                });
                const text3 = await r3.json();
                console.log(text3);
                if(text3 == null){
                    Swal.fire("查無資料")
                }
                this.items = text3;
            }
            break;
            case "填寫未完成":{
                const r3 = await fetch(`${this.$root.$host}/api/impressions?sentDateFrom=${start_date}&sentDateTo=${end_date}&allFieldsFilled=false&isClosed=false`,{
                    headers:{
                        "Authorization":this.token
                    }
                });
                const text3 = await r3.json();
                console.log(text3);
                if(text3 == null){
                    Swal.fire("查無資料")
                }
                this.items = text3;
            }
            break;
            case "已結案":{ 
                const r3 = await fetch(`${this.$root.$host}/api/impressions?isClosed=true `,{
                    headers:{
                        "Authorization":this.token
                    }
                });
                const text3 = await r3.json();
                console.log(text3);
                if(text3 == null){
                    Swal.fire("查無資料")
                }
                this.items = text3;
                const formIdMap = [];
                for(const item of this.items){
                    console.log(item)
                    console.log("item.id:",item.id)
                    const r4 = await fetch(`${this.$root.$host}/api/feedbacks?impressionId=${item.id}`,{
                        headers:{
                            "Authorization": this.token
                        }
                    });
                    const data = await r4.json();
                    const formId = data.length >0 ?data[0].id : null;
                    this.$set(this.formIdMap, item.id , formId);
                    
                    console.log(formId)
                    console.log(r4.status)
                    console.log(data)
                }
                console.log(formIdMap)
            }
            break;
            case "回診日期":{
                const r3 = await fetch(`${this.$root.$host}/api/impressions?appointmentDateFrom=${start_date}&appointmentDateTo=${end_date}&isClosed=false` ,{
                    headers:{
                        "Authorization": this.token
                    }
                });
                const text3 = await r3.json();
                console.log(text3);
                if(text3 == null){
                    Swal.fire("查無資料")
                }
                this.items = text3;
                                for(let i = 0 ; i<this.items.length; i++){
                    const item = this.items[i]
                    console.log(item)
                    console.log(item.id)
                    const r4 = await fetch(`${this.$root.$host}/api/feedbacks?impressionId=${item.id}`,{
                        headers:{
                            "Authorization":this.token
                        }
                     });
                    const data = await r4.json()
                    const formId = data[i].id;
                    console.log(formId);
                    console.log(r4.status)
                    console.log(data)
                }
            }
            break;
            case "未結案":{
                const r3 = await fetch(`${this.$root.$host}/api/impressions?isClosed=false` ,{
                    headers:{
                        "Authorization": this.token
                    }
                });
                const text3 = await r3.json();
                console.log(text3);
                if(text3 == null){
                    Swal.fire("查無資料")
                }
                this.items = text3;
            }
            break;
            case "序號查詢":{
                const r3 = await fetch(`${this.$root.$host}/api/impressions?workOrderNumber=${this.record_number}`,{
                    headers:{
                        "Authorization":this.token
                    }
                });
                const text3 = await r3.json();
                console.log(text3)
                if(text3 == null){
                    Swal.fire("查無資料")
                }
                this.items= text3;
            }
            break;
            case "病歷號查詢":{
                const r3 = await fetch(`${this.$root.$host}/api/impressions?medicalRecordNumber=${this.record_number}`,{
                    headers:{
                        "Authorization":this.token
                    }
                });
                const text3 = await r3.json();
                console.log(text3)
                if(text3 == null){
                    Swal.fire("查無資料")
                }
                this.items= text3;
            }
            break;
        }
        }
    },
    
    async delete_model(){
        if(this.checkedItems.length===0){
            await Swal.fire({
                title : '請選擇要刪除的資料',
                icon : 'warning',
            });
            return;
        }else{
            await Swal.fire({
                title: '確定要刪除紀錄?',
                text: '你將無法返回此操作!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText:"確認刪除",
                cancelButtonText:"取消"
            }).then(async(result)=>{
                if (result.isConfirmed){
                    for (const id of this.checkedItems){
                            const r = await fetch (`${this.$root.$host}/api/impressions/${id}`,{
                                method:"DELETE",                        
                                headers:{
                                    "Content-Type": "application/json",
                                    "Authorization":this.token
                                }
                            });
                            console.log(r.status)
                            if(r.status == 204){
                                Swal.fire('刪除成功!')
                            }else if(r.status == 404){
                                Swal.fire('資料已刪除')
                            }else if (r.status == 403){
                                Swal.fire('權限不足，刪除失敗')    
                            }else{
                                Swal.fire('刪除失敗')
                            }
                    }
                }else{
                    Swal.fire('取消刪除')
                }
            })
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
        position: absolute;left: 20px;top: 250px;
        width: 2000px;
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
        font-weight:bold
        
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
        font-weight:bold
    }
    .btn3:active{
        background-color:#b12f41;
    }
    .wrapper{
        position: relative;
        top: 4px;
    }
    input[type="checkbox"]{
        height: 40px;
        width: 40px;
        margin-left: 20px;
        background-color: #d5d5d5;
        border-radius: 5px;
        cursor: pointer;
        display: flex;
        justify-content: center;
    }
    input[type="checkbox"]:after{
        font-weight: 900;
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
