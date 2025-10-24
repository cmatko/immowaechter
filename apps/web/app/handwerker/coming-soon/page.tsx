'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Wrench, ArrowLeft, Bell } from 'lucide-react';
import { useState } from 'react';

export default function HandwerkerComingSoonPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const componentType = searchParams.get('component') || 'Wartung';
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNotifyMe = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Später zu Waitlist hinzufügen
    setSubscribed(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Zurück
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          {/* Icon */}
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Wrench className="w-10 h-10 text-purple-600" />
          </div>

          {/* Heading */}
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            🚧 Handwerker-Vermittlung
          </h1>
          <p className="text-xl text-center text-purple-600 font-semibold mb-6">
            Kommt sehr bald!
          </p>

          {/* Description */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <p className="text-gray-700 text-center mb-4">
              Wir bauen gerade ein <strong>Netzwerk von geprüften Partnerbetrieben</strong> auf,
              die Sie bei Ihrer Wartung unterstützen:
            </p>
            
            <div className="space-y-3 text-left max-w-md mx-auto">
              <div className="flex items-start gap-3">
                <span className="text-green-600 text-xl flex-shrink-0">✓</span>
                <span className="text-gray-700">Qualifizierte Handwerker aus Ihrer Region</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-600 text-xl flex-shrink-0">✓</span>
                <span className="text-gray-700">Faire Preise & transparente Angebote</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-600 text-xl flex-shrink-0">✓</span>
                <span className="text-gray-700">Direktbuchung über ImmoWächter</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-600 text-xl flex-shrink-0">✓</span>
                <span className="text-gray-700">Bewertungen & Garantien</span>
              </div>
            </div>
          </div>

          {/* Component Specific Message */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-gray-700 text-center">
              <strong>Ihre Anfrage:</strong> {componentType}
            </p>
            <p className="text-xs text-gray-600 text-center mt-2">
              💡 Wir informieren Sie, sobald die Handwerker-Vermittlung verfügbar ist!
            </p>
          </div>

          {/* Email Subscription */}
          {!subscribed ? (
            <form onSubmit={handleNotifyMe} className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                <Bell className="w-4 h-4 inline mr-2" />
                Benachrichtigen Sie mich, wenn es losgeht:
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ihre@email.at"
                  required
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium whitespace-nowrap"
                >
                  Benachrichtigen
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
              <p className="text-green-800 text-center font-medium">
                ✅ Perfekt! Wir informieren Sie per E-Mail, sobald die Handwerker-Vermittlung verfügbar ist.
              </p>
            </div>
          )}

          {/* Timeline */}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-900 mb-4 text-center">📅 Geplanter Launch:</h3>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-center text-purple-900 font-bold text-lg">
                Dezember 2025
              </p>
              <p className="text-center text-purple-700 text-sm mt-1">
                Start mit Wien, danach Expansion in ganz Österreich
              </p>
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-8">
            <button
              onClick={() => router.back()}
              className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Zurück zur Immobilie
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Sie möchten Handwerker-Partner werden?{' '}
          <a href="mailto:partner@immowaechter.at" className="text-purple-600 hover:underline">
            Kontaktieren Sie uns
          </a>
        </p>
      </div>
    </div>
  );
}




