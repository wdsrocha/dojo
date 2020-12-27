import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '../users/users.entity';

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
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public onlineJudgeId: string;

  @Column()
  public remoteSubmissionId: string;

  @Column()
  public remoteProblemId: string;

  @Column()
  public remoteLanguageId: string;

  @Column()
  public code: string;

  @Column({ type: 'enum', enum: Verdict, default: Verdict.PENDING })
  public verdict: Verdict;

  @Column({ type: 'timestamp' })
  public createdDate: Date;

  @ManyToOne(() => User, (author: User) => author.submissions)
  public author: User;
}
