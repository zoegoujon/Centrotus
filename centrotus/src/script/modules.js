const modules = [
    { key: "flotteurs", label: "Flotteurs" },
    { key: "algues", label: "Algues en PVDF" },
    { key: "oursin", label: "Poids oursins" }
];

function update(shouldShow) {
    modules.forEach(module => {
        const element = document.getElementById(module.key);
        if (element) {
            element.style.visibility = shouldShow(module) ? "visible" : "hidden";
        }
    });

    // Afficher "Aucun module" si aucun n'est sélectionné
    const hasAnyModule = modules.some(shouldShow);
    const voidElement = document.getElementById("void");
    if (voidElement) {
        voidElement.style.visibility = hasAnyModule ? "hidden" : "visible";
    }
}

function initializeModules() {
    const boutons = document.getElementById("menu-boutons");

    if (!boutons) {
        console.error("Élément DOM 'menu-boutons' introuvable");
        return;
    }


    // Créer les boutons de menu
    modules.forEach(module => {
        const li = document.createElement("li");
        const button = document.createElement("button");
        button.textContent = module.label;
        const a = document.createElement("a");

        if (window.location.href.includes("+" + module.key)) {
            a.href = window.location.href.replace("+" + module.key, "");
        } else if (window.location.href.includes(module.key)) {
            a.href = window.location.href.replace(module.key, "");
        } else {
            a.href = window.location.href + "+" + module.key;
        }

        a.appendChild(button);
        li.appendChild(a);
        boutons.appendChild(li);
    });

    // Afficher/masquer les modules
    update((m) => window.location.href.includes(m.key));

    console.log("Modules initialisés. URL actuelle:", window.location.href);
}

initializeModules();

const ws = new WebSocket("ws://localhost:1234");


ws.onmessage = (e) => {
    let {command, data} = JSON.parse(e.data);
    if (command === "state") {
        let used = [];
        for (let i = 0; i < modules.length; i ++) {
            if (data & Math.pow(2, i)) used.append(modules[i].key);
        }
        update(m => used.includes(m.key));
    }
};