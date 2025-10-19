// app/impressum/page.tsx

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold mb-6">Impressum</h1>
          
          <div className="prose prose-gray max-w-none space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">
                Informationspflicht laut §5 E-Commerce Gesetz
              </h2>
              <p>
                [Dein vollständiger Name]<br />
                [Straße Hausnummer]<br />
                [PLZ] Wien<br />
                Österreich
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-2">Kontakt</h2>
              <p>
                E-Mail:{' '}
                <a href="mailto:support@immowaechter.at" className="text-red-600">
                  support@immowaechter.at
                </a>
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-2">EU-Streitschlichtung</h2>
              <p>
                Die Europäische Kommission stellt eine Plattform zur 
                Online-Streitbeilegung (OS) bereit:{' '}
                <a 
                  href="https://ec.europa.eu/consumers/odr/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 hover:underline"
                >
                  https://ec.europa.eu/consumers/odr/
                </a>
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-2">Haftungsausschluss</h2>
              <p>
                Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. 
                Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte 
                können wir jedoch keine Gewähr übernehmen.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}