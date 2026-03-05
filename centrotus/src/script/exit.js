const body = document.body;
let timeoutId = null;
let autoTimeoutId = null;
const popup = document.getElementById("popup");

function hidePopup() {
    if (popup.style.visibility === "visible") {
        console.log("hidepopup");
        const ws = new WebSocket("ws://localhost:1234");

        ws.onmessage = (e) => {
            let {command} = JSON.parse(e.data);
            if (command === "state") {
                console.log("Message reçu du serveur WebSocket, masquage du popup");
                clearTimeout(autoTimeoutId);
                showPopup();
                popup.style.visibility = "hidden";
            }  
        };
    }
}

function goToHomePage() {
    if (popup.style.visibility === "visible") {
        console.log("gotohomepage");
        body.addEventListener('click', () => {
            console.log("Redirection vers la page d'accueil par click");
            clearTimeout(autoTimeoutId);
            window.location.href = "/accueil";
        });
    }
}

function automaticExit() {
    if (popup.style.visibility === "visible") {
        console.log("automaticExit");
        autoTimeoutId = setTimeout(() => {
            console.log("Redirection vers la page d'accueil par expiration du temps");
            window.location.href = "/accueil";
        }, 10000);
    }
}

function showPopup() {
    if (timeoutId !== null) {
        clearTimeout(timeoutId);
    }

    //removeEventListeners(p);
    //removeEventListeners(g);

    timeoutId = setTimeout(() => {
        if (popup) {
            popup.style.visibility = "visible";
            goToHomePage();
            automaticExit();
            hidePopup();

            console.log("Popup affiché, redirection dans 10 secondes...");
        };
    }, 1000);
};

function exit() {
    let p = body.addEventListener('keypress', showPopup);
    let g = body.addEventListener('click', showPopup)
};

showPopup();
exit();