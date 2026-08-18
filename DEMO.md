# Démo publique SwissKnife

**Oui : tu peux lier ce dépôt à Vercel.** C’est une SPA statique (pas de backend, pas de secret). Import GitHub, pas `vercel` depuis un dossier qui contient `node_modules`.

Même dépôt que le produit. Les fichiers du visiteur restent dans l’onglet (`File` + `blob:`). Mode **A**, comme AstroGuide.

Ne pas annoncer `https://demo.swissknife.lucas-homelab.fr` tant que le contrôle HTTPS `200` n’est pas fait.

## Pourquoi Vercel accepte

| Point | Mesure |
|---|---|
| Source Git | ~quelques Mo (le WASM n’est pas dans Git) |
| `@ffmpeg/core.wasm` | ~32 Mo, **produit au build**, servi en fichier statique |
| Limite Hobby « Static File uploads 100 Mo » | S’applique à l’upload **CLI**, pas au `npm ci` + `dist/` d’un projet Git |
| Sortie de build | Pas de plafond Vercel documenté pour les fichiers générés |
| Fonction serverless | Aucune : `outputDirectory` = `dist` |
| Compte Hobby | OK si le repo GitHub est un **compte perso** (`lucas-lepajollec/...`). Un repo d’**organisation** GitHub exige un team Vercel Pro |

## Réglages du projet Vercel

1. **Add New Project** → importer `lucas-lepajollec/SwissKnife` (public, branche `main`).
2. Framework **Vite**, Root Directory `.` (laisser vide).
3. Build `npm run build:demo`, Output `dist`, Install `npm ci` (déjà dans `vercel.json`).
4. Node **20+** (`engines` du `package.json`).
5. Variable `VITE_DEMO=true` (déjà dans `vercel.json` ; le plugin s’active aussi avec `VERCEL=1`).
6. **Désactiver** Vercel Authentication / Password Protection (sinon la démo n’est pas publique).
7. Déployer, valider l’URL `*.vercel.app` :
   - `/` → HTML `200`, titre « démo publique », `noindex`
   - `/robots.txt` → `Disallow: /`
   - `/ffmpeg/ffmpeg-core.wasm` → `200`, `Content-Type: application/wasm` (~32 Mo)
   - conversion PNG→JPG (Canvas) et WAV→MP3 (WASM) dans le navigateur
8. Ajouter le domaine `demo.swissknife.lucas-homelab.fr` et coller **exactement** les DNS Vercel chez Hostinger.
9. Rechecker HTTPS `200` sur le domaine custom, puis seulement relier landing / docs / site mère.

## Ce que le mode démo change

Uniquement au build Vercel / `npm run build:demo` :

- `robots` `noindex, nofollow`, `X-Robots-Tag`, `robots.txt`
- titre « SwissKnife — démo publique »
- pastille **Démo** dans l’en-tête
- en-têtes COOP / COEP / CSP (FFmpeg WASM a besoin de `SharedArrayBuffer`)

Le core FFmpeg est servi par la même origine (`/ffmpeg/`). Premier fichier audio/vidéo : téléchargement du core. Les images (Canvas) ne le chargent pas.

## Hors Vercel

```bash
npm run build:demo
npx vite preview --port 2499
```

Docker (`docker-compose.yml` / `docker-compose.build.yml`) reste l’instance auto-hébergée : pas de pastille Démo, pas de `noindex`.
