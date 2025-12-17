export type ApplicationStage =
  | 'applied'
  | 'screening'
  | 'phone'
  | 'technical'
  | 'final'
  | 'offer'
  | 'hired'
  | 'rejected';

export interface ApplicationStageHistory {
  stage: ApplicationStage;
  date: string;
  note?: string;
}
