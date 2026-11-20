# Sailing Mango – hjemmeside 🥭

Hjemmesiden ligger på GitHub, så intet kan gå tabt: **hver eneste ændring gemmes som en version**, og man kan altid gå tilbage.

- **Indhold** (tekst, billeder, togter) ligger i mappen [`indhold/`](indhold/)
- **Design og kode** ligger i [`src/`](src/) – den behøver man ikke røre
- Siden bygges og udgives automatisk på GitHub Pages, hver gang der gemmes noget

---

## Del 1 – Første opsætning (gøres én gang)

### 1. Læg koden på GitHub
1. Opret en gratis konto på [github.com](https://github.com) (hvis I ikke har en).
2. Klik **New repository** → navn fx `sailing-mango` → **Public** → *Create repository*.
3. Upload projektet (fra denne mappe):
   ```bash
   git commit -m "Første version af hjemmesiden"
   git remote add origin https://github.com/holste27832/sailing-mango.git
   git push -u origin main
   ```
   (Alternativt: brug *GitHub Desktop* og vælg “Add existing repository”.)

### 2. Slå hjemmesiden til
1. I repository'et: **Settings → Pages**.
2. Under *Build and deployment → Source* vælg **GitHub Actions**.
3. Gå til fanen **Actions** og vent ca. 1 minut. Siden ligger nu på
   `https://holste27832.github.io/sailing-mango/` (nu sendes man videre til **https://sailingmango.dk**)

### 3. Giv kammeraten adgang
1. Han opretter en GitHub-konto.
2. **Settings → Collaborators → Add people** → skriv hans brugernavn.
3. Han accepterer invitationen i sin e-mail.

### 4. Eget domæne: sailingmango.dk (sat op)
1. Køb domænet (fx hos Simply, One.com eller Cloudflare).
2. **Settings → Pages → Custom domain** → skriv `sailingmango.dk` og gem.
3. Hos domæneudbyderen: tilføj DNS-poster som GitHub viser
   ([vejledning](https://docs.github.com/da/pages/configuring-a-custom-domain-for-your-github-pages-site)).
4. Sæt hak i **Enforce HTTPS**. Linkene på siden tilpasser sig automatisk.

   DNS hos Simply.com for sailingmango.dk:
   - A-poster for `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - CNAME for `www`: `holste27832.github.io`
   - MX (`mx.simply.com`) og SPF-TXT skal blive stående – de styrer e-mailen.

---

## Del 2 – Sådan retter man på siden (uden kode)

Hjemmesiden har sin egen **admin-side** på **`/admin/`**, fx
**https://sailingmango.dk/admin/**
Alt, hvad man gemmer dér, bliver gemt i GitHub og er live på siden ca. 1 minut efter.

### Engangs-opsætning af admin
1. Åbn [`src/admin/config.yml`](src/admin/config.yml) og skift `repo: holste27832/sailing-mango` til jeres rigtige GitHub-brugernavn/repo. Commit og push.
2. Hver person, der skal redigere, laver en **adgangsnøgle** (gøres én gang):
   1. På GitHub: profilbillede → **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**.
   2. Navn: `Sailing Mango admin`. Udløb: fx 1 år.
   3. *Repository access*: **Only select repositories** → vælg `sailing-mango`.
      (Kammeraten skal først være tilføjet som collaborator – se trin 3 ovenfor.
      Hvis repoet ikke kan vælges, skal ejeren lave token'et, eller repoet flyttes til en fælles *organization*.)
   4. *Permissions → Repository permissions → Contents*: **Read and write**.
   5. Klik **Generate token** og kopiér koden.
3. Gå til `/admin/`, klik **Log ind med adgangstoken**, og indsæt koden. Browseren husker login.

> Knappen *“Log ind med GitHub”* virker først, hvis man opsætter en lille gratis login-tjeneste på Cloudflare
> ([vejledning](https://github.com/sveltia/sveltia-cms-auth)). Adgangstoken-metoden virker med det samme.

### Hvad kan man rette?

| Menu | Hvad kan man rette |
|---|---|
| ⛵ **Togter** | Opret, ret eller slet togter (datoer, status, billede, beskrivelse). Slå “Vis på hjemmesiden” fra for at skjule et togt. |
| 📄 Sider → 🏠 **Forside** | Stor overskrift, baggrundsvideo/billede, velkomsttekst, genvejskort, citat, Instagram-feed |
| 📄 Sider → 🛥 **Båden** | Afsnit, “Mango i tal”, galleri |
| 📄 Sider → 👋 **Om os** | Historien, motto og “Mød besætningen” (Dave og Tobias) |
| 📄 Sider → 🎒 **Bliv gast** | Alle afsnit, regler, priser, “selv stå for”, trin og FAQ |
| 📄 Sider → ⚙️ **Indstillinger** | Logo, menu, sociale medier, hvor “Skriv til os” peger hen, e-mail |
| **Medier** | Upload billeder og videoer |

Klik **Gem**, når du er færdig. Efter ca. 1 minut er ændringen live.

### Tips
- **Tekst:** Tekstfelterne har fed, kursiv, links og punktlister ligesom i Word.
- **Lister** (togter, FAQ, regler, priskort …): brug **Tilføj** for at tilføje, træk for at ændre rækkefølge, og slet med menuen ved hvert punkt.
- **Billeder:** Brug gerne liggende billeder på max ~2000 px bredde og under 1 MB (fx komprimér på [squoosh.app](https://squoosh.app)).
- **Levende baggrund (video):** Upload en kort `.mp4` (5–15 sek, uden lyd, helst under 10 MB) i feltet *Baggrundsvideo*. Er feltet tomt, vises billedet med en langsom zoom-effekt.
- **Instagram på forsiden:** Opret et gratis feed på [curator.io](https://curator.io), kopiér feed-id'et ind under *Forside → Sociale medier*. Indtil da vises et billedgitter, der linker til Instagram.
- **“Skriv til os”-knapperne** peger lige nu på en Instagram-besked. Skift under *Indstillinger*, fx til `mailto:jeres@mail.dk`.

### Fortryd en ændring
Alt er gemt i historikken. På GitHub: åbn filen → **History** → vælg en gammel version. Eller spørg den, der har sat siden op 🙂

---

## Del 3 – For udvikleren

```bash
npm install
npm start        # http://localhost:8080 med live-reload
npm run build    # bygger til _site/
```

- Bygget med [Eleventy](https://www.11ty.dev) – ren HTML/CSS, intet framework.
- `eleventy.config.js` læser `indhold/*.yml` og `indhold/togter/*.md`.
- `src/admin/config.yml` definerer felterne på admin-siden ([Sveltia CMS](https://sveltiacms.app)). Tilføjes et nyt felt i en skabelon, skal det også tilføjes dér.
- Farver og skrifttyper styres øverst i `src/css/style.css`.
- `.github/workflows/deploy.yml` bygger og udgiver ved hvert push til `main`.
- Placeholder-billeder er hentet direkte fra Unsplash (gratis licens) og bør udskiftes med egne.
