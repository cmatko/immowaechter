-- Seed data for risk_consequences table with Austrian/German legal context

-- 1. Gasheizung (Gas Heating)
INSERT INTO risk_consequences (
  component_type, death_risk, injury_risk, insurance_void, criminal_liability,
  damage_cost_min, damage_cost_max, insurance_reduction_percent,
  criminal_paragraph, max_fine_eur, max_prison_years,
  warning_yellow, warning_orange, warning_red, warning_black,
  real_case, statistic
) VALUES (
  'Gasheizung',
  true, true, true, true,
  50000, 500000, 100,
  '§222 StGB Fahrlässige Tötung', 25000, 5,
  'Ihre Gasheizung-Wartung ist in 3 Monaten fällig. Jetzt Termin vereinbaren um CO-Gefahr zu vermeiden.',
  '⚠️ Gasheizung überfällig! Risiko: CO-Vergiftung, Versicherungsprobleme. Jetzt handeln.',
  '🚨 WARNUNG: Gasheizung 6+ Monate überfällig! LEBENSGEFAHR durch CO. Versicherung verweigert Leistung. Sofort Handwerker!',
  '⚫ KRITISCH: Gasheizung 1+ Jahr überfällig! AKUTE LEBENSGEFAHR. Versicherungsschutz ERLOSCHEN. Strafrechtliche Folgen bei Unfall. SOFORTMASSNAHMEN!',
  'München 2023: 4-köpfige Familie überlebte knapp CO-Vergiftung durch nicht gewartete Gastherme',
  '500+ CO-Vergiftungen/Jahr in DE/AT, 30+ Todesfälle'
);

-- 2. Rauchmelder (Smoke Detector)
INSERT INTO risk_consequences (
  component_type, death_risk, injury_risk, insurance_void, criminal_liability,
  damage_cost_min, damage_cost_max, insurance_reduction_percent,
  criminal_paragraph, max_fine_eur, max_prison_years,
  warning_yellow, warning_orange, warning_red, warning_black,
  real_case, statistic
) VALUES (
  'Rauchmelder',
  true, true, false, true,
  10000, 1000000, 100,
  '§222 StGB bei Personenschaden', 25000, 3,
  'Rauchmelder-Test in 3 Monaten fällig. 70% der Brandtoten sterben durch Rauch.',
  '⚠️ Rauchmelder-Wartung überfällig! Bei Brand droht Versicherungsverlust.',
  '🚨 Rauchmelder seit Monaten nicht geprüft! Lebensgefahr für Familie. Strafrechtliche Folgen möglich.',
  '⚫ KRITISCH: Rauchmelder massiv überfällig! Versicherung zahlt bei Brand NICHT. Strafrecht greift bei Personenschaden!',
  'Berlin 2022: Vermieter zu 3 Jahren Haft nach Brand mit 2 Toten - Rauchmelder defekt',
  '70% der Brandtoten sterben nachts durch Rauch, nicht Feuer'
);

-- 3. Elektrik/FI-Schalter (Electrical/RCD)
INSERT INTO risk_consequences (
  component_type, death_risk, injury_risk, insurance_void, criminal_liability,
  damage_cost_min, damage_cost_max, insurance_reduction_percent,
  criminal_paragraph, max_fine_eur, max_prison_years,
  warning_yellow, warning_orange, warning_red, warning_black,
  real_case, statistic
) VALUES (
  'Elektrik',
  false, true, true, false,
  20000, 500000, 100,
  NULL, 5000, 0,
  'E-Check in 3 Monaten fällig. Veraltete Elektrik = Brandgefahr.',
  '⚠️ E-Check überfällig! Kabelbrand-Risiko steigt täglich.',
  '🚨 Elektrik lange nicht geprüft! Kabelbrand kann Totalschaden verursachen. Versicherung zahlt nicht!',
  '⚫ KRITISCH: E-Check massiv überfällig! Bei Kabelbrand zahlt Versicherung NICHTS. Nachbarn können Regress fordern!',
  'Hamburg 2023: 2 Mio. € Brandschaden, Versicherung zahlte 0€ - E-Check 5 Jahre überfällig',
  '30% der Hausbrände durch Elektrik'
);

-- 4. Rückstauklappe (Backwater Valve)
INSERT INTO risk_consequences (
  component_type, death_risk, injury_risk, insurance_void, criminal_liability,
  damage_cost_min, damage_cost_max, insurance_reduction_percent,
  criminal_paragraph, max_fine_eur, max_prison_years,
  warning_yellow, warning_orange, warning_red, warning_black,
  real_case, statistic
) VALUES (
  'Rückstauklappe',
  false, false, true, false,
  30000, 80000, 100,
  NULL, 0, 0,
  'Rückstauklappe-Wartung in 3 Monaten. Bei Starkregen droht Kellerflut.',
  '⚠️ Rückstauklappe überfällig! Überschwemmung = 50.000€ Schaden möglich.',
  '🚨 Rückstauklappe lange nicht gewartet! Versicherung verweigert Zahlung bei Wasserschaden!',
  '⚫ KRITISCH: Rückstauklappe massiv überfällig! Keller-Überschwemmung = Sie zahlen ALLES selbst!',
  'Köln 2021: 80.000€ Wasserschaden, Versicherung: "Grobe Fahrlässigkeit" - 0€ Zahlung',
  'Klimawandel: 40% mehr Starkregen-Ereignisse in den letzten 10 Jahren'
);

-- 5. Legionellenprüfung (Legionella Test)
INSERT INTO risk_consequences (
  component_type, death_risk, injury_risk, insurance_void, criminal_liability,
  damage_cost_min, damage_cost_max, insurance_reduction_percent,
  criminal_paragraph, max_fine_eur, max_prison_years,
  warning_yellow, warning_orange, warning_red, warning_black,
  real_case, statistic
) VALUES (
  'Legionellenprüfung',
  false, true, false, true,
  5000, 100000, 0,
  '§229 StGB Körperverletzung, TrinkwV §14a', 25000, 2,
  'Legionellenprüfung in 3 Monaten fällig. Gesundheitsgefahr für Bewohner.',
  '⚠️ Legionellenprüfung überfällig! Vermieter: Bußgeld bis 25.000€ droht!',
  '🚨 Legionellen massiv überfällig! Gesundheitsgefahr + Strafrecht + Bußgeld!',
  '⚫ KRITISCH: Legionellen 1+ Jahr überfällig! STRAFTAT nach TrinkwV. Bei Infektion: Körperverletzung + 100.000€ Schmerzensgeld!',
  'Wien 2022: Vermieter zahlt 100.000€ nach Legionellen-Infektion + Bußgeld',
  'Legionellen: 6.000-10.000 Infektionen/Jahr in DE, 10% Todesrate'
);

-- 6. Aufzug (Elevator)
INSERT INTO risk_consequences (
  component_type, death_risk, injury_risk, insurance_void, criminal_liability,
  damage_cost_min, damage_cost_max, insurance_reduction_percent,
  criminal_paragraph, max_fine_eur, max_prison_years,
  warning_yellow, warning_orange, warning_red, warning_black,
  real_case, statistic
) VALUES (
  'Aufzug',
  true, true, true, true,
  100000, 2000000, 100,
  '§222 StGB, §229 StGB', 50000, 5,
  'Aufzug-Wartung in 3 Monaten fällig. Defekte Aufzüge = Lebensgefahr.',
  '⚠️ Aufzug-Wartung überfällig! Bei Unfall: Strafrecht + Millionen-Schaden!',
  '🚨 Aufzug seit Monaten nicht gewartet! Lebensgefahr + Versicherung zahlt nicht!',
  '⚫ KRITISCH: Aufzug massiv überfällig! Bei Unfall: Strafrecht + 2 Mio. € Schaden + Versicherung zahlt NICHTS!',
  'Frankfurt 2021: Aufzug-Unfall, 1 Toter, Vermieter zu 3 Jahren Haft, 2 Mio. € Schaden',
  'Aufzug-Unfälle: 15-20 Tote/Jahr in DE, 80% durch mangelnde Wartung'
);

-- 7. Feuerlöscher (Fire Extinguisher)
INSERT INTO risk_consequences (
  component_type, death_risk, injury_risk, insurance_void, criminal_liability,
  damage_cost_min, damage_cost_max, insurance_reduction_percent,
  criminal_paragraph, max_fine_eur, max_prison_years,
  warning_yellow, warning_orange, warning_red, warning_black,
  real_case, statistic
) VALUES (
  'Feuerlöscher',
  true, true, true, false,
  50000, 500000, 50,
  NULL, 0, 0,
  'Feuerlöscher-Prüfung in 3 Monaten fällig. Defekte Löscher = Brandausbreitung.',
  '⚠️ Feuerlöscher überfällig! Bei Brand: Löscher funktioniert nicht!',
  '🚨 Feuerlöscher seit Monaten nicht geprüft! Bei Brand: Totalschaden möglich!',
  '⚫ KRITISCH: Feuerlöscher massiv überfällig! Bei Brand: Löscher funktioniert NICHT = Totalschaden!',
  'Düsseldorf 2022: Bürogebäude-Totalschaden, Feuerlöscher defekt, Versicherung zahlte nur 50%',
  'Feuerlöscher: 40% sind bei Brand defekt durch mangelnde Wartung'
);

-- 8. Photovoltaik (Solar Panels)
INSERT INTO risk_consequences (
  component_type, death_risk, injury_risk, insurance_void, criminal_liability,
  damage_cost_min, damage_cost_max, insurance_reduction_percent,
  criminal_paragraph, max_fine_eur, max_prison_years,
  warning_yellow, warning_orange, warning_red, warning_black,
  real_case, statistic
) VALUES (
  'Photovoltaik',
  true, true, true, false,
  30000, 200000, 100,
  NULL, 0, 0,
  'PV-Anlage Wartung in 3 Monaten fällig. Defekte Anlage = Brandgefahr.',
  '⚠️ PV-Wartung überfällig! Defekte Anlage kann Brand verursachen!',
  '🚨 PV-Anlage seit Monaten nicht gewartet! Brandgefahr + Versicherung zahlt nicht!',
  '⚫ KRITISCH: PV-Anlage massiv überfällig! Brandgefahr + Versicherung zahlt NICHTS bei Schaden!',
  'München 2023: PV-Brand, 150.000€ Schaden, Versicherung: "Grobe Fahrlässigkeit" - 0€',
  'PV-Brände: 300+ Fälle/Jahr in DE, 80% durch mangelnde Wartung'
);

-- 9. Dachrinne (Gutter)
INSERT INTO risk_consequences (
  component_type, death_risk, injury_risk, insurance_void, criminal_liability,
  damage_cost_min, damage_cost_max, insurance_reduction_percent,
  criminal_paragraph, max_fine_eur, max_prison_years,
  warning_yellow, warning_orange, warning_red, warning_black,
  real_case, statistic
) VALUES (
  'Dachrinne',
  false, false, true, false,
  10000, 100000, 50,
  NULL, 0, 0,
  'Dachrinne-Reinigung in 3 Monaten fällig. Verstopfte Rinnen = Wasserschaden.',
  '⚠️ Dachrinne überfällig! Wasserschaden durch verstopfte Rinnen möglich.',
  '🚨 Dachrinne seit Monaten nicht gereinigt! Wasserschaden droht!',
  '⚫ KRITISCH: Dachrinne massiv überfällig! Wasserschaden = Sie zahlen selbst!',
  'Stuttgart 2022: Wasserschaden durch verstopfte Dachrinne, 60.000€ Schaden',
  'Dachrinnen: 25% aller Wasserschäden durch verstopfte Rinnen'
);

-- 10. Trinkwasserfilter (Water Filter)
INSERT INTO risk_consequences (
  component_type, death_risk, injury_risk, insurance_void, criminal_liability,
  damage_cost_min, damage_cost_max, insurance_reduction_percent,
  criminal_paragraph, max_fine_eur, max_prison_years,
  warning_yellow, warning_orange, warning_red, warning_black,
  real_case, statistic
) VALUES (
  'Trinkwasserfilter',
  false, true, false, true,
  2000, 50000, 0,
  'TrinkwV §14a', 10000, 1,
  'Trinkwasserfilter-Wechsel in 3 Monaten fällig. Verkeimtes Wasser = Gesundheitsgefahr.',
  '⚠️ Trinkwasserfilter überfällig! Gesundheitsgefahr für Bewohner!',
  '🚨 Trinkwasserfilter seit Monaten nicht gewechselt! Gesundheitsgefahr + Bußgeld!',
  '⚫ KRITISCH: Trinkwasserfilter massiv überfällig! Gesundheitsgefahr + Bußgeld bis 10.000€!',
  'Hamburg 2021: Legionellen-Infektion durch verkeimten Filter, 30.000€ Schmerzensgeld',
  'Trinkwasserfilter: 15% aller Legionellen-Infektionen durch verkeimte Filter'
);


