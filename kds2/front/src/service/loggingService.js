let sendLogToBack = async (way, level, message)=>{
    try {
        fetch(way, {
            method: "POST",
            body: JSON.stringify({
                user: document.getElementById("current_user_login").innerText,
                level: level,
                message: message
            }),
            headers: {
                "Content-Type": "application/json",
                "accept": "application/json",
            }
        })
    }
    catch (e){
        console.log(e)
    }
}
export {sendLogToBack}