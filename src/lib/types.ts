
export type Equipment = {
  id: string;
  name: string;
  description: string;
  quantity: number;
  physicalId?: boolean;
};

export type EquipmentStatus = {
  equipmentId: number;
  name: string;
  quantity: number;
  status: 'exists' | 'missing';
  comment?: string;
};

export type Submission = {
  id: string;
  task: string;
  firstName: string;
  lastName: string;
  soldierId: string;
  date: string; // ISO date string from backend
  equipmentStatus: EquipmentStatus[];
};

export type Task = {
    id: string;
    name: string;
    items: Equipment[];
}
