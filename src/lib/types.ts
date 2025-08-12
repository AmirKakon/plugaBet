export type Equipment = {
  id: string;
  name: string;
  description: string;
};

export type EquipmentStatus = {
  equipmentId: string;
  status: 'ok' | 'issue';
  comment?: string;
};

export type Submission = {
  id: string;
  soldierName: string;
  rank: string;
  date: Date;
  equipmentStatus: EquipmentStatus[];
};
