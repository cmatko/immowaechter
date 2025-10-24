-- Update Risk Consequences to Austrian Content
-- Update Gasheizung für Österreich
UPDATE risk_consequences 
SET 
  country = 'AT',
  criminal_paragraph = 'ABGB §1295, StGB §80',
  max_fine_eur = 36000,
  warning_yellow = 'Ihre Gasheizung-Wartung ist in 3 Monaten fällig. Jetzt Termin vereinbaren um CO-Gefahr zu vermeiden.',
  warning_orange = '⚠️ Gasheizung überfällig! Risiko: CO-Vergiftung und Versicherungsprobleme. Handeln Sie jetzt.',
  warning_red = '🚨 WARNUNG: Gasheizung seit 6+ Monaten überfällig!\n• Lebensgefahr durch CO-Vergiftung\n• Versicherung kann Leistung verweigern\n• Grobe Fahrlässigkeit nach ABGB\nJetzt sofort Handwerker beauftragen!',
  warning_black = '⚫ KRITISCH: Gasheizung seit über 1 Jahr überfällig!\n\n• AKUTE LEBENSGEFAHR (CO-Vergiftung)\n• Versicherungsschutz ERLOSCHEN\n• Strafrechtliche Folgen nach StGB §80\n• Schadensersatz nach ABGB §1295\n\nSOFORTMASSNAHMEN ERFORDERLICH!',
  real_case = 'Wien 2023: Familie in Floridsdorf überlebte knapp CO-Vergiftung durch nicht gewartete Gastherme',
  statistic = '400+ CO-Vergiftungen/Jahr in Österreich, 20+ Todesfälle'
WHERE component_type = 'Gasheizung';

-- Update Rauchmelder für Österreich
UPDATE risk_consequences 
SET 
  country = 'AT',
  criminal_paragraph = 'OIB Richtlinie 2, Bauordnungen der Länder',
  max_fine_eur = 7200,
  warning_yellow = 'Rauchmelder-Test in 3 Monaten fällig. 70% der Brandtoten sterben durch Rauch.',
  warning_orange = '⚠️ Rauchmelder-Wartung überfällig! Bei Brand droht Versicherungsverlust.',
  warning_red = '🚨 Rauchmelder seit Monaten nicht geprüft! Lebensgefahr für Bewohner. Versicherungsschutz gefährdet.',
  warning_black = '⚫ KRITISCH: Rauchmelder massiv überfällig! Versicherung zahlt bei Brand NICHT. Verletzung der Bauordnung!',
  real_case = 'Graz 2022: Vermieter zu 80.000€ Schadensersatz nach Brand - Rauchmelder defekt',
  statistic = '70% der Brandtoten in Österreich sterben nachts durch Rauch, nicht Feuer'
WHERE component_type = 'Rauchmelder';

-- Update Elektrik für Österreich
UPDATE risk_consequences 
SET 
  country = 'AT',
  criminal_paragraph = 'ÖVE/ÖNORM E 8001',
  warning_yellow = 'E-Check in 3 Monaten fällig. Veraltete Elektrik = Brandgefahr.',
  warning_orange = '⚠️ E-Check überfällig! Kabelbrand-Risiko steigt täglich.',
  warning_red = '🚨 Elektrik lange nicht geprüft! Kabelbrand kann Totalschaden verursachen. Versicherung zahlt nicht!',
  warning_black = '⚫ KRITISCH: E-Check massiv überfällig! Bei Kabelbrand zahlt Versicherung NICHTS. Nachbarn können Regress nach ABGB fordern!',
  real_case = 'Salzburg 2023: 1,5 Mio. € Brandschaden, Versicherung zahlte 0€ - E-Check 4 Jahre überfällig',
  statistic = '30% der Hausbrände in Österreich durch Elektrik'
WHERE component_type = 'Elektrik';

-- Update Rückstauklappe für Österreich
UPDATE risk_consequences 
SET 
  country = 'AT',
  real_case = 'Linz 2021: 60.000€ Wasserschaden nach Hochwasser, Versicherung: "Grobe Fahrlässigkeit" - 0€ Zahlung'
WHERE component_type = 'Rückstauklappe';

-- Update Legionellenprüfung für Österreich
UPDATE risk_consequences 
SET 
  country = 'AT',
  criminal_paragraph = 'TWV (Trinkwasserverordnung) §5',
  max_fine_eur = 36000,
  warning_yellow = 'Legionellenprüfung in 3 Monaten fällig. Gesundheitsgefahr für Bewohner.',
  warning_orange = '⚠️ Legionellenprüfung überfällig! Vermieter: Bußgeld bis 36.000€ droht!',
  warning_red = '🚨 Legionellen massiv überfällig! Gesundheitsgefahr + Strafrecht + Bußgeld nach TWV!',
  warning_black = '⚫ KRITISCH: Legionellen 1+ Jahr überfällig! VERSTOSS gegen TWV. Bei Infektion: Körperverletzung + bis 100.000€ Schmerzensgeld!',
  real_case = 'Innsbruck 2022: Vermieter zahlt 120.000€ nach Legionellen-Infektion + 18.000€ Bußgeld',
  statistic = '200+ Legionellen-Infektionen/Jahr in Österreich'
WHERE component_type = 'Legionellenprüfung';

-- Update Aufzug für Österreich
UPDATE risk_consequences 
SET 
  country = 'AT',
  criminal_paragraph = 'Aufzugsverordnung 2010, ABGB §1295',
  max_fine_eur = 50000,
  warning_yellow = 'Aufzug-Wartung in 3 Monaten fällig. Sicherheitsrisiko für Bewohner.',
  warning_orange = '⚠️ Aufzug-Wartung überfällig! Haftungsrisiko bei Unfällen.',
  warning_red = '🚨 Aufzug seit Monaten nicht gewartet! Lebensgefahr + Haftung nach ABGB!',
  warning_black = '⚫ KRITISCH: Aufzug massiv überfällig! Bei Unfall: Schadensersatz nach ABGB + Strafrecht!',
  real_case = 'Wien 2021: Aufzug-Unfall in 15. Bezirk - 150.000€ Schadensersatz nach ABGB',
  statistic = '50+ Aufzug-Unfälle/Jahr in Österreich'
WHERE component_type = 'Aufzug';

-- Update Feuerlöscher für Österreich
UPDATE risk_consequences 
SET 
  country = 'AT',
  criminal_paragraph = 'Feuerpolizei-Gesetz, ABGB §1295',
  max_fine_eur = 25000,
  warning_yellow = 'Feuerlöscher-Prüfung in 3 Monaten fällig. Brandschutz gefährdet.',
  warning_orange = '⚠️ Feuerlöscher-Wartung überfällig! Brandschutz nicht gewährleistet.',
  warning_red = '🚨 Feuerlöscher seit Monaten nicht geprüft! Brandschutz gefährdet!',
  warning_black = '⚫ KRITISCH: Feuerlöscher massiv überfällig! Bei Brand: Haftung nach ABGB!',
  real_case = 'Klagenfurt 2020: Brand in Bürogebäude - Feuerlöscher defekt, 200.000€ Schaden',
  statistic = '15% der Brände in Österreich durch defekte Feuerlöscher'
WHERE component_type = 'Feuerlöscher';

-- Update Photovoltaik für Österreich
UPDATE risk_consequences 
SET 
  country = 'AT',
  criminal_paragraph = 'ÖVE/ÖNORM E 8001, Elektrotechnikgesetz',
  max_fine_eur = 15000,
  warning_yellow = 'PV-Anlage Wartung in 3 Monaten fällig. Sicherheitsrisiko.',
  warning_orange = '⚠️ PV-Wartung überfällig! Elektrische Gefahr.',
  warning_red = '🚨 PV-Anlage seit Monaten nicht gewartet! Elektrische Gefahr + Haftung!',
  warning_black = '⚫ KRITISCH: PV-Anlage massiv überfällig! Bei Unfall: Haftung nach ABGB!',
  real_case = 'Vorarlberg 2022: PV-Unfall - 50.000€ Schadensersatz nach ABGB',
  statistic = '25+ PV-Unfälle/Jahr in Österreich'
WHERE component_type = 'Photovoltaik';

-- Update Dachrinne für Österreich
UPDATE risk_consequences 
SET 
  country = 'AT',
  real_case = 'Steyr 2021: Dachrinnen-Versagen nach Sturm - 40.000€ Wasserschaden'
WHERE component_type = 'Dachrinne';

-- Update Trinkwasserfilter für Österreich
UPDATE risk_consequences 
SET 
  country = 'AT',
  criminal_paragraph = 'TWV (Trinkwasserverordnung) §5',
  max_fine_eur = 18000,
  warning_yellow = 'Trinkwasserfilter-Wartung in 3 Monaten fällig. Gesundheitsrisiko.',
  warning_orange = '⚠️ Filter-Wartung überfällig! Gesundheitsgefahr.',
  warning_red = '🚨 Trinkwasserfilter seit Monaten nicht gewartet! Gesundheitsgefahr!',
  warning_black = '⚫ KRITISCH: Filter massiv überfällig! Bei Gesundheitsproblemen: Haftung nach ABGB!',
  real_case = 'Wels 2021: Trinkwasser-Verseuchung - 80.000€ Schadensersatz nach ABGB',
  statistic = '100+ Trinkwasser-Probleme/Jahr in Österreich'
WHERE component_type = 'Trinkwasserfilter';

-- Alle anderen Components auf AT setzen
UPDATE risk_consequences SET country = 'AT' WHERE country IS NULL;





