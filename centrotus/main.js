const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;

const root = __dirname;

// Servir les fichiers statiques
app.use(express.static(root));

// Routes pour les pages
app.get(['/', '/accueil'], async (req, res) => {
  try {
    const htmlPath = path.join(root, 'src/pages/accueil.html');
    const html = await fs.readFile(htmlPath, 'utf8');
    res.set('Content-Type', 'text/html');
    res.send(html);
  } catch (err) {
    console.error('Erreur:', err);
    res.status(500).send('Erreur serveur: ' + err.message);
  }
});

app.get('/erosion', async (req, res) => {
  try {
    const htmlPath = path.join(root, 'src/pages/erosion.html');
    const html = await fs.readFile(htmlPath, 'utf8');
    res.set('Content-Type', 'text/html');
    res.send(html);
  } catch (err) {
    console.error('Erreur:', err);
    res.status(500).send('Erreur serveur: ' + err.message);
  }
});

app.get('/modules', async (req, res) => {
  try {
    const htmlPath = path.join(root, 'src/pages/modules.html');
    const html = await fs.readFile(htmlPath, 'utf8');
    res.set('Content-Type', 'text/html');
    res.send(html);
  } catch (err) {
    console.error('Erreur:', err);
    res.status(500).send('Erreur serveur: ' + err.message);
  }
});

app.get('/transition', async (req, res) => {
  try {
    const htmlPath = path.join(root, 'src/pages/transition.html');
    const html = await fs.readFile(htmlPath, 'utf8');
    res.set('Content-Type', 'text/html');
    res.send(html);
  } catch (err) {
    console.error('Erreur:', err);
    res.status(500).send('Erreur serveur: ' + err.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

app.export = app;