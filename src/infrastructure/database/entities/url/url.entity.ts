import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from '@infrastructure/database/entities/user/user.entity';

@Entity('url')
export class UrlEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 6, unique: true })
    @Index({ unique: true })
    shortCode: string;

    @Column()
    originalUrl: string;

    @Column({ default: 0 })
    accessCount: number;

    @Column({ nullable: true })
    userId: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    deletedAt?: Date;

    @ManyToOne(() => UserEntity, (user) => user.urls)
    @JoinColumn({ name: 'userId' })
    user: UserEntity;
}
