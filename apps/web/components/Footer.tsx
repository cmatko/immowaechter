'use client';

import Link from 'next/link';
import { MapPin, Phone, Mail, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold mb-4">ImmoWächter GmbH</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Wien, Österreich</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+43 1 234 567 89</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>info@immowaechter.at</span>
              </div>
            </div>
            <p className="mt-4 text-xs text-gray-400">
              Alle Angaben nach österreichischem Recht
            </p>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold mb-4">Rechtliches</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/agb" className="text-gray-300 hover:text-white transition-colors">
                  AGB
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" className="text-gray-300 hover:text-white transition-colors">
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link href="/impressum" className="text-gray-300 hover:text-white transition-colors">
                  Impressum
                </Link>
              </li>
            </ul>
          </div>

          {/* Austrian Authorities */}
          <div>
            <h4 className="font-semibold mb-4">Österreichische Behörden</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://www.bmaw.gv.at" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-1"
                >
                  BMA <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.oib.or.at" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-1"
                >
                  OIB <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.ove.at" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-1"
                >
                  OVE <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-400">
          <p>&copy; 2024 ImmoWächter GmbH. Alle Rechte vorbehalten.</p>
          <p className="mt-1">Datenschutz nach österreichischer DSGVO-Umsetzung</p>
        </div>
      </div>
    </footer>
  );
}





