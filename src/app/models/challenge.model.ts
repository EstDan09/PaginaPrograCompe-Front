export interface IChallenge {
  _id: string;
  student_id: string;
  cf_code: string;
  is_completed_flag: boolean;
  timestamp: Date;
}