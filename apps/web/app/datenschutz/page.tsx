export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold mb-6">Datenschutzerklärung</h1>
          
          <div className="prose prose-gray max-w-none space-y-8">
            
            {/* ABSCHNITT 1: Verantwortlicher */}
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Verantwortlicher</h2>
              <p>
                Verantwortlich für die Datenverarbeitung auf dieser Website ist:
              </p>
              <p className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
                <strong>👉 HIER DEINE DATEN EINFÜGEN:</strong><br />
                Christian Matkovic<br />
                Innstraße 2/21<br />
                1200 Wien<br />
                Österreich<br />
                <br />
                E-Mail: support@immowaechter.at<br />
              </p>
            </section>

            {/* ABSCHNITT 2: Erhebung und Speicherung */}
            <section>
              <h2 className="text-2xl font-bold mb-4">2. Erhebung und Speicherung personenbezogener Daten</h2>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">2.1 Beim Besuch der Website</h3>
              <p>
                Beim Aufrufen unserer Website www.immowaechter.at werden durch den auf Ihrem Endgerät 
                zum Einsatz kommenden Browser automatisch Informationen an den Server unserer Website gesendet. 
                Diese Informationen werden temporär in einem sogenannten Logfile gespeichert.
              </p>
              <p>Folgende Informationen werden dabei ohne Ihr Zutun erfasst und bis zur automatisierten Löschung gespeichert:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>IP-Adresse des anfragenden Rechners</li>
                <li>Datum und Uhrzeit des Zugriffs</li>
                <li>Name und URL der abgerufenen Datei</li>
                <li>Website, von der aus der Zugriff erfolgt (Referrer-URL)</li>
                <li>Verwendeter Browser und ggf. das Betriebssystem Ihres Rechners</li>
              </ul>
              <p className="mt-4">
                <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der 
                Sicherstellung der Funktionsfähigkeit)
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">2.2 Bei Registrierung</h3>
              <p>Bei der Registrierung für unseren Service erheben wir folgende Daten:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>E-Mail-Adresse (Pflichtangabe)</li>
                <li>Vollständiger Name (optional)</li>
                <li>Passwort (verschlüsselt gespeichert)</li>
                <li>Telefonnummer (optional)</li>
              </ul>
              <p className="mt-4">
                <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">2.3 Bei Nutzung des Services</h3>
              <p>Während der Nutzung von ImmoWächter speichern wir:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Informationen zu Ihren Immobilien (Adresse, Baujahr, etc.)</li>
                <li>Wartungsdaten und -historien</li>
                <li>Benachrichtigungseinstellungen</li>
                <li>Zahlungsinformationen (über Stripe - siehe Punkt 4.3)</li>
              </ul>
              <p className="mt-4">
                <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)
              </p>
            </section>

            {/* ABSCHNITT 3: Weitergabe von Daten */}
            <section>
              <h2 className="text-2xl font-bold mb-4">3. Weitergabe von Daten</h2>
              <p>
                Eine Übermittlung Ihrer persönlichen Daten an Dritte zu anderen als den im Folgenden 
                aufgeführten Zwecken findet nicht statt. Wir geben Ihre persönlichen Daten nur an Dritte weiter, wenn:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Sie Ihre ausdrückliche Einwilligung dazu erteilt haben (Art. 6 Abs. 1 S. 1 lit. a DSGVO)</li>
                <li>dies für die Vertragsabwicklung erforderlich ist (Art. 6 Abs. 1 S. 1 lit. b DSGVO)</li>
                <li>eine rechtliche Verpflichtung besteht (Art. 6 Abs. 1 S. 1 lit. c DSGVO)</li>
              </ul>
            </section>

            {/* ABSCHNITT 4: Eingesetzte Dienste */}
            <section>
              <h2 className="text-2xl font-bold mb-4">4. Eingesetzte Dienste und Tools</h2>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">4.1 Supabase (Datenbank & Authentifizierung)</h3>
              <p>
                Wir nutzen Supabase für die Speicherung Ihrer Daten und die Authentifizierung. 
                Supabase ist ein Service der Supabase Inc., USA.
              </p>
              <p><strong>Verarbeitete Daten:</strong> Registrierungsdaten, Immobiliendaten, Nutzungsdaten</p>
              <p><strong>Serverstandort:</strong> EU (Frankfurt, Deutschland)</p>
              <p><strong>Datenschutzerklärung:</strong> <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">https://supabase.com/privacy</a></p>
              <p><strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)</p>

              <h3 className="text-xl font-semibold mt-6 mb-3">4.2 Vercel (Hosting)</h3>
              <p>
                Diese Website wird auf Servern von Vercel Inc., USA, gehostet.
              </p>
              <p><strong>Verarbeitete Daten:</strong> Logfiles, IP-Adressen, Zugriffsdaten</p>
              <p><strong>Serverstandort:</strong> EU</p>
              <p><strong>Datenschutzerklärung:</strong> <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">https://vercel.com/legal/privacy-policy</a></p>
              <p><strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)</p>

              <h3 className="text-xl font-semibold mt-6 mb-3">4.3 Stripe (Zahlungsabwicklung)</h3>
              <p>
                Für die Zahlungsabwicklung nutzen wir Stripe, einen Service der Stripe Inc., USA.
              </p>
              <p><strong>Verarbeitete Daten:</strong> Zahlungsdaten, Rechnungsadresse, Transaktionsdaten</p>
              <p>
                <strong>Wichtig:</strong> Wir speichern KEINE vollständigen Kreditkartendaten. 
                Diese werden ausschließlich von Stripe verarbeitet.
              </p>
              <p><strong>Datenschutzerklärung:</strong> <a href="https://stripe.com/de-at/privacy" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">https://stripe.com/de-at/privacy</a></p>
              <p><strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)</p>

              <h3 className="text-xl font-semibold mt-6 mb-3">4.4 Resend (E-Mail-Versand)</h3>
              <p>
                Für den Versand von Benachrichtigungs-E-Mails nutzen wir Resend.
              </p>
              <p><strong>Verarbeitete Daten:</strong> E-Mail-Adresse, Name, Benachrichtigungsinhalte</p>
              <p><strong>Datenschutzerklärung:</strong> <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">https://resend.com/legal/privacy-policy</a></p>
              <p><strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)</p>
            </section>

            {/* ABSCHNITT 5: Cookies */}
            <section>
              <h2 className="text-2xl font-bold mb-4">5. Cookies</h2>
              <p>
                Unsere Website verwendet sogenannte "technisch notwendige Cookies". 
                Cookies sind kleine Textdateien, die auf Ihrem Endgerät gespeichert werden.
              </p>
              <p className="mt-4">
                <strong>Verwendete Cookies:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Session-Cookie:</strong> Für die Authentifizierung (wird nach dem Logout gelöscht)</li>
                <li><strong>Einstellungs-Cookie:</strong> Speichert Ihre Präferenzen (30 Tage Gültigkeit)</li>
              </ul>
              <p className="mt-4">
                Sie können Ihren Browser so einstellen, dass Sie über das Setzen von Cookies informiert werden 
                und einzeln über deren Annahme entscheiden oder die Annahme von Cookies für bestimmte Fälle 
                oder generell ausschließen.
              </p>
              <p><strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)</p>
            </section>

            {/* ABSCHNITT 6: Ihre Rechte */}
            <section>
              <h2 className="text-2xl font-bold mb-4">6. Ihre Rechte als betroffene Person</h2>
              <p>Sie haben folgende Rechte:</p>
              
              <div className="space-y-4 mt-4">
                <div className="bg-blue-50 p-4 rounded">
                  <h4 className="font-bold">📋 Recht auf Auskunft (Art. 15 DSGVO)</h4>
                  <p className="text-sm mt-2">
                    Sie können Auskunft über Ihre von uns verarbeiteten personenbezogenen Daten verlangen.
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded">
                  <h4 className="font-bold">✏️ Recht auf Berichtigung (Art. 16 DSGVO)</h4>
                  <p className="text-sm mt-2">
                    Sie können die Berichtigung unrichtiger Daten verlangen.
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded">
                  <h4 className="font-bold">🗑️ Recht auf Löschung (Art. 17 DSGVO)</h4>
                  <p className="text-sm mt-2">
                    Sie können die Löschung Ihrer Daten verlangen, sofern keine gesetzlichen Aufbewahrungspflichten bestehen.
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded">
                  <h4 className="font-bold">⛔ Recht auf Einschränkung (Art. 18 DSGVO)</h4>
                  <p className="text-sm mt-2">
                    Sie können die Einschränkung der Verarbeitung Ihrer Daten verlangen.
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded">
                  <h4 className="font-bold">📦 Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</h4>
                  <p className="text-sm mt-2">
                    Sie können verlangen, dass wir Ihre Daten in einem strukturierten Format bereitstellen.
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded">
                  <h4 className="font-bold">🚫 Widerspruchsrecht (Art. 21 DSGVO)</h4>
                  <p className="text-sm mt-2">
                    Sie können der Verarbeitung Ihrer Daten widersprechen.
                  </p>
                </div>
              </div>

              <p className="mt-6 font-semibold">
                Zur Ausübung Ihrer Rechte kontaktieren Sie uns bitte unter: 
                <a href="mailto:support@immowaechter.at" className="text-red-600 hover:underline ml-1">
                  support@immowaechter.at
                </a>
              </p>
            </section>

            {/* ABSCHNITT 7: Beschwerderecht */}
            <section>
              <h2 className="text-2xl font-bold mb-4">7. Beschwerderecht bei der Aufsichtsbehörde</h2>
              <p>
                Sie haben das Recht, sich bei der zuständigen Aufsichtsbehörde zu beschweren:
              </p>
              <p className="mt-4 bg-gray-50 p-4 rounded">
                <strong>Österreichische Datenschutzbehörde</strong><br />
                Barichgasse 40-42<br />
                1030 Wien<br />
                Telefon: +43 1 52 152-0<br />
                E-Mail: <a href="mailto:dsb@dsb.gv.at" className="text-red-600 hover:underline">dsb@dsb.gv.at</a><br />
                Website: <a href="https://www.dsb.gv.at" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">www.dsb.gv.at</a>
              </p>
            </section>

            {/* ABSCHNITT 8: Datensicherheit */}
            <section>
              <h2 className="text-2xl font-bold mb-4">8. Datensicherheit</h2>
              <p>
                Wir verwenden innerhalb des Website-Besuchs das verbreitete SSL-Verfahren (Secure Socket Layer) 
                in Verbindung mit der jeweils höchsten Verschlüsselungsstufe, die von Ihrem Browser unterstützt wird.
              </p>
              <p className="mt-4">
                <strong>Sicherheitsmaßnahmen:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>SSL/TLS-Verschlüsselung aller Datenübertragungen</li>
                <li>Verschlüsselte Speicherung von Passwörtern</li>
                <li>Regelmäßige Sicherheitsupdates</li>
                <li>Zugriffsbeschränkung auf personenbezogene Daten</li>
                <li>Regelmäßige Backups</li>
              </ul>
            </section>

            {/* ABSCHNITT 9: Speicherdauer */}
            <section>
              <h2 className="text-2xl font-bold mb-4">9. Speicherdauer</h2>
              <p>
                Wir speichern Ihre Daten nur so lange, wie dies zur Erfüllung der Zwecke erforderlich ist 
                oder gesetzliche Aufbewahrungsfristen bestehen.
              </p>
              <p className="mt-4">
                <strong>Konkret bedeutet das:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Nutzerdaten:</strong> Bis zur Löschung des Accounts</li>
                <li><strong>Wartungsdaten:</strong> Bis zur Löschung des Accounts</li>
                <li><strong>Rechnungsdaten:</strong> 7 Jahre (gesetzliche Aufbewahrungspflicht)</li>
                <li><strong>Server-Logs:</strong> 30 Tage</li>
                <li><strong>E-Mail-Logs:</strong> 90 Tage</li>
              </ul>
            </section>

            {/* ABSCHNITT 10: Aktualität */}
            <section>
              <h2 className="text-2xl font-bold mb-4">10. Aktualität und Änderung dieser Datenschutzerklärung</h2>
              <p>
                Diese Datenschutzerklärung ist aktuell gültig und hat den Stand Oktober 2025.
              </p>
              <p className="mt-4">
                Durch die Weiterentwicklung unserer Website oder aufgrund geänderter gesetzlicher 
                beziehungsweise behördlicher Vorgaben kann es notwendig werden, diese Datenschutzerklärung zu ändern.
              </p>
              <p className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <strong>👉 HIER DATUM EINFÜGEN:</strong><br />
                Stand: [Heutiges Datum einfügen, z.B. "19. Oktober 2025"]
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}