'use client';

import React, { useState } from 'react';
import { CheckCircle, Shield, Clock, Users, Gift, Zap, ChevronDown, MessageCircle, Info } from 'lucide-react';

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'duplicate' | 'resent'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        // Prüfe ob Email erneut gesendet wurde
        if (data.resent) {
          setSubmitStatus('resent');
        } else {
          setSubmitStatus('success');
        }
        setEmail('');
        setTimeout(() => setSubmitStatus('idle'), 10000); // 10 Sekunden anzeigen
      } else if (response.status === 409) {
        // Duplicate Email (bereits verifiziert)
        setSubmitStatus('duplicate');
        setErrorMessage(data.error || 'Diese Email ist bereits registriert!');
      } else if (response.status === 400) {
        // Invalid Email
        setSubmitStatus('error');
        setErrorMessage(data.error || 'Bitte geben Sie eine gültige Email-Adresse ein.');
      } else {
        // Other errors
        setSubmitStatus('error');
        setErrorMessage(data.error || 'Fehler beim Speichern. Bitte versuchen Sie es erneut.');
      }
    } catch (error) {
      console.error('Network error:', error);
      setSubmitStatus('error');
      setErrorMessage('Netzwerkfehler. Bitte überprüfen Sie Ihre Internetverbindung.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* WhatsApp Button */}
      <a
        href="https://wa.me/436766951814"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition-all duration-300 hover:scale-110 group"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Schreiben Sie uns!
        </span>
      </a>

      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img 
              src="/web-app-manifest-512x512.png" 
              alt="ImmoWächter Logo" 
              className="w-10 h-10 shadow-lg"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              ImmoWächter
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#disclaimer" className="text-gray-600 hover:text-gray-900 text-sm flex items-center gap-1">
              <Info className="w-4 h-4" />
              <span className="hidden sm:inline">Rechtliche Hinweise</span>
            </a>
            <a
              href="#waitlist"
              className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2.5 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
            >
              Auf Warteliste
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(251,191,36,0.1),transparent_50%)]" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-md animate-pulse">
              <span className="w-2 h-2 bg-red-500 rounded-full" />
              Über 648 CO-Vergiftungen jährlich in Österreich
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              648 Wartungen werden jährlich vergessen –{' '}
              <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                gehört Ihre dazu?
              </span>
            </h1>

            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              ImmoWächter erinnert Sie rechtzeitig an gesetzlich vorgeschriebene Wartungen,
              zeigt Ihnen Energie-Einsparpotenziale und findet verfügbare Förderungen –
              damit Ihre Immobilie sicher, effizient und rechtlich abgesichert bleibt.
            </p>

            {/* Waitlist Form */}
            <div id="waitlist" className="max-w-md mx-auto mb-8">
              <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ihre.email@beispiel.at"
                  required
                  disabled={isSubmitting || submitStatus === 'success'}
                  className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="submit"
                  disabled={isSubmitting || submitStatus === 'success'}
                  className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-3 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-xl hover:shadow-2xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Wird gesendet...' : submitStatus === 'success' ? '✓ Email gesendet' : 'Auf Warteliste'}
                </button>
              </form>

              {/* Success Message - Email Verification */}
              {submitStatus === 'success' && (
                <div className="mt-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-900">Email gesendet!</p>
                      <p className="text-sm text-green-700 mt-1">
                        Wir haben Ihnen eine Bestätigungs-Email geschickt. Bitte prüfen Sie Ihr Postfach und klicken Sie auf den Link.
                      </p>
                      <p className="text-xs text-green-600 mt-2">
                        💡 Tipp: Schauen Sie auch im Spam-Ordner nach
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Resent Message */}
              {submitStatus === 'resent' && (
                <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-blue-900">Email erneut gesendet!</p>
                      <p className="text-sm text-blue-700 mt-1">
                        Die Bestätigungs-Email wurde erneut verschickt. Bitte prüfen Sie Ihr Postfach.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Duplicate Email Message */}
              {submitStatus === 'duplicate' && (
                <div className="mt-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-amber-700 text-sm font-semibold flex items-start gap-2">
                    <Info className="w-5 h-5 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </p>
                </div>
              )}

              {/* Error Message */}
              {submitStatus === 'error' && (
                <div className="mt-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm font-semibold flex items-start gap-2">
                    <Info className="w-5 h-5 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </p>
                </div>
              )}
            </div>

            <p className="text-sm text-gray-600">
              ✓ Kostenlose Registrierung • ✓ Keine Kreditkarte erforderlich • ✓ DSGVO-konform
            </p>
          </div>

          {/* Trust-Builder */}
          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 max-w-4xl mx-auto mt-12 rounded-r-lg shadow-sm">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-800 leading-relaxed">
                  <strong>ImmoWächter</strong> ist Ihr digitaler Assistent für rechtzeitige Wartungserinnerungen
                  gemäß österreichischen Standards (OIB-Richtlinien). Wir unterstützen Sie bei der Organisation 
                  Ihrer Wartungspflichten – die Durchführung und rechtliche Verantwortung verbleiben beim Eigentümer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Logos */}
      <section className="py-12 bg-white border-y border-gray-200">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-gray-600 mb-8 font-semibold">
            Vertrauenswürdige Datenquellen und Partner
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 grayscale">
            <div className="text-2xl font-bold text-gray-800">e.on</div>
            <div className="text-2xl font-bold text-gray-800">Wien Energie</div>
            <div className="text-2xl font-bold text-gray-800">OIB</div>
            <div className="text-2xl font-bold text-gray-800">Kommunalkredit</div>
            <div className="text-2xl font-bold text-gray-800">Umweltförderung.at</div>
          </div>
        </div>
      </section>

      {/* 3 Säulen */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Drei Säulen für sorgenfreies Immobilien-Management
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              ImmoWächter kümmert sich um alles, was Ihre Immobilie betrifft
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Wartungen */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-red-500 hover:shadow-2xl transition-shadow duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">        
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Wartungen & Sicherheit
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Automatische Erinnerungen an gesetzlich vorgeschriebene Wartungen (Gasthermen, Rauchfangkehrer,
                Brandschutz) – nach österreichischen OIB-Richtlinien.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  Thermenservice alle 1-2 Jahre
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  Rauchfangkehrer gemäß Landesgesetz
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  Feuerlöscher-Wartung alle 2 Jahre
                </li>
              </ul>
            </div>

            {/* Förderungen */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-green-500 hover:shadow-2xl transition-shadow duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">    
                <Gift className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Förderungen finden
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Wir durchsuchen automatisch verfügbare Bundes- und Landesförderungen
                für Sanierungen, Heizungstausch und Dämmung.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  Bis zu €24.000 Sanierungsförderung
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  Heizungstausch-Bonus bis €7.500
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  Photovoltaik-Förderung bis €5.000
                </li>
              </ul>
            </div>

            {/* Energie */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-blue-500 hover:shadow-2xl transition-shadow duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">      
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Energie-Sparservice
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Automatischer Vergleich Ihrer Strom- und Gastarife – wir zeigen Ihnen,
                wo Sie durch einen Anbieterwechsel sparen können.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  Ø €500/Jahr durch Anbieterwechsel
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  Automatischer Tarif-Vergleich
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  Erinnerung vor Vertragsende
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Bar */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">648</div>
              <div className="text-red-100 text-sm">CO-Vergiftungen/Jahr</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">€15.000</div>
              <div className="text-red-100 text-sm">Durchschn. Schaden bei vergessener Wartung</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">€24.000</div>
              <div className="text-red-100 text-sm">Max. Förderung für Sanierung</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">€500</div>
              <div className="text-red-100 text-sm">Ø Ersparnis durch Tarifwechsel/Jahr</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              So einfach funktioniert's
            </h2>
            <p className="text-xl text-gray-600">
              In 3 Schritten zu Ihrer sorgenfreien Immobilien-Verwaltung
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Immobilie erfassen
              </h3>
              <p className="text-gray-600">
                Geben Sie Ihre Immobiliendaten ein – wir erkennen automatisch, welche Wartungen notwendig sind
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Automatische Überwachung
              </h3>
              <p className="text-gray-600">
                ImmoWächter überwacht Fristen, Förderungen und Energietarife – komplett automatisch
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Erinnerung erhalten
              </h3>
              <p className="text-gray-600">
                Rechtzeitige Benachrichtigungen per E-Mail, SMS oder Push – Sie verpassen nichts mehr
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Das sagen unsere Beta-Tester
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: 'Maria Huber',
                location: 'Wien',
                rating: 5,
                text: 'Endlich den Überblick über alle Wartungstermine! Die Erinnerungen sind Gold wert.',
                initial: 'MH'
              },
              {
                name: 'Thomas Keller',
                location: 'Salzburg',
                rating: 5,
                text: 'Die Förderungs-Suche ist genial! Hätte nie gedacht, dass ich noch €18.000 bekommen kann.',
                initial: 'TK'
              },
              {
                name: 'Stefan Berger',
                location: 'Graz',
                rating: 5,
                text: 'Als Vermieter mit mehreren Objekten ist ImmoWächter unverzichtbar geworden.',
                initial: 'SB'
              }
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.initial}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-2 text-gray-700">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold">DSGVO-konform</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold">Österreichische Server</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Clock className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold">Kostenlose Testphase</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Users className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold">500+ Beta-Tester</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Häufig gestellte Fragen
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: "Welche Wartungen werden überwacht?",
                a: "ImmoWächter überwacht alle gesetzlich vorgeschriebenen Wartungen gemäß OIB-Richtlinien: Gasthermen-Service, Rauchfangkehrer-Termine, Feuerlöscher-Wartung, Brandschutztüren-Prüfung, und viele weitere."
              },
              {
                q: "Wie funktioniert der Förderungs-Finder?",
                a: "Wir durchsuchen automatisch alle verfügbaren Bundes- und Landesförderungen und benachrichtigen Sie, wenn eine Förderung für Ihre Immobilie verfügbar ist."
              },
              {
                q: "Ist ImmoWächter DSGVO-konform?",
                a: "Ja, alle Daten werden auf österreichischen Servern gespeichert und unterliegen strengsten Datenschutzrichtlinien nach DSGVO."    
              },
              {
                q: "Wie werden die Erinnerungen versendet?",
                a: "Per E-Mail, SMS oder Push-Notification – je nach Ihren Präferenzen. Sie können die Vorlaufzeit individuell einstellen."       
              },
              {
                q: "Kann ich jederzeit kündigen?",
                a: "Ja, Sie können jederzeit kündigen. Es gibt keine Mindestvertragslaufzeit."
              }
            ].map((faq, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Bereit für sorgenfreies Immobilien-Management?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-red-100">
            Melden Sie sich jetzt für unsere Warteliste an und erhalten Sie frühzeitigen Zugang
          </p>
          <a
            href="#waitlist"
            className="inline-block bg-white text-red-600 px-10 py-5 rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:shadow-3xl font-bold text-lg"
          >
            Jetzt auf Warteliste
          </a>
          <p className="mt-6 text-sm text-red-100">
            ✓ Kostenlose Registrierung • ✓ Keine Kreditkarte • ✓ DSGVO-konform
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer id="disclaimer" className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img 
                  src="/web-app-manifest-192x192.png" 
                  alt="ImmoWächter Logo" 
                  className="w-8 h-8"
                />
                <span className="text-xl font-bold text-white">ImmoWächter</span>
              </div>
              <p className="text-sm text-gray-400">
                Ihr digitaler Assistent für sichere und effiziente Immobilien-Verwaltung.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Kontakt</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="mailto:office@immowaechter.at" className="hover:text-white transition-colors">
                    office@immowaechter.at
                  </a>
                </li>
                <li>
                  <a href="https://wa.me/436766951814" className="hover:text-white transition-colors">
                    WhatsApp: +43 676 6951814
                  </a>
                </li>
		<li>
  		  <a href="/datenschutz" className="hover:text-red-400">
    		    Datenschutz
  		  </a>
		</li>
		<li>
  		  <a href="/agb" className="hover:text-red-400">
    		    AGB
  		  </a>
		</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#waitlist" className="hover:text-white transition-colors">Warteliste</a></li>
                <li><a href="#disclaimer" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Rechtliches</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/impressum" className="hover:text-white transition-colors">Impressum</a></li>
                <li><a href="/datenschutz" className="hover:text-white transition-colors">Datenschutz</a></li>
              </ul>
            </div>
          </div>

          {/* Full Disclaimer */}
          <div className="border-t border-gray-800 pt-8">
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h5 className="font-semibold text-white mb-3 flex items-center gap-2">
                <Info className="w-5 h-5 text-amber-500" />
                Wichtiger Haftungsausschluss
              </h5>
              <p className="text-sm text-gray-400 leading-relaxed">
                <strong>ImmoWächter</strong> ist ein digitaler Wartungsassistent, der Sie an gesetzliche Fristen
                und empfohlene Wartungsintervalle erinnert. Die Verantwortung für die Durchführung der Wartungen
                und die Einhaltung aller gesetzlichen Pflichten verbleibt beim Immobilienbesitzer. ImmoWächter
                ersetzt keine fachliche Beratung und übernimmt keine Haftung für Schäden, die durch versäumte
                Wartungen, fehlerhafte Angaben oder Systemausfälle entstehen. Alle Förderungs- und Tarifangaben
                sind unverbindlich und können sich ändern.
              </p>
            </div>

            <div className="text-center text-sm text-gray-500">
              <p>&copy; 2025 ImmoWächter. Alle Rechte vorbehalten.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}