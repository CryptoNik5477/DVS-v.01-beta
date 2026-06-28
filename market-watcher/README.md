# Market Watcher — agrégateur d'alertes marché (Phase 1 / MVP)

Application qui agrège en temps quasi-réel des actifs à fort potentiel de
mouvement court terme (crypto, or, pétrole, actions) et qui s'appuie sur des
**agents IA spécialisés** (API Anthropic / Claude) pour détecter, sur le web,
les informations susceptibles de faire bouger les marchés — puis envoie des
**alertes Telegram sourcées**.

> **Ce dépôt = Phase 1 (MVP de veille) livrée de bout en bout.** Module données
> de marché (5 actifs), **1 agent (News financières)** complet, stockage des
> signaux + sources en base, alertes Telegram, **compteur de coût LLM dès le
> départ**, dashboard minimal en lecture seule. **Pas de trading.** Les phases
> 2 à 4 sont décrites en bas mais **pas implémentées** — à valider avant d'avancer.

Ce projet est volontairement isolé dans le sous-dossier `market-watcher/` ; il
n'a aucun lien avec le site vitrine ISSANwebpower à la racine du dépôt.

---

## 1. Architecture — confirmation & ajustements

L'architecture proposée dans le cahier des charges est saine et a été suivie.
Quelques **ajustements/décisions** pris pour la Phase 1 :

| Sujet | Décision | Pourquoi |
|---|---|---|
| Scheduler/workers | **APScheduler** (et non Celery) en Phase 1 | MVP mono-worker : pas de broker à gérer, in-process, plus simple à raisonner. Migration Celery+Redis quand on aura besoin de plusieurs workers (Phase 2+). Redis est déjà câblé dans le compose pour cette suite. |
| Données marché | **Interface `MarketDataProvider`** + CoinGecko (crypto) et Twelve Data/Finnhub (actions/or/pétrole) interchangeables | Conforme à la demande : on bascule vers une offre payante plus tard sans réécrire. |
| Agents | **Classe `Agent` générique** + instance `NewsAgent` | Les agents X / Crypto / Macro (Phase 2) ne seront que des sous-classes avec d'autres sources. |
| Extraction LLM | **Structured outputs** (`output_config.format`) quand le SDK le supporte, **fallback JSON par prompt** sinon | Robuste : signaux toujours structurés `{actif, direction, intensité, confiance, résumé, source}`. |
| Anti-hallucination de source | L'URL stockée est **toujours** celle de l'article réel (le LLM renvoie un `item_index`, jamais une URL) | La source reste cliquable et vérifiable, jamais inventée. |
| Sécurité prompt-injection | Couche `sanitize.py` (strip HTML, neutralise « ignore previous instructions… ») **+** le prompt système traite le contenu comme **donnée non fiable** | Défense en profondeur sur tout contenu scrapé. |
| Scoring | **Pression nette** simple (somme `direction × intensité × confiance` sur 24h) en Phase 1 | La corroboration par volume/prix réel (anti faux-positifs) est explicitement **Phase 2**. |
| Compteur de coût | **Intégré dès le départ** : tokens + coût $ par agent/jour, page « Coûts », alerte budget Telegram + mise en pause auto des agents | Le coût ne doit jamais être une surprise (spec obligatoire). |

### Modules

```
market-watcher/
├── backend/                      # Python 3.12 + FastAPI
│   └── app/
│       ├── config.py             # tout le paramétrage via .env (intervalles, modèles, seuils…)
│       ├── database.py           # SQLAlchemy async (asyncpg)
│       ├── models.py             # Asset, PriceSnapshot, Signal, Alert, LlmCostLog
│       ├── market/               # 1. Données de marché (interface + CoinGecko + TwelveData/Finnhub)
│       ├── agents/               # 2. Agents IA (base générique + NewsAgent + sources RSS)
│       ├── llm/                  # Client Claude (prompt caching + suivi du coût)
│       ├── aggregation/          # 3. Scoring (pression nette)
│       ├── alerts/               # 4. Telegram + moteur d'alertes
│       ├── budget.py             # Garde-fou budget + état pause des agents
│       ├── scheduler.py          # Boucles 24/7 (APScheduler)
│       ├── api/                  # API REST du dashboard (lecture seule + pause/resume)
│       ├── seed.py               # Watchlist par défaut (5 actifs)
│       └── main.py               # App FastAPI (CORS, rate-limit, auth)
├── frontend/                     # 5. Dashboard Next.js + Tailwind (Dashboard / Détail / Alertes / Coûts / Réglages)
├── docker-compose.yml            # Postgres + Redis + backend + frontend
├── .env.example
└── README.md
```

Le **module trading (6)** est volontairement **absent** : il sera ajouté en
Phase 3, isolé et désactivé par défaut.

---

## 2. Ce que fait la Phase 1, concrètement

1. Toutes les `MARKET_POLL_SECONDS` (déf. 120s) : récupère les prix des actifs
   surveillés et stocke un **historique court** (pour détecter plus tard la
   volatilité anormale).
2. Toutes les `NEWS_AGENT_INTERVAL_SECONDS` (déf. 300s) : l'**agent News** lit
   les flux RSS (Reuters, CoinDesk, CoinTelegraph, Yahoo Finance, Investing),
   nettoie le contenu, demande à **Claude Haiku 4.5** d'en extraire des signaux
   structurés, et les **stocke en base avec la source cliquable + horodatage +
   confiance**.
3. Le **moteur d'alertes** déclenche une alerte Telegram quand un signal frais
   dépasse les seuils (`ALERT_MIN_INTENSITY`, `ALERT_MIN_CONFIDENCE`), avec
   **anti-spam** (`ALERT_COOLDOWN_MINUTES`). Chaque alerte est journalisée avec
   le signal qui l'a motivée.
4. Le **compteur de coût** journalise les tokens et le coût $ estimé par agent
   et par jour. Au-delà de `MONTHLY_BUDGET_USD`, une alerte Telegram est envoyée
   et (option) les agents sont mis en pause.
5. Le **dashboard** affiche : actifs + prix + score de pression, détail par
   actif (flux de signaux sourcés), historique des alertes, page Coûts, Réglages.

---

## 3. Lancer en local

### Option A — Docker Compose (recommandé)

Prérequis : Docker + Docker Compose.

```bash
cd market-watcher
cp .env.example .env          # puis éditez .env (au minimum ANTHROPIC_API_KEY)
docker compose up --build
```

- API backend : http://localhost:8000  (doc interactive : http://localhost:8000/docs)
- Dashboard   : http://localhost:3000

La base est créée et la watchlist seedée automatiquement au premier démarrage.

### Option B — Sans Docker (dev)

Backend (nécessite un Postgres + Redis locaux) :

```bash
cd market-watcher/backend
python3.12 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
export $(grep -v '^#' ../.env | xargs)   # ou exportez vos variables manuellement
# DATABASE_URL doit pointer vers votre Postgres local, ex :
# export DATABASE_URL=postgresql+asyncpg://watcher:watcher@localhost:5432/watcher
uvicorn app.main:app --reload
```

Frontend :

```bash
cd market-watcher/frontend
npm install
NEXT_PUBLIC_API_BASE=http://localhost:8000 npm run dev
```

---

## 4. Comptes & clés API à créer (et où les mettre)

Tout se met dans le fichier **`.env`** (jamais commité). Voir `.env.example`.

| Service | Obligatoire ? | Offre gratuite | Où créer | Variable(s) `.env` |
|---|---|---|---|---|
| **Anthropic (Claude)** | ✅ Oui | Pay-as-you-go (votre clé existante) | https://console.anthropic.com → API Keys | `ANTHROPIC_API_KEY` |
| **CoinGecko** | Recommandé | Demo gratuit (10k appels/mois) | https://www.coingecko.com/en/api/pricing → Demo | `COINGECKO_API_KEY` |
| **Twelve Data** *(ou Finnhub)* | Pour or/pétrole/actions | Free (800 appels/jour, différé ~4h) | https://twelvedata.com/pricing | `TWELVEDATA_API_KEY` (et `STOCKS_PROVIDER=twelvedata`) |
| **Finnhub** *(alternative)* | — | Free (60 appels/min) | https://finnhub.io/pricing | `FINNHUB_API_KEY` (et `STOCKS_PROVIDER=finnhub`) |
| **Telegram bot** | Pour recevoir les alertes | Gratuit | Voir ci-dessous | `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` |

> ⚠️ **Votre abonnement Claude Pro ne sert PAS à alimenter les agents** : un
> abonnement chat ne donne pas d'accès API et ne supporte pas des appels
> server-side continus. Les agents utilisent **l'API facturée à l'usage** via
> `ANTHROPIC_API_KEY`. Claude Pro ne couvre que le développement via Claude Code.

> **Aucune clé absente ne casse l'app** : sans clé CoinGecko les appels crypto
> restent possibles (limites plus basses), sans clé actions le module ignore
> simplement or/pétrole, sans Telegram les alertes sont seulement journalisées.
> Seule `ANTHROPIC_API_KEY` est réellement requise pour que l'agent tourne.

### Créer le bot Telegram

1. Sur Telegram, parlez à **@BotFather** → `/newbot` → récupérez le **token** →
   `TELEGRAM_BOT_TOKEN`.
2. Démarrez une conversation avec votre bot (envoyez-lui « hello »).
3. Récupérez votre **chat id** : ouvrez
   `https://api.telegram.org/bot<TOKEN>/getUpdates` dans le navigateur, cherchez
   `"chat":{"id":...}` → `TELEGRAM_CHAT_ID`.

---

## 5. Budget & coûts — base de calcul (recalculable)

Le poste qui pilote la facture est l'**API LLM**. Hypothèse exposée et ajustable :

- **1 agent** (Phase 1), scan toutes les 5 min, 24/7 → ~8 600 appels/mois.
  (Avec 4 agents en Phase 2 → ~35 000 appels/mois.)
- ~3 000 tokens d'entrée + ~500 de sortie par appel.
- **Haiku 4.5 : 1 $ / 5 $ par M tokens (entrée/sortie).**
  → Phase 1 (1 agent) ≈ **(8 600 × 3 000 × 1\$ + 8 600 × 500 × 5\$) / 1e6 ≈
  47 \$/mois** *avant* prompt caching.
  → 4 agents (Phase 2) ≈ **130–190 \$/mois** avant caching ; Sonnet 4.6 pour le
  même volume ≈ 400–550 \$/mois.

### Leviers d'optimisation **implémentés**

- **Prompt caching activé** sur le prompt système (instructions fixes) → l'input
  mis en cache coûte ~0,1× (lecture). *Note : Haiku 4.5 ne met en cache que les
  préfixes ≥ 4096 tokens ; en-dessous, pas de cache — sans erreur, et le coût
  reste journalisé.*
- **Routage par modèle** : Haiku par défaut partout ; Sonnet réservé aux
  synthèses complexes ponctuelles (`SYNTHESIS_LLM_MODEL`, Phase 2).
- **Fréquence & modèle configurables par agent** via `.env`
  (`NEWS_AGENT_INTERVAL_SECONDS`, `NEWS_AGENT_MODEL`) — **levier n°1** : passer
  de 5 à 15 min divise la facture LLM par 3.
- **Compteur de coût** par agent/jour (page « Coûts ») + **alerte de budget**
  Telegram (`MONTHLY_BUDGET_USD`) avec **mise en pause auto** des agents
  (`PAUSE_AGENTS_ON_BUDGET`).

*À venir (Phase 2)* : Batch API (−50%) pour les traitements non temps réel
(synthèses de fin de journée, backtests).

### ⚠️ Le piège de l'API X

L'agent X **n'est pas activé en Phase 1**. Quand il le sera (Phase 2), il passera
**exclusivement par une API tierce** (ex. TwitterAPI.io, ~33× moins cher, sans
plafond), derrière l'interface `Agent` — **jamais l'API X officielle** (≈0,005 \$
par tweet, plafond à ~10 000 \$/mois puis Enterprise).

---

## 6. Sécurité (transverse)

- **Secrets en variables d'environnement** ; `.env` non commité (voir
  `.gitignore`), `.env.example` fourni.
- **Authentification du dashboard** : si `DASHBOARD_API_TOKEN` est défini,
  l'API exige `Authorization: Bearer <token>` (laisser vide en local = ouvert).
- **Rate limiting** sur l'API (`RATE_LIMIT_PER_MINUTE`, slowapi).
- **Validation/sanitisation** de tout contenu web avant passage au LLM
  (`sanitize.py`) + consigne « contenu = donnée non fiable » dans le prompt.

---

## 7. Stack technique

Backend : Python 3.12 · FastAPI · SQLAlchemy async (asyncpg) · APScheduler ·
slowapi · httpx · feedparser · SDK Anthropic.
Données temps réel & files : Redis (câblé, exploité pleinement en Phase 2).
Base de données : PostgreSQL.
Frontend : Next.js (React) + Tailwind.
Alertes : bot Telegram.
Déploiement : Docker Compose (pensé pour tourner en continu sur VPS Ubuntu 24.04).

---

## 8. Feuille de route (NON implémentée — à valider après la Phase 1)

- **Phase 2 — Multi-agents & scoring.** Agents X (via API tierce), Crypto, Macro
  derrière l'interface `Agent` commune ; moteur d'agrégation + score + **corroboration
  par volume/prix réel** (anti faux-positifs) ; dashboard complet.
- **Phase 3 — Module trading en simulation.** Connexion exchange via **ccxt en
  sandbox/paper uniquement**, isolé et désactivé par défaut ; gestion du risque
  (taille position max, perte max/trade, perte max/jour, stop-loss), **kill
  switch**, journal d'audit, mode **backtest** sur l'historique des signaux.
- **Phase 4 — Bascule réelle (LIVE)** *seulement si Phase 3 validée*, derrière
  une confirmation explicite distincte, tous les garde-fous Phase 3 actifs, clés
  exchange côté serveur en lecture+trade **sans droit de retrait**.

> **Je n'avance pas en Phase 2 tant que la Phase 1 n'est pas validée.**
```
