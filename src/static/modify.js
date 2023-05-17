const save = async () => {
    const doctorElement = document.getElementById("doctor");
    const doctor = doctorElement.value;
    const patientElement = document.getElementById("patient");
    const patient = patientElement.value;
    const mrcElement = document.getElementById("medical_record_number");
    const medical_record_number = mrcElement.value;
    const wonElement = document.getElementById("work_order_number");
    const work_order_number = wonElement.value;
    const return_dateElement = document.getElementById("return_date");
    const return_date = return_dateElement.value;
    const teeth_model_idElement = document.getElementById("teeth_model_id");
    const teeth_model_id = teeth_model_idElement.innerText;
    const laboratoryElement = document.getElementById("laboratory");
    const laboratory = laboratoryElement.value;
    const token = "Bearer " + localStorage.getItem("token")
    
    const response = await fetch("/api/teeth_models/" + teeth_model_id,{
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify({
            doctor: doctor,
            patient: patient,
            medical_record_number: medical_record_number,
            work_order_number: work_order_number,
            return_date: return_date,
            laboratory: laboratory
        })
    });
    console.log(response.text());

    document.getElementById("savetext").innerHTML= "記錄儲存成功";
}

const select = async (j) => {    
    console.log(j.id);
    if (j.style.color == "red") {
        j.style.color = "black";
        var r3 = document.getElementById("delete_image");
        r3.removeAttribute("onclick");
    }
    else {
        $("img").each(function(){
            this.style.color = "black";
        });
        j.style.color = "red";
        var r2 = document.getElementById("BIG");
        r2.setAttribute("ondblclick", "javascript:dbclick(" + j.id + ");");
        r2.setAttribute("src", j.src);
        var r3 = document.getElementById("delete_image");
        r3.setAttribute("onclick", "javascript:delete_image(" + j.id + ");");
    }    
}
const dbclick = async (j) => {
    console.log(j.src);
    window.open(j.src, "_blank");
}
const delete_image = async (j) => {
    const teeth_model_idElement = document.getElementById("teeth_model_id");
    const teeth_model_id = teeth_model_idElement.innerText;
    const token = "Bearer " + localStorage.getItem("token")
    console.log(j.id.substr(-32));
    const r = await fetch("/api/teeth_models/" + teeth_model_id + "/images/" + j.id.substr(-32) + ".jpg",{
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        }
    });
    console.log(r.text());
    window.location.reload();
}
