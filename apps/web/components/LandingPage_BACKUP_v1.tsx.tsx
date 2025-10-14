'use client'

import { AlertTriangle, Shield, Bell, FileText, CheckCircle } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <span className="text-2xl font-bold text-gray-900">ImmoWaechter</span>
          </div>
          <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors">
            Jetzt starten
          </button>
        </div>
      </nav>

      {/* Hero Section with yellow/orange gradient */}
      <section className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              648 Wartungen werden jaehrlich vergessen – gehoert Ihre dazu?
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              ImmoWaechter erinnert Sie an alle gesetzlichen Wartungsfristen – fuer mehr Sicherheit in Ihrer Immobilie
            </p>
            <button className="bg-red-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-red-700 transition-colors">
              Kostenlos testen
            </button>
          </div>
        </div>
      </section>

      {/* PROMINENT DISCLAIMER */}
      <section className="bg-yellow-100 border-y-4 border-yellow-400 py-6">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-4 items-start">
              <AlertTriangle className="w-6 h-6 text-yellow-700 flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm text-gray-800 leading-relaxed">
                  <strong>Wichtiger Hinweis:</strong> ImmoWaechter ist ein digitaler Wartungsassistent, 
                  der Sie an gesetzliche Fristen und empfohlene Wartungsintervalle erinnert. 
                  Die Verantwortung fuer die Durchfuehrung der Wartungen und die Einhaltung aller 
                  gesetzlichen Pflichten verbleibt beim Immobilienbesitzer. ImmoWaechter ersetzt 
                  keine fachliche Beratung und uebernimmt keine Haftung fuer Schaeden.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">So unterstuetzt ImmoWaechter Sie</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Bell className="w-12 h-12 text-amber-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Rechtzeitige Erinnerungen</h3>
              <p className="text-gray-600">
                Jaehrlich entstehen 648 CO-Unfaelle durch vergessene Gasheizungswartungen. 
                Unsere Erinnerungen helfen Ihnen, Termine einzuhalten.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <FileText className="w-12 h-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Lueckenlose Dokumentation</h3>
              <p className="text-gray-600">
                Bei grober Fahrlaessigkeit zahlen Versicherungen oft nicht. Mit unserer 
                Wartungsdokumentation koennen Sie Ihre Sorgfaltspflicht nachweisen.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Shield className="w-12 h-12 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Gesetzliche Pflichten</h3>
              <p className="text-gray-600">
                Als Immobilienbesitzer haben Sie Verkehrssicherungspflichten. 
                Wir helfen Ihnen, den Ueberblick zu behalten.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto text-center">
            <div>
              <div className="text-4xl font-bold text-red-600 mb-2">648</div>
              <div className="text-gray-600">CO-Vergiftungen/Jahr</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-red-600 mb-2">50.000€</div>
              <div className="text-gray-600">Moegliches Bussgeld</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-red-600 mb-2">15.000€</div>
              <div className="text-gray-600">Durchschn. Schaden</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">24.000€</div>
              <div className="text-gray-600">Moegliche Foerderungen</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-red-600 to-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Behalten Sie den Ueberblick</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Multi-Channel-Erinnerungen erhoehen die Chance, dass Sie wichtige Termine wahrnehmen
          </p>
          <button className="bg-white text-red-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
            Jetzt Wartungen organisieren
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 ImmoWaechter - Digitale Wartungserinnerung</p>
        </div>
      </footer>
    </div>
  )
}
