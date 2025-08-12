import type { Submission } from './types';

export const EQUIPMENT_LIST = [
  { id: 'vehicle', name: 'רכב האמר M1151', description: 'בדיקה כללית, דלק, שמן, מים.' },
  { id: 'radio_prc', name: 'קשר AN/PRC-152', description: 'סוללה, אנטנה, תקינות כללית.' },
  { id: 'radio_vhf', name: 'קשר VHF', description: 'בדיקת תדרים וסוללה.' },
  { id: 'nvg', name: 'אמצעי ראיית לילה', description: 'תקינות, סוללות, כיסויים.' },
  { id: 'first_aid', name: 'ערכת עזרה ראשונה', description: 'תכולה מלאה, תוקף פריטים.' },
  { id: 'weapon', name: 'נשק אישי', description: 'נקי, משומן, תקין.' },
];

export const RANKS = ['טוראי', 'רב"ט', 'סמל', 'סמ"ר', 'רס"ל'];

export const MOCK_SUBMISSIONS: Submission[] = [
  {
    id: 'sub1',
    soldierName: 'משה כהן',
    rank: 'סמל',
    date: new Date(new Date().setDate(new Date().getDate() - 1)),
    equipmentStatus: [
      { equipmentId: 'vehicle', status: 'ok' },
      { equipmentId: 'radio_prc', status: 'ok' },
      { equipmentId: 'radio_vhf', status: 'issue', comment: 'סוללה חלשה' },
      { equipmentId: 'nvg', status: 'ok' },
      { equipmentId: 'first_aid', status: 'ok' },
      { equipmentId: 'weapon', status: 'ok' },
    ],
  },
  {
    id: 'sub2',
    soldierName: 'דנה לוי',
    rank: 'רב"ט',
    date: new Date(new Date().setHours(new Date().getHours() - 6)),
    equipmentStatus: EQUIPMENT_LIST.map((eq) => ({ equipmentId: eq.id, status: 'ok' })),
  },
  {
    id: 'sub3',
    soldierName: 'אבי ישראלי',
    rank: 'סמ"ר',
    date: new Date(new Date().setHours(new Date().getHours() - 2)),
    equipmentStatus: [
      { equipmentId: 'vehicle', status: 'issue', comment: 'צמיג קדמי ימני נראה נמוך' },
      { equipmentId: 'radio_prc', status: 'ok' },
      { equipmentId: 'radio_vhf', status: 'ok' },
      { equipmentId: 'nvg', status: 'ok' },
      { equipmentId: 'first_aid', status: 'issue', comment: 'חסרים פלסטרים' },
      { equipmentId: 'weapon', status: 'ok' },
    ],
  },
   {
    id: 'sub4',
    soldierName: 'יעל שחר',
    rank: 'סמל',
    date: new Date(new Date().setDate(new Date().getDate() - 2)),
    equipmentStatus: EQUIPMENT_LIST.map((eq) => ({ equipmentId: eq.id, status: 'ok' })),
  },
];
