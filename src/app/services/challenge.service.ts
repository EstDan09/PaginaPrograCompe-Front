import { Injectable, signal } from '@angular/core';
import { IChallenge } from '../models/challenge.model';

const MOCK_STUDENT_ID = '694ad2bb08173eb24f81bec2';

@Injectable({
  providedIn: 'root',
})
export class ChallengeService {

  private _challenges = signal<IChallenge[]>([
    {
      _id: '1',
      student_id: MOCK_STUDENT_ID,
      cf_code: 'CF-1200-A',
      is_completed_flag: false,
      timestamp: new Date(),
    },
    {
      _id: '2',
      student_id: MOCK_STUDENT_ID,
      cf_code: 'CF-1300-B',
      is_completed_flag: false,
      timestamp: new Date(),
    },
    {
      _id: '3',
      student_id: MOCK_STUDENT_ID,
      cf_code: 'CF-1400-C',
      is_completed_flag: true,
      timestamp: new Date(),
    },
  ]);

  challenges = this._challenges.asReadonly();

  getByStudentId(studentId: string) {
    return this._challenges().filter(c => c.student_id === studentId);
  }

  markAsCompleted(challengeId: string) {
    this._challenges.update(challenges =>
      challenges.map(c =>
        c._id === challengeId
          ? { ...c, is_completed_flag: true }
          : c
      )
    );
  }
}
