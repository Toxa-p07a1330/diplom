let sendCommandToSocket = async (way, tid, command)=>{
    way = "http://localhost:8083/sendCommand"
    let url = way + "?TID="+tid+"&command="+command;
    console.log(url);
    let responce;
    await fetch(url).then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(data, "application/xml");
          //  console.log(xml);
            responce = data;
        })
        .catch(console.error);
    console.log(123)
    return responce;
}
export {sendCommandToSocket}