export type Equipment = {
  id: string;
  name: string;
  description: string;
  quantity: number;
  physicalId?: boolean;
};

export type EquipmentStatus = {
  equipmentId: string;
  status: 'ok' | 'issue';
  quantity: number;
  comment?: string;
  physicalId?: string;
  hasPhysicalId: boolean;
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

export type Attendance = {
  id: string;
  firstName: string;
  lastName: string;
  soldierId: string;
  date: string;
  sleepingOnBase: boolean;
};
