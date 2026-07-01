import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  DRIVER = 'driver',
  PASSENGER = 'passenger',
}

export enum DriverStatus{
OFFLINE = 'offline',
  ONLINE = 'online',
  IN_TRIP = 'in_trip',

}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.PASSENGER,
  })
  role!: UserRole;

  @Column({ type: 'float', default: 0 })
  averageRating!: number; 


  @Column({

    type: 'enum',
    enum : DriverStatus,
    default :DriverStatus.OFFLINE,
    nullable: true,
  })
  driverStatus!: DriverStatus;
}