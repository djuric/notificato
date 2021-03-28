import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  name!: string;

  @Column('text')
  description!: string;

  @ManyToOne(() => Category, (category) => category.children)
  parent!: Category;

  @OneToMany(() => Category, (category) => category.parent)
  children!: Category[];
}
