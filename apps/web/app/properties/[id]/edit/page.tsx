'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditPropertyPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  useEffect(() => {
    loadProperty();
  }, [params.id]);

  const loadProperty = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      router.push('/login');
      return;
    }

    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error || !data) {
      setError('Immobilie nicht gefunden');
      setLoading(false);
      return;
    }

    // Check if user owns this property
    if (data.user_id !== session.user.id) {
      setError('Keine Berechtigung');
      setLoading(false);
      return;
    }

    // Populate form
    setFormData({
      name: data.name || '',
      address: data.address || '',
      postal_code: data.postal_code || '',
      city: data.city || '',
      property_type: data.property_type || 'house',
      build_year: data.build_year || new Date().getFullYear(),
      living_area: data.living_area?.toString() || '',
    });

    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const { error: updateError } = await supabase
        .from('properties')
        .update({
          name: formData.name,
          address: formData.address,
          postal_code: formData.postal_code,
          city: formData.city,
          property_type: formData.property_type,
          build_year: formData.build_year,
          living_area: formData.living_area ? parseFloat(formData.living_area) : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', params.id);

      if (updateError) {
        setError(updateError.message);
        setSaving(false);
        return;
      }

      // Success - redirect back to details
      window.location.href = `/properties/${params.id}`;
    } catch (err: any) {
      setError(err.message || 'Ein Fehler ist aufgetreten');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Lädt...</p>
        </div>
      </div>
    );
  }

  if (error && !formData.name) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Fehler</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-800 font-medium">
            ← Zurück zum Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href={`/properties/${params.id}`} 
            className="text-indigo-600 hover:text-indigo-800 font-medium mb-2 inline-block"
          >
            ← Zurück zur Immobilie
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Immobilie bearbeiten
          </h1>
          <p className="text-gray-600">
            Aktualisiere die Details deiner Immobilie
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
              disabled={saving}
              className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {saving ? 'Wird gespeichert...' : '✅ Änderungen speichern'}
            </button>
            <Link
              href={`/properties/${params.id}`}
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