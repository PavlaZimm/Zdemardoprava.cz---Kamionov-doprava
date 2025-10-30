# 🚀 Deployment Guide - GitHub Pages

## Rychlý průvodce nasazením

### 1️⃣ Aktivovat GitHub Pages

1. Jděte na **https://github.com/PavlaZimm/Zdemardoprava.cz---Kamionov-doprava/settings/pages**
2. V sekci **"Build and deployment"**:
   - Source: Vyberte **"GitHub Actions"**
3. Klikněte **Save**

### 2️⃣ Přidat API klíče (Secrets)

1. Jděte na **https://github.com/PavlaZimm/Zdemardoprava.cz---Kamionov-doprava/settings/secrets/actions**
2. Klikněte na **"New repository secret"**
3. Přidejte následující secrets:

#### Secret #1: Google Maps API Key
- **Name:** `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- **Value:** Váš Google Maps API klíč
- Získejte na: https://console.cloud.google.com/apis/credentials

#### Secret #2: Convex Database URL (volitelné)
- **Name:** `NEXT_PUBLIC_CONVEX_URL`
- **Value:** `https://your-deployment.convex.cloud`
- Získejte na: https://dashboard.convex.dev/

### 3️⃣ Spustit deployment

Deployment se spustí automaticky po každém push do branch `claude/work-in-progress-011CUdLZq7AHZ83t6oo6N3TV`.

**Nebo** můžete deployment spustit manuálně:
1. Jděte na **Actions** tab: https://github.com/PavlaZimm/Zdemardoprava.cz---Kamionov-doprava/actions
2. Vyberte workflow **"Deploy to GitHub Pages"**
3. Klikněte **"Run workflow"**
4. Vyberte branch a klikněte **"Run workflow"**

### 4️⃣ Sledovat průběh

1. Jděte na **Actions** tab
2. Klikněte na nejnovější workflow run
3. Sledujte průběh buildu (obvykle 2-3 minuty)

### 5️⃣ Zobrazit web

Po úspěšném deployi bude web dostupný na:
- **https://pavlazimm.github.io/Zdemardoprava.cz---Kamionov-doprava/**

URL najdete také v:
- Settings → Pages → "Your site is live at..."
- Actions → workflow run → deploy job → "Deploy to GitHub Pages" step

---

## ✅ Checklist před nasazením

- [ ] GitHub Pages je aktivován (Source: GitHub Actions)
- [ ] Secret `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` je přidán
- [ ] Secret `NEXT_PUBLIC_CONVEX_URL` je přidán (pokud používáte databázi)
- [ ] Změny jsou pushnuté do repository
- [ ] Workflow běží bez chyb

---

## 🐛 Řešení problémů

### Build selhává
- Zkontrolujte Actions log pro detailní chyby
- Ujistěte se, že secrets jsou správně nastavené
- Zkontrolujte, že všechny závislosti jsou v package.json

### Stránka se nenačítá
- Počkejte 2-3 minuty po deployi (GitHub Pages cache)
- Zkontrolujte Settings → Pages, že je source nastavený na "GitHub Actions"
- Vymažte browser cache a zkuste znovu

### Mapa nefunguje
- Zkontrolujte, že `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` secret je správně nastavený
- Ověřte, že API klíč má povolený Maps JavaScript API a Geocoding API

---

## 📝 Po nasazení

Po úspěšném nasazení můžete:
1. Sdílet URL s vedením
2. Otestovat všechny funkce (kalkulátor, mapa, formulář)
3. Zkontrolovat responzivitu na mobilních zařízeních
4. Případně upravit texty a data v kódu a pushnout znovu
