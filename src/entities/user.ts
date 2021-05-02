import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Message } from './message';
import { Category } from './category';
import { Role as UserRole } from '../types/user';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', unique: true, length: 100 })
  email!: string;

  @Column('text')
  displayName!: string;

  @Column('text')
  firstName!: string;

  @Column('text')
  lastName!: string;

  @Column('text')
  password!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.Subscriber,
  })
  role!: UserRole;

  @OneToMany(() => Message, (message) => message.user)
  messages!: Message[];

  @ManyToMany(() => Category, {
    eager: true,
  })
  @JoinTable()
  categories!: Category[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
