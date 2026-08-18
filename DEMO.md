# Démo publique SwissKnife

Même dépôt que le produit. Même application. Aucun backend, aucun compte, aucun fichier envoyé : la conversion reste dans l’onglet du visiteur (`File` + `blob:`).

C’est le mode **A** (build du dépôt produit), comme AstroGuide. Docker / `npm run dev` ne sont pas en mode démo.

## Ce que le mode démo change

Uniquement au **build Vercel** (`VERCEL=1` ou `VITE_DEMO=true`) :

- balise `robots` `noindex, nofollow` et `robots.txt` qui refuse l’indexation
- titre « SwissKnife — démo publique »
- pastille **Démo** dans l’en-tête
- en-têtes COOP / COEP / CSP (FFmpeg WASM a besoin de `SharedArrayBuffer`)

Le core FFmpeg (`dist/ffmpeg/`, ~32 Mo) est copié au build et servi par la même origine. Premier fichier audio/vidéo : téléchargement du core. Les images (Canvas) ne le chargent pas.

## Déploiement Vercel

1. Projet Vercel **nouveau**, relié au dépôt public `lucas-lepajollec/SwissKnife` (branche `main`).
2. Framework Vite, Node 20+, commande `npm run build`, sortie `dist`.
3. Variable `VITE_DEMO=true` (déjà dans `vercel.json` ; la garder aussi dans les réglages du projet).
4. Valider d’abord l’URL `*.vercel.app`.
5. Ajouter ensuite le domaine `demo.swissknife.lucas-homelab.fr` et coller **exactement** les enregistrements DNS demandés par Vercel.
6. Contrôler : HTTPS `200` sur `/`, `noindex` dans le HTML, `Content-Type: application/wasm` sur `/ffmpeg/ffmpeg-core.wasm`, conversion PNG→JPG et WAV→MP3 dans le navigateur.

Ne pas relier cette URL sur la landing, les docs ou le site mère tant que le contrôle HTTPS `200` n’est pas fait.

## Hors Vercel

```bash
npm run build:demo
npx vite preview --port 2499
```

Docker (`docker-compose.yml` / `docker-compose.build.yml`) reste l’instance auto-hébergée : pas de pastille Démo, pas de `noindex`.
