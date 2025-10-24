/**
 * Österreich-spezifische Konstanten für ImmoWächter
 */

export const AUSTRIA_SPECIFIC = {
  // Österreichische Behörden
  authorities: {
    bma: {
      name: 'Bundesministerium für Arbeit',
      url: 'https://www.bmaw.gv.at'
    },
    oib: {
      name: 'Österreichisches Institut für Bautechnik',
      url: 'https://www.oib.or.at'
    },
    ove: {
      name: 'Österreichischer Verband für Elektrotechnik',
      url: 'https://www.ove.at'
    },
    umweltfoerderung: {
      name: 'Umweltförderung im Inland',
      url: 'https://www.umweltfoerderung.at'
    }
  },
  
  // Österreichische Förderungen (für später - KOT-7)
  subsidies: {
    sanierungsscheck: {
      name: 'Sanierungsscheck',
      maxAmount: 6000,
      url: 'https://www.umweltfoerderung.at'
    },
    rausAusOel: {
      name: 'Raus aus Öl und Gas',
      maxAmount: 7500,
      url: 'https://www.umweltfoerderung.at'
    },
    thermischeSanierung: {
      name: 'Thermische Sanierung',
      maxAmount: 6000,
      url: 'https://www.umweltfoerderung.at'
    }
  },
  
  // Österreichische Notfallnummern
  emergency: {
    fire: '122',
    police: '133',
    ambulance: '144',
    gasEmergency: '128'
  },
  
  // Rechtliche Disclaimer
  legal: {
    disclaimer: 'Alle Angaben ohne Gewähr. Keine Rechtsberatung. Bei rechtlichen Fragen wenden Sie sich an einen Rechtsanwalt in Österreich.',
    dataProtection: 'Datenschutz nach österreichischer DSGVO-Umsetzung',
    jurisdiction: 'Gerichtsstand: Wien, Österreich'
  },

  // Österreichische Gesetzesreferenzen
  legalReferences: {
    negligence: 'ABGB §1295',
    bodilyHarm: 'StGB §83, §88',
    drinkingWater: 'TWV §5',
    buildingCode: 'OIB Richtlinie 2',
    electrical: 'ÖVE/ÖNORM E 8001'
  },

  // Österreichische Städte für Examples
  cities: {
    vienna: 'Wien',
    graz: 'Graz', 
    salzburg: 'Salzburg',
    linz: 'Linz',
    innsbruck: 'Innsbruck',
    klagenfurt: 'Klagenfurt',
    steyr: 'Steyr',
    wels: 'Wels',
    vorarlberg: 'Vorarlberg'
  }
};





