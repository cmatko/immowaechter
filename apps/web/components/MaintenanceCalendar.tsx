'use client';

import { useEffect, useState } from 'react';
import { Calendar, Clock, AlertTriangle, CheckCircle, Plus, Filter } from 'lucide-react';

interface MaintenanceEvent {
  id: string;
  title: string;
  propertyId: string;
  propertyName: string;
  componentId: string;
  componentName: string;
  componentType: string;
  startDate: string;
  endDate?: string;
  type: 'maintenance' | 'inspection' | 'repair' | 'replacement';
  status: 'scheduled' | 'overdue' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description?: string;
  assignedTo?: string;
  estimatedDuration?: number; // in hours
  cost?: number;
}

interface MaintenanceCalendarProps {
  propertyId?: string;
  view?: 'month' | 'week' | 'day';
}

export function MaintenanceCalendar({ propertyId, view = 'month' }: MaintenanceCalendarProps) {
  const [events, setEvents] = useState<MaintenanceEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'scheduled' | 'overdue' | 'completed'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'medium' | 'high' | 'critical'>('all');

  useEffect(() => {
    fetchMaintenanceEvents();
  }, [propertyId, currentDate]);

  const fetchMaintenanceEvents = async () => {
    try {
      setLoading(true);
      const url = propertyId 
        ? `/api/dashboard/maintenance-calendar?propertyId=${propertyId}`
        : '/api/dashboard/maintenance-calendar';
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setEvents(data.data);
      }
    } catch (error) {
      console.error('Error fetching maintenance events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventColor = (priority: string, status: string) => {
    if (status === 'overdue') return 'bg-red-100 border-red-300 text-red-800';
    if (status === 'completed') return 'bg-green-100 border-green-300 text-green-800';
    if (priority === 'critical') return 'bg-red-100 border-red-300 text-red-800';
    if (priority === 'high') return 'bg-orange-100 border-orange-300 text-orange-800';
    if (priority === 'medium') return 'bg-yellow-100 border-yellow-300 text-yellow-800';
    return 'bg-blue-100 border-blue-300 text-blue-800';
  };

  const getEventIcon = (type: string, status: string) => {
    if (status === 'overdue') return <AlertTriangle className="w-4 h-4" />;
    if (status === 'completed') return <CheckCircle className="w-4 h-4" />;
    if (type === 'maintenance') return <Clock className="w-4 h-4" />;
    return <Calendar className="w-4 h-4" />;
  };

  const getPriorityText = (priority: string) => {
    const priorityMap = {
      low: 'Niedrig',
      medium: 'Mittel',
      high: 'Hoch',
      critical: 'Kritisch'
    };
    return priorityMap[priority as keyof typeof priorityMap] || priority;
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      scheduled: 'Geplant',
      overdue: 'Überfällig',
      completed: 'Abgeschlossen',
      cancelled: 'Abgebrochen'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('de-AT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('de-AT', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => {
      const eventDate = new Date(event.startDate).toISOString().split('T')[0];
      return eventDate === dateStr;
    });
  };

  const filteredEvents = events.filter(event => {
    if (filterStatus !== 'all' && event.status !== filterStatus) return false;
    if (filterPriority !== 'all' && event.priority !== filterPriority) return false;
    return true;
  });

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('de-AT', { month: 'long', year: 'numeric' });

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              📅 Wartungskalender
            </h3>
            <p className="text-sm text-gray-600">
              Übersicht aller Wartungstermine
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Plus className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Filter className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">Alle</option>
            <option value="scheduled">Geplant</option>
            <option value="overdue">Überfällig</option>
            <option value="completed">Abgeschlossen</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Priorität:</label>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as any)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">Alle</option>
            <option value="low">Niedrig</option>
            <option value="medium">Mittel</option>
            <option value="high">Hoch</option>
            <option value="critical">Kritisch</option>
          </select>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          ←
        </button>
        
        <h4 className="text-lg font-semibold text-gray-900 capitalize">
          {monthName}
        </h4>
        
        <button
          onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          →
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
        
        {Array.from({ length: startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1 }).map((_, i) => (
          <div key={`empty-${i}`} className="p-2"></div>
        ))}
        
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
          const dayEvents = getEventsForDate(date);
          const isToday = date.toDateString() === new Date().toDateString();
          const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
          
          return (
            <div
              key={day}
              className={`p-2 min-h-[80px] border rounded-lg cursor-pointer transition-colors ${
                isToday ? 'bg-blue-50 border-blue-300' :
                isSelected ? 'bg-gray-50 border-gray-300' :
                'border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => setSelectedDate(date)}
            >
              <div className={`text-sm font-medium mb-1 ${
                isToday ? 'text-blue-600' : 'text-gray-900'
              }`}>
                {day}
              </div>
              
              <div className="space-y-1">
                {dayEvents.slice(0, 2).map(event => (
                  <div
                    key={event.id}
                    className={`text-xs p-1 rounded border ${getEventColor(event.priority, event.status)}`}
                  >
                    <div className="flex items-center gap-1">
                      {getEventIcon(event.type, event.status)}
                      <span className="truncate">{event.componentName}</span>
                    </div>
                  </div>
                ))}
                
                {dayEvents.length > 2 && (
                  <div className="text-xs text-gray-500">
                    +{dayEvents.length - 2} weitere
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Date Events */}
      {selectedDate && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h5 className="font-medium text-gray-900 mb-3">
            Termine für {formatDate(selectedDate.toISOString())}
          </h5>
          
          {getEventsForDate(selectedDate).length === 0 ? (
            <p className="text-gray-500 text-sm">Keine Termine an diesem Tag</p>
          ) : (
            <div className="space-y-2">
              {getEventsForDate(selectedDate).map(event => (
                <div key={event.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div className="flex items-center gap-3">
                    {getEventIcon(event.type, event.status)}
                    <div>
                      <div className="font-medium text-gray-900">{event.componentName}</div>
                      <div className="text-sm text-gray-600">{event.propertyName}</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {formatTime(event.startDate)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {getPriorityText(event.priority)} • {getStatusText(event.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-4 gap-4">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {events.filter(e => e.status === 'scheduled').length}
          </div>
          <div className="text-sm text-blue-600">Geplant</div>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">
            {events.filter(e => e.status === 'overdue').length}
          </div>
          <div className="text-sm text-red-600">Überfällig</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {events.filter(e => e.status === 'completed').length}
          </div>
          <div className="text-sm text-green-600">Abgeschlossen</div>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">
            {events.filter(e => e.priority === 'critical').length}
          </div>
          <div className="text-sm text-orange-600">Kritisch</div>
        </div>
      </div>
    </div>
  );
}

