# ISSANwebpower — site vitrine

Site vitrine statique pour **ISSANwebpower** — un spécialiste basé à Kham Pa Lai,
Mukdahan (Isan, Thaïlande) qui aide les commerces locaux à gagner en visibilité
en ligne et développe des outils internes sur mesure.

Concept visuel : **fusion Isan × web** — un Naga du Mékong dessiné en lignes de
circuit / flux de données lumineux comme élément signature du hero.

## Stack

- HTML / CSS / JS purs — aucun build, aucune dépendance.
- Bilingue **thaï (par défaut) / anglais** avec sélecteur de langue (mémorisé).
- Mobile-first, animations sobres, `prefers-reduced-motion` respecté.

```
index.html
assets/
  css/style.css
  js/main.js
  img/favicon.svg
netlify.toml
```

## Lancer en local

Ouvre simplement `index.html` dans un navigateur, ou sers le dossier :

```bash
python3 -m http.server 8000
# puis http://localhost:8000
```

> En local, le formulaire affiche le message de confirmation mais **n'envoie pas
> d'email** : l'envoi réel se fait une fois déployé (voir ci-dessous).

---

## Le formulaire « Étude gratuite » — comment ça marche

Le formulaire envoie les réponses à **issanwebpower@yahoo.com**.

### Choix retenu : Netlify Forms (recommandé)

Pourquoi : **zéro backend**, anti-spam intégré (honeypot déjà en place), et
**notifications email** configurables en 2 clics. Le formulaire est déjà prêt
(`data-netlify="true"` + champ caché `form-name`).

**Après le déploiement sur Netlify :**

1. Netlify détecte automatiquement le formulaire `free-study` au premier deploy.
2. Va dans **Site settings → Forms → Form notifications → Add notification →
   Email notification**.
3. Mets l'adresse **issanwebpower@yahoo.com** comme destinataire. Valide.
4. Fais un test depuis le site en ligne : la réponse arrive dans
   **Forms → free-study** ET par email.

### Repli : Formspree (si tu déploies ailleurs que Netlify)

Si tu déploies sur Cloudflare Pages / GitHub Pages / un autre hébergeur,
Netlify Forms ne fonctionne pas. Bascule alors sur **Formspree** :

1. Crée un compte sur https://formspree.io avec **issanwebpower@yahoo.com**,
   crée un formulaire, récupère ton endpoint (ex. `https://formspree.io/f/abcdwxyz`).
2. Dans `index.html`, sur la balise `<form class="study__form" …>` :
   - remplace `action="#study-success"` par ton endpoint Formspree :
     `action="https://formspree.io/f/XXXXXXX" method="POST"`
   - supprime `data-netlify="true"` et `netlify-honeypot="bot-field"`
     (tu peux garder le honeypot, Formspree l'ignore).
3. Dans `assets/js/main.js`, dans `initStudyForm()`, remplace l'URL du `fetch`
   `fetch("/", …)` par `fetch(form.action, { method:"POST",
   headers:{ "Accept":"application/json" }, body: new FormData(form) })`.

---

## Déploiement

### Option A — Netlify (recommandé, formulaire inclus)

**Le plus simple (glisser-déposer) :**
1. Va sur https://app.netlify.com/drop
2. Glisse le dossier du projet → URL en ligne immédiate
   (ex. `https://issanwebpower.netlify.app`).
3. Configure la notification email du formulaire (voir plus haut).

**Via Git (déploiement continu) :**
1. Sur Netlify : **Add new site → Import an existing project → GitHub**.
2. Choisis ce dépôt. Build command : *(vide)*, Publish directory : `.`.
3. Deploy. Chaque `git push` redéploiera le site.
4. (Optionnel) **Domain settings** pour un nom de domaine perso.

### Option A bis — Netlify via GitHub Actions (token en secret, jamais en clair)

Un workflow est fourni : `.github/workflows/deploy-netlify.yml`. Il déploie en
production à chaque push sur `main` (et au déclenchement manuel).

1. Crée un site Netlify une première fois (drag&drop ou import) pour obtenir son
   **Site ID** (*Site settings → General → Site ID*).
2. Dépôt GitHub → **Settings → Secrets and variables → Actions** → ajoute :
   - `NETLIFY_AUTH_TOKEN` = un Personal Access Token Netlify
   - `NETLIFY_SITE_ID` = l'ID du site
3. Push sur `main` → le site se déploie automatiquement.

> N'utilise **qu'une seule** méthode (UI connect *ou* ce workflow) pour éviter
> les déploiements en double.

### Option B — Cloudflare Pages

1. Cloudflare → **Workers & Pages → Create → Pages → Connect to Git**.
2. Build command : *(vide)*, Output directory : `.`.
3. Déploie. ⚠️ Bascule le formulaire sur **Formspree** (Netlify Forms ne marche
   pas ici).

---

## Personnalisation rapide

- **Couleurs** : variables CSS en haut de `assets/css/style.css` (`:root`).
- **Textes / traductions** : objet `I18N` dans `assets/js/main.js`.
- **Coordonnées** : LINE `@albeny254`, tél `+66 83 919 2903`,
  email `issanwebpower@yahoo.com` — dans la section `#contact` de `index.html`.
