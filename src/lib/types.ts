export type Equipment = {
  id: string;
  name: string;
  description: string;
  defaultQuantity: number;
};

export type EquipmentStatus = {
  equipmentId: string;
  status: 'ok' | 'issue';
  quantity: number;
  comment?: string;
};

export type Submission = {
  id: string;
  firstName: string;
  lastName: string;
  soldierId: string;
  date: Date;
  equipmentStatus: EquipmentStatus[];
};
