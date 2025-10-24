'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { MaintenanceInterval, Property } from '@/types/database';

export default function AddMaintenancePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [intervals, setIntervals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    interval_id: '',
    custom_name: '',
    brand: '',
    model: '',
    installation_date: '',
    last_maintenance: '',
  });

  useEffect(() => {
    loadData();
  }, [params.id]);

  const loadData = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      router.push('/login');
      return;
    }

    // Load property
    const { data: propertyData } = await supabase
      .from('properties')
      .select('*')
      .eq('id', params.id)
      .single();

    if (!propertyData || propertyData.user_id !== session.user.id) {
      setError('Immobilie nicht gefunden');
      setLoading(false);
      return;
    }

    setProperty(propertyData);

    // Load maintenance intervals
    const { data: intervalsData } = await supabase
      .from('maintenance_intervals')
      .select('*')
      .order('category', { ascending: true })
      .order('component', { ascending: true });

    setIntervals(intervalsData || []);
    setLoading(false);
  };

  const calculateNextMaintenance = (lastMaintenanceDate: string, intervalMonths: number) => {
    const last = new Date(lastMaintenanceDate);
    const next = new Date(last);
    next.setMonth(next.getMonth() + intervalMonths);
    return next.toISOString().split('T')[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const selectedInterval = intervals.find(i => i.id === formData.interval_id);
      
      if (!selectedInterval) {
        setError('Bitte wähle einen Wartungstyp aus');
        setSaving(false);
        return;
      }

      const nextMaintenance = calculateNextMaintenance(
        formData.last_maintenance,
        selectedInterval.interval_months
      );

      const { error: insertError } = await supabase
        .from('components')
        .insert({
          property_id: params.id,
          interval_id: formData.interval_id,
          custom_name: formData.custom_name || null,
          brand: formData.brand || null,
          model: formData.model || null,
          installation_date: formData.installation_date || null,
          last_maintenance: formData.last_maintenance,
          next_maintenance: nextMaintenance,
          is_active: true,
        });

      if (insertError) {
        setError(insertError.message);
        setSaving(false);
        return;
      }

      // Success
      window.location.href = `/properties/${params.id}`;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten';
      setError(errorMessage);
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

  if (error && !property) {
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

  const selectedInterval = intervals.find(i => i.id === formData.interval_id);

  // Group intervals by category
  const groupedIntervals = intervals.reduce((acc: Record<string, MaintenanceInterval[]>, interval) => {
    const category = (interval as any).category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(interval);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href={`/properties/${params.id}`} 
            className="text-indigo-600 hover:text-indigo-800 font-medium mb-2 inline-block"
          >
            ← Zurück zu {property?.name}
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Wartung hinzufügen
          </h1>
          <p className="text-gray-600">
            Wähle einen Wartungstyp und trage die letzte Wartung ein
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6">
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow space-y-6">
          {/* Wartungstyp */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Wartungstyp * 
            </label>
            <select
              value={formData.interval_id}
              onChange={(e) => setFormData({ ...formData, interval_id: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            >
              <option value="">Bitte wählen...</option>
              {Object.keys(groupedIntervals).map(category => (
                <optgroup key={category} label={category}>
                  {groupedIntervals[category].map((interval: any) => (
                    <option key={interval.id} value={interval.id}>
                      {interval.component} ({interval.interval_months === 1 ? 'monatlich' : `alle ${interval.interval_months} Monate`})
                      {interval.legal_requirement && ' ⚖️'}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            {selectedInterval && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Info:</strong> {selectedInterval.description}
                </p>
                {selectedInterval.legal_requirement && (
                  <p className="text-sm text-blue-800 mt-1">
                    ⚖️ <strong>Gesetzlich vorgeschrieben</strong> {selectedInterval.oib_reference && `(${selectedInterval.oib_reference})`}
                  </p>
                )}
                {selectedInterval.cost_estimate_from && (
                  <p className="text-sm text-blue-800 mt-1">
                    💰 Kosten: ca. €{selectedInterval.cost_estimate_from} - €{selectedInterval.cost_estimate_to}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Eigene Bezeichnung */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Eigene Bezeichnung (optional)
            </label>
            <input
              type="text"
              placeholder="z.B. Gastherme Keller"
              value={formData.custom_name}
              onChange={(e) => setFormData({ ...formData, custom_name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Hilft dir, die Komponente zu identifizieren
            </p>
          </div>

          {/* Brand & Model */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Marke (optional)
              </label>
              <input
                type="text"
                placeholder="z.B. Vaillant"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Modell (optional)
              </label>
              <input
                type="text"
                placeholder="z.B. ecoTEC plus"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Installation Date */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Installationsdatum (optional)
            </label>
            <input
              type="date"
              value={formData.installation_date}
              onChange={(e) => setFormData({ ...formData, installation_date: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Last Maintenance */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Letzte Wartung * 
            </label>
            <input
              type="date"
              value={formData.last_maintenance}
              onChange={(e) => setFormData({ ...formData, last_maintenance: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              max={new Date().toISOString().split('T')[0]}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Wann wurde die letzte Wartung durchgeführt?
            </p>
          </div>

          {/* Preview Next Maintenance */}
          {formData.last_maintenance && selectedInterval && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm font-medium text-green-900">
                📅 Nächste Wartung fällig: <strong>{calculateNextMaintenance(formData.last_maintenance, selectedInterval.interval_months)}</strong>
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {saving ? 'Wird gespeichert...' : '✅ Wartung hinzufügen'}
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