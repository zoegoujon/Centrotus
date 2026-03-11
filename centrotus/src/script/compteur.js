const compteurText = document.getElementById("compteur-text");
const ws = new WebSocket("ws://localhost:1234");

ws.onmessage = (e) => {
    let {command, data} = JSON.parse(e.data);
    if (command === "production") {
        console.log("Message reçu du serveur WebSocket pour le compteur:", data);
        if (compteurText) {
            compteurText.textContent = data.toFixed(2);
        }
    }
};

ws.addEventListener("open", (e) => {
    let {command, data} = JSON.parse(e.data);
    if (command === "production" && data!==compteurText.textContent) {
        console.log("Message reçu du serveur WebSocket pour le compteur:", data);
        if (compteurText) {
            compteurText.textContent = data.toFixed(2);
        }
    }
});