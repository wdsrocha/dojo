import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export class Example {
  input: string;
  output: string;
}

@Entity()
export class Problem {
  @PrimaryGeneratedColumn() id: number;
  @Column() onlineJudgeId: string;
  @Column() remoteProblemId: string;
  @Column() remoteLink: string;
  @Column() title: string;
  @Column() timelimit: string;
  @Column() description: string;
  @Column() input: string;
  @Column() output: string;
  // @OneToMany(() => Example, (example) => example.problem) examples: Example[];
  @Column('simple-array') examples: Example[];
}
