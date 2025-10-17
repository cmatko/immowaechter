export default function Datenschutz() {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Datenschutzerklärung</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Datenschutz auf einen Blick</h2>
            <p className="text-gray-700">
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren 
              personenbezogenen Daten passiert, wenn Sie diese Website besuchen.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Datenerfassung auf dieser Website</h2>
            <h3 className="text-xl font-semibold mb-2">Warteliste</h3>
            <p className="text-gray-700 mb-4">
              Wenn Sie sich auf unsere Warteliste eintragen, speichern wir Ihre E-Mail-Adresse. 
              Diese wird ausschließlich verwendet, um Sie über den Launch von ImmoWächter zu informieren.
            </p>
            <h3 className="text-xl font-semibold mb-2">Analytics</h3>
            <p className="text-gray-700">
              Wir verwenden Vercel Analytics zur Analyse des Nutzerverhaltens. 
              Diese Daten werden anonymisiert erfasst und sind DSGVO-konform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Ihre Rechte</h2>
            <p className="text-gray-700">
              Sie haben jederzeit das Recht auf Auskunft, Berichtigung, Löschung und 
              Einschränkung der Verarbeitung Ihrer personenbezogenen Daten.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Kontakt</h2>
            <p className="text-gray-700">
              Bei Fragen zum Datenschutz erreichen Sie uns unter:<br />
              E-Mail: office@immowaechter.at
            </p>
          </section>

          <div className="pt-8 border-t">
            <a href="/" className="text-red-600 hover:text-red-700 font-semibold">
              ← Zurück zur Startseite
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}