const scan = async () => {
    const r = await fetch("http://127.0.0.1:20000/uid");
    const text = await r.text();
    console.log(text);
    
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

        if (r2.status == 200 ) {
            const r3 = await fetch("/api/teeth_models?ntag=" + text);
            const text4 = await r3.status;
            console.log(text4);

            if (r3.status == 200){
                document.getElementById("ntag2").innerHTML= "已建立的牙模";

                const text3 = await r3.json();
                console.log(text3);
                const { status } = text3[0];
                const { doctor } = text3[0];
                const { patient } = text3[0];
                const { medical_record_number } = text3[0];
                const { work_order_number } = text3[0];
                const { receive_date } = text3[0];
                const { send_date } = text3[0];
                const { return_date } = text3[0];

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
                if(medical_record_number == null){
                    document.getElementById("medical_record_number").innerHTML = "";
                }
                else{
                    document.getElementById("medical_record_number").innerHTML = `${medical_record_number}`;
                }
                if(work_order_number == null){
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
            }
            else {
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
        }
        else {
            document.getElementById("ntag2").innerHTML= "尚未建立ntag";
            document.getElementById("status").innerHTML = "";
            document.getElementById("doctor").innerHTML = "";
            document.getElementById("patient_name").innerHTML = "";
            document.getElementById("medical_record_number").innerHTML = "";
            document.getElementById("work_order_number").innerHTML = "";
            document.getElementById("send_date").innerHTML = "";
            document.getElementById("receive_date").innerHTML = "";
            document.getElementById("return_date").innerHTML = "";
        }
    }    
}

const remove = async () => {
    const r = await fetch("http://127.0.0.1:20000/uid");
    const text = await r.text();
    console.log(text);

    const r3 = await fetch("/api/teeth_models?ntag=" + text);
    const text3 = await r3.json();
    console.log(text3);
    const { id } = text3[0];
    console.log(`${id}`);
    const teeth_model_id = id;
    const token = "Bearer " + localStorage.getItem("token")
    const r4 = await fetch("/api/teeth_models/" + teeth_model_id + "/close",{
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        }
    });
    const text4 = await r4.json();
    console.log(text4);

    document.getElementById("ntag2").innerHTML= "已清除牙模資料";
    document.getElementById("status").innerHTML = "";
    document.getElementById("doctor").innerHTML = "";
    document.getElementById("patient_name").innerHTML = "";
    document.getElementById("medical_record_number").innerHTML = "";
    document.getElementById("work_order_number").innerHTML = "";
    document.getElementById("send_date").innerHTML = "";
    document.getElementById("receive_date").innerHTML = "";
    document.getElementById("return_date").innerHTML = "";
}