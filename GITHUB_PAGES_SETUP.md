# 🚀 Nastavení GitHub Pages

Tento projekt je nakonfigurován pro automatické nasazení na GitHub Pages.

## Kroky pro aktivaci GitHub Pages:

### 1. Povolte GitHub Pages v nastavení repozitáře

1. Jděte do vašeho GitHub repozitáře
2. Klikněte na **Settings** (Nastavení)
3. V levém menu najděte **Pages**
4. V sekci **Build and deployment**:
   - **Source**: Vyberte **GitHub Actions**
5. Uložte změny

### 2. Nastavte vlastní doménu (volitelné)

#### A) Pokud chcete používat vlastní doménu `zdemardoprava.cz`:

1. V nastavení GitHub Pages (stejná stránka jako výše)
2. V sekci **Custom domain** zadejte: `zdemardoprava.cz`
3. Klikněte na **Save**

#### B) Nastavte DNS záznamy u vašeho registrátora domény:

Pro apex doménu (zdemardoprava.cz):
```
A    @    185.199.108.153
A    @    185.199.109.153
A    @    185.199.110.153
A    @    185.199.111.153
```

Pro www subdoménu (volitelné):
```
CNAME    www    [vaše-github-username].github.io
```

**Poznámka:** Pokud nechcete vlastní doménu, stránka bude dostupná na:
`https://[vaše-github-username].github.io/[název-repozitáře]/`

### 3. Spusťte deployment

Deployment se spustí automaticky při:
- Push do `main` nebo `master` větve
- Manuálním spuštění v záložce **Actions** → **Deploy to GitHub Pages** → **Run workflow**

### 4. Zkontrolujte deployment

1. Jděte do záložky **Actions** ve vašem repozitáři
2. Uvidíte běžící workflow **Deploy to GitHub Pages**
3. Po dokončení (✅ zelený fajfek) bude stránka dostupná

## 📋 Co bylo nakonfigurováno:

### Soubory:
- `.github/workflows/deploy.yml` - GitHub Actions workflow pro automatický build a deployment
- `next.config.js` - Přidáno `output: 'export'` pro statický export
- `public/.nojekyll` - Zabraňuje Jekyll procesování
- `public/CNAME` - Definuje vlastní doménu (zdemardoprava.cz)

### Funkce:
- ✅ Automatický build a deployment při pushu do main/master
- ✅ Statický export Next.js aplikace
- ✅ Podpora pro vlastní doménu
- ✅ Optimalizované obrázky (unoptimized pro statický export)

## 🔧 Technické detaily:

### Build proces:
1. Checkout kódu
2. Instalace Node.js 20
3. Instalace závislostí (`npm ci --legacy-peer-deps`)
4. Build Next.js aplikace (`npm run build`)
5. Export do složky `out/`
6. Přidání `.nojekyll` souboru
7. Upload a deployment na GitHub Pages

### Řešení problémů:

**Problém:** Build selhává
- Zkontrolujte logy v záložce Actions
- Ujistěte se že `npm run build` funguje lokálně

**Problém:** Stránka nezobrazuje styly
- `.nojekyll` soubor by měl tento problém vyřešit
- Zkontrolujte že je soubor v `out/` složce po buildu

**Problém:** 404 Not Found
- Zkontrolujte že GitHub Pages je nastaven na "GitHub Actions"
- Ověřte že deployment proběhl úspěšně (zelený fajfek)

**Problém:** Vlastní doména nefunguje
- Počkejte 24-48 hodin na propagaci DNS
- Zkontrolujte DNS záznamy pomocí `dig zdemardoprava.cz`
- Ujistěte se že CNAME soubor obsahuje správnou doménu

## 📝 Poznámky:

- Používáme Leaflet mapy s OpenStreetMap - zdarma, bez API klíčů
- Nominatim API pro geocoding
- OSRM API pro výpočet vzdáleností
- Všechny tyto služby fungují bez autentizace

## 🎉 Hotovo!

Po dokončení těchto kroků bude vaše aplikace automaticky nasazována na GitHub Pages při každém pushu do main větve.
