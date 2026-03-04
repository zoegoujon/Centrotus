import text from "/src/text/modules.json" with { type: "json" };

const modules = [
    { key: "oursins", label: "Poids oursins", description: text.oursins },
    { key: "algues", label: "Algues en PVDF", description: text.algues },
    { key: "flotteurs", label: "Flotteurs", description: text.flotteurs }
];

function displayLastModuleDescription(latestChange) {
    const descriptionElement = document.getElementById("module-description");
    if (!descriptionElement) return;
    
    if (latestChange) {
        descriptionElement.textContent = latestChange.description;
    } else {
        descriptionElement.textContent = "";
    }
}

function update(shouldShow) {
    let latestChange;
    modules.forEach(module => {
        const element = document.getElementById(module.key);
        if (element) {
            const isVisible = shouldShow(module);
            const oldVisibility = element.style.visibility;
            element.style.visibility = isVisible ? "visible" : "hidden";
            if (oldVisibility != element.style.visibility) latestChange = module;
        }
    });
    console.log(latestChange);

    // Afficher la description du dernier module
    displayLastModuleDescription(latestChange);

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
            if (data & Math.pow(2, i)) used.push(modules[i].key);
        }
        update(m => used.includes(m.key));
    }
};