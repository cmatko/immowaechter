'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewPropertyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    postal_code: '',
    city: '',
    property_type: 'house',
    build_year: new Date().getFullYear(),
    living_area: '',
  });

  // Authentifizierung wird vom Dashboard Layout gehandhabt
  // Hier keine zusätzliche Prüfung, um doppelte Redirects zu vermeiden

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('🚀 Form submitted:', formData);

    try {
      // Get current user from session
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      console.log('👤 User check:', { user: !!user, error: userError });
      
      if (userError || !user) {
        console.log('❌ No user found, using API route for demo');
        // Demo-Lösung: Verwende API Route mit Service Role Key
        try {
          const response = await fetch('/api/properties/create-demo', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'API Error');
          }

          console.log('✅ Property created successfully via API, redirecting...');
          // Success - force redirect with full page reload
          window.location.href = '/dashboard';
          return;
        } catch (apiError: any) {
          console.error('❌ API Error:', apiError);
          setError(apiError.message || 'Fehler beim Erstellen der Immobilie');
          setLoading(false);
          return;
        }
      }

      console.log('💾 Inserting property with user ID:', user.id);
      
      const { error: insertError } = await supabase
        .from('properties')
        .insert({
          user_id: user.id, // Use real user ID from session
          name: formData.name,
          address: formData.address,
          postal_code: formData.postal_code,
          city: formData.city,
          property_type: formData.property_type,
          build_year: formData.build_year,
          living_area: formData.living_area ? parseFloat(formData.living_area) : null,
          country: 'AT',
        });

      if (insertError) {
        console.error('❌ Insert error:', insertError);
        setError(insertError.message);
        setLoading(false);
        return;
      }

      console.log('✅ Property created successfully, redirecting...');
      // Success - force redirect with full page reload
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message || 'Ein Fehler ist aufgetreten');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="text-red-600 hover:underline mb-2 inline-block">
            ← Zurück zum Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Neue Immobilie anlegen
          </h1>
          <p className="text-gray-600">
            Fülle die Details zu deiner Immobilie aus
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6">
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow">
          {/* Name */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Name/Bezeichnung *
            </label>
            <input
              type="text"
              placeholder="z.B. Haus Hauptstraße, Wohnung Stadtzentrum"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Ein eindeutiger Name zur Identifikation
            </p>
          </div>

          {/* Address */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Adresse *
            </label>
            <input
              type="text"
              placeholder="Straße und Hausnummer"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
          </div>

          {/* PLZ & City */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Postleitzahl *
              </label>
              <input
                type="text"
                placeholder="1010"
                value={formData.postal_code}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setFormData({ ...formData, postal_code: value });
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                pattern="[0-9]{4,5}"
                maxLength={5}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                4-5 Ziffern (AT: 4, DE: 5)
              </p>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Stadt *
              </label>
              <input
                type="text"
                placeholder="Wien"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Property Type */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Immobilientyp *
            </label>
            <select
              value={formData.property_type}
              onChange={(e) => setFormData({ ...formData, property_type: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="house">🏡 Einfamilienhaus</option>
              <option value="apartment">🏢 Wohnung</option>
              <option value="multi_family">🏘️ Mehrfamilienhaus</option>
              <option value="commercial">🏭 Gewerbeobjekt</option>
            </select>
          </div>

          {/* Build Year & Living Area */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Baujahr
              </label>
              <input
                type="number"
                placeholder="2000"
                value={formData.build_year}
                onChange={(e) => setFormData({ ...formData, build_year: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                min="1800"
                max={new Date().getFullYear() + 1}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Wohnfläche (m²)
              </label>
              <input
                type="number"
                placeholder="120"
                value={formData.living_area}
                onChange={(e) => setFormData({ ...formData, living_area: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                step="0.1"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-red-700 transition disabled:opacity-50"
            >
              {loading ? 'Wird gespeichert...' : '✅ Immobilie anlegen'}
            </button>
            <Link
              href="/dashboard"
              className="px-6 py-3 border border-gray-300 rounded-lg font-bold text-gray-700 hover:bg-gray-50 transition text-center"
            >
              Abbrechen
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

