export const BACKEND_BASE_URL = 'https://us-central1-pluga-bet.cloudfunctions.net/app';

import type { Submission, Equipment } from './types';

export const EQUIPMENT_LIST: Equipment[] = [
  { id: 'vehicle', name: 'רכב האמר M1151', description: 'בדיקה כללית, דלק, שמן, מים.', quantity: 1, physicalId: true },
  { id: 'radio_prc', name: 'קשר AN/PRC-152', description: 'סוללה, אנטנה, תקינות כללית.', quantity: 2 },
  { id: 'radio_vhf', name: 'קשר VHF', description: 'בדיקת תדרים וסוללה.', quantity: 2 },
  { id: 'nvg', name: 'אמצעי ראיית לילה', description: 'תקינות, סוללות, כיסויים.', quantity: 4 },
  { id: 'first_aid', name: 'ערכת עזרה ראשונה', description: 'תכולה מלאה, תוקף פריטים.', quantity: 1 },
  { id: 'weapon', name: 'נשק אישי', description: 'נקי, משומן, תקין.', quantity: 4 },
];

export const RANKS = ['טוראי', 'רב"ט', 'סמל', 'סמ"ר', 'רס"ל'];

export const MOCK_SUBMISSIONS: Submission[] = [
  {
    id: 'sub1',
    task: 'סיור',
    firstName: 'משה',
    lastName: 'כהן',
    soldierId: '1234567',
    date: new Date('2024-08-20T10:00:00Z'),
    equipmentStatus: [
      { equipmentId: 'vehicle', status: 'ok', quantity: 1, physicalId: 'צ-123456', hasPhysicalId: true },
      { equipmentId: 'radio_prc', status: 'ok', quantity: 2, hasPhysicalId: false },
      { equipmentId: 'radio_vhf', status: 'issue', comment: 'סוללה חלשה', quantity: 1, hasPhysicalId: false },
      { equipmentId: 'nvg', status: 'ok', quantity: 4, hasPhysicalId: false },
      { equipmentId: 'first_aid', status: 'ok', quantity: 1, hasPhysicalId: false },
      { equipmentId: 'weapon', status: 'ok', quantity: 4, hasPhysicalId: false },
    ],
  },
  {
    id: 'sub2',
    task: 'כרמל',
    firstName: 'דנה',
    lastName: 'לוי',
    soldierId: '7654321',
    date: new Date('2024-08-21T08:00:00Z'),
    equipmentStatus: EQUIPMENT_LIST.map((eq) => ({ equipmentId: eq.id, status: 'ok', quantity: eq.quantity, physicalId: eq.physicalId ? 'צ-123456' : undefined, hasPhysicalId: !!eq.physicalId })),
  },
  {
    id: 'sub3',
    task: 'בין ברכיים',
    firstName: 'אבי',
    lastName: 'ישראלי',
    soldierId: '1122334',
    date: new Date('2024-08-21T12:30:00Z'),
    equipmentStatus: [
      { equipmentId: 'vehicle', status: 'issue', comment: 'צמיג קדמי ימני נראה נמוך', quantity: 1, physicalId: 'צ-123456', hasPhysicalId: true },
      { equipmentId: 'radio_prc', status: 'ok', quantity: 2, hasPhysicalId: false },
      { equipmentId: 'radio_vhf', status: 'ok', quantity: 2, hasPhysicalId: false },
      { equipmentId: 'nvg', status: 'ok', quantity: 4, hasPhysicalId: false },
      { equipmentId: 'first_aid', status: 'issue', comment: 'חסרים פלסטרים', quantity: 0, hasPhysicalId: false },
      { equipmentId: 'weapon', status: 'ok', quantity: 4, hasPhysicalId: false },
    ],
  },
   {
    id: 'sub4',
    task: 'סיור',
    firstName: 'יעל',
    lastName: 'שחר',
    soldierId: '4455667',
    date: new Date('2024-08-19T18:00:00Z'),
    equipmentStatus: EQUIPMENT_LIST.map((eq) => ({ equipmentId: eq.id, status: 'ok', quantity: eq.quantity, physicalId: eq.physicalId ? 'צ-123456' : undefined, hasPhysicalId: !!eq.physicalId })),
  },
];
