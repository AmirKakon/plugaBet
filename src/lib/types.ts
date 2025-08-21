export type Equipment = {
  id: string;
  name: string;
  description: string;
  quantity: number;
  physicalId?: string;
};

export type EquipmentStatus = {
  equipmentId: string;
  status: 'ok' | 'issue';
  quantity: number;
  comment?: string;
  physicalId?: string;
};

export type Submission = {
  id: string;
  task: string;
  firstName: string;
  lastName: string;
  soldierId: string;
  date: Date;
  equipmentStatus: EquipmentStatus[];
};

export type Task = {
    id: string;
    name: string;
    items: Equipment[];
}
