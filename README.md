


# Zdemardoprava.cz - Kamionová doprava

Profesionální website pro kamionovou dopravu s interaktivním kalkulátorem cen a výběrem tras na mapě.

## Funkce

### ✅ Hotové funkce
- **Hero sekce** s pozadím modrého kamionu Volvo
- **Interaktivní kalkulátor** s výběrem typu nákladu a vozidla
- **Výběr míst na mapě** - Google Maps integrace s autocomplete
- **Cenové kalkulace** včetně DPH a vzdálenostních příplatků
- **Responzivní design** optimalizovaný pro mobily
- **Sekce služeb** a testimonials
- **Kontaktní informace** v patičce
- **Kompletní SEO optimalizace** - metadata, structured data, sitemap

### 🗺️ Mapa a trasy
- **MapLocationPicker komponenta** - interaktivní výběr míst
- **Google Maps API** integrace s autocomplete
- **Vyhledávání adres** v České republice a okolních zemích
- **Klikání na mapu** pro přesný výběr místa
- **Přetahování markerů** pro jemné doladění pozice
- **Reverse geocoding** - automatické získání adresy z souřadnic

### 💰 Cenový kalkulátor
- **Typy nákladů**: malé (do 1t), střední (1-5t), těžké (5-15t), nadrozměrné
- **Typy vozidel**: dodávka s plachtou, nákladák Hardox, nákladák s plachtou, malý kamion (7.5t), střední (12t), velký (24t)
- **Automatický výpočet vzdálenosti** pomocí Google Maps Distance Matrix API
- **Podpora pro všechna města v Evropě** - automatické geocoding pro jakékoliv evropské město
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
- **Next.js 14** - React framework
- **TypeScript** - typová bezpečnost
- **Tailwind CSS** - styling
- **Shadcn/ui** - UI komponenty
- **Google Maps API** - mapy a geocoding
- **Convex** - databáze (připraveno)

### Klíčové komponenty
- `components/calculator.tsx` - hlavní kalkulátor
- `components/map-location-picker.tsx` - výběr míst na mapě
- `components/services-section.tsx` - sekce služeb
- `components/testimonials-section.tsx` - recenze
- `components/footer.tsx` - patička
- `components/structured-data.tsx` - SEO structured data

### SEO soubory
- `app/metadata.json` - centralizovaná SEO metadata
- `app/sitemap.ts` - automaticky generovaná sitemap
- `app/robots.ts` - pravidla pro vyhledávací roboty

### Nastavení Google Maps
Pro plnou funkcionalitu map je potřeba nastavit:
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

## Design
- **Barvy**: Modrá (#39a1e6) jako hlavní barva
- **Typografie**: Moderní sans-serif fonty
- **Layout**: Čistý, profesionální design
- **Obrázky**: Vlastní AI generovaný kamion s logem

## Další kroky
- [x] Implementace skutečné kalkulace vzdálenosti mezi body
- [x] Optimalizace SEO metadat
- [ ] Uložení objednávek do databáze
- [ ] Email notifikace pro nové objednávky
- [ ] Admin panel pro správu objednávek






