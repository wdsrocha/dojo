import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum Verdict {
  PENDING = 'Pending',
  ACCEPTED = 'Accepted',
  COMPILATION_ERROR = 'Compilation error',
  TIME_LIMIT_EXCEEDED = 'Time limit exceeded',
  PRESENTATION_ERROR = 'Presentation error',
  WRONG_ANSWER = 'Wrong answer',
  MEMORY_LIMIT_EXCEEDED = 'Memory limit exceeded',
}

@Entity()
export class Submission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  onlineJudgeId: string;

  @Column()
  remoteSubmissionId: string;

  @Column()
  remoteProblemId: string;

  @Column()
  remoteLanguageId: string;

  @Column()
  code: string;

  @Column({ type: 'enum', enum: Verdict, default: Verdict.PENDING })
  verdict: Verdict;

  @Column({ type: 'timestamp' })
  createdDate: Date;
}
