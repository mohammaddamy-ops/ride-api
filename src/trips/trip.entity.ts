import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

export enum TripStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  COMPLETED = 'completed',
}

@Entity()
export class Trip {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  startLocation!: string;

  @Column()
  endLocation!: string;

  @Column({
    type: 'enum',
    enum: TripStatus,
    default: TripStatus.PENDING,
  })
  status!: TripStatus;

  @ManyToOne(() => User)
  passenger!: User;

  @ManyToOne(() => User, { nullable: true })
  driver!: User;
}