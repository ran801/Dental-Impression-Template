const search = async () => {
    const searchElement = document.getElementById("search");
    const search = searchElement.value;
    const record_numberElement = document.getElementById("record_number");
    const record_number = record_numberElement.value;
    const startdateElement = document.getElementById("start_date");
    const startdate = startdateElement.value;
    const enddateElement = document.getElementById("end_date");
    const enddate = enddateElement.value;
    switch(search){
        case "送出日期":
            const r3 = await fetch("/api/teeth_models?send_date_start=" + startdate + "&send_date_end=" + enddate);
            const text3 = await r3.json();
            console.log(text3);
            var tbody =document.querySelector('tbody')
            tbody.innerHTML="";
            for(var i = 0 ; i < text3.length ; i++){
                var tr = document.createElement('tr');
                tbody.appendChild(tr);

                var td = document.createElement("td");
                const { id } = text3[i];
                td.innerHTML = `<div class="wrapper"><input type="checkbox" id="${id}"></div>`;
                tr.appendChild(td);

                var td = document.createElement("td");
                const { has_empty_columns } = text3[i];
                if(`${has_empty_columns}` == "true"){
                    td.innerHTML  = `<a href="/teeth_models/${id}/modify" target="_blank">` + "未完成" + '</a>';
                    tr.appendChild(td);
                }
                else{
                    td.innerHTML  = `<a href="/teeth_models/${id}/modify" target="_blank">` + "完成" + '</a>';
                    tr.appendChild(td);            
                }        
                
                var td = document.createElement("td");
                const { status } = text3[i];
                td.innerText = `${status}`;
                tr.appendChild(td);

                var td = document.createElement("td");
                const { medical_record_number } = text3[i];
                if(`${medical_record_number}` == "null"){
                    td.innerHTML  = "";
                    tr.appendChild(td);
                }
                else{
                    td.innerText = `${medical_record_number}`;
                    tr.appendChild(td);            
                }

                var td = document.createElement("td");
                const { patient } = text3[i];
                if(`${patient}` == "null"){
                    td.innerHTML  = "";
                    tr.appendChild(td);
                }
                else{
                    td.innerText = `${patient}`;
                    tr.appendChild(td);            
                }

                var td = document.createElement("td");
                const { work_order_number } = text3[i];
                if(`${work_order_number}` == "null"){
                    td.innerHTML  = "";
                    tr.appendChild(td);
                }
                else{
                    td.innerText = `${work_order_number}`;
                    tr.appendChild(td);            
                }

                var td = document.createElement("td");
                const { send_date } = text3[i];
                td.innerText = `${send_date}`;
                tr.appendChild(td);

                var td = document.createElement("td");
                const { receive_date } = text3[i];
                if(`${receive_date}` == "null"){
                    td.innerHTML  = "";
                    tr.appendChild(td);
                }
                else{
                    td.innerText = `${receive_date}`;
                    tr.appendChild(td);            
                }

                var td = document.createElement("td");
                const { return_date } = text3[i];
                if(`${return_date}` == "null"){
                    td.innerHTML  = "";
                    tr.appendChild(td);
                }
                else{
                    td.innerText = `${return_date}`;
                    tr.appendChild(td);            
                }
            }
            break;
        case "交件日期":
            const r4 = await fetch("/api/teeth_models?receive_date_start=" + startdate + "&receive_date_end=" + enddate);
            const text4 = await r4.json();
            console.log(text4);
            var tbody =document.querySelector('tbody')
            tbody.innerHTML="";
            for(var i = 0 ; i < text4.length ; i++){
                var tr = document.createElement('tr');
                tbody.appendChild(tr);

                var td = document.createElement("td");
                const { id } = text4[i];
                td.innerHTML = `<div class="wrapper"><input type="checkbox" id="${id}"></div>`;
                tr.appendChild(td);

                var td = document.createElement("td");
                const { has_empty_columns } = text4[i];
                if(`${has_empty_columns}` == "true"){
                    td.innerHTML  = `<a href="/teeth_models/${id}/modify" target="_blank">` + "未完成" + '</a>';
                    tr.appendChild(td);
                }
                else{
                    td.innerHTML  = `<a href="/teeth_models/${id}/modify" target="_blank">` + "完成" + '</a>';
                    tr.appendChild(td);            
                }        
                
                var td = document.createElement("td");
                const { status } = text4[i];
                td.innerText = `${status}`;
                tr.appendChild(td);

                var td = document.createElement("td");
                const { medical_record_number } = text4[i];
                if(`${medical_record_number}` == "null"){
                    td.innerHTML  = "";
                    tr.appendChild(td);
                }
                else{
                    td.innerText = `${medical_record_number}`;
                    tr.appendChild(td);            
                }

                var td = document.createElement("td");
                const { patient } = text4[i];
                if(`${patient}` == "null"){
                    td.innerHTML  = "";
                    tr.appendChild(td);
                }
                else{
                    td.innerText = `${patient}`;
                    tr.appendChild(td);            
                }

                var td = document.createElement("td");
                const { work_order_number } = text4[i];
                if(`${work_order_number}` == "null"){
                    td.innerHTML  = "";
                    tr.appendChild(td);
                }
                else{
                    td.innerText = `${work_order_number}`;
                    tr.appendChild(td);            
                }

                var td = document.createElement("td");
                const { send_date } = text4[i];
                td.innerText = `${send_date}`;
                tr.appendChild(td);

                var td = document.createElement("td");
                const { receive_date } = text4[i];
                if(`${receive_date}` == "null"){
                    td.innerHTML  = "";
                    tr.appendChild(td);
                }
                else{
                    td.innerText = `${receive_date}`;
                    tr.appendChild(td);            
                }

                var td = document.createElement("td");
                const { return_date } = text4[i];
                if(`${return_date}` == "null"){
                    td.innerHTML  = "";
                    tr.appendChild(td);
                }
                else{
                    td.innerText = `${return_date}`;
                    tr.appendChild(td);            
                }
            }
            break;            
        case "病歷號":
            const r5 = await fetch("/api/teeth_models?medical_record_number=" + record_number);
            const text5 = await r5.json();
            console.log(text5);
            var tbody =document.querySelector('tbody')
            tbody.innerHTML="";
            for(var i = 0 ; i < text5.length ; i++){
                var tr = document.createElement('tr');
                tbody.appendChild(tr);

                var td = document.createElement("td");
                const { id } = text5[i];
                td.innerHTML = `<div class="wrapper"><input type="checkbox" id="${id}"></div>`;
                tr.appendChild(td);

                var td = document.createElement("td");
                const { has_empty_columns } = text5[i];
                if(`${has_empty_columns}` == "true"){
                    td.innerHTML  = `<a href="/teeth_models/${id}/modify" target="_blank">` + "未完成" + '</a>';
                    tr.appendChild(td);
                }
                else{
                    td.innerHTML  = `<a href="/teeth_models/${id}/modify" target="_blank">` + "完成" + '</a>';
                    tr.appendChild(td);            
                }        
                
                var td = document.createElement("td");
                const { status } = text5[i];
                td.innerText = `${status}`;
                tr.appendChild(td);

                var td = document.createElement("td");
                const { medical_record_number } = text5[i];
                if(`${medical_record_number}` == "null"){
                    td.innerHTML  = "";
                    tr.appendChild(td);
                }
                else{
                    td.innerText = `${medical_record_number}`;
                    tr.appendChild(td);            
                }

                var td = document.createElement("td");
                const { patient } = text5[i];
                if(`${patient}` == "null"){
                    td.innerHTML  = "";
                    tr.appendChild(td);
                }
                else{
                    td.innerText = `${patient}`;
                    tr.appendChild(td);            
                }

                var td = document.createElement("td");
                const { work_order_number } = text5[i];
                if(`${work_order_number}` == "null"){
                    td.innerHTML  = "";
                    tr.appendChild(td);
                }
                else{
                    td.innerText = `${work_order_number}`;
                    tr.appendChild(td);            
                }

                var td = document.createElement("td");
                const { send_date } = text5[i];
                td.innerText = `${send_date}`;
                tr.appendChild(td);

                var td = document.createElement("td");
                const { receive_date } = text5[i];
                if(`${receive_date}` == "null"){
                    td.innerHTML  = "";
                    tr.appendChild(td);
                }
                else{
                    td.innerText = `${receive_date}`;
                    tr.appendChild(td);            
                }

                var td = document.createElement("td");
                const { return_date } = text5[i];
                if(`${return_date}` == "null"){
                    td.innerHTML  = "";
                    tr.appendChild(td);
                }
                else{
                    td.innerText = `${return_date}`;
                    tr.appendChild(td);            
                }
            }
            break;
        case "填寫未完成":
            const r6 = await fetch("/api/teeth_models?send_date_start=" + startdate + "&send_date_end=" + enddate + "&has_empty_columns=true");
            const text6 = await r6.json();
            console.log(text6);
            var tbody =document.querySelector('tbody')
            tbody.innerHTML="";
            for(var i = 0 ; i < text6.length ; i++){
                var tr = document.createElement('tr');
                tbody.appendChild(tr);

                var td = document.createElement("td");
                const { id } = text6[i];
                td.innerHTML = `<div class="wrapper"><input type="checkbox" id="${id}"></div>`;
                tr.appendChild(td);

                var td = document.createElement("td");
                const { has_empty_columns } = text6[i];
                if(`${has_empty_columns}` == "true"){
                    td.innerHTML  = `<a href="/teeth_models/${id}/modify" target="_blank">` + "未完成" + '</a>';
                    tr.appendChild(td);
                }
                else{
                    td.innerHTML  = `<a href="/teeth_models/${id}/modify" target="_blank">` + "完成" + '</a>';
                    tr.appendChild(td);            
                }        
                
                var td = document.createElement("td");
                const { status } = text6[i];
                td.innerText = `${status}`;
                tr.appendChild(td);

                var td = document.createElement("td");
                const { medical_record_number } = text6[i];
                if(`${medical_record_number}` == "null"){
                    td.innerHTML  = "";
                    tr.appendChild(td);
                }
                else{
                    td.innerText = `${medical_record_number}`;
                    tr.appendChild(td);            
                }

                var td = document.createElement("td");
                const { patient } = text6[i];
                if(`${patient}` == "null"){
                    td.innerHTML  = "";
                    tr.appendChild(td);
                }
                else{
                    td.innerText = `${patient}`;
                    tr.appendChild(td);            
                }

                var td = document.createElement("td");
                const { work_order_number } = text6[i];
                if(`${work_order_number}` == "null"){
                    td.innerHTML  = "";
                    tr.appendChild(td);
                }
                else{
                    td.innerText = `${work_order_number}`;
                    tr.appendChild(td);            
                }

                var td = document.createElement("td");
                const { send_date } = text6[i];
                td.innerText = `${send_date}`;
                tr.appendChild(td);

                var td = document.createElement("td");
                const { receive_date } = text6[i];
                if(`${receive_date}` == "null"){
                    td.innerHTML  = "";
                    tr.appendChild(td);
                }
                else{
                    td.innerText = `${receive_date}`;
                    tr.appendChild(td);            
                }
                
                var td = document.createElement("td");
                const { return_date } = text6[i];
                if(`${return_date}` == "null"){
                    td.innerHTML  = "";
                    tr.appendChild(td);
                }
                else{
                    td.innerText = `${return_date}`;
                    tr.appendChild(td);            
                }
            }
            break;
        case "已結案":
            const r7 = await fetch("/api/teeth_models?send_date_start=" + startdate + "&send_date_end=" + enddate + "&status=已結案");
            const text7 = await r7.json();
            console.log(text7);
            var tbody =document.querySelector('tbody')
            tbody.innerHTML="";
            for(var i = 0 ; i < text7.length ; i++){
                var tr = document.createElement('tr');
                tbody.appendChild(tr);

                var td = document.createElement("td");
                const { id } = text7[i];
                td.innerHTML = `<div class="wrapper"><input type="checkbox" id="${id}"></div>`;
                tr.appendChild(td);

                var td = document.createElement("td");
                const { has_empty_columns } = text7[i];
                if(`${has_empty_columns}` == "true"){
                    td.innerHTML  = `<a href="/teeth_models/${id}/modify" target="_blank">` + "未完成" + '</a>';
                    tr.appendChild(td);
                }
                else{
                    td.innerHTML  = `<a href="/teeth_models/${id}/modify" target="_blank">` + "完成" + '</a>';
                    tr.appendChild(td);            
                }        
                
                var td = document.createElement("td");
                const { status } = text7[i];
                td.innerText = `${status}`;
                tr.appendChild(td);

                var td = document.createElement("td");
                const { medical_record_number } = text7[i];
                if(`${medical_record_number}` == "null"){
                    td.innerHTML  = "";
                    tr.appendChild(td);
                }
                else{
                    td.innerText = `${medical_record_number}`;
                    tr.appendChild(td);            
                }

                var td = document.createElement("td");
                const { patient } = text7[i];
                if(`${patient}` == "null"){
                    td.innerHTML  = "";
                    tr.appendChild(td);
                }
                else{
                    td.innerText = `${patient}`;
                    tr.appendChild(td);            
                }

                var td = document.createElement("td");
                const { work_order_number } = text7[i];
                if(`${work_order_number}` == "null"){
                    td.innerHTML  = "";
                    tr.appendChild(td);
                }
                else{
                    td.innerText = `${work_order_number}`;
                    tr.appendChild(td);            
                }

                var td = document.createElement("td");
                const { send_date } = text7[i];
                td.innerText = `${send_date}`;
                tr.appendChild(td);

                var td = document.createElement("td");
                const { receive_date } = text7[i];
                if(`${receive_date}` == "null"){
                    td.innerHTML  = "";
                    tr.appendChild(td);
                }
                else{
                    td.innerText = `${receive_date}`;
                    tr.appendChild(td);            
                }
                
                var td = document.createElement("td");
                const { return_date } = text7[i];
                if(`${return_date}` == "null"){
                    td.innerHTML  = "";
                    tr.appendChild(td);
                }
                else{
                    td.innerText = `${return_date}`;
                    tr.appendChild(td);            
                }
            }
            break;
            case "回診日期":
            const r8 = await fetch("/api/teeth_models?return_date_start=" + startdate + "&return_date_end=" + enddate);
            const text8 = await r8.json();
            console.log(text8);
            var tbody =document.querySelector('tbody')
            tbody.innerHTML="";
            for(var i = 0 ; i < text8.length ; i++){
                var tr = document.createElement('tr');
                tbody.appendChild(tr);

                var td = document.createElement("td");
                const { id } = text8[i];
                td.innerHTML = `<div class="wrapper"><input type="checkbox" id="${id}"></div>`;
                tr.appendChild(td);

                var td = document.createElement("td");
                const { has_empty_columns } = text8[i];
                if(`${has_empty_columns}` == "true"){
                    td.innerHTML  = `<a href="/teeth_models/${id}/modify" target="_blank">` + "未完成" + '</a>';
                    tr.appendChild(td);
                }
                else{
                    td.innerHTML  = `<a href="/teeth_models/${id}/modify" target="_blank">` + "完成" + '</a>';
                    tr.appendChild(td);            
                }        
                
                var td = document.createElement("td");
                const { status } = text8[i];
                td.innerText = `${status}`;
                tr.appendChild(td);

                var td = document.createElement("td");
                const { medical_record_number } = text8[i];
                if(`${medical_record_number}` == "null"){
                    td.innerHTML  = "";
                    tr.appendChild(td);
                }
                else{
                    td.innerText = `${medical_record_number}`;
                    tr.appendChild(td);            
                }

                var td = document.createElement("td");
                const { patient } = text8[i];
                if(`${patient}` == "null"){
                    td.innerHTML  = "";
                    tr.appendChild(td);
                }
                else{
                    td.innerText = `${patient}`;
                    tr.appendChild(td);            
                }

                var td = document.createElement("td");
                const { work_order_number } = text8[i];
                if(`${work_order_number}` == "null"){
                    td.innerHTML  = "";
                    tr.appendChild(td);
                }
                else{
                    td.innerText = `${work_order_number}`;
                    tr.appendChild(td);            
                }

                var td = document.createElement("td");
                const { send_date } = text8[i];
                td.innerText = `${send_date}`;
                tr.appendChild(td);

                var td = document.createElement("td");
                const { receive_date } = text8[i];
                if(`${receive_date}` == "null"){
                    td.innerHTML  = "";
                    tr.appendChild(td);
                }
                else{
                    td.innerText = `${receive_date}`;
                    tr.appendChild(td);            
                }
                
                var td = document.createElement("td");
                const { return_date } = text8[i];
                if(`${return_date}` == "null"){
                    td.innerHTML  = "";
                    tr.appendChild(td);
                }
                else{
                    td.innerText = `${return_date}`;
                    tr.appendChild(td);            
                }
            }
            break;
    }    
}
const delete_model = async () => {
    $(".wrapper input").each(async function() {
        if(this.checked == true){
            console.log(this.id);
            Swal.fire({
                title: '確定要刪除紀錄?',
                text: "你將無法返回此操作!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: '確認, 刪除!',
                cancelButtonText: '取消'
              }).then(async(result) => {
                if (result.isConfirmed) {
                    parentElement = this.parentElement.parentElement.parentElement;
                    parentElement.innerHTML = ``;
                    const token = "Bearer " + localStorage.getItem("token")
                    const r = await fetch("/api/teeth_models/" + this.id,{
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": token
                        }
                    });
                    const text = await r.json();
                    console.log(text);
                    Swal.fire(
                        '刪除成功!',
                        '你的紀錄已被刪除.',
                        'success'
                    )
                }
              })
        }
    });
}