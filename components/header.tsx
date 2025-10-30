"use client"

import { useState } from 'react'
import { Menu, X, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold text-primary">Zdemardoprava.cz</h1>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-6" role="navigation" aria-label="Hlavní navigace">
              <a href="#calculator" className="text-muted-foreground hover:text-primary transition-colors">Kalkulátor</a>
              <a href="#services" className="text-muted-foreground hover:text-primary transition-colors">Služby</a>
              <a href="#testimonials" className="text-muted-foreground hover:text-primary transition-colors">Recenze</a>
              <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors">Kontakt</a>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="tel:+420725215531"
              className="hidden sm:flex items-center text-accent font-semibold hover:text-accent/80 transition-colors"
              aria-label="Zavolat na číslo 725 215 531"
            >
              <Phone className="w-4 h-4 mr-2" />
              725 215 531
            </a>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Zavřít menu" : "Otevřít menu"}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden pb-4 border-t mt-2 pt-4" role="navigation" aria-label="Mobilní navigace">
            <div className="flex flex-col space-y-3">
              <a
                href="#calculator"
                className="text-muted-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Kalkulátor
              </a>
              <a
                href="#services"
                className="text-muted-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Služby
              </a>
              <a
                href="#testimonials"
                className="text-muted-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Recenze
              </a>
              <a
                href="#contact"
                className="text-muted-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Kontakt
              </a>
              <a
                href="tel:+420725215531"
                className="sm:hidden flex items-center text-accent font-semibold hover:text-accent/80 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Phone className="w-4 h-4 mr-2" />
                725 215 531
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
