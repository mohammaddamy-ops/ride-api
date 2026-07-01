import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

export enum TripStatus {
  LOOKING_FOR_DRIVER = 'looking_for_driver',
  ACCEPTED = 'accepted',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
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
    default: TripStatus.LOOKING_FOR_DRIVER,
  })
  status!: TripStatus;


  @Column({ type: 'float', nullable: true })
  price!: number;

  
  @ManyToOne(() => User)
  passenger!: User;

  @ManyToOne(() => User, { nullable: true })
  driver!: User;
}