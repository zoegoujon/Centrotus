const ws = new WebSocket("ws://localhost:1234");

ws.addEventListener("open", () => {
    ws.send(JSON.stringify({command: "erosion"}));
});

fetch("/src/text/erosion.json")
    .then(response => response.json())
    .then(erosionText => {
        const texts = Object.values(erosionText || {});
        if (!texts.length) return;

        const p = document.createElement("p");
        p.id = "erosion-text";
        document.body.appendChild(p);

        let index = 0;

        function showNext() {
            if (index < texts.length) {
                p.textContent = texts[index];
                document.body.style.backgroundImage = `url('/src/img/erosion${index + 1}.jpeg')`;
                console.log(texts[index]);
                index += 1;
            } else {
                document.body.removeChild(p);
                document.body.style.backgroundImage = 'none';
                window.location.href = "/transition";
            }
        }

        showNext();

        document.addEventListener("keydown", showNext);

        document.addEventListener("click", showNext);
    })
    .catch(err => console.error("Erreur chargement JSON :", err));
