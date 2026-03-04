fetch("/src/text/erosion.json")
    .then(response => response.json())
    .then(erosionText => {
        const texts = Object.values(erosionText || {});
        if (!texts.length) return;

        const p = document.createElement("p");
        p.id = "erosion-text";
        document.body.appendChild(p);

        const initialDelay = 2000; 
        const displayDuration = 10000; 
        const gapBetween = 500;

        let index = 0;

        function showNext() {
            p.textContent = texts[index];
            console.log(texts[index]);

            // After displayDuration, hide and move to next
            setTimeout(() => {
                p.textContent = "";
                index += 1;
                if (index < texts.length) {
                    setTimeout(showNext, gapBetween);
                } else {
                    // All shown: remove element (or keep as empty)
                    document.body.removeChild(p);
                    // Optionally navigate to next page:
                    // window.location.href = "/transition";
                }
            }, displayDuration);
        }

        setTimeout(showNext, initialDelay);
    })
    .then(setTimeout(() => {
        window.location.href = "/transition";
    }, 2000 + 10000 * 4 + 500 * 3))
    .catch(err => console.error("Erreur chargement JSON :", err));
