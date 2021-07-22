import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Problem {
  // TODO: make onlineJudgeId and remoteProblemId be the real id
  @PrimaryGeneratedColumn() id: number;
  @Column() onlineJudgeId: string;
  @Column() remoteProblemId: string;
  @Column() remoteLink: string;
  @Column() title: string;
  @Column() timelimit: string;
  @Column() description: string;
  @Column() input: string;
  @Column() output: string;
  @Column('simple-array') inputExamples: string[];
  @Column('simple-array') outputExamples: string[];
}
