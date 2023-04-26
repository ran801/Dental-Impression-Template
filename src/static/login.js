const login = async () => {
    const usernameElement = document.getElementById("username");
    const username = usernameElement.value;
    const passwordElement = document.getElementById("password");
    const password = passwordElement.value;
    const response = await fetch("/api/users/login",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            password: password,
            username: username
        })
    });
    console.log(response.status); // Will show you the status
    if (response.status == 200) {
        const r = await response.json();
        const { token } = r;
        const { fullname } = r;
        console.log(token);
        localStorage.setItem("token", token);

        document.cookie = "isLogin=true; max-age=86400 ; path=/";
        document.cookie = `fullname=${fullname}; max-age=86400 ; path=/`;

        Swal.fire("登入成功");
        var el = document.getElementById("login");
        el.innerHTML = `<h1 align="center" style="position: relative;top: 300px">${fullname} 您好!</h1>
        <input type="button" value="登出" class="btn2" onclick="logout()">`;
        var user = document.getElementById("user");
        user.innerHTML = fullname;
    }
    else {
        Swal.fire("帳號或密碼錯誤");
    }
}

const logout = async () => {
    document.cookie = "isLogin=true; max-age=0 ; path=/";
    document.cookie = `fullname=0; max-age=0 ; path=/`;
    localStorage.removeItem("token");
    window.location.reload();
}