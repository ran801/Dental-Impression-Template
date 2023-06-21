<template>
    <div>
        <table class="table">
            <colgroup></colgroup>
            <tr>
                <td>病人姓名</td>
                <td>{{patientName}}</td>
            </tr>
            <tr>
                <td>醫師</td>
                <td>{{dentistName}}</td>
            </tr>
            <tr>
                <td>模型牙位:自然牙</td>
                <td>
                    <input type="text" style ="width:250px ; height:40px;margin-left:10px;border-style:outset;" v-model="toothNumber1"/>
                </td>
            </tr>
            <tr>
                <td>模型牙位:植牙</td>
                <td>
                    <input type="text" style ="width:250px ; height:40px;margin-left:10px;border-style:outset;" v-model="toothNumber2"/>
                </td>
            </tr>
            <tr>
                <td>材質</td>
                <td>
                    <select class="select" style="width:150px ; height:80px;margin-left:10px;margin-top:10px;margin-bottom:10px;border-style:outset" id="material" v-model="selectedMaterial">
                        <option v-for="(material, index) in materials" :value="material" :key="index">{{material}}</option> 
                    </select>
                </td>
            </tr>
            <tr>
                <td>預定交件日期</td>
                <td>
                    <input type="date" class="date" v-model="expectedDeliveryDate">
                </td>
            </tr>
            <tr>
                <td>實際交件日期</td>
                <td>
                    <input type="date"  class="date" v-model="actualDeliveryDate"> 
                </td>            
            </tr>
            <tr>
                <td>製作流程是否有問題</td>
                <td>
                    <div v-for="(issue,index) in processIssues" :key="index">
                        <input type ="checkbox" :id="issue" v-model="processIssue[index]"  :value="issue">
                        <label :for="issue">{{issue}}</label>
                    </div>
                    <!-- <div>
                        <input type="checkbox"   id="problem1" v-model="processIssue" value="無" :checked="processIssue.includes('無')">
                        <label for="problem1">無</label>
                    </div>
                    <div>
                        <input type="checkbox"   id="problem2" v-model="processIssue" value="模型已送回架上，但是醫師不知道" :checked="processIssue.includes('模型已送回架上，但是醫師不知道')">
                        <label for="problem2" style="font-size: 22pt;">模型已送回，但醫師未得知</label>
                    </div>
                    <div>
                        <input type="checkbox"   id="problem3" v-model="processIssue" value="送錯院區" :checked="processIssue.includes('送錯院區')">
                        <label for="problem3">送錯院區</label>
                    </div>
                                        <div>
                        <input type="checkbox"   id="problem4" v-model="processIssue" value="模型或是配件遺失" :checked="processIssue.includes('模型或是配件遺失')">
                        <label for="problem4">模型或是配件遺失</label>
                    </div>
                                        <div>
                        <input type="checkbox"   id="problem5" v-model="processIssue" value="未照指⽰單製作" :checked="processIssue.includes('未照指示單製作')"> 
                        <label for="problem5">未照指⽰單製作</label>
                    </div>
                                        <div>
                        <input type="checkbox"   id="problem6" v-model="processIssue" value="技師比較晚開始製作" :checked="processIssue.includes('技師比較晚開始製作')">
                        <label for="problem6">技師比較晚開始製作</label>
                    </div>
                                        <div>
                        <input type="checkbox"   id="problem7" v-model="processIssue" value="程式出現問題沒有收到訊息" :checked="processIssue.includes('程式出現問題沒有收到訊息')">
                        <label for="problem7">程式出錯沒有收到訊息</label>
                    </div>
                                        <div>
                        <input type="checkbox"   id="problem8" v-model="processIssue" value=" 其他" :checked="processIssue.includes('其他')">
                        <label for="problem8"> 其他</label>
                    </div> -->
                </td>
            </tr>     
        </table>
        <div class="div1">
            <form style="position: relative;left: 1000px;top: 1050px;">
                <input type="button" value="送出回饋" class="btn3" @click="submit()">
            </form>        
        </div>
    </div>    
</template>

<script>
import Swal from 'sweetalert2'
export default ({
    data() {
        return{
            formId:this.$route.params.id,
            patientName:"",
            dentistName:"",
            toothNumber1:"",
            toothNumber2:"",
            selectedMaterial:"",
            expectedDeliveryDate:"",
            actualDeliveryDate:"",
            processIssues:["無", "模型已送回架上，但是醫師不知道", "送錯院區", "模型或是配件遺失", "未照指示單製作", "技師比較晚開始製作", "程式出現問題沒有收到訊息", "其他"],
            processIssue:[],
            materials: ["氧化皓", "PFM", "E max", "其他"] 

        }
    },
    mounted(){
        console.log(this.formId)
        this.dataSelect();
    },

    watch:{
        processIssue:{
            handler:'handleProcessIssue',
            deep: true,
        }
    },

    methods:{
        handleProcessIssue(newValues){
            console.log('選中的內容：',newValues);
        },

        async dataSelect(){
            const r = await fetch(`${this.$root.$host}/api/feedbacks/${this.formId}`,{
                // headers:{
                //     "Authorization":this.token
                // }
            });
            const data = await r.json();
            this.patientName = data.patientName
            this.dentistName = data.dentistName
            const selectedMaterial = this.materials.find(material => material=== data.material)
            console.log(selectedMaterial)
            console.log(data.material)
            console.log(data.processIssue)
            const processIssueData = data.processIssue
            this.processIssue = this.processIssues.map((issue)=>processIssueData.includes(issue));
            if(selectedMaterial){
                this.$nextTick(()=>{
                    this.selectedMaterial = selectedMaterial
                })
            }
            
            this.expectedDeliveryDate = data.expectedDeliveryDate
            this.actualDeliveryDate = data.actualDeliveryDate
            const regex = /自然牙:\[(.*?)\] 植牙:\[(.*?)\]/;
            const matches = regex.exec(data.toothNumbers);
            if (matches && matches.length >= 3) {
                this.toothNumber1 = matches[1];
                this.toothNumber2 = matches[2];
            }
            console.log(data)
            console.log(this.toothNumber1 , this.toothNumber2)
        },
        
        async submit(){
            const processIssue = this.processIssue.join(',')
            console.log("自然牙:[",this.toothNumber1,"],植牙:[", this.toothNumber2,"]")
            console.log("Material:",this.selectedMaterial)
            console.log("expectedDeliveryDate:",this.expectedDeliveryDate)
            console.log("actualDeliveryDate:",this.actualDeliveryDate)
            console.log("processIssue:",this.processIssue.join(','))
            const r = await fetch(`${this.$root.$host}/api/feedbacks/${this.formId}`,{
                method:"PATCH",
                // headers:{
                //     "Content-Type":"application/json",
                //     "Authorization":this.token
                // },
                body:JSON.stringify({
                    "toothNumbers":`自然牙:[${this.toothNumber1}] 植牙:[${this.toothNumber2}]`,
                    "material":this.selectedMaterial,
                    "expectedDeliveryDate":this.expectedDeliveryDate,
                    "actualDeliveryDate":this.actualDeliveryDate,
                    "processIssue":processIssue
                })
            });
            console.log(r.status)
            if(r.status ==204){
                Swal.fire("送出成功")
            }else{
                Swal.fire("填寫失敗")
            }

        }
    }
})
</script>

<style scoped>
    .table{
        position: absolute;left: 100px;top: 200px;
        width: 800px;
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
    .date{
        margin-top:10px; 
        margin-bottom:10px;
        margin-left:10px;
        border-style:outset
    }
</style>
