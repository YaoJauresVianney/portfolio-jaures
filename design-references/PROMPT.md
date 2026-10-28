# Prompt pour Claude Code — Portfolio de Jaurès (Next.js)

> Colle tout ce qui suit dans Claude Code, à la racine d'un dossier vide.
> Place à côté le dossier `design-reference/` fourni (`desktop.html` et `mobile.html`).

---

## 0. Rôle et objectif

Tu es un développeur front-end senior, spécialiste des sites à défilement scénarisé (« scrollytelling »).
Tu développes la page d'accueil du portfolio de **Jaurès**, développeur fullstack freelance et chef de projet IT basé à Abidjan.

La page est déjà entièrement conçue. Tu dois la **reproduire fidèlement** en Next.js, au pixel et à l'effet près, puis la rendre prête pour la production et la mise en ligne sur Vercel.

**Le principe :** la page se comporte comme une vidéo pilotée par le scroll.
- Chaque section est une scène fixée à l'écran.
- Ses éléments s'animent en fonction de la position de défilement, de façon réversible (on remonte, ça se rembobine).
- On passe d'une scène à l'autre par une transition différente à chaque fois.

---

## 1. Fichiers de référence : la source de vérité

- **`design-reference/desktop.html`** : version bureau (≥ 1024 px), thème clair par défaut.
- **`design-reference/mobile.html`** : version téléphone (< 1024 px), thème sombre par défaut.

Ces deux fichiers sont autonomes et jouables dans un navigateur. Ils contiennent :

- les **textes définitifs** de la page. Ne réécris rien et n'invente aucun contenu ;
- les **couleurs, polices, tailles et espacements** exacts, en styles inline et en variables CSS (`.pf-light` / `.pf-dark`) ;
- la **chorégraphie complète**, décrite par des attributs HTML (voir §6.3) ;
- un **moteur d'animation prototype**, la classe `Component`. Il sert seulement à comprendre les calculs. **Ne le recopie pas** : réimplémente-le avec GSAP (voir §2 et §6).

**Avant de coder :**
1. Ouvre les deux fichiers avec Playwright : desktop en 1440×900, mobile en 390×844.
2. Fais défiler du début à la fin et prends des captures de chaque scène et de chaque transition.
3. Garde ces captures dans `docs/reference-shots/` pour comparer ton rendu au fil du travail.

---

## 2. Stack technique imposée

| Rôle | Outil | Pourquoi |
|---|---|---|
| Framework | **Next.js 16** (dernière 16.x stable avec les correctifs de sécurité), App Router, TypeScript strict, Turbopack | Rendu statique, déploiement Vercel natif |
| UI | **React 19** (fourni par Next 16) | — |
| Styles | **Tailwind CSS v4**, variables CSS dans `@theme` + un fichier `motion.css` pour les transformations 3D complexes | Tailwind fait partie de la stack habituelle de Jaurès ; les formules 3D sont plus lisibles en CSS natif |
| Animation | **GSAP 3.15+** avec **ScrollTrigger**, via **`@gsap/react`** (`useGSAP`) | Standard du scroll animé : pin, scrub, timelines, `matchMedia`. GSAP est entièrement gratuit, plugins inclus, y compris en usage commercial |
| Défilement doux | **Lenis** (`lenis` + `lenis/react`, `ReactLenis`), synchronisé avec ScrollTrigger | Défilement fluide sur ordinateur ; respecte `prefers-reduced-motion` par défaut |
| Polices | **`next/font/google`** : Fraunces (axes `opsz` + `wght`), Manrope | Auto-hébergées, sans décalage de mise en page (CLS) |
| Icônes | **lucide-react** | Icônes au trait, cohérentes avec la maquette |
| Thème | **next-themes** (attribut `data-theme`, pas de flash) | Clair/sombre + préférence système |
| Images | **`next/image`** (AVIF/WebP) | La photo et les futures captures de projets |
| SEO / partage | Metadata API, `opengraph-image.tsx` (`next/og`), `sitemap.ts`, `robots.ts`, JSON-LD `Person` | Le lien sera surtout partagé sur WhatsApp, l'aperçu compte |
| Mesure (optionnel) | `@vercel/analytics`, `@vercel/speed-insights` | — |
| Qualité | ESLint (config flat), Prettier, `tsc --noEmit`, **Playwright** (tests visuels et de mise en page) | Voir §10 |

**À ne PAS utiliser :**

- **three.js / React Three Fiber.** Toute la 3D de la maquette est en transformations CSS : `perspective`, `rotateX`/`rotateY`, `translateZ`, `preserve-3d`, `clip-path`. Un moteur WebGL ajouterait plus de 150 Ko de JavaScript et de la complexité, sans aucun gain visuel ici.
- **Framer Motion / Motion.** Ce serait un doublon de GSAP : une seule librairie d'animation.
- **ScrollSmoother.** Lenis fait ce travail.
- **`locomotive-scroll`, AOS, `react-scroll-parallax`.**
- **Les animations CSS keyframes liées au temps** pour la chorégraphie. Tout est piloté par le scroll, sauf l'intro du hero (§6.4).

**Synchronisation Lenis ↔ ScrollTrigger :**

```ts
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

Sur écran tactile, garde le défilement natif (`syncTouch: false`).

---

## 3. Structure du projet

```
app/
  layout.tsx            // polices, ThemeProvider, ReactLenis, métadonnées
  page.tsx              // assemble les scènes
  opengraph-image.tsx   // image de partage 1200×630, motif kita + nom + accroche
  icon.tsx              // favicon (monogramme provisoire)
  sitemap.ts, robots.ts
components/
  film/FilmProvider.tsx // master timeline GSAP, matchMedia, labels de scènes
  film/fx.ts            // catalogue des effets d'apparition (§6.3)
  layout/Nav.tsx, MobileMenu.tsx, ThemeToggle.tsx
  scenes/Hero.tsx, Cases.tsx, Services.tsx, Stack.tsx, Method.tsx, Contact.tsx
  ui/SplitFlap.tsx, CaseCard.tsx, ServiceCard.tsx, PhotoDiorama.tsx, Patterns.tsx
content/
  site.ts               // TOUT le texte de la page, typé (FR)
styles/
  globals.css           // @import "tailwindcss"; @theme { … tokens … }
  motion.css            // formules 3D et classes d'effets
tests/
  layout.spec.ts, visual.spec.ts
docs/reference-shots/
```

**Règles :**
- Le code et les identifiants sont en anglais ; les textes de l'interface en français, `lang="fr"`.
- Les scènes sont des Server Components. Seul ce qui anime est client (`'use client'`).
- Tout le texte vient de `content/site.ts`, jamais en dur dans les composants.

---

## 4. Design tokens (à reprendre tels quels)

### 4.1 Couleurs

Valeurs exactes dans `.pf-light` / `.pf-dark` des fichiers de référence : `--bg`, `--surface`, `--surface-2`, `--ink`, `--muted`, `--line`, `--terra`, `--terra-strong`, `--terra-ink`, `--ocre`, `--ocre-ink`, `--green`, `--green-text`, `--method-bg`, `--contact-bg`, `--on-dark`, `--on-dark-muted`, `--pat-op`, `--nav-bg`, plus `--backdrop` (le fond visible pendant les transitions 3D).

Expose-les comme tokens Tailwind (`@theme`), basculés par `[data-theme="dark"]`. **Tous les textes ont un contraste ≥ 4,5:1** (3:1 pour les textes ≥ 24 px) dans les deux thèmes. Ne change aucune valeur.

### 4.2 Typographie

- **Fraunces** (empattements, axe optique) pour les titres, en graisse **600**.
  - Exceptions : les numéros 01–04 des études de cas (400) et le logo « Jaurès » (700).
- **Manrope** pour le texte, de 400 à 700.

| Rôle | Desktop | Mobile |
|---|---|---|
| Titre du hero (h1) | `clamp(44px, min(5vw, 7.6vh), 72px)`, interligne 1,04 | `clamp(30px, 9.4cqw, 40px)` |
| Titres de section (h2) | 52 px, interligne ≈ 1,1, `letter-spacing -0.02em` | 30–32 px |
| Noms de projets | 32 px | 24 px |
| Titres de cartes et d'étapes | 24 px | 20 px |
| Numéros des études de cas | 40 px, graisse 400, couleur `--muted` | 28 px |
| Accroche du hero | `clamp(16px, 2.3vh, 20px)` | 16 px |
| Intros de section | 18 px | 16 px |
| Texte courant | 16 px, interligne 1,6 | 15 px, interligne 1,55 |
| Petit texte, badges | 14 px | 12–13 px |
| Surtitres, étiquettes | 13 px, MAJUSCULES, `letter-spacing 0.12em`, graisse 700 | 12 px |

Applique `text-wrap: balance` sur h1 et h2.

### 4.3 Motifs (identité ivoirienne, sans le drapeau)

Trois motifs SVG en `<pattern>`, définis une seule fois (`Patterns.tsx`). Recopie exactement les `<pattern>` des fichiers de référence :

- **kita** : bandes, triangles et carrés, en 96×96 desktop / 72×72 mobile ;
- **losange** : inspiré du pagne ;
- **zigzag** : frises et bords.

Opacité via `--pat-op`. Couleurs : `currentColor`, plus `--ocre` et `--green` en `style`.

---

## 5. Contenu et sections

**Ordre :**
1. Nav fixe ;
2. Hero ;
3. Études de cas (4 projets au format Problème / Solution / Résultat) ;
4. Services (3 cartes) ;
5. Stack (6 technologies) ;
6. Méthode (5 étapes) ;
7. Contact avec bouton WhatsApp ;
8. Pied de page.

Recopie les textes **mot pour mot** depuis les fichiers de référence dans `content/site.ts`.

**Champs provisoires à garder visibles et à centraliser** dans `content/site.ts`, avec un commentaire `// TODO Jaurès` :
- `[Votre photo]` : composant photo prêt à recevoir une image `next/image` ;
- `[N] inscrits` (FODESE) ;
- `[X] % de temps de tri gagné` (Empower CV) ;
- `[Votre disponibilité]` ;
- le numéro WhatsApp : `https://wa.me/225XXXXXXXXXX` → constante `WHATSAPP_NUMBER`.

**Interdit :** inventer des chiffres, des clients, des témoignages ou des logos.

---

## 6. Moteur d'animation (le cœur du travail)

### 6.1 Architecture recommandée

Un **seul conteneur épinglé** (`ScrollTrigger` avec `pin: true`, `scrub: true`) qui contient les six scènes, superposées en `position: absolute; inset: 0`. Une **master timeline GSAP** enchaîne, dans l'ordre et avec des **labels par scène** :

1. l'animation interne de la scène ;
2. une **pause de lecture** ;
3. la transition vers la scène suivante (la scène sortante et la scène entrante s'animent en même temps).

La durée de la timeline s'exprime en « hauteurs d'écran » (1 unité = 100vh de défilement). Fixe `end: () => '+=' + total * innerHeight`, avec `invalidateOnRefresh: true`.

**Navigation :** les liens du menu (`#cas`, `#services`…) font défiler jusqu'au label de la scène, via `labelToScroll` puis `lenis.scrollTo`.

**Accessibilité de la timeline :** au `focusin` dans une scène non visible (navigation clavier), fais défiler jusqu'à son label.

Si l'approche « un seul pin » pose problème (par exemple sur iOS), l'alternative acceptée est **une section par scène** avec un `div` `position: sticky` de 100vh, comme dans le prototype. Elle tient deux règles :
- chaque scène suivante chevauche la précédente de 100vh (`margin-top: -100vh`) ;
- on calcule pour chaque scène son entrée `e`, sa progression `p` et sa sortie `x` (formules dans `_update()` de la référence).

### 6.2 Découpage et durées (en hauteurs d'écran de défilement)

| Scène | Desktop : interne | Mobile : interne | Pause au début / à la fin (part de l'interne) | Transition vers la suivante (1 écran) |
|---|---|---|---|---|
| Hero | 0,8 | 0,6 | — | Caméra qui recule + ouverture en cercle |
| Études de cas | 5,2 | 4,0 | 4 % / 12 % | Cube (rotation vers le haut) |
| Services | 2,0 | 2,4 | 0 / 20 % (mobile 15 %) | Volet horizontal |
| Stack | 1,6 | 1,2 | 0 / 25 % | Écran qui se retourne (carte) |
| Méthode | 2,4 | 2,8 | 0 / 18 % (mobile 15 %) | Balayage en diagonale |
| Contact | 1,8 | 1,6 | 0 / 15 % | — (fin) |

La progression interne `p` est recalculée hors pauses : `p = clamp((brut − début) / (1 − début − fin))`.

### 6.3 Chorégraphie des éléments : lire les attributs `data-*` de la référence

Chaque élément animé de la référence porte :

- **`data-fx="…"`** : l'effet (catalogue ci-dessous).
- **`data-at="a b"`** : la fenêtre d'animation dans la progression de la scène (0 → 1). L'élément s'anime de `t = 0` à `t = 1` entre `a` et `b`.
- **`data-src="e"`** : la fenêtre se lit sur la progression d'**entrée** de la scène (pendant la transition), pas sur sa progression interne.
- **`data-axis="x"`** (cartes des études de cas) : la progression vient de la position horizontale de **la carte qui contient l'élément** : `t_base = clamp((largeurÉcran − gaucheCarte) / (0,55 × largeurÉcran))`.
- **`data-intro="ms"`** : l'élément joue une intro au chargement (délai en ms, durée 1,1 s), indépendante du scroll.
- **`data-rev`** : animation inversée (sortie).
- **`data-ease`** : `out` (par défaut, cubique), `back` (léger rebond) ou `linear`.

**Effets, avec `t` de 0 à 1** (formules exactes dans `.cine [data-fx=…]` des références) :

- `rise` / `drop` : translation verticale + opacité.
- `left` / `right` : translation horizontale + opacité.
- `mask` : `clip-path` depuis le bas + translation.
- `wipe` / `curtain` : `clip-path` de gauche à droite / de droite à gauche.
- `blur` : flou + légère échelle.
- `zoom` : échelle de 0,55 à 1.
- `pop` : échelle de 0 à 1 (souvent avec `back`).
- `flip` / `swing` : `rotateY` / `rotateX` de 80°. Les rotations **s'éloignent toujours du visiteur**, jamais vers lui.
- `spin`, `tilt`, `iris`, `draw`, `fade`.
- Spéciaux : `deal`, `flap`, `domino`, `drawY` (§6.4).

Implémente ce catalogue dans `film/fx.ts` sous forme de fonctions qui ajoutent les tweens à la timeline (`gsap.fromTo`), avec les mêmes fenêtres. Desktop et mobile ont des fenêtres différentes : lis chaque fichier.

### 6.4 Effets signatures, scène par scène

**Hero**
- **Intro au chargement :** chaque élément apparaît avec son propre effet et son délai (`data-intro`).
- **Photo en relief :** trois plans dans un conteneur `perspective` + `preserve-3d` : cadre kita (`translateZ -50px`), photo (`+30px`), carte « Double casquette » (`+90px`). Sur ordinateur uniquement (`(hover: hover) and (pointer: fine)`), l'ensemble s'incline vers la souris jusqu'à 8°, avec amortissement (lerp 0,08).
- **Au scroll :** la photo pivote (`rotateY` jusqu'à −26°, `rotateX` 5°) et recule (`translateZ` −240px). L'effet souris s'atténue en même temps.
- **Transition vers les études de cas :**
  - le hero entier recule (`perspective(1400px) translateZ(−900px × f) rotateX(8° × f)` avec `f = x(2 − x)`, coins arrondis et ombre), vers l'origine 70 % 50 % ;
  - en même temps, la scène suivante s'ouvre en **cercle** (`clip-path: circle(e² × 110% at 70% 50%)`) depuis l'emplacement de la photo.

**Études de cas : carrousel 3D**
- **Défilement :** horizontal, piloté par le scroll vertical. L'intro « Des problèmes concrets… » est à gauche, suivie des 4 cartes (860 px max desktop, pleine largeur mobile).
- **Position finale :** la dernière carte s'arrête **au centre**.
- **Formule par carte :** avec `d` = écart du centre de la carte au centre de l'écran, divisé par une demi-largeur d'écran :
  - `rotateY = signe(d) × 35° × smoothstep(|d|)` ;
  - `translateZ = −230px × smoothstep(min(1, |d|/1,2))` (−160px sur mobile) ;
  - opacité légèrement réduite au-delà de |d| = 0,7.
- **Rendu :** `perspective` partagée sur le conteneur et `preserve-3d` sur la piste. La piste a `pointer-events: none` et les cartes `auto` ; sinon le plan de la piste intercepte la souris.
- **Survol :** desktop uniquement, la carte au premier plan s'incline vers la souris (±7°), d'autant moins qu'elle est loin du centre.
- **Barre de progression** terracotta en bas.

**Transition Études de cas → Services : cube**
- Les deux faces tournent autour d'un axe situé à 50vh derrière l'écran : `perspective(2000px) translateZ(−50vh) rotateX(angle) translateZ(50vh)`.
- La face sortante va de 0° à 90°, l'entrante de −90° à 0°. Aucune déformation au repos.
- Les faces s'assombrissent pendant la rotation, sur un fond `--backdrop`.
- Le titre « Services » apparaît pendant la rotation.

**Services : jeu de cartes**
- **Desktop :** les 3 cartes partent empilées au centre, inclinées (`rotateX` 26°, légère rotation en Z), s'ouvrent en éventail puis se posent chacune à sa place, à plat.
- **Mobile :** même logique en colonne, puis la « caméra » descend jusqu'à la 3ᵉ carte.
- **Ordre de la pile :** la carte de droite au-dessus.
- **Icônes :** elles apparaissent après la pose.
- **Formules :** variable `--k` = −1 / 0 / 1 et phases A/B/C dans la référence.

**Transition Services → Stack :** volet horizontal (`clip-path: inset(0 (1−e)×100% 0 0)`).

**Stack : afficheur à palettes, façon aéroport**
- **Structure :** chaque technologie est un panneau sombre de 4 faces (vide → brouillage 1 → brouillage 2 → nom), chaque face en 2 demi-volets.
- **Animation :**
  - le demi-volet du haut de la face `j` tombe : `rotateX(−90° × clamp(6t − 2j))`, pivot en bas ;
  - le demi-volet du bas de la face `j` arrive : `rotateX(90° × (1 − clamp(6t − 2j + 1)))`, pivot en haut ;
  - `z-index` : haut `10 − j`, bas `1 + j`.
- **Brouillages :** reprends exactement ceux de la référence.
- **Lecteurs d'écran :** le vrai nom est en `sr-only` et l'afficheur en `aria-hidden`.
- **Grille :** 3×2 sur desktop, 2×3 sur mobile.
- **Description :** chaque description apparaît en fondu après son afficheur.

**Transition Stack → Méthode : l'écran se retourne**
- `rotateY` de 0 à 180° pour la Stack, de −180° à 0 pour Méthode, `backface-visibility: hidden`.
- Recul pendant le retournement : `translateZ(e(1−e) × −2000px)`.
- L'en-tête de Méthode apparaît pendant le retournement.

**Méthode : route + dominos**
- **Route :** la frise part posée sur un plan incliné (`rotateX` 58° desktop / 50° mobile, pivot en bas) et se redresse sur la première moitié de la scène.
- **Ligne dorée :** desktop, elle avance à vitesse constante (`linear`) d'une étape à l'autre, en horizontal. Mobile, elle descend en vertical (`drawY`).
- **Dominos :** chaque étape, couchée et invisible, **se redresse quand la ligne l'atteint** (`rotateX` de 86° à 0, pivot en bas, rebond `back`).
- **Alignement :** les titres d'étapes partagent une même rangée (`grid-template-rows: subgrid`), pour que les textes commencent tous à la même hauteur.

**Transition Méthode → Contact :** balayage diagonal (`clip-path: polygon(...)` de la référence).

**Contact**
- Le panneau terracotta apparaît en zoom, le motif kita en rideau.
- Le bouton WhatsApp apparaît en `pop` avec rebond.
- Le bloc d'infos apparaît en `flip`.

### 6.5 Adaptation aux écrans (`gsap.matchMedia`)

- **`(min-width: 1024px)` :** chorégraphie desktop.
- **`(max-width: 1023px)` :** chorégraphie mobile.
  - Mise en page en une colonne, contenu limité à 440 px de large et centré.
  - Pas d'effets souris.
  - Menu burger fonctionnel : `aria-expanded`, fermeture au clic sur un lien ou avec Échap, bouton WhatsApp.
- **`(prefers-reduced-motion: reduce)` :** pas de pin ni de scrub. La page s'affiche en version **statique** et lisible, avec tout le contenu visible. C'est la mise en page « canvas » de la référence, quand la classe `cine` est absente.
- **Hauteur d'écran :**
  - Desktop : si une scène est plus haute que l'écran (hauteur − 136 px), réduis-la proportionnellement (`--fit`).
  - Mobile : réduis au plus jusqu'à 92 %, puis fais défiler la scène vers le bas pendant sa progression (`--ov × --pan`). Voir `_measure()` dans la référence.
- **Redimensionnement :** au `resize` et après le chargement des polices, appelle `ScrollTrigger.refresh()`.

---

## 7. Composants d'interface

- **Nav :**
  - fixe, translucide (`--nav-bg` + `backdrop-blur`), 88 px desktop / 64 px mobile ;
  - logo, liens d'ancre, bouton de thème (soleil/lune), bouton « Parlons projet » (WhatsApp) ;
  - un lien d'évitement « Aller au contenu ».
- **Thème :**
  - clair par défaut sur ordinateur, sombre par défaut sur mobile, sauf si le visiteur a déjà fait un choix (stocké par next-themes) ;
  - respecte `prefers-color-scheme` au premier chargement si tu le juges préférable, mais documente ce choix.
- **Liens WhatsApp :** `https://wa.me/${WHATSAPP_NUMBER}?text=` suivi d'un message pré-rempli encodé : « Bonjour Jaurès, je souhaite discuter d'un projet ».
- **Liste Services :** petits losanges ocre comme puces, en texte gris plus petit que la description.

---

## 8. Accessibilité (non négociable)

- **Structure :** HTML sémantique, un seul `h1`, titres hiérarchisés, `<nav>`, `<main>`, `<footer>`, des `<a href>` et `<button>` réels.
- **Focus :** visible partout (anneau terracotta). Navigation complète au clavier, y compris dans les scènes épinglées (§6.1).
- **Contrastes :** ceux des tokens. Ne descends jamais sous 4,5:1.
- **Animations :** respect de `prefers-reduced-motion` (Lenis et GSAP). Aucun contenu disponible uniquement en animation.
- **Éléments décoratifs** (motifs, ombres, lignes) en `aria-hidden`. Icônes seules avec `aria-label`.
- **Cibles tactiles :** ≥ 44 px.

## 9. Performance

- **Budget :**
  - JavaScript client (première charge, gzip) ≤ 170 Ko ;
  - Lighthouse mobile ≥ 90 en Performance, ≥ 95 en Accessibilité, Bonnes pratiques et SEO ;
  - CLS = 0.
- **Rendu des animations :**
  - n'anime que `transform`, `opacity`, `clip-path` et, ponctuellement, `filter` ;
  - pas de lecture de mise en page dans les boucles : mesure une fois au `refresh` ;
  - `will-change` seulement sur les éléments qui bougent.
- **Polices :** `next/font` avec `subsets: ['latin']` (les accents français sont inclus), `display: 'swap'`, uniquement les graisses utilisées.
- **Images :** `next/image`, `sizes` correct, `priority` uniquement pour la photo du hero.
- **Test réel :** sur un Android d'entrée de gamme (profil « Moto G Power » de Lighthouse, réseau 4G lente). Ce sont des conditions réalistes pour des visiteurs à Abidjan. Si l'animation rame, raccourcis la durée des scènes plutôt que de supprimer des effets.

## 10. Vérifications à automatiser (Playwright)

Écris des tests qui font défiler la page par pas réguliers et vérifient, à chaque position :

1. **Menu :** aucun élément visible (opacité > 0,05) ne passe sous la barre de navigation ni n'est coupé en bas, une fois la scène au repos.
2. **Chevauchements :** aucun élément ne chevauche un autre.
   - Vérifie les cartes du carrousel, les étapes de Méthode et la carte flottante du hero face au texte, avec au moins 25 px d'écart.
   - Ignore les boîtes englobantes pendant les rotations 3D de scène : ce sont des faux positifs.
3. **Contrastes :** tous ≥ 4,5:1 (calcul sur les styles calculés).
4. **Accessibilité :** zéro erreur `axe-core`.
5. **Navigation :** chaque lien du menu amène bien à sa scène.

**Tailles à tester :**
- desktop : 1280×650, 1280×720, 1366×768, 1440×760, 1440×900, 1536×864, 1920×1080 ;
- mobile : 360×780, 375×667, 390×844, 430×932 ;
- les deux thèmes.

**Captures :** compare-les à `docs/reference-shots/`.

## 11. Étapes de livraison

Avance étape par étape. **Après chaque étape :** fais un commit, résume ce qui est fait, ce qui reste et les écarts avec la référence, puis attends ma validation.

1. **Socle :** projet Next.js, tokens, polices, thème, `content/site.ts`, mise en page **statique** complète desktop + mobile (état « sans animation »), accessible et responsive.
2. **Moteur :** Lenis + ScrollTrigger + master timeline, labels, navigation par ancres, `matchMedia`, `reduced-motion`, ajustement à la hauteur d'écran.
3. **Scènes 1–2 :** hero (intro, photo en relief, souris), transition caméra + cercle, carrousel 3D + survol.
4. **Scènes 3–4 :** cube, jeu de cartes, volet, afficheur à palettes.
5. **Scènes 5–6 :** retournement, route + dominos, diagonale, contact.
6. **Mobile :** chorégraphie téléphone complète, menu burger.
7. **Qualité :** tests Playwright du §10, Lighthouse, corrections.
8. **Mise en ligne :**
   - métadonnées, image de partage, favicon, sitemap ;
   - déploiement Vercel (projet, domaine, variables) ;
   - un `README.md` qui explique comment modifier les textes (`content/site.ts`), le numéro WhatsApp, la photo et les durées des scènes.

## 12. Ce qu'il ne faut pas faire

- Modifier les textes, couleurs, tailles ou l'ordre des sections sans me le demander.
- Ajouter des effets qui ne sont pas dans la référence, ou en retirer.
- Ajouter du faux contenu : chiffres, témoignages, logos clients.
- Embarquer three.js, Framer Motion ou une seconde librairie de scroll.
- Utiliser `localStorage` pour autre chose que la préférence de thème.
