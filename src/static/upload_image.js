var i = 1;
const get_image = async () => {
    const r = await fetch("http://127.0.0.1:30000/image");
    const text = await r.text();
    console.log(text);

    var div = document.getElementById("SMALL");
    var img = document.createElement("img");
    img.setAttribute("id", "SS" + i++);
    img.src = "http://127.0.0.1:30000" + text;
    div.appendChild(img);
    console.log(img.id);
    img.setAttribute("onclick", "javascript:select(" + img.id + ");");
}
const select = async (j) => {    
    console.log(j.id);
    if (j.style.color == "red") {
        j.style.color = "black";
        var r = document.getElementById("remove");
        r.setAttribute("onclick", null);
    }
    else {
        j.style.color = "red";
        var r = document.getElementById("remove");
        r.setAttribute("onclick", "javascript:remove(" + j.id + ");");
        var r2 = document.getElementById("BIG");
        r2.setAttribute("ondblclick", "javascript:dbclick(" + j.id + ");");
        r2.setAttribute("src", j.src);
    }
}
const dbclick = async (j) => {
    console.log(j.src);
    window.open(j.src, "_blank");
}
const remove = async (k) => {
    var obj = document.getElementById(k.id);
    var imgParent = obj.parentNode;
    imgParent.removeChild(obj);
}
const upload_image = async () => {
    const branchElement = document.getElementById("branch");
    const branch = branchElement.value;
    var text = document.getElementById("ntag").innerText;
    console.log(text);
    const r3 = await fetch("/api/teeth_models?ntag=" + text);
    const text3 = await r3.json();
    console.log(text3);
    const { id } = text3[0];
    console.log(`${id}`);
    const teeth_model_id = id;
    const token = "Bearer " + localStorage.getItem("token")

    const r4 = await fetch("/api/teeth_models/" + teeth_model_id + "/send",{
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify({
            hospital_branch: branch
        })
    });
    const text4 = await r4.json();
    console.log(text4);
    document.getElementById("ntag2").innerHTML = "完成牙模送出";

     
    var n = $('#SMALL').children('img').length;
    console.log(n);
    var image = document.getElementById("SMALL");
    for (var i = 1; i < n + 1; i++) {
        console.log(image.children[i].src.substr(-26));
        const img = image.children[i].src.substr(-26);
        const r5 = await fetch("http://127.0.0.1:30000/uploadImage?teeth_model_id=" + teeth_model_id + "&image=" + img);
        const text5 = await r5.text();
        console.log(text5);
    }
    window.location.reload();
}