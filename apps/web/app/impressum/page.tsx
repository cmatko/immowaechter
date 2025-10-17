export default function Impressum() {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Impressum</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Angaben gemäß § 5 TMG</h2>
            <p className="text-gray-700">
              [Ihr Name / Firmenname]<br />
              [Straße Hausnummer]<br />
              [PLZ Ort]<br />
              Österreich
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Kontakt</h2>
            <p className="text-gray-700">
              E-Mail: office@immowaechter.at<br />
              WhatsApp: +43 676 6951814
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Hinweis</h2>
            <p className="text-gray-700">
              Diese Seite befindet sich noch im Aufbau. Vollständige Impressums-Daten 
              werden vor dem offiziellen Launch ergänzt.
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