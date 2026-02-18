const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;

const root = __dirname;

app.use(express.static(root));

async function renderWithFragment(res, fragmentRelPath) {
  try {
    const indexPath = path.join(root, 'index.html');
    const fragmentPath = path.join(root, fragmentRelPath);
    const [indexHtml, fragmentHtml] = await Promise.all([
      fs.readFile(indexPath, 'utf8'),
      fs.readFile(fragmentPath, 'utf8').catch(() => '<p>Page introuvable.</p>')
    ]);

    const rendered = indexHtml.replace('<div id="app"></div>', ` <div id="app">${fragmentHtml}</div>`);
    res.set('Content-Type', 'text/html');
    res.send(rendered);
  } catch (err) {
    res.status(500).send('Erreur serveur');
  }
}

app.get(['/', '/accueil'], (req, res) => renderWithFragment(res, 'src/pages/accueil.html'));
app.get('/erosion', (req, res) => renderWithFragment(res, 'src/pages/erosion.html'));
app.get('/modules', (req, res) => renderWithFragment(res, 'src/pages/modules.html'));
app.get('/transition', (req, res) => renderWithFragment(res, 'src/pages/transition.html'));

// Fallback: serve index.html for other unknown routes (SPA-friendly)
app.get('*', async (req, res) => {
  const indexPath = path.join(root, 'index.html');
  try {
    const indexHtml = await fs.readFile(indexPath, 'utf8');
    res.set('Content-Type', 'text/html');
    res.send(indexHtml);
  } catch (err) {
    res.status(500).send('Erreur serveur');
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});