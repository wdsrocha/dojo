import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Submission } from '../submissions/submissions.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column({ unique: true })
  public email: string;

  @Column()
  public username: string;

  @Column()
  @Exclude()
  public password: string;

  @OneToMany(() => Submission, (submission: Submission) => submission.author)
  public submissions: Submission[];
}
