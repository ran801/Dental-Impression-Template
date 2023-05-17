const create = async () => {
    const r = await fetch("http://127.0.0.1:20000/uid");
    const text = await r.text();
    const response = await fetch("/api/teeth_models",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ntag: text
        })
    });
    const text2 = await response.text();
    console.log(text2);
}