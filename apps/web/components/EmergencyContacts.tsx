'use client';

import { Phone, AlertTriangle } from 'lucide-react';
import { AUSTRIA_SPECIFIC } from '@/lib/constants';

export function EmergencyContacts() {
  const { emergency } = AUSTRIA_SPECIFIC;
  
  return (
    <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="w-5 h-5 text-red-600" />
        <h3 className="font-bold text-red-900">Notfallnummern Österreich</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-sm">
        <a 
          href={`tel:${emergency.fire}`}
          className="flex items-center gap-2 p-2 bg-white rounded hover:bg-red-100 transition-colors"
        >
          <Phone className="w-4 h-4 text-red-600" />
          <div>
            <div className="font-bold text-red-900">Feuerwehr</div>
            <div className="text-red-700">{emergency.fire}</div>
          </div>
        </a>
        
        <a 
          href={`tel:${emergency.ambulance}`}
          className="flex items-center gap-2 p-2 bg-white rounded hover:bg-red-100 transition-colors"
        >
          <Phone className="w-4 h-4 text-red-600" />
          <div>
            <div className="font-bold text-red-900">Rettung</div>
            <div className="text-red-700">{emergency.ambulance}</div>
          </div>
        </a>
        
        <a 
          href={`tel:${emergency.gasEmergency}`}
          className="flex items-center gap-2 p-2 bg-white rounded hover:bg-red-100 transition-colors"
        >
          <Phone className="w-4 h-4 text-red-600" />
          <div>
            <div className="font-bold text-red-900">Gas-Notruf</div>
            <div className="text-red-700">{emergency.gasEmergency}</div>
          </div>
        </a>
        
        <a 
          href={`tel:${emergency.police}`}
          className="flex items-center gap-2 p-2 bg-white rounded hover:bg-red-100 transition-colors"
        >
          <Phone className="w-4 h-4 text-red-600" />
          <div>
            <div className="font-bold text-red-900">Polizei</div>
            <div className="text-red-700">{emergency.police}</div>
          </div>
        </a>
      </div>
      
      <p className="mt-3 text-xs text-red-700">
        Bei Gas-Geruch oder CO-Verdacht: Sofort Gebäude verlassen und {emergency.gasEmergency} oder {emergency.fire} anrufen!
      </p>
    </div>
  );
}





