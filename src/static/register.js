const rigister = async () => {
    const nameElement = document.getElementById("name");
    const name = nameElement.value;
    const usernameElement = document.getElementById("username");
    const username = usernameElement.value;
    Swal.fire({
        title: "你的姓名是: " + name + "\n人事號是: " + username,
        showCancelButton: true
    }).then(async(result) => {
        if (result.isConfirmed) {
            const r = await fetch("/api/users",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "fullname": name,
                    "role": "doctor",
                    "username": username
                })
            });
            const text = await r.json();
            console.log(text);
            if(r.status == 200){
                const { token } = text;
                const Authorization = "Bearer " + token;
                const r2 = await fetch("/api/notify",{
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": Authorization
                    }
                });
                const text2 = await r2.json();
                console.log(text2);
                const { url } = text2;
                window.location.replace(url);
            }
            else{
                Swal.fire("你的人事號已註冊");
            }            
        }        
    });
}