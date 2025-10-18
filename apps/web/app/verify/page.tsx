import { createClient } from '@supabase/supabase-js';

// ⚠️ WICHTIG: Service Role Key verwenden!
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const token = searchParams.token;

  // Kein Token -> Error
  if (!token) {
    return <VerificationError message="Ungültiger Bestätigungslink." />;
  }

  // Token in Datenbank suchen
  const { data, error } = await supabase
    .from('waitlist')
    .select('email, verified, token_expires_at')
    .eq('verification_token', token)
    .single();

  // Token nicht gefunden
  if (error || !data) {
    return <VerificationError message="Dieser Bestätigungslink ist ungültig oder wurde bereits verwendet." />;
  }

  // Bereits verifiziert
  if (data.verified) {
    return <VerificationSuccess email={data.email} alreadyVerified={true} />;
  }

  // Token abgelaufen (nur wenn token_expires_at gesetzt ist)
  if (data.token_expires_at) {
    const expiresAt = new Date(data.token_expires_at);
    if (expiresAt < new Date()) {
      return <VerificationError message="Dieser Bestätigungslink ist abgelaufen. Bitte fordern Sie einen neuen an." />;
    }
  }

  // Email verifizieren
  const { error: updateError } = await supabase
    .from('waitlist')
    .update({
      verified: true,
      verified_at: new Date().toISOString(),
      verification_token: null,
    })
    .eq('verification_token', token);

  if (updateError) {
    console.error('Verification update error:', updateError);
    return <VerificationError message="Ein Fehler ist aufgetreten. Bitte kontaktieren Sie uns." />;
  }

  // Erfolg!
  return <VerificationSuccess email={data.email} alreadyVerified={false} />;
}

// Success Component
function VerificationSuccess({ 
  email, 
  alreadyVerified 
}: { 
  email: string; 
  alreadyVerified: boolean;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          {alreadyVerified ? 'Bereits bestätigt!' : 'Email bestätigt!'}
        </h1>

        <p className="text-gray-600 mb-6">
          {alreadyVerified 
            ? `Die Email-Adresse ${email} wurde bereits erfolgreich bestätigt.`
            : `Vielen Dank! Die Email-Adresse ${email} wurde erfolgreich bestätigt.`
          }
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-amber-800">
            🚀 Sie erhalten Updates zum Launch und sind unter den Ersten, die ImmoWächter nutzen können!
          </p>
        </div>

        <a
          href="/"
          className="inline-block bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
        >
          Zurück zur Startseite
        </a>
      </div>
    </div>
  );
}

// Error Component
function VerificationError({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Bestätigung fehlgeschlagen
        </h1>

        <p className="text-gray-600 mb-6">{message}</p>

        <div className="space-y-3">
          <a
            href="/"
            className="block bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Zur Startseite
          </a>
          
          <a
            href="/#waitlist"
            className="block bg-gray-100 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Erneut anmelden
          </a>
        </div>
      </div>
    </div>
  );
}