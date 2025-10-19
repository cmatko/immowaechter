export default function AGBPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold mb-6">
            Allgemeine Geschäftsbedingungen (AGB)
          </h1>
          
          <div className="prose prose-gray max-w-none space-y-8">

            {/* PRÄAMBEL - WICHTIGSTER TEIL! */}
            <section className="bg-red-50 border-l-4 border-red-600 p-6">
              <h2 className="text-2xl font-bold mb-4 text-red-800">
                ⚠️ Wichtiger Hinweis - Haftungsausschluss
              </h2>
              <div className="space-y-3 text-gray-800">
                <p className="font-semibold text-lg">
                  ImmoWächter ist ein digitaler Wartungserinnerungs-Service und KEIN Ersatz für fachliche Beratung.
                </p>
                
                <p>
                  <strong>ImmoWächter dient ausschließlich als Erinnerungshilfe</strong> für Wartungsintervalle 
                  basierend auf öffentlich zugänglichen Informationen (OIB-Richtlinien, gesetzlichen Vorgaben und Herstellerangaben).
                </p>

                <div className="bg-white p-4 rounded mt-4">
                  <p className="font-bold mb-2">ImmoWächter ERSETZT NICHT:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Die fachliche Beratung durch qualifizierte Sachverständige</li>
                    <li>Die eigenständige Prüfung lokaler Vorschriften und Bundeslandgesetze</li>
                    <li>Die Berücksichtigung spezifischer Herstellervorgaben</li>
                    <li>Die rechtliche oder technische Beratung durch Fachbetriebe</li>
                  </ul>
                </div>

                <div className="bg-white p-4 rounded mt-4">
                  <p className="font-bold mb-2">Die Verantwortung liegt beim Nutzer:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Die Durchführung der Wartungen liegt in Ihrer Verantwortung</li>
                    <li>Die Beauftragung qualifizierter Fachbetriebe obliegt Ihnen</li>
                    <li>Die Dokumentation der Wartungen müssen Sie sicherstellen</li>
                    <li>Die Prüfung der Richtigkeit unserer Angaben ist Ihre Pflicht</li>
                  </ul>
                </div>

                <p className="font-bold text-red-700 mt-4">
                  ImmoWächter übernimmt KEINE Haftung für Schäden, die durch versäumte, 
                  verspätete oder falsch durchgeführte Wartungen entstehen - auch nicht bei 
                  Nutzung unseres Services.
                </p>
              </div>
            </section>

            {/* § 1 GELTUNGSBEREICH */}
            <section>
              <h2 className="text-2xl font-bold mb-4">§ 1 Geltungsbereich</h2>
              
              <p>
                (1) Diese Allgemeinen Geschäftsbedingungen (nachfolgend „AGB") gelten für alle 
                Verträge zwischen
              </p>
              
              <p className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
                Christian Matkovic<br />
                Innstraße 2/21<br />
                1200 Wien, Österreich<br />
                E-Mail: support@immowaechter.at<br />
                (nachfolgend „Anbieter")
              </p>

              <p>und den Nutzern der Software-as-a-Service Plattform „ImmoWächter" (nachfolgend „Nutzer").</p>

              <p className="mt-4">
                (2) Geschäftsbedingungen des Nutzers finden keine Anwendung, auch wenn der Anbieter 
                ihrer Geltung im Einzelfall nicht gesondert widerspricht.
              </p>

              <p className="mt-4">
                (3) Diese AGB gelten auch für alle zukünftigen Geschäfte mit dem Nutzer, 
                soweit es sich um Rechtsgeschäfte verwandter Art handelt.
              </p>
            </section>

            {/* § 2 VERTRAGSGEGENSTAND */}
            <section>
              <h2 className="text-2xl font-bold mb-4">§ 2 Vertragsgegenstand und Leistungsumfang</h2>
              
              <p>
                (1) ImmoWächter ist eine webbasierte Software (SaaS), die Nutzer bei der 
                Verwaltung von Wartungsterminen für Immobilien unterstützt.
              </p>

              <p className="mt-4">
                (2) Der Funktionsumfang umfasst insbesondere:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Verwaltung von Immobiliendaten</li>
                <li>Erfassung und Tracking von Wartungskomponenten</li>
                <li>Automatische Berechnung von Wartungsintervallen</li>
                <li>E-Mail-Benachrichtigungen vor fälligen Wartungen</li>
                <li>Dokumentation der Wartungshistorie</li>
              </ul>

              <p className="mt-4">
                (3) Der konkrete Leistungsumfang richtet sich nach dem vom Nutzer gewählten Tarif (Free, Plus, Premium, Professional).
              </p>

              <p className="mt-4 bg-blue-50 p-4 rounded">
                <strong>Wichtig:</strong> ImmoWächter stellt lediglich eine Software zur Verfügung. 
                Die Durchführung von Wartungen, die Beauftragung von Handwerkern und die Einhaltung 
                gesetzlicher Vorschriften obliegen ausschließlich dem Nutzer.
              </p>
            </section>

            {/* § 3 VERTRAGSSCHLUSS */}
            <section>
              <h2 className="text-2xl font-bold mb-4">§ 3 Vertragsschluss und Registrierung</h2>
              
              <p>
                (1) Mit der Registrierung gibt der Nutzer ein verbindliches Angebot zum 
                Abschluss eines Nutzungsvertrags ab.
              </p>

              <p className="mt-4">
                (2) Der Vertrag kommt zustande durch:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Bestätigung der Registrierung per E-Mail (bei Free-Account)</li>
                <li>Erfolgreiche Zahlung bei kostenpflichtigen Tarifen</li>
              </ul>

              <p className="mt-4">
                (3) Der Nutzer muss bei der Registrierung korrekte und vollständige Angaben machen. 
                Änderungen sind unverzüglich mitzuteilen.
              </p>

              <p className="mt-4">
                (4) Ein Anspruch auf Vertragsabschluss besteht nicht. Der Anbieter kann 
                Registrierungen ohne Angabe von Gründen ablehnen.
              </p>
            </section>

            {/* § 4 NUTZUNGSRECHTE */}
            <section>
              <h2 className="text-2xl font-bold mb-4">§ 4 Nutzungsrechte</h2>
              
              <p>
                (1) Der Anbieter räumt dem Nutzer für die Dauer des Vertrags ein nicht 
                ausschließliches, nicht übertragbares Recht zur Nutzung der Software ein.
              </p>

              <p className="mt-4">
                (2) Der Nutzer ist nicht berechtigt:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Die Software zu vervielfältigen, zu bearbeiten oder zu verändern</li>
                <li>Die Software an Dritte weiterzugeben oder zu vermieten</li>
                <li>Die Software zurückzuentwickeln (Reverse Engineering)</li>
                <li>Schutzvermerke zu entfernen oder zu verändern</li>
              </ul>

              <p className="mt-4">
                (3) Alle Rechte an der Software und ihren Bestandteilen verbleiben beim Anbieter.
              </p>
            </section>

            {/* § 5 PREISE UND ZAHLUNGSBEDINGUNGEN */}
            <section>
              <h2 className="text-2xl font-bold mb-4">§ 5 Preise und Zahlungsbedingungen</h2>
              
              <p>
                (1) Es gelten die zum Zeitpunkt der Bestellung auf der Website angegebenen Preise.
              </p>

              <p className="mt-4">
                (2) <strong>Aktuelle Preise (Stand Oktober 2025):</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2 bg-gray-50 p-4 rounded">
                <li><strong>Starter:</strong> €0,00/Monat (begrenzte Funktionen)</li>
                <li><strong>Plus:</strong> €4,99/Monat</li>
                <li><strong>Premium:</strong> €9,99/Monat</li>
                <li><strong>Professional:</strong> €19,99/Monat</li>
              </ul>

              <p className="mt-4">
                (3) Alle Preise verstehen sich inklusive der gesetzlichen Umsatzsteuer.
              </p>

              <p className="mt-4">
                (4) Die Zahlung erfolgt monatlich im Voraus über den Zahlungsdienstleister Stripe. 
                Akzeptiert werden Kreditkarte und SEPA-Lastschrift.
              </p>

              <p className="mt-4">
                (5) Bei Zahlungsverzug ist der Anbieter berechtigt, den Zugang zu sperren und 
                Verzugszinsen in gesetzlicher Höhe zu berechnen.
              </p>

              <p className="mt-4">
                (6) Der Anbieter behält sich Preisanpassungen vor. Bestehende Verträge werden 
                mindestens 4 Wochen vor Inkrafttreten der neuen Preise informiert.
              </p>
            </section>

            {/* § 6 VERTRAGSLAUFZEIT UND KÜNDIGUNG */}
            <section>
              <h2 className="text-2xl font-bold mb-4">§ 6 Vertragslaufzeit und Kündigung</h2>
              
              <p>
                (1) <strong>Free-Account:</strong> Keine Mindestlaufzeit, kann jederzeit beendet werden.
              </p>

              <p className="mt-4">
                (2) <strong>Bezahlte Tarife:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Monatliche Abrechnung</li>
                <li>Keine Mindestvertragslaufzeit</li>
                <li>Kündigung jederzeit zum Monatsende möglich</li>
                <li>Kündigungsfrist: bis zum letzten Tag des laufenden Abrechnungszeitraums</li>
              </ul>

              <p className="mt-4">
                (3) Die Kündigung muss in Textform erfolgen (E-Mail an support@immowaechter.at 
                oder über die Account-Einstellungen).
              </p>

              <p className="mt-4">
                (4) Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt.
              </p>

              <p className="mt-4">
                (5) Nach Vertragsende werden alle Nutzerdaten innerhalb von 30 Tagen unwiderruflich gelöscht, 
                soweit keine gesetzlichen Aufbewahrungspflichten bestehen.
              </p>
            </section>

            {/* § 7 WIDERRUFSRECHT */}
            <section>
              <h2 className="text-2xl font-bold mb-4">§ 7 Widerrufsrecht für Verbraucher</h2>
              
              <div className="bg-blue-50 border-2 border-blue-400 p-6 rounded">
                <h3 className="font-bold text-lg mb-3">Widerrufsbelehrung</h3>
                
                <p className="font-semibold">Widerrufsrecht:</p>
                <p className="mt-2">
                  Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen 
                  Vertrag zu widerrufen.
                </p>

                <p className="mt-4">
                  Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses.
                </p>

                <p className="mt-4">
                  Um Ihr Widerrufsrecht auszuüben, müssen Sie uns mittels einer eindeutigen 
                  Erklärung (z.B. ein mit der Post versandter Brief oder E-Mail) über Ihren 
                  Entschluss, diesen Vertrag zu widerrufen, informieren.
                </p>

                <p className="mt-4">
                  <strong>Adresse für Widerruf:</strong><br />
                  support@immowaechter.at
                </p>

                <p className="mt-4 font-semibold">Folgen des Widerrufs:</p>
                <p className="mt-2">
                  Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von 
                  Ihnen erhalten haben, unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag 
                  zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns 
                  eingegangen ist.
                </p>

                <p className="mt-4 bg-yellow-50 p-3 rounded">
                  <strong>Vorzeitige Leistungserbringung:</strong><br />
                  Haben Sie verlangt, dass die Dienstleistung während der Widerrufsfrist beginnen soll, 
                  so haben Sie uns einen angemessenen Betrag zu zahlen, der dem Anteil der bis zu dem 
                  Zeitpunkt erbrachten Dienstleistungen entspricht.
                </p>
              </div>
            </section>

            {/* § 8 VERFÜGBARKEIT UND GEWÄHRLEISTUNG */}
            <section>
              <h2 className="text-2xl font-bold mb-4">§ 8 Verfügbarkeit und Gewährleistung</h2>
              
              <p>
                (1) Der Anbieter strebt eine Verfügbarkeit von 99% im Jahresmittel an. 
                Wartungsarbeiten und höhere Gewalt sind hiervon ausgenommen.
              </p>

              <p className="mt-4">
                (2) Der Anbieter gewährleistet nicht:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Die Fehlerfreiheit der Software</li>
                <li>Die ununterbrochene Verfügbarkeit</li>
                <li>Die Eignung für einen bestimmten Zweck</li>
                <li>Die Vollständigkeit oder Richtigkeit der Wartungsintervalle</li>
              </ul>

              <p className="mt-4">
                (3) Bei Mängeln wird der Anbieter nach eigener Wahl nachbessern oder Ersatz liefern.
              </p>

              <p className="mt-4">
                (4) Gesetzliche Gewährleistungsrechte bleiben unberührt.
              </p>
            </section>

            {/* § 9 HAFTUNG - KRITISCHSTER TEIL! */}
            <section className="bg-red-50 border-2 border-red-600 p-6 rounded">
              <h2 className="text-2xl font-bold mb-4 text-red-800">
                § 9 Haftungsbeschränkung
              </h2>
              
              <p className="font-semibold text-lg mb-4">
                ⚠️ WICHTIG: Bitte aufmerksam lesen!
              </p>

              <p>
                (1) <strong>Haftung bei Vorsatz und grober Fahrlässigkeit:</strong><br />
                Der Anbieter haftet unbeschränkt für Schäden aus der Verletzung des Lebens, 
                des Körpers oder der Gesundheit sowie bei Vorsatz und grober Fahrlässigkeit.
              </p>

              <p className="mt-4">
                (2) <strong>Haftung bei leichter Fahrlässigkeit:</strong><br />
                Bei leichter Fahrlässigkeit haftet der Anbieter nur bei Verletzung wesentlicher 
                Vertragspflichten (Kardinalpflichten). Die Haftung ist dabei auf den 
                vertragstypischen, vorhersehbaren Schaden begrenzt.
              </p>

              <p className="mt-4">
                (3) <strong>Haftungsausschluss für Wartungsversäumnisse:</strong>
              </p>
              <div className="bg-white p-4 rounded mt-2 space-y-2">
                <p className="font-bold">Der Anbieter haftet NICHT für Schäden, die entstehen durch:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Versäumte, verspätete oder falsch durchgeführte Wartungen</li>
                  <li>Fehlerhafte oder unvollständige Wartungsintervall-Angaben</li>
                  <li>Nicht erfolgte oder verspätete E-Mail-Benachrichtigungen</li>
                  <li>Versicherungsausfälle aufgrund versäumter Wartungen</li>
                  <li>Gesundheitsschäden (z.B. CO-Vergiftung, Legionellen)</li>
                  <li>Sachschäden an Immobilien oder Komponenten</li>
                  <li>Behördliche Strafen oder Bußgelder</li>
                  <li>Rechtliche Konsequenzen (zivil- oder strafrechtlich)</li>
                </ul>
                <p className="font-bold mt-4 text-red-700">
                  Die alleinige Verantwortung für die Durchführung gesetzlich vorgeschriebener 
                  und empfohlener Wartungen liegt beim Nutzer!
                </p>
              </div>

              <p className="mt-4">
                (4) <strong>Haftungshöchstgrenze:</strong><br />
                Soweit die Haftung des Anbieters ausgeschlossen oder beschränkt ist, gilt dies 
                auch für die persönliche Haftung der Angestellten, Vertreter und Erfüllungsgehilfen. 
                Die Haftung ist in jedem Fall auf den Betrag der im letzten Jahr gezahlten Gebühren 
                begrenzt, maximal jedoch €1.000.
              </p>

              <p className="mt-4">
                (5) Die Datensicherung obliegt dem Nutzer. Der Anbieter haftet nicht für Datenverlust, 
                soweit der Schaden darauf beruht, dass es der Nutzer unterlassen hat, Datensicherungen 
                durchzuführen.
              </p>
            </section>

            {/* § 10 PFLICHTEN DES NUTZERS */}
            <section>
              <h2 className="text-2xl font-bold mb-4">§ 10 Pflichten des Nutzers</h2>
              
              <p>(1) Der Nutzer verpflichtet sich:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Nur wahre und vollständige Angaben zu machen</li>
                <li>Seine Zugangsdaten geheim zu halten</li>
                <li>Den Account nicht an Dritte weiterzugeben</li>
                <li>Die Software nur im Rahmen der gesetzlichen Bestimmungen zu nutzen</li>
                <li>Keine Schadsoftware hochzuladen</li>
                <li>Die eigenständige Prüfung der Wartungsintervalle auf Richtigkeit und Vollständigkeit</li>
                <li>Die eigenständige Beauftragung qualifizierter Fachbetriebe</li>
              </ul>

              <p className="mt-4">
                (2) Der Nutzer ist für alle Aktivitäten verantwortlich, die unter seinem Account 
                durchgeführt werden.
              </p>

              <p className="mt-4 bg-yellow-50 p-4 rounded">
                <strong>(3) Wichtig:</strong> Der Nutzer erkennt an, dass ImmoWächter lediglich 
                eine Erinnerungshilfe darstellt und keine Beratungsleistung erbringt. Die Verantwortung 
                für die Einhaltung aller gesetzlichen und vertraglichen Wartungspflichten liegt 
                ausschließlich beim Nutzer.
              </p>
            </section>

            {/* § 11 DATENSCHUTZ */}
            <section>
              <h2 className="text-2xl font-bold mb-4">§ 11 Datenschutz</h2>
              
              <p>
                (1) Der Anbieter verarbeitet personenbezogene Daten im Einklang mit der 
                Datenschutz-Grundverordnung (DSGVO) und dem österreichischen Datenschutzgesetz.
              </p>

              <p className="mt-4">
                (2) Details zur Datenverarbeitung finden sich in unserer{' '}
                <a href="/datenschutz" className="text-red-600 hover:underline font-semibold">
                  Datenschutzerklärung
                </a>.
              </p>

              <p className="mt-4">
                (3) Der Nutzer willigt ein, dass seine Daten zum Zweck der Vertragserfüllung 
                verarbeitet werden.
              </p>
            </section>

            {/* § 12 SCHLUSSBESTIMMUNGEN */}
            <section>
              <h2 className="text-2xl font-bold mb-4">§ 12 Schlussbestimmungen</h2>
              
              <p>
                (1) Es gilt österreichisches Recht unter Ausschluss des UN-Kaufrechts.
              </p>

              <p className="mt-4">
                (2) Erfüllungsort und ausschließlicher Gerichtsstand ist Wien, sofern der 
                Nutzer Kaufmann, juristische Person des öffentlichen Rechts oder 
                öffentlich-rechtliches Sondervermögen ist.
              </p>

              <p className="mt-4">
                (3) Sollten einzelne Bestimmungen dieser AGB unwirksam sein, berührt dies die 
                Wirksamkeit der übrigen Bestimmungen nicht.
              </p>

              <p className="mt-4">
                (4) Änderungen dieser AGB werden dem Nutzer mindestens 4 Wochen vor Inkrafttreten 
                per E-Mail mitgeteilt. Widerspricht der Nutzer nicht innerhalb von 4 Wochen, 
                gelten die geänderten AGB als angenommen.
              </p>
            </section>

            {/* STAND */}
            <section className="bg-gray-100 p-6 rounded mt-8">
              <p className="bg-yellow-50 border-l-4 border-yellow-400 p-4">

                Stand: 19. Oktober 2025
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}