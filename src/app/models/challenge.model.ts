export interface IChallenge {
  _id: string;
  student_id: string;
  cf_code: string;
  is_completed_flag: boolean;
  completion_type?: string;
  createdAt?: string;   
  updatedAt?: string; 
}

export interface IAskChallengeResponse {
  cf_code: string;
  name: string;
  rating: number;
  contestId: number;
  tags: string[];
}