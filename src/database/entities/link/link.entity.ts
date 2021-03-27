import {
  Column,
  CreateDateColumn,
  Entity,
  EntityRepository,
  Index,
  PrimaryGeneratedColumn,
  Repository,
  UpdateDateColumn,
} from 'typeorm';

@Entity('link')
export class Link {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column('text')
  url: string;

  @Index({ unique: true })
  @Column('text')
  token: string;

  @Column('int', { default: 0 })
  visits_count: number;

  @CreateDateColumn({ type: 'timestamptz', nullable: true })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', nullable: true })
  updated_at: Date;
}
