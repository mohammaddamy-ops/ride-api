import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Trip } from './trip.entity';
import { User } from 'src/users/user.entity';

export enum TripAction {
  CREATED = 'trip_created',
  ACCEPTED = 'trip_accepted',
  STARTED = 'trip_started',
  COMPLETED = 'trip_completed',
  CANCELLED = 'trip_cancelled',
}

@Entity()
export class TripActivity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Trip, { onDelete: 'CASCADE' })
  trip!: Trip;

  @Column({
    type: 'enum',
    enum: TripAction,
  })
  action!: TripAction;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  performedBy!: User;

  @CreateDateColumn()
  createdAt!: Date;
}