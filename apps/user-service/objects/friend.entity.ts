import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('friends')
export class FriendEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  friendId: number;

  @ManyToOne(() => UserEntity, user => user.friends)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
