import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Trip } from '../trips/trip.entity';
import { Min, Max } from 'class-validator';

export enum RatingStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
}

@Entity()
export class Rating {
  @PrimaryGeneratedColumn()
  id!: number;

  @Min(1)
  @Max(5)
  @Column({ type: 'int' })
  stars!: number;

  @Column({ default: '' })
  comment!: string;

  @Column({
    type: 'enum',
    enum: RatingStatus,
    default: RatingStatus.PENDING,
  })
  status!: RatingStatus;

  @ManyToOne(() => Trip)
  trip!: Trip;

  @ManyToOne(() => User)
  passenger!: User;

  @ManyToOne(() => User)
  driver!: User;
}