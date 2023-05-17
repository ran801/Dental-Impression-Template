const nTag_scan = async () => {
    const r = await fetch("http://127.0.0.1:20000/uid");
    const text = await r.text();
    console.log(text);
    const token = "Bearer " + localStorage.getItem("token")

    document.getElementById("ntag").innerHTML= text;
    var tbody = document.querySelector('tbody')
    tbody.innerHTML="";

    if (r.status == 404) {
        document.getElementById("ntag2").innerHTML= "掃描失敗";
    }
    else {
        const r2 = await fetch("/api/ntags?uid=" + text);
        const text2 = await r2.status;
        console.log(text2);
        
        if(r2.status == 404){
            const r3 = await fetch("/api/ntags",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                },
                body: JSON.stringify({
                    uid: text
                })
            });
            const text3 = await r3.text();
            console.log(text3);
            document.getElementById("ntag2").innerHTML= "建立新的ntag";

            const r5 = await fetch("/api/teeth_models",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                },
                body: JSON.stringify({
                    ntag: text
                })
            });
            const text5 = await r5.text();
            console.log(text5);
            document.getElementById("ntag2").innerHTML = "完成牙模建立";
        }
        else{
            const r4 = await fetch("/api/teeth_models?ntag=" + text);
            const text4 = await r4.status;
            console.log(text4);

            if(r4.status == 404){
                const r5 = await fetch("/api/teeth_models",{
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token
                    },
                    body: JSON.stringify({
                        ntag: text
                    })
                });
                const text5 = await r5.text();
                console.log(text5);
                document.getElementById("ntag2").innerHTML = "完成牙模建立";
            }
            else{
                const text5 = await r4.json();
                console.log(text5);
                document.getElementById("ntag2").innerHTML = "已建立的牙模";
                const { id } = text5[0];
                const r6 = await fetch("/api/teeth_models/" + id +"/transfer_records");
                const text6 = await r6.json();
                console.log(text6);
                var tbody = document.querySelector('tbody')
                for(var i = 0 ; i < text6.length ; i++){
                    var tr = document.createElement('tr');
                    tbody.appendChild(tr);

                    var td = document.createElement("td");
                    const { action } = text6[i];
                    td.innerText = `${action}`;
                    tr.appendChild(td);

                    var td = document.createElement("td");
                    const { date } = text6[i];
                    td.innerText = `${date}`;
                    tr.appendChild(td);

                    var td = document.createElement("td");
                    const { hospital_branch } = text6[i];
                    td.innerText = `${hospital_branch}`;
                    tr.appendChild(td);

                    var td = document.createElement("td");
                    const { step } = text6[i];
                    if(`${step}` == "null"){
                        td.innerHTML  = "";
                        tr.appendChild(td);
                    }
                    else{
                        td.innerText = `${step}`;
                        tr.appendChild(td);            
                    }

                    var td = document.createElement("td");
                    const { transactor } = text6[i];
                    td.innerText = `${transactor}`;
                    tr.appendChild(td);
                }
            }
        }
    }        
}