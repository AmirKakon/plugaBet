import type { Submission } from './types';

export const EQUIPMENT_LIST = [
  { id: 'vehicle', name: 'רכב האמר M1151', description: 'בדיקה כללית, דלק, שמן, מים.', defaultQuantity: 1 },
  { id: 'radio_prc', name: 'קשר AN/PRC-152', description: 'סוללה, אנטנה, תקינות כללית.', defaultQuantity: 2 },
  { id: 'radio_vhf', name: 'קשר VHF', description: 'בדיקת תדרים וסוללה.', defaultQuantity: 2 },
  { id: 'nvg', name: 'אמצעי ראיית לילה', description: 'תקינות, סוללות, כיסויים.', defaultQuantity: 4 },
  { id: 'first_aid', name: 'ערכת עזרה ראשונה', description: 'תכולה מלאה, תוקף פריטים.', defaultQuantity: 1 },
  { id: 'weapon', name: 'נשק אישי', description: 'נקי, משומן, תקין.', defaultQuantity: 4 },
];

export const TASKS = ['סיור', 'כרמל', 'בין ברכיים'];

export const RANKS = ['טוראי', 'רב"ט', 'סמל', 'סמ"ר', 'רס"ל'];

export const MOCK_SUBMISSIONS: Submission[] = [
  {
    id: 'sub1',
    task: 'סיור',
    firstName: 'משה',
    lastName: 'כהן',
    soldierId: '1234567',
    date: new Date(new Date().setDate(new Date().getDate() - 1)),
    equipmentStatus: [
      { equipmentId: 'vehicle', status: 'ok', quantity: 1 },
      { equipmentId: 'radio_prc', status: 'ok', quantity: 2 },
      { equipmentId: 'radio_vhf', status: 'issue', comment: 'סוללה חלשה', quantity: 1 },
      { equipmentId: 'nvg', status: 'ok', quantity: 4 },
      { equipmentId: 'first_aid', status: 'ok', quantity: 1 },
      { equipmentId: 'weapon', status: 'ok', quantity: 4 },
    ],
  },
  {
    id: 'sub2',
    task: 'כרמל',
    firstName: 'דנה',
    lastName: 'לוי',
    soldierId: '7654321',
    date: new Date(new Date().setHours(new Date().getHours() - 6)),
    equipmentStatus: EQUIPMENT_LIST.map((eq) => ({ equipmentId: eq.id, status: 'ok', quantity: eq.defaultQuantity })),
  },
  {
    id: 'sub3',
    task: 'בין ברכיים',
    firstName: 'אבי',
    lastName: 'ישראלי',
    soldierId: '1122334',
    date: new Date(new Date().setHours(new Date().getHours() - 2)),
    equipmentStatus: [
      { equipmentId: 'vehicle', status: 'issue', comment: 'צמיג קדמי ימני נראה נמוך', quantity: 1 },
      { equipmentId: 'radio_prc', status: 'ok', quantity: 2 },
      { equipmentId: 'radio_vhf', status: 'ok', quantity: 2 },
      { equipmentId: 'nvg', status: 'ok', quantity: 4 },
      { equipmentId: 'first_aid', status: 'issue', comment: 'חסרים פלסטרים', quantity: 0 },
      { equipmentId: 'weapon', status: 'ok', quantity: 4 },
    ],
  },
   {
    id: 'sub4',
    task: 'סיור',
    firstName: 'יעל',
    lastName: 'שחר',
    soldierId: '4455667',
    date: new Date(new Date().setDate(new Date().getDate() - 2)),
    equipmentStatus: EQUIPMENT_LIST.map((eq) => ({ equipmentId: eq.id, status: 'ok', quantity: eq.defaultQuantity })),
  },
];
