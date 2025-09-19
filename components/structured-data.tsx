export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://zdemardoprava.cz/#organization",
        "name": "Zdemardoprava.cz",
        "url": "https://zdemardoprava.cz",
        "telephone": "+420739028028",
        "description": "Profesionální kamionová doprava a přeprava nákladů po celé Evropě",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "CZ",
          "addressLocality": "Česká republika"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+420739028028",
          "contactType": "customer service",
          "availableLanguage": ["Czech", "Slovak"]
        },
        "sameAs": []
      },
      {
        "@type": "WebSite",
        "@id": "https://zdemardoprava.cz/#website",
        "url": "https://zdemardoprava.cz",
        "name": "Zdemardoprava.cz - Kamionová doprava",
        "description": "Profesionální kamionová doprava a přeprava nákladů po celé Evropě",
        "publisher": {
          "@id": "https://zdemardoprava.cz/#organization"
        },
        "inLanguage": "cs-CZ"
      },
      {
        "@type": "WebPage",
        "@id": "https://zdemardoprava.cz/#webpage",
        "url": "https://zdemardoprava.cz",
        "name": "Kamionová doprava po celé Evropě | Zdemardoprava.cz",
        "isPartOf": {
          "@id": "https://zdemardoprava.cz/#website"
        },
        "about": {
          "@id": "https://zdemardoprava.cz/#organization"
        },
        "description": "Profesionální kamionová doprava a přeprava nákladů po celé Evropě. Kalkulátor cen online, rychlé nabídky, spolehlivé služby.",
        "breadcrumb": {
          "@id": "https://zdemardoprava.cz/#breadcrumb"
        },
        "inLanguage": "cs-CZ"
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://zdemardoprava.cz/#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Domů",
            "item": "https://zdemardoprava.cz"
          }
        ]
      },
      {
        "@type": "Service",
        "@id": "https://zdemardoprava.cz/#service",
        "name": "Kamionová doprava",
        "description": "Profesionální přeprava nákladů kamiony po celé Evropě",
        "provider": {
          "@id": "https://zdemardoprava.cz/#organization"
        },
        "areaServed": {
          "@type": "Place",
          "name": "Evropa"
        },
        "serviceType": "Nákladní doprava",
        "category": "Transportation",
        "offers": {
          "@type": "Offer",
          "description": "Cenové nabídky na kamionovou dopravu",
          "availability": "https://schema.org/InStock"
        }
      }
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}