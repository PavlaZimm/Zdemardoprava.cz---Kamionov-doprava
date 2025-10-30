


# Zdemardoprava.cz - Kamionová doprava

Profesionální website pro kamionovou dopravu s interaktivním kalkulátorem cen a výběrem tras na mapě.

**🌐 Live Demo:** https://pavlazimm.github.io/Zdemardoprava.cz---Kamionov-doprava/

## Funkce

### ✅ Hotové funkce
- **Hero sekce** s pozadím modrého kamionu Volvo
- **Interaktivní kalkulátor** s výběrem typu nákladu a vozidla
- **Geocoding a routing** - OpenStreetMap (Nominatim + OSRM) - ZDARMA
- **Cenové kalkulace** včetně DPH a vzdálenostních příplatků
- **Responzivní design** optimalizovaný pro mobily
- **Sekce služeb** a testimonials
- **Kontaktní informace** v patičce
- **Kompletní SEO optimalizace** - metadata, structured data, sitemap

### 🗺️ Mapa a trasy (OpenStreetMap - ZDARMA!)
- **Nominatim API** - geocoding (adresa → souřadnice)
- **OSRM API** - routing a výpočet vzdáleností
- **Vyhledávání adres** v celé Evropě
- **Přesný výpočet tras** po silnicích
- **Automatická detekce** při zadání města/adresy
- **Žádné API klíče potřeba** - vše funguje out-of-the-box

### 💰 Cenový kalkulátor
- **Typy nákladů**: malé (do 1t), střední (1-5t), těžké (5-15t), nadrozměrné
- **Typy vozidel**: dodávka s plachtou, nákladák Hardox, nákladák s plachtou, malý kamion (7.5t), střední (12t), velký (24t)
- **Automatický výpočet vzdálenosti** pomocí OSRM API (zdarma!)
- **Podpora pro všechna města v Evropě** - automatické geocoding pomocí Nominatim
- **Cenové pásma podle vzdálenosti**:
  - Místní přeprava (do 50 km): základní cena
  - Regionální (50-200 km): +30% příplatek
  - Dálková (200-500 km): +60% příplatek  
  - Mezinárodní (500+ km): +100% příplatek
- **Automatický výpočet DPH** (21%)
- **Výběr termínu** nakládky
- **Platební metody**: hotovost, karta, převod

## Technické detaily

### Stack
- **Next.js 15** - React framework
- **TypeScript** - typová bezpečnost
- **Tailwind CSS** - styling
- **Shadcn/ui** - UI komponenty
- **OpenStreetMap** - bezplatné mapy (Nominatim + OSRM + Leaflet)
- **Convex** - databáze

### Klíčové komponenty
- `components/calculator.tsx` - hlavní kalkulátor
- `components/header.tsx` - responzivní navigace
- `components/services-section.tsx` - sekce služeb
- `components/testimonials-section.tsx` - recenze
- `components/footer.tsx` - patička
- `components/structured-data.tsx` - SEO structured data

### SEO soubory
- `app/metadata.json` - centralizovaná SEO metadata
- `public/sitemap.xml` - statická sitemap
- `public/robots.txt` - pravidla pro vyhledávací roboty

### Nastavení prostředí

**Žádné API klíče potřeba!** 🎉 Projekt používá bezplatné OpenStreetMap služby.

Volitelně můžete nastavit Convex databázi:

```env
# Convex Database URL (volitelné)
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

Viz `.env.example` pro více informací.

## Design
- **Barvy**: Modrá (#39a1e6) jako hlavní barva
- **Typografie**: Moderní sans-serif fonty
- **Layout**: Čistý, profesionální design
- **Obrázky**: Vlastní AI generovaný kamion s logem

## 🚀 Deployment na GitHub Pages

Projekt je nakonfigurovaný pro automatický deploy na GitHub Pages.

### Kroky pro nastavení:

1. **Přejděte do Settings vašeho GitHub repository**
2. **Jděte do sekce "Pages"** (v levém menu)
3. **V Source vyberte "GitHub Actions"**
4. **(Volitelné) Přidejte Secret** pro databázi (Settings → Secrets and variables → Actions):
   - `NEXT_PUBLIC_CONVEX_URL` - URL vaší Convex databáze

5. **Pushnete do branch** a deployment se spustí automaticky

**Poznámka:** Žádné API klíče nejsou potřeba! Mapy fungují bez konfigurace.

### Lokální build:
```bash
npm run build  # Vytvoří statický export v ./out složce
```

## Další kroky
- [x] Implementace skutečné kalkulace vzdálenosti mezi body
- [x] Optimalizace SEO metadat
- [x] Uložení objednávek do databáze
- [x] Mobilní responzivní navigace
- [x] GitHub Pages deployment konfigurace
- [ ] Email notifikace pro nové objednávky
- [ ] Admin panel pro správu objednávek






