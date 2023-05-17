<template>
    <div>
        <table class="table">
            <colgroup></colgroup>
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
                <td>醫師</td>
                <td>
                    <template v-if="teeth_model && teeth_model.doctor">
                        <input type="text" v-model="teeth_model.doctor.fullname" style="width: 300px;">
                    </template>
                    <template v-else>
                        <select v-model="teeth_model.doctor" id="doctor">
                            <option v-for="doctor in doctors" :key="doctor.username" :value="doctor">{{doctor.fullname}}</option>
                        </select>
                    </template>
                </td>
            </tr>
            <tr>
                <td>模型牙位</td>
                <td id="location"></td>
            </tr>
            <tr>
                <td>材質</td>
                <td>
                    <select class="select" style="width:180px" id="material" v-model="selectedmaterial">
                        <option>氧化鋯</option>
                        <option>PFM</option>
                        <option>E max</option>
                        <option>其他</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td>預定交件日期</td>
                <td>
                    <input type="date" id="expected date" class="date">
                </td>
            </tr>
            <tr>
                <td>實際交件日期</td>
                <td>
                <input type="date" id="actual date" class="date"> 
                </td>            
            </tr>
            <tr>
                <td>製作流程是否有問題</td>
                <td >
                    <div>
                        <input type="checkbox" class="checkbox" id="problem1" v-model="checkboxArray" value="無">
                        <label for="problem1">無</label>
                    </div>
                    <div>
                        <input type="checkbox" class="checkbox" id="problem2" v-model="checkboxArray" value="模型已送回架上，但是醫師不知道">
                        <label for="problem2" style="font-size: 22pt;">模型已送回，但醫師未得知</label>
                    </div>
                    <div>
                        <input type="checkbox" class="checkbox" id="problem3" v-model="checkboxArray" value="送錯院區">
                        <label for="problem3">送錯院區</label>
                    </div>
                                        <div>
                        <input type="checkbox" class="checkbox" id="problem4" v-model="checkboxArray" value="模型或是配件遺失">
                        <label for="problem4">模型或是配件遺失</label>
                    </div>
                                        <div>
                        <input type="checkbox" class="checkbox" id="problem5" v-model="checkboxArray" value="未照指⽰單製作">
                        <label for="problem5">未照指⽰單製作</label>
                    </div>
                                        <div>
                        <input type="checkbox" class="checkbox" id="problem6" v-model="checkboxArray" value="技師比較晚開始製作">
                        <label for="problem6">技師比較晚開始製作</label>
                    </div>
                                        <div>
                        <input type="checkbox" class="checkbox" id="problem7" v-model="checkboxArray" value="程式出現問題沒有收到訊息">
                        <label for="problem7">程式出錯沒有收到訊息</label>
                    </div>
                                        <div>
                        <input type="checkbox" class="checkbox" id="problem8" v-model="checkboxArray" value=" 其他">
                        <label for="problem8"> 其他</label>
                    </div>
                </td>
            </tr>
            <tr>
                <td>病人回診日</td>
                <td>
                    <input type="date" id="return visit" class="date"> 
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
export default ({
    data() {
        return{
            teeth_model:{
                doctor:{fullname:''},
            },
            selectedLab:null,
            list1:['lab1','lab2'],
            images:[],
            transfers:[],

            
        }
    },
    methods:{
        submit(){
            // not yet
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
</style>
