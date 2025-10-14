'use client'

import { AlertTriangle, Shield, Bell, FileText, CheckCircle, TrendingUp, Award, Users, Clock, Euro, Star, Quote, MessageCircle, ChevronDown, Phone, Mail, MapPin, Zap, Gift, Search } from 'lucide-react'
import { useState } from 'react'

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const faqs = [
    {
      question: "Wie funktioniert der Förderungs-Finder?",
      answer: "Wir scannen automatisch monatlich alle verfügbaren Bundes- und Landesförderungen für Ihre Immobilie. Bei einem Match erhalten Sie sofort eine Benachrichtigung mit allen Details und Unterstützung beim Antrag."
    },
    {
      question: "Wie viel kann ich durch Anbieterwechsel sparen?",
      answer: "Durchschnittlich sparen österreichische Haushalte €350-850 pro Jahr durch den Wechsel des Strom- und Gasanbieters. Wir erinnern Sie jährlich und vergleichen automatisch die besten Angebote für Sie."
    },
    {
      question: "Welche Wartungen werden überwacht?",
      answer: "Alle gesetzlich vorgeschriebenen Wartungen: Gasheizung, Rauchmelder, Aufzüge, FI-Schalter, Legionellenprüfung, Blitzschutz und viele mehr. Insgesamt über 30 verschiedene Wartungstypen nach OIB-Richtlinien."
    },
    {
      question: "Was passiert nach den 30 Tagen Trial?",
      answer: "Nach 30 Tagen können Sie zwischen unseren Plänen wählen oder kündigen. Es gibt keine automatische Abbuchung ohne Ihre Zustimmung. Sie entscheiden frei, welcher Plan am besten passt."
    },
    {
      question: "Funktioniert es auch für Mehrfamilienhäuser?",
      answer: "Ja! Der Standard-Plan unterstützt bis zu 3 Immobilien, der Premium-Plan unbegrenzt viele. Ideal für Vermieter und Hausverwaltungen."
    },
    {
      question: "Wie sicher sind meine Daten?",
      answer: "Absolut sicher! Wir sind 100% DSGVO-konform, nutzen SSL-Verschlüsselung und speichern alle Daten in Österreich. Ihre Daten werden niemals verkauft oder an Dritte weitergegeben."
    },
    {
      question: "Kann ich jederzeit kündigen?",
      answer: "Ja, Sie können monatlich kündigen. Es gibt keine Mindestvertragslaufzeit. Bei Unzufriedenheit erhalten Sie Ihr Geld innerhalb von 30 Tagen zurück."
    },
    {
      question: "Welche Energieanbieter sind Partner?",
      answer: "Wir arbeiten mit allen großen österreichischen Energieanbietern zusammen (e.on, Wien Energie, Energie Steiermark, etc.) und prüfen regelmäßig neue Anbieter für die besten Konditionen."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* WhatsApp Floating Button */}
      <a 
        href="https://wa.me/43123456789" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 group"
      >
        <MessageCircle className="w-7 h-7 text-white" />
        <span className="absolute right-16 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Fragen? Schreiben Sie uns!
        </span>
      </a>

      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              ImmoWächter
            </span>
          </div>
          <button className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2.5 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold">
            30 Tage kostenlos testen
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(251,191,36,0.1),transparent_50%)]" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-md">
              <Gift className="w-4 h-4" />
              Sparen Sie bis zu €1.200/Jahr automatisch!
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Wartungen vergessen kostet €15.000 –{' '}
              <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                Anbieter nicht wechseln weitere €500/Jahr
              </span>
            </h1>

            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              ImmoWächter erinnert Sie an BEIDES: Wartungen UND Energieanbieterwechsel – 
              plus wir finden bis zu €24.000 Förderungen für Sie!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1">
                30 Tage kostenlos testen
              </button>
              <button className="bg-white text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-gray-300 hover:border-gray-400 transition-all duration-300 hover:shadow-lg">
                Demo ansehen
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Keine Kreditkarte erforderlich</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Jederzeit kündbar</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>30 Tage Geld-zurück</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Partner Section */}
      <section className="py-12 bg-white border-y border-gray-200">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-gray-500 mb-6 uppercase tracking-wider font-semibold">
            Unsere Partner helfen Ihnen zu sparen
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 mb-4">
            <div className="text-2xl font-bold text-gray-600">e.on</div>
            <div className="text-2xl font-bold text-gray-600">Wien Energie</div>
            <div className="text-2xl font-bold text-gray-600">Energie Steiermark</div>
            <div className="text-2xl font-bold text-gray-600">TÜV Austria</div>
          </div>
          <p className="text-center text-xs text-gray-500 max-w-2xl mx-auto">
            Durch unsere Partnerschaften erhalten Sie exklusive Wechselboni und Sonderkonditionen
          </p>
        </div>
      </section>

      {/* PROMINENT DISCLAIMER */}
      <section className="bg-gradient-to-r from-yellow-100 via-yellow-50 to-amber-100 border-y-4 border-yellow-400 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex gap-4 items-start">
              <AlertTriangle className="w-7 h-7 text-yellow-700 flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm text-gray-800 leading-relaxed">
                  <strong className="text-yellow-900">Wichtiger Hinweis:</strong> ImmoWächter ist ein digitaler Wartungsassistent, 
                  der Sie an gesetzliche Fristen und empfohlene Wartungsintervalle erinnert. 
                  Die Verantwortung für die Durchführung der Wartungen und die Einhaltung aller 
                  gesetzlichen Pflichten verbleibt beim Immobilienbesitzer. ImmoWächter ersetzt 
                  keine fachliche Beratung und übernimmt keine Haftung für Schäden.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions - 3 Säulen */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              3 Wege wie ImmoWächter Sie schützt & Geld spart
            </h2>
            <p className="text-xl text-gray-600">
              Mehr als nur Wartungserinnerungen
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Value Prop 1 - Wartungen */}
            <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-red-100">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Bell className="w-9 h-9 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Wartungserinnerungen</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Verpassen Sie nie wieder eine kritische Wartung. 648 CO-Vergiftungen/Jahr 
                passieren durch vergessene Gasheizungswartungen.
              </p>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>30+ Wartungstypen</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Multi-Channel Erinnerungen</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Lückenlose Dokumentation</span>
                </div>
              </div>
            </div>

            {/* Value Prop 2 - Förderungen */}
            <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-green-100">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Search className="w-9 h-9 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Förderungs-Finder</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Wir scannen monatlich automatisch alle verfügbaren Bundes- und Landesförderungen 
                für Ihre Immobilie. Verpassen Sie nie wieder bis zu €24.000!
              </p>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Automatische Prüfung</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Sofort-Benachrichtigung</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Antragsunterstützung</span>
                </div>
              </div>
            </div>

            {/* Value Prop 3 - Energie */}
            <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-blue-100">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Zap className="w-9 h-9 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Energie-Sparservice</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Einmal wechseln = durchschnittlich €580/Jahr sparen! Wir erinnern Sie jährlich 
                an den optimalen Wechselzeitpunkt und vergleichen für Sie.
              </p>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Jährliche Erinnerung</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>20+ Anbieter-Vergleich</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Wechselbonus-Tracking</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Bar */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="text-5xl font-bold text-red-600 mb-2">648</div>
              <div className="text-gray-600">CO-Vergiftungen/Jahr</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-green-600 mb-2">€24.000</div>
              <div className="text-gray-600">Max. Förderungen</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-600 mb-2">€850</div>
              <div className="text-gray-600">Ø Energie-Ersparnis</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-purple-600 mb-2">€1.200</div>
              <div className="text-gray-600">Total Ersparnis/Jahr</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              So einfach funktioniert's
            </h2>
            <p className="text-xl text-gray-600">
              In 3 Schritten zu automatischen Erinnerungen & Einsparungen
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-lg">
                  1
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Immobilie anlegen</h3>
                <p className="text-gray-600">
                  Geben Sie Adresse, Baujahr und Anlagen ein. Dauert nur 2 Minuten.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-lg">
                  2
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Automatisch scannen</h3>
                <p className="text-gray-600">
                  Wir prüfen Wartungen, Förderungen und Energieanbieter für Sie - automatisch.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-lg">
                  3
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Geld sparen</h3>
                <p className="text-gray-600">
                  Sie bekommen Erinnerungen, Förderungs-Alerts und Wechsel-Tipps - automatisch!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <span className="text-2xl font-bold text-gray-900">4.9/5</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Was unsere Kunden sagen
            </h2>
            <p className="text-xl text-gray-600">
              Über 500 Immobilienbesitzer sparen mit ImmoWächter
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <Quote className="w-10 h-10 text-red-200 mb-4" />
              <p className="text-gray-700 mb-6 leading-relaxed">
                "Dank ImmoWächter habe ich nicht nur die Gasheizungswartung nicht vergessen, 
                sondern auch noch 2.400€ Förderung bekommen UND durch den Anbieterwechsel 
                weitere 520€ gespart!"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  FM
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Familie Müller</div>
                  <div className="text-sm text-gray-600">Wien, Einfamilienhaus</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <Quote className="w-10 h-10 text-red-200 mb-4" />
              <p className="text-gray-700 mb-6 leading-relaxed">
                "Der Energie-Sparservice ist Gold wert! Ich hätte nie gedacht, dass ich 
                durch einen Wechsel so viel sparen kann. Die App macht alles automatisch."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                  MK
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Martin Kowalski</div>
                  <div className="text-sm text-gray-600">Graz, Vermieter</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <Quote className="w-10 h-10 text-red-200 mb-4" />
              <p className="text-gray-700 mb-6 leading-relaxed">
                "Die Förderungs-Benachrichtigung kam genau rechtzeitig! Ich hätte die 
                Sanierungsförderung fast verpasst. 14.000€ bekommen - unglaublich!"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  SW
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Sarah Weber</div>
                  <div className="text-sm text-gray-600">Innsbruck, Eigentumswohnung</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - NEW */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Wählen Sie Ihren Plan
            </h2>
            <p className="text-xl text-gray-600">
              30 Tage kostenlos testen - dann entscheiden Sie
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {/* Trial Plan */}
            <div className="bg-gradient-to-br from-gray-100 to-gray-50 p-6 rounded-2xl shadow-lg border-2 border-gray-300">
              <div className="text-center mb-6">
                <div className="inline-block bg-gray-700 text-white px-3 py-1 rounded-full text-xs font-bold mb-3">
                  TRIAL
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Kostenlos</h3>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-4xl font-bold text-gray-900">€0</span>
                </div>
                <div className="text-sm text-gray-600 mt-1">30 Tage testen</div>
              </div>
              <ul className="space-y-3 mb-6 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Voller Zugang</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Alle Features</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Keine Kreditkarte</span>
                </li>
              </ul>
              <button className="w-full bg-gray-700 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors text-sm">
                Jetzt testen
              </button>
            </div>

            {/* Starter Plan */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-gray-200 hover:border-gray-300 transition-all">
              <div className="text-center mb-6">
                <div className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold mb-3">
                  STARTER
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Für Einsteiger</h3>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-4xl font-bold text-gray-900">€4.90</span>
                  <span className="text-gray-600 text-sm">/Monat</span>
                </div>
                <div className="text-xs text-green-600 font-semibold mt-1">ROI: 7000%</div>
              </div>
              <ul className="space-y-3 mb-6 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">1 Immobilie</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Top 8 Wartungen</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Förderungs-Check 2×/Jahr</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Energie-Wechsel-Service</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Ø €350/Jahr sparen</span>
                </li>
              </ul>
              <button className="w-full bg-gray-100 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-sm">
                Plan wählen
              </button>
            </div>

            {/* Standard Plan */}
            <div className="bg-gradient-to-br from-red-600 to-red-700 p-6 rounded-2xl shadow-2xl border-2 border-red-500 relative transform scale-105">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                BELIEBT
              </div>
              <div className="text-center mb-6">
                <div className="inline-block bg-white/20 text-white px-3 py-1 rounded-full text-xs font-bold mb-3">
                  STANDARD
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Für Mehrfachbesitzer</h3>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-4xl font-bold text-white">€12.90</span>
                  <span className="text-red-100 text-sm">/Monat</span>
                </div>
                <div className="text-xs text-yellow-300 font-semibold mt-1">ROI: 4500%</div>
              </div>
              <ul className="space-y-3 mb-6 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
                  <span className="text-white">Bis 3 Immobilien</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
                  <span className="text-white">Alle 30+ Wartungen</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
                  <span className="text-white">Förderungs-Suche monatlich</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
                  <span className="text-white">Auto-Anbieterwechsel</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
                  <span className="text-white">Multi-Channel (SMS+WhatsApp)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
                  <span className="text-white font-semibold">Ø €580/Jahr sparen</span>
                </li>
              </ul>
              <button className="w-full bg-white text-red-600 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg text-sm">
                Jetzt starten
              </button>
            </div>

            {/* Premium Plan */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-purple-200 hover:border-purple-300 transition-all">
              <div className="text-center mb-6">
                <div className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold mb-3">
                  PREMIUM
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Für Profis</h3>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-4xl font-bold text-gray-900">€39.90</span>
                  <span className="text-gray-600 text-sm">/Monat</span>
                </div>
                <div className="text-xs text-green-600 font-semibold mt-1">ROI: 2100%</div>
              </div>
              <ul className="space-y-3 mb-6 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Unbegrenzt Immobilien</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Förderungs-Concierge</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Full-Service Wechsel</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">API-Zugang</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Account Manager</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-semibold">Ø €850/Jahr sparen</span>
                </li>
              </ul>
              <button className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors text-sm">
                Kontakt
              </button>
            </div>
          </div>

          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-6 py-3 rounded-full font-semibold">
              <CheckCircle className="w-5 h-5" />
              30 Tage Geld-zurück-Garantie bei allen Plänen
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <Shield className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <div className="font-semibold text-gray-900 mb-1">DSGVO-konform</div>
                <div className="text-sm text-gray-600">100% Datenschutz</div>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <CheckCircle className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <div className="font-semibold text-gray-900 mb-1">SSL-gesichert</div>
                <div className="text-sm text-gray-600">Sichere Verbindung</div>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <Award className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                <div className="font-semibold text-gray-900 mb-1">Made in Austria</div>
                <div className="text-sm text-gray-600">Österreichisches Unternehmen</div>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <Users className="w-12 h-12 text-orange-600 mx-auto mb-3" />
                <div className="font-semibold text-gray-900 mb-1">500+ Nutzer</div>
                <div className="text-sm text-gray-600">Zufriedene Kunden</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Häufig gestellte Fragen
            </h2>
            <p className="text-xl text-gray-600">
              Alles was Sie über ImmoWächter wissen müssen
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 text-lg">{faq.question}</span>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-600 flex-shrink-0 transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-red-600 via-red-700 to-orange-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="container mx-auto px-4 text-center relative">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Starten Sie noch heute
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-red-50">
            30 Tage kostenlos testen. Keine Kreditkarte erforderlich. 
            Jederzeit kündbar.
          </p>
          <button className="bg-white text-red-600 px-10 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:-translate-y-1">
            Jetzt kostenlos testen
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-500" />
                <span className="text-white font-bold text-lg">ImmoWächter</span>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Wartungen + Förderungen + Energie-Sparen in einer App
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+43 123 456 789</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>info@immowaechter.at</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Wien, Österreich</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Produkt</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Preise</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Demo</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Unternehmen</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Über uns</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kontakt</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Partner werden</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Impressum</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Datenschutz</a></li>
                <li><a href="#" className="hover:text-white transition-colors">AGB</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Widerrufsrecht</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
            © 2025 ImmoWächter - Wartungen, Förderungen & Energie-Sparen. Alle Rechte vorbehalten.
          </div>
        </div>
      </footer>
    </div>
  )
}