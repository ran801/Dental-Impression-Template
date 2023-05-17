const rigister = async () => {
    const nameElement = document.getElementById("name");
    const name = nameElement.value;
    const usernameElement = document.getElementById("username");
    const username = usernameElement.value;
    const passwordElement = document.getElementById("password");
    const password = passwordElement.value;
    const token = "Bearer " + localStorage.getItem("token")
    Swal.fire({
        title: "你的姓名是: " + name + "\n人事號是: " + username,
        showCancelButton: true
    }).then(async(result) => {
        if (result.isConfirmed) {
            const r = await fetch("/api/users",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                },
                body: JSON.stringify({
                    "fullname": name,
                    "password": password,
                    "role": "admin",
                    "username": username
                })
            });
            const text = await r.json();
            console.log(text);
            if(r.status == 200){
                Swal.fire("註冊成功");
            }
            else{
                Swal.fire("你的人事號已註冊");
            }            
        }        
    });
}