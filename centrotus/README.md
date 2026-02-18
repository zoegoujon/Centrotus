# Centrotus — README (Version 1)

Bienvenue — ceci est une première version du README pour le projet `centrotus`.
Le but de ce document est d'expliquer, simplement et sans jargon, où se trouvent les fichiers et qui fait quoi.

## But du projet
- C'est un petit site web/prototype. Il contient des pages HTML, des styles (CSS) et des scripts (JavaScript).

## Comment voir le projet (rapidement)
1. Option simple : ouvrez le fichier `src/pages/accueil.html` dans votre navigateur (double-clic ou glisser-déposer dans une fenêtre de navigateur).
2. Option développeur : depuis le dossier `centrotus`, installez les dépendances et lancez le serveur si besoin :

   npm install
   npm start  (ou `node main.js` si aucun script `start` n'est défini)

Si vous n'êtes pas familier avec `npm`, la première option (ouvrir le HTML) est suffisante pour voir la plupart des pages.

## Arborescence et rôle des fichiers (explication simple)

- `main.js` (racine) : possible point d'entrée / serveur (si le projet utilise Node.js pour servir le site).
- `package.json` : fichier de configuration contenant les dépendances et les scripts (utile pour lancer le projet avec `npm`).
- `nodemon.json` : configuration pour redémarrer automatiquement le serveur en développement (optionnel).
- `public/` : dossier pour les ressources publiques (images, polices, fichiers accessibles directement).

- `src/` : dossier principal du site
  - `src/pages/` : pages HTML du site
    - `accueil.html` : page d'accueil
    - `erosion.html`, `modules.html`, `transition.html` : autres pages du site
  - `src/script/` : scripts JavaScript qui ajoutent des interactions
    - `erosion.js`, `modules.js` : logique liée aux pages correspondantes
  - `src/styles/` : fichiers CSS qui contrôlent l'apparence
    - `accueil.css`, `transition.css` : styles pour les pages
  - `src/main.js` : script côté client (si présent) — peut contenir du code commun à plusieurs pages

## Qui fait quoi (rôles des fichiers — version non technique)
- Les fichiers HTML (`src/pages/*.html`) : contiennent le contenu et la structure des pages (titres, textes, sections).
- Les fichiers CSS (`src/styles/*.css`) : définissent l'apparence (couleurs, taille du texte, mise en page).
- Les fichiers JavaScript (`src/script/*.js` et `src/main.js`) : ajoutent des comportements (animations, interactions, boutons cliquables).
- Le dossier `public/` : regroupe les images ou autres fichiers statiques utilisés par le site.
- `main.js` et `package.json` à la racine : servent à exécuter ou déployer le projet si on utilise Node.js.

## Tester / modifier (conseils simples)
- Pour modifier du contenu visible : éditez les fichiers dans `src/pages/` (HTML) ou `src/styles/` (CSS), puis rafraîchissez la page dans le navigateur.
- Pour modifier le comportement : éditez les fichiers dans `src/script/` (JavaScript).
- Sauvegardez, puis rafraîchissez la page pour voir les changements.