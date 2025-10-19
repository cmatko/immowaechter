'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function DeletePropertyButton({ propertyId, propertyName }: { propertyId: string; propertyName: string }) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);

    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', propertyId);

    if (error) {
      alert('Fehler beim Löschen: ' + error.message);
      setDeleting(false);
      setShowConfirm(false);
      return;
    }

    // Success
    window.location.href = '/dashboard';
    router.refresh();
  };

  return (
    <>
      {/* Delete Button */}
      <button
        onClick={() => setShowConfirm(true)}
        className="px-4 py-2 border border-red-600 text-red-600 rounded-lg font-medium hover:bg-red-50 transition"
      >
        🗑️ Löschen
      </button>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            {/* Icon */}
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
              Immobilie wirklich löschen?
            </h2>

            {/* Property Name */}
            <p className="text-center mb-4 text-gray-700">
              <strong>{propertyName}</strong>
            </p>

            {/* Warning */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800 mb-2 font-bold">
                ⚠️ Diese Aktion kann NICHT rückgängig gemacht werden!
              </p>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Alle Wartungen werden gelöscht</li>
                <li>• Alle Dokumente werden gelöscht</li>
                <li>• Der Wartungsverlauf geht verloren</li>
              </ul>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={deleting}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-bold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
              >
                Abbrechen
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition disabled:opacity-50"
              >
                {deleting ? 'Wird gelöscht...' : 'Ja, endgültig löschen'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}