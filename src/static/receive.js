const receive_scan = async () => {
    const branchElement = document.getElementById("branch");
    const branch = branchElement.value;
    const stepElement = document.getElementById("step");
    const step = stepElement.value;
    const r = await fetch("http://127.0.0.1:20000/uid");
    const text = await r.text();
    console.log(text);
    const token = "Bearer " + localStorage.getItem("token") 

    document.getElementById("ntag").innerHTML= text;

    if(r.status == 404){
        document.getElementById("ntag2").innerHTML= "掃描失敗";

        document.getElementById("status").innerHTML = "";
        document.getElementById("doctor").innerHTML = "";
        document.getElementById("patient_name").innerHTML = "";
        document.getElementById("medical_record_number").innerHTML = "";
        document.getElementById("work_order_number").innerHTML = "";
        document.getElementById("send_date").innerHTML = "";
        document.getElementById("receive_date").innerHTML = "";
        document.getElementById("return_date").innerHTML = "";
    }
    else{
        const r2 = await fetch("/api/ntags?uid=" + text);
        const text2 = await r2.status;
        console.log(text2);

        if (r2.status == 404 ) {
            document.getElementById("ntag2").innerHTML= "尚未建立的ntag";
    
            document.getElementById("status").innerHTML = "";
            document.getElementById("doctor").innerHTML = "";
            document.getElementById("patient_name").innerHTML = "";
            document.getElementById("medical_record_number").innerHTML = "";
            document.getElementById("work_order_number").innerHTML = "";
            document.getElementById("send_date").innerHTML = "";
            document.getElementById("receive_date").innerHTML = "";
            document.getElementById("return_date").innerHTML = "";            
        }
        else {
            const r3 = await fetch("/api/teeth_models?ntag=" + text);
            const text3 = await r3.json();
            console.log(r3.status);

            if (r3.status == 404 ) {
                document.getElementById("ntag2").innerHTML= "尚未建立的牙模";
    
                document.getElementById("status").innerHTML = "";
                document.getElementById("doctor").innerHTML = "";
                document.getElementById("patient_name").innerHTML = "";
                document.getElementById("medical_record_number").innerHTML = "";
                document.getElementById("work_order_number").innerHTML = "";
                document.getElementById("send_date").innerHTML = "";
                document.getElementById("receive_date").innerHTML = "";
                document.getElementById("return_date").innerHTML = "";           
            }
            else {
                document.getElementById("ntag2").innerHTML= "已建立的牙模";

                let { status } = text3[0];
                const { send_date } = text3[0];
                const { doctor } = text3[0];
                const { patient } = text3[0];
                const { medical_record_number } = text3[0];
                const { work_order_number } = text3[0];
                const { receive_date } = text3[0];
                const { return_date } = text3[0];
                const { id } = text3[0];
                const teeth_model_id = id;

                if(status == null){
                    document.getElementById("status").innerHTML = "";
                }
                else{
                    document.getElementById("status").innerHTML = `${status}`;
                }
                if(doctor == null){
                    document.getElementById("doctor").innerHTML = "";
                }
                else{
                    document.getElementById("doctor").innerHTML = `${doctor}`;
                }
                if(patient == null){
                    document.getElementById("patient_name").innerHTML = "";
                }
                else{
                    document.getElementById("patient_name").innerHTML = `${patient}`;
                }
                if(patient == null){
                    document.getElementById("medical_record_number").innerHTML = "";
                }
                else{
                    document.getElementById("medical_record_number").innerHTML = `${medical_record_number}`;
                }
                if(patient == null){
                    document.getElementById("work_order_number").innerHTML = "";
                }
                else{
                    document.getElementById("work_order_number").innerHTML = `${work_order_number}`;
                }
                if(send_date == null){
                    document.getElementById("send_date").innerHTML = "";
                }
                else{
                    document.getElementById("send_date").innerHTML = `${send_date}`;
                }
                if(receive_date == null){
                    document.getElementById("receive_date").innerHTML = "";
                }
                else{
                    document.getElementById("receive_date").innerHTML = `${receive_date}`;
                }
                if(return_date == null){
                    document.getElementById("return_date").innerHTML = "";
                }
                else{
                    document.getElementById("return_date").innerHTML = `${return_date}`;
                }

                const r4 = await fetch("/api/teeth_models/" + teeth_model_id + "/receive",{
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token
                    },
                    body: JSON.stringify({
                        hospital_branch: branch,
                        step: step
                    })
                });
                const text4 = await r4.json();
                console.log(text4);
                document.getElementById("ntag2").innerHTML = "成功接收牙模";

                const r5 = await fetch("/api/teeth_models/" + teeth_model_id +"/transfer_records");
                const text5 = await r5.json();
                console.log(text5);
                var tbody = document.querySelector('.tbody2')
                tbody.innerHTML="";
                for(var i = 0 ; i < text5.length ; i++){
                    var tr = document.createElement("tr");
                    tbody.appendChild(tr);

                    var td = document.createElement("td");
                    const { action } = text5[i];
                    td.innerText = `${action}`;
                    tr.appendChild(td);

                    var td = document.createElement("td");
                    const { date } = text5[i];
                    td.innerText = `${date}`;
                    tr.appendChild(td);

                    var td = document.createElement("td");
                    const { hospital_branch } = text5[i];
                    td.innerText = `${hospital_branch}`;
                    tr.appendChild(td);

                    var td = document.createElement("td");
                    const { step } = text5[i];
                    if(`${step}` == "null"){
                        td.innerHTML  = "";
                        tr.appendChild(td);
                    }
                    else{
                        td.innerText = `${step}`;
                        tr.appendChild(td);            
                    }

                    var td = document.createElement("td");
                    const { transactor } = text5[i];
                    td.innerText = `${transactor}`;
                    tr.appendChild(td);
                }
            }
        }
    }     
}