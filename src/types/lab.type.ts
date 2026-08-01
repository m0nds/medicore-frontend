export type LabUrgency = "ROUTINE" | "URGENT" | "STAT";

export type LabOrderStatus = "PENDING" | "COMPLETED" | "CANCELLED";

export interface LabOrder {
  id: string;
  medicalRecordId: string;
  patientId: string;
  doctorId: string;
  testName: string;
  urgency: LabUrgency;
  status: LabOrderStatus;
  instructions: string | null;
  labResult: LabResult;
  createdAt: string;
  updatedAt: string;
}

export interface LabOrderPayload {
  medicalRecordId: string;
  testName: string;
  urgency?: LabUrgency;
  instructions?: string | null;
}

export interface LabResult {
  id: string;
  labOrderId: string;
  resultData: string;
  normalRange: string | null;
  interpretation: string | null;
  performedAt: string;
  performedBy: string | null;
  fileId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LabResultPayload {
  resultData: string;
  normalRange?: string;
  interpretation: string;
  performedAt: string;
  performedBy?: string;
}
