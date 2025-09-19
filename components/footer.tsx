import { Phone, Mail, MessageCircle } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-primary mb-4">Zdemardoprava.cz</h3>
            <p className="text-gray-300 mb-4">
              Profesionální kamionová doprava po celé Evropě
            </p>
            <p className="text-sm text-gray-400">
              Spolehlivá přeprava nákladů již od roku 2008
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Kontaktujte nás</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-accent" />
                <div>
                  <a href="tel:+420725215531" className="text-accent hover:text-accent/80 transition-colors font-semibold">
                    725 215 531
                  </a>
                  <p className="text-sm text-gray-400">Po - Pá: 16:00</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary" />
                <a href="mailto:info@zdemar.cz" className="text-primary hover:text-primary/80 transition-colors">
                  info@zdemar.cz
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-5 h-5 text-primary" />
                <a href="https://api.whatsapp.com/send?phone=420725215531" className="text-primary hover:text-primary/80 transition-colors">
                  WhatsApp
                </a>
              </div>
              <div className="text-sm text-gray-400 space-y-1 mt-4">
                <p>ZDEMAR Ústí nad Labem s.r.o.</p>
                <p>Smetanova 683</p>
                <p>403 17 Chabařovice</p>
                <p>Česká republika</p>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Odkazy</h4>
            <div className="space-y-2">
              <a href="https://www.zdemar.cz/kariera" className="block text-gray-300 hover:text-white transition-colors">Kariéra</a>
            </div>
          </div>
        </div>

        {/* Company Details */}
        <div className="border-t border-gray-700 pt-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h5 className="font-semibold mb-2">Fakturační údaje</h5>
              <div className="text-sm text-gray-400 space-y-1">
                <p>ZDEMAR Ústí nad Labem s.r.o.</p>
                <p>Smetanova 683</p>
                <p>403 17 Chabařovice</p>
                <p>Česká republika</p>
              </div>
            </div>
            <div>
              <h5 className="font-semibold mb-2">Údaje</h5>
              <div className="text-sm text-gray-400 space-y-1">
                <p>IČ: 25025589</p>
                <p>DIČ: CZ12345678</p>
                <p>Bankovní spojení: Komerční banka</p>
                <p>Číslo účtu: 123456789/0100</p>
                <p>IBAN: CZ65 0100 0000 0012 3456 7890</p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>© 2025 ZDEMAR • Vyrobeno s láskou ❤️ a spoustou ☕</p>
          <p className="mt-2">
            <a href="https://linklady.cz" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-400/80 transition-colors">
              linklady.cz
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}









